# Migrating Your PRAW App to Devvit Web

If you have built Reddit bots or moderation tools using PRAW (Python Reddit API Wrapper) and the standard Reddit API, you can port them directly into Reddit using Devvit Web. Devvit Web is Reddit's modern client/server architecture for applications, allowing you to build rich moderation tools and automated bots using familiar web frameworks (like Hono and Vite).

This guide shows you how to transition your Python/PRAW app to a Devvit Web app with concepts and logic structures you're already familiar with.

## Creating a Devvit app

Unlike standard Python scripts, a Devvit Web app is structurally split into a front-end client and a back-end server and tied together by a configuration file. To jumpstart your migration, you can use official Devvit templates.

### Mod tool template

A highly recommended starting point for migrating PRAW moderation tools is the **Mod Tool Template**. Go to [developers.reddit.com/new](http://developers.reddit.com/new), select the Mod Tool Template, and follow the instructions. The project created for you provides a complete foundation with a lightweight web framework (Hono) for backend logic, Vite for web components, and TypeScript for type safety.

### Architecture

A typical Devvit Web template will generate the following file structure:

- **devvit.json**: This is your app's configuration file (replacing the old devvit.yaml paradigm). It defines your app's name, permissions, triggers, and scheduled jobs.
- **src/client/**: This directory holds your webview code (HTML/CSS/JS or React components built with Vite). For Mod Tools it's common to not use the client folder
- **src/server/**: This directory contains your backend API logic. Here, a Node server framework (like Hono) processes requests, interacts with the Reddit API, and handles triggers. All server endpoints typically start with /internal/ or /api/.

## Python to TypeScript: Server Concepts

In PRAW, you managed state in a continuous Python loop. In Devvit Web, your application acts as an API server responding to specific incoming webhook requests (handled seamlessly by Hono). Here are the key analogies:

- **dict vs. Object/Record:** Python dictionaries serve the same structural purpose as TypeScript objects.
- **pip install vs. npm install:** Instead of managing a requirements.txt file, Devvit uses a package.json file to track dependencies.
- **Continuous Polling vs. Webhooks:** Instead of polling Reddit in a while True: loop, Devvit automatically sends a POST request to your Hono server whenever an event occurs.

## Triggers (replacing continuous polling)

In Devvit Web, triggers are configured in your devvit.json. When an event happens (like a new comment), Devvit sends a payload to the designated endpoint on your server.

**Step 1: Configuration (devvit.json)**

```json
{
  "name": "my-moderator-bot",
  "triggers": {
    "onCommentSubmit": "/internal/triggers/on-comment-submit"
  }
}
```

**Step 2: Server Logic (src/server/index.ts)**

```ts
// Hono is a small web framework used to define HTTP routes.
import { Hono } from "hono";
// TriggerResponse is the expected JSON response shape for trigger endpoints.
import type { TriggerResponse } from "@devvit/web/shared";

// Create a web server app instance.
const app = new Hono();

// Listen for the onCommentSubmit trigger endpoint configured in devvit.json.
app.post("/internal/triggers/on-comment-submit", async (c) => {
  // Parse the incoming JSON body from Devvit.
  // The <...> part is a TypeScript type hint for what fields we expect.
  const input = await c.req.json<{
    author?: { username?: string; name?: string };
  }>();
  // Pick a display name safely:
  // - ?. means "if this exists, read it"
  // - ?? means "if left side is null/undefined, use right side"
  const authorName =
    input.author?.username ?? input.author?.name ?? "unknown user";
  console.log(`New comment created by ${authorName}!`);
  // Return a standard "ok" response with HTTP 200 status.
  return c.json<TriggerResponse>({ status: "ok" }, 200);
});

export default app;
```

## Adding and removing comments

To moderate content in Devvit Web, use the Reddit API client accessible within your server logic. This behaves similarly to `comment.mod.remove()` in PRAW but relies on asynchronous function calls.

```ts
// Hono handles incoming HTTP requests from Devvit.
import { Hono } from "hono";
// reddit is the Devvit Reddit API client for moderation/content actions.
import { reddit } from "@devvit/web/server";
// TriggerResponse is the response type expected by trigger handlers.
import type { TriggerResponse } from "@devvit/web/shared";

const app = new Hono();

app.post("/internal/triggers/on-comment-submit", async (c) => {
  // Parse request JSON and describe expected fields with a TypeScript type.
  const input = await c.req.json<{
    author?: { id?: string };
    comment?: { id?: string; body?: string };
  }>();
  // Get the comment ID if it exists.
  const commentId = input.comment?.id;
  // If we cannot find the comment ID, we cannot moderate the comment.
  if (!commentId) return c.json<TriggerResponse>({ status: "ignored" }, 200);

  // Normalize text to lowercase so our keyword check is case-insensitive.
  const body = input.comment?.body?.toLowerCase() ?? "";

  // Check if the comment matches a specific moderation rule
  if (body.includes("rule-breaking string")) {
    // 1. Remove the comment natively
    await reddit.remove(commentId, true); // true = flag as spam

    // 2. Reply to the removed comment with a removal reason
    await reddit.submitComment({
      // Reply to the removed comment itself.
      id: commentId,
      text: "Your comment was removed automatically for violating our community guidelines.",
      // Run as the app account rather than a user account.
      runAs: "APP",
    });
  }

  return c.json<TriggerResponse>({ status: "ok" }, 200);
});

export default app;
```

## Using Redis for storage (replacing SQLite/JSON)

Instead of maintaining a local SQLite database for tracking user warnings or config states, Devvit Web gives you direct access to a managed Redis instance.

```ts
// Hono handles HTTP routes.
import { Hono } from "hono";
// Redis client for key-value storage.
import { redis } from "@devvit/redis";
// Standard trigger response type.
import type { TriggerResponse } from "@devvit/web/shared";

const app = new Hono();

app.post("/internal/triggers/on-post-submit", async (c) => {
  // Read trigger payload JSON.
  const input = await c.req.json<{ author?: { id?: string } }>();
  // Extract the submitting user's ID.
  const authorId = input.author?.id;
  // If author is missing, skip this event safely.
  if (!authorId) return c.json<TriggerResponse>({ status: "ignored" }, 200);

  // Build a per-user counter key, for example: post_count:t2_abc123
  const redisKey = `post_count:${authorId}`;

  // Increment the count in Redis
  const newCount = await redis.incrBy(redisKey, 1);
  console.log(`User ${authorId} has submitted ${newCount} posts.`);

  return c.json<TriggerResponse>({ status: "ok" }, 200);
});

export default app;
```

## Using schedulers (replacing cron jobs or time.sleep)

PRAW bots frequently rely on time.sleep() for delayed tasks. In Devvit Web, you define Scheduled Tasks in devvit.json and map them to internal Hono endpoints. You can schedule recurring jobs (like cron) or one-off tasks.

**Step 1: Configuration (devvit.json)**

```json
{
  "scheduler": {
    "tasks": {
      "remind-user-job": {
        "endpoint": "/internal/scheduler/remind-user-job"
      }
    }
  }
}
```

**Step 2: Scheduling and handling (src/server/index.ts)**

```ts
// Hono handles incoming webhook/scheduler HTTP requests.
import { Hono } from "hono";
// scheduler queues delayed jobs, reddit sends private messages.
import { scheduler, reddit } from "@devvit/web/server";
// Types for scheduler request/response payloads.
import type { TaskRequest, TaskResponse } from "@devvit/web/server";
// Type for standard trigger responses.
import type { TriggerResponse } from "@devvit/web/shared";

const app = new Hono();

// 1. Triggering the scheduled job (e.g., from a comment trigger)
app.post("/internal/triggers/on-comment-submit", async (c) => {
  // Parse incoming trigger JSON.
  // This generic type describes what data shape we expect from the payload.
  const input = await c.req.json<{
    author?: { username?: string; name?: string };
    comment?: { body?: string };
  }>();
  // Normalize body text so command checks are case-insensitive.
  const body = input.comment?.body?.toLowerCase() ?? "";

  if (body.includes("!remindme")) {
    // Use username when available, otherwise fall back to name.
    const username = input.author?.username ?? input.author?.name;
    // If we still do not have a recipient, skip this event.
    if (!username) return c.json<TriggerResponse>({ status: "ignored" }, 200);

    // Create a timestamp one hour in the future.
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

    // Enqueue the job
    await scheduler.runJob({
      // A unique job ID (useful for debugging/canceling).
      id: `remind-user-${username}-${Date.now()}`,
      // Must match a task name declared in devvit.json.
      name: "remind-user-job",
      // Custom payload delivered later to the scheduler endpoint.
      data: { username, message: "Your 1-hour reminder!" },
      // Time when this job should run.
      runAt: oneHourFromNow,
    });
  }
  return c.json<TriggerResponse>({ status: "ok" }, 200);
});

// 2. The endpoint that executes when the timer concludes
app.post("/internal/scheduler/remind-user-job", async (c) => {
  // Parse scheduler payload JSON.
  // TaskRequest<{ ... }> means "TaskRequest whose data looks like this object".
  const req =
    await c.req.json<TaskRequest<{ username: string; message: string }>>();
  // Read values from req.data safely; default to empty object if data is missing.
  const { username, message } = req.data ?? {};
  // Guard clause: ensure required fields exist before continuing.
  if (!username || !message)
    return c.json<TaskResponse>({ status: "ignored" }, 200);

  // Send a Reddit private message to the user.
  await reddit.sendPrivateMessage({
    to: username,
    subject: "Automated Reminder",
    text: message,
  });

  return c.json<TaskResponse>({ status: "ok" }, 200);
});

export default app;
```

## Concept Summary

| Concept              | PRAW (Python)               | Devvit Web (Hono \+ TypeScript)                     |
| :------------------- | :-------------------------- | :-------------------------------------------------- |
| Architecture         | Continuous Running Script   | Client/Server API driven by devvit.json             |
| Listening for Events | subreddit.stream.comments() | Webhooks handled via app.post('/internal/...', ...) |
| Database Storage     | SQLite, JSON, external DBs  | import { redis } from '@devvit/redis'               |
| Delayed Actions      | time.sleep()                | scheduler.runJob() \+ Server Endpoint               |

**References**

1. [Mod Tools Template - GitHub](https://github.com/reddit/devvit-template-mod-tool-devvit-web)
2. [Redis](../../capabilities/server/redis.mdx)
3. [Scheduler](../../capabilities/server/scheduler.mdx)
4. [Triggers](../../capabilities/server/triggers.mdx)
