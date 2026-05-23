# Adding Streaks

Streaks are valuable to app developers because they turn occasional use into habitual behavior. By rewarding consecutive days of activity, streaks increase retention, strengthen user identity and investment in the app, and make push notifications more effective through loss aversion (“don’t break your streak”). For devs, that usually translates into higher engagement, lower churn, and better long-term monetization.

![Streak PN](../../assets/notifications/visible-progress.png)

:::note
This is currently an experimental feature, and you'll need to [apply](https://docs.google.com/forms/d/e/1FAIpQLScB3eXHVCBf3kyHueyf3G_raxH9_BsCGiXyGjQOOmPxWz6fEg/viewform?usp=publish-editor) for a spot in our beta program to implement push notifications in your app.
:::

## **Recommended streak logic**

This section explains how streaks work in [Syllo](https://www.reddit.com/r/syllo/) in a practical, implementation-focused way.

### TL;DR

- A streak is tracked as one bit per day in Redis.
- The bit is set when a logged-in user completes a puzzle and the server receives `completionTimeMs`.
- The streak day is based on the puzzle post's creation date in UTC, not the client device clock.
- The current streak is calculated by walking backward through consecutive completed days.

### Mental model

You can think of streaks as a yearly attendance sheet:

- one Redis key per user per year: `streaks:<userId>:<year>`
- each day in the year maps to an index, where `0 = Jan 1`
- `1` means the user completed at least one eligible puzzle that day
- `0` means they did not

### End-to-end flow

#### 1\. User finishes a puzzle in the client

When all words are solved, the client sends a completion call:

```ts
// src/client/Game.tsx
verifyWordsMutation.mutate({
  problemId: problemData.problemId,
  sessionId: problemData.analyticsSessionId,
  submissions: [],
  completionTimeMs: timerState.elapsedTime,
});
```

#### 2\. Server records completion and updates streak state

`verifyWords` handles completion, updates related stats, and then calls `setStreakCompletion`:

```ts
// src/server/routes/trpc.ts (verifyWords mutation)
if (completionTimeMs && typeof completionTimeMs === "number" && userId) {
  const now = new Date();
  await setUserCompletion(userId, postId, completionTimeMs);
  await incrementPlayerCount(postId);
  await addToLeaderboard(postId, userId, completionTimeMs);
  await updateAverageCompletionTime(postId, completionTimeMs);
  await setStreakCompletion({ userId, date: now, postId });
}
```

#### 3\. Streak service maps completion to a day bit

The service looks up the Reddit post and uses the post creation date to determine the year and day index:

```ts
// src/server/services/streakService.ts
const post = await reddit.getPostById(postId);
const postCreatedAtDate = new Date(post.createdAt);
const year = postCreatedAtDate.getUTCFullYear();
const dayOfYear = getDayOfYear(postCreatedAtDate);
await setStreakCompletionBit(userId, dayOfYear, year, completed);
```

#### 4\. Bit is written in Redis

```ts
// src/server/redisService.ts
const streaksKey = (userId: string, year: number) =>
  `streaks:${userId}:${year}`;

export async function setStreakCompletionBit(
  userId: string,
  offset: number,
  year: number,
  completed: boolean,
) {
  UserIdSchema.parse(userId);
  const key = streaksKey(userId, year);
  await redis.bitfield(key, "set", "u1", offset, completed ? 1 : 0);
}
```

#### 5\. Client reads and displays the streak

```ts
// src/client/Game.tsx
const { data: streakData } = useQuery(
  trpc.getStreak.queryOptions(undefined, { enabled: !!context.userId })
);

<Header streak={streakData ?? 0} />
<Splash streak={streakData ?? null} />
```

### How current streak is calculated

`getCurrentStreak(userId)` in `src/server/services/streakService.ts` works like this:

1. Load the current year's bitset.
2. Start from today if today is completed; otherwise start from yesterday.
3. Count backward until the first day that is not completed.
4. If needed, continue into the previous year.

Core loop:

```ts
for (let i = dayToStartChecking; i >= 0; i--) {
  if (isBitSet(currentYearBuffer, i)) {
    currentStreak++;
  } else {
    break;
  }
}
```

#### Full code for `getCurrentStreak()`

```ts
/**
 * Calculates the current streak using your custom client's getBuffer method.
 */
export async function getCurrentStreak(userId: string): Promise<number> {
  const today = new Date();
  const year = today.getUTCFullYear();
  const dayOfYear = getDayOfYear(today);

  // Call your client's getBuffer method. The result is `Buffer | undefined`.
  const currentYearData = await getYearStreakBuffer(userId, year);
  // The isBitSet helper expects `Buffer | null`, so we convert `undefined` to `null`.
  const currentYearBuffer = currentYearData ?? null;

  let currentStreak = 0;
  let dayToStartChecking = dayOfYear;

  if (!isBitSet(currentYearBuffer, dayOfYear)) {
    dayToStartChecking = dayOfYear - 1;
  }

  for (let i = dayToStartChecking; i >= 0; i--) {
    if (isBitSet(currentYearBuffer, i)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Handle cross-year streaks
  // Case A: It's Jan 1 and user hasn't played today -> continue into prior year directly
  if (dayToStartChecking < 0) {
    const priorYear = year - 1;
    const priorYearData = await getYearStreakBuffer(userId, priorYear);
    const priorYearBuffer = priorYearData ?? null;

    if (priorYearBuffer) {
      const isLeap = new Date(priorYear, 1, 29).getDate() === 29;
      const lastDayOfPriorYear = isLeap ? 365 : 364;

      for (let i = lastDayOfPriorYear; i >= 0; i--) {
        if (isBitSet(priorYearBuffer, i)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }
  // Case B: Current year is fully contiguous from day 0 to dayToStartChecking
  else if (currentStreak > 0 && currentStreak === dayToStartChecking + 1) {
    const priorYear = year - 1;
    const priorYearData = await getYearStreakBuffer(userId, priorYear);
    const priorYearBuffer = priorYearData ?? null;

    if (priorYearBuffer) {
      const isLeap = new Date(priorYear, 1, 29).getDate() === 29;
      const lastDayOfPriorYear = isLeap ? 365 : 364;

      for (let i = lastDayOfPriorYear; i >= 0; i--) {
        if (isBitSet(priorYearBuffer, i)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  return currentStreak;
}
```

### Important edge cases

#### Multiple posts on the same day

If one post is completed and another is not, the day should not be accidentally cleared.

The service avoids clearing an already completed day in this mixed-result scenario:

```ts
if (completed === false) {
  return;
}
```

#### Old posts should not affect today's streak

Updates for older posts are skipped during normal gameplay:

```ts
const diffTime = Math.abs(now.getTime() - postCreatedAtDate.getTime());
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 26));
if (diffDays > 1) {
  return;
}
```

#### Cross-year streak continuity

Streaks can continue from Dec 31 into Jan 1 in two cases:

- Jan 1 is unplayed, so counting continues from the prior year tail.
- The current year is contiguous from day 0 through the current check day.

```ts
if (dayToStartChecking < 0) {
  // Jan 1 not played -> continue into prior year
} else if (currentStreak > 0 && currentStreak === dayToStartChecking + 1) {
  // current year contiguous from day 0 -> continue into prior year
}
```

### API surface

#### `getStreak`

- Route: `src/server/routes/trpc.ts`
- Returns: current streak number for the logged-in user
- Used by: header and splash in the client

  #### `getStreakDetails`

- Route: `src/server/routes/trpc.ts`
- Returns:
  - `streak`: current streak
  - `bestStreak`: longest streak in the current year
  - `totalSolved`: number of completed days in the current year

### Recommended test coverage

Cover at least the following streak scenarios:

- user has not played and returns `0`
- standard backward counting from today or yesterday
- Jan 1 cross-year behavior
- same-day multi-post safety behavior
- completion-day set behavior
- total solved days and longest streak calculations  
  Example:

```ts
const year = now.getUTCFullYear();
const today = getDayOfYear(now);
await setStreakCompletionBit(userId, today, year, true);
await setStreakCompletionBit(userId, today - 1, year, true);

const streak = await getCurrentStreak(userId);
expect(streak).toBe(2);
```

### Practical summary

- A streak day is represented by a single bit in a yearly Redis bitset.
- Completion writes happen in `verifyWords` when the puzzle is fully solved.
- Day identity is tied to the puzzle post date in UTC, not the client device day.
- Current streak is calculated from backward-consecutive completed days, with explicit cross-year handling.

### Troubleshooting checklist

If a streak looks wrong, check these in order:

1. Did completion reach `verifyWords` with both `completionTimeMs` and `userId`?
2. Did `setStreakCompletion` run with a valid `postId`?
3. What is the post's `createdAt` value? This determines the day and year.
4. Does the Redis key `streaks:<userId>:<year>` have the expected bit set?
5. Is the issue near Jan 1, where cross-year logic applies, or from an old post attempt?

## **LLM prompt**

This is exciting new ground for us\! You can try out this prompt as a flexible starting point for implementing streak systems in your app. However, because implementations vary widely across games and backends, **we aren’t able to provide integration support or troubleshooting for custom setups**.

<span id="llm-prompt"></span>

<details>
<summary>Copy-paste the prompt</summary>

\--- START COPY-PASTE PROMPT \---

You are a senior Devvit engineer. Add a robust daily streak system and a streak-aware push notification campaign to this Devvit app.

The goal is to implement the feature in this repo's existing style, not to copy file names or UI from another app. Be opinionated about the underlying mechanics:

- Use Redis as the source of truth for daily streak days.
- Use server-side completion as the only authority for awarding streak credit.
- Use Devvit's notifications API for all push notification behavior. Do not implement a custom push provider, browser push subscription, webhook-based sender, or parallel notification system.
- Use Devvit's notification opt-in APIs as the only source of truth for push subscription state.
- Use a batched scheduler job for push campaigns so large recipient lists do not run in one request.
- Keep the notification UX app-specific: expose methods that the client can call, but do not invent a full opt-in screen unless this app already has an obvious place for it.

**First Inspect The Target Repo**

Before writing code, inspect the target app and identify:

- Server entrypoint and router setup.
- Existing Redis helper module, if any.
- Existing tRPC, REST, or server action layer used by the webview.
- Existing game/content completion mutation or event.
- Existing scheduler configuration in `devvit.json`.
- Existing tests and test style.
- Existing client API utilities.
- Existing notification usage, if any.

After inspection, implement using the repo's local patterns. Suggested module names are `streakService`, `notificationService`, `schedulerRoutes`, and `redisService`, but only use them if they fit the repo.

Before coding, produce a short implementation mapping in your working notes or response:

- `COMPLETION_EVENT`: where completion is validated server-side.
- `CONTENT_ID`: the newly created daily Reddit post id, if this app creates daily posts. Use this as the notification link target. If the app does not create daily posts, use the stable content id or route that opens today's playable item.
- `CONTENT_CREATED_AT`: the daily Reddit post's `createdAt`, if this app creates daily posts. Fetch it server-side or persist it when the post is created. If the app does not create daily posts, use a server-written `createdAt` timestamp stored with the daily content metadata.
- `COUNT_ARCHIVE_COMPLETIONS_FOR_STREAK`: ask the developer before coding whether completions of older/archive content should count for streaks. Do not assume this value.
- `REDIS_HELPERS`: where Redis access should live.
- `STREAK_APIS`: where `getStreak` and optional `getStreakDetails` should be exposed.
- `PUSH_OPT_IN_APIS`: where `getPushState` and `setPushState` should be exposed.
- `SCHEDULER_CONFIG`: where the `pn` scheduler task should be registered.
- `SCHEDULER_ENDPOINT`: where the push campaign endpoint should live.
- `TEST_LOCATIONS`: where streak, notification, and scheduler tests should be added.

If the completion event cannot be identified with high confidence, stop and ask for clarification before editing. Before writing code, also ask the developer to choose `COUNT_ARCHIVE_COMPLETIONS_FOR_STREAK: true` or `false` unless they already provided that answer. For content id and timestamp, use the defaults above before asking.

**App-Specific Values To Fill In**

Use these defaults unless the target app clearly works differently:

- `COMPLETION_EVENT`: the server-side event/mutation that means a user completed a playable daily item.
- `CONTENT_ID`: default to the Reddit post id for the newly created daily content. This should be a runtime value that changes whenever new daily content is created. In Syllo, each newly posted puzzle schedules its notification with that new Reddit post id.
- `CONTENT_CREATED_AT`: default to that Reddit post's `createdAt`. When recording streak completion, fetch the post by `CONTENT_ID` server-side and use `post.createdAt`, or use the same `createdAt` value persisted during post creation. Do not use the client clock or completion request timestamp.
- `COUNT_ARCHIVE_COMPLETIONS_FOR_STREAK`: ask before starting. If `true`, completing older/archive content records the streak bit for that content's UTC day. If `false`, only current daily content can award streak credit.
- `NEW_CONTENT_NOTIFICATION_DELAY_MS`: default to 60 minutes after content is posted unless the app has a better time.
- `STREAK_NOTIFICATION_TITLE`: example, `Today's challenge is ready!`.
- `STREAK_NOTIFICATION_BODY`: example, `Play now to keep your {{streak}}-day streak alive.`
- `NON_STREAK_NOTIFICATION_BODY`: example, `Jump back in and play today's challenge.`

**Default Content Identity Rules**

For most Devvit games, the notification target and streak day should come from the same daily content object:

- If the app creates one Reddit post per daily game/challenge, use that post id as `CONTENT_ID`.
- Schedule the notification immediately after creating that post, passing `params: { link: post.id }`.
- When a user completes the game, use the current `postId`/`CONTENT_ID` to fetch the post server-side and anchor the streak bit to `post.createdAt`.
- If the app stores daily content metadata in Redis when it posts content, it is also fine to persist `{ contentId, createdAt }` then reuse that server-written `createdAt`.
- Only if the app has no per-day Reddit post should you fall back to a stable app route or stored daily-content id, with a server-written `createdAt` timestamp.

**Architecture To Implement**

Implementation flow:

1. When daily content is created, schedule a `pn` job for the new-content notification.
2. When a user completes content, validate completion server-side.
3. Record the streak bit for the content's canonical UTC day.
4. When the `pn` job runs, page opted-in users.
5. For each opted-in user, compute current streak from Redis.
6. Split recipients into streak and non-streak groups.
7. Enqueue templated notifications with the content link.

**Redis Data Model**

Implement daily streak storage as one Redis bitmap per user per UTC calendar year. This is the same storage shape Syllo uses: a key is scoped to both `userId` and `year`, and each bit in that year's value represents whether the user completed the canonical content for one UTC day.

Use the repo's existing Redis naming style, but default to a versioned key:

```ts
const STREAK_VERSION = 1;
const streaksKey = (userId: string, year: number) =>
  `${STREAK_VERSION}:streaks:${userId}:${year}`;
```

Store one bit per UTC day-of-year:

- Jan 1 is bit `0`.
- Dec 31 is bit `364` in non-leap years.
- Dec 31 is bit `365` in leap years.
- Use Redis `BITFIELD` with `u1` values.
- Read full-year state as a `Buffer` for efficient streak calculation.

Implement helpers equivalent to:

```ts
export function getDayOfYear(date: Date): number {
  const year = date.getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  const current = Date.UTC(year, date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - start) / 86_400_000);
}

export function isBitSet(buffer: Buffer | null, bitIndex: number): boolean {
  if (!buffer || bitIndex < 0) return false;
  const byteIndex = Math.floor(bitIndex / 8);
  if (byteIndex >= buffer.length) return false;
  const bitWithinByte = bitIndex % 8;
  const byte = buffer[byteIndex]!;
  return (byte & (1 << (7 - bitWithinByte))) !== 0;
}
```

Implement Redis helpers:

- `setStreakCompletionBit(userId, dayIndex, year, completed)`.
- `getStreakCompletionBit(userId, dayIndex, year)`.
- `getYearStreakBuffer(userId, year)`.

Validate `userId`, `year`, and `dayIndex` according to the target repo's validation style before touching Redis.

**Streak Service Behavior**

Implement a streak service with these behaviors.

`recordStreakCompletion`

Record streak credit only from the server-side completion path.

Recommended signature:

```ts
type RecordStreakCompletionInput = {
  userId: string;
  contentId: string;
  contentCreatedAt: Date;
  completed?: boolean;
  force?: boolean;
};
```

Rules:

- Default `completed` to `true`.
- If `force !== true` and `completed === false`, do nothing. A failed/incomplete action must not clear a day that was already earned.
- Anchor the streak day to `contentCreatedAt` in UTC, not to the user's device clock or request timestamp.
- Make the write idempotent. Setting the same bit to `1` multiple times must be safe and must not create duplicate counts.
- Respect `COUNT_ARCHIVE_COMPLETIONS_FOR_STREAK`. If `true`, completing content from three days ago sets the bit for that content's UTC day. If `false`, older/archive content should not award streak credit.
- `force` should be reserved for admin/backfill/repair paths.

`getCurrentStreak`

Current streak should be forgiving for daily content:

- A user with no completed streak-worthy days must have streak `0`. Do not initialize new users to `1`.
- After the user's first streak-worthy completion, the streak should become `1`.
- If the user has played today, count backward from today.
- If the user has not played today, count backward from yesterday. This lets a user keep a visible streak alive during the day before they play.
- Continue counting through contiguous set bits.
- Bridge from Jan 1 into the prior year's bitmap when the current-year prefix is contiguous.
- Correctly handle leap years.

`getTotalPlaysForYear` and `getLongestStreakForYear`

Implement these if the app displays profile stats:

- `getTotalPlaysForYear(userId, year = currentUTCYear)`.
- `getLongestStreakForYear(userId, year = currentUTCYear)`.

Do not overbuild all-time stats unless the app needs them.

**Completion Hook**

Find the target app's server-side completion mutation/event. After the app has verified that the user truly completed streak-worthy content, call `recordStreakCompletion`.

The streak write should happen near the app's existing completion writes, such as progress, score, leaderboard, or analytics updates.

Recommended order:

1. Validate `userId` and content id.
2. Validate completion server-side.
3. Persist the app's normal completion state.
4. Record the streak completion.
5. Return the updated state or allow the client to refetch streak state.

Do not record streaks from a client-only event.

**Streak APIs**

Expose server APIs in the target app's API style:

- `getStreak`: returns the current user's numeric streak.
- `getStreakDetails`: returns `{ streak, bestStreak, totalSolved }` if the app needs profile stats.

The client can display these wherever appropriate, but do not create app-specific UI unless requested.

**Push Opt-In API Wrappers**

Use Devvit notifications as the source of truth. This implementation must use Devvit's notifications API from the Devvit SDK, not a custom push system. If the target repo imports directly from `@devvit/notifications`, use that package. In Devvit web server apps, the same API is commonly exposed as `notifications` from `@devvit/web/server`:

```ts
import { notifications } from "@devvit/web/server";

export async function setPushNotificationState(input: { pushState: boolean }) {
  if (input.pushState) {
    await notifications.optInCurrentUser();
  } else {
    await notifications.optOutCurrentUser();
  }
}
```

Expose API methods in the target app's style:

- `getPushState`: calls `notifications.isOptedIn(userId)` and returns `{ pushState: boolean }`.
- `setPushState`: calls `notifications.optInCurrentUser()` or `notifications.optOutCurrentUser()`.

Do not store a separate Redis opt-in boolean. The app can build any opt-in UX around these methods: post-win prompt, settings toggle, onboarding prompt, profile button, or menu action.

**Streak-Aware Push Campaign**

Implement one campaign for new daily content or "play again" notifications.

Use only Devvit's notifications API for sending:

- `notifications.listOptedInUsers` to page the Devvit opted-in audience.
- `notifications.enqueue` to send push notifications.
- Per-recipient `data` for template placeholders.

Do not add service workers, browser Push API subscriptions, external push vendors, custom device-token storage, custom Redis opt-in lists, or app-owned notification delivery queues.

Behavior:

- Page opted-in users with `notifications.listOptedInUsers`.
- For each recipient, compute `getCurrentStreak(userId)` server-side.
- Split recipients into two groups:
  - `streak > 0`: receive streak-preserving copy with template data `{ streak: String(streak) }`.
  - `streak === 0`: receive generic return-to-play copy.
- Enqueue with `notifications.enqueue`.
- Use per-recipient `data` for template placeholders like `{{streak}}`.
- Include the canonical content/post link in each recipient.

Recommended campaign handler shape:

```ts
type CampaignResult = {
  done: boolean;
  cursor: string;
};

async function sendNewContentNotification(input: {
  cursor: string;
  count: number;
  link: string;
}): Promise<CampaignResult> {
  const results = await notifications.listOptedInUsers({
    after:
      input.cursor.trim() === "" || input.cursor === "0"
        ? undefined
        : input.cursor,
    limit: Math.min(1000, Math.max(1, input.count)),
  });

  const streakRecipients = [];
  const freshRecipients = [];

  for (const userId of results.userIds) {
    const streak = await getCurrentStreak(userId);
    if (streak > 0) {
      streakRecipients.push({
        userId,
        link: input.link,
        data: { streak: String(streak) },
      });
    } else {
      freshRecipients.push({
        userId,
        link: input.link,
        data: {},
      });
    }
  }

  await Promise.allSettled([
    streakRecipients.length > 0 &&
      notifications.enqueue({
        title: STREAK_NOTIFICATION_TITLE,
        body: STREAK_NOTIFICATION_BODY,
        recipients: streakRecipients,
      }),
    freshRecipients.length > 0 &&
      notifications.enqueue({
        title: STREAK_NOTIFICATION_TITLE,
        body: NON_STREAK_NOTIFICATION_BODY,
        recipients: freshRecipients,
      }),
  ]);

  return { done: !results.next, cursor: results.next ?? "" };
}
```

Adapt types for the target repo, especially typed Reddit ids like `T2`, `T3`, or `T1` if used.

**Scheduler Job**

Add or reuse one generic push scheduler job. In `devvit.json`, register a task similar to:

```json
{
  "scheduler": {
    "tasks": {
      "pn": {
        "endpoint": "/internal/scheduler/pn"
      }
    }
  }
}
```

If the app already has scheduler routes, use the existing pattern.

The scheduler endpoint should:

- Validate the job body with the repo's validation tool, preferably Zod if already used.
- Accept a discriminated campaign payload, even if the first implementation only supports `new-content`.
- Read push batch config from Redis: `batchSize` and `batchDelayMs`.
- Process one batch.
- If not done, call `scheduler.runJob` again with the same campaign, updated cursor, same params, and `runAt = now + batchDelayMs`.
- Log campaign start, enqueue result, next cursor, and validation failures.

Default batch config:

```ts
const DEFAULT_PN_CONFIG = {
  batchDelayMs: 1_500,
  batchSize: 200,
};
```

Store it in Redis using a versioned config key, for example `v1:config:pn`, and self-heal missing values.

**Scheduling A New-Content Push**

When new daily content is posted or becomes available, schedule:

```ts
await scheduler.runJob({
  name: "pn",
  data: {
    campaign: "new-content",
    cursor: "",
    params: { link: contentId },
  },
  runAt: new Date(Date.now() + NEW_CONTENT_NOTIFICATION_DELAY_MS),
});
```

Use the app's canonical content id as `link`. If the app has a daily content cron, schedule the push from that content creation path. If content is created manually, schedule it from that path too.

**Robustness Requirements**

- Validate all inputs before Redis writes or notification sends.
- Never trust client-reported completion for streak credit.
- Use the daily post's `createdAt` for the streak day, or the server-written daily content `createdAt` if the app does not use per-day Reddit posts.
- Keep completion writes idempotent.
- Keep opt-in state in Devvit notifications, not Redis.
- Cap notification batch size.
- Use scheduler continuation for pagination.
- Avoid private or surprising personalization in notification copy.
- Add enough logging to debug campaign progress.
- If historical completions exist, add a backfill script/job or leave a clear TODO with instructions.

**Tests To Add**

Add tests in the target repo's test style. Cover these cases:

Streak Storage

- Setting a streak bit for one user/year does not affect another user/year.
- `getDayOfYear` returns `0` for Jan 1, `364` for Dec 31 in non-leap years, and `365` for Dec 31 in leap years.
- `isBitSet` reads bits consistently with Redis bitmap ordering.

Current Streak

- Returns `0` when there are no plays.
- Returns `1` only after the first streak-worthy completion.
- Counts backward from today when today is set.
- Counts backward from yesterday when today is not set.
- Stops at the first missing day.
- Bridges from Jan 1 into the previous year when contiguous.
- Handles leap-year prior-year endings.

Completion Writes

- Recording the same completion twice is safe.
- Non-forced `completed: false` does not clear an existing day.
- Forced admin/backfill write can set or clear a bit if that behavior is implemented.
- Completion uses the content timestamp, not the request timestamp.
- If `COUNT_ARCHIVE_COMPLETIONS_FOR_STREAK` is `true`, completing an archive item sets the streak bit for that archive item's UTC content day.
- If `COUNT_ARCHIVE_COMPLETIONS_FOR_STREAK` is `false`, completing an archive item does not award streak credit.

Push Opt-In Wrappers

- `setPushState(true)` calls `notifications.optInCurrentUser`.
- `setPushState(false)` calls `notifications.optOutCurrentUser`.
- `getPushState` calls `notifications.isOptedIn`.
- No custom push provider, browser Push API subscription, or Redis opt-in source of truth is created.

Notification Campaign

- Opted-in users with `currentStreak > 0` receive streak copy with `data.streak`.
- Opted-in users with `currentStreak === 0` receive generic copy.
- Non-opted-in users are not sent notifications.
- Pagination returns the next cursor and marks done when no next page exists.

Scheduler

- The scheduler endpoint validates campaign payloads.
- It processes one batch using configured `batchSize`.
- It schedules a continuation job when `done === false`.
- It does not schedule a continuation when `done === true`.

**Manual Verification Checklist**

After implementation:

- Complete today's content as a logged-in user and confirm the streak increments.
- Start as a new user and confirm the displayed/API streak is `0` before completing any streak-worthy content.
- Complete one streak-worthy item and confirm the displayed/API streak becomes `1`.
- If `COUNT_ARCHIVE_COMPLETIONS_FOR_STREAK` is `true`, complete an archive item as a logged-in user and confirm the app records the streak bit for that archive item's content day.
- If `COUNT_ARCHIVE_COMPLETIONS_FOR_STREAK` is `false`, complete an archive item as a logged-in user and confirm it does not award streak credit.
- Refresh the client and confirm `getStreak` returns the same value.
- Complete the same content again and confirm the streak does not double-count.
- Set up an opted-in test user with a streak and run the new-content campaign; confirm streak copy is sent.
- Set up an opted-in test user without a streak and run the campaign; confirm generic copy is sent.
- Confirm the notification link opens the intended content.
- Confirm a non-opted-in user does not receive a push.
- Confirm scheduler continuation works with a small batch size like `1`.

**Expected Final Response From The Implementing Agent**

When finished, report:

- Files changed and why.
- The target repo's completion path that now records streaks.
- The Redis keys/data model used.
- The scheduler task and campaign payload shape.
- The push opt-in API methods exposed.
- Tests added and test command results.
- Manual verification steps completed or not completed.
- Remaining app-specific TODOs, if any.

\--- END COPY-PASTE PROMPT \---

</details>
