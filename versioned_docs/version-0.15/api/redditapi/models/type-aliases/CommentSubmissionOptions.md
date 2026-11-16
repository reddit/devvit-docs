[**@devvit/reddit v0.15.4-dev**](../../README.md)

***

# Type Alias: CommentSubmissionOptions

> **CommentSubmissionOptions** = \{ `runAs?`: `"USER"` \| `"APP"`; `text`: `string`; \} \| \{ `richtext`: `object` \| `RichTextBuilder`; `runAs?`: `"USER"` \| `"APP"`; \}

Options for submitting a comment body.

## Union Members

### Type Literal

\{ `runAs?`: `"USER"` \| `"APP"`; `text`: `string`; \}

#### runAs?

> `optional` **runAs?**: `"USER"` \| `"APP"`

The account used to create the comment. Defaults to the app account.
This option is ignored by [Comment.edit](../classes/Comment.md#edit).

#### text

> **text**: `string`

The comment body in Markdown.

***

### Type Literal

\{ `richtext`: `object` \| `RichTextBuilder`; `runAs?`: `"USER"` \| `"APP"`; \}

#### richtext

> **richtext**: `object` \| `RichTextBuilder`

The comment body as rich text.

#### runAs?

> `optional` **runAs?**: `"USER"` \| `"APP"`

The account used to create the comment. Defaults to the app account.
This option is ignored by [Comment.edit](../classes/Comment.md#edit).
