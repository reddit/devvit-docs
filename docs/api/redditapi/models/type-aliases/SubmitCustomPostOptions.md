[**@devvit/reddit v0.14.4-dev**](../../README.md)

***

# Type Alias: SubmitCustomPostOptions

> **SubmitCustomPostOptions** = [`CommonSubmitPostOptions`](CommonSubmitPostOptions.md) & `object`

## Type declaration

### entry?

> `optional` **entry**: `string`

The entrypoint name. Must correspond to a `post.entrypoints` key in the
app's `devvit.json`.

#### Default

The default `devvit.json` entrypoint (`'default'`).

#### Example

following `devvit.json` configuration:
```json
{
  "$schema": "https://developers.reddit.com/schema/config-file.v1.json",
  "name": "example",
  "post": {
    "entrypoints": {
      "default": {"entry": "splash.html"},
      "game": {"entry": "game.html"}
    }
  }
}
```

### postData?

> `optional` **postData**: `PostData`

Arbitrary data to associate to the post. Limited to two kilobytes.

#### See

PostData.

### styles?

> `optional` **styles**: `CustomPostStylesInput`

Styles associated with the custom post, such as height or background color.

### textFallback?

> `optional` **textFallback**: [`CustomPostTextFallbackOptions`](CustomPostTextFallbackOptions.md)

Content to show when rendered on `https://old.reddit.com`.

### userGeneratedContent?

> `optional` **userGeneratedContent**: `UserGeneratedContent`
