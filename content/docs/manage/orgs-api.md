---
title: Manage organizations using the Neon API
enableTableOfContents: true
updatedOn: '2025-01-06T12:48:09.585Z'
---

Learn how to manage Neon Organizations using the Neon API, including managing organization API keys, working with organization members, and handling member invitations.

## Personal vs organization API keys

You can authorize your API requests using either of these methods:

- **Organization API key**: Automatically scopes all requests to your organization
- **Personal API key**: Requires including an `org_id` parameter to specify which organization you're working with

The key difference is in how you structure your API requests. Here's an example of listing projects using both methods:

Using an organization API key:

```bash
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects' \
     --header 'authorization: Bearer $ORG_API_KEY'
```

Using a personal API key:

```bash
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects?org_id=org-example-12345678' \
     --header 'authorization: Bearer $PERSONAL_API_KEY'
```

Both examples retrieve a list of projects, but notice how the personal API key request includes `org_id=org-example-12345678` to specify which organization's projects to list. With an organization API key, this parameter isn't needed because the key itself is already tied to a specific organization.

### Matrix of operations and key types

Some operations require a personal API key from an organization admin and cannot be performed using organization API keys. These operations are marked with ❌ in the matrix below.

| Action                                                                                    | Personal API Key | Organization API Key |
| ----------------------------------------------------------------------------------------- | ---------------- | -------------------- |
| [Create an organization API key](#create-an-organization-api-key)                         | ✅               | ❌                   |
| [Get a list of organization API keys](#list-organization-api-keys)                        | ✅               | ✅                   |
| [Revoke an organization API key](#revoke-an-organization-api-key)                         | ✅               | ✅                   |
| [Get organization details](#get-organization-details)                                     | ✅               | ✅                   |
| [Get organization members details](#get-details-about-all-members)                        | ✅               | ✅                   |
| [Get organization member details](#get-details-about-an-individual-member)                | ✅               | ✅                   |
| [Update the role for an organization member](#update-the-role-for-an-organization-member) | ✅               | ✅                   |
| [Remove member from the organization](#remove-member-from-the-organization)               | ✅               | ❌                   |
| [Get organization invitation details](#get-organization-invitation-details)               | ✅               | ✅                   |
| [Create organization invitations](#create-organization-invitations)                       | ✅               | ❌                   |

## Finding your org_id

To find your organization's `org_id`, navigate to your Organization's **Settings** page, where you'll find it under the **General information** section. Copy and use this ID in your API requests.

![finding your organization ID from the settings page](/docs/manage/orgs_id.png)

## Create API keys

There are two types of organization API keys:

- **Organization API keys** — Provide admin-level access to all organization resources, including projects, members, and settings. Only organization admins can create these keys.
- **Project-scoped organization API keys** — Provide limited, member-level access to specific projects within the organization. Any organization can create a key for any organization-owned project.

The key token is only displayed once at creation time. Copy it immediately and store it securely. If lost, you’ll need to revoke the key and create a new one. For detailed instructions, see [Manage API Keys](/docs/manage/api-keys#create-an-organization-api-key).

[Try in API Reference ↗](https://api-docs.neon.tech/reference/createorgapikey)

## List API keys

Lists all API keys for your organization. The response does not include the actual key tokens, as these are only provided when creating a new key.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/organizations/{org_id}/api_keys' \
     --header 'authorization: Bearer $PERSONAL_API_KEY' | jq
```

Example response:

```json
[
  {
    "id": 123456,
    "name": "my-key-name",
    "created_at": "2024-01-01T12:00:00Z",
    "created_by": {
      "id": "user-abc123de-4567-8fab-9012-3cdef4567890",
      "name": "John Smith",
      "image": "https://avatar.example.com/user.jpg"
    },
    "last_used_at": "2024-01-01T12:30:00Z",
    "last_used_from_addr": "192.0.2.1,192.0.2.2"
  }
]
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/listorgapikeys)

## Revoke an API key

Revokes the specified organization API key. This action cannot be reversed. You can obtain the `key_id` by listing the API keys for your organization.

```bash
curl --request DELETE \
     --url 'https://console.neon.tech/api/v2/organizations/{org_id}/api_keys/{key_id}' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $PERSONAL_API_KEY' | jq
```

Example response:

```json
{
  "id": 123456,
  "name": "my-key-name",
  "created_at": "2024-01-01T12:00:00Z",
  "created_by": "user-abc123de-4567-8fab-9012-3cdef4567890",
  "last_used_at": "2024-01-01T12:30:00Z",
  "last_used_from_addr": "192.0.2.1,192.0.2.2",
  "revoked": true
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/revokeorgapikey)

## Get organization details

Retrieves information about your organization, including its name, plan, and creation date.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/organizations/{org_id}' \
     --header 'authorization: Bearer $PERSONAL_API_KEY' | jq
```

Example response:

```json
{
  "id": "org-example-12345678",
  "name": "Example Organization",
  "handle": "example-organization-org-example-12345678",
  "plan": "business",
  "created_at": "2024-01-01T12:00:00Z",
  "managed_by": "console",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/getorganization)

## List members

Lists all members in your organization. Each entry includes:

- Member ID (`id`): The unique identifier for the member
- User ID (`user_id`): The unique ID of the user's Neon account
- Organization role and join date
- User's email address

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/organizations/{org_id}/members' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY' | jq
```

Example response:

```json
{
  "members": [
    {
      "member": {
        "id": "abc123de-4567-8fab-9012-3cdef4567890",
        "user_id": "def456gh-7890-1abc-2def-3ghi4567890j",
        "org_id": "org-example-12345678",
        "role": "admin",
        "joined_at": "2024-01-01T12:00:00Z"
      },
      "user": {
        "email": "user@example.com"
      }
    }
  ]
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/getorganizationmembers)

<Admonition type="note">The member ID (`id`) from this response is needed for operations like updating roles or removing members.</Admonition>

## Get member details

Retrieves information about a specific member using their member ID (obtained from the [Get all members](#get-details-about-all-members) endpoint).

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/organizations/{org_id}/members/{member_id}' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
```

Example response:

```json
{
  "id": "abc123de-4567-8fab-9012-3cdef4567890",
  "user_id": "def456gh-7890-1abc-2def-3ghi4567890j",
  "org_id": "org-example-12345678",
  "role": "admin",
  "joined_at": "2024-01-01T12:00:00Z"
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/getorganizationmember)

## Update member role

Changes a member's current role in the organization. If using your personal API key, you need to be an admin in the organization to perform this action. Note: you cannot downgrade the role of the organization's only admin.

```bash shouldWrap
curl --request PATCH \
     --url 'https://console.neon.tech/api/v2/organizations/members/{member_id}' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY' \
     --header 'content-type: application/json' \
     --data '{"role": "admin"}' | jq
```

Example response:

```json
{
  "id": "abc123de-4567-8fab-9012-3cdef4567890",
  "user_id": "def456gh-7890-1abc-2def-3ghi4567890j",
  "org_id": "org-example-12345678",
  "role": "admin",
  "joined_at": "2024-01-01T12:00:00Z"
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/updateorganizationmember)

## Remove member

You must use your personal API key and have admin-level permissions in the organization to use this endpoint. Organization API keys are not supported.

```bash shouldWrap
curl --request DELETE \
     --url 'https://console.neon.tech/api/v2/organizations/{org_id}/members/{member_id}' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $PERSONAL_API_KEY'
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/removeorganizationmember)

## List invitations

Retrieves a list of all pending invitations for the organization.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/organizations/invitations' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY' | jq
```

Example response:

```json shouldWrap
{
  "invitations": [
    {
      "id": "abc123de-4567-8fab-9012-3cdef4567890",
      "email": "user@example.com",
      "org_id": "org-example-12345678",
      "invited_by": "def456gh-7890-1abc-2def-3ghi4567890j",
      "invited_at": "2024-01-01T12:00:00Z",
      "role": "member"
    }
  ]
}
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/getorganizationinvitations)

## Create invitations

Creates invitations for new organization members. Each invited user:

- Receives an email notification about the invitation
- If they have an existing Neon account, they automatically join as a member
- If they don't have an account yet, the email invites them to create one

You must use your personal API key and have admin-level permissions in the organization to use this endpoint. Organization API keys are not supported.

```bash shouldWrap
curl --request POST \
     --url 'https://console.neon.tech/api/v2/organizations/{org_id}/invitations' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $PERSONAL_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "invitations": [
         {
           "email": "user@example.com",
           "role": "member"
         }
       ]
     }' | jq
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/createorganizationinvitations)
