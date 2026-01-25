[**@devvit/public-api v0.12.9-dev**](../README.md)

***

# Type Alias: ScheduledCronJobOptions\<T\>

> **ScheduledCronJobOptions**\<`T`\> = `object`

## Type Parameters

### T

`T` *extends* [`JSONObject`](JSONObject.md) \| `undefined` = [`JSONObject`](JSONObject.md) \| `undefined`

## Properties

<a id="cron"></a>

### cron

> **cron**: `string`

The cron string of when this job should run

***

<a id="data"></a>

### data?

> `optional` **data**: `T`

Additional data passed in by the scheduler client

***

<a id="name"></a>

### name

> **name**: `string`

The name of the scheduled job type
