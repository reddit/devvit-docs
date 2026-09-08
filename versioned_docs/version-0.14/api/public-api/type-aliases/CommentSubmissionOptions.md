[**@devvit/public-api v0.14.3-dev**](../README.md)

***

# Type Alias: CommentSubmissionOptions

> **CommentSubmissionOptions** = \{ `runAs`: `"USER"` \| `"APP"`; `text`: `string`; \} \| \{ `richtext`: `object` \| [`RichTextBuilder`](../classes/RichTextBuilder.md); `runAs`: `"USER"` \| `"APP"`; \}

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

\{ `richtext`: `object` \| [`RichTextBuilder`](../classes/RichTextBuilder.md); `runAs`: `"USER"` \| `"APP"`; \}

### richtext

> **richtext**: `object` \| [`RichTextBuilder`](../classes/RichTextBuilder.md)

The comment body as rich text.

### runAs?

> `optional` **runAs**: `"USER"` \| `"APP"`

The account used to create the comment. Defaults to the app account.
This option is ignored by [Comment.edit](../classes/Comment.md#edit).
