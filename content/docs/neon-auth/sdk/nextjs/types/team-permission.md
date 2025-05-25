---
title: TeamPermission
subtitle: Neon Auth TeamPermission object reference
enableTableOfContents: true
tag: beta
---

The `TeamPermission` object represents a permission that a user has within a team. Currently, it contains only an `id` to specify the permission.

You can get `TeamPermission` objects by calling functions such as `user.getPermission(...)` or `user.listPermissions()`.

## Type Definition

```typescript
type TeamPermission = {
  id: string;
};
```

### `teamPermission.id`

The identifier of the permission as a `string`.

```typescript
declare const id: string;
```
