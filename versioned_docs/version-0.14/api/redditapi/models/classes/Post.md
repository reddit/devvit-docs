[**@devvit/reddit v0.14.3-dev**](../../README.md)

***

# Class: Post

## Accessors

<a id="approved"></a>

### approved

#### Get Signature

> **get** **approved**(): `boolean`

Whether the post has been approved by a moderator.

##### Returns

`boolean`

***

<a id="approvedatutc"></a>

### approvedAtUtc

#### Get Signature

> **get** **approvedAtUtc**(): `number`

The moderation approval time as Unix seconds, or `0` when unavailable.

Use [approved](#approved) to check the current approval state. Convert a nonzero
value to a `Date` with `new Date(post.approvedAtUtc * 1000)`.

##### Returns

`number`

***

<a id="archived"></a>

### archived

#### Get Signature

> **get** **archived**(): `boolean`

Whether the post is archived.

##### Returns

`boolean`

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

The creator's account identifier, or `undefined` when unavailable.

##### Returns

`undefined` \| `` `t2_${string}` ``

***

<a id="authorname"></a>

### authorName

#### Get Signature

> **get** **authorName**(): `string`

The creator's username without the leading `u/`.

##### Returns

`string`

***

<a id="bannedatutc"></a>

### bannedAtUtc

#### Get Signature

> **get** **bannedAtUtc**(): `number`

The ban time as Unix seconds, or `0` when unavailable.

Convert a nonzero value to a `Date` with
`new Date(post.bannedAtUtc * 1000)`.

##### Returns

`number`

***

<a id="body"></a>

### body

#### Get Signature

> **get** **body**(): `undefined` \| `string`

The post body in Markdown. `undefined` if absent.

##### Returns

`undefined` \| `string`

***

<a id="bodyhtml"></a>

### bodyHtml

#### Get Signature

> **get** **bodyHtml**(): `undefined` \| `string`

The post body rendered as HTML, or `undefined` when unavailable.

##### Returns

`undefined` \| `string`

***

<a id="comments"></a>

### comments

#### Get Signature

> **get** **comments**(): [`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

A listing of the post's top-level comments. Each comment exposes its
replies separately.

##### Example

```ts
const comments = await post.comments.get(25);
```

##### Returns

[`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

***

<a id="createdat"></a>

### createdAt

#### Get Signature

> **get** **createdAt**(): `Date`

The date when the post was created.

##### Returns

`Date`

***

<a id="crosspostparentid"></a>

### crosspostParentId

#### Get Signature

> **get** **crosspostParentId**(): `undefined` \| `` `t3_${string}` ``

The original post's identifier when this post is a crosspost. `undefined`
if not a crosspost or parent is unavailable.

##### Returns

`undefined` \| `` `t3_${string}` ``

***

<a id="distinguishedby"></a>

### distinguishedBy

#### Get Signature

> **get** **distinguishedBy**(): `undefined` \| `string`

The post's distinction category.

For example, a post distinguished by a moderator or employee returns
`"moderator"` or `"admin"`. `undefined` means no distinction is available.

##### Returns

`undefined` \| `string`

***

<a id="edited"></a>

### edited

#### Get Signature

> **get** **edited**(): `boolean`

Whether the post body has been edited since it was created.

##### Returns

`boolean`

***

<a id="flair"></a>

### flair

#### Get Signature

> **get** **flair**(): `undefined` \| [`CommonFlair`](../type-aliases/CommonFlair.md)

The post flair, or `undefined` when unavailable.

##### Returns

`undefined` \| [`CommonFlair`](../type-aliases/CommonFlair.md)

***

<a id="gallery"></a>

### gallery

#### Get Signature

> **get** **gallery**(): [`GalleryMedia`](../type-aliases/GalleryMedia.md)[]

Get the image or GIF metadata in the post. Empty if the post doesn't have
any media.

Gallery posts can contain multiple entries. For other posts, one entry from
the first preview image or GIF variant.

##### Returns

[`GalleryMedia`](../type-aliases/GalleryMedia.md)[]

***

<a id="hidden"></a>

### hidden

#### Get Signature

> **get** **hidden**(): `boolean`

Whether the post is hidden from listings.

##### Returns

`boolean`

***

<a id="id"></a>

### id

#### Get Signature

> **get** **id**(): `` `t3_${string}` ``

##### Returns

`` `t3_${string}` ``

***

<a id="ignoringreports"></a>

### ignoringReports

#### Get Signature

> **get** **ignoringReports**(): `boolean`

Whether reports on the post are being ignored.

##### Returns

`boolean`

***

<a id="locked"></a>

### locked

#### Get Signature

> **get** **locked**(): `boolean`

Whether the post is locked and new comments are disabled.

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

<a id="nsfw"></a>

### nsfw

#### Get Signature

> **get** **nsfw**(): `boolean`

Whether the post is marked not safe for work (NSFW).

##### Returns

`boolean`

***

<a id="numberofcomments"></a>

### numberOfComments

#### Get Signature

> **get** **numberOfComments**(): `number`

The number of comments, or `0` when none are available.

##### Returns

`number`

***

<a id="numberofreports"></a>

### numberOfReports

#### Get Signature

> **get** **numberOfReports**(): `number`

The number of reports, or `0` when none are available.

##### Returns

`number`

***

<a id="permalink"></a>

### permalink

#### Get Signature

> **get** **permalink**(): `string`

The post's path relative to `https://www.reddit.com`.

##### Example

```ts
"/r/wallstreetbets/comments/abc123/post/"
```

##### Returns

`string`

***

<a id="polldata"></a>

### pollData

#### Get Signature

> **get** **pollData**(): `undefined` \| [`PollData`](../type-aliases/PollData.md)

The post's poll options, vote totals, and voting end time. `undefined` if
the post is not a poll.

##### Returns

`undefined` \| [`PollData`](../type-aliases/PollData.md)

***

<a id="quarantined"></a>

### quarantined

#### Get Signature

> **get** **quarantined**(): `boolean`

Whether the post is quarantined.

##### Returns

`boolean`

***

<a id="removed"></a>

### removed

#### Get Signature

> **get** **removed**(): `boolean`

Whether the post has been removed by a moderator.

##### Returns

`boolean`

***

<a id="removedby"></a>

### removedBy

#### Get Signature

> **get** **removedBy**(): `undefined` \| `string`

The username of the account that removed the post, without the leading
`u/`, or `undefined` when unavailable.

##### Returns

`undefined` \| `string`

***

<a id="removedbycategory"></a>

### removedByCategory

#### Get Signature

> **get** **removedByCategory**(): `undefined` \| `string`

Identifies who or what removed the post:

- `"anti_evil_ops"`: Reddit Anti-Evil Operations.
- `"author"`: The post's author.
- `"automod_filtered"`: AutoModerator filtering.
- `"community_ops"`: Reddit Community Operations.
- `"content_takedown"`: A content-policy takedown.
- `"copyright_takedown"`: A copyright takedown.
- `"deleted"`: The post was deleted.
- `"moderator"`: A subreddit moderator.
- `"reddit"`: Any other remover.
- `undefined`: No removal category is available.

##### Returns

`undefined` \| `string`

***

<a id="score"></a>

### score

#### Get Signature

> **get** **score**(): `number`

The post's upvotes minus downvotes, or `0` when unavailable.

##### Returns

`number`

***

<a id="securemedia"></a>

### secureMedia

#### Get Signature

> **get** **secureMedia**(): `undefined` \| [`SecureMedia`](../type-aliases/SecureMedia.md)

Metadata for embedded or Reddit-hosted media, including oEmbed or Reddit
video data.

Returns `undefined` when the post has no secure media metadata.

##### Returns

`undefined` \| [`SecureMedia`](../type-aliases/SecureMedia.md)

***

<a id="spam"></a>

### spam

#### Get Signature

> **get** **spam**(): `boolean`

Whether the post has been marked as spam by a moderator.

##### Returns

`boolean`

***

<a id="spoiler"></a>

### spoiler

#### Get Signature

> **get** **spoiler**(): `boolean`

Whether the post's content is hidden until the user explicitly opens it.

##### Returns

`boolean`

***

<a id="stickied"></a>

### stickied

#### Get Signature

> **get** **stickied**(): `boolean`

Whether the post is presented before other posts in its subreddit.

##### Returns

`boolean`

***

<a id="subredditid"></a>

### subredditId

#### Get Signature

> **get** **subredditId**(): `` `t5_${string}` ``

The subreddit identifier where the post was created.

##### Returns

`` `t5_${string}` ``

***

<a id="subredditname"></a>

### subredditName

#### Get Signature

> **get** **subredditName**(): `string`

The owning subreddit's name without the leading `r/`.

##### Returns

`string`

***

<a id="thumbnail"></a>

### thumbnail

#### Get Signature

> **get** **thumbnail**(): `undefined` \| \{ `height`: `number`; `url`: `string`; `width`: `number`; \}

The post's preview thumbnail URL and dimensions in pixels.

`undefined` means no thumbnail is available or the source field contains a
placeholder such as `"self"` or `"nsfw"`.

##### Returns

`undefined` \| \{ `height`: `number`; `url`: `string`; `width`: `number`; \}

***

<a id="title"></a>

### title

#### Get Signature

> **get** **title**(): `string`

The title displayed for the post.

##### Returns

`string`

***

<a id="url"></a>

### url

#### Get Signature

> **get** **url**(): `string`

The post URL.

This is the submitted URL for a link post or the full-size media URL for an
image or video post. Use [permalink](#permalink) for the relative path.

##### Example

```ts
"https://www.reddit.com/r/wallstreetbets/comments/abc123/post/"
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

<a id="addcomment"></a>

### addComment()

> **addComment**(`opts`): `Promise`\<[`Comment`](Comment.md)\>

Creates a top-level comment on the post.

#### Parameters

##### opts

`Readonly`\<[`CommentSubmissionOptions`](../type-aliases/CommentSubmissionOptions.md)\>

#### Returns

`Promise`\<[`Comment`](Comment.md)\>

***

<a id="addremovalnote"></a>

### addRemovalNote()

> **addRemovalNote**(`opts`): `Promise`\<`void`\>

Adds a moderator note explaining why the post was removed.

#### Parameters

##### opts

`Readonly`\<`Omit`\<[`AddRemovalNoteOptions`](../type-aliases/AddRemovalNoteOptions.md), `"itemIds"`\>\>

#### Returns

`Promise`\<`void`\>

***

<a id="approve"></a>

### approve()

> **approve**(): `Promise`\<`void`\>

Approves the post and updates this instance's moderation state.

#### Returns

`Promise`\<`void`\>

***

<a id="crosspost"></a>

### crosspost()

> **crosspost**(`opts`): `Promise`\<`Post`\>

Creates a crosspost of this post in another subreddit.

#### Parameters

##### opts

`Readonly`\<`Omit`\<[`CrosspostOptions`](../type-aliases/CrosspostOptions.md), `"postId"`\>\>

#### Returns

`Promise`\<`Post`\>

***

<a id="delete"></a>

### delete()

> **delete**(): `Promise`\<`void`\>

Deletes the post as the app account.

#### Returns

`Promise`\<`void`\>

***

<a id="distinguish"></a>

### distinguish()

> **distinguish**(): `Promise`\<`void`\>

Distinguishes the post as a moderator and updates this instance.

#### Returns

`Promise`\<`void`\>

***

<a id="distinguishasadmin"></a>

### distinguishAsAdmin()

> **distinguishAsAdmin**(): `Promise`\<`void`\>

Distinguishes the post as an administrator and updates this instance.

#### Returns

`Promise`\<`void`\>

***

<a id="edit"></a>

### edit()

> **edit**(`opts`): `Promise`\<`void`\>

Replaces the post body as the app account, then updates the cached body and
edited state from the response.

#### Parameters

##### opts

`Readonly`\<[`PostTextOptions`](../type-aliases/PostTextOptions.md)\>

#### Returns

`Promise`\<`void`\>

***

<a id="filter"></a>

### filter()

> **filter**(`options`?): `Promise`\<`void`\>

**`Experimental`**

Filters a post. When a post is filtered, it is added to the ModQueue for review. By default, filtered posts are hidden while in the queue. Set `keep` to `true` to keep the post visible. Set `reason` to show moderators a reason; when `keep` is `true`, the reason is also shown on the post.

#### Parameters

##### options?

`FilterOptions`

#### Returns

`Promise`\<`void`\>

***

<a id="getauthor"></a>

### getAuthor()

> **getAuthor**(): `Promise`\<`undefined` \| [`User`](User.md)\>

Fetches the creator's account, or `undefined` if it is unavailable.

#### Returns

`Promise`\<`undefined` \| [`User`](User.md)\>

***

<a id="getcurrentuserpolloption"></a>

### getCurrentUserPollOption()

> **getCurrentUserPollOption**(): `Promise`\<`undefined` \| [`PollOption`](../type-aliases/PollOption.md)\>

Get the poll option the authenticated user selected for this post.
Returns undefined if the post is not a poll or the user has not voted.

This method will get the poll option for the app account by default.
To get the poll option for a user, please contact Reddit.

#### Returns

`Promise`\<`undefined` \| [`PollOption`](../type-aliases/PollOption.md)\>

***

<a id="getcustompoststyles"></a>

### getCustomPostStyles()

> **getCustomPostStyles**(): `Promise`\<`StrictRequired`\<`CustomPostStylesInput`\>\>

**`Experimental`**

Get the custom styles for a custom post.

#### Returns

`Promise`\<`StrictRequired`\<`CustomPostStylesInput`\>\>

***

<a id="getduplicates"></a>

### getDuplicates()

> **getDuplicates**(`opts`): [`Listing`](Listing.md)\<`Post`\>

A listing of other posts that reference the same URL.

#### Parameters

##### opts

`Omit`\<[`GetDuplicatesOptions`](../type-aliases/GetDuplicatesOptions.md), `"postId"`\> = `{}`

#### Returns

[`Listing`](Listing.md)\<`Post`\>

#### Example

```ts
const duplicates = await post.getDuplicates().get(25);
```

***

<a id="getenrichedthumbnail"></a>

### getEnrichedThumbnail()

> **getEnrichedThumbnail**(): `Promise`\<`undefined` \| [`EnrichedThumbnail`](../type-aliases/EnrichedThumbnail.md)\>

Get a thumbnail that contains a preview image and also contains a blurred preview for
NSFW images. The thumbnail returned has higher resolution than Post.thumbnail.
Returns undefined if the post doesn't have a thumbnail

#### Returns

`Promise`\<`undefined` \| [`EnrichedThumbnail`](../type-aliases/EnrichedThumbnail.md)\>

#### Throws

Throws an error if the thumbnail could not be fetched

#### Example

```ts
// from a menu action, form, scheduler, trigger, custom post click event, etc
const post = await context.reddit.getPostById(context.postId);
const enrichedThumbnail = await post.getEnrichedThumbnail();
```

***

<a id="getpostdata"></a>

### getPostData()

> **getPostData**(): `Promise`\<`undefined` \| `JsonObject`\>

Get the post data for the custom post.

#### Returns

`Promise`\<`undefined` \| `JsonObject`\>

#### Example

```ts
const post = await reddit.getPostById(context.postId);
const postData = await post.getPostData();
```

***

<a id="hide"></a>

### hide()

> **hide**(): `Promise`\<`void`\>

Hides the post from the app account and updates this instance.

#### Returns

`Promise`\<`void`\>

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

The post's approval state.

#### Returns

`boolean`

***

<a id="isarchived"></a>

### isArchived()

> **isArchived**(): `boolean`

The post's archived state.

#### Returns

`boolean`

***

<a id="isdistinguishedby"></a>

### isDistinguishedBy()

> **isDistinguishedBy**(): `undefined` \| `string`

The post's distinction category.

#### Returns

`undefined` \| `string`

***

<a id="isedited"></a>

### isEdited()

> **isEdited**(): `boolean`

The post's edited state.

#### Returns

`boolean`

***

<a id="ishidden"></a>

### isHidden()

> **isHidden**(): `boolean`

The post's hidden state.

#### Returns

`boolean`

***

<a id="isignoringreports"></a>

### isIgnoringReports()

> **isIgnoringReports**(): `boolean`

The post's report-ignore state.

#### Returns

`boolean`

***

<a id="islocked"></a>

### isLocked()

> **isLocked**(): `boolean`

The post's locked state.

#### Returns

`boolean`

***

<a id="isnsfw"></a>

### isNsfw()

> **isNsfw**(): `boolean`

The post's NSFW state.

#### Returns

`boolean`

***

<a id="isquarantined"></a>

### isQuarantined()

> **isQuarantined**(): `boolean`

The post's quarantine state.

#### Returns

`boolean`

***

<a id="isremoved"></a>

### isRemoved()

> **isRemoved**(): `boolean`

The post's removal state.

#### Returns

`boolean`

***

<a id="isspam"></a>

### isSpam()

> **isSpam**(): `boolean`

The post's spam state.

#### Returns

`boolean`

***

<a id="isspoiler"></a>

### isSpoiler()

> **isSpoiler**(): `boolean`

The post's spoiler state.

#### Returns

`boolean`

***

<a id="isstickied"></a>

### isStickied()

> **isStickied**(): `boolean`

The post's stickied state.

#### Returns

`boolean`

***

<a id="lock"></a>

### lock()

> **lock**(): `Promise`\<`void`\>

Disables new comments and updates this instance's locked state.

#### Returns

`Promise`\<`void`\>

***

<a id="markasnsfw"></a>

### markAsNsfw()

> **markAsNsfw**(): `Promise`\<`void`\>

Marks the post as NSFW and updates this instance.

#### Returns

`Promise`\<`void`\>

***

<a id="markasspoiler"></a>

### markAsSpoiler()

> **markAsSpoiler**(): `Promise`\<`void`\>

Marks the post as a spoiler and updates this instance.

#### Returns

`Promise`\<`void`\>

***

<a id="mergepostdata"></a>

### mergePostData()

> **mergePostData**(`postData`): `Promise`\<`void`\>

Shallow-merge `postData` with any existing post data.

Existing top-level properties are preserved unless the input replaces
them. Nested objects are replaced rather than deeply merged.

#### Parameters

##### postData

`JsonObject`

#### Returns

`Promise`\<`void`\>

#### Throws

If the post data could not be updated.

#### Example

```ts
const post = await reddit.getPostById(context.postId);

// Existing data:
// { currentScore: 55, settings: { theme: 'dark', fontSize: 12 } }

await post.mergePostData({ settings: { fontSize: 14 } });
// Result: { currentScore: 55, settings: { fontSize: 14 } }
```

***

<a id="remove"></a>

### remove()

> **remove**(`isSpam`): `Promise`\<`void`\>

Removes the post and updates this instance's moderation state.

#### Parameters

##### isSpam

`boolean` = `false`

Whether to classify the removed post as spam.

#### Returns

`Promise`\<`void`\>

***

<a id="setcustompoststyles"></a>

### setCustomPostStyles()

> **setCustomPostStyles**(`styles`): `Promise`\<`void`\>

**`Experimental`**

Updates a custom post's styles.

Unspecified properties retain their existing values. Passing `undefined`
removes all custom styles.

#### Parameters

##### styles

`undefined` | `CustomPostStylesInput`

#### Returns

`Promise`\<`void`\>

***

<a id="setpostdata"></a>

### setPostData()

> **setPostData**(`postData`): `Promise`\<`void`\>

Replace the post data stored on a custom post.

#### Parameters

##### postData

`JsonObject`

Represents the postData to be set, eg: { currentScore: 55, secretWord: 'barbeque' }

#### Returns

`Promise`\<`void`\>

#### Throws

Throws an error if the postData could not be set.

#### Example

```ts
const post = await reddit.getPostById(context.postId);

// Existing postData: { settings: { theme: 'dark', fontSize: 12 } }

await post.setPostData({
  currentScore: 55,
  secretWord: 'barbeque',
});
// Result: { currentScore: 55, secretWord: 'barbeque' }
```

***

<a id="setsuggestedcommentsort"></a>

### setSuggestedCommentSort()

> **setSuggestedCommentSort**(`suggestedSort`): `Promise`\<`void`\>

Sets the suggested default sort for the post's comments.

#### Parameters

##### suggestedSort

[`PostSuggestedCommentSort`](../type-aliases/PostSuggestedCommentSort.md)

#### Returns

`Promise`\<`void`\>

#### Throws

If the suggested sort is rejected.

#### Example

```ts
const post = await reddit.getPostById(context.postId);
await post.setSuggestedCommentSort('NEW');
```

***

<a id="settextfallback"></a>

### setTextFallback()

> **setTextFallback**(`opts`): `Promise`\<`void`\>

Replaces the content shown when a custom post cannot be rendered. Eg, on
`old.reddit.com`.

The fallback may be plain text, Markdown, or rich text. This instance's
body and edited state are updated from the response.

#### Parameters

##### opts

`Readonly`\<[`CustomPostTextFallbackOptions`](../type-aliases/CustomPostTextFallbackOptions.md)\>

#### Returns

`Promise`\<`void`\>

#### Throws

If the fallback could not be updated.

#### Example

```ts
const newTextFallback = { text: 'This is an updated text fallback' };
const post = await context.reddit.getPostById(context.postId);
await post.setTextFallback(newTextFallback);
```

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

<a id="sticky"></a>

### sticky()

> **sticky**(`position`?): `Promise`\<`void`\>

Pins the post in a sticky slot.

#### Parameters

##### position?

The sticky slot. If omitted, the bottom-most available
slot is used. Use 1 or 2 for subreddit posts. 3 and 4 are reserved for
profile pins.

`1` | `2` | `3` | `4`

#### Returns

`Promise`\<`void`\>

***

<a id="tojson"></a>

### toJSON()

> **toJSON**(): `Pick`\<`Post`, `"flair"` \| `"spoiler"` \| `"id"` \| `"subredditName"` \| `"body"` \| `"permalink"` \| `"title"` \| `"createdAt"` \| `"nsfw"` \| `"url"` \| `"authorId"` \| `"authorName"` \| `"subredditId"` \| `"bodyHtml"` \| `"thumbnail"` \| `"score"` \| `"numberOfComments"` \| `"numberOfReports"` \| `"approved"` \| `"spam"` \| `"stickied"` \| `"removed"` \| `"removedBy"` \| `"removedByCategory"` \| `"archived"` \| `"edited"` \| `"locked"` \| `"quarantined"` \| `"hidden"` \| `"ignoringReports"` \| `"distinguishedBy"` \| `"authorFlair"` \| `"secureMedia"` \| `"userReportReasons"` \| `"modReports"` \| `"modReportReasons"` \| `"crosspostParentId"`\>

JSON representation of public fields.

#### Returns

`Pick`\<`Post`, `"flair"` \| `"spoiler"` \| `"id"` \| `"subredditName"` \| `"body"` \| `"permalink"` \| `"title"` \| `"createdAt"` \| `"nsfw"` \| `"url"` \| `"authorId"` \| `"authorName"` \| `"subredditId"` \| `"bodyHtml"` \| `"thumbnail"` \| `"score"` \| `"numberOfComments"` \| `"numberOfReports"` \| `"approved"` \| `"spam"` \| `"stickied"` \| `"removed"` \| `"removedBy"` \| `"removedByCategory"` \| `"archived"` \| `"edited"` \| `"locked"` \| `"quarantined"` \| `"hidden"` \| `"ignoringReports"` \| `"distinguishedBy"` \| `"authorFlair"` \| `"secureMedia"` \| `"userReportReasons"` \| `"modReports"` \| `"modReportReasons"` \| `"crosspostParentId"`\>

***

<a id="undistinguish"></a>

### undistinguish()

> **undistinguish**(): `Promise`\<`void`\>

Removes the post's distinction and updates this instance.

#### Returns

`Promise`\<`void`\>

***

<a id="unhide"></a>

### unhide()

> **unhide**(): `Promise`\<`void`\>

Unhides the post for the app account and updates this instance.

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

Enables new comments and updates this instance's locked state.

#### Returns

`Promise`\<`void`\>

***

<a id="unmarkasnsfw"></a>

### unmarkAsNsfw()

> **unmarkAsNsfw**(): `Promise`\<`void`\>

Removes the NSFW designation and updates this instance.

#### Returns

`Promise`\<`void`\>

***

<a id="unmarkasspoiler"></a>

### unmarkAsSpoiler()

> **unmarkAsSpoiler**(): `Promise`\<`void`\>

Removes the spoiler designation and updates this instance.

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

***

<a id="unsticky"></a>

### unsticky()

> **unsticky**(): `Promise`\<`void`\>

Unpins the post without updating this instance's cached [stickied](#stickied)
value.

#### Returns

`Promise`\<`void`\>

***

<a id="updatecrowdcontrollevel"></a>

### updateCrowdControlLevel()

> **updateCrowdControlLevel**(`level`): `Promise`\<`void`\>

Sets which comments Crowd Control collapses on this post.

#### Parameters

##### level

[`CrowdControlLevel`](../type-aliases/CrowdControlLevel.md)

See [CrowdControlLevel](../type-aliases/CrowdControlLevel.md) for the available levels.

#### Returns

`Promise`\<`void`\>
