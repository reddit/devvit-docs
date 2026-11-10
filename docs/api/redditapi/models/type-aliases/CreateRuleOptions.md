[**@devvit/reddit v0.15.4-dev**](../../README.md)

***

# Type Alias: CreateRuleOptions

> **CreateRuleOptions** = `Omit`\<`AddSubredditRuleRequest`, `"r"` \| `"kind"` \| `"violationReason"` \| `"description"`\> & `object`

Options for creating a new subreddit rule.

## Type Declaration

### description?

> `optional` **description?**: `string`

The description of the rule. Defaults to an empty string.

### kind

> **kind**: `"all"` \| `"link"` \| `"comment"`

### violationReason?

> `optional` **violationReason?**: `string`
