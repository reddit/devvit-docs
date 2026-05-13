# Plugin RPC resilience

Devvit's server runtime exposes Reddit, Redis, settings, scheduler, and other
capabilities through a single underlying plugin RPC (gRPC) layer. In normal
operation a call like `await settings.get('openaiApiKey')` or
`await redis.get(key)` returns the expected value. Occasionally — during
platform incidents, runtime upgrades, or undocumented configurations — that
layer is unreachable and every call throws an opaque error of the shape:

```text
Error: undefined undefined: undefined
    at callErrorFromStatus (/srv/index.cjs:…)
    at GenericPluginClient.<Method> (/srv/index.cjs:…)
    at GrpcWrapper.request (/srv/index.cjs:…)
{
  code: undefined,
  details: undefined,
  metadata: _Metadata { internalRepr: Map(0) {} }
}
```

The empty `Map(0)` metadata is the give-away: the gRPC sidecar returned a
trailer-less envelope.

When this happens in an _unwrapped_ handler, the whole request 500s and the
user sees nothing — the toast that would explain the failure never reaches the
client. This page describes the defensive pattern that keeps an app
demonstrable in that state.

## The pattern: wrap every plugin call

Treat every call into `settings`, `redis`, `reddit`, `scheduler`, and `cache`
as if it can throw. Catch it, log the shape (not the value) of the error, and
fall back to a safe default or an informative toast. Never let an opaque
plugin throw propagate out of your handler.

```ts title="src/server/diag.ts"
export function describeErr(err: unknown): Record<string, unknown> {
  if (err == null) return { value: err };
  if (typeof err !== 'object') return { type: typeof err, value: String(err) };
  const e = err as Record<string, unknown> & { stack?: string };
  return {
    name: (e as { name?: unknown }).name,
    code: (e as { code?: unknown }).code,
    message: (e as { message?: unknown }).message,
    stack: typeof e.stack === 'string' ? e.stack.split('\n').slice(0, 6).join('\n') : undefined,
    keys: Object.getOwnPropertyNames(err as object),
  };
}
```

`describeErr` is the unit of observability. Without it, `console.warn(err)`
collapses the opaque envelope to the literal string `"undefined undefined:
undefined"` and you can't tell which call failed.

## Layer-by-layer fallbacks

### Settings (BYOK pattern)

When the global key is required and an optional BYOK override is also
configured, treat the BYOK lookup as best-effort and only treat the global
lookup's failure as fatal. Skip the global lookup entirely when BYOK is
present.

```ts
let subKey = '';
try {
  subKey = ((await settings.get('myappBYOKKey')) as string) ?? '';
} catch (err) {
  // Optional override; non-fatal. Continue to the global key path.
  console.warn('[myapp] settings.get(BYOK) threw — continuing without override:', describeErr(err));
}

let apiKey = subKey.trim();
let settingsRpcDown = false;
if (!apiKey) {
  try {
    apiKey = (((await settings.get('myappGlobalKey')) as string) ?? '').trim();
  } catch (err) {
    settingsRpcDown = true;
    console.warn('[myapp] settings.get(globalKey) threw:', describeErr(err));
  }
}

if (!apiKey) {
  throw new Error(settingsRpcDown ? 'no_key_plugin_rpc' : 'no_key');
}
```

Distinguish "the plugin RPC layer is down" from "the developer didn't set the
secret yet" — the user-facing toast will differ, and so will the
moderator's next action.

### Redis (best-effort persistence)

For read paths, default to "no cached state" on throw and let the rest of
the handler proceed. For write paths, log and continue — the user has already
done the work and shouldn't see a 500 because we couldn't persist.

```ts
let bundle: RuleBundleType | null = null;
try {
  bundle = JSON.parse(((await redis.get('rules:active')) ?? 'null'));
} catch (err) {
  console.warn('[myapp] redis.get(rules) threw — falling back to empty bundle:', describeErr(err));
}

// … work with bundle …

try {
  await redis.set('rules:active', JSON.stringify(bundle));
} catch (err) {
  console.warn('[myapp] redis.set(rules) threw — state not persisted:', describeErr(err));
}
```

### Reddit (gateway-trust fallback for mod checks)

A common mod-tool pattern is to enumerate `reddit.getModerators(...)` and
check the caller against the list. When both `redis.get(modlist)` (cache)
and `reddit.getModerators(...)` (source-of-truth) throw, the menu would be
unusable. The gateway has already filtered the request by the menu item's
`forUserType: "moderator"` declaration, so trust that as a fallback:

```ts
if (!mods) {
  if (!redisOk && !redditOk) {
    console.warn(
      `[myapp] plugin RPC unreachable for both redis and reddit — ` +
      `falling back to gateway-side forUserType:"moderator" filter; trusting ${username}`,
    );
    return true;
  }
  return false;
}
```

This is defensible because Devvit's gateway never routes a `forUserType:
"moderator"` menu click to your handler unless the caller actually is a
moderator. The mod-list check in your handler is defense-in-depth.

### Scheduler tasks (return 200, retry-friendly)

Schedulers retry on 500. If your handler 500s every tick because of a plugin
RPC failure, you'll flood `npx devvit logs` and waste retry budget. Wrap and
return 200 so the gateway moves on; the next tick will try again.

```ts
app.post('/internal/scheduler/audit-retention', async (c) => {
  await c.req.json<TaskRequest>();
  try {
    // … plugin work …
  } catch (err) {
    console.warn('[myapp] scheduler/audit-retention: plugin RPC failed:', describeErr(err));
  }
  return c.json<TaskResponse>({ status: 'ok' });
});
```

## Surface the failure to the user

When the work _can't_ proceed (e.g. the OpenAI key is unreachable so the
compile cannot run), return an _explanatory_ toast rather than a generic
"Try again in a minute" message. The moderator should understand whether
the failure is theirs (no key configured) or the platform's (Devvit
settings RPC down).

```ts
const msg = String((err as Error)?.message ?? err);
let userMsg: string;
if (msg === 'no_key_plugin_rpc') {
  userMsg =
    'Devvit settings/plugin RPC is unavailable in this runtime. ' +
    'Could not read the OpenAI key, so the compile cannot run. ' +
    'The same flow will produce the dry-run preview once the platform recovers.';
} else if (msg === 'no_key') {
  userMsg = 'No OpenAI API key configured. Run `npx devvit settings set openaiApiKey` and try again.';
} else {
  userMsg = 'Compiler offline. Try again in a minute.';
}
return c.json<UiResponse>({ showToast: { text: userMsg, appearance: 'neutral' } });
```

## Local-only escape hatches

For local playtest only, two env-var gates can keep the compose flow runnable
when plugin RPC is unreachable. Both must default off so they never affect
production behaviour (Devvit's Reddit runtime never sets them).

```ts
// 1. Mock AI provider — bypasses settings AND fetch entirely.
if (process.env.MYAPP_AI_PROVIDER === 'mock') {
  return { json: makeDeterministicFakeResponse(input), tokensIn: 0, tokensOut: 0 };
}

// 2. Local env-var fallback for the API key — gated on an explicit flag.
if (!apiKey && process.env.MYAPP_LOCAL_FALLBACK === '1') {
  apiKey = (process.env.OPENAI_API_KEY ?? '').trim();
}
```

Document both in your `.env.example` with a "local playtest only, not
deployed runtime" comment so contributors don't accidentally ship a build
with these enabled.

## Related issues

The platform-side patterns described above were validated against these
open Devvit GitHub issues that share the empty-gRPC-envelope signature:

- [reddit/devvit#258](https://github.com/reddit/devvit/issues/258) — `reddit.submitCustomPost()` / `submitPost()` fail with the same `undefined undefined: undefined` shape on playtest.
- [reddit/devvit#259](https://github.com/reddit/devvit/issues/259) — `scheduler.runJob()` returns a UUID but `listJobs()` is empty and the registered job never executes; same gRPC layer.
- [reddit/devvit#261](https://github.com/reddit/devvit/issues/261) — `settings.get` / `redis.get,zRange` / `reddit.getModerators` all throw the empty envelope from the same handler. Confirms the failure is plugin-RPC-wide, not per-client.

## Summary

| Layer | On throw | Why |
|---|---|---|
| `settings.get(optional)` | Warning, continue | Optional override; mustn't block the required global key. |
| `settings.get(required)` | Throw `no_key_plugin_rpc` | Distinguishes platform-side from "not configured". |
| `redis.get` | Warn + default | Treat as cold cache; let the handler compute fresh state. |
| `redis.set` | Warn + continue | The user's action already happened; don't 500 because persistence failed. |
| `redis.zRange` (audit) | Warn + empty list | Audit dashboard renders an explanatory banner instead of crashing. |
| `reddit.getModerators` | Trust gateway-side `forUserType:"moderator"` filter | Defense-in-depth; gateway is the security boundary. |
| `scheduler.runJob` | Warn + continue | Best-effort enqueue; the rule is still compiled, just no preview. |
| Inbound scheduler tick | Warn + return 200 | Don't flood the gateway with retried 500s. |

This pattern keeps menus and forms usable when the plugin RPC layer is
unavailable, lets schedulers stop looping on failures, and gives moderators
a clear explanation of what's happening instead of a silent blank-screen.
