[**@devvit/public-api v0.13.9-dev**](../../README.md)

***

# Class: SubredditModeratorUser

Moderator of a subreddit; data from the AboutWhere response.
Use `getModerators()` or `subreddit.getModerators()` to receive a listing of these.

## Extends

- [`User`](User.md)

## Properties

<a id="date"></a>

### date

> `readonly` **date**: `Date`

When the moderator relationship was created (UTC).

***

<a id="moderatorinfo"></a>

### moderatorInfo

> `readonly` **moderatorInfo**: `object`

Moderator relationship data for the subreddit.
Nested to avoid shadowing [User.modPermissions](User.md#modpermissions), which stores permissions across all subreddits.

#### authorFlairCssClass?

> `optional` **authorFlairCssClass**: `string`

User flair CSS class in the subreddit.

#### authorFlairText?

> `optional` **authorFlairText**: `string`

User flair text in the subreddit.

#### modPermissions

> **modPermissions**: [`ModeratorPermission`](../type-aliases/ModeratorPermission.md)[]

Moderator permissions for this subreddit.

## Accessors

<a id="about"></a>

### about

#### Get Signature

> **get** **about**(): `string`

The user's public description about themselves. May be empty.

##### Returns

`string`

#### Inherited from

[`User`](User.md).[`about`](User.md#about)

***

<a id="commentkarma"></a>

### commentKarma

#### Get Signature

> **get** **commentKarma**(): `number`

The amount of comment karma the user has.

##### Returns

`number`

#### Inherited from

[`User`](User.md).[`commentKarma`](User.md#commentkarma)

***

<a id="createdat"></a>

### createdAt

#### Get Signature

> **get** **createdAt**(): `Date`

The date the user was created.

##### Returns

`Date`

#### Inherited from

[`User`](User.md).[`createdAt`](User.md#createdat)

***

<a id="displayname"></a>

### displayName

#### Get Signature

> **get** **displayName**(): `string`

The display name of the user. May be different from their username.

##### Returns

`string`

#### Inherited from

[`User`](User.md).[`displayName`](User.md#displayname)

***

<a id="hasredditpremium"></a>

### hasRedditPremium

#### Get Signature

> **get** **hasRedditPremium**(): `boolean`

Whether the user has Reddit Premium.

##### Returns

`boolean`

#### Inherited from

[`User`](User.md).[`hasRedditPremium`](User.md#hasredditpremium)

***

<a id="hasverifiedemail"></a>

### hasVerifiedEmail

#### Get Signature

> **get** **hasVerifiedEmail**(): `boolean`

Indicates whether or not the user has verified their email address.

##### Returns

`boolean`

#### Inherited from

[`User`](User.md).[`hasVerifiedEmail`](User.md#hasverifiedemail)

***

<a id="id"></a>

### id

#### Get Signature

> **get** **id**(): `` `t2_${string}` ``

The ID (starting with t2_) of the user to retrieve.

##### Example

```ts
't2_1w72'
```

##### Returns

`` `t2_${string}` ``

#### Inherited from

[`User`](User.md).[`id`](User.md#id)

***

<a id="isadmin"></a>

### isAdmin

#### Get Signature

> **get** **isAdmin**(): `boolean`

Whether the user is admin.

##### Returns

`boolean`

#### Inherited from

[`User`](User.md).[`isAdmin`](User.md#isadmin)

***

<a id="ismoderator"></a>

### isModerator

#### Get Signature

> **get** **isModerator**(): `boolean`

Whether the user is a moderator of any subreddit.

##### Returns

`boolean`

#### Inherited from

[`User`](User.md).[`isModerator`](User.md#ismoderator)

***

<a id="linkkarma"></a>

### linkKarma

#### Get Signature

> **get** **linkKarma**(): `number`

The amount of link karma the user has.

##### Returns

`number`

#### Inherited from

[`User`](User.md).[`linkKarma`](User.md#linkkarma)

***

<a id="modpermissions"></a>

### modPermissions

#### Get Signature

> **get** **modPermissions**(): `Map`\<`string`, [`ModeratorPermission`](../type-aliases/ModeratorPermission.md)[]\>

The permissions the user has on the subreddit.

##### Returns

`Map`\<`string`, [`ModeratorPermission`](../type-aliases/ModeratorPermission.md)[]\>

#### Inherited from

[`User`](User.md).[`modPermissions`](User.md#modpermissions)

***

<a id="nsfw"></a>

### nsfw

#### Get Signature

> **get** **nsfw**(): `boolean`

Whether the user's profile is marked as NSFW (Not Safe For Work).

##### Returns

`boolean`

#### Inherited from

[`User`](User.md).[`nsfw`](User.md#nsfw)

***

<a id="permalink"></a>

### permalink

#### Get Signature

> **get** **permalink**(): `string`

Returns a permalink path relative to https://www.reddit.com

##### Returns

`string`

#### Inherited from

[`User`](User.md).[`permalink`](User.md#permalink)

***

<a id="shownsfw"></a>

### showNsfw

#### Get Signature

> **get** **showNsfw**(): `boolean`

Whether the user is over 18 and wishes to see NSFW content.

##### Returns

`boolean`

#### Inherited from

[`User`](User.md).[`showNsfw`](User.md#shownsfw)

***

<a id="url"></a>

### url

#### Get Signature

> **get** **url**(): `string`

Returns the HTTP URL for the user

##### Returns

`string`

#### Inherited from

[`User`](User.md).[`url`](User.md#url)

***

<a id="username"></a>

### username

#### Get Signature

> **get** **username**(): `string`

The username of the user omitting the u/.

##### Example

```ts
'spez'
```

##### Returns

`string`

#### Inherited from

[`User`](User.md).[`username`](User.md#username)

## Methods

<a id="getcomments"></a>

### getComments()

> **getComments**(`options`): [`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

Get the user's comments.

#### Parameters

##### options

`Omit`\<[`GetCommentsByUserOptions`](../type-aliases/GetCommentsByUserOptions.md), `"username"`\>

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

A Listing of Comment objects.

#### Inherited from

[`User`](User.md).[`getComments`](User.md#getcomments)

***

<a id="getmodpermissionsforsubreddit"></a>

### getModPermissionsForSubreddit()

> **getModPermissionsForSubreddit**(`subredditName`): `Promise`\<[`ModeratorPermission`](../type-aliases/ModeratorPermission.md)[]\>

Get the mod permissions the user has on the subreddit if they are a moderator.

#### Parameters

##### subredditName

`string`

name of the subreddit

#### Returns

`Promise`\<[`ModeratorPermission`](../type-aliases/ModeratorPermission.md)[]\>

the moderator permissions the user has on the subreddit

#### Inherited from

[`User`](User.md).[`getModPermissionsForSubreddit`](User.md#getmodpermissionsforsubreddit)

***

<a id="getposts"></a>

### getPosts()

> **getPosts**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Get the user's posts.

#### Parameters

##### options

`Omit`\<[`GetPostsByUserOptions`](../type-aliases/GetPostsByUserOptions.md), `"username"`\>

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

A Listing of Post objects.

#### Inherited from

[`User`](User.md).[`getPosts`](User.md#getposts)

***

<a id="getsnoovatarurl"></a>

### getSnoovatarUrl()

> **getSnoovatarUrl**(): `Promise`\<`undefined` \| `string`\>

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Inherited from

[`User`](User.md).[`getSnoovatarUrl`](User.md#getsnoovatarurl)

***

<a id="getsociallinks"></a>

### getSocialLinks()

> **getSocialLinks**(): `Promise`\<[`UserSocialLink`](../type-aliases/UserSocialLink.md)[]\>

Gets social links of the user

#### Returns

`Promise`\<[`UserSocialLink`](../type-aliases/UserSocialLink.md)[]\>

A Promise that resolves an Array of UserSocialLink objects

#### Example

```ts
const socialLinks = await user.getSocialLinks();
```

#### Inherited from

[`User`](User.md).[`getSocialLinks`](User.md#getsociallinks)

***

<a id="gettrophies"></a>

### getTrophies()

> **getTrophies**(): `Promise`\<[`Trophy`](../type-aliases/Trophy.md)[]\>

Get the trophies displayed on this user's profile.

#### Returns

`Promise`\<[`Trophy`](../type-aliases/Trophy.md)[]\>

A Promise that resolves to an array of Trophy objects.

#### Inherited from

[`User`](User.md).[`getTrophies`](User.md#gettrophies)

***

<a id="getuserflairbysubreddit"></a>

### getUserFlairBySubreddit()

> **getUserFlairBySubreddit**(`subreddit`): `Promise`\<`undefined` \| [`UserFlair`](../type-aliases/UserFlair.md)\>

Retrieve the user's flair for the subreddit.

#### Parameters

##### subreddit

`string`

The name of the subreddit associated with the user's flair.

#### Returns

`Promise`\<`undefined` \| [`UserFlair`](../type-aliases/UserFlair.md)\>

#### Example

```ts
const username = "badapple"
const subredditName = "mysubreddit"
const user = await reddit.getUserByUsername(username);
const userFlair = await user.getUserFlairBySubreddit(subredditName);
```

#### Inherited from

[`User`](User.md).[`getUserFlairBySubreddit`](User.md#getuserflairbysubreddit)

***

<a id="getuserkarmafromcurrentsubreddit"></a>

### getUserKarmaFromCurrentSubreddit()

> **getUserKarmaFromCurrentSubreddit**(): `Promise`\<`GetUserKarmaForSubredditResponse`\>

Returns the karma for this User in the current subreddit.
The user making the request must be a moderator of the subreddit to read another user's karma in the subreddit.
An exception is if the specified user is the same as the user making the request.

#### Returns

`Promise`\<`GetUserKarmaForSubredditResponse`\>

The GetUserKarmaForSubredditResponse, containing the user's karma for comments and posts in the subreddit.

#### Inherited from

[`User`](User.md).[`getUserKarmaFromCurrentSubreddit`](User.md#getuserkarmafromcurrentsubreddit)

***

<a id="tojson"></a>

### toJSON()

> **toJSON**(): `Pick`\<[`User`](User.md), `"username"` \| `"id"` \| `"createdAt"` \| `"nsfw"` \| `"linkKarma"` \| `"commentKarma"`\> & `object` & `Pick`\<`SubredditModeratorUser`, `"date"` \| `"moderatorInfo"`\>

#### Returns

`Pick`\<[`User`](User.md), `"username"` \| `"id"` \| `"createdAt"` \| `"nsfw"` \| `"linkKarma"` \| `"commentKarma"`\> & `object` & `Pick`\<`SubredditModeratorUser`, `"date"` \| `"moderatorInfo"`\>

#### Overrides

[`User`](User.md).[`toJSON`](User.md#tojson)
