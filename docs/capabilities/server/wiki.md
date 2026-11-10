# Wiki Pages

Use the Reddit API to read, create, and update a subreddit's wiki pages. Devvit supports both the original wiki (`v1`) and the newer wiki experience on Reddit web and mobile (`v2`).

## Enable the Reddit API

Add the Reddit permission to `devvit.json`:

```json title="devvit.json"
{
  "permissions": {
    "reddit": true
  }
}
```

Run wiki edits from an authorized server workflow, such as a moderator menu action.

## Choose a wiki version

Wiki operations default to `v1`. Pass `wikiVersion: "v2"` to use the newer wiki, and check enrollment with `reddit.isWikiV2Enabled(subredditName)` first. Not every subreddit supports v2.

The two wikis have independent content. Pages with the same name can have different content, and updating one version does not update the other. The `config/` pages are available only in v1.

## Read and update a page

This example checks v2 support, reads an existing page, and updates its content:

```ts title="server/index.ts"
import { context, reddit } from "@devvit/web/server";

export async function updateCommunityGuide() {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error("Subreddit context required.");
  }

  if (!(await reddit.isWikiV2Enabled(subredditName))) {
    throw new Error("Wiki v2 is not enabled for this subreddit.");
  }

  const page = await reddit.getWikiPage(subredditName, "community-guide", {
    wikiVersion: "v2",
  });

  return page.update(
    page.content + "\n\nPlease review the community rules.",
    "Update community guidance",
  );
}
```

Page methods retain the wiki version used to fetch the page. For example, calling `page.update()` on a v2 page updates v2 content. The client also provides [`reddit.updateWikiPage()`](../../api/redditapi/RedditClient/classes/RedditClient.md#updatewikipage) when you already have the subreddit name, page name, and replacement content.

A successful enrollment check returning `false` means v2 is unavailable. A failed request can indicate an authorization or service error. Handle that failure rather than silently switching to v1, which may contain different content.

## Create a page

After checking v2 support, create a page with [`reddit.createWikiPage()`](../../api/redditapi/RedditClient/classes/RedditClient.md#createwikipage):

```ts
import { context, reddit } from "@devvit/web/server";

export async function createCommunityGuide() {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error("Subreddit context required.");
  }

  if (!(await reddit.isWikiV2Enabled(subredditName))) {
    throw new Error("Wiki v2 is not enabled for this subreddit.");
  }

  return reddit.createWikiPage({
    subredditName,
    page: "community-guide",
    content: "# Community guide\n\nWelcome!",
    reason: "Initialize community guide",
    wikiVersion: "v2",
  });
}
```

## Read revision authors and history

Use `revisionAuthorId` to look up the author of a page's current revision. For a revision from `page.getRevisions()`, use `authorId`. Both IDs can be absent, and a user lookup can return `undefined`:

```ts
import type { WikiPage } from "@devvit/web/server";
import { reddit } from "@devvit/web/server";

export async function logRevisionAuthors(page: WikiPage) {
  if (page.revisionAuthorId) {
    const author = await reddit.getUserById(page.revisionAuthorId);
    console.log(author?.username);
  }

  const revisions = await page.getRevisions({ limit: 5 });
  for await (const revision of revisions) {
    if (revision.authorId) {
      const author = await reddit.getUserById(revision.authorId);
      console.log(author?.username);
    }
  }
}
```

See [WikiPage](../../api/redditapi/models/classes/WikiPage.md) for page settings, editor management, history, and revert operations, and [WikiVersion](../../api/redditapi/models/type-aliases/WikiVersion.md) for version behavior.

## Migrate existing wiki calls

In Devvit 0.15, pass an options object as the third argument to `reddit.getWikiPage()`. The overload that accepted a revision ID string was removed. The two-argument call remains supported and reads the latest v1 page.

```ts
const latestV1Page = await reddit.getWikiPage(subredditName, pageName);

const revision = await reddit.getWikiPage(subredditName, pageName, {
  revisionId,
  wikiVersion: "v2",
});
```

Replace the deprecated `WikiPage.revisionAuthor` and `WikiPageRevision.author` properties with `revisionAuthorId` and `authorId`, respectively. Fetch the user with `reddit.getUserById()` when you need the full user object.
