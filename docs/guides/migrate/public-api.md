# Migrating from PRAW to Devvit Web

[Devvit Web](../../capabilities/devvit-web/devvit_web_overview.mdx) is how
you ship the same kind of automation **on Reddit’s platform**. This guide will outline the basics of migrating from PRAW to Devvit Web.

:::note
This guide assumes you have basic familiarity with Python and PRAW (e.g., `pip`, `requirements.txt`, and
`praw.Reddit(...)`). The sections below focus on what changes on Devvit.
:::

This guide is a **PRAW → Devvit** mapping: same workflows, different runtime. For Devvit setup, start with
the [app quickstart](../../quickstart/quickstart.md) or [mod tool quickstart](../../quickstart/quickstart-mod-tool.md).

| Topic                   | Devvit                                                                          |
|-------------------------|---------------------------------------------------------------------------------|
| Architecture and limits | [Devvit Web overview](../../capabilities/devvit-web/devvit_web_overview.mdx)    |
| `devvit.json`           | [Configure your app](../../capabilities/devvit-web/devvit_web_configuration.md) |

---

## 1. Project layout and auth

| PRAW                           | Devvit                                                                                                                                        |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `pip` / `requirements.txt`     | `npm` / [`package.json`](https://docs.npmjs.com/cli/configuring-npm/package-json)                                                             |
| `praw.Reddit(...)` + env       | [`devvit.json`](../../capabilities/devvit-web/devvit_web_configuration.md) + [`permissions.reddit`](../../capabilities/server/reddit-api.mdx) |
| `python bot.py` on your server | `npm run dev` (playtest on Reddit); handlers are HTTP routes, not a forever loop                                                              |

**Devvit (typical new project)**

```bash
npm install && npm run dev
```

```json title="devvit.json (excerpt)"
{
  "name": "my-app",
  "server": {
    "entry": "dist/server/index.cjs"
  },
  "permissions": {
    "reddit": true
  },
  "triggers": {
    "onAppInstall": "/internal/triggers/on-app-install"
  }
}
```

```ts title="src/server/index.ts (excerpt)"
import { Hono } from "hono";
import type { TriggerResponse } from "@devvit/web/shared";

const app = new Hono();

app.post("/internal/triggers/on-app-install", async (c) => {
  return c.json<TriggerResponse>({ status: "ok" });
});

export default app;
```

---

## 2. `praw.Reddit` → `reddit` and `context`

| PRAW                                                                     | Devvit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|--------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `reddit.subreddit(...)`, `reddit.comment(...)`, `reddit.submission(...)` | Import **`reddit`** from `@devvit/web/server`. Load: [`getSubredditInfoByName`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#getsubredditinfobyname), [`getCurrentSubreddit`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#getcurrentsubreddit), [`getCommentById`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#getcommentbyid), [`getPostById`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#getpostbyid). Submit: [`submitPost`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#submitpost), [`submitComment`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#submitcomment). See [`RedditAPIClient`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md). |
| Hard-coded subreddit / “current” thing from your script                  | **`context`** from `@devvit/web/server` — [`subredditName`](../../api/public-api/type-aliases/BaseContext.md#subredditname), [`subredditId`](../../api/public-api/type-aliases/BaseContext.md#subredditid), [`postId`](../../api/public-api/type-aliases/BaseContext.md#postid), [`commentId`](../../api/public-api/type-aliases/BaseContext.md#commentid) (menu/form/post surfaces), [`postData`](../../api/public-api/type-aliases/BaseContext.md#postdata). See [`BaseContext`](../../api/public-api/type-aliases/BaseContext.md).                                                                                                                                                                                                                                             |
| Thing id from a menu or form action                                      | [`context.commentId`](../../api/public-api/type-aliases/BaseContext.md#commentid), [`context.postId`](../../api/public-api/type-aliases/BaseContext.md#postid) — [mod tool quickstart](../../quickstart/quickstart-mod-tool.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Subreddit secrets / config in your script                                | Import [`settings`](../../capabilities/server/settings-and-secrets.mdx) from `@devvit/web/server` (`settings.get(...)`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Event payload from a stream or webhook                                   | `await c.req.json<OnCommentCreateRequest>()` (and similar types from `@devvit/web/shared`) — [Triggers](../../capabilities/server/triggers.mdx) (see [Streams → triggers](#3-streams--triggers) below)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

**PRAW**

```python
for comment in reddit.subreddit("learnpython").stream.comments(skip_existing=True):
    print(comment.author, comment.body)
```

**Devvit** — declare a trigger in `devvit.json`, then handle the event (same idea
as [Streams → triggers](#3-streams--triggers) below):

```json title="devvit.json (excerpt)"
{
  "triggers": {
    "onCommentCreate": "/internal/triggers/on-comment-create"
  }
}
```

```ts title="src/server/index.ts"
import { Hono } from "hono";
import { context } from "@devvit/web/server";
import type { OnCommentCreateRequest, TriggerResponse } from "@devvit/web/shared";

const app = new Hono();

app.post("/internal/triggers/on-comment-create", async (c) => {
  const { subredditName } = context;
  const input = await c.req.json<OnCommentCreateRequest>();
  const commentId = input.comment?.id;
  const postId = input.comment?.postId;
  if (subredditName && commentId) {
    console.log(`r/${subredditName} new comment (${commentId}) on ${postId}: ${input.comment?.body}`);
  }
  return c.json<TriggerResponse>({ status: "ok" });
});

export default app;
```

---

## 3. Streams → triggers

Your [`subreddit.stream`](https://praw.readthedocs.io/en/stable/code_overview/other/subredditstream.html) / [
`mod.stream`](https://praw.readthedocs.io/en/stable/code_overview/other/subredditmoderationstream.html) loops do not
have a direct Devvit equivalent. Declare [**triggers**](../../capabilities/server/triggers.mdx) in `devvit.json`; Reddit
POSTs one event per handler invocation (`onCommentSubmit`, `onPostCreate`, `onModAction`, `onModMail`, …).

**PRAW**

```python
for comment in reddit.subreddit("your_sub").stream.comments(skip_existing=True):
    if "spam phrase" in (comment.body or "").lower():
        comment.mod.remove(spam=True)
```

**Devvit**

```json title="devvit.json"
{
  "triggers": {
    "onCommentSubmit": "/internal/triggers/on-comment-submit"
  }
}
```

```ts title="src/server/index.ts"
import { Hono } from "hono";
import { reddit } from "@devvit/web/server";
import type { OnCommentSubmitRequest, TriggerResponse } from "@devvit/web/shared";

const app = new Hono();

app.post("/internal/triggers/on-comment-submit", async (c) => {
  const input = await c.req.json<OnCommentSubmitRequest>();
  const body = (input.comment?.body ?? "").toLowerCase();
  const id = input.comment?.id;
  if (id && body.includes("spam phrase"))
    await reddit.remove(id, true);
  return c.json<TriggerResponse>({ status: "ok" });
});

export default app;
```

:::note
Handlers should return quickly ([limitations](../../capabilities/devvit-web/devvit_web_overview.mdx#limitations)). Defer
heavy work to the [scheduler](#4-scheduler-redis-and-http) or an allow-listed [
`fetch`](../../capabilities/server/http-fetch.mdx).
:::
---

## 4. Scheduler, Redis, and HTTP

| PRAW                                 | Devvit                                                                                                                                                                                                  |
|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `while True`, `time.sleep`, cron job | [Scheduler](../../capabilities/server/scheduler.mdx) — cron in `devvit.json` and/or `scheduler.runJob` ([recurring scheduler tasks](../../capabilities/server/scheduler.mdx#scheduling-recurring-jobs)) |
| SQLite / JSON files / pickle on disk | [Redis](../../capabilities/server/redis.mdx) (per subreddit)                                                                                                                                            |
| `requests.get` to any URL            | Server-side [HTTP fetch](../../capabilities/server/http-fetch.mdx) — `fetch` to domains in `permissions.http.domains`                                                                                   |

**Redis** (replaces local SQLite / JSON files):

```ts title="src/server/index.ts (excerpt)"
import { redis } from "@devvit/web/server";
import type { OnPostSubmitRequest, TriggerResponse } from "@devvit/web/shared";

app.post("/internal/triggers/on-post-submit", async (c) => {
  const input = await c.req.json<OnPostSubmitRequest>();
  const authorId = input.author?.id;
  if (!authorId) return c.json<TriggerResponse>({ status: "ignored" });

  const count = await redis.incrBy(`post_count:${authorId}`, 1);
  console.log(`User ${authorId} has submitted ${count} posts.`);
  return c.json<TriggerResponse>({ status: "ok" });
});
```

**Scheduler** (replaces `time.sleep` / cron; declare the task in `devvit.json` first):

```ts title="src/server/index.ts (excerpt)"
import { scheduler } from "@devvit/web/server";

await scheduler.runJob({
  name: "my-delayed-task",
  data: { message: "Reminder in one hour" },
  runAt: new Date(Date.now() + 60 * 60 * 1000),
});
```

**HTTP fetch** (HTTPS only; domain must be allow-listed):

```json title="devvit.json — HTTP allow-list"
{
  "permissions": {
    "http": {
      "enable": true,
      "domains": [
        "api.example.com"
      ]
    }
  }
}
```

```ts
const res = await fetch("https://api.example.com/v1/status");
const data = await res.json();
```

---

## 5. Posts, comments, moderation

Same Reddit actions you already call from PRAW. Devvit’s client is async. PRAW loads comments and posts by base36 id;
Devvit APIs use fullnames (`t1_`, `t3_`) —
see [Reddit thing IDs](../../capabilities/server/reddit-api.mdx#reddit-thing-ids).

### Posts

**PRAW** — `subreddit.submit(...)`

```python
reddit.subreddit("learnpython").submit(
    "Weekly thread",
    selftext="Discussion goes here.",
)
```

**Devvit** — [`submitPost`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#submitpost) / [
`submitCustomPost`](../../capabilities/server/reddit-api.mdx); prefer `context.subredditName` over hard-coding the sub
name.

```ts title="src/server/index.ts"
import { context, reddit } from "@devvit/web/server";

export async function createWeeklyThread() {
  const { subredditName } = context;
  if (!subredditName) throw new Error("subredditName is required");

  return await reddit.submitPost({
    subredditName,
    title: "Weekly thread",
    text: "Discussion goes here.",
  });
}
```

Acting as the **logged-in user** (not the app account): [`runAs: "USER"`](../../capabilities/server/userActions.mdx).

### Comments

Get post and comment fullnames from the current request — do not hard-code `t1_` / `t3_` ids in app code.

| PRAW                                              | Devvit                                                                                              |
|---------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `comment.id` / `submission.id` on a loaded object | `.id` on `Post`, `Comment`, or the return value of `submitComment`                                  |
| Hard-coded id in a long-running script            | `context.postId`, `context.commentId` ([`reddit` and `context`](#2-prawreddit--reddit-and-context)) |
| Id from a streamed or webhook event               | `input.post?.id`, `input.comment?.id` in the JSON body ([Streams → triggers](#3-streams--triggers)) |

**PRAW** — `.reply()` on a `Comment` / `Submission`

```python
reddit.comment("abc123").reply("Thanks for the context.")
comment_reply = reddit.submission("def456").reply("Pinned notice.")
comment_reply.distinguish(True)  # to pin comment
```

**Devvit** — either pattern works: pass the fullname to [
`reddit.*`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md) (e.g. [
`submitComment`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#submitcomment)), or fetch a [
`Comment`](../../api/redditapi/models/classes/Comment.md) / [`Post`](../../api/redditapi/models/classes/Post.md) and
call methods on it (like PRAW). **Fetching first adds an extra API round trip** — prefer the id-only `reddit.*` path
when you only need a single action; fetch when you will chain several methods on the same thing.

```ts title="src/server/index.ts — reply on a comment, id only (preferred)"
import { context, reddit } from "@devvit/web/server";

const { commentId } = context;
if (!commentId) throw new Error("Run on a comment.");

await reddit.submitComment({ id: commentId, text: "Thanks for the context.", runAs: "APP" });
```

```ts title="src/server/index.ts — reply on a comment via Comment.reply()"
import { context, reddit } from "@devvit/web/server";

const { commentId } = context;
if (!commentId) throw new Error("Run on a comment.");

const comment = await reddit.getCommentById(commentId);
await comment.reply({ text: "Thanks for the context.", runAs: "APP" });
```

```ts title="src/server/index.ts — reply on a post, id only (preferred)"
import { context, reddit } from "@devvit/web/server";

const { postId } = context;
if (!postId) throw new Error("Run on a post.");

const pinned = await reddit.submitComment({
  postId,
  text: "Pinned notice.",
  runAs: "APP",
});
await pinned.distinguish(true); // sticky mod comment (maps to PRAW distinguish(True))
```

```ts title="src/server/index.ts — reply on a post via Post.addComment()"
import { context, reddit } from "@devvit/web/server";

const { postId } = context;
if (!postId) throw new Error("Run on a post.");

const post = await reddit.getPostById(postId);
const pinned = await post.addComment({ text: "Pinned notice.", runAs: "APP" });
await pinned.distinguish(true);
```

In a trigger handler, use ids from the event payload (see [Streams → triggers](#3-streams--triggers)) —
`input.comment?.id`,
`input.post?.id` — with either approach.

### Moderation

**PRAW** — `.mod.lock()`, `.mod.remove()`, `.mod.approve()`, `subreddit.banned.add`, Modmail via `subreddit.modmail`, …

```python
submission = reddit.submission("def456")
submission.mod.lock()
comment = reddit.comment("abc123")
comment.mod.remove(spam=False)
comment.mod.approve()
```

**Devvit** — same choice as comments: prefer [
`reddit.*`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md) with fullnames when that covers the
action ([`remove`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#remove), [
`approve`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#approve), …). Fetch [
`Post`](../../api/redditapi/models/classes/Post.md) / [`Comment`](../../api/redditapi/models/classes/Comment.md) when
you need object-only methods (e.g. [`lock`](../../api/redditapi/models/classes/Post.md#lock)) or several calls on the
same thing — each `getPostById` / `getCommentById` is an extra round trip.

```ts title="src/server/index.ts — moderate a comment (reddit.* with ids)"
import { context, reddit } from "@devvit/web/server";

const { commentId } = context;
if (!commentId) throw new Error("Run this action on a comment.");

await reddit.remove(commentId, false);
await reddit.approve(commentId);
```

```ts title="src/server/index.ts — lock post and moderate comment (object methods)"
import { context, reddit } from "@devvit/web/server";

const { commentId } = context;
if (!commentId) throw new Error("Run this action on a comment.");

const comment = await reddit.getCommentById(commentId);
const post = await reddit.getPostById(comment.postId);
await post.lock();
await comment.remove(false);
await comment.approve();
```

More: [`RedditAPIClient`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md), [
`ModMailService`](../../api/redditapi/models/classes/ModMailService.md). Mod tools often set `permissions.reddit.scope`
to `"moderator"` — [permissions](../../capabilities/devvit-web/devvit_web_configuration.md#permissions-configuration).

---

## 6. Gaps: what your PRAW bot may do that Devvit does not

| PRAW                                               | Devvit                                                                                        | Notes                                                                                                        |
|----------------------------------------------------|-----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| `redditor.subreddits`, saved, upvoted, friends, …  | [Private user data](../../capabilities/server/reddit-api.mdx#private-user-data) not available | Public data only                                                                                             |
| Infinite `stream` / open socket to Reddit          | No in-process stream; short-lived handlers                                                    | Triggers + [scheduler](../../capabilities/server/scheduler.mdx)                                              |
| `requests` to any host                             | Allow-listed `fetch` only                                                                     | [HTTP fetch](../../capabilities/server/http-fetch.mdx); request domains early                                |
| Local SQLite / arbitrary files                     | No general `fs` persistence                                                                   | [Redis](../../capabilities/server/redis.mdx); [settings](../../capabilities/server/settings-and-secrets.mdx) |
| One bot process across all of Reddit from your VPS | Per-installation, hosted app                                                                  | Design for subreddit-scoped installs                                                                         |
| Your own OAuth app from prefs                      | Platform-managed Reddit access                                                                | `permissions.reddit` in `devvit.json`                                                                        |

Most **subreddit moderation and engagement** flows you built with PRAW still map cleanly; the shift is event-driven
hosting and installation scope, not relearning Reddit’s content model.

---

## References

**Devvit**

- [App quickstart](../../quickstart/quickstart.md) · [Mod tool quickstart](../../quickstart/quickstart-mod-tool.md)
- [Triggers](../../capabilities/server/triggers.mdx) · [Scheduler](../../capabilities/server/scheduler.mdx) · [Redis](../../capabilities/server/redis.mdx) · [HTTP fetch](../../capabilities/server/http-fetch.mdx)
- [Reddit API overview](../../capabilities/server/reddit-api.mdx) · [
  `RedditAPIClient`](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md) · [User actions](../../capabilities/server/userActions.mdx)

**PRAW**

- [PRAW documentation](https://praw.readthedocs.io/)
