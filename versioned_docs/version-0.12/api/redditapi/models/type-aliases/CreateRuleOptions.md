[**@devvit/public-api v0.12.24-dev**](../../README.md)

***

# Type Alias: CreateRuleOptions

> **CreateRuleOptions** = `Omit`\<`AddSubredditRuleRequest`, `"r"` \| `"kind"` \| `"violationReason"`\> & `object`

Options for creating a new subreddit rule.

## Type declaration

### kind

> **kind**: `"all"` \| `"link"` \| `"comment"`

### violationReason?

> `optional` **violationReason**: `string`
