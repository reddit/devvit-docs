[**@devvit/public-api v0.14.4-dev**](../README.md)

***

# Type Alias: GetDuplicatesOptions

> **GetDuplicatesOptions** = [`ListingFetchOptions`](ListingFetchOptions.md) & `object`

## Type declaration

### crosspostsOnly?

> `optional` **crosspostsOnly**: `boolean`

Only return duplicates that are crossposting this post.

### postId

> **postId**: `T3`

The post identifier.

### show?

> `optional` **show**: `string`

Use `"all"` to include results hidden by the account's preferences.

### sort?

> `optional` **sort**: `"num_comments"` \| `"new"`

One of: "num_comments", "new"

### subredditName?

> `optional` **subredditName**: `string`

Limit search to the given subreddit name. The r/ prefix is optional.
