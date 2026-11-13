[**@devvit/public-api v0.15.5-dev**](../README.md)

***

# Type Alias: RunJob\<Data\>

> **RunJob**\<`Data`\> = (`job`) => `Promise`\<`string`\>

Schedule a new job to run at a specific time or on a cron schedule

## Type Parameters

<a id="data"></a>

### Data

`Data` *extends* [`JSONObject`](JSONObject.md) \| `undefined`

## Parameters

### job

[`ScheduledJobOptions`](ScheduledJobOptions.md)\<`Data`\> \| [`ScheduledCronJobOptions`](ScheduledCronJobOptions.md)\<`Data`\>

The job to schedule

## Returns

`Promise`\<`string`\>

The id of the scheduled job
