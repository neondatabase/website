---
title: User Permissions
subtitle: What each role can do in Neon organizations
enableTableOfContents: true
---

In Neon, roles determine what actions you can take within an organization and its projects. This page provides a detailed breakdown of permissions for each role: **Admin**, **Member**, and **Collaborator**.

For an overview of organizations, see the [Organizations](/docs/manage/organizations) page.

## Role descriptions

- **Admin** — Full control over the organization and all its projects. Can manage permissions, billing, members, and organization settings. Only Admins can delete organization projects.
- **Member** — Access to all organization projects and can perform most project operations, but cannot modify organization settings or delete projects.
- **Collaborator** — External users invited to specific projects. Collaborators have no organization-level access, but can work on projects they've been invited to.

<Steps>

## Organization management

The following table shows what each role can do at the organization level:

| Action                                   | Admin | Member | Collaborator |
| ---------------------------------------- | :---: | :----: | :----------: |
| Invite organization members              |  ✅   |   ❌   |      ❌      |
| Set organization permissions             |  ✅   |   ❌   |      ❌      |
| Manage organization billing              |  ✅   |   ❌   |      ❌      |
| Rename organization                      |  ✅   |   ❌   |      ❌      |
| Delete organization                      |  ✅   |   ❌   |      ❌      |
| Enable organization Early Access Program |  ✅   |   ❌   |      ❌      |

## Project management

The following table shows what each role can do at the project level:

| Action                       | Admin | Member | Collaborator |
| ---------------------------- | :---: | :----: | :----------: |
| Create new projects          |  ✅   |   ✅   |      ❌      |
| Rename projects              |  ✅   |   ✅   |      ✅      |
| Transfer projects into org   |  ✅   |   ✅   |      ❌      |
| Transfer projects out of org |  ✅   |   ❌   |      ❌      |
| Delete projects              |  ✅   |   ❌   |      ❌      |
| Manage project databases     |  ✅   |   ✅   |      ✅      |
| Configure project computes   |  ✅   |   ✅   |      ✅      |
| Manage project roles         |  ✅   |   ✅   |      ✅      |
| Invite/remove collaborators  |  ✅   |   ✅   |      ✅      |

## Integration management

The following table shows what each role can do regarding integrations:

| Action                                                     | Admin | Member | Collaborator |
| ---------------------------------------------------------- | :---: | :----: | :----------: |
| Install GitHub integration                                 |  ✅   |   ❌   |      ❌      |
| Install Neon Auth                                          |  ✅   |   ❌   |      ❌      |
| Install the Neon Native Integration on Vercel\* |  ✅   |   ❌   |      ❌      |
| Connect project to GitHub integration                      |  ✅   |   ✅   |      ❌      |
| Connect project (Neon Postgres Previews Integration)       |  ✅   |   ✅   |      ❌      |

\*Neon's native Integration is managed entirely in Vercel and uses Vercel's permission system. For the Neon Postgres Previews Integration, projects must first be made available in Vercel before they can be connected to Neon.

</Steps>

## Notes and limitations

- **Branch management** — All users are currently able to manage [protected branches](/docs/guides/protected-branches), regardless of their role or permission level. Granular permissions for this feature are not yet implemented.
- **Permissions and roles** — The current permissions system may not meet all needs for granular control. Share your feedback and requirements for more detailed permissions settings via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form or our [Discord feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042).
