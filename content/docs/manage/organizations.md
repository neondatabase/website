---
title: Organizations
subtitle: Invite Members to your Organization and collaborate on projects
enableTableOfContents: true
updatedOn: '2024-08-06T15:23:10.957Z'
---

<EarlyAccess/>

Build your team in Neon with Organizations. Manage all of your team's projects under a single account — with billing, role management, and project transfer capabilities in one accessible location.

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

## Create an organization

To get started, click **Create organization** from the breadcrumb dropdown.

![create organization button](/docs/manage/orgs_create_button.png)

You'll be asked to select a plan and confirm your billing details. After confirming billing, you'll be directed to your organization's billing page, where you can take steps like inviting [members](/docs/manage/orgs-manage#invite-members) and [transferring projects](/docs/manage/orgs-project-transfer).

![getting started with new org](/docs/manage/orgs_create_next.png)

## What's next?

After creating the organization, your next actions depend on your particular scenario. Here are a couple example scenarios.

### Scenario 1 &#8212; Moving an existing team to a new organization

If you’re currently on a paid plan, using project sharing to work with your team on your Personal account projects, and you intend to work intend to work primarily from your new Organization account:

- [Transfer your existing projects](/docs/manage/orgs-project-transfer#transfer-projects-in-bulk) from your personal account to the new organization. You can leave one project behind, since that's the Free Plan limit.
- Downgrade your personal account to the [Free Plan](/docs/introduction/manage-billing#change-your-plan) once all projects are transferred. This shifts all billing to the Organization.
- [Invite](/docs/manage/orgs-manage#invite-members) your team members to join the organization.

### Scenario 2 &#8212; Starting a new organization from scratch

In this scenario you've been using Neon for personal projects for some time, and you now want to bring Neon to your company, but still keep your personal projects separate. You might instead:

- [Invite](/docs/manage/orgs-manage#invite-members) someone to your new organization and delegate billing to them: set their [permissions](/docs/manage/orgs-manage#set-permissions) to **Admin**. They can then revise the billing details and handle invoices for the organization.
- Start creating new projects within the new organization.
- Keep your personal projects on your existing paid plan. No need to transfer or downgrade.

## Request conversion from support

If you want us to handle this conversion for you, you can contact our [Customer Success](mailto:customer-success@neon.tech) team to request this service. We’ll manage the transition of your billing and projects to your new organization for you.

## Limitations

As we continue to refine our Organizations feature during this Early Access phase, please remember that these features are only available under paid account plans. Here are some temporary limitations you should be aware of:

- **Integration limitations** — You cannot install new Vercel integrations on organization-owned projects. However, existing integrations will continue to work on projects transferred from personal to the organization account.
- **Branch management** — All users are currently able to manage [protected branches](/docs/guides/protected-branches), regardless of their role or permission level. Granular permissions for this feature are not yet implemented.
- **Project transfer restrictions** — Currently, you cannot transfer projects using either the Vercel or the GitHub integration.
- **Permissions and roles** — The current permissions system may not meet all needs for granular control. Users are encouraged to share their feedback and requirements for more detailed permissions settings.

## Feedback

If you've got feature requests or feedback about what you'd like to see from Organizations in Neon, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.

<NeedHelp/>
