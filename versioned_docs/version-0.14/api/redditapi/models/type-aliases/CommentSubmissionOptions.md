[**@devvit/reddit v0.14.4-dev**](../../README.md)

***

# Type Alias: CommentSubmissionOptions

> **CommentSubmissionOptions** = \{ `runAs`: `"USER"` \| `"APP"`; `text`: `string`; \} \| \{ `richtext`: `object` \| `RichTextBuilder`; `runAs`: `"USER"` \| `"APP"`; \}

Options for submitting a comment body.

## Type declaration

\{ `runAs`: `"USER"` \| `"APP"`; `text`: `string`; \}

### runAs?

> `optional` **runAs**: `"USER"` \| `"APP"`

The account used to create the comment. Defaults to the app account.
This option is ignored by [Comment.edit](../classes/Comment.md#edit).

### text

> **text**: `string`

The comment body in Markdown.

\{ `richtext`: `object` \| `RichTextBuilder`; `runAs`: `"USER"` \| `"APP"`; \}

### richtext

> **richtext**: `object` \| `RichTextBuilder`

The comment body as rich text.

### runAs?

> `optional` **runAs**: `"USER"` \| `"APP"`

The account used to create the comment. Defaults to the app account.
This option is ignored by [Comment.edit](../classes/Comment.md#edit).
