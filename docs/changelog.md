# Changelog

While we're always shipping fixes and improvements, our team bundles new features, breaking changes, and other user-facing updates into regular releases. This page logs the changes to each version of Devvit.

To use the latest version of Devvit:

1. Run `npm install devvit@latest` to update your CLI.
2. Run `npx devvit update app` to update your @devvit dependencies.

**Please note**: you may see features available across Devvit packages that are not documented or noted in our changelog. These are experimental features that are not stable and are subject to change, or removal, from the platform. Please use caution when testing or implementing experimental features.

## Release 0.14.2: Maintenance Update

**Release Date: August 31, 2026**

No dev-facing changes today! This release just includes a few under-the-hood performance improvements.


## Release 0.14.1: Additional Source Roots and Post Search

**Release Date: August 17, 2026**

**Additional Source Roots**

Add `additionalSourceRoots` to `devvit.json` to include source files outside your project directory in source packages submitted for review. This helps apps with unconventional builds, such as external source folders that compile into `dist/`.

`additionalSourceRoots` works with existing source ignore behavior, so you can include the extra root paths reviewers need while still excluding files covered by your ignore rules.

**Post Search**

Use `reddit.searchPosts()` and `subreddit.searchPosts()` to search for posts with a query and other search parameters.

**Form Context Fix**

`context.postId` is now defined in form submission handlers when a form is opened from a post menu item, matching the existing `context.commentId` behavior for comment menu items.

**Wiki Deprecation Correction**

Corrected the 0.14.0 wiki deprecation notice: `reddit.getWikiPage(subredditName, pageName)` remains supported. Only `reddit.getWikiPage(subredditName, pageName, revisionId)` is deprecated.

**CLI Node.js Warning**

The Devvit CLI now warns once during `playtest`, `upload`, and `publish` if your local Node.js version is older than the supported version. The warning is informational and does not block the command.

## Release 0.14.0: Node.js v24, Wiki Integration, Devvit Skills (Experimental)

**Release Date: August 10, 2026**

**Node.js Upgrade**

Node.js v24.18.0 is now live across Devvit. All Devvit apps run on Node.js v24, the latest LTS release supported by Devvit, and no action is required. Although this is technically a breaking change, which we’re recognizing with the v0.14.0 minor version bump, we do not expect any negative user impact.

For the officially supported local development experience, we encourage users to upgrade their local Node version to v24.18.0. Devvit templates have also been updated so new apps start with the latest Node version by default ([example upgrade](https://github.com/reddit/devvit-template-bare/pull/52/changes)).

This upgrade also unlocks Node features added since Devvit’s previous runtime version, Node.js v22.5.1. You can read the full list in the [Node.js v24.18.0 changelog](https://nodejs.org/en/blog/release/v24.18.0), including newer platform APIs such as URLPattern. While Devvit still requires server code to be bundled to JavaScript, local unit tests and scripts can now take advantage of native Node.js TypeScript support without a separate compilation step ([example](https://github.com/reddit/devvit-template-bare/blob/main/src/server/server.test.ts)).

**Wiki Integration**

Devvit apps can now access the newer wiki pages available on Reddit web and mobile. Wiki-related methods now accept an optional `WikiVersion` parameter so you can choose which wiki system to target: `v1` for existing old Reddit wikis, which remains the default, or `v2` for the newer wiki experience.

Not all subreddits are enrolled in v2 wikis yet, so this release also adds `reddit.isWikiV2Enabled()` to check whether a subreddit supports them. Calling a v2 wiki operation for a subreddit that is not enrolled will result in an error.

Note that v1 and v2 wikis operate independently. A subreddit can have pages with the same title in both versions, but those pages can contain different content, and edits to one version will not affect the other.

**Deprecations**

The `reddit.getWikiPage(subredditName, page, revisionId)` signature has been deprecated in favor of `reddit.getWikiPage(subredditName, page, options)`, which allows multiple optional parameters.

The `WikiPage.revisionAuthor` and `WikiPageRevision.author` fields have been deprecated in favor of `WikiPage.revisionAuthorId` and `WikiPageRevision`.authorId. Use `reddit.getUserById()` with those IDs when you need to fetch the full user object.

**Devvit Skills (Experimental)**

We’re announcing the [devvit-skills](https://github.com/reddit/devvit-skills) repository for Devvit. Use it to give AI coding agents access to Devvit docs and other Devvit-specific guidance. This is experimental, and we plan to add more useful skills in the future.

The first available skill, `devvit-docs`, helps agents answer Devvit questions using the official [reddit/devvit-docs](https://github.com/reddit/devvit-docs) repository as the source of truth. It detects the Devvit version in your project, searches the matching docs when available, and cites the files and sections used in its answer.

**Devvit Test Redis Changes**

We’ve migrated to a JS only implementation of Redis inside of [Devvit test](https://developers.reddit.com/docs/guides/tools/devvit_test). This should make it easier to install and work with. While not a breaking change, it's possible the new Redis mock behaves differently compared to the previous version. If you run into any issues, please [let us know on Github](https://github.com/reddit/devvit)!
