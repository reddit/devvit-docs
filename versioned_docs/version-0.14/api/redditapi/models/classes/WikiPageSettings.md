[**@devvit/reddit v0.14.3-dev**](../../README.md)

***

# Class: WikiPageSettings

## Constructors

<a id="constructor"></a>

### new WikiPageSettings()

> **new WikiPageSettings**(`data`, `wikiVersion`): `WikiPageSettings`

#### Parameters

##### data

`WikiPageSettings_Data`

##### wikiVersion

[`WikiVersion`](../type-aliases/WikiVersion.md) = `'v1'`

#### Returns

`WikiPageSettings`

## Accessors

<a id="editorids"></a>

### editorIds

#### Get Signature

> **get** **editorIds**(): `` `t2_${string}` ``[]

The IDs of users who may edit this page.

##### Returns

`` `t2_${string}` ``[]

***

<a id="editors"></a>

### editors

#### Get Signature

> **get** **editors**(): [`User`](User.md)[]

##### Deprecated

Use editorIds instead.

##### Returns

[`User`](User.md)[]

***

<a id="listed"></a>

### listed

#### Get Signature

> **get** **listed**(): `boolean`

##### Returns

`boolean`

***

<a id="permlevel"></a>

### permLevel

#### Get Signature

> **get** **permLevel**(): [`WikiPagePermissionLevel`](../enumerations/WikiPagePermissionLevel.md)

##### Returns

[`WikiPagePermissionLevel`](../enumerations/WikiPagePermissionLevel.md)

## Methods

<a id="tojson"></a>

### toJSON()

> **toJSON**(): `Pick`\<`WikiPageSettings`, `"listed"` \| `"permLevel"`\> & `object`

#### Returns

`Pick`\<`WikiPageSettings`, `"listed"` \| `"permLevel"`\> & `object`
