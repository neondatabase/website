---
title: Organizations (private preview)
subtitle: Invite members to your Organization and collaborate on projects
enableTableOfContents: true
---

Organizations let you work with your Neon projects as a team. By creating an organization, you can bring together members and guests, manage permissions, and organize all of your team's projects under a single umbrella.

<Admonition type="comingSoon" title="Feature Coming Soon">
Available in **private preview** for existing paid accounts by request only. To start using the Organizations feature, [request access](#request-access-to-the-private-preview) and we'll help you get set up.
</Admonition>

## What are Organizations in Neon?

Organizations are a type of paid account in Neon, separate from your personal account. Any Neon user can create an organization &#8212; or get invited to an organization &#8212; as a way of sharing projects across the multiple members that make up your team. Whether you create the organization, or you are invited to one, you keep your personal account, where you can manage personal projects independent of any organization you belong to.

From the Neon Console, you can navigate to your Organization dashboard, where you'll find all projects in the organization and various user management actions that you can take as the Admin.

![organizations projects tab](/docs/manage/org_projects.png)

### Types of users

Within each organization are three types of users:

- **Admin** &#8212; Administrators have access to all projects in the organization. In addition, admins handle all permissions and invites.
- **Members** &#8212; Members have access to all the projects that belong to the organization. They need to be invited to the organization by an Administrator.
- **Guests** &#8212; Guests are people given limited access to particular projects, using [project sharing](/docs/guides/project-sharing-guide). They do not have access to the Organization dashboard. Projects will appear under the **Shared with me** grouping in their personal account.

## Request access to the private preview

While Organization features are currently in private preview, you can't create your own organization directly. Here’s how you can request access and what to expect:

### How to Request Access

1. **Submit a Request** &#8212; Contact our [Customer Success](mailto:customer-success@neon.tech) team and ask to join the private preview for Organizations and we'll start the process.
1. **Provide Organization Details** &#8212; During the request process, you will need to tell us:

    - Your user ID.
    - Your informed consent, acknowledging that you understand the current [limitations](#feature-limitations) of the private preview.
    - Your desired organization name, which will be visible to all future members.

### What Happens Next

Once your request is processed:

1. **Project Transfer** &#8212; All existing projects in your personal account will be automatically transferred to your new organization.
1. **Admin Role** &#8212; You will be assigned as the Admin of the organization, letting you invite members to get started working together.
1. **Billing Transition** &#8212; Your existing paid plan (Launch, Scale, or Enterprise) will transfer to the organization. Any admin can manage billing details. To delegate billing management, promote a regular member to admin.
1. **Personal Account Adjustment** &#8212; Your personal account will convert to a Free Tier, allowing you to continue individual projects without affecting your organization.

We value your [feedback](#feedback-and-future-improvements) throughout this preview phase to enhance and refine the Organizations feature.

## Manage your organization

Learn how to manage your organization's projects, invite members and guests, revise permissions, and oversee billing details. This section explains which specific actions each member can take based on their assigned roles and permissions.

- [Switch to your org](#switch-to-your-organization-account)
- [Invite members](#invite-members)
- [Invite guests](#invite-guests)
- [Set permissions](#set-permissions)
- [Manage projects](#manage-projects)
- [Billing](#billing)

### Switch to Your Organization Account

Easily switch between your personal account and any organization you are a member of using the navigation breadcrumb.

![Switch between personal and organization](/docs/manage/switch_to_org.png "no-border")

### Invite Members

Only Administrators have the authority to invite new members to the organization. Invitations are issued via email. If a recipient does not have a Neon account, they will receive instructions to create one.

![organizations people tab](/docs/manage/orgs_people.png)

To invite members:

- Navigate to the **People** page in your Organization.
- Click **Invite member** and enter the email addresses in a comma-separated list.
- Monitor the status of sent invites on the **Pending Invites** page; from here, you can resend or cancel invitations as needed.

#### Set Permissions

Permissions within the organization are exclusively managed by Administrators. As an admin:

- You can promote any member to an admin, granting them full administrative privileges.
- You can demote any admin to a regular member.
- You cannot leave the organization if you are the only Admin. Promote a member to admin before you try to leave the org.

    ![organization members](/docs/manage/orgs_members_kebab.png "no-border")

### Invite Guests

Admins can also invite external guests to collaborate on specific projects through [project sharing](/docs/guides/project-sharing-guide). Guests will not have access to the organization itself but can access any projects shared with them from the **Projects** page of their personal account, under **Shared with Me**.

<Admonition type="note">
Any users you've already shared projects with will appear as guests on the Guests page if those projects were transferred during the organization conversion.
</Admonition>

![organization guests](/docs/manage/org_guests.png)

To invite new guests, click **Invite guests** and select the project you want to share, then add a comma-separated list of emails for anyone you want to give access to.

#### Manage guests

Click the kebab menu next to the row in the Guests table to manage guest access. You have two options:

- **Convert to member** — promote the guest to a full member, granting access to all projects in the organization.
- **Remove from project** — revoke the guest's access to the shared project.

    ![guests kebab](/docs/manage/orgs_guests_kebab.png "no-border")

### Manage Projects

All members can create new projects. Deleting depends on permissions and ownership.

- Any member can create a project and will automatically become that project's project owner.
- Administrators can delete any project.
- Members can only delete projects where they are the owner.

### Billing

During the private preview, your organization inherits the pricing plan from your personal account. As the admin:

- You have full access to edit all billing information.
- Promote a member to admin if you wish to delegate billing management; however, all admins will have the capability to edit billing details.
- While all members can view the billing page, only admins can make changes.

For detailed information on pricing and plans, refer to [Neon plans](/docs/introduction/plans).

## Feature limitations

As we continue to refine our Organizations feature during this private preview phase, there are some temporary limitations you should be aware of:

- **Integration Limitations** — You cannot install new Vercel integrations on organization-owned projects. However, existing integrations will continue to work on projects transferred from personal to the organization account.
- **Connection Restrictions** — Passwordless connect is not available for organization-owned projects. Users must use standard authentication methods.
- **Branch Management** — All users currently have the ability to manage [protected branches](/docs/guides/protected-branches), regardless of their role or permission level. Granular permissions for this feature are not yet implemented.
- **Project Transfer Restrictions** — Currently, transferring projects to an organization is done in bulk ("all or nothing") during the Neon-managed conversion. Selective and self-serve transfers are planned for future updates.
- **Permissions and Roles** — The current permissions system may not meet all needs for granular control. Users are encouraged to share their feedback and requirements for more detailed permissions settings.

## Feedback and future improvements

If you've got feature requests or feedback about what you'd like to see from Organizations in Neon, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.
