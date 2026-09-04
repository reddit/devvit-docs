[**@devvit/public-api v0.14.4-dev**](../README.md)

***

# Interface: SpoilerContext

## Borrows

TextContainer

## Borrows

LinkContainer

## Borrows

LineBreakContainer

## Extends

- [`TextContainer`](../type-aliases/TextContainer.md)\<`SpoilerContext`\>.[`LinkContainer`](../type-aliases/LinkContainer.md)\<`SpoilerContext`\>.[`LineBreakContainer`](../type-aliases/LineBreakContainer.md)\<`SpoilerContext`\>

## Methods

<a id="commentlink"></a>

### commentLink()

> **commentLink**(`opts`): `SpoilerContext`

Append a link to a Reddit Comment

#### Parameters

##### opts

[`RedditPermalinkOptions`](../type-aliases/RedditPermalinkOptions.md)

[CommentLinkOptions](../type-aliases/CommentLinkOptions.md)

#### Returns

`SpoilerContext`

#### Inherited from

`LinkContainer.commentLink`

***

<a id="linebreak"></a>

### linebreak()

> **linebreak**(): `SpoilerContext`

Append a Line Break

#### Returns

`SpoilerContext`

#### Inherited from

[`LineBreakContainer`](../type-aliases/LineBreakContainer.md).[`linebreak`](../type-aliases/LineBreakContainer.md#linebreak)

***

<a id="link"></a>

### link()

> **link**(`opts`): `SpoilerContext`

Append a Link

#### Parameters

##### opts

[`LinkOptions`](../type-aliases/LinkOptions.md)

[LinkOptions](../type-aliases/LinkOptions.md)

#### Returns

`SpoilerContext`

#### Inherited from

`LinkContainer.link`

***

<a id="postlink"></a>

### postLink()

> **postLink**(`opts`): `SpoilerContext`

Append a link to a Reddit Post

#### Parameters

##### opts

[`RedditPermalinkOptions`](../type-aliases/RedditPermalinkOptions.md)

[PostLinkOptions](../type-aliases/PostLinkOptions.md)

#### Returns

`SpoilerContext`

#### Inherited from

`LinkContainer.postLink`

***

<a id="subredditlink"></a>

### subredditLink()

> **subredditLink**(`opts`): `SpoilerContext`

Append a link to a Reddit Subreddit

#### Parameters

##### opts

[`SubredditLinkOptions`](../type-aliases/SubredditLinkOptions.md)

[SubredditLinkOptions](../type-aliases/SubredditLinkOptions.md)

#### Returns

`SpoilerContext`

#### Inherited from

`LinkContainer.subredditLink`

***

<a id="text"></a>

### text()

> **text**(`opts`): `SpoilerContext`

Append Text with optional formatting

#### Parameters

##### opts

[`TextOptions`](../type-aliases/TextOptions.md)

[TextOptions](../type-aliases/TextOptions.md)

#### Returns

`SpoilerContext`

#### Inherited from

[`TextContainer`](../type-aliases/TextContainer.md).[`text`](../type-aliases/TextContainer.md#text)

***

<a id="userlink"></a>

### userLink()

> **userLink**(`opts`): `SpoilerContext`

Append a link to a Reddit User

#### Parameters

##### opts

[`UserLinkOptions`](../type-aliases/UserLinkOptions.md)

[UserLinkOptions](../type-aliases/UserLinkOptions.md)

#### Returns

`SpoilerContext`

#### Inherited from

`LinkContainer.userLink`

***

<a id="usermention"></a>

### userMention()

> **userMention**(`opts`): `SpoilerContext`

Append a link to a Reddit User as a

#### Parameters

##### opts

[`UserLinkOptions`](../type-aliases/UserLinkOptions.md)

[UserMentionOptions](../type-aliases/UserMentionOptions.md)

#### Returns

`SpoilerContext`

#### Mention

#### Inherited from

`LinkContainer.userMention`
