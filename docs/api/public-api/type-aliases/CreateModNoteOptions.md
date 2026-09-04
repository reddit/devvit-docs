[**@devvit/public-api v0.14.4-dev**](../README.md)

***

# Type Alias: CreateModNoteOptions

> **CreateModNoteOptions** = `object`

Options for adding a moderation note to a user.

## Properties

<a id="label"></a>

### label?

> `optional` **label**: [`UserNoteLabel`](UserNoteLabel.md)

A label that categorizes the moderation note.

***

<a id="note"></a>

### note

> **note**: `string`

The text of the moderation note. The maximum length is 250 characters.

***

<a id="redditid"></a>

### redditId?

> `optional` **redditId**: `T1` \| `T3`

The comment or post associated with the moderation note.

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
