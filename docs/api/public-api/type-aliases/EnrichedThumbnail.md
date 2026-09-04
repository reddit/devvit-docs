[**@devvit/public-api v0.14.4-dev**](../README.md)

***

# Type Alias: EnrichedThumbnail

> **EnrichedThumbnail** = `object`

Contains a post's thumbnail and, for NSFW content, its blurred version.

## Properties

<a id="attribution"></a>

### attribution?

> `optional` **attribution**: `string`

Attribution text for the thumbnail

***

<a id="image"></a>

### image

> **image**: `object`

The thumbnail image. Its resolution can differ from [Post.thumbnail](../classes/Post.md#thumbnail).

#### height

> **height**: `number`

#### url

> **url**: `string`

#### width

> **width**: `number`

***

<a id="isobfuscateddefault"></a>

### isObfuscatedDefault

> **isObfuscatedDefault**: `boolean`

Whether this thumbnail appears blurred by default

***

<a id="obfuscatedimage"></a>

### obfuscatedImage?

> `optional` **obfuscatedImage**: `object`

The blurred image for NSFW thumbnails

#### height

> **height**: `number`

#### url

> **url**: `string`

#### width

> **width**: `number`
