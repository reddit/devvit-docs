# Migrating with AI

Use an AI assistant to help port a PRAW app to Devvit Web, but keep the migration review-driven. The assistant should inspect the PRAW app first, explain its migration plan, call out gaps, and migrate one behavior at a time. You should review the generated code and test the migrated app thoroughly.

This guide focuses on the AI-assisted workflow. For the API-by-API mapping, use [Migration Basics](./basics.md#migration-basics).

## Ground rules

Give the assistant these constraints before it edits code:

- Treat `app-to-migrate/` as read-only reference material.
- Make required changes in the Devvit app, not in the copied PRAW source.
- Use `@devvit/web`; do not migrate to `@devvit/public-api`.
- Explain why each major PRAW pattern maps to a Devvit capability.
- Verify nontrivial Reddit API mappings against PRAW behavior and Devvit docs before coding.
- Do not ask for secrets in chat and do not commit secrets, OAuth tokens, `.env` values, or developer credentials.
- Keep a gap list for behavior that cannot be migrated directly.

## 1. Prepare the target app

Start with a clean Devvit Web app from the [app quickstart](../../../quickstart/quickstart.md) or [mod tool quickstart](../../../quickstart/quickstart-mod-tool.md). If the PRAW app is primarily a moderator tool, use the patterns in [Build a Mod Tool - Three Strikes](../../../examples/tutorials/mod-tool.md).

If you want to keep the old app name, use a placeholder Devvit app name during migration and test the app first. Handle name migration later with the Devvit team through [Discord](https://developers.reddit.com/discord).

Copy the PRAW app into `app-to-migrate/` at the Devvit project root, add that folder to `.gitignore`, and commit the Devvit project before AI edits anything. Copy the source app; do not move the only working copy.

If your coding assistant supports docs or repo skills, enable Devvit docs and PRAW docs before migration. The assistant will need both sides of the API behavior to make accurate replacements.

## 2. Make the AI inspect first

Do not start with "convert this app." Start with an inventory pass that produces a plan but does not edit files.

```text
Migrate the PRAW app in app-to-migrate/ to Devvit Web.

Rules:
- Treat app-to-migrate/ as read-only reference material.
- Use @devvit/web only; do not use @devvit/public-api.
- Do not edit files yet.
- Inspect devvit.json, package.json, src/, and app-to-migrate/.

Report:
- PRAW entrypoints and startup commands
- Reddit API calls and object methods
- subreddit.stream, mod.stream, polling, cron, and while True loops
- local storage, SQL, files, pickle, JSON state, and cache usage
- environment variables, secrets, OAuth credentials, and app config
- external HTTP domains and webhook integrations
- CLI, admin, moderator, and maintenance flows
- dependencies that are Python-only, native, or not portable to Devvit
- tests, manual test cases, and untested behavior
- direct Devvit mappings, risky mappings, and unsupported gaps

For each nontrivial PRAW API replacement, cite the PRAW behavior and the
Devvit API or capability you plan to use.
```

Review the report before allowing edits. A useful report should name the files and functions that own each behavior, the Devvit surface that will replace it, and any behavior that needs a product decision instead of a direct port.

## 3. Turn the report into a migration plan

Ask the assistant to produce a small migration plan from the inventory. The plan should use existing Devvit docs instead of restating setup steps.

| PRAW pattern | Devvit decision |
|--------------|-----------------|
| `praw.Reddit(...)`, OAuth setup, bot tokens | Remove token handling and configure Reddit permissions in `devvit.json`. |
| `subreddit.stream.*`, `mod.stream.*`, incoming webhooks | Use [triggers](../../../capabilities/server/triggers.mdx) or declared [external endpoints](../../../capabilities/server/external-endpoints.mdx). |
| `while True`, `time.sleep`, cron, pollers | Use [scheduler](../../../capabilities/server/scheduler.mdx) jobs with bounded batches. |
| SQLite, JSON files, pickle, local disk | Use [Redis](../../../capabilities/server/redis.mdx), [Blob Storage](../../../capabilities/server/blob-storage.mdx), or an external service. |
| `.env`, `os.getenv`, process config | Use [Settings & Secrets](../../../capabilities/server/settings-and-secrets.mdx). |
| `requests` or `aiohttp` | Use server-side [HTTP Fetch](../../../capabilities/server/http-fetch.mdx) with explicit domains. |
| CLI admin commands | Use moderator [menu actions](../../../capabilities/client/menu-actions.mdx), [forms](../../../capabilities/client/forms.mdx), or settings. |
| Repeated reads of public Reddit or third-party data | Use [Cache Helper](../../../capabilities/server/cache-helper.md) when shared short-term caching is appropriate. |
| Local logs, shell access, Sentry, Datadog | Use `console.log`, `console.info`, `console.error`, and [Logs and Debugging](../../tools/logs.md). |
| Local bot process tests | Use [@devvit/test](../../tools/devvit_test.mdx) plus mocks for unsupported APIs and third-party fetch calls. |

Do not approve a broad rewrite until the plan covers `devvit.json`, storage, secrets, external domains, tests, and every PRAW entrypoint.

## 4. Configure capabilities before business logic

Have the assistant configure the Devvit app shape before it ports behavior. This makes the migration easier to review because each endpoint, trigger, scheduled job, setting, and permission has an explicit home.

```text
Update only the Devvit app configuration and endpoint skeletons.

Configure the minimum required:
- permissions.reddit
- permissions.http.domains
- triggers
- scheduler jobs
- menu actions and forms
- settings and secrets definitions
- storage-related imports or wrappers
- server endpoints

Do not port business logic yet.
Do not add secret values.
Explain why each capability is needed.
```

Set secret values yourself by following [Settings & Secrets](../../../capabilities/server/settings-and-secrets.mdx). If settings or secrets need to be registered before testing, use the normal [Devvit CLI](../../tools/devvit_cli.mdx) upload flow.

Request HTTP domain approval early when the PRAW app calls third-party services. Keep the allow-list to exact hostnames the app needs.

## 5. Migrate one behavior slice at a time

A behavior slice is one complete workflow, such as "remove comments containing a banned phrase," "post a weekly thread," "sync modmail labels," or "show a moderator form and save the result." Migrating by slice keeps the AI from mixing unrelated changes and makes review practical.

Use a prompt like this for each slice:

```text
Migrate only this behavior: <describe one PRAW workflow>.

Use the inventory and migration plan.
Keep app-to-migrate/ read-only.
Use @devvit/web only.
Prefer the smallest Devvit implementation that preserves behavior.
Update tests for this behavior.
After editing, summarize:
- files changed
- PRAW behavior replaced
- Devvit APIs and capabilities used
- behavior intentionally changed
- tests added or updated
- remaining gaps
```

After each slice, review the diff, run the relevant tests, and update the gap list. If the assistant finds a new gap, make a decision before it writes a workaround.

## 6. Watch for Devvit-specific design changes

Some PRAW patterns should not be ported literally:

| Pattern to flag | What to do instead |
|-----------------|--------------------|
| One bot process serving many subreddits with shared local state | Design for subreddit-scoped installations. Use an external service through HTTP Fetch when you need cross-community state. |
| Infinite streams, daemons, open sockets, or background workers | Use triggers for Reddit events and scheduler jobs for periodic work. Save progress in Redis for batch jobs. |
| Large migrations, cleanup jobs, or historical backfills | Process bounded batches, store a cursor or progress marker, and schedule follow-up work. |
| SQL schemas copied directly into Redis | Redesign around the state the Devvit app actually needs. Use Redis for hot state, Blob Storage for larger records, or an external service for relational data. |
| Iterating over every Redis key later | Track key names in known collection keys. Do not rely on discovering all keys later with a global scan. |
| Large Redis payloads or permanent histories | Use TTLs, bounded histories, Blob Storage, or `redisCompressed` where appropriate. |
| OAuth refresh, praw.ini, client secrets, bot passwords | Remove them. Devvit provides platform-managed Reddit access through app installation and permissions. |
| `process.env` or `os.getenv` for runtime config | Define settings and secrets, then read them from the Devvit server. |
| Python-only libraries, native packages, or local binaries | Replace them with TypeScript packages that work in Devvit, or move that work to an external service. |
| Admin work performed through a terminal | Build moderator-only menu actions, forms, settings, or maintenance endpoints. |
| Private user data such as saved posts, upvoted posts, friends, or user subreddit lists | Redesign around public Reddit data or explicit user actions. |
| Existing production data import or app-name migration | Plan it with the Devvit team through [Discord](https://developers.reddit.com/discord). |

Make the assistant explain these choices in the migration summary. The goal is not just converted code; it is a Devvit app that fits the platform.

## 7. Test the migrated behavior

Ask the assistant to add tests while it migrates each slice, not after the entire app has been rewritten.

Prioritize tests for:

- trigger handlers and event payload parsing
- scheduler jobs, batching, cursors, and retry behavior
- menu actions, forms, and validation
- Redis reads and writes
- settings and secrets reads
- Reddit API calls and `runAs` choices
- third-party fetch success and failure paths
- idempotency for events that may be retried
- unsupported behavior that should fail clearly

Use [@devvit/test](../../tools/devvit_test.mdx) for backend behavior. Mock third-party fetch calls and any Reddit API methods that are not available in the test harness.

## 8. Re-review against the PRAW app

When the assistant says the migration is complete, make it perform a second inventory pass against `app-to-migrate/`.

```text
Re-review app-to-migrate/ against the migrated Devvit app.

Do not edit files yet.
List every PRAW entrypoint, command, stream handler, scheduled job, data write,
moderation action, external API call, setting, and secret.

For each item, mark one:
- migrated
- intentionally changed
- unsupported with accepted gap
- missed and still needs work
```

If anything is missed, migrate another slice and repeat the review. Do not call the migration complete because the app builds; call it complete when every original workflow is migrated or explicitly accepted as a gap.

## 9. Playtest and launch

Use [Playtest](../../tools/playtest.md) in a test subreddit and exercise the migrated workflows with real posts, comments, moderator actions, settings, and scheduled jobs. Use [Logs and Debugging](../../tools/logs.md) to inspect failures.

Before launch, check:

- `app-to-migrate/` was not modified.
- The migrated code imports from `@devvit/web` packages, not `@devvit/public-api`.
- No secrets, OAuth tokens, `.env` values, or developer credentials are in code, docs, tests, or chat transcripts.
- `devvit.json` declares every required Reddit, HTTP, trigger, scheduler, menu, form, setting, secret, endpoint, and storage capability.
- Redis keys that need later iteration are tracked through known collection keys.
- Long-running work is batched and resumable.
- External domains and external endpoints are documented.
- Tests cover the migrated business logic and failure paths.
- Manual playtest coverage includes Reddit UI flows that tests cannot cover.
- Remaining gaps have an explicit owner and path forward.

When the app is ready for review, follow the [launch guide](../../launch/launch-guide.md).
