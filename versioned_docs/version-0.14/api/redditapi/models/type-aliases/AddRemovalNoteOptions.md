[**@devvit/reddit v0.14.4-dev**](../../README.md)

***

# Type Alias: AddRemovalNoteOptions

> **AddRemovalNoteOptions** = `object`

Options for adding a note that explains why posts or comments were removed.

## Properties

<a id="itemids"></a>

### itemIds

> **itemIds**: `string`[]

The IDs of the removed posts or comments.

***

<a id="modnote"></a>

### modNote?

> `optional` **modNote**: `string`

The note explaining the removal. The maximum length is 100 characters.

The plugin omits this field when it is `undefined` or an empty string.

***

<a id="reasonid"></a>

### reasonId

> **reasonId**: `string`

The removal reason identifier, or an empty string when no removal reason is
used.
