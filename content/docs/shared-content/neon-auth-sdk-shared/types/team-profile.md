This is a detailed reference for the `TeamMemberProfile`, `ServerTeamMemberProfile`, and `EditableTeamMemberProfile` objects in the {sdkName} SDK.

On this page:

- [TeamMemberProfile](#teammemberprofile)
- [ServerTeamMemberProfile](#serverteammemberprofile)
- [EditableTeamMemberProfile](#editableteammemberprofile)

## `TeamMemberProfile`

The `TeamMemberProfile` object represents the profile of a user within the context of a team. It includes the user's profile information specific to the team and can be accessed through the `teamUser.teamProfile` property on a `TeamUser` object.

### Table of Contents

```typescript
type TeamMemberProfile = {
  displayName: string | null;
  profileImageUrl: string | null;
};
```

### `teamMemberProfile.displayName`

The display name of the user within the team context as a `string` or `null` if no display name is set.

```typescript
declare const displayName: string | null;
```

### `teamMemberProfile.profileImageUrl`

The profile image URL of the user within the team context as a `string`, or `null` if no profile image is set.

```typescript
declare const profileImageUrl: string | null;
```

## `ServerTeamMemberProfile`

The `ServerTeamMemberProfile` object is currently the same as `TeamMemberProfile`.

### Table of Contents

```typescript
type ServerTeamMemberProfile =
  // Inherits all functionality from TeamMemberProfile
  TeamMemberProfile;
```

## `EditableTeamMemberProfile`

The `EditableTeamMemberProfile` object extends `TeamMemberProfile` with the ability to update the profile information.

### Table of Contents

```typescript
type EditableTeamMemberProfile = TeamMemberProfile & {
  update(update: TeamMemberProfileUpdateOptions): Promise<void>;
};
```

### `editableTeamMemberProfile.update(update)`

Updates the team member profile.

#### Parameters

- `update`: An object containing properties to update:
  - `displayName`: The new display name for the user within the team
  - `profileImageUrl`: The new profile image URL for the user within the team

#### Returns

`Promise<void>`

```typescript
declare function update(update: {
  displayName?: string;
  profileImageUrl?: string | null;
}): Promise<void>;
```

#### Example

```typescript
await editableTeamMemberProfile.update({
  displayName: 'New Display Name',
  profileImageUrl: 'https://example.com/profile.jpg',
});
```
