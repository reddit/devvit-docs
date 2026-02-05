# Logs and Debugging

Stream log events from your installed app to your command line to troubleshoot your app. You can see 5,000 logs or up to 7 days of log events.

## Create logs

Use `console.log()`, `console.info()`, and `console.error()` in your server code to create logs. View them with `devvit logs` for installed apps, or add `--verbose` to include timestamps.

The following example creates a basic app with a menu action that creates a log when clicked.

```json title="devvit.json"
{
  "$schema": "https://developers.reddit.com/schema/config-file.v1.json",
  "name": "app-name",

  "server": {
    "dir": "dist/server",
    "entry": "index.cjs"
  },
  "permissions": {
    "reddit": true
  },
  "menu": {
    "items": [
      {
        "label": "Create a log!",
        "location": "subreddit",
        "endpoint": "/internal/log-action",
        "forUserType": "moderator"
      }
    ]
  }
}
```

```typescript title="server/index.ts"
router.post("/internal/log-action", async (_req, res): Promise<void> => {
  console.log("log-action");
  res.json({
    showToast: {
      text: "Log action",
      appearance: "success",
    },
  });
});
```

## Stream logs

To stream logs for an installed app, open a terminal and navigate to your project directory and run:

```bash
$ devvit logs <my-subreddit>
```

You can also specify the app name to stream logs for from another folder.

```bash
$ devvit logs <my-subreddit> <app-name>
```

You should now see logs streaming onto your console:

```bash
=============================== streaming logs for my-app on my-subreddit ================================
[DEBUG] Dec 8 15:55:23 Action called!
[DEBUG] Dec 8 15:55:50 Action called!
[DEBUG] Dec 8 15:57:29 Action called!
[DEBUG] Dec 8 15:57:32 Action called!
```

To exit the streaming logger, enter `CTRL + c`.


## Historical logs

You can view historical logs by using the `--since=XX` flag. You can use the following shorthand:

- `Xs`: show logs in the past X seconds
- `Xm`: show logs in the past X minutes
- `Xh`: show logs in the past X hours
- `Xd`: show logs in the past X days
- `Xw`: show logs in the past X weeks

The following example will show logs from `my-app` on `my-subreddit` in the past day.

```bash
$ devvit logs <my-subreddit> --since=1d
```

You will now see historical logs created by your app on this subreddit:

```bash
=============================== streaming logs for my-app on my-subreddit ================================
[DEBUG] Dec 8 15:55:23 Action called!
[DEBUG] Dec 8 15:55:50 Action called!
[DEBUG] Dec 8 15:57:29 Action called!
[DEBUG] Dec 8 15:57:32 Action called!
```

To exit the streaming logger, enter `CTRL + c`.

## Playtest

While you are running [`playtest`](./playtest.md) in a subreddit, you will also be [streaming logs](#create-logs) from that community in your command line.
