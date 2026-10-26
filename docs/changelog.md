# Changelog

While we're always shipping fixes and improvements, our team bundles new features, breaking changes, and other user-facing updates into regular releases. This page logs the changes to each version of Devvit.

To use the latest version of Devvit:

1. Run `npm install devvit@latest` to update your CLI.
2. Run `npx devvit update app` to update your @devvit dependencies.

**Please note**: you may see features available across Devvit packages that are not documented or noted in our changelog. These are experimental features that are not stable and are subject to change, or removal, from the platform. Please use caution when testing or implementing experimental features.

## Devvit 0.15.1: Steady State

**Release Date: October 26, 2026** 

No user-facing changes this time around. This release focuses on behind-the-scenes maintenance to keep Devvit running smoothly.

## Release 0.15.0: API Updates & Expanded Mode Improvements

**Release Date: October 19, 2026** 

### Breaking Changes in Devvit 0.15.0

This release includes two breaking changes and a reminder about deprecated functionality. Review the following updates before upgrading.

**Breaking Changes**

- **`devvit.yaml` support removed:** Devvit no longer supports `devvit.yaml`. [Migrate to `devvit.json`](https://developers.reddit.com/docs/guides/migrate/devvit-singleton) before upgrading to 0.15.0.
  
- **`reddit.getWikiPage()` signature updated:** The `reddit.getWikiPage(subredditName, page, revisionId)` signature has been removed. Use `reddit.getWikiPage(subredditName, page, options)` instead.

**Deprecated Functionality** 

This is your reminder that `blocks` property in `devvit.json` and the `@devvit/public-api` package remain supported but deprecated. We recommend migrating to `@devvit/web` when possible.

**Other Improvements**

- **Custom expanded mode titles:** You can now specify a custom title when calling `requestExpandedMode()`, giving you more control over how your app appears in expanded mode.
- **Expanded mode navigation:** You can now call `requestExpandedMode()` while already in expanded mode, enabling more flexible navigation within your app.
