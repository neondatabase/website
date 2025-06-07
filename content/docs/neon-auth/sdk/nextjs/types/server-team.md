---
title: ServerTeam
subtitle: Reference for the ServerTeam object
enableTableOfContents: true
tag: beta
---

## `ServerTeam`

The `ServerTeam` object is used on the server side to represent a team. It includes all the functionality of a `Team` object, plus additional server-side functionality.

### Table of Contents

```typescript
type ServerTeam =
  // Inherits all functionality from Team
  & Team
  & {
    serverMetadata: Json;
    serverReadOnlyMetadata: Json;
    listUsers(): Promise<ServerTeamUser[]>;
    getTeamProfile(user): Promise<EditableTeamMemberProfile>;
    hasPermission(scope, permissionId): Promise<boolean>;
    getPermission(scope, permissionId[, options]): Promise<TeamPermission | null>;
    listPermissions(scope[, options]): Promise<TeamPermission[]>;
    listContactChannels(): Promise<ServerContactChannel[]>;
    createApiKey(options): Promise<TeamApiKeyFirstView>;
    listApiKeys(): Promise<TeamApiKey[]>;
  };
```

### `serverTeam.serverMetadata`

The server metadata of the team as a `Json` object. This can be modified by the server.

```typescript
declare const serverMetadata: Json;
```

### `serverTeam.serverReadOnlyMetadata`

The server read-only metadata of the team as a `Json` object. This cannot be modified by the server.

```typescript
declare const serverReadOnlyMetadata: Json;
```

### `serverTeam.listUsers()`

Lists all users in the team.

#### Returns

`Promise<ServerTeamUser[]>`: The list of users

```typescript
declare function listUsers(): Promise<ServerTeamUser[]>;
```

### `serverTeam.getTeamProfile(user)`

Gets the team profile for a user.

#### Parameters

- `user`: The user

#### Returns

`Promise<EditableTeamMemberProfile>`: The team profile

```typescript
declare function getTeamProfile(user: ServerUser): Promise<EditableTeamMemberProfile>;
```

### `serverTeam.hasPermission(scope, permissionId)`

Checks if the team has a permission.

#### Parameters

- `scope`: The scope of the permission
- `permissionId`: The ID of the permission

#### Returns

`Promise<boolean>`: Whether the team has the permission

```typescript
declare function hasPermission(scope: string, permissionId: string): Promise<boolean>;
```

### `serverTeam.getPermission(scope, permissionId[, options])`

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

### `serverTeam.listPermissions(scope[, options])`

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

### `serverTeam.listContactChannels()`

Lists all contact channels for the team.

#### Returns

`Promise<ServerContactChannel[]>`: The list of contact channels

```typescript
declare function listContactChannels(): Promise<ServerContactChannel[]>;
```

### `serverTeam.createApiKey(options)`

Creates a new API key for the team.

#### Parameters

- `options`: An object containing options:
  - `name`: The name of the API key
  - `expiresAt`: The expiration date of the API key

#### Returns

`Promise<TeamApiKeyFirstView>`: The created API key

```typescript
declare function createApiKey(options: {
  name: string;
  expiresAt?: Date;
}): Promise<TeamApiKeyFirstView>;
```

### `serverTeam.listApiKeys()`

Lists all API keys for the team.

#### Returns

`Promise<TeamApiKey[]>`: The list of API keys

```typescript
declare function listApiKeys(): Promise<TeamApiKey[]>;
```
