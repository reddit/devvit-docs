[**@devvit/public-api v0.12.22-dev**](../../README.md)

***

# Type Alias: GetDuplicatesOptions

> **GetDuplicatesOptions** = [`ListingFetchOptions`](ListingFetchOptions.md) & `object`

## Type declaration

### crosspostsOnly?

> `optional` **crosspostsOnly**: `boolean`

Only return duplicates that are crossposting this post.

### postId

> **postId**: `T3ID`

Post ID with t3_ prefix (e.g. `t3_abc123`). The prefix is stripped internally.

### show?

> `optional` **show**: `string`

Adding the string "all" will show all results regardless of user preferences.

### sort?

> `optional` **sort**: `"num_comments"` \| `"new"`

One of: "num_comments", "new"

### subredditName?

> `optional` **subredditName**: `string`

Limit search to the given subreddit name. The r/ prefix is optional.
