# Migrating devvit.yaml to devvit.json

This guide covers moving a legacy Devvit app's configuration from `devvit.yaml` to `devvit.json`.

## Overview

Devvit 0.15 removed support for `devvit.yaml`. You must migrate your configuration to `devvit.json` and remove `devvit.yaml` before upgrading to 0.15.0.

The `blocks` property and `@devvit/public-api` remain supported but deprecated in 0.15. The examples below keep your existing menu actions and triggers in a legacy entry point. We recommend migrating to `@devvit/web` where possible.

## Migration steps

### 1. Create devvit.json

Create a `devvit.json` file in your project root with your app configuration:

```json
{
  "name": "your-app-name",
  "blocks": {
    "entry": "src/main.tsx",
    "triggers": ["onPostCreate"]
  }
}
```

Replace:

- `"your-app-name"` with your actual app name
- `"src/main.tsx"` with the path to your legacy entry point (where you export your Devvit instance from `@devvit/public-api`)
- Include any triggers used in your src/main.tsx in the triggers array (or remove the parameter)

### 2. Remove devvit.yaml

After moving your configuration to `devvit.json`, delete `devvit.yaml` from your project root. This is required before upgrading to Devvit 0.15.

### 3. Handle static assets

If your app uses static assets (images, fonts, etc.) from an `assets` folder, you'll need to update your `devvit.json` to point to these assets:

```json
{
  "name": "your-app-name",
  "blocks": {
    "entry": "src/main.tsx",
    "triggers": ["onPostCreate"]
  },
  "media": {
    "dir": "assets/"
  }
}
```

### 4. Test your app

After upgrading to Devvit 0.15, playtest your app to check that your menu actions and triggers still work:

```bash
devvit playtest
```

## Continue migrating to Devvit Web

Keep public-api handlers in `blocks.entry`. When you move a handler to Devvit Web, put it in your server entry point and import from `@devvit/web/server`. See [Devvit Web configuration](../../capabilities/devvit-web/devvit_web_configuration.md) for the setup.
