---
title: Organization
subtitle: 'Manage multi-tenant organizations, members, and invitations'
summary: >-
  Covers the management of multi-tenant organizations within the Neon platform,
  including creating organizations, inviting members, and managing permissions
  through the Organization plugin APIs.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.748Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is built on [Better Auth](https://www.better-auth.com/) and provides support for Organization plugin APIs through the Neon SDK. You do not need to manually install or configure the Better Auth Organization plugin.

The Organization plugin allows you to build multi-tenant applications where users can create workspaces, invite other members, and manage permissions using roles.

<Admonition type="note" title="Preview Feature">
The Organization plugin is currently in **Beta**. Support for invitation emails and JWT token claims is currently in progress.
</Admonition>

## Prerequisites

- A Neon project with **Auth enabled**
- A signed-in user (organizations are associated with users)

## Organizations

Use the following methods to manage the organization lifecycle.

### Create an organization

Creates a new organization. The user creating it automatically becomes the **Owner**.

<details>
<summary>View parameters</summary>

| Parameter                              | Type                               | Required | Notes                                                                 |
| :------------------------------------- | :--------------------------------- | :------: | :-------------------------------------------------------------------- |
| <tt>name</tt>                          | string                             |    ✓     | The display name of the organization                                  |
| <tt>slug</tt>                          | string                             |    ✓     | A URL-friendly identifier                                             |
| <tt>logo</tt>                          | string \| undefined                |          | Optional URL to a logo image for the organization                     |
| <tt>metadata</tt>                      | `Record<string, any>` \| undefined |          | Optional JSON metadata for the organization                           |
| <tt>userId</tt>                        | string \| undefined                |          | The user ID of the organization creator                               |
| <tt>keepCurrentActiveOrganization</tt> | boolean \| undefined               |          | If `true`, does not switch the active session to the new organization |

</details>

```ts
const { data, error } = await authClient.organization.create({
  name: 'My Organization',
  slug: 'my-org',
  logo: 'https://example.com/logo.png',
  metadata: { plan: 'pro' },
  keepCurrentActiveOrganization: false,
});
```

### Check organization slug

Checks if an organization slug is available.

<details>
<summary>View parameters</summary>

| Parameter     | Type   | Required | Notes             |
| :------------ | :----- | :------: | :---------------- |
| <tt>slug</tt> | string |    ✓     | The slug to check |

</details>

```ts
const { data, error } = await authClient.organization.checkSlug({
  slug: 'my-org',
});
```

### List organizations

Lists all organizations the current user is a member of.

<details>
<summary>View parameters</summary>

This method does not take any parameters.

</details>

```ts
const { data, error } = await authClient.organization.list();
```

In a React component, you can use the `useListOrganizations` hook to fetch and display organizations:

```tsx
import { authClient } from './auth';

export default function OrganizationList() {
  const { data: organizations } = authClient.useListOrganizations();
  return (
    <div>
      {organizations?.map((org) => (
        <p>{org.name}</p>
      ))}
    </div>
  );
}
```

### Set active organization

Switches the user's active context to a specific organization.

<details>
<summary>View parameters</summary>

| Parameter                 | Type                | Required | Notes                                          |
| :------------------------ | :------------------ | :------: | :--------------------------------------------- |
| <tt>organizationId</tt>   | string \| null      |          | The ID to set as active. Pass `null` to unset. |
| <tt>organizationSlug</tt> | string \| undefined |          | Alternatively, pass the slug to set as active. |

</details>

```ts
const { data, error } = await authClient.organization.setActive({
  organizationId: 'org_12345678',
});
```

### Get active organization

Retrieves full details of the currently active organization.

<details>
<summary>View parameters</summary>

| Parameter                 | Type                | Required | Notes                                                   |
| :------------------------ | :------------------ | :------: | :------------------------------------------------------ |
| <tt>organizationId</tt>   | string \| undefined |          | Optional ID to get details for (defaults to active org) |
| <tt>organizationSlug</tt> | string \| undefined |          | Optional slug to get details for                        |
| <tt>membersLimit</tt>     | number \| undefined |          | Limit members returned in the response (default: 100)   |

</details>

```ts
const { data, error } = await authClient.organization.getFullOrganization({
  query: {
    organizationId: 'org-id',
    organizationSlug: 'org-slug',
    membersLimit: 10,
  },
});
```

In a React component, you can use the `useActiveOrganization` hook to fetch and display the active organization:

```tsx
import { authClient } from './auth';

export default function ActiveOrganization() {
  const { data: organization } = authClient.useActiveOrganization();
  return (
    <div>
      <h1>{organization?.name}</h1>
      <p>Members: {organization?.members.length}</p>
    </div>
  );
}
```

### Update organization

Updates organization details. Requires **Owner** or **Admin** permissions.

<details>
<summary>View parameters</summary>

| Parameter               | Type   | Required | Notes                                                                   |
| :---------------------- | :----- | :------: | :---------------------------------------------------------------------- |
| <tt>data</tt>           | object |    ✓     | Object containing fields to update (`name`, `slug`, `logo`, `metadata`) |
| <tt>organizationId</tt> | string |          | The ID of the organization to update                                    |

</details>

```ts
await authClient.organization.update({
  data: {
    name: 'New Name',
    metadata: { plan: 'enterprise' },
  },
  organizationId: 'org-id',
});
```

### Delete organization

Deletes the organization and all associated data. Requires **Owner** permission.

<details>
<summary>View parameters</summary>

| Parameter               | Type   | Required | Notes                                |
| :---------------------- | :----- | :------: | :----------------------------------- |
| <tt>organizationId</tt> | string |    ✓     | The ID of the organization to delete |

</details>

```ts
const { data, error } = await authClient.organization.delete({
  organizationId: 'org-id',
});
```

## Invitations

Manage invitations to join an organization.

<Admonition type="note" title="Invitation Emails">
Invitation emails are not sent during the Beta phase. They will be supported in a future release. In the meantime, users can accept invitations using the [invitation ID](/docs/auth/guides/plugins/organization#accept-invitation) or by viewing them in their [invitation list](/docs/auth/guides/plugins/organization#list-user-invitations).
</Admonition>

### Invite member

Sends an invitation to a user.

<details>
<summary>View parameters</summary>

| Parameter               | Type                 | Required | Notes                                               |
| :---------------------- | :------------------- | :------: | :-------------------------------------------------- |
| <tt>email</tt>          | string               |    ✓     | Email address to invite                             |
| <tt>role</tt>           | string               |    ✓     | Role to assign (`owner`, `admin`, `member`)         |
| <tt>organizationId</tt> | string \| undefined  |          | ID of the organization (defaults to active org)     |
| <tt>resend</tt>         | boolean \| undefined |          | If true, resends email if invitation already exists |

</details>

```ts
const { data, error } = await authClient.organization.inviteMember({
  email: 'new-user@example.com',
  role: 'member',
  resend: true,
});
```

### Accept invitation

Accepts an invitation using the invitation ID.

<details>
<summary>View parameters</summary>

| Parameter             | Type   | Required | Notes                           |
| :-------------------- | :----- | :------: | :------------------------------ |
| <tt>invitationId</tt> | string |    ✓     | The ID from the invitation link |

</details>

```ts
const { data, error } = await authClient.organization.acceptInvitation({
  invitationId: 'invitation-id',
});
```

### Reject invitation

Declines an invitation that the user has received and chooses not to accept.

<details>
<summary>View parameters</summary>

| Parameter             | Type   | Required | Notes                              |
| :-------------------- | :----- | :------: | :--------------------------------- |
| <tt>invitationId</tt> | string |    ✓     | The ID of the invitation to reject |

</details>

```ts
const { data, error } = await authClient.organization.rejectInvitation({
  invitationId: 'invitation-id',
});
```

### Cancel invitation

Cancel a pending invitation that has been sent to a user.

<details>
<summary>View parameters</summary>

| Parameter             | Type   | Required | Notes                              |
| :-------------------- | :----- | :------: | :--------------------------------- |
| <tt>invitationId</tt> | string |    ✓     | The ID of the invitation to cancel |

</details>

```ts
const { data, error } = await authClient.organization.cancelInvitation({
  invitationId: 'invitation-id',
});
```

### Get invitation

Retrieves details of a specific invitation.

<details>
<summary>View parameters</summary>

| Parameter         | Type   | Required | Notes                                |
| :---------------- | :----- | :------: | :----------------------------------- |
| <tt>query.id</tt> | string |    ✓     | The ID of the invitation to retrieve |

</details>

```ts
const { data, error } = await authClient.organization.getInvitation({
  query: {
    id: 'invitation-id',
  },
});
```

### List invitations

Lists all pending invitations for an organization.

<details>
<summary>View parameters</summary>

| Parameter                     | Type                | Required | Notes                               |
| :---------------------------- | :------------------ | :------: | :---------------------------------- |
| <tt>query.organizationId</tt> | string \| undefined |          | Defaults to the active organization |

</details>

```ts
const { data, error } = await authClient.organization.listInvitations({
  query: {
    organizationId: 'org-id',
  },
});
```

### List user invitations

Lists all invitations received by the current user.

<details>
<summary>View parameters</summary>

This method does not take any parameters.

</details>

```ts
const { data, error } = await authClient.organization.listUserInvitations();
```

## Members

Manage users within the organization.

### List members

Lists members with support for pagination, sorting, and filtering.

<details>
<summary>View parameters</summary>

| Parameter                     | Type                                    | Required | Notes                                |
| :---------------------------- | :-------------------------------------- | :------: | :----------------------------------- |
| <tt>query.organizationId</tt> | string \| undefined                     |          | Defaults to the active organization  |
| <tt>query.limit</tt>          | number \| undefined                     |          | Items per page (default: 100)        |
| <tt>query.offset</tt>         | number \| undefined                     |          | Items to skip                        |
| <tt>query.sortBy</tt>         | string \| undefined                     |          | Field to sort by (e.g., `createdAt`) |
| <tt>query.sortDirection</tt>  | "asc" \| "desc" \| undefined            |          | Sort direction                       |
| <tt>query.filterField</tt>    | string \| undefined                     |          | Field to filter by                   |
| <tt>query.filterOperator</tt> | "eq" \| "ne" \| "gt" \| "contains" etc. |          | Operator for filtering               |
| <tt>query.filterValue</tt>    | string \| undefined                     |          | Value to filter for                  |

</details>

```ts
const { data, error } = await authClient.organization.listMembers({
  query: {
    limit: 20,
    offset: 0,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    filterField: 'role',
    filterOperator: 'eq',
    filterValue: 'admin',
  },
});
```

### Update member role

Updates a member's role.

<details>
<summary>View parameters</summary>

| Parameter               | Type                | Required | Notes                                              |
| :---------------------- | :------------------ | :------: | :------------------------------------------------- |
| <tt>memberId</tt>       | string              |    ✓     | The ID of the member to update                     |
| <tt>role</tt>           | string\| string[]   |    ✓     | New role(s) to assign (`owner`, `admin`, `member`) |
| <tt>organizationId</tt> | string \| undefined |          | Defaults to active organization                    |

</details>

```ts
const { data, error } = await authClient.organization.updateMemberRole({
  memberId: 'member-id',
  role: 'admin',
});
```

### Remove member

Removes a member from the organization.

<details>
<summary>View parameters</summary>

| Parameter                | Type                | Required | Notes                           |
| :----------------------- | :------------------ | :------: | :------------------------------ |
| <tt>memberIdOrEmail</tt> | string              |    ✓     | Member ID or Email address      |
| <tt>organizationId</tt>  | string \| undefined |          | Defaults to active organization |

</details>

```ts
const { data, error } = await authClient.organization.removeMember({
  memberIdOrEmail: 'member-id-or-email',
});
```

### Get active member

Gets the current user's membership details for the active organization.

<details>
<summary>View parameters</summary>

This method does not take any parameters.

</details>

```ts
const { data, error } = await authClient.organization.getActiveMember();
```

### Get Active Member Role

Gets the current user's role(s) in the active organization.

<details>
<summary>View parameters</summary>

This method does not take any parameters.

</details>

```ts
const { data, error } = await authClient.organization.getActiveMemberRole();
```

### Leave organization

Removes the current user from an organization.

<details>
<summary>View parameters</summary>

| Parameter               | Type   | Required | Notes                               |
| :---------------------- | :----- | :------: | :---------------------------------- |
| <tt>organizationId</tt> | string |    ✓     | The ID of the organization to leave |

</details>

```ts
const { data, error } = await authClient.organization.leave({
  organizationId: 'org-id',
});
```

## Access Control

The Organization plugin includes a Role-Based Access Control (RBAC) system.

| Role       | Permissions                                                                                                                                |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **Owner**  | Full control. Can delete the organization and manage all roles. The user who creates the organization is automatically assigned this role. |
| **Admin**  | Can invite members, update roles, and manage organization settings. Cannot delete the organization.                                        |
| **Member** | Read-only access to organization data. Cannot manage other members.                                                                        |

You can check permissions on the client side using `checkRolePermission`:

```ts
const canDelete = authClient.organization.checkRolePermission({
  permission: {
    organization: ['delete'],
  },
  role: 'admin', // returns false, admins cannot delete orgs
});
// console.log(canDelete); // false
```

## Limitations

Because Neon Auth is a managed service, some Better Auth features are not currently supported:

- **Teams:** The Teams sub-feature is not currently enabled.
- **Hooks:** Server-side hooks (e.g., `beforeCreateOrganization`) are not supported.
- **Custom Permissions:** You cannot currently define custom roles or modify default permissions.
- **Dynamic Access Control:** Dynamic creation of roles via API is not enabled.

Check the [Neon Auth roadmap](/docs/auth/roadmap) for updates on these features.

<NeedHelp/>
