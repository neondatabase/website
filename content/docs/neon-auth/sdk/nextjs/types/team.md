---
title: Team
subtitle: Neon Auth Team object reference
enableTableOfContents: true
tag: beta
---

`Team` represents a group of users that can collaborate within your application. Teams can have their own settings, permissions, and resources.

On this page:
- [`Team`](#team)
- Types:
  - [`TeamUser`](#teamuser)
  - [`TeamApiKey`](#teamapikey)

## `Team`

A `Team` object contains basic information and functions about a team, to the extent of which a member of the team would have access to it.

You can get `Team` objects with the `user.useTeams()` or `user.listTeams()` functions. The created team will then inherit the permissions of that user; for example, the `team.update(...)` function can only succeed if the user is allowed to make updates to the team.

### Type Definition

```typescript
type Team = {
  id: string;
  displayName: string;
  profileImageUrl: string | null;
  clientMetadata: Json;
  clientReadOnlyMetadata: Json;

  update(data): Promise<void>;
  inviteUser(options): Promise<void>;
  listUsers(): Promise<TeamUser[]>;
  useUsers(): TeamUser[];
  listInvitations(): Promise<{ ... }[]>;
  useInvitations(): { ... }[];
  
  createApiKey(options): Promise<TeamApiKeyFirstView>;
  listApiKeys(): Promise<TeamApiKey[]>;
  useApiKeys(): TeamApiKey[];
};
```

### `team.id`
The team ID as a `string`. This value is always unique.

```typescript
declare const id: string;
```

### `team.displayName`
The display name of the team as a `string`.

```typescript
declare const displayName: string;
```

### `team.profileImageUrl`
The profile image URL of the team as a `string`, or `null` if no profile image is set.

```typescript
declare const profileImageUrl: string | null;
```

### `team.clientMetadata`
The client metadata of the team as a `Json` object.

```typescript
declare const clientMetadata: Json;
```

### `team.clientReadOnlyMetadata`
The client read-only metadata of the team as a `Json` object.

```typescript
declare const clientReadOnlyMetadata: Json;
```

### `team.update(data)`
Updates the team information.

Note that this operation requires the current user to have the `$update_team` permission. If the user lacks this permission, an error will be thrown.

#### Parameters
- `data`: An object containing the fields to update.
  - `displayName`: The display name of the team.
  - `profileImageUrl`: The profile image URL of the team.
  - `clientMetadata`: The client metadata of the team.

#### Returns
`Promise<void>`

```typescript
declare function update(options: {
  displayName?: string;
  profileImageUrl?: string | null;
  clientMetadata?: Json;
}): Promise<void>;
```

#### Example
```typescript
await team.update({
  displayName: 'New Team Name',
  profileImageUrl: 'https://example.com/profile.png',
  clientMetadata: {
    address: '123 Main St, Anytown, USA',
  },
});
```

### `team.inviteUser(options)`
Sends an invitation email to a user to join the team. 

Note that this operation requires the current user to have the `$invite_members` permission. If the user lacks this permission, an error will be thrown.

An invitation email containing a magic link will be sent to the specified user. If the user has an existing account, they will be automatically added to the team upon clicking the link. For users without an account, the link will guide them through the sign-up process before adding them to the team.

#### Parameters
- `options`: An object containing multiple properties.
  - `email`: The email of the user to invite.
  - `callbackUrl`: The URL where users will be redirected after accepting the team invitation.
    Required when calling `inviteUser()` in the server environment since the URL cannot be automatically determined.
    Example: `https://your-app-url.com/handler/team-invitation`

#### Returns
`Promise<void>`

```typescript
declare function inviteUser(options: {
  email: string;
  callbackUrl?: string;
}): Promise<void>;
```

### `team.listUsers()`
Lists all users in the team.

#### Returns
`Promise<TeamUser[]>`

```typescript
declare function listUsers(): Promise<TeamUser[]>;
```

### `team.useUsers()`
A React hook that returns all users in the team.

#### Returns
`TeamUser[]`

```typescript
declare function useUsers(): TeamUser[];
```

### `team.listInvitations()`
Lists all pending invitations to the team.

#### Returns
`Promise<{ ... }[]>`

```typescript
declare function listInvitations(): Promise<{ ... }[]>;
```

### `team.useInvitations()`
A React hook that returns all pending invitations to the team.

#### Returns
`{ ... }[]`

```typescript
declare function useInvitations(): { ... }[];
```

### `team.createApiKey(options)`
Creates a new API key for the team.

#### Parameters
- `options`: An object containing the API key configuration.
  - `description`: A description of the API key's purpose.
  - `expiresAt`: Optional expiration date for the API key.

#### Returns
`Promise<TeamApiKeyFirstView>`

```typescript
declare function createApiKey(options: {
  description: string;
  expiresAt?: Date;
}): Promise<TeamApiKeyFirstView>;
```

### `team.listApiKeys()`
Lists all API keys for the team.

#### Returns
`Promise<TeamApiKey[]>`

```typescript
declare function listApiKeys(): Promise<TeamApiKey[]>;
```

### `team.useApiKeys()`
A React hook that returns all API keys for the team.

#### Returns
`TeamApiKey[]`

```typescript
declare function useApiKeys(): TeamApiKey[];
``` 