---
title: Manage Organizations using the Neon API
enableTableOfContents: true
updatedOn: '2024-09-19T14:13:04.117Z'
---

<FeatureBeta/>

Learn how to manage Neon Organizations using the Neon API, including creating and using organization-specific API keys, creating projects, transferring projects, and retrieving consumption metrics.

You can authenticate your API requests using either of these methods:

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

## Finding your org_id

To find your organization's `org_id`, navigate to your Organization's **Settings** page, where you'll find it under the **General information** section. Copy and use this ID in your API requests.

![finding your organization ID from the settings page](/docs/manage/orgs_id.png)

## Creating API keys

Only admins can create API keys for the organization. These keys provide admin-level access to all organization resources, including projects, members, and billing information. These are **user-independent** — they are not tied to a specific user. If any user leaves the organization, including the admin who created the API key, the API key remains active.

To create a new key, go to your organization’s settings and click the **Create new API key** button in the API keys section.

![creating an api key from the console](/docs/manage/org_api_keys.png)

## Organization management actions

The following examples use the **organization API key** for authentication. If you're using a **personal API key**, you'll need to include the `org_id` parameter to specify which organization you're working with.

### Get organization details

Retrieves information about your organization, including its name, plan, and creation date.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/organizations' \
     --header 'authorization: Bearer $ORG_API_KEY'
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

### Get details about all members

Lists all members in your organization. Each entry includes:

- Member ID (`id`): The unique identifier for the member
- User ID (`user_id`): The unique ID of the user's Neon account
- Organization role and join date
- User's email address

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/organizations/{org_id}/members' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
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

### Get details about an individual member

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

### Update the role for an organization member

Changes a member's current role in the organization. If using your personal API key, you need to be an admin in the organization to perform this action. Note: you cannot downgrade the role of the organization's only admin.

```bash shouldWrap
curl --request PATCH \
     --url 'https://console.neon.tech/api/v2/organizations/members/{member_id}' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY' \
     --header 'content-type: application/json' \
     --data '{"role": "admin"}'
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

### Remove member from the organization

If using your personal API key, you need to be an admin in the organization to perform this action.

```bash shouldWrap
curl --request DELETE \
     --url 'https://console.neon.tech/api/v2/organizations/members/{member_id}' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/removeorganizationmember)

### Get organization invitation details

Retrieves a list of all pending invitations for the organization.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/organizations/invitations' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
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

### Create organization invitations

Creates invitations for new organization members. Each invited user:

- Receives an email notification about the invitation
- If they have an existing Neon account, they automatically join as a member
- If they don't have an account yet, the email invites them to create one

```bash shouldWrap
curl --request POST \
     --url 'https://console.neon.tech/api/v2/organizations/invitations' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "invitations": [
         {
           "email": "user@example.com",
           "role": "member"
         }
       ]
     }'
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/createorganizationinvitations)

## General project actions

These endpoints support both Organization API key and Personal API key authentication. If using a Personal API key, you need to include the `org_id` parameter to specify which organization you're working with.

The following examples use the **Organization API key** method.

### Creating projects

Creates a new project within your organization. You can specify:

- Postgres version
- Project name (optional)
- Region (optional)

```bash shouldWrap
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "project": {
    "pg_version": 16
  }
}
'
```

[Try in API Reference ↗](https://api-docs.neon.tech/reference/createproject)

### Listing projects

Lists all projects belonging to your organization, with a default limit of 10 projects per return:

```bash
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects?limit=10' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
```

### Transfer projects

The Project Transfer API allows you to transfer projects from your personal Neon account to a specified organization account. See [Transfer projects via API](/docs/manage/orgs-project-transfer#transfer-projects-via-api) for details.

## Consumption metrics

You can use the Neon API to retrieve three types of consumption metrics for your organization:

<Admonition type="note">
Some metrics are only available on specific plans. Check the "Plan Availability" column for details.
</Admonition>

| Metric                                                                                           | Description                                                                              | Plan Availability |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ----------------- |
| [Account-level](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount)            | Total usage across all projects in your organization                                     | Scale plan only   |
| [Project-level](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) (granular) | Project-level metrics available at hourly, daily, or monthly level of granularity        | Scale plan only   |
| [Project-level](https://api-docs.neon.tech/reference/listprojectsconsumption) (billing period)   | Consumption metrics for each project in your Organization for the current billing period | All plans         |

### Account-level metrics

To get global totals for all projects in the organization `org-ocean-art-12345678`, include the `org_id` in the `GET /consumption/projects` request. We also need to include:

- A start date
- An end date
- A level of granularity

In this case, we're asking for hourly metrics between June 30th and July 2nd, 2024.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/account?from=2024-06-30T15%3A30%3A00Z&to=2024-07-02T15%3A30%3A00Z&granularity=hourly&org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
```

The response will provide aggregated hourly consumption metrics, including active time, compute time, written data, and synthetic storage size, for each hour between June 30 and July 2.

<details>
<summary>Response</summary>

```json
{
  "periods": [
    {
      "period_id": "random-period-abcdef",
      "consumption": [
        {
          "timeframe_start": "2024-06-30T15:00:00Z",
          "timeframe_end": "2024-06-30T16:00:00Z",
          "active_time_seconds": 147452,
          "compute_time_seconds": 43215,
          "written_data_bytes": 111777920,
          "synthetic_storage_size_bytes": 41371988928
        },
        {
          "timeframe_start": "2024-06-30T16:00:00Z",
          "timeframe_end": "2024-06-30T17:00:00Z",
          "active_time_seconds": 147468,
          "compute_time_seconds": 43223,
          "written_data_bytes": 110483584,
          "synthetic_storage_size_bytes": 41467955616
        }
        // ... More consumption data
      ]
    },
    {
      "period_id": "random-period-ghijkl",
      "consumption": [
        {
          "timeframe_start": "2024-07-01T00:00:00Z",
          "timeframe_end": "2024-07-01T01:00:00Z",
          "active_time_seconds": 145672,
          "compute_time_seconds": 42691,
          "written_data_bytes": 115110912,
          "synthetic_storage_size_bytes": 42194712672
        },
        {
          "timeframe_start": "2024-07-01T01:00:00Z",
          "timeframe_end": "2024-07-01T02:00:00Z",
          "active_time_seconds": 147464,
          "compute_time_seconds": 43193,
          "written_data_bytes": 110078200,
          "synthetic_storage_size_bytes": 42291858520
        }
        // ... More consumption data
      ]
    }
    // ... More periods
  ]
}
```

</details>

### Project-level metrics (granular)

You can also get similar daily, hourly, or monthly metrics across a selected time period, but broken out for each individual project that belongs to your organization.

Using the endpoint `GET /consumption_history/projects`, let's use the same start date, end date, and level of granularity as our account-level request: hourly metrics between June 30th and July 2nd, 2024.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/projects?limit=10&from=2024-06-30T00%3A00%3A00Z&to=2024-07-02T00%3A00%3A00Z&granularity=hourly&org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
```

<details>
<summary>Response</summary>

```json shouldWrap
{
  "projects": [
    {
      "project_id": "random-project-123456",
      "periods": [
        {
          "period_id": "random-period-abcdef",
          "consumption": [
            {
              "timeframe_start": "2024-06-30T00:00:00Z",
              "timeframe_end": "2024-06-30T01:00:00Z",
              "active_time_seconds": 147472,
              "compute_time_seconds": 43222,
              "written_data_bytes": 112730864,
              "synthetic_storage_size_bytes": 37000959232
            },
            {
              "timeframe_start": "2024-07-01T00:00:00Z",
              "timeframe_end": "2024-07-01T01:00:00Z",
              "active_time_seconds": 1792,
              "compute_time_seconds": 533,
              "written_data_bytes": 0,
              "synthetic_storage_size_bytes": 0
            }
            // ... More consumption data
          ]
        },
        {
          "period_id": "random-period-ghijkl",
          "consumption": [
            {
              "timeframe_start": "2024-07-01T09:00:00Z",
              "timeframe_end": "2024-07-01T10:00:00Z",
              "active_time_seconds": 150924,
              "compute_time_seconds": 44108,
              "written_data_bytes": 114912552,
              "synthetic_storage_size_bytes": 36593552376
            }
            // ... More consumption data
          ]
        }
        // ... More periods
      ]
    }
    // ... More projects
  ]
}
```

</details>

### Project-level metrics (for the current billing period)

To get basic billing period-based consumption metrics for each project in the organization `org-ocean-art-12345678`, include `org_id` in the `GET /projects` request for consumption metrics:

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects?org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
```

See more details about using this endpoint on the [Manage billing with consumption limits](/docs/guides/partner-billing#retrieving-metrics-for-all-projects) page in our Partner Guide.

## List all organizations you belong to

You can use the `GET /users/me/organizations` request to retrieve a list of all organizations associated with your personal account.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/users/me/organizations' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $ORG_API_KEY'
```

The response will include details about each organization, including the `org_id`, name, and creation date.

### Example Response

```json
{
  "organizations": [
    {
      "id": "org-morning-bread-81040908",
      "name": "Morning Bread Organization",
      "created_at": "2022-11-23T17:42:25Z",
      "updated_at": "2022-12-04T02:39:25Z"
    },
    ...
  ]
}
```
