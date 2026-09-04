[**@devvit/public-api v0.14.3-dev**](../README.md)

***

# Interface: TableContext

## Borrows

TableContentContainer

## Extends

- [`TableContentContainer`](../type-aliases/TableContentContainer.md)\<`TableContext`\>

## Methods

<a id="headercell"></a>

### headerCell()

> **headerCell**(`opts`, `cb`): `TableContext`

Append a Table Cell to the Table Header

#### Parameters

##### opts

[`TableHeaderCellOptions`](../type-aliases/TableHeaderCellOptions.md)

[TableHeaderCellOptions](../type-aliases/TableHeaderCellOptions.md)

##### cb

(`cell`) => `void`

scoped callback to add child elements to this Table Header Cell

#### Returns

`TableContext`

#### Inherited from

[`TableContentContainer`](../type-aliases/TableContentContainer.md).[`headerCell`](../type-aliases/TableContentContainer.md#headercell)

***

<a id="row"></a>

### row()

> **row**(`cb`): `TableContext`

Append a Table Row to the Table

#### Parameters

##### cb

(`row`) => `void`

scoped callback to add child elements to this Table Row

#### Returns

`TableContext`

#### Inherited from

[`TableContentContainer`](../type-aliases/TableContentContainer.md).[`row`](../type-aliases/TableContentContainer.md#row)
