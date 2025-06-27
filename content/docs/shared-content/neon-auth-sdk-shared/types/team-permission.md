This is a reference for the `TeamPermission` type in the {sdkName} SDK.

## TeamPermission

The `TeamPermission` object represents a permission that a user has within a team in Neon Auth. Currently, it contains only an `id` to specify the permission.

You can get `TeamPermission` objects by calling functions such as `user.getPermission(...)` or `user.listPermissions()`.

## Type of contents

```typescript
type TeamPermission = {
  id: string;
};
```

### teamPermission.id

The identifier of the permission as a string.

```typescript
declare const id: string;
```
