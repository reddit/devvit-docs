[**@devvit/reddit v0.14.4-dev**](../../README.md)

***

# Type Alias: SearchPostsOptions

> **SearchPostsOptions** = [`ListingFetchOptions`](ListingFetchOptions.md) & `object`

## Type declaration

### query

> **query**: `string`

Search query.

### sort?

> `optional` **sort**: `"relevance"` \| `"hot"` \| `"top"` \| `"new"` \| `"comments"`

How to sort the search results. Defaults to `relevance`.

### subredditName?

> `optional` **subredditName**: `string`

The subreddit to search without the `r/` prefix. If specified, restricts
the search to posts in this subreddit.

### timeframe?

> `optional` **timeframe**: `"hour"` \| `"day"` \| `"week"` \| `"month"` \| `"year"` \| `"all"`

Limit search results to a timeframe. Defaults to `all`.
