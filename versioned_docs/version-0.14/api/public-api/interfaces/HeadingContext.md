[**@devvit/public-api v0.13.12-dev**](../README.md)

***

# Interface: HeadingContext

## Borrows

RawTextContainer

## Borrows

LinkContainer

## Extends

- [`RawTextContainer`](../type-aliases/RawTextContainer.md)\<`HeadingContext`\>.[`LinkContainer`](../type-aliases/LinkContainer.md)\<`HeadingContext`\>

## Methods

<a id="commentlink"></a>

### commentLink()

> **commentLink**(`opts`): `HeadingContext`

Append a link to a Reddit Comment

#### Parameters

##### opts

[`RedditPermalinkOptions`](../type-aliases/RedditPermalinkOptions.md)

[CommentLinkOptions](../type-aliases/CommentLinkOptions.md)

#### Returns

`HeadingContext`

#### Inherited from

`LinkContainer.commentLink`

***

<a id="link"></a>

### link()

> **link**(`opts`): `HeadingContext`

Append a Link

#### Parameters

##### opts

[`LinkOptions`](../type-aliases/LinkOptions.md)

[LinkOptions](../type-aliases/LinkOptions.md)

#### Returns

`HeadingContext`

#### Inherited from

`LinkContainer.link`

***

<a id="postlink"></a>

### postLink()

> **postLink**(`opts`): `HeadingContext`

Append a link to a Reddit Post

#### Parameters

##### opts

[`RedditPermalinkOptions`](../type-aliases/RedditPermalinkOptions.md)

[PostLinkOptions](../type-aliases/PostLinkOptions.md)

#### Returns

`HeadingContext`

#### Inherited from

`LinkContainer.postLink`

***

<a id="rawtext"></a>

### rawText()

> **rawText**(`text`): `HeadingContext`

Append unstyled text

#### Parameters

##### text

`string`

#### Returns

`HeadingContext`

#### Inherited from

[`RawTextContainer`](../type-aliases/RawTextContainer.md).[`rawText`](../type-aliases/RawTextContainer.md#rawtext)

***

<a id="subredditlink"></a>

### subredditLink()

> **subredditLink**(`opts`): `HeadingContext`

Append a link to a Reddit Subreddit

#### Parameters

##### opts

[`SubredditLinkOptions`](../type-aliases/SubredditLinkOptions.md)

[SubredditLinkOptions](../type-aliases/SubredditLinkOptions.md)

#### Returns

`HeadingContext`

#### Inherited from

`LinkContainer.subredditLink`

***

<a id="userlink"></a>

### userLink()

> **userLink**(`opts`): `HeadingContext`

Append a link to a Reddit User

#### Parameters

##### opts

[`UserLinkOptions`](../type-aliases/UserLinkOptions.md)

[UserLinkOptions](../type-aliases/UserLinkOptions.md)

#### Returns

`HeadingContext`

#### Inherited from

`LinkContainer.userLink`

***

<a id="usermention"></a>

### userMention()

> **userMention**(`opts`): `HeadingContext`

Append a link to a Reddit User as a

#### Parameters

##### opts

[`UserLinkOptions`](../type-aliases/UserLinkOptions.md)

[UserMentionOptions](../type-aliases/UserMentionOptions.md)

#### Returns

`HeadingContext`

#### Mention

#### Inherited from

`LinkContainer.userMention`
