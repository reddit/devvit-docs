[**@devvit/reddit v0.14.1-dev**](../../README.md)

***

# Type Alias: WikiVersion

> **WikiVersion** = `"v1"` \| `"v2"`

WikiVersion represents different wikis that an app can manage. The wiki versions operate independently: editing a page in one version will not
edit the same page in the other version.

v1 is the wiki seen in old reddit. Enabled in all subreddits by default. The `'config/'` pages are only available in v1, and attempting to access those in v2 will
throw an error.

v2 is the wiki seen in redit.com and the mobile apps. Call reddit.isWikiV2Enabled(subreddit) to check if a subreddit supports V2 wikis.
