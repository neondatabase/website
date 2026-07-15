---
title: User permissions
subtitle: How organization roles and per-project permissions work in Neon
summary: >-
  Neon access has two layers. Organization roles (Admin, Editor, Viewer,
  Collaborator) set a baseline across every project, and per-project permissions
  (Can view, Can edit, Can manage) grant extra access on individual projects. The
  two layers are additive, so a permission can only raise a user's access on a
  project, never lower it.
enableTableOfContents: true
noindex: true
---

<Admonition type="important" title="Early access preview">
You're one of the first to try Neon's new permissions model. This page is shared privately for early access and isn't part of Neon's public documentation yet. The model described here is rolling out gradually, so your organization's console may not match it until the change reaches your account. Questions or feedback? Reach out to your Neon contact, we'd love to hear how this works for you.
</Admonition>

In Neon, access works in two layers. Your **organization role** sets a baseline level of access across every project in the org, and **per-project permissions** grant additional access on individual projects. This page explains how the two layers combine and what each role and permission lets you do.

This page is mainly for organization Admins, who decide who can see and change projects.

For an overview of organizations, see the [Organizations](/docs/manage/organizations) page.

## Walkthrough video

A short walkthrough video for this page is coming soon.

## How permissions work

Your organization role and any per-project permissions combine, and they're **additive**: your effective access on a project is the higher of the two. A per-project permission can only raise your access, never lower it. (Restricting access on a single project isn't supported yet. See [Notes and limitations](#notes-and-limitations).)

Access is **closed by default** for Collaborators. Without an explicit per-project grant, a project doesn't appear in a Collaborator's list at all, and Neon responds as though it doesn't exist.

### Common setups

These examples show how an organization role and per-project grants combine:

| Person         | Organization role | Per-project grant          | Effective access                                         |
| -------------- | ----------------- | -------------------------- | -------------------------------------------------------- |
| Team lead      | Admin             | None                       | Full control of the organization and every project       |
| Staff engineer | Editor            | None                       | Edit every project, but can't delete or transfer them    |
| Designer       | Viewer            | Can edit on one project    | Read-only across the org, plus full edit on that project |
| Contractor     | Collaborator      | Can edit on their projects | Access to only the granted projects, nothing else        |
| Support        | Collaborator      | Can view (temporary)       | Read-only on a single project, removed when done         |

A couple of behaviors are worth calling out:

- **Viewers can still create their own projects.** The read-only limit applies to projects a Viewer didn't create. Any organization member except a Collaborator can create a project, and whoever creates a project becomes **Can manage** on it.
- **Deleting a project is a Can manage action**, not an Admin-only one. Anyone with **Can manage** on a project, along with organization Admins, can delete it after typing the project name to confirm.

## Assign project access

Access comes down to two things: a person's organization role sets their baseline everywhere, and per-project permissions add to it where they need more.

<Steps>

## Set the organization role

Start with the organization role, which sets a person's baseline access across every project. You choose it when you invite someone from the **People** page, and you can change it there later. Match the role to how much of the organization they should see:

- **Admin**: full control over the organization and every project
- **Editor**: work in every project, but can't delete or transfer them
- **Viewer**: read-only visibility across the organization
- **Collaborator**: no access until you grant them specific projects

## Grant per-project permissions

To give someone more than their baseline on a particular project, open that project's **Project permissions** page and grant one of three levels to one or more members at once:

- **Can view**: read-only project access
- **Can edit**: connect, query, and edit project resources
- **Can manage**: manage access, settings, and the project lifecycle

Their access on that project becomes the higher of their organization role and the permission you grant, so a grant only ever adds access.

![Granting a per-project permission in the Neon console](/docs/manage/user-permissions-preview/grant-permission.png)

## Review who has access

The same **Project permissions** page lists everyone who can reach the project, with an [Inherited or explicit](#inherited-and-explicit-access) tag on each. Change or revoke an explicit grant from the more options menu (⋮) next to a person's name.

</Steps>

## Organization roles

Every member of an organization has one of four roles. Each role sets a baseline level of access on every project in the organization:

| Role         | What it can do                                                                                 | Default project access |
| ------------ | ---------------------------------------------------------------------------------------------- | ---------------------- |
| Admin        | Full control of the organization and all projects, including billing, members, and settings    | Can manage             |
| Editor       | Everything except transferring or deleting projects                                            | Can edit               |
| Viewer       | Read-only access to organization and project metadata. Can't see connection strings or run SQL | Can view               |
| Collaborator | No default access. Sees only projects they're explicitly granted                               | None                   |

The following table shows what each role can do at the organization level:

| Action                                         | Admin | Editor | Viewer | Collaborator |
| ---------------------------------------------- | :---: | :----: | :----: | :----------: |
| Manage organization members and roles          |  ✅   |   ❌   |   ❌   |      ❌      |
| Manage organization billing                    |  ✅   |   ❌   |   ❌   |      ❌      |
| Rename or delete the organization              |  ✅   |   ❌   |   ❌   |      ❌      |
| Transfer projects into or out of the org       |  ✅   |   ❌   |   ❌   |      ❌      |
| Create organization or project-scoped API keys |  ✅   |   ❌   |   ❌   |      ❌      |
| See all organization projects                  |  ✅   |   ✅   |   ✅   |      ❌      |
| Create projects                                |  ✅   |   ✅   |   ✅   |      ❌      |

Personal API keys are available to any member and are scoped to that member's own access. Only Admins can create organization or project-scoped API keys. See [Manage API keys](/docs/manage/api-keys).

## Per-project permissions

On top of your organization baseline, an admin can grant you one of three permissions on a specific project. Grant them from the project's **Settings** &rarr; **Project permissions** page, using **Grant permission**:

- **Can view**: Read-only project access.
- **Can edit**: Connect, query, and edit project resources.
- **Can manage**: Manage access, settings, and the project lifecycle.

The following table shows what each permission allows:

| Action                                                                                    | Can view | Can edit | Can manage |
| ----------------------------------------------------------------------------------------- | :------: | :------: | :--------: |
| See the project and read its metadata, branches, endpoints, databases, and Postgres roles |    ✅    |    ✅    |     ✅     |
| List snapshots and view the snapshot schedule                                             |    ✅    |    ✅    |     ✅     |
| Get connection strings and run SQL in the SQL Editor                                      |    ❌    |    ✅    |     ✅     |
| Create, edit, or delete branches, endpoints, databases, and Postgres roles                |    ❌    |    ✅    |     ✅     |
| Create, restore, delete, or reschedule snapshots                                          |    ❌    |    ✅    |     ✅     |
| Configure integrations (GitHub, Vercel, Neon Auth)                                        |    ❌    |    ✅    |     ✅     |
| Change project settings                                                                   |    ❌    |    ✅    |     ✅     |
| Manage who can access the project                                                         |    ❌    |    ❌    |     ✅     |
| Delete the project                                                                        |    ❌    |    ❌    |     ✅     |

### Inherited and explicit access (#inherited-and-explicit-access)

On a project's **Project permissions** page, access shows up in one of two ways:

- **Inherited**: Access comes from the user's organization role, not from a grant on this project. Organization Admins always appear as **Can manage** with an **Inherited** tag, because they can manage every project.
- **Explicit**: The user was granted a permission directly on this project.

When a user has both an organization-role default and an explicit grant, the higher of the two applies.

## What's changing

When your organization moves to the new model, everyone keeps the access they have today. No action is required.

- **Admins** stay **Admins**.
- **Members** become **Editors**, with the same access under the new name.
- **Project creators** become **Can manage** on the projects they created.
- **Existing shared-project access keeps working.** The older [project sharing](/docs/guides/project-collaboration-guide) feature isn't removed at launch.

The new **Collaborator** organization role is different from the older project-sharing collaborator, even though they share a name. Project sharing is being deprecated: the new Collaborator role, combined with per-project permissions, replaces it, and existing shared-project access keeps working until that transition completes. For new access, use the **Collaborator** role plus per-project permissions instead of project sharing.

## Notes and limitations (#notes-and-limitations)

- **Access can only be added, not restricted**: Per-project permissions raise a user's access above their organization-role baseline; they can't reduce it. There's currently no way to block an Editor from a single project; they keep their baseline access on all projects in the organization.
- **Feedback**: The permissions system may not meet every need for granular control. Share your feedback via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form or our [Discord feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042).
- <a id="email-notifications" aria-hidden="true"></a>**Email notifications**: For **organization-owned** projects, Neon sends **approaching maximum storage** notification emails to **organization Admins** only, not to other members. Admins are responsible for billing and plan limits at the organization level, which aligns with who can [manage organization billing](#organization-roles).

<NeedHelp/>
