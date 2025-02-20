---
title: Manage Neon Auth using the API
enableTableOfContents: true
---

Learn how to manage your Neon Auth integration using the Neon API. Create a new integration, add users, and claim ownership of your Neon-managed auth project to your auth provider.

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
- Your main branch ID. Get it from the Neon Console on the **Branches** page, or use the [List Branches endpoint](https://api-docs.neon.tech/reference/listprojectbranches) (look for `"default": true`)
- Your database name and role name. Get them from the **Connect** tab in the Neon Console, or use the [List Databases endpoint](https://api-docs.neon.tech/reference/listprojectbranches)
</Admonition>

Required parameters:
- `project_id`: Your Neon project ID
- `branch_id`: Your project's main branch ID
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

[Try in API Reference ↗](https://api-docs.neon.tech/reference/createProjectIdentityIntegration)

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

[Try in API Reference ↗](https://api-docs.neon.tech/reference/listProjectIdentityIntegrations)

## Create users

Creates a new user in your auth provider's system.

Required parameters:
- `project_id`: Your Neon project ID
- `auth_provider`: The authentication provider (currently `"stack"`)
- `email`: User's email address
- `password`: User's password

```bash shouldWrap
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/auth/user' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "project_id": "project-id",
       "auth_provider": "stack",
       "email": "user@example.com",
       "password": "secure-password"
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

[Try in API Reference ↗](https://api-docs.neon.tech/reference/createProjectIdentityNewUser)

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
After transfer, you'll still be able to access your project from the Neon dashboard, but you'll also have direct access from the Stack Auth dashboard.
</Admonition>

## Delete integration

Removes an integration with a specific auth provider.

```bash shouldWrap
curl --request DELETE \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/auth/integration/{auth_provider}' \
     --header 'authorization: Bearer $NEON_API_KEY' | jq
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/deleteProjectIdentityIntegration)
