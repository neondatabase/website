---
title: Permissions overview
subtitle: Understanding Neon Auth project vs app user permissions
enableTableOfContents: true
tag: beta
updatedOn: '2025-05-16T19:06:06.842Z'
redirectFrom:
  - /docs/guides/neon-auth-permissions-roles
---

Neon Auth has two different permission systems:

- [Project permissions](#project-permissions) for managing Neon Auth as a feature in your Neon projects
- [App/user permissions](#appuser-permissions) for controlling what your app's users can do within your application.

## Project permissions

**Who can add and manage Neon Auth in your Neon project**

These permissions control who can configure Neon Auth itself within your Neon organization. They're based on your Neon organization roles (Admin, Member, Collaborator).

**What they control:**
- Adding or removing Neon Auth from your project
- Claiming ownership of the auth provider project (ejecting the project to Stack Auth)
- Generating SDK keys for your application
- Creating users from the Neon Auth UI

### Permission Matrix

| Action            | Admin | Member | Collaborator |
| ----------------- | :---: | :----: | :----------: |
| Install Neon Auth |  ✅   |   ❌   |      ❌      |
| Remove Neon Auth  |  ✅   |   ❌   |      ❌      |
| Claim project     |  ✅   |   ❌   |      ❌      |
| Generate SDK Keys |  ✅   |   ❌   |      ❌      |
| Create users      |  ✅   |   ✅   |      ✅      |

### In a nutshell

- **Admins** can perform all Neon Auth operations including installation, configuration, and user management
- **Members** can create users but cannot modify Neon Auth settings
- **Collaborators** can create users but cannot modify Neon Auth settings

For more information about organization roles and permissions, see [User roles and permissions](/docs/manage/organizations#user-roles-and-permissions).

## App/user permissions

**What your app's users can do within your application**

These permissions control what your application's end users can do once they're authenticated. They're managed through your application code using Neon Auth's RBAC system.

**What they control:**
- Team-based permissions (e.g., "moderator", "read_secret_info")
- Global project permissions (e.g., "premium_access", "admin_dashboard")
- Hierarchical permission structures
- Server-side permission checks

For detailed information about implementing role-based access control for your application's users, see [App/User RBAC Permissions](/docs/neon-auth/concepts/permissions).

<NeedHelp />
