---
title: Organizations
subtitle: Manage your projects and collaborate with team members
enableTableOfContents: true
updatedOn: '2025-04-25T20:26:32.193Z'
---

In Neon, all projects live within organizations. When you sign up, you automatically get a free organization for your first project. Organizations provide a central place to manage your projects, collaborate with team members, and — for paid plans — handle your billing.

## About Neon Organizations

In the Neon Console, the Organizations page provides a centralized view of all your projects. From there, you can create new projects, manage existing ones, as well as oversee your members, billing information, and access to preview features through the Early Access Program.

![organizations projects tab](/docs/manage/org_projects.png)

## User roles and permissions

Organizations have two main member roles:

- **Admin** — Administrators have full control over the organization and all its projects. They manage permissions, billing, members, and organization settings. Only Admins can delete organization projects.
- **Member** — Members have access to all organization projects and can perform most project operations, but cannot modify organization settings or delete projects.

Additionally, projects can be shared with **Project Collaborators**. These are external users with no organization-level access, but who can work with specific projects they're invited to.

For a full breakdown of what each role can do, see the [User Permissions](/docs/manage/user-permissions) page.

### Creating a new organization

To create a new org, use the **Create organzation** button in the org switcher you can find in the top navbar.

![create organization button](/docs/manage/orgs_create_button.png)

Other than the free org you signed up with, organizations are always on paid plans. When creating a new organization, you'll need to select a paid plan and enter billing details.

![create organization with billing](/docs/manage/orgs_create_with_billing.png)

After confirming, you'll be directed to your new organization's **Projects** page, where you can get started creating projects and inviting [members](/docs/manage/orgs-manage#invite-members).

## Limitations

As we continue to refine our organization features, here are some temporary limitations you should be aware of:

- **Branch management** — All users are currently able to manage [protected branches](/docs/guides/protected-branches), regardless of their role or permission level. Granular permissions for this feature are not yet implemented.
- **Permissions and roles** — The current permissions system may not meet all needs for granular control. Users are encouraged to share their feedback and requirements for more detailed permissions settings.

## Feedback

If you've got feature requests or feedback about what you'd like to see from Organizations in Neon, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.

<NeedHelp/>
