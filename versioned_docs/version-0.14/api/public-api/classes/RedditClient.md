[**@devvit/public-api v0.14.4-dev**](../README.md)

***

# Class: RedditClient

The Reddit API Client

To use the Reddit API Client, add it to the plugin configuration at the top of the file.

## Example

```ts

Devvit.configure({
   redditAPI: true,
   // other plugins
})

// use within one of our capability handlers e.g. Menu Actions, Triggers, Scheduled Job Type, etc
async (event, context) => {
    const subreddit = await context.reddit.getSubredditById(context.subredditId);
    context.reddit.submitPost({
      subredditName: subreddit.name,
      title: 'test post',
      text: 'test body',
    })
    // additional code
}
```

## Extended by

- [`RedditAPIClient`](RedditAPIClient.md)

## Constructors

<a id="constructor"></a>

### new RedditClient()

> **new RedditClient**(): `RedditClient`

#### Returns

`RedditClient`

## Accessors

<a id="modmail"></a>

### modMail

#### Get Signature

> **get** **modMail**(): [`ModMailService`](ModMailService.md)

Get ModMail API object

##### Example

```ts
await reddit.modMail.reply({
  body: "Here is my message",
  conversationId: "abcd42";
})
```

##### Returns

[`ModMailService`](ModMailService.md)

## Methods

<a id="addeditortowikipage"></a>

### addEditorToWikiPage()

> **addEditorToWikiPage**(`subredditName`, `page`, `username`, `options`?): `Promise`\<`void`\>

Add an editor to a wiki page.

#### Parameters

##### subredditName

`string`

The name of the subreddit the wiki is in.

##### page

`string`

The name of the wiki page to add the editor to.

##### username

`string`

The username of the user to add as an editor.

##### options?

[`WikiVersionOptions`](../type-aliases/WikiVersionOptions.md)

Options for the request.

#### Returns

`Promise`\<`void`\>

***

<a id="addmodnote"></a>

### addModNote()

> **addModNote**(`options`): `Promise`\<[`ModNote`](ModNote.md)\>

Adds a moderation note to a user and returns the created note.

#### Parameters

##### options

[`CreateModNoteOptions`](../type-aliases/CreateModNoteOptions.md)

#### Returns

`Promise`\<[`ModNote`](ModNote.md)\>

#### Example

```ts
const modNote = await reddit.addModNote({
  subreddit: 'wallstreetbets',
  user: 'spez',
  note: 'Repeated rule 1 violations',
  label: 'ABUSE_WARNING',
});
```

***

<a id="addremovalnote"></a>

### addRemovalNote()

> **addRemovalNote**(`options`): `Promise`\<`void`\>

Adds a removal note to each specified post or comment.

#### Parameters

##### options

[`AddRemovalNoteOptions`](../type-aliases/AddRemovalNoteOptions.md)

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await reddit.addRemovalNote({
  itemIds: ['t1_abc123', 't3_def456'],
  reasonId: '',
  modNote: 'Removed for breaking rule 1',
});
```

***

<a id="addsubredditremovalreason"></a>

### addSubredditRemovalReason()

> **addSubredditRemovalReason**(`subredditName`, `options`): `Promise`\<`string`\>

Add a removal reason to a subreddit.

#### Parameters

##### subredditName

`string`

Name of the subreddit (the 'r/' prefix is optional).

##### options

Options.

###### message

`string`

The message associated with the removal reason.

###### title

`string`

The title of the removal reason.

#### Returns

`Promise`\<`string`\>

Removal Reason ID

#### Example

```ts
const newReason = await reddit.addSubredditRemovalReasons(
  'askReddit',
  {
    title: 'Spam',
    message: 'This is spam!'
  }
);
console.log(newReason.id)
```

***

<a id="addwidget"></a>

### addWidget()

> **addWidget**(`widgetData`): `Promise`\<[`Widget`](Widget.md)\>

Add a widget to a subreddit.

#### Parameters

##### widgetData

[`AddWidgetData`](../type-aliases/AddWidgetData.md)

The data for the widget to add.

#### Returns

`Promise`\<[`Widget`](Widget.md)\>

- The added Widget object.

***

<a id="addwikicontributor"></a>

### addWikiContributor()

> **addWikiContributor**(`username`, `subredditName`): `Promise`\<`void`\>

Add a user as a wiki contributor for a subreddit.

#### Parameters

##### username

`string`

The username of the user to add as a wiki contributor. e.g. 'spez'

##### subredditName

`string`

The name of the subreddit to add the user as a wiki contributor. e.g. 'memes'

#### Returns

`Promise`\<`void`\>

***

<a id="approve"></a>

### approve()

> **approve**(`id`): `Promise`\<`void`\>

Approve a post or comment.

#### Parameters

##### id

The id of the post (t3_) or comment (t1_) to approve.

`` `t3_${string}` `` | `` `t1_${string}` ``

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await reddit.approve('t3_123456');
await reddit.approve('t1_123456');
```

***

<a id="approveuser"></a>

### approveUser()

> **approveUser**(`username`, `subredditName`): `Promise`\<`void`\>

Approve a user to post in a subreddit.

#### Parameters

##### username

`string`

The username of the user to approve. e.g. 'spez'

##### subredditName

`string`

The name of the subreddit to approve the user in. e.g. 'memes'

#### Returns

`Promise`\<`void`\>

***

<a id="banuser"></a>

### banUser()

> **banUser**(`options`): `Promise`\<`void`\>

Ban a user from a subreddit.

#### Parameters

##### options

[`BanUserOptions`](../type-aliases/BanUserOptions.md)

Options for the request

#### Returns

`Promise`\<`void`\>

***

<a id="banwikicontributor"></a>

### banWikiContributor()

> **banWikiContributor**(`options`): `Promise`\<`void`\>

Ban a user from contributing to the wiki on a subreddit.

#### Parameters

##### options

[`BanWikiContributorOptions`](../type-aliases/BanWikiContributorOptions.md)

Options for the request

#### Returns

`Promise`\<`void`\>

***

<a id="createpostflairtemplate"></a>

### createPostFlairTemplate()

> **createPostFlairTemplate**(`options`): `Promise`\<[`FlairTemplate`](FlairTemplate.md)\>

Create a post flair template for a subreddit.

#### Parameters

##### options

[`CreateFlairTemplateOptions`](../type-aliases/CreateFlairTemplateOptions.md)

Options for the request

#### Returns

`Promise`\<[`FlairTemplate`](FlairTemplate.md)\>

The created FlairTemplate object.

***

<a id="createrule"></a>

### createRule()

> **createRule**(`subredditName`, `options`): `Promise`\<`void`\>

Create a new rule in a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to add the rule to.

##### options

[`CreateRuleOptions`](../type-aliases/CreateRuleOptions.md)

#### Returns

`Promise`\<`void`\>

***

<a id="createshareurl"></a>

### createShareUrl()

> **createShareUrl**(`url`): `Promise`\<`string`\>

Create a short share URL for a Reddit location.

Valid inputs:
- Absolute Reddit URLs without a query string (e.g., https://reddit.com/r/gamesonreddit)
- URLs with a query string limited to: utm_source, utm_medium, devvitshare

#### Parameters

##### url

`string`

Full Reddit URL to shorten. Must be absolute and either have no query string or only the allowed query params.

#### Returns

`Promise`\<`string`\>

The shortened share URL (e.g., 'https://reddit.com/s/abc123').

#### Note

old.reddit.com URLs can be shortened but they will redirect to reddit.com.

#### Throws

If the input URL is invalid, contains unsupported query parameters, or the share URL cannot be created.

***

<a id="createuserflairtemplate"></a>

### createUserFlairTemplate()

> **createUserFlairTemplate**(`options`): `Promise`\<[`FlairTemplate`](FlairTemplate.md)\>

Create a user flair template for a subreddit.

#### Parameters

##### options

[`CreateFlairTemplateOptions`](../type-aliases/CreateFlairTemplateOptions.md)

Options for the request

#### Returns

`Promise`\<[`FlairTemplate`](FlairTemplate.md)\>

The created FlairTemplate object.

***

<a id="createwikipage"></a>

### createWikiPage()

> **createWikiPage**(`options`): `Promise`\<[`WikiPage`](WikiPage.md)\>

Create a new wiki page for a subreddit.

#### Parameters

##### options

[`CreateWikiPageOptions`](../type-aliases/CreateWikiPageOptions.md)

Options for the request

#### Returns

`Promise`\<[`WikiPage`](WikiPage.md)\>

- The created WikiPage object.

***

<a id="crosspost"></a>

### crosspost()

> **crosspost**(`opts`): `Promise`\<[`Post`](Post.md)\>

Crossposts a post to a subreddit.

#### Parameters

##### opts

`Readonly`\<[`SubredditOptions`](../type-aliases/SubredditOptions.md) & [`CommonSubmitPostOptions`](../type-aliases/CommonSubmitPostOptions.md) & `Required`\<[`SubredditOptions`](../type-aliases/SubredditOptions.md)\> & `object`\>

Options for crossposting a post

#### Returns

`Promise`\<[`Post`](Post.md)\>

- A Promise that resolves to a Post object.

#### See

 - [()\|submitPost()](#submitpost)
 - [()\|submitCustomPost()](#submitcustompost)

***

<a id="deleteflairtemplate"></a>

### deleteFlairTemplate()

> **deleteFlairTemplate**(`subredditName`, `flairTemplateId`): `Promise`\<`void`\>

Delete a flair template from a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to delete the flair template from.

##### flairTemplateId

`string`

The ID of the flair template to delete.

#### Returns

`Promise`\<`void`\>

***

<a id="deletemodnote"></a>

### deleteModNote()

> **deleteModNote**(`options`): `Promise`\<`boolean`\>

Deletes a moderation note. Returns true if successful.

#### Parameters

##### options

[`DeleteNotesOptions`](../type-aliases/DeleteNotesOptions.md)

#### Returns

`Promise`\<`boolean`\>

***

<a id="deletesubredditremovalreason"></a>

### deleteSubredditRemovalReason()

> **deleteSubredditRemovalReason**(`subredditName`, `reasonId`): `Promise`\<`void`\>

Delete a removal reason from a subreddit.

#### Parameters

##### subredditName

`string`

Name of the subreddit (the 'r/' prefix is optional).

##### reasonId

`string`

ID of the removal reason (from get or add).

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await reddit.deleteSubredditRemovalReason('askReddit', 'uuid-abc');
```

***

<a id="deletewidget"></a>

### deleteWidget()

> **deleteWidget**(`subredditName`, `widgetId`): `Promise`\<`void`\>

Delete a widget from a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to delete the widget from.

##### widgetId

`string`

The ID of the widget to delete.

#### Returns

`Promise`\<`void`\>

***

<a id="editflairtemplate"></a>

### editFlairTemplate()

> **editFlairTemplate**(`options`): `Promise`\<[`FlairTemplate`](FlairTemplate.md)\>

Edit a flair template for a subreddit. This can be either a post or user flair template.
Note: If you leave any of the options fields as undefined, they will reset to their default values.

#### Parameters

##### options

[`EditFlairTemplateOptions`](../type-aliases/EditFlairTemplateOptions.md)

Options for the request

#### Returns

`Promise`\<[`FlairTemplate`](FlairTemplate.md)\>

The edited FlairTemplate object.

***

<a id="filter"></a>

### filter()

> **filter**(`id`, `options`?): `Promise`\<`void`\>

**`Experimental`**

Filters a post or comment. When a post or comment is filtered, it is added to the ModQueue for review, and in addition:
- if

#### Parameters

##### id

The id of the post (t3_) or comment (t1_) to filter.

`` `t3_${string}` `` | `` `t1_${string}` ``

##### options?

[`FilterOptions`](../type-aliases/FilterOptions.md)

The options for this filter action.

#### Returns

`Promise`\<`void`\>

A Promise that resolves if the post or comment was filtered successfully.

***

<a id="getapprovedusers"></a>

### getApprovedUsers()

> **getApprovedUsers**(`options`): [`Listing`](Listing.md)\<[`SubredditContributorUser`](SubredditContributorUser.md)\>

Get a list of users who have been approved to post in a subreddit.

#### Parameters

##### options

`GetSubredditUsersOptions`

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`SubredditContributorUser`](SubredditContributorUser.md)\>

A Listing of SubredditContributorUser objects.

***

<a id="getappuser"></a>

### getAppUser()

> **getAppUser**(): `Promise`\<`undefined` \| [`User`](User.md)\>

Get the user that the app runs as on the provided metadata.

#### Returns

`Promise`\<`undefined` \| [`User`](User.md)\>

A Promise that resolves to a User object.

#### Example

```ts
const user = await reddit.getAppUser(metadata);
```

***

<a id="getbannedusers"></a>

### getBannedUsers()

> **getBannedUsers**(`options`): [`Listing`](Listing.md)\<[`SubredditBannedUser`](SubredditBannedUser.md)\>

Get a list of users who are banned from a subreddit.

#### Parameters

##### options

`GetSubredditUsersOptions`

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`SubredditBannedUser`](SubredditBannedUser.md)\>

A Listing of SubredditBannedUser objects.

***

<a id="getbannedwikicontributors"></a>

### getBannedWikiContributors()

> **getBannedWikiContributors**(`options`): [`Listing`](Listing.md)\<[`SubredditWikiBannedUser`](SubredditWikiBannedUser.md)\>

Get a list of users who are banned from contributing to the wiki on a subreddit.

#### Parameters

##### options

`GetSubredditUsersOptions`

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`SubredditWikiBannedUser`](SubredditWikiBannedUser.md)\>

A Listing of SubredditWikiBannedUser objects.

***

<a id="getbestposts"></a>

### getBestPosts()

> **getBestPosts**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Get a list of best posts from the front page.
This method will get the front page for the app account by default.
To get the front page for a user, please contact Reddit.

#### Parameters

##### options

[`ListingFetchOptions`](../type-aliases/ListingFetchOptions.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

A Listing of Post objects.

#### Example

```ts
const posts = await reddit.getBestPosts({
  limit: 1000,
  pageSize: 100
}).all();
```

***

<a id="getcommentbyid"></a>

### getCommentById()

> **getCommentById**(`id`): `Promise`\<[`Comment`](Comment.md)\>

Get a [Comment](Comment.md) object by ID

#### Parameters

##### id

`` `t1_${string}` ``

The ID (starting with t1_) of the comment to retrieve. e.g. t1_1qjpg

#### Returns

`Promise`\<[`Comment`](Comment.md)\>

A Promise that resolves to a Comment object.

#### Example

```ts
const comment = await reddit.getCommentById('t1_1qjpg');
```

***

<a id="getcomments"></a>

### getComments()

> **getComments**(`options`): [`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

Get a list of comments from a specific post or comment.

#### Parameters

##### options

[`GetCommentsOptions`](../type-aliases/GetCommentsOptions.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

A Listing of Comment objects.

#### Example

```ts
const comments = await reddit.getComments({
  postId: 't3_1qjpg',
  limit: 1000,
  pageSize: 100
}).all();
```

***

<a id="getcommentsandpostsbyuser"></a>

### getCommentsAndPostsByUser()

> **getCommentsAndPostsByUser**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

Get a list of posts and comments from a specific user.

#### Parameters

##### options

[`GetUserOverviewOptions`](../type-aliases/GetUserOverviewOptions.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

A Listing of `Post` and `Comment` objects.

***

<a id="getcommentsbyuser"></a>

### getCommentsByUser()

> **getCommentsByUser**(`options`): [`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

Get a list of comments by a specific user.

#### Parameters

##### options

[`GetCommentsByUserOptions`](../type-aliases/GetCommentsByUserOptions.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

A Listing of Comment objects.

***

<a id="getcontroversialposts"></a>

### getControversialPosts()

> **getControversialPosts**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Get a list of controversial posts from a specific subreddit.

#### Parameters

##### options

[`GetPostsOptionsWithTimeframe`](../type-aliases/GetPostsOptionsWithTimeframe.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

A Listing of Post objects.

#### Example

```ts
const posts = await reddit.getControversialPosts({
  subredditName: 'memes',
  timeframe: 'day',
  limit: 1000,
  pageSize: 100
}).all();
```

***

<a id="getcurrentsubreddit"></a>

### getCurrentSubreddit()

> **getCurrentSubreddit**(): `Promise`\<[`Subreddit`](Subreddit.md)\>

Retrieves the current subreddit.

#### Returns

`Promise`\<[`Subreddit`](Subreddit.md)\>

A Promise that resolves a Subreddit object.

#### Example

```ts
const currentSubreddit = await reddit.getCurrentSubreddit();
```

***

<a id="getcurrentuser"></a>

### getCurrentUser()

> **getCurrentUser**(): `Promise`\<`undefined` \| [`User`](User.md)\>

Get the current calling user.
Resolves to undefined for logged-out custom post renders.

#### Returns

`Promise`\<`undefined` \| [`User`](User.md)\>

A Promise that resolves to a User object or undefined

#### Example

```ts
const user = await reddit.getCurrentUser();
```

***

<a id="getcurrentusername"></a>

### getCurrentUsername()

> **getCurrentUsername**(): `Promise`\<`undefined` \| `string`\>

Get the current calling user's username.
Resolves to undefined for logged-out custom post renders.

#### Returns

`Promise`\<`undefined` \| `string`\>

A Promise that resolves to a string representing the username or undefined

#### Example

```ts
const username = await reddit.getCurrentUsername();
```

***

<a id="getduplicatesforpost"></a>

### getDuplicatesForPost()

> **getDuplicatesForPost**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Get posts that shared the same link as the given post.

#### Parameters

##### options

[`GetDuplicatesOptions`](../type-aliases/GetDuplicatesOptions.md)

Options for the request. Post ID is required, eveything else is optional.

#### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

A Listing of Post objects.

#### Example

```ts
const duplicates = await reddit.getDuplicatesForPost({
  postId: 't3_abc123',
  sort: 'num_comments',
  limit: 100
}).all();
```

***

<a id="getedited"></a>

### getEdited()

#### Call Signature

> **getEdited**(`options`): [`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

Return a listing of things that have been edited recently.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"comment"`\>

##### Returns

[`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getEdited();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getEdited({ type: "post"});
console.log("Posts: ", await listing.all())
```

#### Call Signature

> **getEdited**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Return a listing of things that have been edited recently.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"post"`\>

##### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getEdited();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getEdited({ type: "post"});
console.log("Posts: ", await listing.all())
```

#### Call Signature

> **getEdited**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

Return a listing of things that have been edited recently.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"all"`\>

##### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getEdited();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getEdited({ type: "post"});
console.log("Posts: ", await listing.all())
```

***

<a id="gethotposts"></a>

### getHotPosts()

> **getHotPosts**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Get a list of hot posts from a specific subreddit.

#### Parameters

##### options

[`GetHotPostsOptions`](../type-aliases/GetHotPostsOptions.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

A Listing of Post objects.

#### Example

```ts
const posts = await reddit.getHotPosts({
  subredditName: 'memes',
  timeframe: 'day',
  limit: 1000,
  pageSize: 100
}).all();
```

***

<a id="getmessages"></a>

### getMessages()

> **getMessages**(`options`): `Promise`\<[`Listing`](Listing.md)\<[`PrivateMessage`](PrivateMessage.md)\>\>

Get private messages sent to the currently authenticated user.

#### Parameters

##### options

`Prettify`

Options for the request

#### Returns

`Promise`\<[`Listing`](Listing.md)\<[`PrivateMessage`](PrivateMessage.md)\>\>

***

<a id="getmoderationlog"></a>

### getModerationLog()

> **getModerationLog**(`options`): [`Listing`](Listing.md)\<[`ModAction`](../interfaces/ModAction.md)\>

Get the moderation log for a subreddit.

#### Parameters

##### options

[`GetModerationLogOptions`](../type-aliases/GetModerationLogOptions.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`ModAction`](../interfaces/ModAction.md)\>

A Listing of ModAction objects.

#### Example

```ts
const modActions = await reddit.getModerationLog({
  subredditName: 'memes',
  moderatorUsernames: ['spez'],
  type: 'banuser',
  limit: 1000,
  pageSize: 100
}).all();
```

***

<a id="getmoderators"></a>

### getModerators()

> **getModerators**(`options`): [`Listing`](Listing.md)\<[`SubredditModeratorUser`](SubredditModeratorUser.md)\>

Get a list of users who are moderators for a subreddit.

#### Parameters

##### options

`GetSubredditUsersOptions`

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`SubredditModeratorUser`](SubredditModeratorUser.md)\>

A Listing of SubredditModeratorUser objects.

***

<a id="getmodnotes"></a>

### getModNotes()

> **getModNotes**(`options`): [`Listing`](Listing.md)\<[`ModNote`](ModNote.md)\>

Get a user's moderation notes within a subreddit.

#### Parameters

##### options

[`GetModNotesOptions`](../type-aliases/GetModNotesOptions.md)

#### Returns

[`Listing`](Listing.md)\<[`ModNote`](ModNote.md)\>

#### Example

```ts
const notes = await reddit
  .getModNotes({
    subreddit: 'wallstreetbets',
    user: 'spez',
    filter: 'NOTE',
  })
  .get(25);
```

***

<a id="getmodqueue"></a>

### getModQueue()

#### Call Signature

> **getModQueue**(`options`): [`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

Return a listing of things requiring moderator review, such as reported things and items.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"comment"`\>

##### Returns

[`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getModQueue();
console.log("Posts and Comments: ",  await listing.all())
listing = await subreddit.getModQueue({ type: "post"});
console.log("Posts: ", await listing.all())
```

#### Call Signature

> **getModQueue**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Return a listing of things requiring moderator review, such as reported things and items.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"post"`\>

##### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getModQueue();
console.log("Posts and Comments: ",  await listing.all())
listing = await subreddit.getModQueue({ type: "post"});
console.log("Posts: ", await listing.all())
```

#### Call Signature

> **getModQueue**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

Return a listing of things requiring moderator review, such as reported things and items.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"all"`\>

##### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getModQueue();
console.log("Posts and Comments: ",  await listing.all())
listing = await subreddit.getModQueue({ type: "post"});
console.log("Posts: ", await listing.all())
```

***

<a id="getmutedusers"></a>

### getMutedUsers()

> **getMutedUsers**(`options`): [`Listing`](Listing.md)\<[`SubredditMutedUser`](SubredditMutedUser.md)\>

Get a list of users who are muted in a subreddit.

#### Parameters

##### options

`GetSubredditUsersOptions`

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`SubredditMutedUser`](SubredditMutedUser.md)\>

A listing of SubredditMutedUser objects.

***

<a id="getnewposts"></a>

### getNewPosts()

> **getNewPosts**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Get a list of new posts from a specific subreddit.

#### Parameters

##### options

[`GetPostsOptions`](../type-aliases/GetPostsOptions.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

A Listing of Post objects.

#### Example

```ts
const posts = await reddit.getNewPosts({
  subredditName: 'memes',
  limit: 1000,
  pageSize: 100
}).all();
```

***

<a id="getpostbyid"></a>

### getPostById()

> **getPostById**(`id`): `Promise`\<[`Post`](Post.md)\>

Gets a [Post](Post.md) object by ID

#### Parameters

##### id

`` `t3_${string}` ``

#### Returns

`Promise`\<[`Post`](Post.md)\>

A Promise that resolves to a Post object.

***

<a id="getpostdata"></a>

### getPostData()

> **getPostData**(`id`): `Promise`\<`undefined` \| [`JSONObject`](../type-aliases/JSONObject.md)\>

Returns PostData, if any, for the post specified by ID.

#### Parameters

##### id

`` `t3_${string}` ``

#### Returns

`Promise`\<`undefined` \| [`JSONObject`](../type-aliases/JSONObject.md)\>

***

<a id="getpostflairtemplates"></a>

### getPostFlairTemplates()

> **getPostFlairTemplates**(`subredditName`): `Promise`\<[`FlairTemplate`](FlairTemplate.md)[]\>

Get the list of post flair templates for a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to get the post flair templates for.

#### Returns

`Promise`\<[`FlairTemplate`](FlairTemplate.md)[]\>

A Promise that resolves with an array of FlairTemplate objects.

***

<a id="getpostsbyuser"></a>

### getPostsByUser()

> **getPostsByUser**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Get a list of posts from a specific user.

#### Parameters

##### options

[`GetPostsByUserOptions`](../type-aliases/GetPostsByUserOptions.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

A Listing of Post objects.

***

<a id="getpoststyles"></a>

### getPostStyles()

> **getPostStyles**(`id`): `Promise`\<`StrictRequired`\<`CustomPostStylesInput`\>\>

**`Experimental`**

Get the custom styles for a custom post.

#### Parameters

##### id

`` `t3_${string}` ``

The ID of the post to get styles for.

#### Returns

`Promise`\<`StrictRequired`\<`CustomPostStylesInput`\>\>

***

<a id="getreports"></a>

### getReports()

#### Call Signature

> **getReports**(`options`): [`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

Return a listing of things that have been reported.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"comment"`\>

##### Returns

[`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getReports();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getReports({ type: "post"});
console.log("Posts: ", await listing.all())
```

#### Call Signature

> **getReports**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Return a listing of things that have been reported.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"post"`\>

##### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getReports();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getReports({ type: "post"});
console.log("Posts: ", await listing.all())
```

#### Call Signature

> **getReports**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

Return a listing of things that have been reported.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"all"`\>

##### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getReports();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getReports({ type: "post"});
console.log("Posts: ", await listing.all())
```

***

<a id="getrisingposts"></a>

### getRisingPosts()

> **getRisingPosts**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Get a list of hot posts from a specific subreddit.

#### Parameters

##### options

[`GetPostsOptions`](../type-aliases/GetPostsOptions.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

A Listing of Post objects.

#### Example

```ts
const posts = await reddit.getRisingPosts({
  subredditName: 'memes',
  timeframe: 'day',
  limit: 1000,
  pageSize: 100
}).all();
```

***

<a id="getrules"></a>

### getRules()

> **getRules**(`subredditName`): `Promise`\<[`Rule`](Rule.md)[]\>

Get the rules for a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to get the rules for.

#### Returns

`Promise`\<[`Rule`](Rule.md)[]\>

An array of Rule objects.

***

<a id="getsnoovatarurl"></a>

### getSnoovatarUrl()

> **getSnoovatarUrl**(`username`): `Promise`\<`undefined` \| `string`\>

Get the snoovatar URL for a given username.

#### Parameters

##### username

`string`

The username of the snoovatar to retrieve

#### Returns

`Promise`\<`undefined` \| `string`\>

A Promise that resolves to a URL of the snoovatar image if it exists.

***

<a id="getspam"></a>

### getSpam()

#### Call Signature

> **getSpam**(`options`): [`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

Return a listing of things that have been marked as spam or otherwise removed.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"comment"`\>

##### Returns

[`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getSpam();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getSpam({ type: "post"});
console.log("Posts: ", await listing.all())
```

#### Call Signature

> **getSpam**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Return a listing of things that have been marked as spam or otherwise removed.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"post"`\>

##### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getSpam();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getSpam({ type: "post"});
console.log("Posts: ", await listing.all())
```

#### Call Signature

> **getSpam**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

Return a listing of things that have been marked as spam or otherwise removed.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"all"`\>

##### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getSpam();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getSpam({ type: "post"});
console.log("Posts: ", await listing.all())
```

***

<a id="getsubredditbyid"></a>

### ~~getSubredditById()~~

> **getSubredditById**(`id`): `Promise`\<`undefined` \| [`Subreddit`](Subreddit.md)\>

Gets a [Subreddit](Subreddit.md) object by ID

#### Parameters

##### id

`` `t5_${string}` ``

The ID (starting with t5_) of the subreddit to retrieve. e.g. t5_2qjpg

#### Returns

`Promise`\<`undefined` \| [`Subreddit`](Subreddit.md)\>

A Promise that resolves a Subreddit object.

#### Deprecated

Use [getSubredditInfoById](#getsubredditinfobyid) instead.

#### Example

```ts
const memes = await reddit.getSubredditById('t5_2qjpg');
```

***

<a id="getsubredditbyname"></a>

### ~~getSubredditByName()~~

> **getSubredditByName**(`name`): `Promise`\<[`Subreddit`](Subreddit.md)\>

Gets a [Subreddit](Subreddit.md) object by name

#### Parameters

##### name

`string`

The name of a subreddit omitting the r/. This is case insensitive.

#### Returns

`Promise`\<[`Subreddit`](Subreddit.md)\>

A Promise that resolves a Subreddit object.

#### Deprecated

Use [getSubredditInfoByName](#getsubredditinfobyname) instead.

#### Example

```ts
const askReddit = await reddit.getSubredditByName('askReddit');
```

***

<a id="getsubredditinfobyid"></a>

### getSubredditInfoById()

> **getSubredditInfoById**(`id`): `Promise`\<[`SubredditInfo`](../type-aliases/SubredditInfo.md)\>

Gets a [SubredditInfo](../type-aliases/SubredditInfo.md) object by ID

#### Parameters

##### id

`` `t5_${string}` ``

The ID (starting with t5_) of the subreddit to retrieve. e.g. t5_2qjpg

#### Returns

`Promise`\<[`SubredditInfo`](../type-aliases/SubredditInfo.md)\>

A Promise that resolves a SubredditInfo object.

#### Example

```ts
const memes = await reddit.getSubredditInfoById('t5_2qjpg');
```

***

<a id="getsubredditinfobyname"></a>

### getSubredditInfoByName()

> **getSubredditInfoByName**(`name`): `Promise`\<[`SubredditInfo`](../type-aliases/SubredditInfo.md)\>

Gets a [SubredditInfo](../type-aliases/SubredditInfo.md) object by name

#### Parameters

##### name

`string`

The name of a subreddit omitting the r/. This is case insensitive.

#### Returns

`Promise`\<[`SubredditInfo`](../type-aliases/SubredditInfo.md)\>

A Promise that resolves a SubredditInfo object.

#### Example

```ts
const askReddit = await reddit.getSubredditInfoByName('askReddit');
```

***

<a id="getsubredditleaderboard"></a>

### getSubredditLeaderboard()

> **getSubredditLeaderboard**(`subredditId`): `Promise`\<[`SubredditLeaderboard`](../type-aliases/SubredditLeaderboard.md)\>

Returns a leaderboard for a given subreddit ID.

#### Parameters

##### subredditId

`` `t5_${string}` ``

ID of the subreddit for which the leaderboard is being queried.

#### Returns

`Promise`\<[`SubredditLeaderboard`](../type-aliases/SubredditLeaderboard.md)\>

Leaderboard for the given subreddit.

***

<a id="getsubredditremovalreasons"></a>

### getSubredditRemovalReasons()

> **getSubredditRemovalReasons**(`subredditName`): `Promise`\<[`RemovalReason`](../type-aliases/RemovalReason.md)[]\>

Get the list of subreddit's removal reasons (ordered).

#### Parameters

##### subredditName

`string`

Name of the subreddit (the 'r/' prefix is optional).

#### Returns

`Promise`\<[`RemovalReason`](../type-aliases/RemovalReason.md)[]\>

Ordered array of Removal Reasons

#### Example

```ts
const reasons = await reddit.getSubredditRemovalReasons('askReddit');

for (let reason of reasons) {
  console.log(reason.id, reason.message, reason.title)
}
```

***

<a id="getsubredditstyles"></a>

### getSubredditStyles()

> **getSubredditStyles**(`subredditId`): `Promise`\<[`SubredditStyles`](../type-aliases/SubredditStyles.md)\>

Returns the styles for a given subreddit ID.

#### Parameters

##### subredditId

`` `t5_${string}` ``

ID of the subreddit from which to retrieve the styles.

#### Returns

`Promise`\<[`SubredditStyles`](../type-aliases/SubredditStyles.md)\>

Styles for the given subreddit.

***

<a id="getsubscribedsubredditsforcurrentuser"></a>

### getSubscribedSubredditsForCurrentUser()

> **getSubscribedSubredditsForCurrentUser**(`options`): [`Listing`](Listing.md)\<[`Subreddit`](Subreddit.md)\>

Returns a listing of subreddits that the current user is subscribed to.
This method will execute as the app account by default.
To execute this on behalf of a user, please contact Reddit.

#### Parameters

##### options

[`GetSubscribedSubredditsForCurrentUserOptions`](../type-aliases/GetSubscribedSubredditsForCurrentUserOptions.md)

#### Returns

[`Listing`](Listing.md)\<[`Subreddit`](Subreddit.md)\>

***

<a id="gettopposts"></a>

### getTopPosts()

> **getTopPosts**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Get a list of controversial posts from a specific subreddit.

#### Parameters

##### options

[`GetPostsOptionsWithTimeframe`](../type-aliases/GetPostsOptionsWithTimeframe.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

A Listing of Post objects.

#### Example

```ts
const posts = await reddit.getControversialPosts({
  subredditName: 'memes',
  timeframe: 'day',
  limit: 1000,
  pageSize: 100
}).all();
```

***

<a id="getunmoderated"></a>

### getUnmoderated()

#### Call Signature

> **getUnmoderated**(`options`): [`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

Return a listing of things that have yet to be approved/removed by a mod.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"comment"`\>

##### Returns

[`Listing`](Listing.md)\<[`Comment`](Comment.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getUnmoderated();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getUnmoderated({ type: "post"});
console.log("Posts: ", await listing.all())
```

#### Call Signature

> **getUnmoderated**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Return a listing of things that have yet to be approved/removed by a mod.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"post"`\>

##### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getUnmoderated();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getUnmoderated({ type: "post"});
console.log("Posts: ", await listing.all())
```

#### Call Signature

> **getUnmoderated**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

Return a listing of things that have yet to be approved/removed by a mod.

##### Parameters

###### options

[`ModLogOptions`](../type-aliases/ModLogOptions.md)\<`"all"`\>

##### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md) \| [`Comment`](Comment.md)\>

##### Example

```ts
const subreddit = await reddit.getSubredditByName("mysubreddit")
let listing = await subreddit.getUnmoderated();
console.log("Posts and Comments: ", await listing.all())
listing = await subreddit.getUnmoderated({ type: "post"});
console.log("Posts: ", await listing.all())
```

***

<a id="getuserbyid"></a>

### getUserById()

> **getUserById**(`id`): `Promise`\<`undefined` \| [`User`](User.md)\>

Gets a [User](User.md) object by ID

#### Parameters

##### id

`` `t2_${string}` ``

The ID (starting with t2_) of the user to retrieve. e.g. t2_1qjpg

#### Returns

`Promise`\<`undefined` \| [`User`](User.md)\>

A Promise that resolves to a User object.

#### Example

```ts
const user = await reddit.getUserById('t2_1qjpg');
```

***

<a id="getuserbyusername"></a>

### getUserByUsername()

> **getUserByUsername**(`username`): `Promise`\<`undefined` \| [`User`](User.md)\>

Gets a [User](User.md) object by username

#### Parameters

##### username

`string`

The username of the user omitting the u/. e.g. 'devvit'

#### Returns

`Promise`\<`undefined` \| [`User`](User.md)\>

A Promise that resolves to a User object or undefined if user is
         not found (user doesn't exist, account suspended, etc).

#### Example

```ts
const user = await reddit.getUserByUsername('devvit');
if (user) {
  console.log(user)
}
```

***

<a id="getuserflairtemplates"></a>

### getUserFlairTemplates()

> **getUserFlairTemplates**(`subredditName`): `Promise`\<[`FlairTemplate`](FlairTemplate.md)[]\>

Get the list of user flair templates for a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to get the user flair templates for.

#### Returns

`Promise`\<[`FlairTemplate`](FlairTemplate.md)[]\>

A Promise that resolves with an array of FlairTemplate objects.

***

<a id="getuserkarmafromcurrentsubreddit"></a>

### getUserKarmaFromCurrentSubreddit()

> **getUserKarmaFromCurrentSubreddit**(`username`): `Promise`\<`GetUserKarmaForSubredditResponse`\>

Returns the karma for a given user in the current subreddit.
The user making the request must be a moderator of the subreddit to read another user's karma in the subreddit.
An exception is if the specified user is the same as the user making the request.

#### Parameters

##### username

`string`

The username of the user to get the karma for. e.g. 'spez'

#### Returns

`Promise`\<`GetUserKarmaForSubredditResponse`\>

The GetUserKarmaForSubredditResponse, containing the user's karma for posts and comments in the subreddit.

***

<a id="getvaultbyaddress"></a>

### getVaultByAddress()

> **getVaultByAddress**(`address`): `Promise`\<[`Vault`](../type-aliases/Vault.md)\>

Gets a [Vault](../type-aliases/Vault.md) for the specified address.

#### Parameters

##### address

`string`

The address (starting with 0x) of the Vault.

#### Returns

`Promise`\<[`Vault`](../type-aliases/Vault.md)\>

#### Example

```ts
const vault = await reddit.getVaultByAddress('0x205ee28744456bDBf180A0Fa7De51e0F116d54Ed');
```

***

<a id="getvaultbyuserid"></a>

### getVaultByUserId()

> **getVaultByUserId**(`userId`): `Promise`\<[`Vault`](../type-aliases/Vault.md)\>

Gets a [Vault](../type-aliases/Vault.md) for the specified user.

#### Parameters

##### userId

`` `t2_${string}` ``

The ID (starting with t2_) of the Vault owner.

#### Returns

`Promise`\<[`Vault`](../type-aliases/Vault.md)\>

#### Example

```ts
const vault = await reddit.getVaultByUserId('t2_1w72');
```

***

<a id="getwidgets"></a>

### getWidgets()

> **getWidgets**(`subredditName`): `Promise`\<[`Widget`](Widget.md)[]\>

Get the widgets for a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to get the widgets for.

#### Returns

`Promise`\<[`Widget`](Widget.md)[]\>

- An array of Widget objects.

***

<a id="getwikicontributors"></a>

### getWikiContributors()

> **getWikiContributors**(`options`): [`Listing`](Listing.md)\<[`SubredditWikiContributorUser`](SubredditWikiContributorUser.md)\>

Get a list of users who are wiki contributors of a subreddit.

#### Parameters

##### options

`GetSubredditUsersOptions`

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`SubredditWikiContributorUser`](SubredditWikiContributorUser.md)\>

A Listing of SubredditWikiContributorUser objects.

***

<a id="getwikipage"></a>

### getWikiPage()

#### Call Signature

> **getWikiPage**(`subredditName`, `page`, `revisionId`): `Promise`\<[`WikiPage`](WikiPage.md)\>

Get a specific revision of a wiki page from a subreddit.

##### Parameters

###### subredditName

`string`

The name of the subreddit to get the wiki page from.

###### page

`string`

The name of the wiki page to get.

###### revisionId

The revision ID of the wiki page version to get. Leaving it empty returns the latest version.

`undefined` | `` `${string}-${string}-${string}-${string}-${string}` ``

##### Returns

`Promise`\<[`WikiPage`](WikiPage.md)\>

The requested WikiPage object.

##### Deprecated

Pass a [GetWikiPageOptions](../type-aliases/GetWikiPageOptions.md) object as the third argument instead.

#### Call Signature

> **getWikiPage**(`subredditName`, `page`, `options`?): `Promise`\<[`WikiPage`](WikiPage.md)\>

Get a wiki page from a subreddit.

##### Parameters

###### subredditName

`string`

The name of the subreddit to get the wiki page from.

###### page

`string`

The name of the wiki page to get.

###### options?

[`GetWikiPageOptions`](../type-aliases/GetWikiPageOptions.md)

Options for the request.

##### Returns

`Promise`\<[`WikiPage`](WikiPage.md)\>

The requested WikiPage object.

***

<a id="getwikipagerevisions"></a>

### getWikiPageRevisions()

> **getWikiPageRevisions**(`options`): [`Listing`](Listing.md)\<[`WikiPageRevision`](WikiPageRevision.md)\>

Get the revisions for a wiki page.

#### Parameters

##### options

[`GetPageRevisionsOptions`](../type-aliases/GetPageRevisionsOptions.md)

Options for the request

#### Returns

[`Listing`](Listing.md)\<[`WikiPageRevision`](WikiPageRevision.md)\>

A Listing of WikiPageRevision objects.

***

<a id="getwikipages"></a>

### getWikiPages()

> **getWikiPages**(`subredditName`, `options`?): `Promise`\<`string`[]\>

Get the wiki pages for a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to get the wiki pages from.

##### options?

[`WikiVersionOptions`](../type-aliases/WikiVersionOptions.md)

Options for the request.

#### Returns

`Promise`\<`string`[]\>

A list of the wiki page names for the subreddit.

***

<a id="getwikipagesettings"></a>

### getWikiPageSettings()

> **getWikiPageSettings**(`subredditName`, `page`, `options`?): `Promise`\<[`WikiPageSettings`](WikiPageSettings.md)\>

Get the settings for a wiki page.

#### Parameters

##### subredditName

`string`

The name of the subreddit the wiki is in.

##### page

`string`

The name of the wiki page to get the settings for.

##### options?

[`WikiVersionOptions`](../type-aliases/WikiVersionOptions.md)

Options for the request.

#### Returns

`Promise`\<[`WikiPageSettings`](WikiPageSettings.md)\>

A WikiPageSettings object.

***

<a id="invitemoderator"></a>

### inviteModerator()

> **inviteModerator**(`options`): `Promise`\<`void`\>

Invite a user to become a moderator of a subreddit.

#### Parameters

##### options

`InviteModeratorOptions`

Options for the request

#### Returns

`Promise`\<`void`\>

***

<a id="iswikiv2enabled"></a>

### isWikiV2Enabled()

> **isWikiV2Enabled**(`subredditName`): `Promise`\<`boolean`\>

Check whether Wiki V2 is enabled for a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to check.

#### Returns

`Promise`\<`boolean`\>

Whether Wiki V2 is enabled for the subreddit.

***

<a id="markallmessagesasread"></a>

### markAllMessagesAsRead()

> **markAllMessagesAsRead**(): `Promise`\<`void`\>

Mark all private messages as read.

#### Returns

`Promise`\<`void`\>

***

<a id="mergepostdata"></a>

### mergePostData()

> **mergePostData**(`postId`, `postData`): `Promise`\<`void`\>

Merge the postData on a custom post with the postData specified in the input. This performs a shallow merge.

#### Parameters

##### postId

`` `t3_${string}` ``

##### postData

[`JSONObject`](../type-aliases/JSONObject.md)

Represents the postData to be merged with the existing postData.

#### Returns

`Promise`\<`void`\>

#### Throws

Throws an error if the postData could not be merged.

#### Example

```ts
const post = await reddit.getPostById(context.postId);

// Existing postData: { currentScore: 55, settings: { theme: 'dark', fontSize: 12 } }

await post.mergePostData({ settings: { fontSize: 14 } });
// Result: { currentScore: 55, settings: { fontSize: 14 } }
```

***

<a id="muteuser"></a>

### muteUser()

> **muteUser**(`options`): `Promise`\<`void`\>

Mute a user in a subreddit. Muting a user prevents them from sending modmail.

#### Parameters

##### options

`MuteUserOptions`

Options for the request

#### Returns

`Promise`\<`void`\>

***

<a id="remove"></a>

### remove()

> **remove**(`id`, `isSpam`): `Promise`\<`void`\>

Remove a post or comment.

#### Parameters

##### id

The id of the post (t3_) or comment (t1_) to remove.

`` `t3_${string}` `` | `` `t1_${string}` ``

##### isSpam

`boolean`

Is the post or comment being removed because it's spam?

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await reddit.remove('t3_123456', false);
await reddit.remove('t1_123456', true);
```

***

<a id="removeeditorfromwikipage"></a>

### removeEditorFromWikiPage()

> **removeEditorFromWikiPage**(`subredditName`, `page`, `username`, `options`?): `Promise`\<`void`\>

Remove an editor from a wiki page.

#### Parameters

##### subredditName

`string`

The name of the subreddit the wiki is in.

##### page

`string`

The name of the wiki page to remove the editor from.

##### username

`string`

The username of the user to remove as an editor.

##### options?

[`WikiVersionOptions`](../type-aliases/WikiVersionOptions.md)

Options for the request.

#### Returns

`Promise`\<`void`\>

***

<a id="removemoderator"></a>

### removeModerator()

> **removeModerator**(`username`, `subredditName`): `Promise`\<`void`\>

Remove a user as a moderator of a subreddit.

#### Parameters

##### username

`string`

The username of the user to remove as a moderator. e.g. 'spez'

##### subredditName

`string`

The name of the subreddit to remove the user as a moderator from. e.g. 'memes'

#### Returns

`Promise`\<`void`\>

***

<a id="removepostflair"></a>

### removePostFlair()

> **removePostFlair**(`subredditName`, `postId`): `Promise`\<`void`\>

Remove the flair for a post in a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to remove the flair from.

##### postId

`` `t3_${string}` ``

The ID of the post to remove the flair from.

#### Returns

`Promise`\<`void`\>

***

<a id="removeuser"></a>

### removeUser()

> **removeUser**(`username`, `subredditName`): `Promise`\<`void`\>

Remove a user's approval to post in a subreddit.

#### Parameters

##### username

`string`

The username of the user to remove approval from. e.g. 'spez'

##### subredditName

`string`

The name of the subreddit to remove the user's approval from. e.g. 'memes'

#### Returns

`Promise`\<`void`\>

***

<a id="removeuserflair"></a>

### removeUserFlair()

> **removeUserFlair**(`subredditName`, `username`): `Promise`\<`void`\>

Remove the flair for a user in a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to remove the flair from.

##### username

`string`

The username of the user to remove the flair from.

#### Returns

`Promise`\<`void`\>

***

<a id="removewikicontributor"></a>

### removeWikiContributor()

> **removeWikiContributor**(`username`, `subredditName`): `Promise`\<`void`\>

Remove a user's wiki contributor status for a subreddit.

#### Parameters

##### username

`string`

The username of the user to remove wiki contributor status from. e.g. 'spez'

##### subredditName

`string`

The name of the subreddit to remove the user's wiki contributor status from. e.g. 'memes'

#### Returns

`Promise`\<`void`\>

***

<a id="reorderrules"></a>

### reorderRules()

> **reorderRules**(`subredditName`, `rules`): `Promise`\<`void`\>

Reorder the rules in a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to reorder the rules for.

##### rules

[`Rule`](Rule.md)[]

Array of Rule objects in the desired order (order is determined by array position).

#### Returns

`Promise`\<`void`\>

***

<a id="reorderwidgets"></a>

### reorderWidgets()

> **reorderWidgets**(`subredditName`, `orderByIds`): `Promise`\<`void`\>

Reorder the widgets for a subreddit.

#### Parameters

##### subredditName

`string`

The name of the subreddit to reorder the widgets for.

##### orderByIds

`string`[]

An array of widget IDs in the order that they should be displayed.

#### Returns

`Promise`\<`void`\>

***

<a id="report"></a>

### report()

> **report**(`thing`, `options`): `Promise`\<`JsonStatus`\>

Report a Post or Comment

The report is sent to the moderators of the subreddit for review.

#### Parameters

##### thing

Post or Comment

[`Post`](Post.md) | [`Comment`](Comment.md)

##### options

Options

###### reason

`string`

Why the thing is reported

#### Returns

`Promise`\<`JsonStatus`\>

#### Example

```ts
await reddit.report(post, {
 reason: 'This is spam!',
})
```

***

<a id="revertwikipage"></a>

### revertWikiPage()

> **revertWikiPage**(`subredditName`, `page`, `revisionId`, `options`?): `Promise`\<`void`\>

Revert a wiki page to a previous revision.

#### Parameters

##### subredditName

`string`

The name of the subreddit the wiki is in.

##### page

`string`

The name of the wiki page to revert.

##### revisionId

`string`

The ID of the revision to revert to.

##### options?

[`WikiVersionOptions`](../type-aliases/WikiVersionOptions.md)

Options for the request.

#### Returns

`Promise`\<`void`\>

***

<a id="revokemoderatorinvite"></a>

### revokeModeratorInvite()

> **revokeModeratorInvite**(`username`, `subredditName`): `Promise`\<`void`\>

Revoke a moderator invite for a user to a subreddit.

#### Parameters

##### username

`string`

The username of the user to revoke the invite for. e.g. 'spez'

##### subredditName

`string`

The name of the subreddit to revoke the invite for. e.g. 'memes'

#### Returns

`Promise`\<`void`\>

***

<a id="searchposts"></a>

### searchPosts()

> **searchPosts**(`options`): [`Listing`](Listing.md)\<[`Post`](Post.md)\>

Search for posts in a subreddit.

#### Parameters

##### options

[`SearchPostsOptions`](../type-aliases/SearchPostsOptions.md)

Options for the search

#### Returns

[`Listing`](Listing.md)\<[`Post`](Post.md)\>

A Listing of Post objects.

#### Example

```ts
const posts = await reddit.searchPosts({
  query: 'developer platform',
  subredditName: 'devvit',
  sort: 'new',
  timeframe: 'month',
  limit: 100,
}).all();
```

***

<a id="sendprivatemessage"></a>

### sendPrivateMessage()

> **sendPrivateMessage**(`options`): `Promise`\<`void`\>

Sends a private message to a user.

#### Parameters

##### options

[`SendPrivateMessageOptions`](../type-aliases/SendPrivateMessageOptions.md)

The options for sending the message.

#### Returns

`Promise`\<`void`\>

A Promise that resolves if the private message was successfully sent.

***

<a id="sendprivatemessageassubreddit"></a>

### ~~sendPrivateMessageAsSubreddit()~~

> **sendPrivateMessageAsSubreddit**(`options`): `Promise`\<`void`\>

Sends a private message to a user on behalf of a subreddit.

#### Parameters

##### options

[`SendPrivateMessageAsSubredditOptions`](../type-aliases/SendPrivateMessageAsSubredditOptions.md)

The options for sending the message as a subreddit.

#### Returns

`Promise`\<`void`\>

A Promise that resolves if the private message was successfully sent.

#### Deprecated

No longer working as expected. Use modMail.createConversation with `isAuthorHidden: true` instead

***

<a id="setmoderatorpermissions"></a>

### setModeratorPermissions()

> **setModeratorPermissions**(`username`, `subredditName`, `permissions`): `Promise`\<`void`\>

Update the permissions of a moderator of a subreddit.

#### Parameters

##### username

`string`

The username of the user to update the permissions for. e.g. 'spez'

##### subredditName

`string`

The name of the subreddit. e.g. 'memes'

##### permissions

[`ModeratorPermission`](../type-aliases/ModeratorPermission.md)[]

The permissions to give the user. e.g ['posts', 'wiki']

#### Returns

`Promise`\<`void`\>

***

<a id="setpostdata"></a>

### setPostData()

> **setPostData**(`postId`, `postData`): `Promise`\<`void`\>

Set the postData for a custom post. This will replace the existing postData with the postData specified in the input.

#### Parameters

##### postId

`` `t3_${string}` ``

The ID of the post to set the postData for.

##### postData

[`JSONObject`](../type-aliases/JSONObject.md)

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

<a id="setpostflair"></a>

### setPostFlair()

> **setPostFlair**(`options`): `Promise`\<`void`\>

Set the flair for a post in a subreddit.

#### Parameters

##### options

[`SetPostFlairOptions`](../type-aliases/SetPostFlairOptions.md)

Options for the request

#### Returns

`Promise`\<`void`\>

***

<a id="setpoststyles"></a>

### setPostStyles()

> **setPostStyles**(`id`, `styles`): `Promise`\<`void`\>

**`Experimental`**

Set the custom styles for a custom post.

#### Parameters

##### id

`` `t3_${string}` ``

The ID of the post to set styles for.

##### styles

The styles to set for the post. If a value isn't specified, its previous value
  will be preserved. If `undefined` is passed, all styles will be removed and reset to defaults.

`undefined` | `CustomPostStylesInput`

#### Returns

`Promise`\<`void`\>

***

<a id="setuserflair"></a>

### setUserFlair()

> **setUserFlair**(`options`): `Promise`\<`void`\>

Set the flair for a user in a subreddit.

#### Parameters

##### options

[`SetUserFlairOptions`](../type-aliases/SetUserFlairOptions.md)

Options for the request

#### Returns

`Promise`\<`void`\>

***

<a id="setuserflairbatch"></a>

### setUserFlairBatch()

> **setUserFlairBatch**(`subredditName`, `flairs`): `Promise`\<`FlairCsvResult`[]\>

Set the flair of multiple users in the same subreddit with a single API call.
Can process up to 100 entries at once.

#### Parameters

##### subredditName

`string`

The name of the subreddit to edit flairs in.

##### flairs

[`SetUserFlairBatchConfig`](../type-aliases/SetUserFlairBatchConfig.md)[]

Array of user flair configuration objects. If both text and cssClass are empty for a given user the flair will be cleared.

#### Returns

`Promise`\<`FlairCsvResult`[]\>

- Array of statuses for each entry provided.

***

<a id="submitcomment"></a>

### submitComment()

> **submitComment**(`options`): `Promise`\<[`Comment`](Comment.md)\>

Submit a new comment to a post or comment.

#### Parameters

##### options

[`CommentSubmissionOptions`](../type-aliases/CommentSubmissionOptions.md) & `object`

You must provide either `options.text` or `options.richtext` but not both.

#### Returns

`Promise`\<[`Comment`](Comment.md)\>

A Promise that resolves to a Comment object.

#### Example

```ts
const comment = await reddit.submitComment({
 id: 't1_1qgif',
 text: 'Hello world!',
 runAs: 'APP',
})
```

***

<a id="submitcustompost"></a>

### submitCustomPost()

> **submitCustomPost**(`opts`): `Promise`\<[`Post`](Post.md)\>

Submits a new custom post to a subreddit.

#### Parameters

##### opts

`Readonly`\<[`SubredditOptions`](../type-aliases/SubredditOptions.md) & [`CommonSubmitPostOptions`](../type-aliases/CommonSubmitPostOptions.md) & `object`\>

#### Returns

`Promise`\<[`Post`](Post.md)\>

#### Examples

```ts
const post = await reddit.submitCustomPost({
  subredditName: 'devvit',
  title: 'Hello World',
});
```

By default, `submitCustomPost()` creates a Post on behalf of the App account, but it may be called on behalf of the User making the request by setting the option `runAs: 'USER'`.
When using `runAs: 'USER'` to create an experience Post, you must specify the `userGeneratedContent` option. For example:

```ts
const post = await reddit.submitCustomPost({
 title: 'My Devvit Post',
 runAs: 'USER',
 userGeneratedContent: {
   text: "hello there",
   imageUrls: ["https://styles.redditmedia.com/t5_5wa5ww/styles/communityIcon_wyopomb2xb0a1.png", "https://styles.redditmedia.com/t5_49fkib/styles/bannerBackgroundImage_5a4axis7cku61.png"]
   },
 subredditName: context.subredditName,
 textFallback: {
   text: 'This is a Devvit post!',
 },
});
```

#### See

 - [()\|submitPost()](#submitpost)
 - [()\|crosspost()](#crosspost)

***

<a id="submitpost"></a>

### submitPost()

> **submitPost**(`opts`): `Promise`\<[`Post`](Post.md)\>

Submits a new post to a subreddit.

#### Parameters

##### opts

`Readonly`\<[`SubredditOptions`](../type-aliases/SubredditOptions.md) & [`SubmitPostOptions`](../type-aliases/SubmitPostOptions.md)\>

#### Returns

`Promise`\<[`Post`](Post.md)\>

#### Example

```ts
const post = await reddit.submitPost({
  subredditName: 'devvit',
  title: 'Hello World',
  richtext: new RichTextBuilder()
    .heading({ level: 1 }, (h) => {
      h.rawText('Hello world');
    })
    .codeBlock({}, (cb) => cb.rawText('This post was created via the Devvit API'))
    .build()
});
```

#### See

 - [()\|submitCustomPost()](#submitcustompost)
 - [()\|crosspost()](#crosspost)

***

<a id="subscribetocurrentsubreddit"></a>

### subscribeToCurrentSubreddit()

> **subscribeToCurrentSubreddit**(): `Promise`\<`void`\>

Subscribes to the subreddit in which the app is installed. No-op if the user is already subscribed.
This method will run as user by default. Therefore, you must include SUBSCRIBE_TO_SUBREDDIT
in `permissions.reddit.asUser` in your devvit.json file.

#### Returns

`Promise`\<`void`\>

***

<a id="unbanuser"></a>

### unbanUser()

> **unbanUser**(`username`, `subredditName`): `Promise`\<`void`\>

Unban a user from a subreddit.

#### Parameters

##### username

`string`

The username of the user to unban. e.g. 'spez'

##### subredditName

`string`

The name of the subreddit to unban the user from. e.g. 'memes'

#### Returns

`Promise`\<`void`\>

***

<a id="unbanwikicontributor"></a>

### unbanWikiContributor()

> **unbanWikiContributor**(`username`, `subredditName`): `Promise`\<`void`\>

#### Parameters

##### username

`string`

The username of the user to unban. e.g. 'spez'

##### subredditName

`string`

The name of the subreddit to unban the user from contributing to the wiki on. e.g. 'memes'

#### Returns

`Promise`\<`void`\>

***

<a id="unmuteuser"></a>

### unmuteUser()

> **unmuteUser**(`username`, `subredditName`): `Promise`\<`void`\>

Unmute a user in a subreddit. Unmuting a user allows them to send modmail.

#### Parameters

##### username

`string`

The username of the user to unmute. e.g. 'spez'

##### subredditName

`string`

The name of the subreddit to unmute the user in. e.g. 'memes'

#### Returns

`Promise`\<`void`\>

***

<a id="unsubscribefromcurrentsubreddit"></a>

### unsubscribeFromCurrentSubreddit()

> **unsubscribeFromCurrentSubreddit**(): `Promise`\<`void`\>

Unsubscribes from the subreddit in which the app is installed. No-op if the user isn't subscribed.
This method will execute as the app account by default.
To unsubscribe on behalf of a user, please contact Reddit.

#### Returns

`Promise`\<`void`\>

***

<a id="updatesubredditremovalreason"></a>

### updateSubredditRemovalReason()

> **updateSubredditRemovalReason**(`subredditName`, `reasonId`, `options`): `Promise`\<`void`\>

Update an existing removal reason in a subreddit.

#### Parameters

##### subredditName

`string`

Name of the subreddit (the 'r/' prefix is optional).

##### reasonId

`string`

ID of the removal reason (from get or add).

##### options

Options.

###### message

`string`

The message associated with the removal reason.

###### title

`string`

The title of the removal reason.

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await reddit.updateSubredditRemovalReason('askReddit', 'uuid-abc', {
  title: 'Spam',
  message: 'This post was removed for spam.'
});
```

***

<a id="updatewidget"></a>

### updateWidget()

> **updateWidget**(`widgetData`): `Promise`\<[`Widget`](Widget.md)\>

Update a widget for a subreddit.

#### Parameters

##### widgetData

[`UpdateWidgetData`](../type-aliases/UpdateWidgetData.md)

The data for the widget to update.

#### Returns

`Promise`\<[`Widget`](Widget.md)\>

- The updated Widget object.

***

<a id="updatewikipage"></a>

### updateWikiPage()

> **updateWikiPage**(`options`): `Promise`\<[`WikiPage`](WikiPage.md)\>

Update a wiki page.

#### Parameters

##### options

[`UpdateWikiPageOptions`](../type-aliases/UpdateWikiPageOptions.md)

Options for the request

#### Returns

`Promise`\<[`WikiPage`](WikiPage.md)\>

The updated WikiPage object.

***

<a id="updatewikipagesettings"></a>

### updateWikiPageSettings()

> **updateWikiPageSettings**(`options`): `Promise`\<[`WikiPageSettings`](WikiPageSettings.md)\>

Update the settings for a wiki page.

#### Parameters

##### options

[`UpdatePageSettingsOptions`](../type-aliases/UpdatePageSettingsOptions.md)

Options for the request

#### Returns

`Promise`\<[`WikiPageSettings`](WikiPageSettings.md)\>

A WikiPageSettings object.
