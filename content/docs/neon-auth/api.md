---
title: Manage Neon Auth using the API
enableTableOfContents: true
updatedOn: '2025-07-23T17:00:18.139Z'
tag: beta
redirectFrom:
  - /docs/guides/neon-auth-api
---

<FeatureBetaProps feature_name="Neon Auth" />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/guides/neon-auth">Get started</a>
    <a href="/docs/guides/neon-auth-demo">Tutorial</a>
    <a href="/docs/guides/neon-auth-how-it-works">How it works</a>
  </DocsList>

  <DocsList title="Sample project" theme="repo">
    <a href="https://github.com/neondatabase-labs/neon-auth-demo-app">Neon Auth Demo App</a>
  </DocsList>
</InfoBlock>

Learn how to manage your Neon Auth integration using the Neon API. Create a new integration, generate SDK keys, add users, and claim ownership of your Neon-managed auth project to your auth provider.

## Prerequisites

- A Neon API key (see [Create an API Key](/docs/manage/api-keys#create-an-organization-api-key))
- A Neon project

## Common parameters

Several endpoints require these parameters:

- `project_id`: Your Neon project ID. You can find it in the Neon Console on the **Settings** page, or use the [List Projects endpoint](https://api-docs.neon.tech/reference/listprojects).
- `auth_provider`: The authentication provider you're using. Currently supported providers:
  - `stack`: Stack Auth integration

## Create integration

Creates a Neon-managed authentication project for your database (currently supporting Stack Auth). This endpoint performs the same action as using Quick Start in the Console, automatically provisioning and configuring a new auth provider project that Neon manages for you.

<Admonition type="note">
To create an integration, you'll need:
- Your production branch ID. Get it from the Neon Console on the **Branches** page, or use the [List Branches endpoint](https://api-docs.neon.tech/reference/listprojectbranches) (look for `"default": true`)
- Your database name and role name. Get them by clicking on the **Connect** button on your **Project Dashboard** in the Neon Console, or use the [List Databases endpoint](https://api-docs.neon.tech/reference/listprojectbranches)
</Admonition>

Required parameters:

- `project_id`: Your Neon project ID
- `branch_id`: Your project's production branch ID
- `database_name`: Name of your database (defaults to `"neondb"`)
- `role_name`: Database role for authenticated users (defaults to `"neondb_owner"`)

```bash shouldWrap
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/auth/create' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "auth_provider": "stack",
       "project_id": "project-id",
       "branch_id": "br-example-123",
       "database_name": "neondb",
       "role_name": "neondb_owner"
     }' | jq
```

Example response:

```json shouldWrap
{
  "auth_provider": "stack",
  "auth_provider_project_id": "proj-example-123",
  "pub_client_key": "pck_example123",
  "secret_server_key": "ssk_example123",
  "jwks_url": "https://api.stack-auth.com/api/v1/projects/proj-example-123/.well-known/jwks.json",
  "schema_name": "neon_auth",
  "table_name": "users_sync"
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/createneonauthintegration)

## List integrations

Lists all active auth provider integrations for your project.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/auth/integrations' \
     --header 'authorization: Bearer $NEON_API_KEY' | jq
```

Example response:

```json shouldWrap
{
  "data": [
    {
      "auth_provider": "stack",
      "auth_provider_project_id": "proj-example-123",
      "branch_id": "br-example-123",
      "db_name": "neondb",
      "created_at": "2024-03-19T12:00:00Z",
      "owned_by": "neon",
      "jwks_url": "https://api.stack-auth.com/api/v1/projects/proj-example-123/.well-known/jwks.json"
    }
  ]
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/listneonauthintegrations)

## Generate SDK keys

Generates SDK keys for your auth provider integration. These keys are used to set up your frontend and backend SDKs.

Required parameters:

- `project_id`: Your Neon project ID
- `auth_provider`: The authentication provider (currently `"stack"`)

```bash shouldWrap
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/auth/keys' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "project_id": "project-id",
       "auth_provider": "stack"
     }' | jq
```

Example response:

```json shouldWrap
{
  "auth_provider": "stack",
  "auth_provider_project_id": "project-id-123",
  "pub_client_key": "pck_example...",
  "secret_server_key": "ssk_example...",
  "jwks_url": "https://api.stack-auth.com/api/v1/projects/project-id-123/.well-known/jwks.json",
  "schema_name": "neon_auth",
  "table_name": "users_sync"
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/createneonauthprovidersdkkeys)

## Create users

Creates a new user in your auth provider's system.

Required parameters:

- `project_id`: Your Neon project ID
- `auth_provider`: The authentication provider (currently `"stack"`)
- `email`: User's email address

Optional parameters:

- `name`: User's display name (1-255 characters)

```bash shouldWrap
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/auth/user' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "project_id": "project-id",
       "auth_provider": "stack",
       "email": "user@example.com",
       "name": "Example User"
     }' | jq
```

Example response:

```json shouldWrap
{
  "id": "user-id-123"
}
```

You can verify the user was synchronized to your database by connecting to your project and querying the `neon_auth.users_sync` table:

```bash shouldWrap
psql postgres://[user]:[password]@[hostname]/[database]
```

```sql shouldWrap
SELECT id, email, name, created_at FROM neon_auth.users_sync;
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/createneonauthnewuser)

## Transfer to your auth provider

Transfer ownership of your Neon-managed auth project to your own auth provider account. This is a two-step process:

1. Request a transfer URL:

```bash shouldWrap
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/auth/transfer_ownership' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "project_id": "project-id",
       "auth_provider": "stack"
     }' | jq
```

Example response:

```json shouldWrap
{
  "url": "https://app.stack-auth.com/integrations/neon/projects/transfer/confirm?code=example123"
}
```

2. Open the returned URL in a browser to complete the transfer. You'll be asked to confirm which Stack Auth account should receive ownership of the project.

<Admonition type="note">
After the transfer, you'll still be able to access your project from the Neon dashboard, but you'll also have direct access from the Stack Auth dashboard.
</Admonition>

## Delete integration

Removes an integration with a specific auth provider.

```bash shouldWrap
curl --request DELETE \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/auth/integration/{auth_provider}' \
     --header 'authorization: Bearer $NEON_API_KEY' | jq
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/deleteneonauthintegration)

## Manage OAuth providers via API

You can programmatically manage OAuth providers for your Neon Auth project using the Neon API. The following endpoints allow you to add, list, update, and delete OAuth providers for a project.

### List OAuth providers

Lists the OAuth providers for the specified project.

Required parameters:

- `project_id` (string): The Neon project ID

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/auth/oauth_providers' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

Example response:

```json shouldWrap
{
  "providers": [
    { "id": "github", "type": "shared" },
    { "id": "google", "type": "shared" }
  ]
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/listneonauthoauthproviders)

### Add an OAuth provider

Adds an OAuth provider to the specified project.

Required parameters:

- `project_id` (string): The Neon project ID
- `id` (string): The provider ID (e.g., `google`, `github`, `microsoft`)

Optional parameters:

- `client_id` (string): The OAuth client ID
- `client_secret` (string): The OAuth client secret

> If you do not provide `client_id` and `client_secret`, Neon will use shared keys for the provider. For production environments, you should always provide your own `client_id` and `client_secret` to ensure security and control. See [Production OAuth setup best practices](/docs/neon-auth/best-practices#production-oauth-setup) for details.

```bash shouldWrap
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/auth/oauth_providers' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "id": "google",
       "client_id": "your-client-id",
       "client_secret": "your-client-secret",
     }'
```

Example response:

```json shouldWrap
{
  "id": "google",
  "type": "standard",
  "client_id": "your-client-id",
  "client_secret": "your-client-secret"
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/addneonauthoauthprovider)

### Update an OAuth provider

Updates an OAuth provider for the specified project.

Required parameters:

- `project_id` (string): The Neon project ID
- `oauth_provider_id` (string): The OAuth provider ID (e.g., `google`, `github`, `microsoft`)

Optional parameters (request body):

- `client_id` (string): The new OAuth client ID
- `client_secret` (string): The new OAuth client secret

```bash shouldWrap
curl --request PATCH \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/auth/oauth_providers/google' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "client_id": "new-client-id",
       "client_secret": "new-client-secret"
     }'
```

Example response:

```json shouldWrap
{
  "id": "google",
  "type": "standard",
  "client_id": "new-client-id",
  "client_secret": "new-client-secret"
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/updateneonauthoauthprovider)

### Delete an OAuth provider

Deletes an OAuth provider from the specified project.

Required parameters:

- `project_id` (string): The Neon project ID
- `oauth_provider_id` (string): The OAuth provider ID (e.g., `google`, `github`, `microsoft`)

```bash shouldWrap
curl --request DELETE \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/auth/oauth_providers/google' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

A successful DELETE returns no response body (`204 No Content`).

You can use the GET endpoint to confirm the provider has been removed.

[Try in API Reference ↗](https://api-docs.neon.tech/reference/deleteneonauthoauthprovider)
"type": "custom",
"host": "smtp.gmail.com",
"port": 587,
"username": "your-email@gmail.com",
"sender_email": "noreply@yourcompany.com",
"sender_name": "Your Company"
}

````

<Admonition type="note">
For detailed configuration instructions and best practices, see [Email configuration](/docs/neon-auth/email-configuration).
</Admonition>

[Try in API Reference ↗](https://api-docs.neon.tech/reference/updateneonauthemailserver)

## Get email server configuration

Gets the email server configuration for the specified project.

Required parameters:

- `project_id`: Your Neon project ID

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/auth/email_server' \
     --header 'authorization: Bearer $NEON_API_KEY' | jq
````

Example response:

```json shouldWrap
{
  "type": "shared"
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/getneonauthemailserver)

## Update email server configuration

Updates the email server configuration for the specified project.

Required parameters:

- `project_id`: Your Neon project ID

Request body parameters:

- `type`: Type of email server (`"shared"` or `"custom"`)
- `host`: SMTP server hostname (required for custom SMTP)
- `port`: SMTP server port (required for custom SMTP)
- `username`: SMTP username (required for custom SMTP)
- `password`: SMTP password (required for custom SMTP)
- `sender_email`: Email address that will appear as the sender (required for custom SMTP)
- `sender_name`: Name that will appear as the sender (required for custom SMTP)

```bash shouldWrap
curl --request PATCH \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/auth/email_server' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "type": "custom",
       "host": "smtp.gmail.com",
       "port": 587,
       "username": "your-email@gmail.com",
       "password": "your-app-password",
       "sender_email": "noreply@yourcompany.com",
       "sender_name": "Your Company"
     }' | jq
```

Example response:

```json shouldWrap
{
  "type": "custom",
  "host": "smtp.gmail.com",
  "port": 587,
  "username": "your-email@gmail.com",
  "sender_email": "noreply@yourcompany.com",
  "sender_name": "Your Company"
}
```

<Admonition type="note">
For detailed configuration instructions and best practices, see [Email configuration](/docs/neon-auth/email-configuration).
</Admonition>

[Try in API Reference ↗](https://api-docs.neon.tech/reference/updateneonauthemailserver)

<NeedHelp />
