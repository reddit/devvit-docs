# Creating a Custom Post

Redditors interact with your app through custom posts. To create a custom post, you’ll define the entry points in `devvit.json,` then use `submitCustomPost` to create a post that references one of those entry points.

## **How it Works**

Each key in the `entrypoints` object (e.g. "default", "game") maps to an HTML file in your build output. When you call `submitCustomPost`, the entry parameter references one of these keys.

```
// devvit.json default template
... 
"name": "test-custom-post",
  "post": {
    "dir": "dist/client",
    "entrypoints": {
      "default": {
        "entry": "splash.html"
      },
      "game": {
        "entry": "game.html"
      }
    }
  }
...
```

```ts
import { reddit } from '@devvit/web/server';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: 'Example title for post',
    entry: 'default' // default
  });
};

```

`submitCustomPost` accepts the following optional parameters:

| Parameter | Description |
| :---- | :---- |
| `entry` | Key of the entrypoint defined in `devvit.json` |
| `postData` |  [Updates post data after creation](../capabilities/server/post-data) |
| `textFallback` | [Specifies alternative text content](../capabilities/server/text_fallback) |
| `userGeneratedContent` | [Enables user-generated content](../capabilities/server/userActions) |
| `styles` | Controls post appearance in the Reddit UI. See [Custom Post Styles](#custom-post-styles) |

## **Custom Post Styles**

Custom post styles let you control how a custom post looks in the Reddit UI, separate from the content inside your webview. You can:

* Set the **light mode or dark mode background color** shown while the iframe loads  
* Choose the **post height** (for example, `“REGULAR”` or `“TALL”`) to control how much vertical space the post takes in the feed.  
* Provide a **share image URL** that’s used for link previews when the post is shared outside Reddit.

All style fields are optional. If you don’t set them, Reddit’s default settings apply. 

### Properties

| Field | Type | Description |
| :---- | :---- | :---- |
| `backgroundColor` | `string` (optional) | The **default background color** shown before the iframe content loads. Must be in **`#RRGGBBAA`** format (red, green, blue, alpha transparency). The value is **case-insensitive**.  Defaults to **transparent** (`#00000000`). |
| `backgroundColorDark` | `string` (optional) | The **dark mode background color** shown before the iframe content loads. Must be in **`#RRGGBBAA`** format with a leading `#`.  Defaults to **transparent** (`#00000000`). |
| `height` | `EntrypointHeight` enum (optional) | Post height. `TALL` \= 512px, `REGULAR` \= 320px. Width varies from \~288–880px depending on device and viewport.  Defaults to `”TALL”`.  |
| `shareImageUrl` | `string` (optional) | The **preview image URL** used when the post is shared externally (for example, OpenGraph `og:image`).  Note: The image **must**  be hosted on [i.redd.it](http://i.redd.it) domain. Use the [media upload plugin](https://developers.reddit.com/docs/capabilities/server/media-uploads) to upload a custom image. This only works if your app is on a public subreddit. Defaults to Reddit’s generic share image: `https://i.redd.it/o0h58lzmax6a1.png`. |

### Creating a custom post with styles

Set your custom post styles when you create a custom post:

```javascript
await reddit.submitCustomPost({
 "title": "Post with styles title",
  "styles": {
    "backgroundColor": "#FFFFFFFF",       // white, fully opaque
    "backgroundColorDark": "#000000FF",  // black, fully opaque
    "height": "TALL",
    "shareImageUrl": "https://i.redd.it/o0h58lzmax6a1.png"
  }
})
```

Note: All style fields are optional.

### Updating styles

Use  `post.setCustomPostStyles()` to update styles on an existing post. Only include the fields you want to change. Omitted fields remain unchanged.

```javascript
const post = await reddit.getPostById(context.postId);
await post.setCustomPostStyles({
  "shareImageUrl": "https://i.redd.it/o0h58lzmax6a1.png"
});
```

Existing `background_color`, `background_color_dark`, and `height` values remain unchanged.

### Reading styles

Use  `post.getCustomPostStyles()` or `reddit.getPostStyles(id)` to read the styles on an existing post. Settings that haven’t been set yet will give you their default values.

```javascript
const post = await reddit.getPostById(context.postId);
const styles = await post.getCustomPostStyles();
// Or, if you don't need the post object and want just the styles:
const styles = await reddit.getPostStyles(context.postId);
```

# Best Practices

* **Color format:** Always provide 8-digit hex with alpha: `#RRGGBBAA`.  
  * `RR`, `GG`, `BB`: 00–FF (0–255) color channels.  
  * `AA`: 00–FF alpha channel (`00` \= fully transparent, `FF` \= fully opaque).

* **Transparency:** Use alpha (`AA`) to blend your app experience smoothly with Reddit backgrounds (for example, `#00000080` for semi-transparent black).

* **Dark mode:** Always set `background_color_dark` when your iframe content has a dark theme so the pre-load state matches the final experience.

* **Height:** Choose the `height` that best matches your UI. The platform will handle mapping that logical value to the correct pixel height for the client.

* **Share image:** Must be hosted on [i.redd.it](http://i.redd.it) (use the [media upload plugin](https://developers.reddit.com/docs/capabilities/server/media-uploads)) and ensure the asset meets typical OpenGraph sizing and aspect-ratio expectations so it renders cleanly across platforms. This only works if your app is on a public subreddit.
