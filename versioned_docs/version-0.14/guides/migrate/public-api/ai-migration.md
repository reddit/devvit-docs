# Migrating with AI

Use an AI coding assistant to port a PRAW or Async PRAW app to Devvit Web. You do not need to know TypeScript or
Devvit before you begin, but you remain responsible for reviewing and testing the generated app.

This guide gives you copyable prompts and review checkpoints. Use this in conjunction
with [PRAW-to-Devvit API mappings](./basics.md#migration-basics), the [PRAW documentation](https://praw.readthedocs.io/),
or the [Async PRAW documentation](https://asyncpraw.readthedocs.io/).

:::tip[Already set up?]

If you already have a clean Devvit Web app, Devvit skills installed, and a read-only copy of your Python app in
`app-to-migrate/`, skip to [Ask the AI to inspect first](#4-ask-the-ai-to-inspect-first).

:::

## How to use this guide

Each step separates your work from the AI's work:

- **You:** Actions to perform yourself, such as creating the app, copying files, entering secrets, reviewing diffs,
  and playtesting.
- **Ask the AI:** Text in a code block that you should copy into your coding assistant. Replace placeholders such as
  `<describe one PRAW workflow>` before sending it.
- **Check:** A result you should verify before continuing.

Only the text inside a block labeled **Ask the AI** is prompt input. Explanations, checklists, tables, shell commands,
and links are instructions or reference material for you; do not paste the entire page into the assistant. If your
assistant can read the repository and use Devvit skills, give it the focused prompt and let it retrieve the relevant
documentation.

## Ground rules

The prompts in this guide repeat the most important rules, but you should enforce them during every review:

- Treat `app-to-migrate/` as read-only reference material.
- Make required changes in the Devvit app, not in the copied PRAW source.
- Use `@devvit/web`; do not migrate to `@devvit/public-api`.
- Explain why each major PRAW pattern maps to a Devvit capability.
- Verify nontrivial Reddit API mappings against the PRAW or Async PRAW behavior and the Devvit docs before coding.
- Do not put secrets in chat or commit OAuth tokens, `.env` values, `praw.ini`, or developer credentials.
- Keep a gap list for behavior that cannot be migrated directly.

## 1. Create the target Devvit app

**You:** Go to [developers.reddit.com/new](https://developers.reddit.com/new) and create a new app.

- Choose [**Mod Tool Simple**](https://developers.reddit.com/new/app?template=mod-tool) under **Other templates** for a
  small moderation bot or a straightforward migration with one primary workflow.
- Choose [**Mod Tool Full**](https://developers.reddit.com/new/app?template=mod-tool-full) under **Other templates** for
  a complicated bot, scheduled automation, multiple moderator actions, or an app primarily driven by Reddit events and
  moderator actions. This is the best starting point for most complex PRAW migrations.
- Choose **React** if the migrated app needs a custom post with an interactive user interface.

Open the generated project in your AI-powered code editor. The [app quickstart](../../../quickstart/quickstart.md) and
[mod tool quickstart](../../../quickstart/quickstart-mod-tool.md) cover the required local tools and first run.

If you want to keep the old app name, use a placeholder Devvit app name during migration. Once you submit your port to Reddit, you will have the opportunity to move your Data API app username to your new Devvit account.

**Check:** The project root contains `devvit.json` and `package.json`, and the untouched starter app runs.

## 2. Give the AI access to the docs

An assistant should look up APIs rather than guess from its training data. Install the skills from the
[Devvit Skills repository](https://github.com/reddit/devvit-skills):

```bash
npx skills add reddit/devvit-skills
```

Then open or restart your coding assistant in the Devvit project and send:

**Ask the AI:**

```text
Please set up my repository using devvit-skills-setup.
```

See [AI Tools](../../ai/ai.md) for supported editors, the Devvit MCP server, and other ways to give an assistant access
to current Devvit documentation.

For the Python side, the assistant should inspect `requirements.txt`, `pyproject.toml`, or the imports in the copied
app. It should use the [PRAW docs](https://praw.readthedocs.io/) for `praw` and the
[Async PRAW docs](https://asyncpraw.readthedocs.io/) for `asyncpraw`.

Do **not** install PRAW or Async PRAW in the Devvit project. Devvit runs TypeScript and does not use either Python
package. The old app and its dependency files are reference material; the assistant needs the documentation to
understand the behavior it is replacing.

**Check:** Ask the assistant to find the Devvit documentation for Redis. Continue when it responds with a relevant
docs link or citation. If skills are not supported by your assistant, configure the Devvit MCP server using
[AI Tools](../../ai/ai.md).

## 3. Copy the old app into the target project

**You:** Make sure the original PRAW app is committed or backed up. Copy it into a new `app-to-migrate/` directory at
the Devvit project root. Do not move your only working copy.

Your project should now resemble:

```text
my-devvit-app/
├── app-to-migrate/    # copied PRAW or Async PRAW app; reference only
├── src/
├── devvit.json
└── package.json
```

Add this line to the Devvit project's `.gitignore`:

```gitignore
app-to-migrate/
```

Commit the clean Devvit project before the AI makes edits. This gives you a safe baseline and makes every generated
change reviewable.

**Check:** `app-to-migrate/` contains the copied Python app, Git ignores it, and the original app still exists in its
original location.

## 4. Ask the AI to inspect first

Do not start with “convert this app.” First ask for an inventory that produces a plan without editing files.

**Ask the AI:**

```text
I want to migrate the PRAW or Async PRAW app in app-to-migrate/ to Devvit Web.

Rules:
- Treat app-to-migrate/ as read-only reference material.
- Use @devvit/web only; do not use @devvit/public-api.
- Do not edit files yet.
- Inspect devvit.json, package.json, src/, and app-to-migrate/.
- Determine whether the source uses praw, asyncpraw, or both from its imports and dependency files.
- Consult the matching PRAW or Async PRAW docs and the Devvit docs. Do not install the Python packages in this project.

Report:
- source files, PRAW entrypoints, and startup commands
- Reddit API calls and object methods
- subreddit.stream, mod.stream, polling, cron, and while True loops
- local storage, SQL, files, pickle, JSON state, and cache usage
- environment variables, secrets, OAuth credentials, and app config
- external HTTP domains and webhook integrations
- CLI, admin, moderator, and maintenance flows
- dependencies that are Python-only, native, or not portable to Devvit
- tests, manual test cases, and untested behavior
- direct Devvit mappings, risky mappings, and unsupported gaps

For each nontrivial Reddit API replacement, cite the source library behavior and the Devvit API or capability you plan
to use. Name the files and functions that implement each behavior.
```

**You:** Read the report and compare it with how you operate the old app. Correct missing entrypoints, scheduled tasks,
admin commands, or special cases before authorizing edits.

**Check:** Every original workflow has a named source file or function, a proposed Devvit replacement, and a risk or
gap assessment.

## 5. Turn the inventory into a migration plan

**Ask the AI:**

```text
Turn the approved inventory into an ordered migration plan. Do not edit files yet.

For each step, list:
- the single user-visible behavior being migrated
- the source files and functions it replaces
- the Devvit files and capabilities it will use
- configuration, permissions, settings, secrets, and external domains required
- automated tests and manual test cases
- known behavior changes or unsupported gaps

Put shared configuration and endpoint skeletons before business logic. Keep each later implementation step small enough
for me to review and test independently.
```

Use these common mappings to review the plan:

| PRAW or Python pattern                                  | Devvit decision                                                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `praw.Reddit(...)`, OAuth setup, bot tokens             | Remove token handling and configure Reddit permissions in `devvit.json`.                                                                         |
| `subreddit.stream.*`, `mod.stream.*`, incoming webhooks | Use [triggers](../../../capabilities/server/triggers.mdx) or declared [external endpoints](../../../capabilities/server/external-endpoints.mdx). |
| `while True`, `time.sleep`, cron, pollers               | Use [scheduler](../../../capabilities/server/scheduler.mdx) jobs with bounded batches.                                                           |
| SQLite, JSON files, pickle, local disk                  | Use [Redis](../../../capabilities/server/redis.mdx), [Blob Storage](../../../capabilities/server/blob-storage.mdx), or an external service.      |
| `.env`, `os.getenv`, process config                     | Use [Settings & Secrets](../../../capabilities/server/settings-and-secrets.mdx).                                                                 |
| `requests` or `aiohttp`                                 | Use server-side [HTTP Fetch](../../../capabilities/server/http-fetch.mdx) with explicit domains.                                                 |
| CLI admin commands                                      | Use moderator [menu actions](../../../capabilities/client/menu-actions.mdx), [forms](../../../capabilities/client/forms.mdx), or settings.       |
| Repeated reads of public Reddit or third-party data     | Use [Cache Helper](../../../capabilities/server/cache-helper.md) when shared short-term caching is appropriate.                                  |
| Local logs, shell access, Sentry, Datadog               | Use `console.log`, `console.info`, `console.error`, and [Logs and Debugging](../../tools/logs.md).                                               |
| Local bot process tests                                 | Use [@devvit/test](../../tools/devvit_test.mdx) plus mocks for unsupported APIs and third-party fetch calls.                                     |

**Check:** Do not approve implementation until the plan covers `devvit.json`, storage, secrets, external domains, tests,
and every source entrypoint.

## 6. Configure capabilities before business logic

**Ask the AI:**

```text
Implement only the approved Devvit configuration and endpoint skeletons.

Configure the minimum required:
- permissions.reddit
- permissions.http.domains
- triggers
- scheduler jobs
- menu actions and forms
- settings and secret definitions
- storage-related imports or wrappers
- server endpoints

Do not port business logic yet.
Do not add or request secret values.
Explain why each capability is needed and link to the relevant Devvit documentation.
Run the available validation or type-check commands, then summarize the files changed and any remaining setup I must do.
```

**You:** Review the diff. Set secret values yourself by following
[Settings & Secrets](../../../capabilities/server/settings-and-secrets.mdx); never paste them into chat. If the settings
or secrets must be registered before testing, use the normal [Devvit CLI](../../tools/devvit_cli.mdx) upload flow.
Request HTTP domain approval early for third-party services and keep the allow-list to exact hostnames.

**Check:** Configuration validation passes, endpoint skeletons contain no migrated business logic, and no secret values
appear in files or chat.

## 7. Migrate one behavior at a time

A behavior slice is one complete workflow, such as “remove comments containing a banned phrase,” “post a weekly
thread,” or “show a moderator form and save the result.” Work through the approved plan one slice at a time.

**Ask the AI:**

```text
Migrate only this behavior: <describe one PRAW workflow>.

Use the approved inventory and migration plan.
Keep app-to-migrate/ read-only.
Use @devvit/web only.
Consult the relevant PRAW or Async PRAW docs and Devvit docs for every nontrivial Reddit API mapping.
Prefer the smallest Devvit implementation that preserves behavior.
Add or update automated tests for this behavior and run them.

After editing, summarize:
- files changed
- source behavior replaced
- Devvit APIs and capabilities used, with relevant docs links
- behavior intentionally changed
- tests added or updated and their results
- manual checks I should perform
- remaining gaps
```

**You:** Replace the placeholder with one workflow from the plan. After the AI finishes, review the diff and test
results. Accept or correct the slice before sending the prompt again for the next workflow.

**Check:** The slice works independently, its tests pass, and the gap list is current. If the assistant finds a new
gap, decide how to handle it before allowing a workaround.

## 8. Review Devvit-specific design changes

Some Python bot patterns should not be ported literally. Use this table while reviewing each slice:

| Pattern to flag                                                                        | What to do instead                                                                                                                                             |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One bot process serving many subreddits with shared local state                        | Design for subreddit-scoped installations. Use an external service through HTTP Fetch when you need cross-community state.                                     |
| Infinite streams, daemons, open sockets, or background workers                         | Use triggers for Reddit events and scheduler jobs for periodic work. Save progress in Redis for batch jobs.                                                    |
| Large migrations, cleanup jobs, or historical backfills                                | Process bounded batches, store a cursor or progress marker, and schedule follow-up work.                                                                       |
| SQL schemas copied directly into Redis                                                 | Redesign around the state the Devvit app actually needs. Use Redis for hot state, Blob Storage for larger records, or an external service for relational data. |
| Iterating over every Redis key later                                                   | Track key names in known collection keys. Do not rely on discovering all keys later with a global scan.                                                        |
| Large Redis payloads or permanent histories                                            | Use TTLs, bounded histories, Blob Storage, or `redisCompressed` where appropriate.                                                                             |
| OAuth refresh, `praw.ini`, client secrets, bot passwords                               | Remove them. Devvit provides platform-managed Reddit access through app installation and permissions.                                                          |
| `process.env` or `os.getenv` for runtime config                                        | Define settings and secrets, then read them from the Devvit server.                                                                                            |
| Python-only libraries, native packages, or local binaries                              | Replace them with TypeScript packages that work in Devvit, or move that work to an external service.                                                           |
| Admin work performed through a terminal                                                | Build moderator-only menu actions, forms, settings, or maintenance endpoints.                                                                                  |
| Private user data such as saved posts, upvoted posts, friends, or user subreddit lists | Redesign around public Reddit data or explicit user actions.                                                                                                   |
| Existing production data import or app-name migration                                  | Plan it with the Devvit team through [Discord](https://developers.reddit.com/discord).                                                                         |

**Ask the AI:**

```text
Review the migrated slices against the Devvit-specific design table in this guide. Do not edit files.

Identify any code that copied a long-running process, cross-subreddit state, SQL schema, OAuth flow, environment
variable, local admin command, or local filesystem assumption too literally. For each issue, explain the Devvit-native
design, the user-visible tradeoff, and the documentation supporting it.
```

**Check:** The migration summary explains every intentional design change; it does not merely report converted code.

## 9. Test the migrated behavior

The AI should add tests with each slice. Before the final review, make sure the suite covers:

- trigger handlers and event payload parsing
- scheduler jobs, batching, cursors, and retry behavior
- menu actions, forms, and validation
- Redis reads and writes
- settings and secrets reads
- Reddit API calls and `runAs` choices
- third-party fetch success and failure paths
- idempotency for events that may be retried
- unsupported behavior that should fail clearly

Use [@devvit/test](../../tools/devvit_test.mdx) for backend behavior. Mock third-party fetch calls and Reddit API methods
that are unavailable in the test harness.

See [Playtest](../../tools/playtest.md) for guidance on testing your app in a subreddit.

**Ask the AI:**

```text
Audit the automated tests against the approved migration plan. Add only the missing tests needed to cover migrated
business logic and failure paths. Use @devvit/test for backend behavior, mock unsupported Reddit API methods and
third-party HTTP calls, and run the complete test and type-check commands. Report the exact commands and results.
```

**Check:** Tests and type-checks pass. Read the tests to confirm they assert behavior rather than only execute code.

## 10. Re-review against the source app

**Ask the AI:**

```text
Re-review app-to-migrate/ against the migrated Devvit app.

Treat app-to-migrate/ as read-only and do not edit files yet.
List every source entrypoint, command, stream handler, scheduled job, data write, moderation action, external API call,
setting, and secret.

For each item, mark one:
- migrated
- intentionally changed
- unsupported with an accepted gap
- missed and still needs work

Cite the source file and function and the corresponding Devvit implementation for every migrated item.
```

**You:** Compare this report with the original inventory. If anything is missed, return to
[Migrate one behavior at a time](#7-migrate-one-behavior-at-a-time), then repeat this review.

**Check:** Every original workflow is migrated, intentionally changed, or recorded as an accepted gap. A successful
build alone does not mean the migration is complete.

## 11. Playtest and launch

**You:** Use [Playtest](../../tools/playtest.md) in a test subreddit. Exercise the migrated workflows with real posts,
comments, moderator actions, settings, and scheduled jobs. Use [Logs and Debugging](../../tools/logs.md) to investigate
failures.

Before launch, verify:

- `app-to-migrate/` was not modified.
- The migrated code imports from `@devvit/web` packages, not `@devvit/public-api`.
- No secrets, OAuth tokens, `.env` values, or developer credentials are in code, docs, tests, or chat transcripts.
- `devvit.json` declares every required Reddit, HTTP, trigger, scheduler, menu, form, setting, secret, endpoint, and
  storage capability.
- Redis keys that need later iteration are tracked through known collection keys.
- Long-running work is batched and resumable.
- External domains and external endpoints are documented.
- Tests cover migrated business logic and failure paths.
- Manual playtest coverage includes Reddit UI flows that automated tests cannot cover.
- Remaining gaps have an explicit owner and path forward.

**Ask the AI:**

```text
Create a final migration handoff. Do not edit files.

Summarize the migrated workflows, intentional behavior changes, accepted gaps, configuration and secrets I must
manage, automated test commands, and test results. Then give me a numbered manual playtest checklist with the expected
result for each step. Include the commands needed to start the app locally and open a Devvit playtest.
```

When every check passes, follow the [launch guide](../../launch/launch-guide.md).
