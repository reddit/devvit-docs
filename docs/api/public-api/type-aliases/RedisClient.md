[**@devvit/public-api v0.15.4-dev**](../README.md)

***

# Type Alias: RedisClient

> **RedisClient** = `Omit`\<`RedisClientBase`, `"global"` \| `"watch"`\> & `object`

## Type Declaration

### global

> **global**: `Omit`\<`RedisClient`, `"global"`\>

### ~~hdel()~~

> **hdel**(`key`, `fields`): `Promise`\<`number`\>

#### Parameters

##### key

`string`

##### fields

`string`[]

#### Returns

`Promise`\<`number`\>

#### Deprecated

Use RedisClient.hDel instead.

### ~~hget()~~

> **hget**(`key`, `field`): `Promise`\<`string` \| `undefined`\>

#### Parameters

##### key

`string`

##### field

`string`

#### Returns

`Promise`\<`string` \| `undefined`\>

#### Deprecated

Use RedisClient.hGet instead.

### ~~hgetall()~~

> **hgetall**(`key`): `Promise`\<`Record`\<`string`, `string`\>\>

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

#### Deprecated

Use RedisClient.hGetAll instead.

### ~~hincrby()~~

> **hincrby**(`key`, `field`, `value`): `Promise`\<`number`\>

#### Parameters

##### key

`string`

##### field

`string`

##### value

`number`

#### Returns

`Promise`\<`number`\>

#### Deprecated

Use RedisClient.hIncrBy instead.

### ~~hkeys()~~

> **hkeys**(`key`): `Promise`\<`string`[]\>

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`string`[]\>

#### Deprecated

Use RedisClient.hKeys instead.

### ~~hlen()~~

> **hlen**(`key`): `Promise`\<`number`\>

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

#### Deprecated

Use RedisClient.hLen instead.

### ~~hscan()~~

> **hscan**(`key`, `cursor`, `pattern?`, `count?`): `Promise`\<`HScanResponse`\>

#### Parameters

##### key

`string`

##### cursor

`number`

##### pattern?

`string`

##### count?

`number`

#### Returns

`Promise`\<`HScanResponse`\>

#### Deprecated

Use RedisClient.hScan instead.

### ~~hset()~~

> **hset**(`key`, `fieldValues`): `Promise`\<`number`\>

#### Parameters

##### key

`string`

##### fieldValues

\{\[`field`: `string`\]: `string`; \}

#### Returns

`Promise`\<`number`\>

#### Deprecated

Use RedisClient.hSet instead.

### ~~mget()~~

> **mget**(`keys`): `Promise`\<(`string` \| `null`)[]\>

#### Parameters

##### keys

`string`[]

#### Returns

`Promise`\<(`string` \| `null`)[]\>

#### Deprecated

Use RedisClient.mGet instead.

### ~~mset()~~

> **mset**(`keyValues`): `Promise`\<`void`\>

#### Parameters

##### keyValues

\{\[`key`: `string`\]: `string`; \}

#### Returns

`Promise`\<`void`\>

#### Deprecated

Use RedisClient.mSet instead.

### ~~strlen()~~

> **strlen**(`key`): `Promise`\<`number`\>

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

#### Deprecated

Use RedisClient.strLen instead.

### watch()

> **watch**(...`keys`): `Promise`\<[`TxClientLike`](../interfaces/TxClientLike.md)\>

#### Parameters

##### keys

...`string`[]

#### Returns

`Promise`\<[`TxClientLike`](../interfaces/TxClientLike.md)\>
