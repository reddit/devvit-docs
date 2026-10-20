[**@devvit/reddit v0.15.0**](../../README.md)

***

# Type Alias: UpdateRuleOptions

> **UpdateRuleOptions** = `Partial`\<`Omit`\<`UpdateSubredditRuleRequest`, `"r"` \| `"oldShortName"`\>\> & `object`

New values for an existing rule. All fields are optional. If a field is not provided, the existing value will not be changed.

## Type declaration

### kind?

> `optional` **kind**: `"all"` \| `"link"` \| `"comment"`
