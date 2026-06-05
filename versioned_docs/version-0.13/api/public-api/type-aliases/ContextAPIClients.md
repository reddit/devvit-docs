[**@devvit/public-api v0.13.3-dev**](../README.md)

***

# Type Alias: ContextAPIClients

> **ContextAPIClients** = `object`

## Properties

<a id="assets"></a>

### assets

> **assets**: `AssetsClient`

A client for resolving static assets to public URLs

***

<a id="cache"></a>

### cache

> **cache**: `CacheHelper`

**`Experimental`**

The cache helper will let you cache JSON-able objects in your devvit apps for a limited amount of time.

Under the covers, It's just Redis, so you do need to enable the redis feature. This provides a pattern for e.g. fetching
remote calls without overwhelming someone's server.

```ts
Devvit.configure({
  redis: true, // Enable access to Redis
});

/// ...

let component = (context) => {
  let cached = context.cache(async () => {
    let rsp = await fetch("https://google.com")
    return rsp.body
  },
  {
    key: "some-fetch",
    ttl: 10_000 // millis
  }
  doSomethingWith(cached);
  return <text>yay</text>
}
```

***

<a id="media"></a>

### media

> **media**: [`MediaPlugin`](MediaPlugin.md)

A client for media API

***

<a id="reddit"></a>

### reddit

> **reddit**: `RedditAPIClient`

A client for the Reddit API

***

<a id="redis"></a>

### redis

> **redis**: [`RedisClient`](RedisClient.md)

A client for the Redis API

***

<a id="scheduler"></a>

### scheduler

> **scheduler**: [`Scheduler`](Scheduler.md)

A client for the Scheduler API

***

<a id="settings"></a>

### settings

> **settings**: [`SettingsClient`](SettingsClient.md)

A client for the Settings API

***

<a id="ui"></a>

### ui

> **ui**: [`UIClient`](UIClient.md)

A client for the User Interface API
