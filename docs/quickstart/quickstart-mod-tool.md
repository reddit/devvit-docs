# Mod tool quickstart

Devvit allows you to build Mod Tools \- subreddit-installed applications that help moderators of that community to take action on conversations, keeping their communities safe and engaged.

This tutorial should take about 10 minutes to complete. Once complete, you'll be able to run a version of [Comment Mop](https://developers.reddit.com/apps/comment-nuke) in your test subreddit from your own codebase.

## What you'll need

- Node.JS (version 22.2.0+)
- A code editor

## Environment setup

1. Install Node.JS and NPM ([instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
2. Go to [https://developers.reddit.com/new](https://developers.reddit.com/new) and choose Mod Tool under Other templates.
3. Go through the wizard. You will need to create a Reddit account and connect it to Reddit developers.
4. Follow the instructions on your terminal.

On success, you should see something like this:

```sh
Your Devvit authentication token has been saved to /Users/user.name/.devvit/token
Fetching and extracting the template...
Cutting the template to the target directory...
 🔧 Installing dependencies...
 🚀🚀🚀 Devvit app successfully initialized!
┌────────────────────────────────────────────────────┐
│ • `cd my-app` to open your project directory       │
│ • `npm run dev` to develop in your test community  │
└────────────────────────────────────────────────────┘
```

## Understanding the template

This tutorial lets you build your own version of [Comment Mop](https://developers.reddit.com/apps/comment-nuke). This tool allows moderators to remove and/or lock a full comment tree with a single menu action, avoiding repetitive mechanical tasks for community moderators.

### Declare a menu action for moderators

Menu items are declared in `devvit.json`. Each entry points at a server endpoint that runs when a moderator clicks it. The template leverages [Menu Actions](../capabilities/client/menu-actions.mdx) to enable moderators to Delete/Lock child comments of a post or comment.

![menu actions](../assets/quickstart/quickstart-mod-tool-1.png)

```json title="devvit.json"
{
  "menu": {
    "items": [
      {
        "label": "Mop comments",
        "description": "Remove this comment and all child comments. This might take a few seconds to run.",
        "forUserType": "moderator",
        "location": ["comment"],
        "endpoint": "/internal/menu/mop-comments"
      }
    ]
  },
  "forms": {
    "mopForm": "/internal/form/mop-submit"
  },
  "permissions": {
    "reddit": { "enable": true, "scope": "moderator" }
  }
}
```

### Show a form from the menu action

Some moderator tools need additional information before they execute. The menu endpoint can respond with a form using [menu responses](../capabilities/client/menu-actions.mdx). Comment Mop displays a form with options for the action to be taken:

![forms](../assets/quickstart/quickstart-mod-tool-2.png)

```ts title="server/index.ts"
import type { MenuItemRequest, UiResponse } from '@devvit/web/shared';

app.post('/internal/menu/mop-comments', async (c) => {
  const _input = await c.req.json<MenuItemRequest>();
  return c.json<UiResponse>({
    showForm: {
      name: 'mopForm',
      form: {
        title: 'Mop Comments',
        acceptLabel: 'Mop',
        cancelLabel: 'Cancel',
        fields: [
          { name: 'remove', label: 'Remove comments', type: 'boolean', defaultValue: true },
          { name: 'lock', label: 'Lock comments', type: 'boolean', defaultValue: false },
          {
            name: 'skipDistinguished',
            label: 'Skip distinguished comments',
            type: 'boolean',
            defaultValue: false,
          },
        ],
      },
    },
  });
});
```

### Handle the form submission with the Reddit API

Devvit apps can use the Reddit API to act on comments and posts. The form submission endpoint receives the moderator's selections and traverses the comment tree:

```ts title="server/index.ts"
import { reddit, context } from '@devvit/web/server';
import type { UiResponse } from '@devvit/web/shared';

type MopFormRequest = {
  remove: boolean;
  lock: boolean;
  skipDistinguished: boolean;
};

app.post('/internal/form/mop-submit', async (c) => {
  const { remove, lock, skipDistinguished } = await c.req.json<MopFormRequest>();
  const { commentId } = context;

  if (!remove && !lock) {
    return c.json<UiResponse>({ showToast: 'You must select either lock or remove.' });
  }

  if (!commentId) {
    return c.json<UiResponse>({ showToast: 'This action must be run on a comment.' });
  }

  try {
    const rootComment = await reddit.getCommentById(commentId);

    for await (const comment of walkReplies(rootComment, skipDistinguished)) {
      if (remove && !comment.removed) await comment.remove();
      if (lock && !comment.locked) await comment.lock();
    }

    return c.json<UiResponse>({
      showToast: 'Comments mopped! Refresh the page to see the cleanup.',
    });
  } catch (err) {
    console.error(err);
    return c.json<UiResponse>({ showToast: 'Mop failed! Please try again later.' });
  }
});

async function* walkReplies(
  comment: Awaited<ReturnType<typeof reddit.getCommentById>>,
  skipDistinguished: boolean,
): AsyncGenerator<typeof comment> {
  if (skipDistinguished && comment.distinguishedBy) return;
  yield comment;
  const replies = await comment.replies.all();
  for (const reply of replies) {
    yield* walkReplies(reply, skipDistinguished);
  }
}
```

## Building and Testing

To build and run your Mod tool, run the following commands on terminal:

```shell
npm run dev
```

If you didn't provide a test subreddit, one will be created for you. Once you run `npm run dev`, you will receive a link to test the mod tool in your test subreddit.

> Note that this mod tool is intended to be run on comments, so you will need to create a post and comment in your subreddit to see it.

## Result

Now you have a mod tool running from the code that you deployed yourself. Feel free to experiment with the code and run `npm run dev` again to see the changes. Notice that you don't need to worry about running costs for your mod tool, because Reddit hosts all Devvit applications for free. Also, if your mod tool becomes popular and gets installed by many subreddits, you may become eligible to earn [Reddit Developer Funds](../earn-money/reddit_developer_funds).

## Further reading

- Use our [launch guide](../guides/launch/launch-guide.md) to guide you where to get your first users.
- [Devvit Forms](../capabilities/client/forms.mdx)
- [Menu Actions](../capabilities/client/menu-actions.mdx)
- [Reddit Developer Funds](../earn-money/reddit_developer_funds)
