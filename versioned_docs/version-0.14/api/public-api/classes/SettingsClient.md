[**@devvit/public-api v0.14.0-dev**](../README.md)

***

# Class: SettingsClient

## Constructors

<a id="constructor"></a>

### new SettingsClient()

> **new SettingsClient**(): `SettingsClient`

#### Returns

`SettingsClient`

## Methods

<a id="get"></a>

### get()

> **get**\<`T`\>(`name`): `Promise`\<`undefined` \| `T`\>

#### Type Parameters

##### T

`T` = `undefined` \| `string` \| `number` \| `boolean` \| `string`[]

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`undefined` \| `T`\>

***

<a id="getall"></a>

### getAll()

> **getAll**\<`T`\>(): `Promise`\<`T`\>

#### Type Parameters

##### T

`T` *extends* `object` = [`SettingsValues`](../type-aliases/SettingsValues.md)

#### Returns

`Promise`\<`T`\>
