---
title: Admin
subtitle: 'Manage users, roles, bans, sessions, and impersonation'
summary: >-
  Covers the management of users, roles, bans, sessions, and impersonation
  through the Admin plugin APIs in Neon, enabling the creation and updating of
  user accounts and their authentication states.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.744Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is built on [Better Auth](https://www.better-auth.com/) and provides support for Admin plugin APIs through the Neon SDK. You do not need to manually install or configure the Better Auth Admin plugin.

The Admin plugin provides APIs to manage your users and their authentication state. It’s commonly used to build internal tooling (admin dashboards, support tools) that can:

- Create and update users
- Assign roles
- Ban and unban users
- List and revoke sessions
- Impersonate a user for support/debugging

## Prerequisites

- A Neon project with **Auth enabled**
- An existing user with an **admin** role to call Admin APIs.

  You can assign the **admin** role to a user through the Neon Console. Navigate to **Auth** → **Users**, open the three‑dot menu next to the user, and select **Make admin**.

  ![Assign admin role in Neon Console](/docs/auth/make-admin.png)

## Use Admin with SDK methods

You can call Admin plugin methods using the Neon SDK auth client.

> If you haven’t set up Neon Auth yet, follow our [Quick start guides](/docs/auth/overview#quick-start-guides) to get started and create an `authClient`.

### Create a user

Use the Admin APIs to create users on behalf of others (for example, back-office onboarding).

#### Parameters

<details>
<summary>View parameters</summary>

| Parameter         | Type                                   | Required | Notes                                                                      |
| ----------------- | -------------------------------------- | :------: | -------------------------------------------------------------------------- |
| <tt>email</tt>    | string                                 |    ✓     | Email address for the new user                                             |
| <tt>password</tt> | string                                 |    ✓     | Password for the new user                                                  |
| <tt>name</tt>     | string                                 |    ✓     | Display name                                                               |
| <tt>role</tt>     | string \| string[] \| undefined        |          | Optional role(s) for the user (for example: <tt>user</tt>, <tt>admin</tt>) |
| <tt>data</tt>     | Record&lt;string, any&gt; \| undefined |          | Optional custom fields                                                     |

</details>

```ts shouldWrap
const { data, error } = await authClient.admin.createUser({
  email: 'user@email.com',
  password: 'secure-password',
  name: 'User Name',
  role: 'user',
  data: { customUserField: 'value' },
});
```

### List users

List users with optional search, filtering, sorting, and pagination.

#### Parameters

<details>
<summary>View parameters</summary>

| Parameter               | Type                                                                                                              | Required | Notes                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- | :------: | ------------------------------------ |
| <tt>searchValue</tt>    | string \| undefined                                                                                               |          | Value to search for                  |
| <tt>searchField</tt>    | <tt>'email'</tt> \| <tt>'name'</tt> \| undefined                                                                  |          | Field to search in                   |
| <tt>searchOperator</tt> | <tt>'contains'</tt> \| <tt>'starts_with'</tt> \| <tt>'ends_with'</tt> \| undefined                                |          | Search operator                      |
| <tt>limit</tt>          | number \| string \| undefined                                                                                     |          | Max users to return (page size)      |
| <tt>offset</tt>         | number \| string \| undefined                                                                                     |          | Number of users to skip (pagination) |
| <tt>sortBy</tt>         | string \| undefined                                                                                               |          | Field to sort by                     |
| <tt>sortDirection</tt>  | <tt>'asc'</tt> \| <tt>'desc'</tt> \| undefined                                                                    |          | Sort direction                       |
| <tt>filterField</tt>    | string \| undefined                                                                                               |          | Field to filter by                   |
| <tt>filterValue</tt>    | string \| number \| boolean \| undefined                                                                          |          | Filter value                         |
| <tt>filterOperator</tt> | <tt>'eq'</tt> \| <tt>'ne'</tt> \| <tt>'lt'</tt> \| <tt>'lte'</tt> \| <tt>'gt'</tt> \| <tt>'gte'</tt> \| undefined |          | Filter operator                      |

</details>

```ts shouldWrap
const { data, error } = await authClient.admin.listUsers({
  query: {
    // Following parameters are optional
    searchValue: 'text to search',
    searchField: 'email',
    searchOperator: 'contains',
    limit: 10,
    offset: 0,
    sortBy: 'name',
    sortDirection: 'asc',
  },
});
```

> Use `filterField`, `filterValue`, and `filterOperator` to further filter results (for example, by role etc)

The `data` object contains a list of users and pagination metadata:

```ts
{
  users: [/* array of user objects */],
  total: 100, // total number of users matching the query
  limit: 10,  // limit used in the query
  offset: 0   // offset used in the query
}
```

Use the `total`, `limit`, and `offset` values to implement pagination in your admin tooling.

### Set a user role

Assign roles to control who can call admin operations.

#### Parameters

<details>
<summary>View parameters</summary>

| Parameter       | Type               | Required | Notes                                          |
| --------------- | ------------------ | :------: | ---------------------------------------------- |
| <tt>userId</tt> | string             |    ✓     | The user ID to update                          |
| <tt>role</tt>   | string \| string[] |    ✓     | Role(s) to apply (for example, <tt>admin</tt>) |

</details>

```ts shouldWrap
const { error } = await authClient.admin.setRole({ userId: 'user-id', role: 'admin' });
```

### Set a user password

Set or reset a user’s password.

<details>
<summary>View parameters</summary>
| Parameter         | Type   | Required | Notes                 |
| ----------------- | ------ | :------: | --------------------- |
| <tt>userId</tt>   | string |    ✓     | The user ID to update |
| <tt>newPassword</tt> | string |    ✓     | The new password      |
</details>

```ts shouldWrap
const { error } = await authClient.admin.setUserPassword({
  userId: 'user-id',
  newPassword: 'new-secure-password',
});
```

### Update user details

Update user information such as email, name, and custom fields.

<details>
<summary>View parameters</summary>
| Parameter       | Type                                   | Required | Notes                              |
| --------------- | -------------------------------------- | :------: | ---------------------------------- |
| <tt>userId</tt> | string                                 |    ✓     | The user ID to update                |
| <tt>data</tt>   | Record&lt;string, any&gt; |    ✓     | Fields to update (email, name, custom fields) |
</details>

```ts shouldWrap
const { error } = await authClient.admin.updateUser({
  userId: 'user-id',
  data: { name: 'New Name' },
});
```

### Ban user

Banning prevents sign-in for a user. You can optionally provide a reason and expiration for the ban.

<details>
<summary>View parameters</summary>

| Parameter             | Type                | Required | Notes                                                                               |
| --------------------- | ------------------- | :------: | ----------------------------------------------------------------------------------- |
| <tt>userId</tt>       | string              |    ✓     | The user ID to ban                                                                  |
| <tt>banReason</tt>    | string \| undefined |          | Reason for the ban                                                                  |
| <tt>banExpiresIn</tt> | number \| undefined |          | Duration in seconds until the ban expires. If not provided, the ban does not expire |

</details>

```ts shouldWrap
const { error } = await authClient.admin.banUser({
  userId: 'user-id',
  banReason: 'Policy violation',
  // banExpiresIn: 60 * 60 * 24, // optional (seconds)
});
```

### Unban user

Unban a previously banned user.

<details>
<summary>View parameters</summary>

| Parameter       | Type   | Required | Notes                |
| --------------- | ------ | :------: | -------------------- |
| <tt>userId</tt> | string |    ✓     | The user ID to unban |

</details>

```ts shouldWrap
const { error } = await authClient.admin.unbanUser({ userId: 'user-id' });
```

### Manage sessions

Use session APIs to view active sessions and revoke them.

#### List sessions

<details>
<summary>View parameters</summary>

| Parameter       | Type   | Required | Notes                                       |
| --------------- | ------ | :------: | ------------------------------------------- |
| <tt>userId</tt> | string |    ✓     | The user ID whose sessions you want to list |

</details>

```ts shouldWrap
const { data, error } = await authClient.admin.listUserSessions({ userId: 'user-id' });
```

#### Revoke a session

<details>
<summary>View parameters</summary>

| Parameter             | Type   | Required | Notes                       |
| --------------------- | ------ | :------: | --------------------------- |
| <tt>sessionToken</tt> | string |    ✓     | The session token to revoke |

</details>

```ts shouldWrap
const { error } = await authClient.admin.revokeUserSession({ sessionToken: 'session-token' });
```

#### Revoke all sessions

<details>
<summary>View parameters</summary>

| Parameter       | Type   | Required | Notes                                         |
| --------------- | ------ | :------: | --------------------------------------------- |
| <tt>userId</tt> | string |    ✓     | The user ID whose sessions you want to revoke |

</details>

```ts shouldWrap
const { error } = await authClient.admin.revokeUserSessions({ userId: 'user-id' });
```

### Impersonate a user

Impersonation creates a session that behaves like the target user (useful for support and debugging).

<details>
<summary>View parameters</summary>

| Parameter       | Type   | Required | Notes                      |
| --------------- | ------ | :------: | -------------------------- |
| <tt>userId</tt> | string |    ✓     | The user ID to impersonate |

</details>

```ts shouldWrap
const { data, error } = await authClient.admin.impersonateUser({ userId: 'user-id' });
```

### Stop impersonation

Stop an active impersonation session.

<details>
<summary>View parameters</summary>

This method does not take any parameters.

</details>

```ts shouldWrap
const { error } = await authClient.admin.stopImpersonating();
```

## Limitations

- Admin operations require an authenticated session (HTTP-only cookies). This means your admin tooling must run on the same site that can send those cookies to the Neon Auth API.
- Impersonation sessions are intentionally time‑limited, lasting for the duration of the active browser session or up to 1 hour. This design helps minimize security risks associated with long‑lived impersonation.

<NeedHelp/>
