[**@devvit/public-api v0.14.4-dev**](../README.md)

***

# Class: RichTextBuilder

## Mixes

ParagraphContainer

## Mixes

HeadingContainer

## Mixes

HorizontalRuleContainer

## Mixes

BlockQuoteContainer

## Mixes

CodeBlockContainer

## Mixes

EmbedContainer

## Mixes

ListContainer

## Mixes

TableContainer

## Mixes

ImageContainer

## Mixes

VideoContainer

## Implements

- [`ParagraphContainer`](../type-aliases/ParagraphContainer.md)\<`RichTextBuilder`\>
- [`HeadingContainer`](../type-aliases/HeadingContainer.md)\<`RichTextBuilder`\>
- [`HorizontalRuleContainer`](../type-aliases/HorizontalRuleContainer.md)\<`RichTextBuilder`\>
- [`BlockQuoteContainer`](../type-aliases/BlockQuoteContainer.md)\<`RichTextBuilder`\>
- [`CodeBlockContainer`](../type-aliases/CodeBlockContainer.md)\<`RichTextBuilder`\>
- [`EmbedContainer`](../type-aliases/EmbedContainer.md)\<`RichTextBuilder`\>
- [`ListContainer`](../type-aliases/ListContainer.md)\<`RichTextBuilder`\>
- [`TableContainer`](../type-aliases/TableContainer.md)\<`RichTextBuilder`\>
- [`ImageContainer`](../type-aliases/ImageContainer.md)\<`RichTextBuilder`\>
- [`VideoContainer`](../type-aliases/VideoContainer.md)\<`RichTextBuilder`\>

## Constructors

<a id="constructor"></a>

### new RichTextBuilder()

> **new RichTextBuilder**(): `RichTextBuilder`

#### Returns

`RichTextBuilder`

## Methods

<a id="animatedimage"></a>

### animatedImage()

> **animatedImage**(`_opts`): `RichTextBuilder`

Append an Animated Image

#### Parameters

##### \_opts

[`MediaOptions`](../type-aliases/MediaOptions.md)

#### Returns

`RichTextBuilder`

#### Implementation of

`ImageContainer.animatedImage`

***

<a id="blockquote"></a>

### blockQuote()

> **blockQuote**(`_opts`, `_cb`): `RichTextBuilder`

Append a Block Quote element

#### Parameters

##### \_opts

[`BlockQuoteOptions`](../type-aliases/BlockQuoteOptions.md)

##### \_cb

(`blockQuote`) => `void`

#### Returns

`RichTextBuilder`

#### Implementation of

`BlockQuoteContainer.blockQuote`

***

<a id="build"></a>

### build()

> **build**(): `string`

Serializes the document to a JSON string

#### Returns

`string`

***

<a id="codeblock"></a>

### codeBlock()

> **codeBlock**(`_opts`, `_cb`): `RichTextBuilder`

Append a Code Block element

#### Parameters

##### \_opts

[`CodeBlockOptions`](../type-aliases/CodeBlockOptions.md)

##### \_cb

(`codeBlock`) => `void`

#### Returns

`RichTextBuilder`

#### Implementation of

`CodeBlockContainer.codeBlock`

***

<a id="embed"></a>

### embed()

> **embed**(`_opts`): `RichTextBuilder`

Append an embedded iframe

#### Parameters

##### \_opts

[`EmbedOptions`](../type-aliases/EmbedOptions.md)

#### Returns

`RichTextBuilder`

#### Implementation of

`EmbedContainer.embed`

***

<a id="heading"></a>

### heading()

> **heading**(`_opts`, `_cb`): `RichTextBuilder`

Append a Heading

#### Parameters

##### \_opts

[`HeadingOptions`](../type-aliases/HeadingOptions.md)

##### \_cb

(`heading`) => `void`

#### Returns

`RichTextBuilder`

#### Implementation of

`HeadingContainer.heading`

***

<a id="horizontalrule"></a>

### horizontalRule()

> **horizontalRule**(): `RichTextBuilder`

Append a Horizontal Rule

#### Returns

`RichTextBuilder`

#### Implementation of

`HorizontalRuleContainer.horizontalRule`

***

<a id="image"></a>

### image()

> **image**(`_opts`): `RichTextBuilder`

Append an Image

#### Parameters

##### \_opts

[`MediaOptions`](../type-aliases/MediaOptions.md)

#### Returns

`RichTextBuilder`

#### Implementation of

`ImageContainer.image`

***

<a id="list"></a>

### list()

> **list**(`_opts`, `_cb`): `RichTextBuilder`

Append a List

#### Parameters

##### \_opts

[`ListOptions`](../type-aliases/ListOptions.md)

##### \_cb

(`list`) => `void`

#### Returns

`RichTextBuilder`

#### Implementation of

`ListContainer.list`

***

<a id="paragraph"></a>

### paragraph()

> **paragraph**(`_cb`): `RichTextBuilder`

Append a Paragraph

#### Parameters

##### \_cb

(`paragraph`) => `void`

#### Returns

`RichTextBuilder`

#### Implementation of

`ParagraphContainer.paragraph`

***

<a id="table"></a>

### table()

> **table**(`_cb`): `RichTextBuilder`

Append a Table

#### Parameters

##### \_cb

(`table`) => `void`

#### Returns

`RichTextBuilder`

#### Implementation of

`TableContainer.table`

***

<a id="video"></a>

### video()

> **video**(`_opts`): `RichTextBuilder`

Append a Video

#### Parameters

##### \_opts

[`VideoOptions`](../type-aliases/VideoOptions.md)

#### Returns

`RichTextBuilder`

#### Implementation of

`VideoContainer.video`
