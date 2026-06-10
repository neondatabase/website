---
title: 'Neon CLI command: neon-auth'
subtitle: Manage Neon Auth from the CLI
summary: >-
  Covers the usage of the `neon-auth` command in the Neon CLI to enable, inspect,
  and configure Neon Auth on a database branch, including OAuth providers, trusted
  domains, email settings, and user management.
enableTableOfContents: true
---

## Before you begin

- Before running the `neon-auth` command, ensure that you have [installed the Neon CLI](/docs/reference/cli-install).
- The `neon-auth` command requires **neonctl 2.23.0** or later. Check your version with `neon --version`.
- If you have not authenticated with the [neon auth](/docs/reference/cli-auth) command, running a Neon CLI command automatically launches the Neon CLI browser authentication process. Alternatively, you can specify a Neon API key using the `--api-key` option when running a command. See [Connect](/docs/reference/neon-cli#connect).

For an overview of Neon Auth, see [Neon Auth](/docs/auth/overview).

## The `neon-auth` command

The `neon-auth` command lets you manage [Neon Auth](/docs/auth/overview) on a database branch from the terminal.

### Usage

```bash
neon neon-auth <subcommand> [options]
```

| Subcommand       | Description                                         |
| ---------------- | --------------------------------------------------- |
| `enable`         | Provision Neon Auth on a branch                     |
| `status`         | Show the current Neon Auth configuration            |
| `disable`        | Remove Neon Auth from a branch                      |
| `oauth-provider` | Manage OAuth providers                              |
| `domain`         | Manage trusted redirect domains                     |
| `config`         | Configure email, organization, and webhook settings |
| `plugins`        | View plugin configurations                          |
| `user`           | Manage auth users                                   |

### Shared options

These options apply to all `neon-auth` subcommands:

| Option           | Description                                                        | Type   |
| ---------------- | ------------------------------------------------------------------ | ------ |
| `--project-id`   | Project ID                                                         | string |
| `--branch`       | Branch ID or name                                                  | string |
| `--context-file` | [Context file](/docs/reference/cli-set-context) path and file name | string |

If `--project-id` or `--branch` are omitted, the CLI resolves them from your [context file](/docs/reference/cli-set-context) or prompts when only one option is available.

### `enable`

Provisions Neon Auth on the current branch.

```bash
neon neon-auth enable [options]
```

| Option            | Description                        | Type   |
| ----------------- | ---------------------------------- | ------ |
| `--database-name` | Database name to use for auth data | string |

### `status`

Shows whether Neon Auth is configured on the branch and displays the current connection details.

```bash
neon neon-auth status [options]
```

### `disable`

Removes Neon Auth from the branch.

```bash
neon neon-auth disable [options]
```

| Option          | Description                                                            | Type    |
| --------------- | ---------------------------------------------------------------------- | ------- |
| `--delete-data` | Also drop the Neon Auth schema and all associated data from the branch | boolean |

### `oauth-provider`

Manages OAuth authentication providers for the branch.

```bash
neon neon-auth oauth-provider <subcommand> [options]
```

| Subcommand | Description               |
| ---------- | ------------------------- |
| `list`     | List configured providers |
| `add`      | Add an OAuth provider     |
| `update`   | Update an OAuth provider  |
| `delete`   | Delete an OAuth provider  |

#### `oauth-provider add` and `update` options

| Option                  | Description                                                       | Type   |
| ----------------------- | ----------------------------------------------------------------- | ------ |
| `--provider-id`         | OAuth provider ID. Supported values: `google`, `github`, `vercel` | string |
| `--oauth-client-id`     | OAuth client ID from your provider app                            | string |
| `--oauth-client-secret` | OAuth client secret from your provider app                        | string |

#### `oauth-provider delete` options

| Option          | Description       | Type   | Required |
| --------------- | ----------------- | ------ | :------: |
| `--provider-id` | OAuth provider ID | string |   Yes    |

### `domain`

Manages trusted redirect domains for the branch.

```bash
neon neon-auth domain <subcommand> [options]
```

| Subcommand        | Description                          |
| ----------------- | ------------------------------------ |
| `list`            | List trusted domains                 |
| `add <domain>`    | Add a trusted domain                 |
| `delete <domain>` | Delete a trusted domain              |
| `allow-localhost` | Manage localhost connection settings |

#### `domain allow-localhost`

```bash
neon neon-auth domain allow-localhost <subcommand> [options]
```

| Subcommand | Description                          |
| ---------- | ------------------------------------ |
| `get`      | Get the localhost connection setting |
| `enable`   | Allow localhost connections          |
| `disable`  | Restrict localhost connections       |

### `config`

Configures auth features for the branch.

```bash
neon neon-auth config <subcommand> [options]
```

| Subcommand       | Description                               |
| ---------------- | ----------------------------------------- |
| `email-password` | Get or update email and password settings |
| `email-provider` | Get, update, or test the email provider   |
| `organization`   | Get or update the organization plugin     |
| `webhook`        | Get or update webhook settings            |

#### `config email-password update` options

| Option                                 | Description                                         | Type    |
| -------------------------------------- | --------------------------------------------------- | ------- |
| `--enabled`                            | Enable or disable email and password authentication | boolean |
| `--email-verification-method`          | Email verification method                           | string  |
| `--require-email-verification`         | Require email verification before sign-in           | boolean |
| `--auto-sign-in-after-verification`    | Automatically sign in after email verification      | boolean |
| `--send-verification-email-on-sign-up` | Send a verification email on sign-up                | boolean |
| `--send-verification-email-on-sign-in` | Send a verification email on sign-in                | boolean |
| `--disable-sign-up`                    | Disable new user sign-ups via email and password    | boolean |

#### `config email-provider update` and `test` options

| Option           | Description          | Type   |
| ---------------- | -------------------- | ------ |
| `--type`         | Email provider type  | string |
| `--host`         | SMTP host            | string |
| `--port`         | SMTP port            | number |
| `--username`     | SMTP username        | string |
| `--password`     | SMTP password        | string |
| `--sender-email` | Sender email address | string |
| `--sender-name`  | Sender display name  | string |

The `test` subcommand also requires `--recipient-email`.

#### `config organization update` options

| Option           | Description                               | Type    |
| ---------------- | ----------------------------------------- | ------- |
| `--enabled`      | Enable or disable the organization plugin | boolean |
| `--limit`        | Maximum number of organizations per user  | number  |
| `--creator-role` | Role assigned to the organization creator | string  |

#### `config webhook update` options

| Option             | Description                             | Type    | Required |
| ------------------ | --------------------------------------- | ------- | :------: |
| `--enabled`        | Enable or disable the webhook           | boolean |   Yes    |
| `--url`            | Webhook endpoint URL                    | string  |          |
| `--enabled-events` | Events that trigger the webhook         | array   |          |
| `--timeout`        | Webhook request timeout in milliseconds | number  |          |

### `plugins`

Views plugin configurations for the branch.

```bash
neon neon-auth plugins <subcommand> [options]
```

| Subcommand          | Description                         |
| ------------------- | ----------------------------------- |
| `list`              | List all plugin configurations      |
| `get <plugin-name>` | Get a specific plugin configuration |

### `user`

Manages auth users on the branch.

```bash
neon neon-auth user <subcommand> [options]
```

| Subcommand           | Description          |
| -------------------- | -------------------- |
| `create`             | Create an auth user  |
| `delete <user-id>`   | Delete an auth user  |
| `set-role <user-id>` | Set roles for a user |

#### `user create` options

| Option    | Description          | Type   | Required |
| --------- | -------------------- | ------ | :------: |
| `--email` | User's email address | string |   Yes    |
| `--name`  | User's display name  | string |          |

#### `user set-role` options

| Option    | Description              | Type  | Required |
| --------- | ------------------------ | ----- | :------: |
| `--roles` | Roles to assign the user | array |   Yes    |

## Examples

Enable Neon Auth on the current branch:

```bash
neon neon-auth enable
```

Check whether Neon Auth is configured:

```bash
neon neon-auth status
```

Add a Google OAuth provider:

```bash
neon neon-auth oauth-provider add --provider-id google --oauth-client-id <client-id> --oauth-client-secret <client-secret>
```

Add a trusted redirect domain:

```bash
neon neon-auth domain add example.com
```

Create an auth user:

```bash
neon neon-auth user create --email alex@example.com --name "Alex Lopez"
```

Disable Neon Auth and remove all associated data:

```bash
neon neon-auth disable --delete-data
```

<NeedHelp/>
