---
title: ServerUser
subtitle: Reference for the ServerUser object
enableTableOfContents: true
tag: beta
---

## `ServerUser`

The `ServerUser` object is used on the server side to represent a user. It includes all the functionality of a `CurrentUser` object, plus additional server-side functionality.

### Table of Contents

```typescript
type ServerUser =
  // Inherits all functionality from CurrentUser
  & CurrentUser
  & {
    serverMetadata: Json;
    serverReadOnlyMetadata: Json;
    listTeams(): Promise<ServerTeam[]>;
    getTeam(id): Promise<ServerTeam | null>;
    createTeam(data): Promise<ServerTeam>;
    leaveTeam(team): Promise<void>;
    getTeamProfile(team): Promise<EditableTeamMemberProfile>;
    hasPermission(scope, permissionId): Promise<boolean>;
    getPermission(scope, permissionId[, options]): Promise<TeamPermission | null>;
    listPermissions(scope[, options]): Promise<TeamPermission[]>;
    listContactChannels(): Promise<ServerContactChannel[]>;
    createApiKey(options): Promise<UserApiKeyFirstView>;
    listApiKeys(): Promise<UserApiKey[]>;
  };
```

### `serverUser.serverMetadata`

The server metadata of the user as a `Json` object. This can be modified by the server.

```typescript
declare const serverMetadata: Json;
```

### `serverUser.serverReadOnlyMetadata`

The server read-only metadata of the user as a `Json` object. This cannot be modified by the server.

```typescript
declare const serverReadOnlyMetadata: Json;
```

### `serverUser.listTeams()`

Lists all teams the user is a member of.

#### Returns

`Promise<ServerTeam[]>`: The list of teams

```typescript
declare function listTeams(): Promise<ServerTeam[]>;
```

### `serverUser.getTeam(id)`

Gets a team by ID.

#### Parameters

- `id`: The ID of the team

#### Returns

`Promise<ServerTeam | null>`: The team, or `null` if not found

```typescript
declare function getTeam(id: string): Promise<ServerTeam | null>;
```

### `serverUser.createTeam(data)`

Creates a new team.

#### Parameters

- `data`: An object containing team data:
  - `name`: The name of the team
  - `displayName`: The display name of the team
  - `profileImageUrl`: The profile image URL of the team

#### Returns

`Promise<ServerTeam>`: The created team

```typescript
declare function createTeam(data: {
  name: string;
  displayName?: string | null;
  profileImageUrl?: string | null;
}): Promise<ServerTeam>;
```

### `serverUser.leaveTeam(team)`

Leaves a team.

#### Parameters

- `team`: The team to leave

#### Returns

`Promise<void>`

```typescript
declare function leaveTeam(team: ServerTeam): Promise<void>;
```

### `serverUser.getTeamProfile(team)`

Gets the team profile for a team.

#### Parameters

- `team`: The team

#### Returns

`Promise<EditableTeamMemberProfile>`: The team profile

```typescript
declare function getTeamProfile(team: ServerTeam): Promise<EditableTeamMemberProfile>;
```

### `serverUser.hasPermission(scope, permissionId)`

Checks if the user has a permission.

#### Parameters

- `scope`: The scope of the permission
- `permissionId`: The ID of the permission

#### Returns

`Promise<boolean>`: Whether the user has the permission

```typescript
declare function hasPermission(scope: string, permissionId: string): Promise<boolean>;
```

### `serverUser.getPermission(scope, permissionId[, options])`

Gets a permission.

#### Parameters

- `scope`: The scope of the permission
- `permissionId`: The ID of the permission
- `options`: An object containing options:
  - `or`: What to do if the permission is not found:
    - `"return-null"`: Return null (default)
    - `"throw"`: Throw an error

#### Returns

`Promise<TeamPermission | null>`: The permission, or `null` if not found

```typescript
declare function getPermission(
  scope: string,
  permissionId: string,
  options?: {
    or?: 'return-null' | 'throw';
  }
): Promise<TeamPermission | null>;
```

### `serverUser.listPermissions(scope[, options])`

Lists all permissions in a scope.

#### Parameters

- `scope`: The scope of the permissions
- `options`: An object containing options:
  - `or`: What to do if no permissions are found:
    - `"return-empty"`: Return an empty array (default)
    - `"throw"`: Throw an error

#### Returns

`Promise<TeamPermission[]>`: The list of permissions

```typescript
declare function listPermissions(
  scope: string,
  options?: {
    or?: 'return-empty' | 'throw';
  }
): Promise<TeamPermission[]>;
```

### `serverUser.listContactChannels()`

Lists all contact channels for the user.

#### Returns

`Promise<ServerContactChannel[]>`: The list of contact channels

```typescript
declare function listContactChannels(): Promise<ServerContactChannel[]>;
```

### `serverUser.createApiKey(options)`

Creates a new API key for the user.

#### Parameters

- `options`: An object containing options:
  - `name`: The name of the API key
  - `expiresAt`: The expiration date of the API key

#### Returns

`Promise<UserApiKeyFirstView>`: The created API key

```typescript
declare function createApiKey(options: {
  name: string;
  expiresAt?: Date;
}): Promise<UserApiKeyFirstView>;
```

### `serverUser.listApiKeys()`

Lists all API keys for the user.

#### Returns

`Promise<UserApiKey[]>`: The list of API keys

```typescript
declare function listApiKeys(): Promise<UserApiKey[]>;
```

## `CurrentServerUser`

The `CurrentServerUser` object is used on the server side to represent the currently authenticated user. It includes all the functionality of a `ServerUser` object.

### Table of Contents

```typescript
type CurrentServerUser =
  // Inherits all functionality from ServerUser
  & ServerUser;
```
