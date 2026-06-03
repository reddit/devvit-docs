# Using Redis

Redis is the main way to store app data in Devvit. It works well for leaderboards, player state, moderation queues, cached API responses, and other data your app needs across requests.

This guide provides practical tips to help you build Redis-backed features that are reliable, easy to maintain, and ready for Reddit communities. For the full command list and API details, see the [Redis capability reference](../../capabilities/server/redis.mdx).

## Data storage

Each installation of your app has its own Redis storage. An app installed on one subreddit does not share Redis data with the same app installed on another subreddit.

This is the right model for most community games, mod tools, settings, leaderboards, and user state. Build with the assumption that each subreddit installation is its own environment.

If your app needs cross-community data, like a global leaderboard or analytics rollup, plan for that directly. Use a shared service through [HTTP Fetch](../../capabilities/server/http-fetch.mdx) instead of assuming every installation can read the same keys.

## Key design

Devvit Redis does not support listing every key in an installation. If your app loses track of a key name, it cannot discover that key later with a global scan.

Avoid scattering related data across too many independent keys:

```ts
await redis.set(`profile:${userId}`, JSON.stringify(profile));
await redis.set(`profile:${otherUserId}`, JSON.stringify(otherProfile));
```

Use stable collection keys when you need to read or update related records:

```ts
await redis.hSet('app:user_profiles', {
  [userId]: JSON.stringify(profile),
  [otherUserId]: JSON.stringify(otherProfile),
});

const profiles = await redis.hScan('app:user_profiles', 0);
```

This gives your app a known place to look and lets you iterate within the collection with `hScan` or `hKeys`.

## Data structures

Redis in Devvit supports strings, hashes, sorted sets, numbers, bitfields, and transactions. It does not support every Redis data type, including plain sets and lists.

Use these patterns when you need set-like or queue-like behavior.

| Use case | Recommended pattern |
| --- | --- |
| Unique unordered collection | Use a sorted set and give every member the same score, like `0`. |
| Leaderboard | Use a sorted set with the score as the ranking value. |
| FIFO queue | Use a sorted set with a timestamp score, read the oldest entries with `zRange`, then remove processed entries with `zRem`. |
| Dense flags or compact counters | Use `bitfield` when you need bitmap-style storage for many small values. |
| Temporary data | Use `expire` for short-lived keys, or remove old sorted set entries by score. |

For command-specific behavior and limits, see the [supported Redis commands](../../capabilities/server/redis.mdx#supported-redis-commands).

## Large values

:::note
Before you choose an external storage provider, make sure it follows the [HTTP Fetch policy](../../capabilities/server/http-fetch-policy.md).
:::

Redis is best for small, frequently accessed app state. Use a dedicated blob or object storage service for large objects, generated files, long archives, or data your app reads as a whole instead of querying field by field. Devvit apps can enable the [Blob Plugin](../../api/public-api/type-aliases/Configuration.md#blob), and you can connect to external storage services with [HTTP Fetch](../../capabilities/server/http-fetch.mdx). Store the object ID and lightweight metadata in Redis so your app can still look things up quickly.

Each Redis installation has a 500 MB storage limit and a 5 MB request size limit. If your app stores large JSON objects, long text values, or historical records that still belong in Redis, consider using `redisCompressed`.

```ts
import { redisCompressed } from '@devvit/redis';

await redisCompressed.set('cache:heavy_payload', JSON.stringify(payload));
```

The compressed client compresses supported writes when compression saves space, and decompresses those values on supported reads.

**Tip**: Do not mix `redis` and `redisCompressed` on the same keys. Data written by `redisCompressed` should be read with `redisCompressed`. To migrate existing data, read the old values with the standard client and write them back with the compressed client. For a complete migration example, see [Compression](../../capabilities/server/redis.mdx#compression-experimental).

## Shared state

Devvit app requests are stateless and can run concurrently. Popular posts, games, comment triggers, and moderator actions can all cause multiple requests to update the same data at the same time.

Use Redis transactions when correctness depends on reading a value, checking it, and writing a new value based on the result.

Good candidates for transactions include:

- Spending points, coins, inventory, or other balances.
- Claiming a limited reward where only one user should win.
- Enforcing one vote, entry, redemption, or action per user.
- Updating multiple related keys that must stay in sync.

You usually do not need a transaction for single-command atomic operations, like `incrBy`, `hIncrBy`, or `zIncrBy`, unless the update depends on a separate read or validation step.

```ts
async function deductBalance(userId: string, cost: number): Promise<boolean> {
  const key = `user:${userId}:balance`;
  const txn = await redis.watch(key);

  const currentRaw = await txn.get(key);
  const current = currentRaw ? Number.parseInt(currentRaw, 10) : 0;

  if (current < cost) {
    await txn.unwatch();
    return false;
  }

  await txn.multi();
  await txn.set(key, String(current - cost));

  const result = await txn.exec();
  return result !== null;
}
```

Transactions are limited to 20 concurrent transaction blocks per installation, and transaction execution has a 5-second timeout. Always call `unwatch()` or `discard()` when your code exits early before `exec()`.

For more details, see [Transactions](../../capabilities/server/redis.mdx#transactions).

## Quota failures

When an installation reaches the Redis storage limit, write operations can fail. Treat Redis writes as operations that may need a user-facing fallback.

A good failure path should:

- Prevent the failed write from crashing the request.
- Keep read-only behavior working where possible.
- Tell the user or moderator what happened and which actions are temporarily unavailable.

```ts
type WriteResult =
  | { ok: true }
  | { ok: false; reason: 'storage-quota' }
  | { ok: false; reason: 'unknown'; message: string };

async function savePlayerProfile(userId: string, profile: PlayerProfile): Promise<WriteResult> {
  try {
    await redis.hSet('app:player_profiles', {
      [userId]: JSON.stringify(profile),
    });

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Redis error';
    const normalized = message.toLowerCase();

    if (normalized.includes('quota') || normalized.includes('storage')) {
      return { ok: false, reason: 'storage-quota' };
    }

    return { ok: false, reason: 'unknown', message };
  }
}
```

When storage is full, avoid deleting arbitrary data at write time. Make cleanup predictable: use TTLs for temporary keys, cap sorted sets to the number of entries you actually display, and run scheduled cleanup jobs for old records.

## Scheduled maintenance

Large migrations, leaderboard maintenance, and cleanup jobs can exceed request time limits if they process everything in one request. Use the scheduler to process a bounded batch, save the cursor or progress marker, and schedule the next batch.

This pattern works well for:

- Migrating uncompressed data to `redisCompressed`.
- Rebuilding derived indexes.
- Cleaning up old sorted set entries.
- Backfilling new fields in large hashes.

The Redis reference includes a full scheduled migration example. The Scheduler reference covers recurring and one-off jobs, including platform limits for `runJob()`.

- [Redis migration example](../../capabilities/server/redis.mdx#migration-example)
- [Scheduler](../../capabilities/server/scheduler.mdx)

## Platform limits

Design around these limits early so your app stays responsive as more people use it.

| Platform behavior | Limit | Best practice |
| --- | --- | --- |
| Command throughput | 40,000 commands per second per installation | Avoid one Redis call per item in hot loops. Use batch commands such as `mGet`, `mSet`, and hash writes where they fit. |
| Pipelining | Not supported | Reduce round trips by grouping related fields under hashes or compact JSON values. |
| Storage | 500 MB per installation | Use `redisCompressed` for large values, expire temporary data, and cap unbounded histories. |
| Request size | 5 MB | Store large datasets as multiple records and process them in batches. |
| Transactions | 20 concurrent transaction blocks; 5-second execution timeout | Keep transaction logic small and release transactions with `exec`, `discard`, or `unwatch`. |
