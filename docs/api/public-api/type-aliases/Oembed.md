[**@devvit/public-api v0.14.4-dev**](../README.md)

***

# Type Alias: Oembed

> **Oembed** = `object`

oEmbed is a format for allowing an embedded representation of a URL on
third-party sites. The API lets a website display embedded content, such as
photos or videos, without parsing the resource directly.
See: https://oembed.com/

## Properties

<a id="authorname"></a>

### authorName?

> `optional` **authorName**: `string`

The name of the author/owner of the resource. E.g. "Reddit"

***

<a id="authorurl"></a>

### authorUrl?

> `optional` **authorUrl**: `string`

A URL for the resource's author or owner.

#### Example

```ts
"https://www.youtube.com/@Reddit"
```

***

<a id="height"></a>

### height?

> `optional` **height**: `number`

The height in pixels required to display the HTML.

***

<a id="html"></a>

### html

> **html**: `string`

The HTML required to embed a video player. It should have no padding or
margins. Consider loading it in a separate-origin iframe to avoid XSS
vulnerabilities.

***

<a id="providername"></a>

### providerName?

> `optional` **providerName**: `string`

A URL for the author/owner of the resource. E.g. "YouTube"

***

<a id="providerurl"></a>

### providerUrl?

> `optional` **providerUrl**: `string`

The name of the resource provider. E.g "https://www.youtube.com/"

***

<a id="thumbnailheight"></a>

### thumbnailHeight?

> `optional` **thumbnailHeight**: `number`

The height of the optional thumbnail in pixels

***

<a id="thumbnailurl"></a>

### thumbnailUrl?

> `optional` **thumbnailUrl**: `string`

A URL to a thumbnail image representing the resource.

***

<a id="thumbnailwidth"></a>

### thumbnailWidth?

> `optional` **thumbnailWidth**: `number`

The width of the optional thumbnail in pixels

***

<a id="title"></a>

### title?

> `optional` **title**: `string`

A text title, describing the resource.

***

<a id="type"></a>

### type

> **type**: `string`

The resource type and its type-specific parameters, such as `"video"`.

***

<a id="version"></a>

### version

> **version**: `string`

The oEmbed version number. This must be 1.0.

***

<a id="width"></a>

### width?

> `optional` **width**: `number`

The width in pixels required to display the HTML.
