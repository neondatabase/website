---
title: Manage Neon Auth via the API
subtitle: Enable, configure, and disable Neon Auth using the Neon API
summary: >-
  How to enable, retrieve, and disable Neon Auth on a branch using the Neon
  REST API, including curl examples and response reference.
enableTableOfContents: true
redirectFrom:
  - /docs/neon-auth/api
  - /docs/guides/neon-auth-api
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

You can manage Neon Auth programmatically using the [Neon API](https://api-docs.neon.tech/reference/getting-started).

<Admonition type="note">
Neon Auth operates at the **branch level**. Each branch can have its own independent auth configuration, which means preview and development branches can have separate auth state from your production branch.
</Admonition>

## Prerequisites

- A [Neon API key](/docs/manage/api-keys)
- A Neon project with at least one branch

All requests use the base URL `https://console.neon.tech/api/v2` and require the `Authorization: Bearer $NEON_API_KEY` header.

You can find your `project_id` and `branch_id` on the **Project settings** and **Branches** pages in the Neon Console.

## Enable Neon Auth

Send a `POST` request to enable Neon Auth on a branch:

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
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
The enable response is the only time the API returns `pub_client_key` and `secret_server_key`. Store them securely. Subsequent `GET` requests do not include these fields.
</Admonition>

If Neon Auth is already enabled on the branch, this call returns an error.

<Admonition type="tip" title="Using a non-default database">
By default, Neon Auth uses the branch's default database. To target a different database, add `database_name` to the request body: `{"auth_provider": "better_auth", "database_name": "my_other_db"}`
</Admonition>

## Get Auth configuration

Retrieve the current Neon Auth configuration for a branch:

```bash
curl -X GET 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth' \
  -H 'Authorization: Bearer $NEON_API_KEY'
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
  "base_url": "https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth"
}
```

## Disable Neon Auth

Send a `DELETE` request to disable Neon Auth on a branch:

```bash
curl -X DELETE 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"delete_data": true}'
```

Response (200 OK): Empty body.

The `delete_data` field controls whether the system removes the `neon_auth` schema from your database:

- **`true`**: Deletes the `neon_auth` schema and all auth tables (users, sessions, accounts).
- **`false`** (default): Disables the auth service but leaves the schema and data intact. You can re-enable later without losing user data.

<Admonition type="danger">
Setting `delete_data` to `true` permanently removes all auth data from the database. You cannot undo this.
</Admonition>

## Related auth endpoints

The Neon API also provides endpoints for managing auth configuration at the branch level. These are available at `https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/...`:

| Endpoint              | Methods                  | Description                                                  |
| --------------------- | ------------------------ | ------------------------------------------------------------ |
| `/domains`            | GET, POST, DELETE        | Manage trusted redirect domains                              |
| `/oauth_providers`    | GET, POST, PATCH, DELETE | Configure OAuth providers (Google, GitHub, etc.)             |
| `/email_provider`     | GET, PATCH               | Configure the email provider                                 |
| `/email_and_password` | GET, PATCH               | Configure email/password authentication                      |
| `/users`              | POST, DELETE, PUT        | Create, delete, and manage user roles                        |
| `/plugins`            | GET, PATCH               | View and configure [auth plugins](/docs/auth/guides/plugins) |
| `/webhooks`           | GET, PUT                 | Configure webhook notifications                              |
| `/allow_localhost`    | GET, PATCH               | Toggle localhost access for development                      |
| `/send_test_email`    | POST                     | Send a test email to verify email configuration              |

For full request/response details on these endpoints, see the [interactive API reference](https://api-docs.neon.tech/reference/getting-started).

<Admonition type="tip" title="TypeScript SDK">
You can also manage Neon Auth using the [Neon TypeScript SDK](/docs/reference/typescript-sdk).
</Admonition>
