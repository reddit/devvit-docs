# Configure your app

The `devvit.json` file serves as your app's configuration file. Use it to specify entry points, configure features like [event triggers](../server/triggers) and [scheduled actions](../server/scheduler.mdx), and enable app functionality such as [image uploads](../server/media-uploads.mdx). This page summarizes the schema-supported configuration options; the published JSON Schema remains authoritative. A representative `devvit.json` example is provided [here](#complete-example).

## devvit.json

The `devvit.json` [schema](https://developers.reddit.com/schema/config-file.v1.json) is available and is self-documented.

All configuration files should include a `$schema` property which many IDEs will use to make suggestions and present documentation:

```json
{
  "$schema": "https://developers.reddit.com/schema/config-file.v1.json"
}
```

## Required properties

Your `devvit.json` must include:

- **`name`** (required): App account name and Community URL slug. Must be 3-20 characters, start with a letter, and contain only lowercase letters, numbers, and hyphens.

Additionally, you must include at least one of:

- **`post`**: For web view apps
- **`server`**: For Node.js server apps
- **`blocks`**: Deprecated migration configuration for legacy Blocks apps

## Configuration sections

### Core properties

| Property  | Type   | Description                                                               | Required         |
| --------- | ------ | ------------------------------------------------------------------------- | ---------------- |
| `name`    | string | App account name and Community URL slug (3-20 chars, `^[a-z][a-z0-9-]*$`) | Yes              |
| `$schema` | string | Schema version for IDE support                                            | No (recommended) |

### App components

| Property | Type   | Description                                      | Required                  |
| -------- | ------ | ------------------------------------------------ | ------------------------- |
| `post`   | object | Custom post/web view configuration               | One of post/server/blocks |
| `server` | object | Node.js server configuration                     | One of post/server/blocks |
| `blocks` | object | Deprecated configuration for migrating Blocks apps | One of post/server/blocks |

### Permissions & capabilities

| Property          | Type   | Description                    | Required |
| ----------------- | ------ | ------------------------------ | -------- |
| `permissions`     | object | What your app is allowed to do | No       |
| `media`           | object | Static asset configuration     | No       |
| `marketingAssets` | object | Assets for featuring your app  | No       |

### Event handling

| Property    | Type   | Description                  | Required             |
| ----------- | ------ | ---------------------------- | -------------------- |
| `triggers`  | object | Event trigger endpoints      | No (requires server) |
| `scheduler` | object | Scheduled task configuration | No                   |

### UI & interaction

| Property   | Type   | Description                                      | Required |
| ---------- | ------ | ------------------------------------------------ | -------- |
| `menu`     | object | Menu items in posts, comments, and subreddits    | No       |
| `forms`    | object | Form submission endpoints                        | No       |
| `settings` | object | Global and per-subreddit app settings definitions | No       |

### Development

| Property        | Type   | Description                                             | Required |
| --------------- | ------ | ------------------------------------------------------- | -------- |
| `dev`           | object | Development configuration                               | No       |
| `scripts`       | object | Build commands run by the Devvit CLI                     | No       |
| `sourceIgnores` | array  | Source files excluded from packages submitted for review | No       |

## Detailed configuration

### Post configuration

Configure web views for custom post types:

```json
{
  "post": {
    "dir": "public",
    "entrypoints": {
      "default": {
        "entry": "index.html",
        "height": "tall"
      }
    }
  }
}
```

**Properties:**

- `dir` (string): Client directory for web view assets (default: `"public"`)
- `entrypoints` (object): Map of named entrypoints for post rendering
  - Must include a `"default"` entrypoint
  - `entry` (string): HTML file path or `/api/` endpoint
  - `height` (enum): `"regular"` or `"tall"` (default: `"tall"`)

### Server configuration

Configure Node.js server functionality:

```json
{
  "server": {
    "dir": "dist/server",
    "entry": "index.js"
  }
}
```

**Properties:**

- `dir` (string): Server bundle directory relative to the project root (default: `"dist/server"`)
- `entry` (string): Server bundle filename within `server.dir` (default: `"index.js"`)
- `externalEndpoints` (object): Named `/external/` routes available to approved outside callers. See [External Endpoints](../server/external-endpoints.mdx).

Server bundles must be compiled to CommonJS (`cjs`). ES module output is not supported by the Devvit Web runtime.

### Permissions configuration

Control what your app can access:

```json
{
  "permissions": {
    "http": {
      "enable": true,
      "domains": ["example.com", "api.github.com"]
    },
    "media": true,
    "journeys": true,
    "payments": false,
    "realtime": false,
    "redis": true,
    "chromeless": false,
    "reddit": {
      "enable": true,
      "asUser": ["SUBMIT_POST", "SUBMIT_COMMENT"]
    }
  }
}
```

**HTTP plugin:**

- `enable` (boolean): Enable HTTP plugin (default: `true`)
- `domains` (array): Allowed domains for `fetch()` calls

**Reddit API plugin:**

- `enable` (boolean): Enable Reddit API (default: `true`)
- `scope` (enum): `"user"` or `"moderator"` (default: `"user"`)
- `asUser` (array): APIs to execute as user account

**Other permissions:**

- `media` (boolean): Enable media uploads (default: `false`)
- `journeys` (boolean): Enable [Devvit Journeys](../analytics/devvit-journeys.md) telemetry (default: `false`)
- `payments` (boolean): Enable the payments plugin (default: `false`)
- `realtime` (boolean): Enable realtime messaging (default: `false`)
- `redis` (boolean): Enable Redis storage (default: `false`)
- `chromeless` (boolean): Allow supported custom posts to render without standard post chrome when highlighted (default: `false`)
- `blob` (boolean): Reserved for the experimental Blob Storage capability and not yet publicly available. Follow the current [Blob Storage](../server/blob-storage.mdx) setup instructions rather than enabling this field unless directed by Reddit.

### Triggers configuration

Handle Reddit events:

```json
{
  "triggers": {
    "onPostCreate": "/internal/triggers/post-create",
    "onCommentSubmit": "/internal/triggers/comment-submit",
    "onModAction": "/internal/triggers/mod-action"
  }
}
```

**Available triggers:**

- `onAppInstall`, `onAppUpgrade`
- `onPostCreate`, `onPostDelete`, `onPostSubmit`, `onPostUpdate`, `onPostReport`, `onPostFlairUpdate`, `onPostNsfwUpdate`, `onPostSpoilerUpdate`
- `onCommentCreate`, `onCommentDelete`, `onCommentSubmit`, `onCommentUpdate`, `onCommentReport`
- `onMentionInCommentCreate` (limited access; see [Global Triggers](../server/global-triggers.mdx))
- `onModAction`, `onModMail`
- `onAutomoderatorFilterPost`, `onAutomoderatorFilterComment`

**Note:** All trigger endpoints must start with `/internal/` and will receive POST requests with JSON data.

### Menu configuration

Add menu items to subreddit interfaces:

```json
{
  "menu": {
    "items": [
      {
        "label": "Approve Post",
        "description": "Quickly approve this post",
        "forUserType": "moderator",
        "location": ["post"],
        "endpoint": "/internal/menu/approve-post",
        "postFilter": "none"
      },
      {
        "label": "Report Issue",
        "description": "Report a problem with this post",
        "forUserType": "user",
        "location": ["post", "comment"],
        "endpoint": "/internal/menu/report-issue"
      }
    ]
  }
}
```

**Menu item properties:**

- `label` (string): Display text (required)
- `description` (string): Short description
- `forUserType` (enum): `"moderator"` or `"user"` (default: `"moderator"`)
- `location` (string|array): Where menu appears (`"post"`, `"comment"`, `"subreddit"`)
- `endpoint` (string): Internal endpoint to call (required)
- `postFilter` (enum): `"none"` or `"currentApp"` (default: `"none"`)

### Scheduler configuration

Configure scheduled tasks:

```json
{
  "scheduler": {
    "tasks": {
      "daily-cleanup": {
        "endpoint": "/internal/cron/daily-cleanup",
        "cron": "0 2 * * *"
      },
      "hourly-check": {
        "endpoint": "/internal/cron/hourly-check",
        "cron": "0 * * * *",
        "data": {
          "checkType": "health"
        }
      },
      "manual-task": "/internal/cron/manual-task"
    }
  }
}
```

**Task configuration:**

- `endpoint` (string): Internal endpoint to call (required)
- `cron` (string): Cron schedule (optional, for automatic scheduling)
- `data` (object): Additional data passed to cron tasks (optional)

**Cron format:** Standard five-part (`0 2 * * *`) or six-part (`*/30 * * * * *`) format.

### Forms configuration

Map form identifiers to submission endpoints:

```json
{
  "forms": {
    "contact_form": "/internal/forms/contact",
    "feedback_form": "/internal/forms/feedback"
  }
}
```

### Static asset configuration

Configure a directory of static assets that is available to both the app client and server:

```json
{
  "media": {
    "dir": "assets"
  }
}
```

- `dir` (string): Static asset directory relative to the project root (default: `"assets"`)

This top-level `media` object is separate from `permissions.media`, which enables runtime media uploads.

### Settings configuration

Define settings that apply globally or can be configured separately for each subreddit installation:

```json
{
  "settings": {
    "global": {
      "featureEnabled": {
        "type": "boolean",
        "label": "Enable feature",
        "defaultValue": true
      }
    },
    "subreddit": {
      "welcomeMessage": {
        "type": "paragraph",
        "label": "Welcome message"
      }
    }
  }
}
```

At least one of `global` or `subreddit` is required. Supported setting types include strings, paragraphs, numbers, booleans, selects, and multi-selects. See [Settings and Secrets](../server/settings-and-secrets.mdx) for validation and access patterns.

### Payments configuration

The top-level `payments` object declares products and the internal endpoints used to fulfill or refund orders. It is separate from `permissions.payments`, which enables the payments plugin.

```json
{
  "payments": {
    "productsFile": "products.json",
    "endpoints": {
      "fulfillOrder": "/internal/payments/fulfill-order",
      "refundOrder": "/internal/payments/refund-order"
    }
  }
}
```

Provide either inline `products` or a `productsFile`, and always configure `endpoints.fulfillOrder`. See [Add Payments](../../earn-money/payments/payments_add.mdx) for the complete product schema and implementation steps.

### Marketing assets

Configure app presentation:

```json
{
  "marketingAssets": {
    "icon": "assets/icon.png"
  }
}
```

**Properties:**

- `icon` (string): Path to 1024x1024 PNG icon (required)

### Scripts configuration

Configure build commands run by the Devvit CLI. These commands run relative to the `devvit.json` directory.

```json
{
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build"
  }
}
```

**Properties:**

- `dev` (string): Command run by `devvit playtest` to build or watch your client/server artifacts
- `build` (string): Command run by `devvit upload` to build your client/server artifacts

### Source packaging exclusions

Use `sourceIgnores` to exclude files from the source archive submitted during `devvit publish`. Patterns use `.gitignore` syntax and are evaluated after the root `.gitignore` file.

```json
{
  "sourceIgnores": ["coverage/", "*.log", "fixtures/private/"]
}
```

Patterns are relative to the project root. Some paths, including `node_modules/`, `.env`, and `.git/`, are always excluded.

### Development configuration

Configure development settings:

```json
{
  "dev": {
    "subreddit": "my-test-subreddit"
  }
}
```

**Properties:**

- `subreddit` (string): Default development subreddit (can be overridden by `DEVVIT_SUBREDDIT` env var)

## Validation rules

The Devvit CLI validates `devvit.json` against the JSON Schema before playtest, upload, and publish operations. Many IDEs will also underline errors as you write. Common validation errors include:

- **JSON Syntax:** Adding comments or trailing commas (unsupported by JSON)
- **Required Properties:** Missing the required `name` property
- **App Components:** Missing at least one of `post` or `server` (or deprecated `blocks` migration configuration)
- **Dependencies:** Missing `server` when `triggers` is specified
- **File References:** Missing files referenced in `devvit.json`
- **Permissions:** Missing required permissions for used features
- **Pattern Validation:** Invalid patterns for names, paths, or endpoints

## Best practices

1. **Always include the `$schema` property** for IDE autocompletion and validation.
2. **Use specific permission scopes.** Only request permissions your app actually uses.
3. **Set appropriate menu scopes.** Consider whether features should be available to all users or just moderators.
4. **Validate endpoints.** Ensure all internal endpoints start with `/internal/`.
5. **Use meaningful names.** Choose descriptive names for entrypoints, tasks, and forms.
6. **Test configurations.** Use `devvit playtest` during development; `devvit playtest`, `devvit upload`, and `devvit publish` validate the configuration before packaging.

## Environment variables

- `DEVVIT_SUBREDDIT`: Override the `dev.subreddit` value used during `devvit playtest`.
- `DEVVIT_APP_NAME`: Override the `name` value used during `devvit playtest` (and other similar commands).

## Complete example

```json title="devvit.json"
{
  "$schema": "https://developers.reddit.com/schema/config-file.v1.json",
  "name": "my-awesome-app",
  "post": {
    "dir": "public",
    "entrypoints": {
      "default": {
        "entry": "index.html",
        "height": "tall"
      }
    }
  },
  "server": {
    "dir": "dist/server",
    "entry": "index.js"
  },
  "permissions": {
    "http": {
      "enable": true,
      "domains": ["api.example.com"]
    },
    "redis": true
  },
  "triggers": {
    "onPostCreate": "/internal/triggers/post-create"
  },
  "menu": {
    "items": [
      {
        "label": "Approve",
        "forUserType": "moderator",
        "location": "post",
        "endpoint": "/internal/menu/approve"
      }
    ]
  },
  "scheduler": {
    "tasks": {
      "daily-cleanup": {
        "endpoint": "/internal/cron/cleanup",
        "cron": "0 2 * * *"
      }
    }
  },
  "marketingAssets": {
    "icon": "assets/icon.png"
  },
  "dev": {
    "subreddit": "my-test-sub"
  },
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build"
  }
}
```
