# Changelog

While we're always shipping fixes and improvements, our team bundles new features, breaking changes, and other user-facing updates into regular releases. This page logs the changes to each version of Devvit.

To use the latest version of Devvit:

1. Run `npm install devvit@latest` to update your CLI.
2. Run `npx devvit update app` to update your @devvit dependencies.

**Please note**: you may see features available across Devvit packages that are not documented or noted in our changelog. These are experimental features that are not stable and are subject to change, or removal, from the platform. Please use caution when testing or implementing experimental features.

## Release 0.13.6:   External Endpoints and App Mentions Triggers (Limited Access)
**Release Date: June 29, 2026**

This release introduces two new limited-access features that expand how apps connect with external services and respond to events across Reddit: [External Endpoints](./capabilities/server/external-endpoints.mdx) and [App Mentions Triggers](./capabilities/server/global-triggers.mdx). 

:::note
Because both features extend your app's capabilities beyond its installed subreddit, access is currently limited behind an allowlist. Devs can request access [here](http://forms.gle/jVNPNwmUFPCRuEvy8). Priority access will be granted to moderation tools that are part of our [App Migration Program](https://www.reddit.com/r/Devvit/comments/1sgwkm7/bring_your_data_api_apps_to_devvit_and_details/).
:::

**External Endpoints** 

External Endpoints provide a secure way for external services to communicate with your Devvit app.
Endpoints are externally accessible routes exposed by your app, making it easy to integrate with third-party services, webhooks, and other external systems while maintaining secure communication.

**App Mention Triggers**
App Mention Triggers let Devvit apps respond whenever they're mentioned in comments anywhere on Reddit using the `u/<AppName>` syntax.

This enables apps to provide on-demand functionality that users can invoke directly from Reddit conversations, regardless of which subreddit the mention occurs in.

**Other Fixes**
Additional improvements in this release include: 
- **Increased visibility in your app’s installation history**. Now whenever a moderator changes a setting for one of your installed apps, it'll appear in the portal.
- **Increased app slug length**. App slugs can now be up to 20 characters. 

## Relese 0.13.5: Improved Tracing
**Release Date: June 23, 2026**

In this release, we've improved trace propagation between web view and plugin calls. Apps running v0.13.5+ will have more complete traces, providing better observability and simplifying debugging and support.


## Relese 0.13.4: Updated Redis Docs
**Release Date: June 15, 2026**

In this release, we’ve updated our [Redis](./capabilities/server/redis.mdx) documentation based on your feedback, adding clearer guidance around key design, data structures, shared states, and scheduled maintenance.

## Release 0.13.3: Devvit Journeys: a Dashboard and Receipts
**Release Date: June 8, 2026**

If you’re enrolled in the [Devvit Journeys](./capabilities/analytics/devvit-journeys.md) beta, you’ll see a couple of new features in 0.13.3: 

- A [new dashboard](./capabilities/analytics/journeys-dashboard.md) that surfaces your app’s activity and performance metrics—including starts, completions, engagement, session frequency, and duration. These insights help you understand how users progress through your app and evaluate the effectiveness of your design. 
- [Event receipts](./capabilities/analytics/journeys-receipts.md) included in the API responses that provide feedback on how telemetry events were processed. Receipts help you verify whether an event was recorded successfully or identify when it was skipped, rejected, rate limited, or could not be confirmed, making it easier to debug integrations and validate telemetry behavior.

Also in this release: we’ve expanded the available in-app [purchase price tiers](./earn-money/payments/payments_add.mdx#price-products), giving you more flexibility to price products and subscriptions.

## Release 0.13.2: More Maintenance

**Release Date: June 2, 2026**

Just a little more clean-up; pardon our dust!

## Release 0.13.1: Maintenance Update

**Release Date: June 2, 2026**

No dev-facing changes today! This release just includes a few under-the-hood performance improvements. 

## Release 0.13.0: Logged Out Users, Push Notifications, App Telemetry, and More!

**Release Date: May 26, 2026**

We’re very excited to introduce Release 0.13.0, which introduces new features to attract logged out users, drive user engagement, and provide telemetry data to your game. We also have some breaking changes, which are going to be really important if your app currently uses Blocks functionality. Read on…

:::note
Upgrading to 0.13.0 is not required, but you should be aware that Blocks UI support will be removed from all clients (web, Android, iOS) on June 30, 2026.
:::

### Breaking Changes

_**Devvit Web**_

If you use **Devvit Web** (`@devvit/web`), there’s only one breaking change:

- The `splash` and `loading` screen support has been removed from `submitCustomPost()`. Please use a dedicated splash entrypoint HTML page instead as shown in the [project templates](./examples/template-library.md).

Old method:

```tsx
return await reddit.submitCustomPost({
  // Show platform splash screen inline and foo entrypoint in expanded mode.
  splash: {
    appDisplayName: "appDisplayName",
    entry: "foo",
  },
  title: "hello",
});
```

New method:

```bash
return await reddit.submitCustomPost({
  // Show foo entrypoint inline. Change this to a splash entrypoint if wanted.
  entry: 'foo'
  title: 'hello',
});
```

And we did a little housekeeping:

- Deprecated `inline` for post entrypoints in `devvit.json`. This property has no effect, and is always implied for post entrypoints. There are no built in splash screens, and any entrypoint may be opened in expanded mode.

_**@devvit/public-api**_

If you use the old `@devvit/public-api`, **Blocks UI is no longer supported** in v0.13.0. These are the breaking changes:

- Removed all custom post features from the Devvit singleton. This specifically includes `addCustomPostType()`, but also the ability to `submit()` custom posts and other Reddit API calls that operate on custom posts (`setPostData()`, `setCustomPostPreview()`, etc.).

  - Notably, menu actions and forms remain intact; apps can continue to provide interactivity through these mechanisms without porting to Devvit Web yet. (But this is deprecated, and support will be dropped in the future!).
  - Removed Blocks support from `@devvit/payments`. The `usePayments()` hook was removed, and payments now only supports Devvit Web apps.
  - Removed `realtime` and `useChannel` from the public-api. There is no UI to communicate with.

- Removed `Devvit.Context`. You can import the context type from the public API package and should use that instead.
- Removed obsolete` @devvit/security` and `@devvit/pushnotif` packages.
- Remove obsolete key-value (`Context.kvStore`) plugin which had `List()` disabled for more than a year. Please use Redis directly.

### Reddit API Changes
- Added a new `crosspostParentId` field in the `Post` object to identify the original post for a crosspost.

### New Features

- **Building for Logged Out Users**. Reddit has an untapped resource for your apps: [logged out users](./guides/logged-out-users.mdx). We’ve given you a guide to design your game so that it can be played and shared with anyone, and you can prompt logged out users to subscribe to your game.

- **Push Notifications (experimental)**. [Push notifications](./capabilities/notifications/notifications-overview.md) help drive engagement, increase player retention, and build habit loops for players by bringing players back into your game at the right moments. We’ve also included detailed support for adding streaks to your game to encourage daily play!

- **Devvit Journeys (experimental)**. We’ve added a new telemetry feature that tracks the full lifecycle of a user session. [Devvit Journeys](./capabilities/analytics/analytics-overview.md) gives you a new way to understand how players move through your game session from start to finish, making it easier to see where users engage, where they drop off, and which moments lead to completion.

:::note
Experimental features are gated beta programs. Access to Push Notifications and Devvit Journeys is currently limited and requires approval before it can be functional in your app.  
:::
