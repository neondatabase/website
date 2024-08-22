---
title: Organizations
subtitle: Invite Members to your Organization and collaborate on projects
enableTableOfContents: true
updatedOn: '2024-08-06T15:23:10.957Z'
---

<EarlyAccess/>

Build your team in Neon with Organizations. Manage all of your team's projects under a single account &#8212; with billing, role management, and project transfer capabilities in one accessible location.

## About Neon Organizations

In the Neon Console, the Organizations page provides a centralized view of all your team’s projects. From there, you can create new projects, manage existing ones, as well as oversee your organization’s members and your billing information.

![organizations projects tab](/docs/manage/org_projects.png)

### Early Access Program

Neon Organizations are currently available through our [Early Access program](https://neon.tech/early-access). Join now to start using Organizations for your team. You'll also gain access to all upcoming features, connect with the Neon team in a private community, and receive regular updates on what's coming next.

## User roles and permissions

Each organization is made up of three types of users:

- **Admin** &#8212; Administrators have access to all projects in the organization. Additionally, admins manage all permissions, invitations, and billing details.
- **Members** &#8212; Members have access to all the projects that belong to the organization. They need to be invited to the organization by an Admin.
- **Guests** &#8212; Guests are people given limited access to particular projects, using [project sharing](/docs/guides/project-sharing-guide). They do not have access to the Organization dashboard. Projects will appear under the **Shared with me** grouping in their personal account.

Here's a breakdown of what actions each role can take:

| Action                                                                                                         | Admin | Member | Guest |
| -------------------------------------------------------------------------------------------------------------- | :---: | :----: | :---: |
| [Create projects](/docs/manage/orgs-manage#manage-projects)                                                    |  ✅   |   ✅   |  ❌   |
| [Delete projects](/docs/manage/orgs-manage#manage-projects)                                                    |  ✅   |   ❌   |  ❌   |
| Invite [members](/docs/manage/orgs-manage#invite-members) and [guests](/docs/manage/orgs-manage#invite-guests) |  ✅   |   ❌   |  ❌   |
| [Set permissions](/docs/manage/orgs-manage#set-permissions)                                                    |  ✅   |   ❌   |  ❌   |
| [Manage billing](/docs/manage/orgs-manage#billing)                                                             |  ✅   |   ❌   |  ❌   |
| [Delete organization](/docs/manage/orgs-manage#delete-an-organization)                                         |  ✅   |   ❌   |  ❌   |

## Create an Organization

TBD

![Create organization](/docs/manage/orgs_create.png)

## Limitations

As we continue to refine our Organizations feature during this Early Access phase, please remember that these features are only available under paid account plans. Here are some temporary limitations you should be aware of:

- **Integration limitations** — You cannot install new Vercel integrations on organization-owned projects. However, existing integrations will continue to work on projects transferred from personal to the organization account.
- **Branch management** — All users are currently able to manage [protected branches](/docs/guides/protected-branches), regardless of their role or permission level. Granular permissions for this feature are not yet implemented.
- **Project transfer restrictions** — Currently, you cannot transfer projects using either the Vercel or the GitHub integration.
- **Permissions and roles** — The current permissions system may not meet all needs for granular control. Users are encouraged to share their feedback and requirements for more detailed permissions settings.

## Feedback

If you've got feature requests or feedback about what you'd like to see from Organizations in Neon, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.

<NeedHelp/>
