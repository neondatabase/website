---
title: Neon project transfer partner guide
subtitle: Manage Neon projects for users with the project claim API
enableTableOfContents: true
updatedOn: '2025-05-20T14:30:00.000Z'
---

## Overview

The project transfer functionality enables you to provision fully-configured Postgres databases on behalf of your users and seamlessly transition ownership. This capability eliminates the technical overhead of database setup while ensuring your users maintain complete control of their database resources.

<CTA title="Availability Status" description="This feature is available in private preview only. To enable this functionality for your account, <a href='https://neon.tech/partners#partners-apply'>contact Neon support</a>." isIntro></CTA>

## Simplified workflow

1. **Create a Neon project** on behalf of your user in your account or organization

   - This gives them a Postgres connection string for their application immediately

2. **Create a transfer request** for the project

   - This generates a unique, time-limited transfer request ID

3. **Share a claim URL** with your user

   - This URL contains the project ID and transfer request ID

4. **User claims the project**
   - When they click the URL, Neon transfers the project to their account

## Step-by-step guide

<Steps>

## Create a Neon project

Use the Neon [create project API](https://api-docs.neon.tech/reference/createproject) to create
a new project that you intend to transfer to your user.

The minimum data value is `project: {}` as all settings are optional.

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
- A default database (named `neondb` by default)
- A default database role (named `neondb_owner` by default)
- A project named `new-project-name` that the user can later change (named the project id by default)
- A project in the `org-cool-breeze-12345678` organization
- The request sets optional `pg_version` and `region_id` settings that permanently define the project's configuration

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
      "connection_uri": "postgresql://neondb_owner:password@ep-cool-shape-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  ],
  "branch": {},
  "databases": [{}],
  "endpoints": [{}],
  "operations": [{}],
  "roles": [{}]
}
```

Your user will need the connection string in the response (`connection_uri`) to [connect to the Neon database](/docs/get-started-with-neon/connect-neon), which is now ready to use. You'll also use the project `id` to later create a transfer request.

## Create a transfer request

With your project now created, use the Neon [project transfer request](https://api-docs.neon.tech/reference/createprojecttransferrequest) API to generate a transfer request. You can create this request immediately or at a later time when you're ready to transfer the project. Each transfer request has a configurable expiration period, specified by the `ttl_seconds` parameter. If a request expires before being claimed, you'll need to create a new transfer request.

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

This example sets a one-week expiration, adjust it to your needs. The default is 86400 (24 hours).

### Example response

```json
{
  "id": "389ad814-9514-1cac-bc04-2f194815db76",
  "project_id": "your-project-id",
  "created_at": "2025-05-18T19:35:23Z",
  "expires_at": "2025-05-25T19:35:23Z"
}
```

Example response if transfer requests are not enabled for the account:

```json
{
  "request_id": "cb1e1228-19f9-4904-8bd5-2dbf17d911a2",
  "code": "",
  "message": "project transfer requests are not enabled for this account"
}
```

## Share the claim URL

Construct a claim URL to share with your user.

### Claim URL format

```http
https://console.neon.tech/app/claim?p={project_id}&tr={transfer_request_id}
```

Build it using the format above, where:

- `{project_id}` is the project ID being transferred
- `{transfer_request_id}` is the transfer request `id` from the "Create a transfer request" response

When sharing the claim URL, inform your user that:

- They'll need a Neon account to claim the project, or they can follow the prompt to create a new Neon account
- They should click the link to claim ownership of the project
- After claiming, they'll see the project in their Neon account
- The database connection string will remain the same (though they should update the password)

## User claims the project

### Via browser

When your user clicks the claim URL:

1. Neon will prompt them to log in (or create an account if they don't have one)
2. After authentication, Neon will display a confirmation screen
3. If they belong to one or more organizations, they can select where to transfer the project:
   - Their personal account
   - Any organization where they have membership
4. Upon confirming, Neon transfers the project to their selected account or organization
5. They now have full ownership and control of the project

### Via API

Alternatively, users can accept the transfer request programmatically using the [accept project transfer request API](https://api-docs.neon.tech/reference/acceptprojecttransferrequest), although this requires their Neon API key.

#### API endpoint

```http
PUT https://console.neon.tech/api/v2/projects/{project_id}/transfer_requests/{request_id}
```

#### Example request (transfer to organization)

```bash
curl -X PUT 'https://console.neon.tech/api/v2/projects/{project_id}/transfer_requests/{request_id}' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your_users_api_key_here}' \
  --header 'Content-Type: application/json' \
  --data '{
    "org_id": "org-cool-breeze-12345678"
  }'
```

Neon transfers the project to the user's personal account if the `org_id` parameter is not set. If provided, Neon transfers the project to the specified organization, assuming the user has membership in that organization.

</Steps>

## Important notes

- **Expiration**: Transfer requests expire after 24 hours by default. You can customize the expiration time with the `ttl_seconds` parameter.
- **Security**: Share the claim URL securely as anyone with the URL can claim the project. Consider using secure channels or authenticated delivery methods.
- **One-time use**: You can use each transfer request only once. If it expires or you use it, you'll need to create a new one.
- **Connection strings**: After transfer, the project's connection details remain the same, but ownership changes.
- **Passwords**: For security reasons, instruct users to change their database password after claiming the project.
- **Access loss**: Once the transfer completes, you will no longer have access to the project unless the new owner grants you access.
- **Organization transfers**: Users must belong to the organization they're transferring the project to. Organization IDs follow the format `org-[descriptive-term]-[numeric-id]` (e.g., `org-cool-breeze-12345678`).

## Example use cases

- **SaaS applications**: Provision databases for your SaaS users that they can later claim and manage themselves
- **Development agencies**: Create database projects for clients that can be transferred to them when the work is complete
- **Educational platforms**: Set up pre-configured database environments for students that they can claim as their own
- **Demo environments**: Create ready-to-use demo environments that can be transferred to prospects
- **Team environments**: Create project databases that team members can claim to their organization accounts

## Troubleshooting

| Issue                                    | Solution                                                                                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Claim URL expired                        | Create a new transfer request and generate a new claim URL                                                  |
| User gets an error when claiming         | Verify the project still exists and the transfer request hasn't been used                                   |
| Project doesn't appear in user's account | Refresh the Neon Console or try logging out and back in                                                     |
| "Transfer requests not enabled" error    | [Contact Neon](https://neon.tech/partners#partners-apply) to request access to this private preview feature |
| Organization transfer fails              | Verify the user is a member of the specified organization and the `org_id` is correct                       |

## Further resources

- [Create project API](https://api-docs.neon.tech/reference/createproject)
- [Create project transfer request API](https://api-docs.neon.tech/reference/createprojecttransferrequest)
- [Accept project transfer request API](https://api-docs.neon.tech/reference/acceptprojecttransferrequest)
- [Neon API Documentation](https://neon.tech/docs/reference/api-reference)
- [Managing Projects](https://neon.tech/docs/manage/projects)
- [Managing API Keys](https://neon.tech/docs/manage/api-keys)
- [Managing Organizations](https://neon.tech/docs/manage/organizations)
