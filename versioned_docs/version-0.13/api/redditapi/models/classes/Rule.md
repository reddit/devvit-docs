[**@devvit/public-api v0.13.7-dev**](../../README.md)

***

# Class: Rule

## Constructors

<a id="constructor"></a>

### new Rule()

> **new Rule**(`ruleData`, `subredditName`, `metadata`): `Rule`

#### Parameters

##### ruleData

`SubredditAboutRulesResponse_SubredditRule`

##### subredditName

`string`

##### metadata

`undefined` | `Metadata`

#### Returns

`Rule`

## Accessors

<a id="createdutc"></a>

### createdUtc

#### Get Signature

> **get** **createdUtc**(): `number`

The Unix timestamp of when the rule was created.

##### Returns

`number`

***

<a id="description"></a>

### description

#### Get Signature

> **get** **description**(): `string`

The full description of the rule. This appears on your subreddit's sidebar.

##### Returns

`string`

***

<a id="descriptionhtml"></a>

### descriptionHtml

#### Get Signature

> **get** **descriptionHtml**(): `undefined` \| `string`

##### Returns

`undefined` \| `string`

***

<a id="kind"></a>

### kind

#### Get Signature

> **get** **kind**(): `"all"` \| `"link"` \| `"comment"`

Which Reddit objects this rule applies to. One of "all", "link" (AKA posts), "comment".

##### Returns

`"all"` \| `"link"` \| `"comment"`

***

<a id="priority"></a>

### priority

#### Get Signature

> **get** **priority**(): `number`

The zero-indexed rank of the rule on the subreddit sidebar. Lower numbers appear on top.

##### Returns

`number`

***

<a id="shortname"></a>

### shortName

#### Get Signature

> **get** **shortName**(): `string`

The name for the rule.

##### Returns

`string`

***

<a id="subredditname"></a>

### subredditName

#### Get Signature

> **get** **subredditName**(): `string`

The name (without r/ prefix) of the subreddit the rule belongs to.

##### Returns

`string`

***

<a id="violationreason"></a>

### violationReason

#### Get Signature

> **get** **violationReason**(): `string`

Text to show users when reporting content due to this rule. Defaults to the shortName.

##### Returns

`string`

## Methods

<a id="delete"></a>

### delete()

> **delete**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

***

<a id="tojson"></a>

### toJSON()

> **toJSON**(): `Pick`\<`Rule`, `"subredditName"` \| `"kind"` \| `"violationReason"` \| `"shortName"` \| `"description"` \| `"createdUtc"` \| `"priority"`\> & `object`

#### Returns

`Pick`\<`Rule`, `"subredditName"` \| `"kind"` \| `"violationReason"` \| `"shortName"` \| `"description"` \| `"createdUtc"` \| `"priority"`\> & `object`

***

<a id="update"></a>

### update()

> **update**(`options`): `Promise`\<`void`\>

Update an existing rule.

#### Parameters

##### options

`Readonly`\<[`UpdateRuleOptions`](../type-aliases/UpdateRuleOptions.md)\>

New values for an existing rule. All fields are optional. If a field is not provided, the existing value will not be changed.

#### Returns

`Promise`\<`void`\>

***

<a id="createrule"></a>

### createRule()

> `static` **createRule**(`subredditName`, `options`, `metadata`): `Promise`\<`void`\>

#### Parameters

##### subredditName

`string`

##### options

`Readonly`\<[`CreateRuleOptions`](../type-aliases/CreateRuleOptions.md)\>

##### metadata

`undefined` | `Metadata`

#### Returns

`Promise`\<`void`\>

***

<a id="delete-2"></a>

### delete()

> `static` **delete**(`subredditName`, `shortName`, `metadata`): `Promise`\<`void`\>

#### Parameters

##### subredditName

`string`

##### shortName

`string`

##### metadata

`undefined` | `Metadata`

#### Returns

`Promise`\<`void`\>

***

<a id="getrules"></a>

### getRules()

> `static` **getRules**(`subredditName`, `metadata`): `Promise`\<`Rule`[]\>

#### Parameters

##### subredditName

`string`

##### metadata

`undefined` | `Metadata`

#### Returns

`Promise`\<`Rule`[]\>

***

<a id="reorderrules"></a>

### reorderRules()

> `static` **reorderRules**(`subredditName`, `rules`, `metadata`): `Promise`\<`void`\>

#### Parameters

##### subredditName

`string`

##### rules

`Rule`[]

##### metadata

`undefined` | `Metadata`

#### Returns

`Promise`\<`void`\>
