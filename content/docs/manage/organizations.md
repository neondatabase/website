---
title: Organizations
subtitle: Invite Members to your Organization and collaborate on projects
enableTableOfContents: true
updatedOn: '2024-10-07T18:18:31.790Z'
---

<FeatureBeta/>

Build your team in Neon with Organizations. Manage all of your team's projects under a single account — with billing, role management, and project collaboration capabilities in one accessible location.

## About Neon Organizations

In the Neon Console, the Organizations page provides a centralized view of all your team's projects. From there, you can create new projects, manage existing ones, as well as oversee your organization's members and your billing information.

![organizations projects tab](/docs/manage/org_projects.png)

## User roles and permissions

Each organization is made up of three types of users:

- **Admin** — Administrators have access to all projects in the organization. Additionally, admins manage all permissions, invitations, and billing details.
- **Members** — Members have access to all the projects that belong to the organization. They need to be invited to the organization by an Admin.
- **Collaborators** — Collaborators are people given limited access to particular projects. See [Collaborators](/docs/guides/project-collaboration-guide). They do not have access to the Organization dashboard. Projects will appear under the **Shared with you** grouping in their personal account.

Here's a breakdown of what actions each role can take:

| Action                                                                                 | Admin | Member | Collaborator |
| -------------------------------------------------------------------------------------- | :---: | :----: | :----------: |
| [Create projects](/docs/manage/orgs-manage#create-and-delete-projects)                 |  ✅   |   ✅   |      ❌      |
| [Delete projects](/docs/manage/orgs-manage#create-and-delete-projects)                 |  ✅   |   ❌   |      ❌      |
| Manage [members](/docs/manage/orgs-manage#invite-members)                              |  ✅   |   ❌   |      ❌      |
| Manage [collaborators](/docs/manage/orgs-manage#invite-collaborators) (share projects) |  ✅   |   ✅   |      ✅      |
| [Set permissions](/docs/manage/orgs-manage#set-permissions)                            |  ✅   |   ❌   |      ❌      |
| [Manage billing](/docs/manage/orgs-manage#billing)                                     |  ✅   |   ❌   |      ❌      |
| [Delete organization](/docs/manage/orgs-manage#delete-an-organization)                 |  ✅   |   ❌   |      ❌      |

## Create an organization

<div style={{ display: 'flex', alignItems: 'top' }}>
  <div style={{ flex: '0 0 45%', paddingRight: '20px' }}>
    To get started, click **Create organization** from the breadcrumb dropdown.
  </div>
  <div style={{ flex: '0 0 55%', marginTop: '-20px' }}>
    <img src="/docs/manage/orgs_create_button.png" alt="create organization button" style={{ verticalAlign: 'middle', maxWidth: '100%' }} />
  </div>
</div>
<Tabs labels={["Free Plan","Paid plans"]}>

<TabItem>

<div style={{ display: 'flex', alignItems: 'center' }}>
  <div style={{ flex: '0 0 45%', paddingRight: '20px' }}>
    If you're on the Free Plan, you'll need to choose a paid plan for your organization (since organizations are a paid feature).

    You'll be prompted to choose to select a plan and enter billing details. After confirming, you'll be directed to your organization's billing page, where you can invite [members](/docs/manage/orgs-manage#invite-members) and [transfer projects](/docs/manage/orgs-project-transfer).  
  </div>
  <div style={{ flex: '0 0 55%', marginTop: '-20px' }}>

![getting started with new org](/docs/manage/orgs_create_next.png)
  </div>
</div>

</TabItem>

<TabItem>

<div style={{ display: 'flex', alignItems: 'top' }}>
  <div style={{ flex: '0 0 45%', paddingRight: '20px' }}>
    If you're already on a paid plan for your personal account, you'll have two options: 
    - convert your personal account to an organization
    - create a new organization from scratch.
  </div>
  <div style={{ flex: '0 0 55%', marginTop: '-20px' }}>

![convert personal account to an organization](/docs/manage/orgs_create_with_transfer.png)
  </div>
</div>

### Convert your personal account

Converting your personal account transfers all of your projects and billing to the new organization. Your personal account will switch to the Free Plan. This is a quick, one-time, one-way operation: everything in your personal account is transferred to your new organization instantly. There is no service disruption, no change to your connections, and no way to move resources back to your personal account after the conversion.

### Create a new organization

If you choose to create a new organization, you can decide which projects (if any) you want to [transfer](/docs/manage/orgs-project-transfer). First, you'll need to select a paid plan for the organization. Your personal account will remain on its current paid plan — so note that you'll be billed for both your personal and organization accounts. This option is helpful if you want to keep personal projects separate while still requiring paid features like higher allowances or additional security.

</TabItem>
</Tabs>

<Admonition type="note">
Project transfers to an organization are one-way. You cannot move organization projects back to your personal account.
</Admonition>

## What's next?

After creating the organization, your next actions depend on your particular scenario. Here are a couple of example scenarios.

### Scenario 1 — Moving an existing team to a new organization

If you're currently on a paid plan, using project collaboration to work with your team on your Personal account projects, and you intend to work primarily from your new Organization account:

- [Transfer your existing projects](/docs/manage/orgs-project-transfer#transfer-projects-in-bulk) from your personal account to the new organization. You can leave up to 10 projects behind, since that's the Free Plan limit.
- Downgrade your personal account to the [Free Plan](/docs/introduction/manage-billing#change-your-plan) once all projects are transferred. This shifts all billing to the Organization.
- [Invite](/docs/manage/orgs-manage#invite-members) your team members to join the organization.

### Scenario 2 — Starting a new organization from scratch

In this scenario you've been using Neon for personal projects for some time, and you now want to bring Neon to your company, but still keep your personal projects separate. You might instead:

- [Invite](/docs/manage/orgs-manage#invite-members) someone to your new organization and delegate billing to them: set their [permissions](/docs/manage/orgs-manage#set-permissions) to **Admin**. They can then revise the billing details and handle invoices for the organization.
- Start creating new projects within the new organization.
- Keep your personal projects on your existing paid plan. No need to transfer or downgrade.

## Limitations

As we continue to refine our organization features during this Beta phase, please remember that these features are only available under paid account plans. Here are some temporary limitations you should be aware of:

- **Integration limitations** — You cannot install new Vercel integrations on organization-owned projects.
- **Branch management** — All users are currently able to manage [protected branches](/docs/guides/protected-branches), regardless of their role or permission level. Granular permissions for this feature are not yet implemented.
- **Project transfer restrictions** — Currently, you cannot transfer projects using either the Vercel, Outerbase, or the GitHub integrations.
- **Permissions and roles** — The current permissions system may not meet all needs for granular control. Users are encouraged to share their feedback and requirements for more detailed permissions settings.

## Feedback

If you've got feature requests or feedback about what you'd like to see from Organizations in Neon, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.

<NeedHelp/>
