[**@devvit/public-api v0.14.1-dev**](../README.md)

***

# Interface: TableCellContext

## Borrows

TextContainer

## Borrows

LinkContainer

## Borrows

ImageContainer

## Extends

- [`TextContainer`](../type-aliases/TextContainer.md)\<`TableCellContext`\>.[`LinkContainer`](../type-aliases/LinkContainer.md)\<`TableCellContext`\>.[`ImageContainer`](../type-aliases/ImageContainer.md)\<`TableCellContext`\>

## Methods

<a id="animatedimage"></a>

### animatedImage()

> **animatedImage**(`opts`): `TableCellContext`

Append an Animated Image

#### Parameters

##### opts

[`MediaOptions`](../type-aliases/MediaOptions.md)

[ImageOptions](../type-aliases/ImageOptions.md)

#### Returns

`TableCellContext`

#### Inherited from

[`ImageContainer`](../type-aliases/ImageContainer.md).[`animatedImage`](../type-aliases/ImageContainer.md#animatedimage)

***

<a id="commentlink"></a>

### commentLink()

> **commentLink**(`opts`): `TableCellContext`

Append a link to a Reddit Comment

#### Parameters

##### opts

[`RedditPermalinkOptions`](../type-aliases/RedditPermalinkOptions.md)

[CommentLinkOptions](../type-aliases/CommentLinkOptions.md)

#### Returns

`TableCellContext`

#### Inherited from

`LinkContainer.commentLink`

***

<a id="image"></a>

### image()

> **image**(`opts`): `TableCellContext`

Append an Image

#### Parameters

##### opts

[`MediaOptions`](../type-aliases/MediaOptions.md)

[ImageOptions](../type-aliases/ImageOptions.md)

#### Returns

`TableCellContext`

#### Inherited from

[`ImageContainer`](../type-aliases/ImageContainer.md).[`image`](../type-aliases/ImageContainer.md#image)

***

<a id="link"></a>

### link()

> **link**(`opts`): `TableCellContext`

Append a Link

#### Parameters

##### opts

[`LinkOptions`](../type-aliases/LinkOptions.md)

[LinkOptions](../type-aliases/LinkOptions.md)

#### Returns

`TableCellContext`

#### Inherited from

`LinkContainer.link`

***

<a id="postlink"></a>

### postLink()

> **postLink**(`opts`): `TableCellContext`

Append a link to a Reddit Post

#### Parameters

##### opts

[`RedditPermalinkOptions`](../type-aliases/RedditPermalinkOptions.md)

[PostLinkOptions](../type-aliases/PostLinkOptions.md)

#### Returns

`TableCellContext`

#### Inherited from

`LinkContainer.postLink`

***

<a id="subredditlink"></a>

### subredditLink()

> **subredditLink**(`opts`): `TableCellContext`

Append a link to a Reddit Subreddit

#### Parameters

##### opts

[`SubredditLinkOptions`](../type-aliases/SubredditLinkOptions.md)

[SubredditLinkOptions](../type-aliases/SubredditLinkOptions.md)

#### Returns

`TableCellContext`

#### Inherited from

`LinkContainer.subredditLink`

***

<a id="text"></a>

### text()

> **text**(`opts`): `TableCellContext`

Append Text with optional formatting

#### Parameters

##### opts

[`TextOptions`](../type-aliases/TextOptions.md)

[TextOptions](../type-aliases/TextOptions.md)

#### Returns

`TableCellContext`

#### Inherited from

[`TextContainer`](../type-aliases/TextContainer.md).[`text`](../type-aliases/TextContainer.md#text)

***

<a id="userlink"></a>

### userLink()

> **userLink**(`opts`): `TableCellContext`

Append a link to a Reddit User

#### Parameters

##### opts

[`UserLinkOptions`](../type-aliases/UserLinkOptions.md)

[UserLinkOptions](../type-aliases/UserLinkOptions.md)

#### Returns

`TableCellContext`

#### Inherited from

`LinkContainer.userLink`

***

<a id="usermention"></a>

### userMention()

> **userMention**(`opts`): `TableCellContext`

Append a link to a Reddit User as a

#### Parameters

##### opts

[`UserLinkOptions`](../type-aliases/UserLinkOptions.md)

[UserMentionOptions](../type-aliases/UserMentionOptions.md)

#### Returns

`TableCellContext`

#### Mention

#### Inherited from

`LinkContainer.userMention`
