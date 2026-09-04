[**@devvit/public-api v0.14.3-dev**](../README.md)

***

# Interface: ParagraphContext

## Borrows

TextContainer

## Borrows

ImageContainer

## Borrows

LinkContainer

## Borrows

LineBreakContainer

## Extends

- [`TextContainer`](../type-aliases/TextContainer.md)\<`ParagraphContext`\>.[`ImageContainer`](../type-aliases/ImageContainer.md)\<`ParagraphContext`\>.[`LinkContainer`](../type-aliases/LinkContainer.md)\<`ParagraphContext`\>.[`LineBreakContainer`](../type-aliases/LineBreakContainer.md)\<`ParagraphContext`\>

## Methods

<a id="animatedimage"></a>

### animatedImage()

> **animatedImage**(`opts`): `ParagraphContext`

Append an Animated Image

#### Parameters

##### opts

[`MediaOptions`](../type-aliases/MediaOptions.md)

[ImageOptions](../type-aliases/ImageOptions.md)

#### Returns

`ParagraphContext`

#### Inherited from

[`ImageContainer`](../type-aliases/ImageContainer.md).[`animatedImage`](../type-aliases/ImageContainer.md#animatedimage)

***

<a id="commentlink"></a>

### commentLink()

> **commentLink**(`opts`): `ParagraphContext`

Append a link to a Reddit Comment

#### Parameters

##### opts

[`RedditPermalinkOptions`](../type-aliases/RedditPermalinkOptions.md)

[CommentLinkOptions](../type-aliases/CommentLinkOptions.md)

#### Returns

`ParagraphContext`

#### Inherited from

`LinkContainer.commentLink`

***

<a id="image"></a>

### image()

> **image**(`opts`): `ParagraphContext`

Append an Image

#### Parameters

##### opts

[`MediaOptions`](../type-aliases/MediaOptions.md)

[ImageOptions](../type-aliases/ImageOptions.md)

#### Returns

`ParagraphContext`

#### Inherited from

[`ImageContainer`](../type-aliases/ImageContainer.md).[`image`](../type-aliases/ImageContainer.md#image)

***

<a id="linebreak"></a>

### linebreak()

> **linebreak**(): `ParagraphContext`

Append a Line Break

#### Returns

`ParagraphContext`

#### Inherited from

[`LineBreakContainer`](../type-aliases/LineBreakContainer.md).[`linebreak`](../type-aliases/LineBreakContainer.md#linebreak)

***

<a id="link"></a>

### link()

> **link**(`opts`): `ParagraphContext`

Append a Link

#### Parameters

##### opts

[`LinkOptions`](../type-aliases/LinkOptions.md)

[LinkOptions](../type-aliases/LinkOptions.md)

#### Returns

`ParagraphContext`

#### Inherited from

`LinkContainer.link`

***

<a id="postlink"></a>

### postLink()

> **postLink**(`opts`): `ParagraphContext`

Append a link to a Reddit Post

#### Parameters

##### opts

[`RedditPermalinkOptions`](../type-aliases/RedditPermalinkOptions.md)

[PostLinkOptions](../type-aliases/PostLinkOptions.md)

#### Returns

`ParagraphContext`

#### Inherited from

`LinkContainer.postLink`

***

<a id="subredditlink"></a>

### subredditLink()

> **subredditLink**(`opts`): `ParagraphContext`

Append a link to a Reddit Subreddit

#### Parameters

##### opts

[`SubredditLinkOptions`](../type-aliases/SubredditLinkOptions.md)

[SubredditLinkOptions](../type-aliases/SubredditLinkOptions.md)

#### Returns

`ParagraphContext`

#### Inherited from

`LinkContainer.subredditLink`

***

<a id="text"></a>

### text()

> **text**(`opts`): `ParagraphContext`

Append Text with optional formatting

#### Parameters

##### opts

[`TextOptions`](../type-aliases/TextOptions.md)

[TextOptions](../type-aliases/TextOptions.md)

#### Returns

`ParagraphContext`

#### Inherited from

[`TextContainer`](../type-aliases/TextContainer.md).[`text`](../type-aliases/TextContainer.md#text)

***

<a id="userlink"></a>

### userLink()

> **userLink**(`opts`): `ParagraphContext`

Append a link to a Reddit User

#### Parameters

##### opts

[`UserLinkOptions`](../type-aliases/UserLinkOptions.md)

[UserLinkOptions](../type-aliases/UserLinkOptions.md)

#### Returns

`ParagraphContext`

#### Inherited from

`LinkContainer.userLink`

***

<a id="usermention"></a>

### userMention()

> **userMention**(`opts`): `ParagraphContext`

Append a link to a Reddit User as a

#### Parameters

##### opts

[`UserLinkOptions`](../type-aliases/UserLinkOptions.md)

[UserMentionOptions](../type-aliases/UserMentionOptions.md)

#### Returns

`ParagraphContext`

#### Mention

#### Inherited from

`LinkContainer.userMention`
