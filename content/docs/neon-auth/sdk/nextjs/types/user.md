---
title: User
subtitle: Neon Auth User object reference
enableTableOfContents: true
tag: beta
---

This is a detailed reference for the `User` object. If you're looking for a more high-level overview, please refer to our guide on users [here](/docs/neon-auth/get-started/users).

On this page:
- [`CurrentUser`](#currentuser)
- [`ServerUser`](#serveruser)
- [`CurrentServerUser`](#currentserveruser)

## `CurrentUser`

You can call `useUser()` or `stackServerApp.getUser()` to get the `CurrentUser` object.

### Type Definition

```typescript
type CurrentUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  primaryEmailVerified: boolean;
  profileImageUrl: string | null;
  signedUpAt: Date;
  hasPassword: boolean;
  clientMetadata: Json;
  clientReadOnlyMetadata: Json;
  selectedTeam: Team | null;

  update(data): Promise<void>;
  updatePassword(data): Promise<void>;
  getAuthHeaders(): Promise<Record<string, string>>;
  getAuthJson(): Promise<{ accessToken: string | null }>;
  signOut([options]): Promise<void>;
  delete(): Promise<void>;

  getTeam(id): Promise<Team | null>;
  useTeam(id): Team | null;
  listTeams(): Promise<Team[]>;
  useTeams(): Team[];
  setSelectedTeam(team): Promise<void>;
  createTeam(data): Promise<Team>;
  leaveTeam(team): Promise<void>;
  getTeamProfile(team): Promise<EditableTeamMemberProfile>;
  useTeamProfile(team): EditableTeamMemberProfile;

  hasPermission(scope, permissionId): Promise<boolean>;
  getPermission(scope, permissionId[, options]): Promise<TeamPermission | null>;
  usePermission(scope, permissionId[, options]): TeamPermission | null;
  listPermissions(scope[, options]): Promise<TeamPermission[]>;
  usePermissions(scope[, options]): TeamPermission[];

  listContactChannels(): Promise<ContactChannel[]>;
  useContactChannels(): ContactChannel[];
   
  createApiKey(options): Promise<UserApiKeyFirstView>;
  listApiKeys(): Promise<UserApiKey[]>;
  useApiKeys(): UserApiKey[];
};
```

### `currentUser.id`
The user ID as a `string`. This is the unique identifier of the user.

```typescript
declare const id: string;
```

### `currentUser.displayName`
The display name of the user as a `string` or `null` if not set. The user can modify this value.

```typescript
declare const displayName: string | null;
```

### `currentUser.primaryEmail`
The primary email of the user as a `string` or `null`. Note that this is not necessarily unique.

```typescript
declare const primaryEmail: string | null;
```

### `currentUser.primaryEmailVerified`
A `boolean` indicating whether the primary email of the user is verified.

```typescript
declare const primaryEmailVerified: boolean;
```

### `currentUser.profileImageUrl`
The profile image URL of the user as a `string` or `null` if no profile image is set.

```typescript
declare const profileImageUrl: string | null;
```

### `currentUser.signedUpAt`
The date and time when the user signed up, as a `Date`.

```typescript
declare const signedUpAt: Date;
```

### `currentUser.hasPassword`
A `boolean` indicating whether the user has a password set.

```typescript
declare const hasPassword: boolean;
```

### `currentUser.clientMetadata`
The client metadata of the user as an `object`. This metadata is visible on the client side but should not contain sensitive or server-only information.

```typescript
declare const clientMetadata: Json;
```

### `currentUser.clientReadOnlyMetadata`
Read-only metadata visible on the client side. This metadata can only be modified on the server side.

```typescript
declare const clientReadOnlyMetadata: Json;
```

### `currentUser.selectedTeam`
The currently selected team for the user, if applicable, as a `Team` object or `null` if no team is selected.

```typescript
declare const selectedTeam: Team | null;
```

### `currentUser.update(data)`
Updates the user's information with the provided data.

```typescript
declare function update(data: {
  displayName?: string | null;
  profileImageUrl?: string | null;
  clientMetadata?: Json;
}): Promise<void>;
```

### `currentUser.updatePassword(data)`
Updates the user's password.

```typescript
declare function updatePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void>;
```

### `currentUser.getAuthHeaders()`
Returns the authentication headers for the current user.

```typescript
declare function getAuthHeaders(): Promise<Record<string, string>>;
```

### `currentUser.getAuthJson()`
Returns the authentication JSON for the current user.

```typescript
declare function getAuthJson(): Promise<{ accessToken: string | null }>;
```

### `currentUser.signOut([options])`
Signs out the current user.

```typescript
declare function signOut(options?: {
  redirectTo?: string;
}): Promise<void>;
```

### `currentUser.delete()`
Deletes the current user account.

```typescript
declare function delete(): Promise<void>;
```

### `currentUser.getTeam(id)`
Gets a team by ID.

```typescript
declare function getTeam(id: string): Promise<Team | null>;
```

### `currentUser.useTeam(id)`
Gets a team by ID using React hooks.

```typescript
declare function useTeam(id: string): Team | null;
```

### `currentUser.listTeams()`
Lists all teams the user is a member of.

```typescript
declare function listTeams(): Promise<Team[]>;
```

### `currentUser.useTeams()`
Lists all teams the user is a member of using React hooks.

```typescript
declare function useTeams(): Team[];
```

### `currentUser.setSelectedTeam(team)`
Sets the selected team for the user.

```typescript
declare function setSelectedTeam(team: Team): Promise<void>;
```

### `currentUser.createTeam(data)`
Creates a new team.

```typescript
declare function createTeam(data: {
  displayName: string;
  profileImageUrl?: string | null;
  clientMetadata?: Json;
}): Promise<Team>;
```

### `currentUser.leaveTeam(team)`
Leaves a team.

```typescript
declare function leaveTeam(team: Team): Promise<void>;
```

### `currentUser.getTeamProfile(team)`
Gets the user's profile in a team.

```typescript
declare function getTeamProfile(team: Team): Promise<EditableTeamMemberProfile>;
```

### `currentUser.useTeamProfile(team)`
Gets the user's profile in a team using React hooks.

```typescript
declare function useTeamProfile(team: Team): EditableTeamMemberProfile;
```

### `currentUser.hasPermission(scope, permissionId)`
Checks if the user has a specific permission.

```typescript
declare function hasPermission(scope: string, permissionId: string): Promise<boolean>;
```

### `currentUser.getPermission(scope, permissionId[, options])`
Gets a specific permission for the user.

```typescript
declare function getPermission(scope: string, permissionId: string, options?: {
  includeMetadata?: boolean;
}): Promise<TeamPermission | null>;
```

### `currentUser.usePermission(scope, permissionId[, options])`
Gets a specific permission for the user using React hooks.

```typescript
declare function usePermission(scope: string, permissionId: string, options?: {
  includeMetadata?: boolean;
}): TeamPermission | null;
```

### `currentUser.listPermissions(scope[, options])`
Lists all permissions for the user in a scope.

```typescript
declare function listPermissions(scope: string, options?: {
  includeMetadata?: boolean;
}): Promise<TeamPermission[]>;
```

### `currentUser.usePermissions(scope[, options])`
Lists all permissions for the user in a scope using React hooks.

```typescript
declare function usePermissions(scope: string, options?: {
  includeMetadata?: boolean;
}): TeamPermission[];
```

### `currentUser.listContactChannels()`
Lists all contact channels for the user.

```typescript
declare function listContactChannels(): Promise<ContactChannel[]>;
```

### `currentUser.useContactChannels()`
Lists all contact channels for the user using React hooks.

```typescript
declare function useContactChannels(): ContactChannel[];
```

### `currentUser.createApiKey(options)`
Creates a new API key for the user.

```typescript
declare function createApiKey(options: {
  displayName: string;
  expiresAt?: Date;
  clientMetadata?: Json;
}): Promise<UserApiKeyFirstView>;
```

### `currentUser.listApiKeys()`
Lists all API keys for the user.

```typescript
declare function listApiKeys(): Promise<UserApiKey[]>;
```

### `currentUser.useApiKeys()`
Lists all API keys for the user using React hooks.

```typescript
declare function useApiKeys(): UserApiKey[];
```

## `ServerUser`

The `ServerUser` object is used on the server side to represent a user. It includes all the functionality of a `CurrentUser` plus additional server-side methods.

### Type Definition

```typescript
type ServerUser = CurrentUser & {
  serverMetadata: Json;
  updateServerMetadata(data): Promise<void>;
  updateClientMetadata(data): Promise<void>;
  updateClientReadOnlyMetadata(data): Promise<void>;
  updatePrimaryEmail(email): Promise<void>;
  updatePrimaryEmailVerified(verified): Promise<void>;
  updateHasPassword(hasPassword): Promise<void>;
  updateSignedUpAt(signedUpAt): Promise<void>;
  updateDisplayName(displayName): Promise<void>;
  updateProfileImageUrl(profileImageUrl): Promise<void>;
  updateSelectedTeam(team): Promise<void>;
  updateClientMetadata(data): Promise<void>;
  updateClientReadOnlyMetadata(data): Promise<void>;
  updateServerMetadata(data): Promise<void>;
  updatePrimaryEmail(email): Promise<void>;
  updatePrimaryEmailVerified(verified): Promise<void>;
  updateHasPassword(hasPassword): Promise<void>;
  updateSignedUpAt(signedUpAt): Promise<void>;
  updateDisplayName(displayName): Promise<void>;
  updateProfileImageUrl(profileImageUrl): Promise<void>;
  updateSelectedTeam(team): Promise<void>;
};
```

### `serverUser.serverMetadata`
The server metadata of the user as an `object`. This metadata is only visible on the server side.

```typescript
declare const serverMetadata: Json;
```

### `serverUser.updateServerMetadata(data)`
Updates the server metadata of the user.

```typescript
declare function updateServerMetadata(data: Json): Promise<void>;
```

### `serverUser.updateClientMetadata(data)`
Updates the client metadata of the user.

```typescript
declare function updateClientMetadata(data: Json): Promise<void>;
```

### `serverUser.updateClientReadOnlyMetadata(data)`
Updates the client read-only metadata of the user.

```typescript
declare function updateClientReadOnlyMetadata(data: Json): Promise<void>;
```

### `serverUser.updatePrimaryEmail(email)`
Updates the primary email of the user.

```typescript
declare function updatePrimaryEmail(email: string | null): Promise<void>;
```

### `serverUser.updatePrimaryEmailVerified(verified)`
Updates whether the primary email of the user is verified.

```typescript
declare function updatePrimaryEmailVerified(verified: boolean): Promise<void>;
```

### `serverUser.updateHasPassword(hasPassword)`
Updates whether the user has a password set.

```typescript
declare function updateHasPassword(hasPassword: boolean): Promise<void>;
```

### `serverUser.updateSignedUpAt(signedUpAt)`
Updates when the user signed up.

```typescript
declare function updateSignedUpAt(signedUpAt: Date): Promise<void>;
```

### `serverUser.updateDisplayName(displayName)`
Updates the display name of the user.

```typescript
declare function updateDisplayName(displayName: string | null): Promise<void>;
```

### `serverUser.updateProfileImageUrl(profileImageUrl)`
Updates the profile image URL of the user.

```typescript
declare function updateProfileImageUrl(profileImageUrl: string | null): Promise<void>;
```

### `serverUser.updateSelectedTeam(team)`
Updates the selected team of the user.

```typescript
declare function updateSelectedTeam(team: Team | null): Promise<void>;
```

## `CurrentServerUser`

The `CurrentServerUser` object is used on the server side to represent the current user. It includes all the functionality of a `ServerUser`.

### Type Definition

```typescript
type CurrentServerUser = ServerUser;
``` 