[**@devvit/public-api v0.14.0-dev**](../README.md)

***

# Type Alias: TextOptions

> **TextOptions** = [`RawTextOptions`](RawTextOptions.md) & `object`

## Type declaration

### formatting?

> `optional` **formatting**: [`FormatRange`](FormatRange.md)[]

A list of FormatRange specifications which defines text style for an
arbitrary substring within the text

#### See

 - [FormatRange](FormatRange.md)
 - makeFormatting

#### Example

```ts
// Make the exclamation mark italic:
{ text: 'Hello!', formatting: [makeFormatting({italic: true, startIndex: 5, length: 1})] }
```

## Borrows

RawTextOptions
