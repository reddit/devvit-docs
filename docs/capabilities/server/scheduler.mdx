import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Scheduler

The scheduler allows your app to perform actions at specific times, such as sending private messages, tracking upvotes, or scheduling timeouts for user actions. You can schedule both recurring and one-off jobs using the scheduler.

---

## Scheduling recurring jobs

To create a regularly occurring event in your app, declare a task in your `devvit.json` and handle the event in your server logic.

### 1. Add a recurring task to `devvit.json`

Ensure the endpoint follows the format `/internal/.+` and specify a `cron` schedule:

```json title="devvit.json"
"scheduler": {
  "tasks": {
    "regular-interval-example-task": {
      "endpoint": "/internal/scheduler/regular-interval-task-example",
      "cron": "*/1 * * * *"
    }
  }
},
```

- The `cron` parameter uses the standard [UNIX cron format](https://en.wikipedia.org/wiki/Cron):
  ```
  # * * * * *
  # | | | | |
  # | | | | day of the week (0–6, Sunday to Saturday; 7 is also Sunday on some systems)
  # | | | month (1–12)
  # | | day of the month (1–31)
  # | hour (0–23)
  # minute (0–59)
  ```
- We recommend using [Cronitor](https://crontab.guru/) to build cron strings.

### 2. Handle the event in your server

<Tabs variant="pill" groupId="http-server-framework" defaultValue="hono" values={[
  { label: 'Hono', value: 'hono' },
  { label: 'Express', value: 'express' },
]}>
<TabItem value="hono">

```ts title="/server/index.ts"
import type { TaskRequest, TaskResponse } from "@devvit/web/server";

app.post("/internal/scheduler/regular-interval-task-example", async (c) => {
  const _input = await c.req.json<TaskRequest>();
  console.log(`Handle event for cron example at ${new Date().toISOString()}!`);
  // Handle the event here
  return c.json<TaskResponse>({ status: "ok" }, 200);
});
```

</TabItem>
<TabItem value="express">

```ts title="/server/index.ts"
import type { TaskRequest, TaskResponse } from "@devvit/web/server";

app.post<string, never, TaskResponse, TaskRequest>(
  "/internal/scheduler/regular-interval-task-example",
  async (_req, res) => {
    console.log(
      `Handle event for cron example at ${new Date().toISOString()}!`,
    );
    // Handle the event here
    res.status(200).json({ status: "ok" });
  },
);
```

</TabItem>
</Tabs>

---

## Managing recurring jobs across deployments

Starting with Devvit 0.14.6, recurring jobs created in app code are preserved across deployments. Jobs configured with `cron` in `devvit.json` are rescheduled on installation and upgrade.

| How the job is created                   | What happens on deployment                                                          |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| A task with `cron` in `devvit.json`      | Devvit replaces configuration-managed recurring jobs with the configured schedules. |
| `scheduler.runJob({ name, cron, data })` | The job keeps its stored schedule and data until your app cancels it.               |

### Create a recurring job at runtime

Register the task in `devvit.json` without a `cron` value, and add its server handler as shown in [Scheduling recurring jobs](#scheduling-recurring-jobs):

```json title="devvit.json"
{
  "scheduler": {
    "tasks": {
      "refresh-summary": {
        "endpoint": "/internal/scheduler/refresh-summary"
      }
    }
  }
}
```

Use `scheduler.runJob()` to choose the schedule in your app code. Check for an existing job before creating another:

```ts title="server/index.ts"
import { scheduler, ScheduledActionManager } from "@devvit/web/server";

export async function ensureSummaryJob() {
  const jobs = await scheduler.listJobs([ScheduledActionManager.USER]);
  const existing = jobs.find(
    (job) => job.name === "refresh-summary" && "cron" in job,
  );

  if (existing) {
    return existing.id;
  }

  return scheduler.runJob({
    name: "refresh-summary",
    cron: "0 2 * * *",
    data: { version: 1 },
  });
}
```

`ScheduledActionManager.USER` selects jobs managed by your app code. It does not select a Reddit user or change the identity that runs the task. Calling `listJobs()` without a filter returns jobs from all managers.

Call setup from a controlled application action. The check above prevents duplicate jobs on sequential calls; coordinate concurrent setup calls in your app to avoid creating duplicates.

### Update or remove a runtime schedule

Changing the code that originally created a job does not change its stored schedule or data. Cancel the job with `scheduler.cancelJob(jobId)` and create a replacement with `runJob()`. There is no update-in-place method. See [Cancel a scheduled job](#cancel-a-scheduled-job) for a complete example.

Keep task registrations and handlers available for jobs that survive upgrades. Avoid recreating the same runtime jobs on every installation or upgrade without first checking for existing jobs.

:::note
In Devvit 0.14.8, removing the final `cron` task from `devvit.json` does not automatically cancel the previously configured jobs. Explicitly cancel obsolete jobs when making that change.
:::

---

## Scheduling one-off jobs at runtime

One-off tasks must also be declared in `devvit.json`.

### 1. Add the tasks to `devvit.json`

```json title='devvit.json'
"scheduler": {
  "tasks": {
    "regular-interval-task-example": {
      "endpoint": "/internal/scheduler/regular-interval-task-example",
      "cron": "*/1 * * * *"
    },
    "one-off-task-example": {
      "endpoint": "/internal/scheduler/one-off-task-example"
    }
  }
}
```

### 2. Schedule a job at runtime

Example usage:

<Tabs variant="pill" groupId="http-server-framework" defaultValue="hono" values={[
  { label: 'Hono', value: 'hono' },
  { label: 'Express', value: 'express' },
]}>
<TabItem value="hono">

```ts title="/server/index.ts"
import type { TaskRequest, TaskResponse } from "@devvit/web/server";

app.post("/internal/scheduler/one-off-task-example", async (c) => {
  const { data } = await c.req.json<TaskRequest<{ postId: string }>>();
  const { postId } = data!;
  const oneMinuteFromNow = new Date(Date.now() + 1000 * 60);

  const scheduledJob: ScheduledJob = {
    id: `job-one-off-for-post${postId}`,
    name: "one-off-task-example",
    data: { postId },
    runAt: oneMinuteFromNow,
  };

  const jobId = await scheduler.runJob(scheduledJob);
  console.log(`Scheduled job ${jobId} for post ${postId}`);
  console.log(`Handle event for one-off event at ${new Date().toISOString()}!`);
  // Handle the event here
  return c.json<TaskResponse>({ status: "ok" }, 200);
});
```

</TabItem>
<TabItem value="express">

```ts title="/server/index.ts"
import type { TaskRequest, TaskResponse } from "@devvit/web/server";

app.post<string, never, TaskResponse, TaskRequest<{ postId: string }>>(
  "/internal/scheduler/one-off-task-example",
  async (req, res) => {
    const { data } = req.body;
    const { postId } = data!;
  const oneMinuteFromNow = new Date(Date.now() + 1000 * 60);

  const scheduledJob: ScheduledJob = {
    id: `job-one-off-for-post${postId}`,
    name: "one-off-task-example",
    data: { postId },
    runAt: oneMinuteFromNow,
  };

  const jobId = await scheduler.runJob(scheduledJob);
  console.log(`Scheduled job ${jobId} for post ${postId}`);
  console.log(`Handle event for one-off event at ${new Date().toISOString()}!`);
  // Handle the event here
  res.status(200).json({ status: "ok" });
  },
);
```

</TabItem>
</Tabs>

## Cancel a scheduled job

Use the job ID to cancel a scheduled action and remove it from your app. This example shows how to set up a moderator menu action to cancel a job.

### 1. Add menu item to `devvit.json`

```json title="devvit.json"
{
  "menu": {
    "items": [
      {
        "label": "Cancel Job",
        "description": "Cancel a scheduled job",
        "forUserType": "moderator",
        "location": "post",
        "endpoint": "/internal/menu/cancel-job"
      }
    ]
  },
  "permissions": {
    "redis": true
  }
}
```

### 2. Handle the menu action in your server

<Tabs variant="pill" groupId="http-server-framework" defaultValue="hono" values={[
  { label: 'Hono', value: 'hono' },
  { label: 'Express', value: 'express' },
]}>
<TabItem value="hono">

```ts title="/server/index.ts"
import type { MenuItemRequest, UiResponse } from "@devvit/web/shared";

app.post("/internal/menu/cancel-job", async (c) => {
  try {
    // Get the post ID from the menu action request
    const { targetId: postId } = await c.req.json<MenuItemRequest>();

    // Retrieve the job ID from Redis (stored when the job was created)
    const jobId = await redis.get(`job:${postId}`);

    if (!jobId) {
      return c.json<UiResponse>({
        showToast: {
          text: "No scheduled job found for this post",
          appearance: "neutral",
        },
      });
    }

    // Cancel the scheduled job
    await scheduler.cancelJob(jobId);

    // Clean up the stored job ID
    await redis.del(`job:${postId}`);

    return c.json<UiResponse>({
      showToast: {
        text: "Successfully cancelled the scheduled job",
        appearance: "success",
      },
    });
  } catch (error) {
    console.error("Error cancelling job:", error);
    return c.json<UiResponse>({
      showToast: {
        text: "Failed to cancel job",
        appearance: "neutral",
      },
    });
  }
});
```

</TabItem>
<TabItem value="express">

```ts title="/server/index.ts"
import type { MenuItemRequest, UiResponse } from "@devvit/web/shared";

app.post<string, never, UiResponse, MenuItemRequest>(
  "/internal/menu/cancel-job",
  async (req, res) => {
    try {
      // Get the post ID from the menu action request
      const postId = req.body.targetId;

    // Retrieve the job ID from Redis (stored when the job was created)
    const jobId = await redis.get(`job:${postId}`);

      if (!jobId) {
        return res.json({
          showToast: {
            text: "No scheduled job found for this post",
            appearance: "neutral",
          },
        });
      }

    // Cancel the scheduled job
    await scheduler.cancelJob(jobId);

    // Clean up the stored job ID
    await redis.del(`job:${postId}`);

      return res.json({
        showToast: {
          text: "Successfully cancelled the scheduled job",
          appearance: "success",
        },
      });
    } catch (error) {
      console.error("Error cancelling job:", error);
      return res.json({
        showToast: {
          text: "Failed to cancel job",
          appearance: "neutral",
        },
      });
    }
  },
);
```

</TabItem>
</Tabs>

### Example: Storing a job ID when creating a job

When you create a scheduled job, store its ID in Redis so you can reference it later

<Tabs variant="pill" groupId="http-server-framework" defaultValue="hono" values={[
  { label: 'Hono', value: 'hono' },
  { label: 'Express', value: 'express' },
]}>
<TabItem value="hono">

```ts title="/server/index.ts"
type ScheduleActionRequest = { postId: string; delayMinutes: number };
type ScheduleActionResponse = { jobId: string; message: string };

app.post("/api/schedule-action", async (c) => {
  const { postId, delayMinutes } =
    await c.req.json<ScheduleActionRequest>();
  const runAt = new Date(Date.now() + delayMinutes * 60 * 1000);

  const scheduledJob: ScheduledJob = {
    id: `job-${postId}-${Date.now()}`,
    name: "one-off-task-example",
    data: { postId },
    runAt,
  };

  const jobId = await scheduler.runJob(scheduledJob);

  // Store the job ID in Redis for later cancellation
  await redis.set(`job:${postId}`, jobId);

  return c.json<ScheduleActionResponse>({
    jobId,
    message: "Job scheduled successfully",
  });
});
```

</TabItem>
<TabItem value="express">

```ts title="/server/index.ts"
type ScheduleActionRequest = { postId: string; delayMinutes: number };
type ScheduleActionResponse = { jobId: string; message: string };

app.post<string, never, ScheduleActionResponse, ScheduleActionRequest>(
  "/api/schedule-action",
  async (req, res) => {
    const { postId, delayMinutes } = req.body;
  const runAt = new Date(Date.now() + delayMinutes * 60 * 1000);

  const scheduledJob: ScheduledJob = {
    id: `job-${postId}-${Date.now()}`,
    name: "one-off-task-example",
    data: { postId },
    runAt,
  };

  const jobId = await scheduler.runJob(scheduledJob);

  // Store the job ID in Redis for later cancellation
  await redis.set(`job:${postId}`, jobId);

    return res.json({
      jobId,
      message: "Job scheduled successfully",
    });
  },
);
```

</TabItem>
</Tabs>

## List jobs

This example shows how to handle a request within your server/index.ts to list your scheduled jobs and return them to the client.

<Tabs variant="pill" groupId="http-server-framework" defaultValue="hono" values={[
  { label: 'Hono', value: 'hono' },
  { label: 'Express', value: 'express' },
]}>
<TabItem value="hono">

```ts title="/server/index.ts"
type ListJobsSuccessResponse = {
  status: "success";
  jobs: (ScheduledJob | ScheduledCronJob)[];
  count: number;
};
type ListJobsErrorResponse = { status: "error"; message: string };
type ListJobsResponse = ListJobsSuccessResponse | ListJobsErrorResponse;

app.get("/api/list-jobs", async (c) => {
  try {
    const jobs: (ScheduledJob | ScheduledCronJob)[] =
      await scheduler.listJobs();

    console.log(`[LIST] Found ${jobs.length} scheduled jobs`);

    return c.json<ListJobsResponse>({
      status: "success",
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error(`[LIST] Error listing jobs:`, error);
    return c.json<ListJobsResponse>(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Failed to list jobs",
      },
      500,
    );
  }
});
```

</TabItem>
<TabItem value="express">

```ts title="/server/index.ts"
type ListJobsSuccessResponse = {
  status: "success";
  jobs: (ScheduledJob | ScheduledCronJob)[];
  count: number;
};
type ListJobsErrorResponse = { status: "error"; message: string };
type ListJobsResponse = ListJobsSuccessResponse | ListJobsErrorResponse;

app.get<string, never, ListJobsResponse, never>(
  "/api/list-jobs",
  async (_req, res): Promise<void> => {
    try {
      const jobs: (ScheduledJob | ScheduledCronJob)[] =
        await scheduler.listJobs();

    console.log(`[LIST] Found ${jobs.length} scheduled jobs`);

      res.json({
        status: "success",
        jobs,
        count: jobs.length,
      });
    } catch (error) {
      console.error(`[LIST] Error listing jobs:`, error);
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to list jobs",
      });
    }
  },
);
```

</TabItem>
</Tabs>

## Faster scheduler

:::note
This feature is experimental, which means the design is not final but it's still available for you to use.
:::

Scheduled jobs currently perform one scheduled run per minute. To go faster, you can now run jobs every second by adding seconds granularity to your cron expression.

```tsx
await scheduler.runJob({
  name: "run_every_30_seconds",
  cron: "*/30 * * * * *",
});
```

How frequent a scheduled job runs will depend on how long the job takes to complete and how many jobs are running in parallel. This means a job may take a bit longer than scheduled, but the overall resolution should be better than a minute.

---

## Limitations

_Limits are per installation of an app:_

1. An installation can have up to **10 live recurring actions**.
2. The `runJob()` method enforces two rate limits when creating actions:
   - **Creation rate:** Up to 60 calls to `runJob()` per minute
   - **Delivery rate:** Up to 60 deliveries per minute
