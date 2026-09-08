[**@devvit/public-api v0.14.4-dev**](../README.md)

***

# Class: Comment

## Constructors

<a id="constructor"></a>

### new Comment()

> **new Comment**(): `Comment`

#### Returns

`Comment`

## Accessors

<a id="approved"></a>

### approved

#### Get Signature

> **get** **approved**(): `boolean`

Whether the comment has been approved by a moderator.

##### Returns

`boolean`

***

<a id="approvedatutc"></a>

### approvedAtUtc

#### Get Signature

> **get** **approvedAtUtc**(): `number`

The moderation approval time as Unix seconds, or `0` when unavailable.

Use [approved](#approved) to check the current approval state. Convert a
nonzero value to a `Date` with `new Date(comment.approvedAtUtc * 1000)`.

##### Returns

`number`

***

<a id="authorflair"></a>

### authorFlair

#### Get Signature

> **get** **authorFlair**(): `undefined` \| [`CommonFlair`](../type-aliases/CommonFlair.md)

The author's subreddit flair, or `undefined` when unavailable.

##### Returns

`undefined` \| [`CommonFlair`](../type-aliases/CommonFlair.md)

***

<a id="authorid"></a>

### authorId

#### Get Signature

> **get** **authorId**(): `undefined` \| `` `t2_${string}` ``

The creator's account identifier or `undefined` when unavailable.

##### Returns

`undefined` \| `` `t2_${string}` ``

***

<a id="authorname"></a>

### authorName

#### Get Signature

> **get** **authorName**(): `string`

The creator's username without the leading `u/`. May be `"[deleted]"` when
the author is unavailable.

##### Example

```ts
"Example_User"
```

##### Returns

`string`

***

<a id="bannedatutc"></a>

### bannedAtUtc

#### Get Signature

> **get** **bannedAtUtc**(): `number`

The ban time as Unix seconds, or `0` when unavailable.

Convert a nonzero value to a `Date` with
`new Date(comment.bannedAtUtc * 1000)`.

##### Returns

`number`

***

<a id="body"></a>

### body

#### Get Signature

> **get** **body**(): `string`

The comment body in Markdown.

##### Returns

`string`

***

<a id="collapsedbecausecrowdcontrol"></a>

### collapsedBecauseCrowdControl

#### Get Signature

> **get** **collapsedBecauseCrowdControl**(): `boolean`

Whether Crowd Control caused the comment to be collapsed.

##### Returns

`boolean`

***

<a id="createdat"></a>

### createdAt

#### Get Signature

> **get** **createdAt**(): `Date`

The date when the comment was created.

##### Returns

`Date`

***

<a id="distinguishedby"></a>

### distinguishedBy

#### Get Signature

> **get** **distinguishedBy**(): `undefined` \| `string`

The comment's distinction category.

For example, a comment distinguished by a moderator or administrator
returns `"moderator"` or `"admin"`. `undefined` means no distinction is
available.

##### Returns

`undefined` \| `string`

***

<a id="edited"></a>

### edited

#### Get Signature

> **get** **edited**(): `boolean`

Whether the comment body has been edited since it was created.

##### Returns

`boolean`

***

<a id="id"></a>

### id

#### Get Signature

> **get** **id**(): `` `t1_${string}` ``

##### Returns

`` `t1_${string}` ``

***

<a id="ignoringreports"></a>

### ignoringReports

#### Get Signature

> **get** **ignoringReports**(): `boolean`

Whether reports on the comment are being ignored.

##### Returns

`boolean`

***

<a id="locked"></a>

### locked

#### Get Signature

> **get** **locked**(): `boolean`

Whether the comment is locked and new replies are disabled.

##### Returns

`boolean`

***

<a id="modreportreasons"></a>

### modReportReasons

#### Get Signature

> **get** **modReportReasons**(): `string`[]

##### Deprecated

Use [modReports](#modreports) to retain each report's author.

##### Returns

`string`[]

***

<a id="modreports"></a>

### modReports

#### Get Signature

> **get** **modReports**(): [`ModeratorReport`](../type-aliases/ModeratorReport.md)[]

Moderator reports and authors, or an empty array when unavailable.

##### Returns

[`ModeratorReport`](../type-aliases/ModeratorReport.md)[]

***

<a id="numreports"></a>

### numReports

#### Get Signature

> **get** **numReports**(): `number`

The number of reports, or `0` when none are available.

##### Returns

`number`

***

<a id="parentid"></a>

### parentId

#### Get Signature

> **get** **parentId**(): `` `t3_${string}` `` \| `` `t1_${string}` ``

The identifier of the comment's parent.

A top-level comment returns the containing post's `T3`. A reply returns its
parent comment's `T1`.

##### Returns

`` `t3_${string}` `` \| `` `t1_${string}` ``

***

<a id="permalink"></a>

### permalink

#### Get Signature

> **get** **permalink**(): `string`

The comment's path relative to `https://www.reddit.com`.

##### Example

```ts
"/r/wallstreetbets/comments/abc123/example_post/def456/"
```

##### Returns

`string`

***

<a id="postid"></a>

### postId

#### Get Signature

> **get** **postId**(): `` `t3_${string}` ``

The identifier of the post containing the comment.

##### Returns

`` `t3_${string}` ``

***

<a id="removed"></a>

### removed

#### Get Signature

> **get** **removed**(): `boolean`

Whether the comment has been removed by a moderator.

##### Returns

`boolean`

***

<a id="replies"></a>

### replies

#### Get Signature

> **get** **replies**(): [`Listing`](Listing.md)\<`Comment`\>

The comment's direct replies.

##### Returns

[`Listing`](Listing.md)\<`Comment`\>

***

<a id="score"></a>

### score

#### Get Signature

> **get** **score**(): `number`

The comment's upvotes minus downvotes, or `0` when unavailable.

##### Returns

`number`

***

<a id="spam"></a>

### spam

#### Get Signature

> **get** **spam**(): `boolean`

Whether the comment has been marked as spam by a moderator.

##### Returns

`boolean`

***

<a id="stickied"></a>

### stickied

#### Get Signature

> **get** **stickied**(): `boolean`

Whether the comment is pinned to the top of its comment thread.

##### Returns

`boolean`

***

<a id="subredditid"></a>

### subredditId

#### Get Signature

> **get** **subredditId**(): `` `t5_${string}` ``

The subreddit identifier where the comment was created.

##### Returns

`` `t5_${string}` ``

***

<a id="subredditname"></a>

### subredditName

#### Get Signature

> **get** **subredditName**(): `string`

The name of the subreddit that contains the comment, without the leading
`r/`.

##### Example

```ts
"AskReddit"
```

##### Returns

`string`

***

<a id="url"></a>

### url

#### Get Signature

> **get** **url**(): `string`

The absolute `https://www.reddit.com` URL for the comment.

##### Example

```ts
"https://www.reddit.com/r/wallstreetbets/comments/abc123/post/def456/"
```

##### Returns

`string`

***

<a id="userreportreasons"></a>

### userReportReasons

#### Get Signature

> **get** **userReportReasons**(): `string`[]

User report reasons, or an empty array when none are available.

##### Returns

`string`[]

## Methods

<a id="addremovalnote"></a>

### addRemovalNote()

> **addRemovalNote**(`opts`): `Promise`\<`void`\>

Adds a moderator note explaining why the comment was removed.

#### Parameters

##### opts

`Readonly`\<`Omit`\<[`AddRemovalNoteOptions`](../type-aliases/AddRemovalNoteOptions.md), `"itemIds"`\>\>

#### Returns

`Promise`\<`void`\>

***

<a id="approve"></a>

### approve()

> **approve**(): `Promise`\<`void`\>

Approves the comment and updates this instance's moderation state.

#### Returns

`Promise`\<`void`\>

***

<a id="delete"></a>

### delete()

> **delete**(): `Promise`\<`void`\>

Deletes the comment as the app account.

The `runAs` option is ignored when editing a comment.

#### Returns

`Promise`\<`void`\>

***

<a id="distinguish"></a>

### distinguish()

> **distinguish**(`makeSticky`?): `Promise`\<`void`\>

Distinguishes the comment as a moderator and updates this instance.

#### Parameters

##### makeSticky?

`boolean`

Whether to pin the comment to the top of its thread.

#### Returns

`Promise`\<`void`\>

***

<a id="distinguishasadmin"></a>

### distinguishAsAdmin()

> **distinguishAsAdmin**(`makeSticky`?): `Promise`\<`void`\>

Distinguishes the comment as an employee and updates this instance.

#### Parameters

##### makeSticky?

`boolean`

Whether to pin the comment to the top of its thread.

#### Returns

`Promise`\<`void`\>

***

<a id="edit"></a>

### edit()

> **edit**(`opts`): `Promise`\<`Comment`\>

Replaces the comment body as the app account, then updates the cached body
and edited state from the response.

The `runAs` option is ignored when editing a comment.

#### Parameters

##### opts

`Readonly`\<[`CommentSubmissionOptions`](../type-aliases/CommentSubmissionOptions.md)\>

#### Returns

`Promise`\<`Comment`\>

***

<a id="filter"></a>

### filter()

> **filter**(`options`?): `Promise`\<`void`\>

**`Experimental`**

Filters the comment. When a comment is filtered, it is added to the ModQueue for review, and in addition:
- if

#### Parameters

##### options?

[`FilterOptions`](../type-aliases/FilterOptions.md)

#### Returns

`Promise`\<`void`\>

***

<a id="getauthor"></a>

### getAuthor()

> **getAuthor**(): `Promise`\<`undefined` \| [`User`](User.md)\>

Fetches the author's account, or `undefined` if it is unavailable.

#### Returns

`Promise`\<`undefined` \| [`User`](User.md)\>

***

<a id="ignorereports"></a>

### ignoreReports()

> **ignoreReports**(): `Promise`\<`void`\>

Ignores reports and updates this instance's report-ignore state.

#### Returns

`Promise`\<`void`\>

***

<a id="isapproved"></a>

### isApproved()

> **isApproved**(): `boolean`

The comment's approval state.

#### Returns

`boolean`

***

<a id="isdistinguished"></a>

### isDistinguished()

> **isDistinguished**(): `boolean`

The comment's distinguished category state.

#### Returns

`boolean`

***

<a id="isedited"></a>

### isEdited()

> **isEdited**(): `boolean`

The comment's edited state.

#### Returns

`boolean`

***

<a id="isignoringreports"></a>

### isIgnoringReports()

> **isIgnoringReports**(): `boolean`

The comment's report-ignore state.

#### Returns

`boolean`

***

<a id="islocked"></a>

### isLocked()

> **isLocked**(): `boolean`

The comment's locked state.

#### Returns

`boolean`

***

<a id="isremoved"></a>

### isRemoved()

> **isRemoved**(): `boolean`

The comment's removal state.

#### Returns

`boolean`

***

<a id="isspam"></a>

### isSpam()

> **isSpam**(): `boolean`

The comment's spam state.

#### Returns

`boolean`

***

<a id="isstickied"></a>

### isStickied()

> **isStickied**(): `boolean`

The comment's stickied state.

#### Returns

`boolean`

***

<a id="lock"></a>

### lock()

> **lock**(): `Promise`\<`void`\>

Disables new replies and updates this instance's locked state.

#### Returns

`Promise`\<`void`\>

***

<a id="remove"></a>

### remove()

> **remove**(`isSpam`?): `Promise`\<`void`\>

Removes the comment and updates this instance's moderation state.

#### Parameters

##### isSpam?

`boolean`

Whether to classify the removed comment as spam.

#### Returns

`Promise`\<`void`\>

***

<a id="reply"></a>

### reply()

> **reply**(`opts`): `Promise`\<`Comment`\>

Creates a direct reply to the comment.

#### Parameters

##### opts

`Readonly`\<[`CommentSubmissionOptions`](../type-aliases/CommentSubmissionOptions.md)\>

#### Returns

`Promise`\<`Comment`\>

***

<a id="showcomment"></a>

### showComment()

> **showComment**(): `Promise`\<`void`\>

Prevents Crowd Control from collapsing the comment. Other rules can still
collapse it.

#### Returns

`Promise`\<`void`\>

***

<a id="snoozereports"></a>

### snoozeReports()

> **snoozeReports**(`reason`): `Promise`\<`void`\>

Snoozes subsequent reports with the same reason from the same users for
seven days. This only works for free-form reports.

#### Parameters

##### reason

`string`

The report reason to snooze.

#### Returns

`Promise`\<`void`\>

***

<a id="tojson"></a>

### toJSON()

> **toJSON**(): `Pick`\<`Comment`, `"postId"` \| `"subredditName"` \| `"id"` \| `"subredditId"` \| `"permalink"` \| `"url"` \| `"createdAt"` \| `"authorName"` \| `"body"` \| `"score"` \| `"approved"` \| `"spam"` \| `"stickied"` \| `"removed"` \| `"edited"` \| `"locked"` \| `"ignoringReports"` \| `"distinguishedBy"` \| `"authorFlair"` \| `"userReportReasons"` \| `"modReports"` \| `"modReportReasons"` \| `"parentId"` \| `"replies"` \| `"numReports"` \| `"collapsedBecauseCrowdControl"`\>

Returns the public fields included when the comment is serialized.

#### Returns

`Pick`\<`Comment`, `"postId"` \| `"subredditName"` \| `"id"` \| `"subredditId"` \| `"permalink"` \| `"url"` \| `"createdAt"` \| `"authorName"` \| `"body"` \| `"score"` \| `"approved"` \| `"spam"` \| `"stickied"` \| `"removed"` \| `"edited"` \| `"locked"` \| `"ignoringReports"` \| `"distinguishedBy"` \| `"authorFlair"` \| `"userReportReasons"` \| `"modReports"` \| `"modReportReasons"` \| `"parentId"` \| `"replies"` \| `"numReports"` \| `"collapsedBecauseCrowdControl"`\>

***

<a id="undistinguish"></a>

### undistinguish()

> **undistinguish**(): `Promise`\<`void`\>

Removes the distinction category and sticky status and updates this
instance.

#### Returns

`Promise`\<`void`\>

***

<a id="unignorereports"></a>

### unignoreReports()

> **unignoreReports**(): `Promise`\<`void`\>

Stops ignoring reports and updates this instance's cached state.

#### Returns

`Promise`\<`void`\>

***

<a id="unlock"></a>

### unlock()

> **unlock**(): `Promise`\<`void`\>

Enables new replies and updates this instance's locked state.

#### Returns

`Promise`\<`void`\>

***

<a id="unsnoozereports"></a>

### unsnoozeReports()

> **unsnoozeReports**(`reason`): `Promise`\<`void`\>

Unsnoozes reports with the given reason. This only works for free-form
reports.

#### Parameters

##### reason

`string`

The report reason to unsnooze.

#### Returns

`Promise`\<`void`\>
