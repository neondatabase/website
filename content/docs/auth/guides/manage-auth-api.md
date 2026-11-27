---
title: Manage Managed Better Auth via the API
subtitle: 'Enable, configure, and disable Managed Better Auth using the Neon API'
summary: >-
  Managed Better Auth REST API operations for enabling (POST), retrieving (GET),
  updating (PATCH), and disabling (DELETE) auth on a per-branch basis, with
  curl examples and a full response field reference. Use this page when
  automating auth provisioning or teardown: the enable response is the only
  call that returns `pub_client_key` and `secret_server_key`, and the
  `delete_data` flag on DELETE controls whether the `neon_auth` schema is
  permanently removed. Also covers related branch-scoped endpoints for OAuth
  providers, email configuration, domains, users, plugins, and webhooks, plus
  equivalent MCP tools for AI-editor workflows.
enableTableOfContents: true
redirectFrom:
  - /docs/neon-auth/api
  - /docs/guides/neon-auth-api
updatedOn: '2026-11-27T00:39:29.985Z'
---

You can manage Managed Better Auth programmatically using the [Neon API](/docs/reference/api), or from the terminal with the [Neon CLI](/docs/cli/neon-auth) (`neon neon-auth`), which wraps these same operations. You can also enable and configure Managed Better Auth from an AI editor using the [Neon MCP server](/docs/ai/neon-mcp-server#available-tools) (`provision_neon_auth`, `update_auth_config`, `add_auth_oauth_provider`, `get_neon_auth_config`). See [Set up with your AI editor](/docs/auth/about#set-up-with-your-ai-editor).

<Admonition type="note">
Managed Better Auth operates at the **branch level**. Each branch can have its own independent auth configuration, which means preview and development branches can have separate auth state from your production branch.
</Admonition>

## Prerequisites

- A [Neon API key](/docs/manage/api-keys)
- A Neon project with at least one branch

All requests use the base URL `https://console.neon.tech/api/v2` and require the `Authorization: Bearer $NEON_API_KEY` header. The `project_id` and `branch_id` values are returned when you [create a project](/docs/manage/projects#create-a-project-with-the-api) or [list branches](/docs/manage/branches#list-branches-with-the-api) via the API.

## Enable Managed Better Auth

Send a `POST` request to enable Managed Better Auth on a branch:

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"auth_provider": "better_auth"}'
```

Response (201 Created):

```json
{
  "auth_provider": "better_auth",
  "auth_provider_project_id": "cab6949a-10e3-4d25-a879-512beed281e3",
  "pub_client_key": "",
  "secret_server_key": "",
  "jwks_url": "https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth/.well-known/jwks.json",
  "schema_name": "neon_auth",
  "table_name": "users_sync",
  "base_url": "https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth"
}
```

The response includes:

| Field                      | Description                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| `auth_provider`            | The configured provider (`better_auth`)                                                                   |
| `auth_provider_project_id` | Unique ID for the auth provider instance                                                                  |
| `pub_client_key`           | Public client key (shown once at creation, may be empty for `better_auth`)                                |
| `secret_server_key`        | Secret server key (shown once at creation, may be empty for `better_auth`)                                |
| `jwks_url`                 | JWKS endpoint for JWT verification                                                                        |
| `schema_name`              | Database schema created for auth tables (`neon_auth`)                                                     |
| `table_name`               | Table name for synced user data (`users_sync`)                                                            |
| `base_url`                 | Base URL of the auth service, used for SDK configuration and the interactive API reference (`/reference`) |

<Admonition type="important">
The enable response is the only time the API returns `pub_client_key` and `secret_server_key`. Store them securely. Subsequent `GET` requests do not include these fields. For client initialization examples that combine Managed Better Auth and the Data API from a single Neon URL, see [`createClient()` in the JavaScript SDK reference](/docs/reference/javascript-sdk#initializing).
</Admonition>

If Managed Better Auth is already enabled on the branch, this call returns an error.

<Admonition type="tip" title="Using a non-default database">
By default, Managed Better Auth uses the branch's default database. To target a different database, add `database_name` to the request body: `{"auth_provider": "better_auth", "database_name": "my_other_db"}`
</Admonition>

## Get Auth configuration

Retrieve the current Managed Better Auth configuration for a branch:

```bash
curl -X GET 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

Response (200 OK):

```json
{
  "auth_provider": "better_auth",
  "auth_provider_project_id": "cab6949a-10e3-4d25-a879-512beed281e3",
  "branch_id": "br-example-abc123",
  "db_name": "neondb",
  "created_at": "2026-02-26T04:29:05Z",
  "owned_by": "neon",
  "jwks_url": "https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth/.well-known/jwks.json",
  "base_url": "https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth",
  "name": "My App"
}
```

## Update auth configuration

Update auth settings for a branch. Currently supports changing the application name shown in user-facing auth messages. Applies to Managed Better Auth integrations only. Defaults to the Neon project name.

```bash
curl -X PATCH 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/config' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"name": "My App"}'
```

Response (200 OK):

```json
{
  "name": "My App"
}
```

| Field  | Description                                                    |
| ------ | -------------------------------------------------------------- |
| `name` | The name shown in user-facing auth messages (1-256 characters) |

Each branch manages its own application name independently. You can also update this from **Settings** > **Better Auth** > **Project Info** in the Neon Console.

## Disable Managed Better Auth

Send a `DELETE` request to disable Managed Better Auth on a branch:

```bash
curl -X DELETE 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"delete_data": true}'
```

Response (200 OK): Empty body.

The `delete_data` field controls whether the system removes the `neon_auth` schema from your database:

- **`true`**: Deletes the `neon_auth` schema and all auth tables (users, sessions, accounts).
- **`false`** (default): Disables the auth service but leaves the schema and data intact. You can re-enable later without losing user data.

<Admonition type="warning">
Setting `delete_data` to `true` permanently removes all auth data from the database. You cannot undo this.
</Admonition>

## Export Managed Better Auth logs

<Admonition type="note" title="Beta">
Managed Better Auth logs export is in beta. It's available in AWS US East (N. Virginia) (`aws-us-east-1`), AWS US East (Ohio) (`aws-us-east-2`), AWS Europe (Frankfurt) (`aws-eu-central-1`), and AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). In other regions, a request to turn on export returns `404`.
</Admonition>

Managed Better Auth can export a branch's authentication events, such as sign-ups and sign-ins, to the branch logs, so you can read them alongside your other logs. Export is set per branch. Where the feature is available, export is turned on by default when you enable Managed Better Auth on a branch. If you disable and re-enable Managed Better Auth, the branch keeps its previous export setting. Child branches inherit the parent branch's setting.

In the Neon Console, go to **Settings** > **Better Auth**, and under **Logs**, turn **Enable logs** on or off. With the API, send a `PATCH` request to turn export on or off for a branch:

```bash
curl -X PATCH 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/logs_export' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"enabled": true}'
```

Response (200 OK):

```json
{
  "enabled": true
}
```

The `enabled` field reports the current setting. Logs export is only supported for Managed Better Auth (`better_auth`) branches. Other auth providers return `400`.

If logs export isn't available for your project, a request with `enabled: true` returns `404`. You can always send `enabled: false` to turn export off. Enabling export can also return `409` or `423` if the branch is busy, `429` if you're rate limited, or `503` if the service is temporarily unavailable. Retry these later.

Send `{"enabled": false}` to stop exporting. Events already exported aren't deleted, and events may continue to be exported for a few seconds after you turn export off.

The current setting is also returned by `GET /projects/{project_id}/branches/{branch_id}/auth/plugins`, in a `logs_export` object with the same `enabled` field. The `logs_export` object is omitted when logs export isn't available for the project.

With the [Neon CLI](/docs/cli), use `neon neon-auth config logs-export` with `get`, `enable`, or `disable`:

```bash
neon neon-auth config logs-export enable --project-id <project_id> --branch <branch_id>
```

### Read Managed Better Auth logs

Exported events are stored in the branch logs under the `neon_auth` source. Read them with the [Query branch logs](/docs/reference/api/logs/query-project-branch-logs) API, passing `source` in the JSON body:

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/logs/query' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"source": "neon_auth", "since": "1h"}'
```

Or use [`neon logs query`](/docs/cli/logs):

```bash
neon logs query --source neon_auth --since 1h
```

Queries cover at most the last 7 days. You can also view these logs on the branch's [Monitoring page](/docs/introduction/monitor-logs), on the **Auth** tab.

Each event is a structured JSON record with the route, method, status, duration, outcome, request ID, auth provider, client IP address, user agent, and, for successful requests, the user ID. Secrets in request paths are redacted. For example, a failed sign-in looks like this:

```json
{
  "event": "sign_in",
  "outcome": "failure",
  "message": "sign_in failed",
  "method": "POST",
  "route": "/:database/auth/sign-in/email",
  "status": 401,
  "error_code": "INVALID_EMAIL_OR_PASSWORD",
  "duration_ms": 105.04,
  "request_id": "48d8d547-81e8-476e-aede-da9ab0c9b24b",
  "ip": "203.0.113.42",
  "user_agent": "curl/8.7.1"
}
```

Better Auth's own logs are exported under the `neon.auth.better_auth` scope.

If Managed Better Auth logs aren't available for your project yet, querying `neon_auth` returns `404` with reason `telemetry_not_enabled`. Turning export off doesn't cause this error. It stops new events from being exported, and logs already exported stay readable.

## Related auth endpoints

The Neon API also provides endpoints for managing auth configuration at the branch level. These are available at `https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/...`:

| Endpoint                  | Methods                  | Description                                                                                      |
| ------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| `/domains`                | GET, POST, DELETE        | Manage trusted redirect domains                                                                  |
| `/oauth_providers`        | GET, POST, PATCH, DELETE | Configure OAuth providers (Google, GitHub, etc.)                                                 |
| `/email_provider`         | GET, PATCH               | Configure the email provider                                                                     |
| `/email_and_password`     | GET, PATCH               | Configure email/password authentication                                                          |
| `/users`                  | POST, DELETE, PUT        | Create, delete, and manage user roles                                                            |
| `/plugins`                | GET, PATCH               | View and configure [auth plugins](/docs/auth/guides/plugins)                                     |
| `/plugins/magic-link`     | PATCH                    | Configure the [Magic Link plugin](/docs/auth/guides/plugins/magic-link)                          |
| `/plugins/phone-number`   | GET, PATCH               | Configure the [Phone Number plugin](/docs/auth/guides/plugins/phone-number)                      |
| `/plugins/oauth-provider` | GET, PATCH               | Configure the [OAuth provider plugin](/docs/auth/guides/plugins/oauth-provider)                  |
| `/logs_export`            | PATCH                    | Turn [auth logs export](#export-managed-better-auth-logs) on or off for the branch (beta)        |
| `/oauth-provider/clients` | GET, POST, PATCH, DELETE | Manage [OAuth clients](/docs/auth/guides/plugins/oauth-provider#create-and-manage-oauth-clients) |
| `/webhooks`               | GET, PUT                 | Configure webhook notifications                                                                  |
| `/allow_localhost`        | GET, PATCH               | Toggle localhost access for development                                                          |
| `/config`                 | PATCH                    | Update auth configuration (application name)                                                     |
| `/send_test_email`        | POST                     | Send a test email to verify email configuration                                                  |

For full request/response details on these endpoints, see the [interactive API Reference](/docs/reference/api). For the OAuth provider, see the reference for [retrieving](/docs/reference/api/auth/get-neon-auth-o-auth-provider-plugin) and [updating](/docs/reference/api/auth/update-neon-auth-o-auth-provider-plugin) the plugin configuration, and for [listing](/docs/reference/api/auth/list-neon-auth-o-auth-clients), [creating](/docs/reference/api/auth/create-neon-auth-o-auth-client), [retrieving](/docs/reference/api/auth/get-neon-auth-o-auth-client), [updating](/docs/reference/api/auth/update-neon-auth-o-auth-client), [deleting](/docs/reference/api/auth/delete-neon-auth-o-auth-client), and [rotating the secret of](/docs/reference/api/auth/rotate-neon-auth-o-auth-client-secret) OAuth clients.

<Admonition type="tip" title="TypeScript SDK">
You can also manage Managed Better Auth using the [Neon TypeScript SDK](/docs/reference/typescript-sdk).
</Admonition>
