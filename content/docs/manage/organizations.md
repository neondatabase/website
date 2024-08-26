---
title: Organizations (private preview)
subtitle: Invite Members to your Organization and collaborate on projects
enableTableOfContents: true
updatedOn: '2024-08-06T15:23:10.957Z'
---

Organizations let you work with your Neon projects as a team. By creating an organization, you can bring together Members and Guests, manage permissions, and organize all of your team's projects under a single umbrella.

<Admonition type="comingSoon" title="Feature Coming Soon">
Available in **private preview** for existing **paid accounts only**. To start using the Organizations feature, [request access](#request-access-to-the-private-preview) and we'll help you get set up.
</Admonition>

## What are Organizations in Neon?

There are two account types available in Neon:

- **Personal account**
- **Organization account**

Any Neon user with a **paid personal account** can request an Organization account, which allows for sharing projects across the various members that make up your team. Whether you create an organization or are invited to join one, you retain your personal account, letting you manage personal projects independently of any organizations you belong to.

From the Neon Console, you can navigate to your Organization dashboard, where you'll find all projects in the organization and various user management actions that you can take as the Admin.

![organizations projects tab](/docs/manage/org_projects.png)

### Types of users

Within each organization are three types of users:

- **Admin** &#8212; Administrators have access to all projects in the organization. Additionally, admins manage all permissions, invitations, and billing details.
- **Members** &#8212; Members have access to all the projects that belong to the organization. They need to be invited to the organization by an Admin.
- **Guests** &#8212; Guests are people given limited access to particular projects, using [project sharing](/docs/guides/project-sharing-guide). They do not have access to the Organization dashboard. Projects will appear under the **Shared with me** grouping in their personal account.

## Request access to the private preview

During the private preview, direct creation of your own organization is not available. This feature is exclusively available to users with **paid Neon accounts**. Here’s how you can request a new Organization and what to expect:

### How to request access

1. **Submit a Request** &#8212; Contact our [Customer Success](mailto:customer-success@neon.tech) team and ask to join the private preview for Organizations and we'll start the process.
1. **Provide Organization Details** &#8212; During the request process, you will be asked to provide:

   - The email of the Neon account you would like to designate as the Organization Admin.
   - The name of your new Organization as it will appear for all Members in the Neon Console.
   - Your informed consent, acknowledging that you understand the current [limitations](#feature-limitations) of the private preview.

### What happens next

Once your request is processed:

1. **Project Transfer** &#8212; All existing projects in your personal account will be automatically transferred to your new organization.
1. **Admin Role** &#8212; You will be assigned as the Admin of the organization, letting you invite Members to get started working together.
1. **Billing Transition** &#8212; Your existing paid plan (Launch, Scale, or Enterprise) will transfer to the organization. Any Admin can manage billing details. To delegate billing management, promote a regular Member to Admin.
1. **Personal Account Adjustment** &#8212; Your personal account will convert to a Free Plan, allowing you to continue individual projects without affecting your organization.

We value your [feedback](#feedback-and-future-improvements) throughout this preview phase to enhance and refine the Organizations feature.

## Manage your organization

Learn how to manage your organization's projects, invite Members and Guests, revise permissions, and oversee billing details. This section explains which specific actions each Member can take based on their assigned roles and permissions.

- [Switch to your org](#switch-to-your-organization-account)
- [Invite Members](#invite-members)
- [Invite Guests](#invite-guests)
- [Set permissions](#set-permissions)
- [Manage projects](#manage-projects)
- [Passwordless authentication](#passwordless-authentication)
- [Billing](#billing)

### Switch to your Organization account

Easily switch between your personal account and any organization you are a Member of using the navigation breadcrumb.

![Switch between personal and organization](/docs/manage/switch_to_org.png 'no-border')

### Invite Members

Only Admins have the authority to invite new Members to the organization. Invitations are issued via email. If a recipient does not have a Neon account, they will receive instructions to create one.

![organizations people tab](/docs/manage/orgs_people.png)

To invite Members:

- Navigate to the **People** page in your Organization.
- Click **Invite member** and enter the email addresses in a comma-separated list.
- Monitor the status of sent invites on the **Pending Invites** page; from here, you can resend or cancel invitations as needed.

#### Set permissions

Permissions within the organization are exclusively managed by Admins. As an Admin:

- You can promote any Member to an Admin, granting them full administrative privileges.
- You can demote any admin to a regular Member.
- You cannot leave the organization if you are the only Admin. Promote a Member to Admin before you try to leave the org.

  ![organization members](/docs/manage/orgs_members_kebab.png 'no-border')

### Invite Guests

Admins can also invite external Guests to collaborate on specific projects through [project sharing](/docs/guides/project-sharing-guide). Guests will not have access to the organization itself but can access any projects shared with them from the **Projects** page of their personal account, under **Shared with Me**.

<Admonition type="note">
Any users you've already shared projects with will appear as Guests on the **Guests** page if those projects were transferred during the organization conversion.
</Admonition>

![organization guests](/docs/manage/org_guests.png)

To invite new Guests, click **Invite guests** and select the project you want to share, then add a comma-separated list of emails for anyone you want to give access to.

#### Manage Guests

Click the kebab menu next to the row in the **Guests** table to manage Guest access. You have two options:

- **Convert to member** — promote the Guest to a full Member, granting access to all projects in the organization.
- **Remove from project** — revoke the Guest's access to the shared project.

  ![guests kebab](/docs/manage/orgs_guests_kebab.png 'no-border')

### Manage projects

All Members can create new projects from the Organization's **Projects** page; however, the organization itself retains ownership of these projects, not the individual user.

Members have different capabilities based on their roles:

- Any Member can create a project under the organization's ownership.
- Members cannot delete projects owned by the organization. They can only delete personal projects from their personal account (switch to personal account via breadcrumb).
- Admins can delete any project within the organization.

### Passwordless authentication

If you want the simplest way to connect to your database from the command line, passwordless authentication using `pg.neon.tech` lets you directly start a `psql` connection with any of your organization's databases. This saves you time versus logging in to the Console and copying your connection string manually.

```bash
   psql -h pg.neon.tech
```

In the output, you'll get a URL you can paste into your browser. Log in if you need to. Or if you're already logged in, you'll be asked to select from your personal or organization account, select your project, and then your compute. After that, go back to your terminal and you'll be connected to your selected database.

For example:

```bash
alexlopez@alex-machine ~ % psql -h pg.neon.tech
NOTICE:  Welcome to Neon!
Authenticate by visiting:
    https://console.neon.tech/psql_session/secure_token

NOTICE:  Connecting to database.
psql (16.1, server 16.3)
SSL connection (secure connection details hidden)
Type "help" for help.

alexlopez=>
```

### Billing

On creating an organization, your existing paid plan (Launch, Scale, or Enterprise) will be transferred to the new organization account. Following the conversion, your personal account will switch to the Free Plan, letting you manage any new personal projects separately.

As the Admin for the organization account:

- You have full access to edit all billing information.
- Promote a Member to Admin if you want to delegate billing management; however, all Admins will have the capability to edit billing details.
- While all Members can view the **Billing** page, only admins can make changes.

For detailed information on pricing and plans, refer to [Neon plans](/docs/introduction/plans).

## Managing projects using the Neon API

In the Neon API, the `org_id` represents the unique identifier for your organization. Use this ID to manage and interact with your organization's projects, making sure that your API requests are scoped to the right organization.

When creating a new project, include `org_id` in your `POST` request to ensure the project gets associated with your organization. Otherwise, the project will be created under your personal account.

You can also use the `org_id` parameter in `GET` requests to:

- List all projects that belong to your organization
- Get consumption metrics for your organization
- List of all organizations that you belong to (via your personal account)

### Finding your org_id

While you can't get your `org_id` directly in the Neon Console (it's not yet available during private preview), if you navigate to your organization, you can find the ID in the console URL:

![org ID in console URL](/docs/manage/org_id_URL.png)

<Admonition type="tip">
To help you identify organization IDs more easily, notice that they all start with the prefix `org`.
</Admonition>

### API key

Currently, while still in private preview, you can’t generate organization-specific API keys. Instead, use your personal account API key. If you’re a member of the specified `org_id`, these API requests will work.

### Creating a new project

To create a new project and ensure it gets associated with your organization, include `org_id` in your `POST` request. Here we'll create a new project for the organization `org-ocean-art-12345678`.

```bash shouldWrap
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "project": {
    "pg_version": 16,
    "org_id": "org-ocean-art-12345678"
  }
}
'
```

### Listing projects

Include `org_id` in the `GET /projects` request. For example, let's get a list of all projects for the organization `org-ocean-art-12345678`, with the default limit of 10 projects per return:

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects?limit=10&org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

### Consumption metrics

You can use the Neon API to retrieve three types of consumption metrics for your organization:

| Metric                                                                                           | Description                                                                              | Plan Availability |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ----------------- |
| [Account-level](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount)            | Total usage across all projects in your organization                                     | Scale and Business plans only   |
| [Project-level](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject) (granular) | Project-level metrics available at hourly, daily, or monthly level of granularity        | Scale and Business plans only   |
| [Project-level](https://api-docs.neon.tech/reference/listprojectsconsumption) (billing period)   | Consumption metrics for each project in your Organization for the current billing period | All plans         |

#### Account-level metrics

To get global totals for all projects in the organization `org-ocean-art-12345678`, include the `org_id` in the `GET /consumption/projects` request. We also need to include:

- A start date
- An end date
- A level of granularity

In this case, we're asking for hourly metrics between June 30th and July 2nd, 2024.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/account?from=2024-06-30T15%3A30%3A00Z&to=2024-07-02T15%3A30%3A00Z&granularity=hourly&org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
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

#### Project-level metrics (granular)

You can also get similar daily, hourly, or monthly metrics across a selected time period, but broken out for each individual project that belongs to your organization.

Using the endpoint `GET /consumption_history/projects`, let's use the same start date, end date, and level of granularity as our account-level request: hourly metrics between June 30th and July 2nd, 2024.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/projects?limit=10&from=2024-06-30T00%3A00%3A00Z&to=2024-07-02T00%3A00%3A00Z&granularity=hourly&org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
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

#### Project-level metrics (for the current billing period)

To get basic billing period-based consumption metrics for each project in the organization `org-ocean-art-12345678`, include `org_id` in the `GET /projects` request for consumption metrics:

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects?org_id=org-ocean-art-12345678' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

See more details about using this endpoint on the [Manage billing with consumption limits](/docs/guides/partner-billing#retrieving-metrics-for-all-projects) page in our Partner Guide.

### List all organizations you belong to

You can use the `GET /users/me/organizations` request to retrieve a list of all organizations associated with your personal account.

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/users/me/organizations' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
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

## Managing organizations using the Neon CLI

During private preview, we'll be continuing to add options for managing your organization using the Neon CLI. For now, we've added the main command `neonctl orgs` with a single subcommand `list`, which outputs a list of all organizations that the CLI user currently belongs to.

Example:

```bash
neon orgs list
Organizations
┌────────────────────────┬──────────────────┐
│ Id                     │ Name             │
├────────────────────────┼──────────────────┤
│ org-ocean-art-12345678 │ Example Org      │
└────────────────────────┴──────────────────┘
```

For more detail, see [Neon CLI commands - orgs](/docs/reference/cli-orgs). We'll update this page as new management options become available.

## Feature limitations

As we continue to refine our Organizations feature during this private preview phase, please remember that these features are only available under paid account plans. Here are some temporary limitations you should be aware of:

- **Integration limitations** — You cannot install new Vercel integrations on organization-owned projects. However, existing integrations will continue to work on projects transferred from personal to the organization account.
- **Connection restrictions** — Passwordless connect is not available for organization-owned projects. Users must use standard authentication methods.
- **Branch management** — All users are currently able to manage [protected branches](/docs/guides/protected-branches), regardless of their role or permission level. Granular permissions for this feature are not yet implemented.
- **Project transfer restrictions** — Currently, transferring projects to an organization is done in bulk ("all or nothing") during the Neon-managed conversion. Selective and self-serve transfers are planned for future updates.
- **Permissions and roles** — The current permissions system may not meet all needs for granular control. Users are encouraged to share their feedback and requirements for more detailed permissions settings.

## Feedback and future improvements

If you've got feature requests or feedback about what you'd like to see from Organizations in Neon, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.
