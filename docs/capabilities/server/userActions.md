# User actions

User actions allow your app to perform certain actions—such as creating posts, comments, or subscribing to subreddits—on behalf of the user, rather than the app account. This enables stronger user engagement while ensuring user control and transparency.

---

## What are user actions?

By default, apps make posts or comments using their associated app account. With user actions enabled, your app can:

- Create posts or comments on behalf of the user (from the post UI, a form, or a menu action)
- Subscribe the user to the current subreddit

---

## Available user actions

These actions can be made on behalf of the user:

| Action | Permission scope |
| :--- | :--- |
| [submitCustomPost()](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#submitcustompost)                    | `SUBMIT_POST`            |
| [submitPost()](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#submitpost)                                | `SUBMIT_POST`            |
| [submitComment()](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#submitcomment)                          | `SUBMIT_COMMENT`         |
| [subscribeToCurrentSubreddit()](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient#subscribetocurrentsubreddit) | `SUBSCRIBE_TO_SUBREDDIT` |

Each permission scope your app uses must be declared in your `devvit.json` ([enabling user actions](#enabling-user-actions)).

Your app must also [collect permission from the user](#collecting-permission-from-the-user).  before you can perform actions on their behalf.

---

## Guidelines

To ensure a positive user experience and compliance with Reddit policies:

- **Be transparent:** Inform users and show them the content that will be posted on their behalf.
- **No auto-creation:** Users must opt in to allow the app to post or comment on their behalf. This can only happen on an explicit action.
- **Provide user control:**  If you are relying on persistent user opt-in, you must make it clear on how the user can opt-out.


:::note
Apps using user actions must follow these guidelines to be approved.
:::

---

## How it works

- **Unapproved/playtest apps:**
  - `runAs: 'USER'` will operate from the app account unless the app owner takes the action.
  - User actions taken by the app owner will be attributed to the app owner's username.
- **Approved apps:**
  - After publishing and approval, `runAs: 'USER'` will operate on behalf of the user for all users.

---

## Enabling user actions

To enable user actions, add the required permissions to your `devvit.json`:

```json title="devvit.json"
"permissions": {
  "reddit": {
    "asUser": [
      "SUBMIT_POST",
      "SUBMIT_COMMENT",
      "SUBSCRIBE_TO_SUBREDDIT"
    ]
  }
}
```

You should only include the permissions your app actually uses.

After enabling, you can call certain Reddit APIs on behalf of the user by passing the option `runAs: 'USER'`.

Currently, the following APIs support this option:

- [submitPost()](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#submitpost)
- [submitComment()](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#submitcomment)

If `runAs` is not specified, the API will use `runAs: 'APP'` by default.

---

## Parameters

| Parameter              | Description                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `runAs`                | The type of account to perform the action on behalf of: `'USER'` or `'APP'`. Defaults to `'APP'`.                        |
| `userGeneratedContent` | Text or images submitted by the user. Required for `submitPost()` with `runAs: 'USER'` for safety and compliance review. |

:::note
Apps that use `submitPost()` with `runAs: 'USER'` require `userGeneratedContent` to be approved by Reddit.
:::

---

## Collecting permission from the user

The app must call `canRunAsUser()` _on the client side_ before it performs any fetch to
itself on the server side that might result in the use of any user action. This call
serves to collect permission from the user, and to inform the app of the user's decision.

The first time a user encounters a call to this function, they will be presented with
a consent dialog. All the permission scopes declared in `devvit.json` will be listed,
and the user will be asked to approve or deny.

If the user chooses approve, then `canRunAsUser()` will resolve its promise to `true`,
and you may proceed with using any permitted user action on the server side.

If the user chooses deny, then the returned promise resolves to `false`. This may also
happen if the user chooses to revoke permission from their settings page anytime at a
later date. Use this check as an opportunity to continue providing non-consenting users
a quality experience, instead of exposing them to a permission check error from the
server side moments later.

Once the user has chosen one way or the other, future calls to `canRunAsUser()` will
resolve immediately, without prompting the user any further.

:::note
We currently do not _require_ collected permissions, but that will be changing soon!
If your app is already using `canRunAsUser()` properly, then it won't be impacted
when enforcement begins.
:::

```ts
import { canRunAsUser } from '@devvit/web/client';

// Button that user interacts with to share their result as a comment
function handleButtonClick() {
  if (await canRunAsUser()) {
    try {
      const response = await fetch('/api/submit-comment');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      showToast({
        text: 'Comment submitted',
        appearance: 'success',
      });
    } catch (error) {
      showToast('Something went wrong. Please try again.');
    }
  } else {
    showToast({
      text: 'Skipping comment submission because permission not granted',
      appearance: 'success',
    });
  }
}
```

---

## Example: Submit a post as the user

This example uses a form to prompt the user for input and then submits a post as the user.

```tsx title="server/index.ts"
import { reddit } from '@devvit/web/server';

// ...

router.post('/internal/post-create', async (_req, res) => {
  const { subredditName } = context;
  if (!subredditName) {
    res.status(400).json({ status: 'error', message: 'subredditName is required' });
    return;
  }

  reddit.submitPost({
    runAs: 'USER',
    userGeneratedContent: {
      text: "Hello there! This is a new post from the user's account",
    },
    subredditName,
    title: 'Post Title'
     entry: 'default',
  });

  res.json({ status: 'success', message: `Post created in subreddit ${subredditName}` });
});
```

---

## Example: Subscribe to subreddit

The subscribe API does not take a `runAs` parameter; it subscribes as the user by default (if specified in `devvit.json` and approved).

```ts
import { reddit } from '@devvit/web/server';

await reddit.subscribeToCurrentSubreddit();
```

:::note
There is no API to check if the user is already subscribed to the subreddit. You may want to store the subscription state in Redis to provide contextually aware UI.
:::

---

## Best practices

- Always inform users before posting or commenting on their behalf.
- Require explicit user opt-in for all user actions.
- Use `userGeneratedContent` for all user-submitted posts.
- Store user consent and subscription state if needed for your app's UX.
- Follow Reddit's safety and compliance guidelines for user-generated content.
