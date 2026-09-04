[**@devvit/public-api v0.14.3-dev**](../README.md)

***

# Type Alias: FilterOptions

> **FilterOptions** = `object`

## Properties

<a id="keep"></a>

### keep?

> `optional` **keep**: `boolean`

Whether the post or comment remains visible while it is in the moderation
queue. Defaults to `false`.

***

<a id="reason"></a>

### reason?

> `optional` **reason**: `string`

The reason shown to moderators in the moderation queue. If [keep](#keep) is
`true`, the reason is also shown on the post or comment.

#### Example

```ts
"contains sensitive content"
```
