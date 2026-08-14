[**@devvit/public-api v0.14.1-dev**](../README.md)

***

# Type Alias: TableContentContainer\<Context\>

> **TableContentContainer**\<`Context`\> = `object`

## Mixin

## Extended by

- [`TableContext`](../interfaces/TableContext.md)

## Type Parameters

### Context

`Context`

## Methods

<a id="headercell"></a>

### headerCell()

> **headerCell**(`opts`, `cb`): `Context`

Append a Table Cell to the Table Header

#### Parameters

##### opts

[`TableHeaderCellOptions`](TableHeaderCellOptions.md)

[TableHeaderCellOptions](TableHeaderCellOptions.md)

##### cb

(`cell`) => `void`

scoped callback to add child elements to this Table Header Cell

#### Returns

`Context`

***

<a id="row"></a>

### row()

> **row**(`cb`): `Context`

Append a Table Row to the Table

#### Parameters

##### cb

(`row`) => `void`

scoped callback to add child elements to this Table Row

#### Returns

`Context`
