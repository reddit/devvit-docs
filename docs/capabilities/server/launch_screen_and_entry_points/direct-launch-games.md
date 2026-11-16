# Direct Launch for Games

Direct launch opens a game in expanded mode when a player starts it from a supported discovery surface.

This reduces friction between discovering a game and playing it: players land on an interactive screen right away, which makes it easier to try a game from **Daily Games**, **Featured**, **Play Again**, or **Category** surfaces.

## **Version requirements**

- **Preferred:** Devvit CLI `0.15.3` or higher.
- **Minimum allowed:** Devvit CLI `0.14.6` or higher.

## **Default and direct launch behavior**

By default, a game plays in the feed.

Direct launch opens the game in [expanded mode](https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points#switching-between-view-modes) when a user opens it from Featured, Recent, or Category surfaces.

:::note  
You’ll want to make sure your game supports and is designed for expanded mode before enabling direct launch in your app.  
:::

## **Configure devvit.json**

1. Add the reserved `_direct_launch` entrypoint under `post.entrypoints`.
2. Point its `entry` to the screen that is best for immediate interaction. It can point to the same screen as another entrypoint if that screen is appropriate for direct launch.

```json
{
  "$schema": "https://developers.reddit.com/schema/config-file.v1.json",
  "name": "syllo-app",
  "post": {
    "dir": "dist/client",
    "entrypoints": {
      "default": {
        "entry": "splash.html"
      },
      "_direct_launch": {
        "entry": "play.html"
      }
    }
  }
}
```

In this example, the default entrypoint remains `splash.html`, while Direct Launch starts at `play.html`.
