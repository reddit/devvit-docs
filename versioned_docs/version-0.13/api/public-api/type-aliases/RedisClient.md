[**@devvit/public-api v0.13.10-dev**](../README.md)

***

# Type Alias: RedisClient

> **RedisClient** = `Omit`\<`RedisClientBase`, `"global"` \| `"watch"`\> & `object`

## Type declaration

### global

> **global**: `Omit`\<`RedisClient`, `"global"`\>

### ~~hdel()~~

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

#### Parameters

##### key

`string`

##### field

`string`

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Deprecated

Use RedisClient.hGet instead.

### ~~hgetall()~~

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

#### Deprecated

Use RedisClient.hGetAll instead.

### ~~hincrby()~~

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

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`string`[]\>

#### Deprecated

Use RedisClient.hKeys instead.

### ~~hlen()~~

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

#### Deprecated

Use RedisClient.hLen instead.

### ~~hscan()~~

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

#### Parameters

##### key

`string`

##### fieldValues

#### Returns

`Promise`\<`number`\>

#### Deprecated

Use RedisClient.hSet instead.

### ~~mget()~~

#### Parameters

##### keys

`string`[]

#### Returns

`Promise`\<(`null` \| `string`)[]\>

#### Deprecated

Use RedisClient.mGet instead.

### ~~mset()~~

#### Parameters

##### keyValues

#### Returns

`Promise`\<`void`\>

#### Deprecated

Use RedisClient.mSet instead.

### ~~strlen()~~

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

#### Deprecated

Use RedisClient.strLen instead.

### watch()

#### Parameters

##### keys

...`string`[]

#### Returns

`Promise`\<[`TxClientLike`](../interfaces/TxClientLike.md)\>
