[**@devvit/public-api v0.14.0-dev**](../README.md)

***

# Class: Listing\<T\>

## Type Parameters

### T

`T`

## Constructors

<a id="constructor"></a>

### new Listing()

> **new Listing**\<`T`\>(): `Listing`\<`T`\>

#### Returns

`Listing`\<`T`\>

## Properties

<a id="children"></a>

### children

> **children**: `T`[]

***

<a id="limit"></a>

### limit

> **limit**: `number`

***

<a id="pagesize"></a>

### pageSize

> **pageSize**: `number`

## Accessors

<a id="hasmore"></a>

### hasMore

#### Get Signature

> **get** **hasMore**(): `boolean`

##### Returns

`boolean`

## Methods

<a id="asynciterator"></a>

### \[asyncIterator\]()

> **\[asyncIterator\]**(): `AsyncIterator`\<`T`\>

#### Returns

`AsyncIterator`\<`T`\>

***

<a id="all"></a>

### all()

> **all**(): `Promise`\<`T`[]\>

#### Returns

`Promise`\<`T`[]\>

***

<a id="get"></a>

### get()

> **get**(`count`): `Promise`\<`T`[]\>

#### Parameters

##### count

`number`

#### Returns

`Promise`\<`T`[]\>

***

<a id="preventinitialfetch"></a>

### preventInitialFetch()

> **preventInitialFetch**(): `void`

#### Returns

`void`

***

<a id="setmore"></a>

### setMore()

> **setMore**(`more`): `void`

#### Parameters

##### more

`undefined` | [`MoreObject`](../type-aliases/MoreObject.md)

#### Returns

`void`
