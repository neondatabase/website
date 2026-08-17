---
title: Organizations
subtitle: Manage your projects and collaborate with team members
summary: >-
  Neon Organizations are the top-level containers for all projects, providing
  centralized billing, member management, and access controls for teams on free
  and paid plans. Teams use organizations to collaborate across projects, assign
  organization roles, grant per-project permissions, and auto-provision users by
  verified email domain. Current limitations include all users being able to
  manage protected branches regardless of role, and per-project permissions that
  can raise a member's access but not restrict it.
enableTableOfContents: true
updatedOn: '2026-08-04T15:25:12.468Z'
---

In Neon, all projects live within organizations. When you sign up, you automatically get a free organization for your first project. Organizations provide a central place to manage your projects and collaborate with team members. You can start inviting teammates as soon as your organization is created. Paid plans also include billing management for your organization.

## About Neon Organizations

In the Neon Console, the Organizations page gives you a centralized view of all your projects. From there, you can create new projects, manage existing ones, and oversee your members and billing information.

![organizations projects tab](/docs/manage/org_projects.png)

## User roles and permissions

Access works in two layers. An organization role sets a member's baseline access across every project, and per-project permissions grant extra access on individual projects. The two are additive, so a per-project permission can only raise someone's access, never lower it.

There are four organization roles:

- **Admin**: Full control over the organization and all its projects, including billing, members, and settings.
- **Editor**: Access to all organization projects, but cannot modify org settings, delete projects, or transfer them out of the organization.
- **Viewer**: Read-only access to organization and project metadata. Cannot see connection strings or run SQL.
- **Collaborator**: No access by default. Sees only the projects they're explicitly granted.

For a full breakdown of what each role and per-project permission allows, see the [User permissions](/docs/manage/user-permissions) page. That page also explains [which roles receive certain organization emails](/docs/manage/user-permissions#email-notifications) (for example, alerts when a project is close to its storage limit).

You can also [auto-provision members by email domain](/docs/manage/orgs-add-members-by-domain) so that users whose email matches a verified domain are added to the organization automatically when they sign up or log in.

## Creating a new organization

You can create additional organizations at any time. [See how to create an organization.](/docs/manage/orgs-manage#create-an-organization)

## Limitations

As we continue to refine our organization features, here are some temporary limitations you should be aware of:

- **Branch management**: All users are currently able to manage [protected branches](/docs/guides/protected-branches), regardless of their role or permission level. Granular permissions for this feature are not yet implemented.
- **Access can only be added, not restricted**: Per-project permissions raise a member's access above their organization-role baseline; they can't reduce it. There's no way to block an Editor from a single project. To limit someone to specific projects, give them the **Collaborator** role and grant permissions on just those projects. See [Notes and limitations](/docs/manage/user-permissions#notes-and-limitations).

## Feedback

If you've got feature requests or feedback about what you'd like to see from Organizations in Neon, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.

<NeedHelp/>
