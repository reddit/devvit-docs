[**@devvit/public-api v0.14.1-dev**](../README.md)

***

# Interface: ListItemContext

## Borrows

BlockQuoteContainer

## Borrows

CodeBlockContainer

## Borrows

HeadingContainer

## Borrows

HorizontalRuleContainer

## Borrows

ListContainer

## Borrows

ParagraphContainer

## Borrows

TableContainer

## Extends

- [`BlockQuoteContainer`](../type-aliases/BlockQuoteContainer.md)\<`ListItemContext`\>.[`CodeBlockContainer`](../type-aliases/CodeBlockContainer.md)\<`ListItemContext`\>.[`HeadingContainer`](../type-aliases/HeadingContainer.md)\<`ListItemContext`\>.[`HorizontalRuleContainer`](../type-aliases/HorizontalRuleContainer.md)\<`ListItemContext`\>.[`ListContainer`](../type-aliases/ListContainer.md)\<`ListItemContext`\>.[`ParagraphContainer`](../type-aliases/ParagraphContainer.md)\<`ListItemContext`\>.[`TableContainer`](../type-aliases/TableContainer.md)\<`ListItemContext`\>

## Methods

<a id="blockquote"></a>

### blockQuote()

> **blockQuote**(`opts`, `cb`): `ListItemContext`

Append a Block Quote element

#### Parameters

##### opts

[`BlockQuoteOptions`](../type-aliases/BlockQuoteOptions.md)

##### cb

(`blockQuote`) => `void`

scoped callback to add child elements to this Block Quote

#### Returns

`ListItemContext`

#### Inherited from

[`BlockQuoteContainer`](../type-aliases/BlockQuoteContainer.md).[`blockQuote`](../type-aliases/BlockQuoteContainer.md#blockquote)

***

<a id="codeblock"></a>

### codeBlock()

> **codeBlock**(`opts`, `cb`): `ListItemContext`

Append a Code Block element

#### Parameters

##### opts

[`CodeBlockOptions`](../type-aliases/CodeBlockOptions.md)

[CodeBlockOptions](../type-aliases/CodeBlockOptions.md)

##### cb

(`codeBlock`) => `void`

scoped callback to add child elements to this Code Block

#### Returns

`ListItemContext`

#### Inherited from

[`CodeBlockContainer`](../type-aliases/CodeBlockContainer.md).[`codeBlock`](../type-aliases/CodeBlockContainer.md#codeblock)

***

<a id="heading"></a>

### heading()

> **heading**(`opts`, `cb`): `ListItemContext`

Append a Heading

#### Parameters

##### opts

[`HeadingOptions`](../type-aliases/HeadingOptions.md)

[HeadingOptions](../type-aliases/HeadingOptions.md)

##### cb

(`heading`) => `void`

scoped callback to add child elements to this Heading

#### Returns

`ListItemContext`

#### Inherited from

[`HeadingContainer`](../type-aliases/HeadingContainer.md).[`heading`](../type-aliases/HeadingContainer.md#heading)

***

<a id="horizontalrule"></a>

### horizontalRule()

> **horizontalRule**(): `ListItemContext`

Append a Horizontal Rule

#### Returns

`ListItemContext`

#### Inherited from

[`HorizontalRuleContainer`](../type-aliases/HorizontalRuleContainer.md).[`horizontalRule`](../type-aliases/HorizontalRuleContainer.md#horizontalrule)

***

<a id="list"></a>

### list()

> **list**(`opts`, `cb`): `ListItemContext`

Append a List

#### Parameters

##### opts

[`ListOptions`](../type-aliases/ListOptions.md)

[ListOptions](../type-aliases/ListOptions.md)

##### cb

(`list`) => `void`

scoped callback to add child elements to this List

#### Returns

`ListItemContext`

#### Inherited from

[`ListContainer`](../type-aliases/ListContainer.md).[`list`](../type-aliases/ListContainer.md#list)

***

<a id="paragraph"></a>

### paragraph()

> **paragraph**(`cb`): `ListItemContext`

Append a Paragraph

#### Parameters

##### cb

(`paragraph`) => `void`

scoped callback to add child elements to this Paragraph

#### Returns

`ListItemContext`

#### Inherited from

[`ParagraphContainer`](../type-aliases/ParagraphContainer.md).[`paragraph`](../type-aliases/ParagraphContainer.md#paragraph)

***

<a id="table"></a>

### table()

> **table**(`cb`): `ListItemContext`

Append a Table

#### Parameters

##### cb

(`table`) => `void`

scoped callback to add child elements to this Table

#### Returns

`ListItemContext`

#### Inherited from

[`TableContainer`](../type-aliases/TableContainer.md).[`table`](../type-aliases/TableContainer.md#table)
