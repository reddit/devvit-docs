# Community tool quickstart

Community tools are a broad category of app that are built to increase engagement, organize community management, or otherwise support day-to-day subreddit operations. This guide walks through a keyword vote tally community tool that keeps one sticky tally comment updated on each post.

This tutorial should take about 10 minutes to complete. Once complete, you'll have a community tool that can tally comments like:

```text
I Agree with this
Disagree - needs work
```

Moderators can turn the feature on for each subreddit and configure up to 10 accepted keywords. Keywords can preserve their capitalization in the tally comment, match capitalization when needed, and either appear anywhere in a comment or only at the start.

## What you'll need

- Node.JS (version 22.2.0+)
- A code editor

## Environment setup

1. Install Node.JS and NPM ([instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)).
2. Go to [https://developers.reddit.com/new](https://developers.reddit.com/new) and choose Mod Tool under Other templates.
3. Go through the wizard. You will need to create a Reddit account and connect it to Reddit developers.
4. Follow the instructions on your terminal.

On success, you should see something like this:

```sh
Your Devvit authentication token has been saved to /Users/user.name/.devvit/token
Fetching and extracting the template...
Cutting the template to the target directory...
 🔧 Installing dependencies...
 🚀🚀🚀 Devvit app successfully initialized!
┌────────────────────────────────────────────────────┐
│ • `cd my-app` to open your project directory       │
│ • `npm run dev` to develop in your test community  │
└────────────────────────────────────────────────────┘
```

## Understanding the community tool

This community tool uses three Devvit capabilities:

- [Subreddit settings](../capabilities/server/settings-and-secrets.mdx) so moderators can enable the feature and configure vote keywords for each community.
- [Triggers](../capabilities/server/triggers.mdx) so the community tool can create a tally comment on each new post and count new comments.
- [Redis](../capabilities/server/redis.mdx) so the community tool can store per-post keyword counts and the sticky tally comment ID.

### Add settings and triggers

Declare post and comment triggers, a settings validation endpoint, and subreddit settings in `devvit.json`. Keep the generated `name` value for your app, or replace the example name below with your app name.

```json title="devvit.json"
{
  "$schema": "https://developers.reddit.com/schema/config-file.v2.json",
  "name": "keyword-tally",
  "server": {
    "dir": "dist/server",
    "entry": "index.cjs"
  },
  "triggers": {
    "onCommentSubmit": "/internal/triggers/on-comment-submit",
    "onPostCreate": "/internal/triggers/on-post-create"
  },
  "settings": {
    "subreddit": {
      "keywordVotesEnabled": {
        "type": "boolean",
        "label": "Enable keyword vote tally comments",
        "defaultValue": false
      },
      "keywordVoteKeywords": {
        "type": "paragraph",
        "label": "Keyword vote triggers",
        "helpText": "Use one keyword per line or comma-separated. Maximum 10 keywords.",
        "defaultValue": "Agree\nDisagree",
        "validationEndpoint": "/internal/settings/validate-keyword-vote-keywords"
      },
      "keywordVoteMatchCase": {
        "type": "boolean",
        "label": "Match capitalization",
        "defaultValue": false
      },
      "keywordVoteRequireKeywordAtStart": {
        "type": "boolean",
        "label": "Require keyword at start of comment",
        "defaultValue": false
      }
    }
  },
  "permissions": {
    "redis": true,
    "reddit": { "enable": true, "scope": "moderator" }
  },
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build"
  }
}
```

The server source lives in `src/index.ts`. The `server.entry` value points at the built file that Vite writes to `dist/server/index.cjs`.

After the app is installed, moderators can enable keyword votes and update the keyword list from the Install Settings page for their subreddit.

### Add the server files

Add the community tool server code under `src`:

```text
src/
  features/
    keyword-votes/
      render.ts
      settings.ts
      storage.ts
      triggers.ts
  routes/
    settings.ts
    triggers.ts
  index.ts
```

This example is based on the keyword votes feature in the [Mod Tools Devvit Web Toolbox template](https://github.com/reddit/devvit-template-mod-tool-devvit-web-toolbox). For the full implementation with tests and feature notes, see `src/features/keyword-votes/README.md` and `src/features/keyword-votes/` in that template. Its route wiring lives in `src/routes/triggers.ts` and `src/routes/settings.ts`.

#### Load and validate settings

Create `src/features/keyword-votes/settings.ts`. This file reads the install settings, normalizes keywords, and validates moderator input.

```ts title="src/features/keyword-votes/settings.ts"
import { settings } from '@devvit/web/server';
import type {
  SettingsValidationRequest,
  SettingsValidationResponse,
} from '@devvit/web/shared';

export type KeywordVoteKeyword = {
  label: string;
  matchValue: string;
  storageKey: string;
};

export type KeywordVoteSettings = {
  enabled: boolean;
  keywords: readonly KeywordVoteKeyword[];
  matchCase: boolean;
  requireKeywordAtStart: boolean;
};

const DEFAULT_KEYWORD_LABELS: readonly string[] = ['Agree', 'Disagree'];
const MAX_KEYWORDS = 10;

function parseKeywordsRaw(raw: string | undefined): string[] {
  if (!raw) return [];

  return raw
    .split(/[\n,]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function keywordToMatchValue(label: string, matchCase: boolean): string {
  return matchCase ? label : label.toLowerCase();
}

function toKeyword(label: string, matchCase: boolean): KeywordVoteKeyword {
  const matchValue = keywordToMatchValue(label, matchCase);

  return {
    label,
    matchValue,
    storageKey: matchValue,
  };
}

function normalizeKeywords(
  raw: string | undefined,
  matchCase: boolean
): KeywordVoteKeyword[] {
  const deduped: KeywordVoteKeyword[] = [];
  const seen = new Set<string>();

  for (const label of parseKeywordsRaw(raw)) {
    const matchValue = keywordToMatchValue(label, matchCase);
    if (seen.has(matchValue)) continue;
    seen.add(matchValue);
    deduped.push(toKeyword(label, matchCase));
    if (deduped.length >= MAX_KEYWORDS) break;
  }

  return deduped;
}

export async function getKeywordVoteSettings(): Promise<KeywordVoteSettings> {
  const enabled = Boolean(await settings.get<boolean>('keywordVotesEnabled'));
  const matchCase = Boolean(await settings.get<boolean>('keywordVoteMatchCase'));
  const requireKeywordAtStart = Boolean(
    await settings.get<boolean>('keywordVoteRequireKeywordAtStart')
  );
  const configured = await settings.get<string>('keywordVoteKeywords');
  const keywords = normalizeKeywords(configured, matchCase);

  return {
    enabled,
    keywords:
      keywords.length > 0
        ? keywords
        : DEFAULT_KEYWORD_LABELS.map((label) => toKeyword(label, matchCase)),
    matchCase,
    requireKeywordAtStart,
  };
}

export function validateKeywordVoteKeywords(
  request: SettingsValidationRequest<string>
): SettingsValidationResponse {
  const keywords = parseKeywordsRaw(request.value);

  if (keywords.length > MAX_KEYWORDS) {
    return {
      success: false,
      error: `Maximum ${MAX_KEYWORDS} keywords are allowed.`,
    };
  }

  return { success: true };
}
```

#### Store keyword counts

Create `src/features/keyword-votes/storage.ts`. This file stores one Redis hash per post for counts and one Redis key per post for the tally comment ID.

```ts title="src/features/keyword-votes/storage.ts"
import { redis } from '@devvit/web/server';

import type { KeywordVoteKeyword } from './settings.js';

type KeywordCounts = { [keywordLabel: string]: number };

function keyForCounts(postId: string): string {
  return `keywordVotes:counts:${postId}`;
}

function keyForTallyComment(postId: string): string {
  return `keywordVotes:tallyComment:${postId}`;
}

export async function ensurePostKeywords(
  postId: string,
  keywords: readonly KeywordVoteKeyword[]
): Promise<void> {
  const countsKey = keyForCounts(postId);
  const current = await redis.hGetAll(countsKey);
  const missing: Record<string, string> = {};

  for (const keyword of keywords) {
    if (current[keyword.storageKey] === undefined) {
      missing[keyword.storageKey] = '0';
    }
  }

  if (Object.keys(missing).length > 0) {
    await redis.hSet(countsKey, missing);
  }
}

export async function incrementKeywordVote(
  postId: string,
  keyword: KeywordVoteKeyword
): Promise<void> {
  await redis.hIncrBy(keyForCounts(postId), keyword.storageKey, 1);
}

export async function getKeywordCounts(
  postId: string,
  keywords: readonly KeywordVoteKeyword[]
): Promise<KeywordCounts> {
  const countValues = await redis.hGetAll(keyForCounts(postId));
  const counts: KeywordCounts = {};

  for (const keyword of keywords) {
    const value = Number.parseInt(countValues[keyword.storageKey] ?? '0', 10);
    counts[keyword.label] = Number.isFinite(value) ? value : 0;
  }

  return counts;
}

export async function setTallyCommentId(
  postId: string,
  commentId: string
): Promise<void> {
  await redis.set(keyForTallyComment(postId), commentId);
}

export async function getTallyCommentId(
  postId: string
): Promise<string | undefined> {
  return redis.get(keyForTallyComment(postId));
}
```

#### Render the tally comment

Create `src/features/keyword-votes/render.ts`. This file turns the current counts into markdown for the sticky comment.

```ts title="src/features/keyword-votes/render.ts"
import type { KeywordVoteKeyword } from './settings.js';

export function renderTallyComment(
  keywords: readonly KeywordVoteKeyword[],
  counts: { [keywordLabel: string]: number }
): string {
  const lines = [
    '## Keyword vote tally',
    '',
    ...keywords.map(
      (keyword) => `- ${keyword.label}: **${counts[keyword.label] ?? 0}**`
    ),
  ];

  return lines.join('\n');
}
```

#### Handle post and comment triggers

Create `src/features/keyword-votes/triggers.ts`. This file creates or edits the sticky tally comment and increments counts for matching keyword comments.

```ts title="src/features/keyword-votes/triggers.ts"
import { reddit } from '@devvit/web/server';
import type {
  OnCommentSubmitRequest,
  OnPostCreateRequest,
  T1,
  T3,
} from '@devvit/web/shared';

import { renderTallyComment } from './render.js';
import {
  getKeywordVoteSettings,
  type KeywordVoteKeyword,
} from './settings.js';
import {
  ensurePostKeywords,
  getKeywordCounts,
  getTallyCommentId,
  incrementKeywordVote,
  setTallyCommentId,
} from './storage.js';

function asT1(id: string): T1 {
  return (id.startsWith('t1_') ? id : `t1_${id}`) as T1;
}

function asT3(id: string): T3 {
  return (id.startsWith('t3_') ? id : `t3_${id}`) as T3;
}

function findMatchingKeyword(
  commentBody: string,
  keywords: readonly KeywordVoteKeyword[],
  matchCase: boolean,
  requireKeywordAtStart: boolean
): KeywordVoteKeyword | undefined {
  const body = matchCase ? commentBody : commentBody.toLowerCase();
  return keywords.find((keyword) =>
    requireKeywordAtStart
      ? body.startsWith(keyword.matchValue)
      : body.includes(keyword.matchValue)
  );
}

async function createOrRefreshTallyComment(
  postId: string,
  keywords: readonly KeywordVoteKeyword[]
): Promise<void> {
  await ensurePostKeywords(postId, keywords);

  const counts = await getKeywordCounts(postId, keywords);
  const body = renderTallyComment(keywords, counts);
  const existingTallyCommentId = await getTallyCommentId(postId);

  if (existingTallyCommentId) {
    const existingComment = await reddit.getCommentById(asT1(existingTallyCommentId));
    await existingComment.edit({ text: body });
    return;
  }

  const post = await reddit.getPostById(asT3(postId));
  const comment = await post.addComment({ text: body, runAs: 'APP' });

  try {
    await comment.distinguish(true);
  } catch (error) {
    console.warn('Failed to distinguish sticky tally comment', error);
  }

  await setTallyCommentId(postId, comment.id);
}

export async function handlePostCreateKeywordVotes(
  input: OnPostCreateRequest
): Promise<void> {
  const { enabled, keywords } = await getKeywordVoteSettings();
  if (!enabled) return;

  const postId = input.post?.id;
  if (!postId) return;

  await createOrRefreshTallyComment(postId, keywords);
}

export async function handleCommentSubmitKeywordVotes(
  input: OnCommentSubmitRequest
): Promise<void> {
  const { enabled, keywords, matchCase, requireKeywordAtStart } =
    await getKeywordVoteSettings();
  if (!enabled) return;

  const postId = input.post?.id;
  const commentBody = input.comment?.body?.trim();

  if (!postId || !commentBody) return;

  const matchedKeyword = findMatchingKeyword(
    commentBody,
    keywords,
    matchCase,
    requireKeywordAtStart
  );
  if (!matchedKeyword) return;

  await ensurePostKeywords(postId, keywords);
  await incrementKeywordVote(postId, matchedKeyword);
  await createOrRefreshTallyComment(postId, keywords);
}
```

#### Register trigger routes

Create `src/routes/triggers.ts`. This file receives Devvit trigger requests and calls the keyword vote handlers.

```ts title="src/routes/triggers.ts"
import { Hono } from 'hono';
import type {
  OnCommentSubmitRequest,
  OnPostCreateRequest,
  TriggerResponse,
} from '@devvit/web/shared';

import {
  handleCommentSubmitKeywordVotes,
  handlePostCreateKeywordVotes,
} from '../features/keyword-votes/triggers.js';

export const triggers = new Hono();

async function runFeatureSafely(
  featureName: string,
  runner: () => Promise<void>
): Promise<void> {
  try {
    await runner();
  } catch (error) {
    console.error(`[triggers] Feature "${featureName}" failed`, error);
  }
}

triggers.post('/on-post-create', async (c) => {
  const input = await c.req.json<OnPostCreateRequest>();

  await runFeatureSafely('keyword-votes:on-post-create', async () => {
    await handlePostCreateKeywordVotes(input);
  });

  return c.json<TriggerResponse>({}, 200);
});

triggers.post('/on-comment-submit', async (c) => {
  const input = await c.req.json<OnCommentSubmitRequest>();

  await runFeatureSafely('keyword-votes:on-comment-submit', async () => {
    await handleCommentSubmitKeywordVotes(input);
  });

  return c.json<TriggerResponse>({}, 200);
});
```

#### Register settings validation

Create `src/routes/settings.ts`. This file handles the `keywordVoteKeywords` validation endpoint declared in `devvit.json`.

```ts title="src/routes/settings.ts"
import { Hono } from 'hono';
import type {
  SettingsValidationRequest,
  SettingsValidationResponse,
} from '@devvit/web/shared';

import { validateKeywordVoteKeywords } from '../features/keyword-votes/settings.js';

export const settingsRoutes = new Hono();

settingsRoutes.post('/validate-keyword-vote-keywords', async (c) => {
  const request = await c.req.json<SettingsValidationRequest<string>>();

  return c.json<SettingsValidationResponse>(
    validateKeywordVoteKeywords(request),
    200
  );
});
```

#### Start the server

Replace the contents of `src/index.ts` with the following server entrypoint. If your template already has other routes in this file, keep one `app` and route `/internal/triggers` and `/internal/settings` to the routers below.

```ts title="src/index.ts"
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { createServer, getServerPort } from '@devvit/web/server';

import { settingsRoutes } from './routes/settings.js';
import { triggers } from './routes/triggers.js';

const app = new Hono();
const internal = new Hono();

internal.route('/settings', settingsRoutes);
internal.route('/triggers', triggers);

app.route('/internal', internal);

serve({
  fetch: app.fetch,
  createServer,
  port: getServerPort(),
});
```

The `onPostCreate` handler creates the sticky tally comment as soon as a post is created. The `onCommentSubmit` handler checks whether the comment contains a configured keyword, increments that keyword's Redis counter, and edits the sticky tally comment with the new totals. When **Require keyword at start of comment** is enabled, only comments that start with the keyword are counted. When **Match capitalization** is enabled, comments must use the same capitalization as the configured keyword.

:::note
This template behavior counts every matching comment. If you want one vote per user per post, store a voter key such as `keywordVotes:voters:{postId}:{username}` and skip duplicate voters before incrementing.
:::

## Building and Testing

To build and run your community tool, run the following command on terminal:

```shell
npm run dev
```

If you didn't provide a test subreddit, one will be created for you. Once you run `npm run dev`, you will receive a link to test the community tool in your test subreddit.

To test the community tool:

1. Open the app's Install Settings page for your test subreddit.
2. Turn on **Enable keyword vote tally comments**.
3. Confirm **Keyword vote triggers** contains `Agree` and `Disagree`, or configure your own keyword values.
4. Create a post in your test subreddit.
5. Confirm the community tool creates a sticky **Keyword vote tally** comment.
6. Add comments such as `I Agree with this`, `Disagree - needs work`, and `agree again`.
7. Confirm the sticky tally comment updates after each matching vote.

By default, capitalization does not need to match and the keyword can appear anywhere in the comment. Turn on **Match capitalization** if `Agree` should count but `agree` should not. Turn on **Require keyword at start of comment** if `Agree with this` should count but `I Agree with this` should not.

If you see a 404 for `/internal/triggers/on-comment-submit` or `/internal/triggers/on-post-create`, the built server bundle does not contain the trigger route. Confirm `src/routes/triggers.ts` contains both routes and `src/index.ts` mounts `internal.route('/triggers', triggers)`, then stop and restart `npm run dev` so Vite rebuilds `dist/server/index.cjs`.

If setting validation does not run, confirm `src/routes/settings.ts` contains `/validate-keyword-vote-keywords` and `src/index.ts` mounts `internal.route('/settings', settingsRoutes)`.

If you see `server responded with error: fetch failed`, the Node server did not start or crashed before handling the trigger. Check the terminal running `npm run dev` for build or startup errors, confirm `dist/server/index.cjs` was generated, and install Hono with `npm install hono @hono/node-server` if your template does not already include it.

## Result

Now you have a community tool that automatically creates one sticky keyword vote tally comment per post and keeps it updated as users comment with moderator-configured keywords. You can extend it by adding one-vote-per-user deduping, keyword aliases, or custom moderation actions based on the winning keyword.

## Further reading

- [Triggers](../capabilities/server/triggers.mdx)
- [Settings & Secrets](../capabilities/server/settings-and-secrets.mdx)
- [Redis](../capabilities/server/redis.mdx)
