This is a reference for the `ApiKey` type in the {sdkName} SDK.

Represents an API key for a user or project in Neon Auth.

On this page:

- [`ApiKey`](#apikey)
- Types:
  - [`UserApiKey`](#userapikey)
  - [`TeamApiKey`](#teamapikey)

## `ApiKey`

API keys provide a way for users to authenticate with your backend services without using their primary credentials. They can be created for individual users or for teams, allowing programmatic access to your application.

API keys can be obtained through:

- [`user.createApiKey()`](/docs/neon-auth/sdk/{slug}/types/user#currentusercreateapikeyoptions)
- [`user.listApiKeys()`](/docs/neon-auth/sdk/{slug}/types/user#currentuserlistapikeys)
- [`user.useApiKeys()`](/docs/neon-auth/sdk/{slug}/types/user#currentuseruseapikeys) (React hook)
- [`team.createApiKey()`](/docs/neon-auth/sdk/{slug}/types/team#teamcreateapikeyoptions)
- [`team.listApiKeys()`](/docs/neon-auth/sdk/{slug}/types/team#teamlistapikeys)
- [`team.useApiKeys()`](/docs/neon-auth/sdk/{slug}/types/team#teamuseapikeys) (React hook)

### Type Definition

```typescript
type ApiKey<Type extends "user" | "team" = "user" | "team", IsFirstView extends boolean = false> = {
  id: string;
  description: string;
  expiresAt?: Date;
  manuallyRevokedAt: Date | null;
  createdAt: Date;
  value: IsFirstView extends true ? string : { lastFour: string };

  // User or Team properties based on Type
  ...(Type extends "user" ? {
    type: "user";
    userId: string;
  } : {
    type: "team";
    teamId: string;
  })

  // Methods
  isValid(): boolean;
  whyInvalid(): "manually-revoked" | "expired" | null;
  revoke(): Promise<void>;
  update(options): Promise<void>;
};
```

### `apiKey.id`

The unique identifier for this API key.

```typescript
declare const id: string;
```

### `apiKey.description`

A human-readable description of the API key's purpose.

```typescript
declare const description: string;
```

### `apiKey.expiresAt`

The date and time when this API key will expire. If not set, the key does not expire.

```typescript
declare const expiresAt?: Date;
```

### `apiKey.manuallyRevokedAt`

The date and time when this API key was manually revoked. If null, the key has not been revoked.

```typescript
declare const manuallyRevokedAt: Date | null;
```

### `apiKey.createdAt`

The date and time when this API key was created.

```typescript
declare const createdAt: Date;
```

### `apiKey.value`

The value of the API key. When the key is first created, this is the full API key string. After that, only the last four characters are available for security reasons.

```typescript
// On first creation
declare const value: string;

// On subsequent retrievals
declare const value: { lastFour: string };
```

### `apiKey.userId`

For user API keys, the ID of the user that owns this API key.

```typescript
declare const userId: string;
```

### `apiKey.teamId`

For team API keys, the ID of the team that owns this API key.

```typescript
declare const teamId: string;
```

### `apiKey.isValid()`

Checks if the API key is still valid (not expired and not revoked).

```typescript
declare function isValid(): boolean;
```

### `apiKey.whyInvalid()`

Returns a reason why the API key is invalid, or null if it is valid.

```typescript
declare function whyInvalid(): 'manually-revoked' | 'expired' | null;
```

### `apiKey.revoke()`

Revokes the API key.

```typescript
declare function revoke(): Promise<void>;
```

### `apiKey.update(options)`

Updates the API key.

#### Parameters

- `options`: An object containing properties for updating.
  - `description`: The new description of the API key.
  - `expiresAt`: The new expiration date of the API key.

#### Returns

`Promise<void>`

```typescript
declare function update(options: { description?: string; expiresAt?: Date }): Promise<void>;
```
