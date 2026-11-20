[**@devvit/reddit v0.15.6-dev**](../../README.md)

***

# Type Alias: UpdateRuleOptions

> **UpdateRuleOptions** = `Partial`\<`Omit`\<`UpdateSubredditRuleRequest`, `"r"` \| `"oldShortName"`\>\> & `object`

New values for an existing rule. All fields are optional. If a field is not provided, the existing value will not be changed.

## Type Declaration

### kind?

> `optional` **kind?**: `"all"` \| `"link"` \| `"comment"`
