[**@devvit/reddit v0.14.4-dev**](../../README.md)

***

# Type Alias: GetModNotesOptions

> **GetModNotesOptions** = `object`

Options for retrieving a user's moderation notes from a subreddit.

## Properties

<a id="before"></a>

### before?

> `optional` **before**: `string`

The pagination cursor before which results should be returned.

***

<a id="filter"></a>

### filter?

> `optional` **filter**: [`ModNoteType`](ModNoteType.md)

The type of moderation notes to return. Defaults to all types.

***

<a id="limit"></a>

### limit?

> `optional` **limit**: `number`

The maximum total number of moderation notes to return.

Accepts at most 100 notes per request. Omit this option to allow the
listing to paginate beyond the first 100 notes.

***

<a id="subreddit"></a>

### subreddit

> **subreddit**: `string`

The subreddit name without the leading `r/`.

***

<a id="user"></a>

### user

> **user**: `string`

The username without the leading `u/`.
