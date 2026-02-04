# User Actions

User actions allow your app to submit posts, submit comments, and subscribe to the current subreddit on behalf of the logged in user. These actions occur on the logged in user's account instead of the app account. This enables stronger user engagement while ensuring user control and transparency.

---

## What are user actions?

By default, apps make posts or comments using their associated app account. With user actions enabled, your app can:

- Create posts or comments on behalf of the user (from the post UI, a form, or a menu action)
- Subscribe the user to the current subreddit

---

Requirements
--------------

To ensure a positive user experience and compliance with Reddit policies:

- **Always ask permission:** Your app must always inform users before posting, commenting, or subscribing on their behalf. This can only happen on an explicit manual action, e.g. from a button.
- **No automated actions:** Users must explicitly opt-in to the app acting on their behalf. Do not mislead or surprise users.
- **Establish a reporting flow:** Ensure `userGeneratedContent` is correctly set for posts submitted on behalf of the user. 
- **Do not gate functionality behind subscribing:** Users should not be made to subscribe to the current subreddit to access any part of your app.
- **Remember the human:** Follow Reddit's safety and compliance guidelines for user-generated content.

:::note
Apps using user actions must follow these requirements to be approved.
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

After enabling, you can call certain Reddit APIs on behalf of the user by passing the option `runAs: 'USER'`.

Currently, the following APIs support this option:

- [submitPost()](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#submitpost)
- [submitCustomPost()](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#submitcustompost)
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
    title: 'Post Title',
    entry: 'default',
  });

  res.json({ status: 'success', message: `Post created in subreddit ${subredditName}` });
});
```

---

## Example: Subscribe to current subreddit

The [subscribeToCurrentSubreddit()](../../api/redditapi/RedditAPIClient/classes/RedditAPIClient.md#subscribetocurrentsubreddit) API does not take a `runAs` parameter; it subscribes as the user by default (if specified in `devvit.json` and approved).

```ts
import { reddit } from '@devvit/web/server';

router.post('/api/subscribe', async (_req, res) => {
  try {
    await reddit.subscribeToCurrentSubreddit();
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to subscribe' });
  }
});
```

For user privacy there is no API to check if the user is already subscribed to the current subreddit. You may want to store the subscription state in Redis to provide contextually aware UI.
