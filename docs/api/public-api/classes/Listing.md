[**@devvit/public-api v0.15.4-dev**](../README.md)

***

# Class: Listing\<T\>

## Type Parameters

<a id="t"></a>

### T

`T`

## Constructors

<a id="constructor"></a>

### Constructor

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

[`MoreObject`](../type-aliases/MoreObject.md) \| `undefined`

#### Returns

`void`
