[**@devvit/public-api v0.14.0-dev**](../README.md)

***

# Type Alias: List

> **List** = `object`

Note: the spec is somewhat ambiguous here, consider that
as typed, there are multiple possible representations of
a list of two, top-level, paragraphs.

e.g.
The CommonMark list of:
```
 * foo
 * bar
```

could either be represented as
(List
   (ListChild
      (Paragraph 'foo')
      (Paragraph 'bar' )))

OR

(List
   (ListChild
       (Paragraph 'foo' ))
   (ListChild
       (Paragraph 'bar)))

The spec is designed to be interoperable with our CommonMark parser, and as so,
the preferred encoding is the latter.

If you would like to demo  CommonMark Markdown -> AST conversions,
you can try out http://spec.commonmark.org/dingus/

## Properties

<a id="c"></a>

### c

> **c**: [`ListItem`](ListItem.md)[]

***

<a id="e"></a>

### e

> **e**: *typeof* [`LIST_ELEMENT`](../variables/LIST_ELEMENT.md)

***

<a id="o"></a>

### o

> **o**: `boolean`
