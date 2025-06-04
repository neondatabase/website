---
title: Claimable database integration guide
subtitle: Manage Neon projects for users with the project database claim API
enableTableOfContents: true
updatedOn: '2025-05-30T16:54:40.495Z'
---

## Overview

The project transfer functionality enables you to provision fully-configured Postgres databases on behalf of your users and seamlessly transition ownership. This capability eliminates the technical overhead of database setup while ensuring your users maintain complete control of their database resources.

<CTA title="Availability Status" description="This feature is available in private preview only. To enable this functionality for your account, <a href='https://neon.com/partners#partners-apply'>contact our partnership team</a>." isIntro></CTA>

## Simplified workflow

1. **Create a Neon project** on behalf of your user in your account or organization

   - This provides them with a Postgres connection string for their application immediately

2. **Create a transfer request** for the project

   - This generates a unique, time-limited transfer request ID

3. **Share a claim URL** with your user

   - This URL contains the project ID and transfer request ID

4. **User claims the project**

   - When they click the URL, Neon transfers the project to their account

## Step-by-step guide

<Steps>

## Create a Neon project

Use the Neon [create project API](https://api-docs.neon.tech/reference/createproject) to create a new project that you intend to transfer to your user.

The minimum request body is `project: {}` as all settings are optional.

### API endpoint

```http
POST https://console.neon.tech/api/v2/projects
```

### Example request

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your_api_key_here}' \
  --header 'Content-Type: application/json' \
  --data '{
    "project": {
      "name": "new-project-name",
      "region_id": "aws-us-east-1",
      "pg_version": 17,
      "org_id": "org-cool-breeze-12345678"
    }
  }'
```

This creates a new project with:

- A default branch named `main`
- A default database named `neondb`
- A default database role named `neondb_owner`
- A project named `new-project-name` (defaults to the project ID if not specified)
- The project in the `org-cool-breeze-12345678` organization
- PostgreSQL version 17 in the `aws-us-east-1` region (these settings are permanent)

### Example response

Below is an abbreviated example of the response. For brevity, this documentation shows only key fields. For the complete response structure and all possible fields, see the [API documentation](https://api-docs.neon.tech/reference/createproject).

```json
{
  "project": {
    "id": "your-project-id",
    "name": "new-project-name",
    "owner_id": "org-the-owner-id",
    "org_id": "org-the-owner-id"
  },
  "connection_uris": [
    {
      "connection_uri": "postgresql://neondb_owner:{password}@ep-cool-shape-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  ],
  "branch": {},
  "databases": [{}],
  "endpoints": [{}],
  "operations": [{}],
  "roles": [{}]
}
```

Your user will need the connection string from the response (`connection_uri`) to [connect to the Neon database](/docs/get-started-with-neon/connect-neon). The `{password}` placeholder represents the actual password generated for the database. You'll also use the project `id` to create a transfer request.

## Create a transfer request

With your project created, use the Neon [project transfer request API](https://api-docs.neon.tech/reference/createprojecttransferrequest) to generate a transfer request. You can create this request immediately or at a later time when you're ready to transfer the project. Each transfer request has a configurable expiration period, specified by the `ttl_seconds` parameter.

### API endpoint

```http
POST https://console.neon.tech/api/v2/projects/{project_id}/transfer_requests
```

### Example request

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/transfer_requests' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your_api_key_here}' \
  --header 'Content-Type: application/json' \
  --data '{
    "ttl_seconds": 604800
  }'
```

This example sets a one-week expiration (604,800 seconds). The default is 86,400 seconds (24 hours).

### Example response

```json
{
  "id": "389ad814-9514-1cac-bc04-2f194815db76",
  "project_id": "your-project-id",
  "created_at": "2025-05-18T19:35:23Z",
  "expires_at": "2025-05-25T19:35:23Z"
}
```

If transfer requests are not enabled for your account, you'll receive:

```json
{
  "request_id": "cb1e1228-19f9-4904-8bd5-2dbf17d911a2",
  "code": "",
  "message": "project transfer requests are not enabled for this account"
}
```

## Share the claim URL

Construct a claim URL to share with your user using the following format:

```http
https://console.neon.tech/app/claim?p={project_id}&tr={transfer_request_id}&ru={redirect_url}
```

Where:

- `p={project_id}` - The project ID being transferred
- `tr={transfer_request_id}` - The transfer request `id` from the previous step
- `ru={redirect_url}` (optional) - A URL-encoded destination where the user is redirected after successfully claiming the project
  - Without this parameter, users remain on the Neon project page after claiming
  - This allows your application to detect successful claims when users return to your site, enabling you to trigger next steps in your onboarding flow

### User communication

When sharing the claim URL, inform your user that:

- They'll need a Neon account to claim the project (they can create one during the claim process)
- The link will expire at the time shown in the `expires_at` field
- After claiming, they'll have full ownership of the project
- The database connection string remains unchanged (though they should update the password for security)

## User claims the project

### Via browser (recommended)

When your user clicks the claim URL:

1. Neon prompts them to log in or create an account
2. After authentication, Neon displays a confirmation screen
3. If they belong to organizations, they can select the destination:
   - Their personal account
   - Any organization where they have membership
4. Upon confirmation, Neon transfers the project
5. The user is then:
   - Redirected to your application if `ru` parameter was provided, allowing you to detect the successful claim and continue your onboarding flow
   - Kept on the Neon project page if no redirect URL was specified

### Via API

Alternatively, users can accept the transfer request programmatically using the [accept project transfer request API](https://api-docs.neon.tech/reference/acceptprojecttransferrequest).

#### API endpoint

```http
PUT https://console.neon.tech/api/v2/projects/{project_id}/transfer_requests/{request_id}
```

#### Example request (transfer to organization)

```bash
curl -X PUT 'https://console.neon.tech/api/v2/projects/{project_id}/transfer_requests/{request_id}' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {users_api_key_here}' \
  --header 'Content-Type: application/json' \
  --data '{
    "org_id": "org-cool-breeze-12345678"
  }'
```

Without the `org_id` parameter, the project transfers to the user's personal account. With it, the project transfers to the specified organization where the user has membership.

</Steps>

## Important notes

### Transfer request behavior

- **Expiration**: Requests expire after the specified `ttl_seconds` (default: 24 hours). Once expired, you must create a new transfer request
- **One-time use**: Each transfer request can only be used once
- **Already claimed**: If a project has already been claimed, subsequent attempts will fail with an error

### Security considerations

- **URL security**: Share claim URLs through secure channels as anyone with the URL can claim the project
- **Password rotation**: Instruct users to change their database password immediately after claiming
- **Access revocation**: Once transferred, you lose all access to the project unless the new owner grants permissions

### Technical details

- **Connection persistence**: Database connection strings remain valid after transfer
- **Organization transfers**: Users must be members of the target organization
- **Organization ID format**: `org-[descriptive-term]-[numeric-id]` (e.g., `org-cool-breeze-12345678`)

## Example use cases

- **SaaS applications** - Provision databases for your SaaS users that they can later claim and manage
- **Development agencies** - Create database projects for clients and transfer ownership upon project completion
- **Educational platforms** - Set up pre-configured database environments for students
- **Demo environments** - Create ready-to-use demo databases that prospects can claim
- **Team environments** - Provision project databases for team members to claim into their organization

For a working implementation of claimable databases, try [Neon Launchpad](https://neon.new/). This service demonstrates the complete flow: users receive a Postgres connection string immediately without creating an account, and databases remain active for 72 hours. To retain the database beyond this period, users claim it by creating a Neon account using the provided transfer URL. See the [Neon Launchpad documentation](/docs/reference/neon-launchpad) for implementation details. This same pattern enables SaaS providers to offer instant database provisioning while allowing users to take ownership when ready.

## Troubleshooting

| Issue                                 | Solution                                                                                        |
| ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Claim URL expired                     | Create a new transfer request and generate a new claim URL                                      |
| User receives error when claiming     | Verify the project exists and the transfer request hasn't been used                             |
| Project doesn't appear after claiming | Refresh the Neon Console or log out and back in                                                 |
| "Transfer requests not enabled" error | [Contact our partnership team](/partners#partners-apply) to enable this private preview feature |
| Organization transfer fails           | Verify user membership in the target organization and correct `org_id` format                   |
| Already claimed error                 | The transfer request has been used; create a new one if needed                                  |

## Further resources

- [Create project API reference](https://api-docs.neon.tech/reference/createproject)
- [Create project transfer request API reference](https://api-docs.neon.tech/reference/createprojecttransferrequest)
- [Accept project transfer request API reference](https://api-docs.neon.tech/reference/acceptprojecttransferrequest)
- [Neon API documentation](/docs/reference/api-reference)
- [Managing projects](/docs/manage/projects)
- [Managing API keys](/docs/manage/api-keys)
- [Managing organizations](/docs/manage/organizations)
