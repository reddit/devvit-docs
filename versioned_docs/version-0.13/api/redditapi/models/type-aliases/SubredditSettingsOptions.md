[**@devvit/public-api v0.13.1-dev**](../../README.md)

***

# Type Alias: SubredditSettingsOptions

> **SubredditSettingsOptions** = `Partial`\<[`SubredditSettings`](SubredditSettings.md)\> & `object`

Optional overrides for subreddit settings. Only provided fields are applied;
the rest remain unchanged when calling [Subreddit.updateSettings](../classes/Subreddit.md#updatesettings).

## Type declaration

### description?

> `optional` **description**: `string`

Subreddit description (raw markdown). Appears in the sidebar of the subreddit.

### title?

> `optional` **title**: `string`

Subreddit title.

### type?

> `optional` **type**: [`SubredditType`](SubredditType.md)

Subreddit type (e.g. public, private, restricted).
