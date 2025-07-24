---
title: App/User RBAC Permissions
subtitle: Managing permissions for your app's end users and teams
enableTableOfContents: true
tag: beta
updatedOn: '2025-07-23T17:00:18.143Z'
---

> If you're looking for information about who can add or manage Neon Auth in your Neon project, see [Permissions overview](/docs/neon-auth/permissions-roles).

Neon Auth supports two types of permissions for your application's users:

- **Team permissions** control what a user can do within a specific team
- **User permissions** control what a user can do globally, across the entire project

Both permission types can be managed from the dashboard, and both support arbitrary nesting.

## Team Permissions

Team permissions control what a user can do within each team. You can create and assign permissions to team members from the Neon Console. These permissions could include actions like `create_post` or `read_secret_info`, or roles like `admin` or `moderator`. Within your app, you can verify if a user has a specific permission within a team.

Permissions can be nested to create a hierarchical structure. For example, an `admin` permission can include both `moderator` and `user` permissions. We provide tools to help you verify whether a user has a permission directly or indirectly.

### System Permissions

Neon Auth comes with a few predefined team permissions known as system permissions. These permissions start with a dollar sign (`$`). While you can assign these permissions to members or include them within other permissions, you cannot modify them as they are integral to the Neon Auth backend system.

### Checking if a User has a Permission

To check whether a user has a specific permission, use the `getPermission` method or the `usePermission` hook on the `User` object. This returns the `Permission` object if the user has it; otherwise, it returns `null`. Always perform permission checks on the server side for business logic, as client-side checks can be bypassed. Here's an example:

<Tabs labels={["Client Component", "Server Component"]}>

<TabItem>
```tsx shouldWrap
"use client";
import { useUser } from "@stackframe/stack";

export function CheckUserPermission() {
const user = useUser({ or: 'redirect' });
const team = user.useTeam('some-team-id');
const permission = user.usePermission(team, 'read');

// Don't rely on client-side permission checks for business logic.
return (

<div>
{permission ? 'You have the read permission' : 'You shall not pass'}
</div>
);
}

````

</TabItem>

<TabItem>
```tsx shouldWrap
import { stackServerApp } from "@/stack";

export default async function CheckUserPermission() {
  const user = await stackServerApp.getUser({ or: 'redirect' });
  const team = await stackServerApp.getTeam('some-team-id');
  const permission = await user.getPermission(team, 'read');

  // This is a server-side check, so it's secure.
  return (
    <div>
      {permission ? 'You have the read permission' : 'You shall not pass'}
    </div>
  );
}
````

</TabItem>

</Tabs>

### Listing All Permissions of a User

To get a list of all permissions a user has, use the `listPermissions` method or the `usePermissions` hook on the `User` object. This method retrieves both direct and indirect permissions. Here is an example:

<Tabs labels={["Client Component", "Server Component"]}>

<TabItem>
```tsx shouldWrap
"use client";
import { useUser } from "@stackframe/stack";

export function DisplayUserPermissions() {
const user = useUser({ or: 'redirect' });
const permissions = user.usePermissions();

return (

<div>
{permissions.map(permission => (
<div key={permission.id}>{permission.id}</div>
))}
</div>
);
}

````
</TabItem>

<TabItem>
```tsx shouldWrap
import { stackServerApp } from "@/stack";

export default async function DisplayUserPermissions() {
  const user = await stackServerApp.getUser({ or: 'redirect' });
  const permissions = await user.listPermissions();

  return (
    <div>
      {permissions.map(permission => (
        <div key={permission.id}>{permission.id}</div>
      ))}
    </div>
  );
}
````

</TabItem>

</Tabs>

### Granting a Permission to a User

To grant a permission to a user, use the `grantPermission` method on the `ServerUser`. Here's an example:

```tsx shouldWrap
const team = await stackServerApp.getTeam('teamId');
const user = await stackServerApp.getUser();
await user.grantPermission(team, 'read');
```

### Revoking a Permission from a User

To revoke a permission from a user, use the `revokePermission` method on the `ServerUser`. Here's an example:

```tsx shouldWrap
const team = await stackServerApp.getTeam('teamId');
const user = await stackServerApp.getUser();
await user.revokePermission(team, 'read');
```

## Project Permissions

Project permissions are global permissions that apply to a user across the entire project, regardless of team context. These permissions are useful for handling things like premium plan subscriptions or global admin access.

### Checking if a User has a Project Permission

To check whether a user has a specific project permission, use the `getPermission` method or the `usePermission` hook. Here's an example:

<Tabs labels={["Client Component", "Server Component"]}>

<TabItem>
```tsx shouldWrap
"use client";
import { useUser } from "@stackframe/stack";

export function CheckGlobalPermission() {
const user = useUser({ or: 'redirect' });
const permission = user.usePermission('access_admin_dashboard');

return (

<div>
{permission ? 'You can access the admin dashboard' : 'Access denied'}
</div>
);
}

````
</TabItem>

<TabItem>
```tsx shouldWrap
import { stackServerApp } from "@/stack";

export default async function CheckGlobalPermission() {
  const user = await stackServerApp.getUser({ or: 'redirect' });
  const permission = await user.getPermission('access_admin_dashboard');

  return (
    <div>
      {permission ? 'You can access the admin dashboard' : 'Access denied'}
    </div>
  );
}
````

</TabItem>

</Tabs>

### Listing All Project Permissions

To get a list of all global permissions a user has, use the `listPermissions` method or the `usePermissions` hook:

<Tabs labels={["Client Component", "Server Component"]}>

<TabItem>
```tsx shouldWrap
"use client";
import { useUser } from "@stackframe/stack";

export function DisplayGlobalPermissions() {
const user = useUser({ or: 'redirect' });
const permissions = user.usePermissions();

return (

<div>
{permissions.map(permission => (
<div key={permission.id}>{permission.id}</div>
))}
</div>
);
}

````
</TabItem>

<TabItem>
```tsx shouldWrap
import { stackServerApp } from "@/stack";

export default async function DisplayGlobalPermissions() {
  const user = await stackServerApp.getUser({ or: 'redirect' });
  const permissions = await user.listPermissions();

  return (
    <div>
      {permissions.map(permission => (
        <div key={permission.id}>{permission.id}</div>
      ))}
    </div>
  );
}
````

</TabItem>

</Tabs>

### Granting a Project Permission

To grant a global permission to a user, use the `grantPermission` method:

```tsx shouldWrap
const user = await stackServerApp.getUser();
await user.grantPermission('access_admin_dashboard');
```

### Revoking a Project Permission

To revoke a global permission from a user, use the `revokePermission` method:

```tsx shouldWrap
const user = await stackServerApp.getUser();
await user.revokePermission('access_admin_dashboard');
```

> Currently, Neon Auth does not support creating or modifying permissions through the Neon Console. All permissions are pre-configured and cannot be changed.
