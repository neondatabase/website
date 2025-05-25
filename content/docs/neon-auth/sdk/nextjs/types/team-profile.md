---
title: TeamProfile
subtitle: Neon Auth TeamProfile object reference
enableTableOfContents: true
tag: beta
---

This is a detailed reference for the `TeamProfile` and `ServerTeamProfile` objects.

On this page:

- [`TeamProfile`](#teamprofile)
- [`ServerTeamProfile`](#serverteamprofile)

## `TeamProfile`

The `TeamProfile` object represents the profile of a user within the context of a team. It includes the user's profile information specific to the team and can be accessed through the `teamUser.teamProfile` property on a `TeamUser` object.

### Type Definition

```typescript
type TeamProfile = {
  displayName: string | null;
  profileImageUrl: string | null;
};
```

### `teamProfile.displayName`

The display name of the user within the team context as a `string` or `null` if no display name is set.

```typescript
declare const displayName: string | null;
```

### `teamProfile.profileImageUrl`

The profile image URL of the user within the team context as a `string`, or `null` if no profile image is set.

```typescript
declare const profileImageUrl: string | null;
```

## `ServerTeamProfile`

The `ServerTeamProfile` object is currently the same as `TeamProfile`.

### Type Definition

```typescript
type ServerTeamProfile =
  // Inherits all functionality from TeamProfile
  TeamProfile;
```
