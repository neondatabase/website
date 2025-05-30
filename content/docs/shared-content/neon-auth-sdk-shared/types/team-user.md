This is a detailed reference for the `TeamUser` and `ServerTeamUser` objects in the {sdkName} SDK.

On this page:
- [TeamUser](#teamuser)
- [ServerTeamUser](#serverteamuser)

## `TeamUser`

The `TeamUser` object is used on the client side to represent a user in the context of a team, providing minimal information about the user, including their ID and team-specific profile.

It is usually obtained by calling `team.useUsers()` or `team.listUsers()` on a [`Team` object](../types/team).

### Table of Contents

```typescript
type TeamUser = {
  id: string;
  teamProfile: TeamProfile;
};
```

### `teamUser.id`

The ID of the user.

```typescript
declare const id: string;
```

### `teamUser.teamProfile`

The team profile of the user as a `TeamProfile` object.

```typescript
declare const teamProfile: TeamProfile;
```

## `ServerTeamUser`

The `ServerTeamUser` object is used on the server side to represent a user within a team. Besides the team profile, it also includes all the functionality of a [`ServerUser`](../types/user).

It is usually obtained by calling `serverTeam.listUsers()` on a [`ServerTeam` object](../types/team).

### Table of Contents

```typescript
type ServerTeamUser =
  // Inherits all functionality from TeamUser
  & TeamUser
  // Inherits all functionality from ServerUser
  & ServerUser
  & {
    teamProfile: ServerTeamProfile;
  };
```

### `serverTeamUser.teamProfile`

The team profile of the user as a `ServerTeamProfile` object.

```typescript
declare const teamProfile: ServerTeamProfile;
```
