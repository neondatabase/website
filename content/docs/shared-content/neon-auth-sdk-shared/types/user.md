This is a detailed reference for the `CurrentUser` object in the {sdkName} SDK.

You can call `useUser()` or `stackServerApp.getUser()` to get the `CurrentUser` object.

## Table of Contents

<div
  style={{
    background: "#18181b",
    color: "#fff",
    padding: "1em",
    borderRadius: "10px",
    overflow: "auto",
    fontFamily: "Menlo, Monaco, 'Courier New', monospace",
    fontSize: "1em",
    marginBottom: "1.5em",
    lineHeight: 1.3
  }}
>
  <span><span style={{ color: "#a5b4fc" }}>type</span>{" "}<span style={{ color: "#facc15" }}>CurrentUser</span> <span style={{ color: "#60a5fa" }}>= {'{'}</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserid" style={{ color: "#f59e42", textDecoration: "none" }}>id</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>string</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserdisplayname" style={{ color: "#f59e42", textDecoration: "none" }}>displayName</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>string</span> <span style={{ color: "#60a5fa" }}>|</span> <span style={{ color: "#facc15" }}>null</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserprimaryemail" style={{ color: "#f59e42", textDecoration: "none" }}>primaryEmail</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>string</span> <span style={{ color: "#60a5fa" }}>|</span> <span style={{ color: "#facc15" }}>null</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserprimaryemailverified" style={{ color: "#f59e42", textDecoration: "none" }}>primaryEmailVerified</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>boolean</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserprofileimageurl" style={{ color: "#f59e42", textDecoration: "none" }}>profileImageUrl</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>string</span> <span style={{ color: "#60a5fa" }}>|</span> <span style={{ color: "#facc15" }}>null</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentusersignedupat" style={{ color: "#f59e42", textDecoration: "none" }}>signedUpAt</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Date</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserhaspassword" style={{ color: "#f59e42", textDecoration: "none" }}>hasPassword</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>boolean</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserclientmetadata" style={{ color: "#f59e42", textDecoration: "none" }}>clientMetadata</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Json</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserclientreadonlymetadata" style={{ color: "#f59e42", textDecoration: "none" }}>clientReadOnlyMetadata</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Json</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserselectedteam" style={{ color: "#f59e42", textDecoration: "none" }}>selectedTeam</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Team</span> <span style={{ color: "#60a5fa" }}>|</span> <span style={{ color: "#facc15" }}>null</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserotpauthenabled" style={{ color: "#f59e42", textDecoration: "none" }}>otpAuthEnabled</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>boolean</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserpasskeyauthenabled" style={{ color: "#f59e42", textDecoration: "none" }}>passkeyAuthEnabled</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>boolean</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserisanonymous" style={{ color: "#f59e42", textDecoration: "none" }}>isAnonymous</a><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>boolean</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserupdatedata" style={{ color: "#f59e42", textDecoration: "none" }}>update</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>data</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>void</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserupdatepassworddata" style={{ color: "#f59e42", textDecoration: "none" }}>updatePassword</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>data</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>void</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentusergetauthheaders" style={{ color: "#f59e42", textDecoration: "none" }}>getAuthHeaders</a><span style={{ color: "#60a5fa" }}>()</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>Record</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>string</span><span style={{ color: "#60a5fa" }}>, </span><span style={{ color: "#facc15" }}>string</span><span style={{ color: "#60a5fa" }}>&gt;&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentusergetauthjson" style={{ color: "#f59e42", textDecoration: "none" }}>getAuthJson</a><span style={{ color: "#60a5fa" }}>()</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#60a5fa" }}>{'{"'}</span><span style={{ color: "#f59e42" }}>accessToken</span><span style={{ color: "#60a5fa" }}>{"': "}</span><span style={{ color: "#facc15" }}>string</span> <span style={{ color: "#60a5fa" }}>|</span> <span style={{ color: "#facc15" }}>null</span><span style={{ color: "#60a5fa" }}>{"}"}</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentusersignoutoptions" style={{ color: "#f59e42", textDecoration: "none" }}>signOut</a><span style={{ color: "#60a5fa" }}>([</span><span style={{ color: "#fff" }}>options</span><span style={{ color: "#60a5fa" }}>])</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>void</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserdelete" style={{ color: "#f59e42", textDecoration: "none" }}>delete</a><span style={{ color: "#60a5fa" }}>()</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>void</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentusergetteamid" style={{ color: "#f59e42", textDecoration: "none" }}>getTeam</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>id</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>Team</span> <span style={{ color: "#60a5fa" }}>|</span> <span style={{ color: "#facc15" }}>null</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "4ch" }}></span><span style={{ color: "#fff" }}>⤷ </span><a href="#currentuseruseteamid" style={{ color: "#f59e42", textDecoration: "none" }}>useTeam</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>id</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Team</span> <span style={{ color: "#60a5fa" }}>|</span> <span style={{ color: "#facc15" }}>null</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserlistteams" style={{ color: "#f59e42", textDecoration: "none" }}>listTeams</a><span style={{ color: "#60a5fa" }}>()</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>Team</span><span style={{ color: "#60a5fa" }}>[]&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "4ch" }}></span><span style={{ color: "#fff" }}>⤷ </span><a href="#currentuseruseteams" style={{ color: "#f59e42", textDecoration: "none" }}>useTeams</a><span style={{ color: "#60a5fa" }}>()</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Team</span><span style={{ color: "#60a5fa" }}>[];</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentusersetselectedteamteam" style={{ color: "#f59e42", textDecoration: "none" }}>setSelectedTeam</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>team</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>void</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentusercreateteamdata" style={{ color: "#f59e42", textDecoration: "none" }}>createTeam</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>data</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>Team</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserleaveteamteam" style={{ color: "#f59e42", textDecoration: "none" }}>leaveTeam</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>team</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>void</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentusergetteamprofileteam" style={{ color: "#f59e42", textDecoration: "none" }}>getTeamProfile</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>team</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>EditableTeamMemberProfile</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "4ch" }}></span><span style={{ color: "#fff" }}>⤷ </span><a href="#currentuseruseteamprofileteam" style={{ color: "#f59e42", textDecoration: "none" }}>useTeamProfile</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>team</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>EditableTeamMemberProfile</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserhaspermissionscope-permissionid" style={{ color: "#f59e42", textDecoration: "none" }}>hasPermission</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>scope</span><span style={{ color: "#60a5fa" }}>, </span><span style={{ color: "#fff" }}>permissionId</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>boolean</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentusergetpermissionscope-permissionid-options" style={{ color: "#f59e42", textDecoration: "none" }}>getPermission</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>scope</span><span style={{ color: "#60a5fa" }}>, </span><span style={{ color: "#fff" }}>permissionId</span><span style={{ color: "#60a5fa" }}>[, </span><span style={{ color: "#fff" }}>options</span><span style={{ color: "#60a5fa" }}>])</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>TeamPermission</span> <span style={{ color: "#60a5fa" }}>|</span> <span style={{ color: "#facc15" }}>null</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "4ch" }}></span><span style={{ color: "#fff" }}>⤷ </span><a href="#currentuserusepermissionscope-permissionid-options" style={{ color: "#f59e42", textDecoration: "none" }}>usePermission</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>scope</span><span style={{ color: "#60a5fa" }}>, </span><span style={{ color: "#fff" }}>permissionId</span><span style={{ color: "#60a5fa" }}>[, </span><span style={{ color: "#fff" }}>options</span><span style={{ color: "#60a5fa" }}>])</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>TeamPermission</span> <span style={{ color: "#60a5fa" }}>|</span> <span style={{ color: "#facc15" }}>null</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserlistpermissionsscope-options" style={{ color: "#f59e42", textDecoration: "none" }}>listPermissions</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>scope</span><span style={{ color: "#60a5fa" }}>[, </span><span style={{ color: "#fff" }}>options</span><span style={{ color: "#60a5fa" }}>])</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>TeamPermission</span><span style={{ color: "#60a5fa" }}>[]&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "4ch" }}></span><span style={{ color: "#fff" }}>⤷ </span><a href="#currentuserusepermissionsscope-options" style={{ color: "#f59e42", textDecoration: "none" }}>usePermissions</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>scope</span><span style={{ color: "#60a5fa" }}>[, </span><span style={{ color: "#fff" }}>options</span><span style={{ color: "#60a5fa" }}>])</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>TeamPermission</span><span style={{ color: "#60a5fa" }}>[];</span></span><br />
  <br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserlistcontactchannels" style={{ color: "#f59e42", textDecoration: "none" }}>listContactChannels</a><span style={{ color: "#60a5fa" }}>()</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>ContactChannel</span><span style={{ color: "#60a5fa" }}>[]&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "4ch" }}></span><span style={{ color: "#fff" }}>⤷ </span><a href="#currentuserusecontactchannels" style={{ color: "#f59e42", textDecoration: "none" }}>useContactChannels</a><span style={{ color: "#60a5fa" }}>()</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>ContactChannel</span><span style={{ color: "#60a5fa" }}>[];</span></span><br />
  <br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentusercreateapikeyoptions" style={{ color: "#f59e42", textDecoration: "none" }}>createApiKey</a><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>options</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>UserApiKeyFirstView</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#currentuserlistapikeys" style={{ color: "#f59e42", textDecoration: "none" }}>listApiKeys</a><span style={{ color: "#60a5fa" }}>()</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>UserApiKey</span><span style={{ color: "#60a5fa" }}>[]&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "4ch" }}></span><span style={{ color: "#fff" }}>⤷ </span><a href="#currentuseruseapikeys" style={{ color: "#f59e42", textDecoration: "none" }}>useApiKeys</a><span style={{ color: "#60a5fa" }}>()</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>UserApiKey</span><span style={{ color: "#60a5fa" }}>[];</span></span><br />
  <span><span style={{ color: "#60a5fa" }}>{"};"}</span></span>
</div>

## `currentUser.id`

The user ID as a `string`. This is the unique identifier of the user.

```typescript
declare const id: string;
```

## `currentUser.displayName`

The display name of the user as a `string` or `null` if not set. The user can modify this value.

```typescript
declare const displayName: string | null;
```

## `currentUser.primaryEmail`

The primary email of the user as a `string` or `null`. Note that this is not necessarily unique.

```typescript
declare const primaryEmail: string | null;
```

## `currentUser.primaryEmailVerified`

A `boolean` indicating whether the primary email of the user is verified.

```typescript
declare const primaryEmailVerified: boolean;
```

## `currentUser.profileImageUrl`

The profile image URL of the user as a `string` or `null` if no profile image is set.

```typescript
declare const profileImageUrl: string | null;
```

## `currentUser.signedUpAt`

The date and time when the user signed up, as a `Date`.

```typescript
declare const signedUpAt: Date;
```

## `currentUser.hasPassword`

A `boolean` indicating whether the user has a password set.

```typescript
declare const hasPassword: boolean;
```

## `currentUser.clientMetadata`

The client metadata of the user as a `Json` object. This can be modified by the user.

```typescript
declare const clientMetadata: Json;
```

## `currentUser.clientReadOnlyMetadata`

The client read-only metadata of the user as a `Json` object. This cannot be modified by the user.

```typescript
declare const clientReadOnlyMetadata: Json;
```

## `currentUser.selectedTeam`

The currently selected team of the user as a `Team` object or `null` if no team is selected.

```typescript
declare const selectedTeam: Team | null;
```

## `currentUser.otpAuthEnabled`

A `boolean` indicating whether OTP (One-Time Password) authentication is enabled for the user.

```typescript
declare const otpAuthEnabled: boolean;
```

## `currentUser.passkeyAuthEnabled`

A `boolean` indicating whether passkey authentication is enabled for the user.

```typescript
declare const passkeyAuthEnabled: boolean;
```

## `currentUser.isAnonymous`

A `boolean` indicating whether the user is anonymous.

```typescript
declare const isAnonymous: boolean;
```

## `currentUser.update(data)`

Updates the user's profile.

### Parameters (#update-parameters)

- `data`: An object containing properties to update:
  - `displayName`: The new display name
  - `profileImageUrl`: The new profile image URL
  - `clientMetadata`: The new client metadata

### Returns (#update-returns)

`Promise<void>`

```typescript
declare function update(data: {
  displayName?: string | null;
  profileImageUrl?: string | null;
  clientMetadata?: Json;
}): Promise<void>;
```

## `currentUser.updatePassword(data)`

Updates the user's password.

### Parameters (#updatepassword-parameters)

- `data`: An object containing properties to update:
  - `oldPassword`: The current password
  - `newPassword`: The new password

### Returns (#updatepassword-returns)

`Promise<void>`

```typescript
declare function updatePassword(data: {
  oldPassword: string;
  newPassword: string;
}): Promise<void>;
```

## `currentUser.getAuthHeaders()`

Gets the authentication headers for the user.

### Returns (#getauthheaders-returns)

`Promise<Record<string, string>>`: The authentication headers.

```typescript
declare function getAuthHeaders(): Promise<Record<string, string>>;
```

## `currentUser.getAuthJson()`

Gets the authentication JSON for the user.

### Returns (#getauthjson-returns)

`Promise<{ accessToken: string | null }>`: The authentication JSON.

```typescript
declare function getAuthJson(): Promise<{ accessToken: string | null }>;
```

## `currentUser.signOut([options])`

Signs out the user.

### Parameters (#signout-parameters)

- `options`: An object containing options:
  - `redirectUrl`: URL to redirect to after sign out

### Returns (#signout-returns)

`Promise<void>`

```typescript
declare function signOut(options?: { redirectUrl?: string }): Promise<void>;
```

## `currentUser.delete()`

Deletes the user.

### Returns (#delete-returns)

`Promise<void>`

```typescript
declare function delete(): Promise<void>;
```

## `currentUser.getTeam(id)`

Gets a team by ID.

### Parameters (#getteam-parameters)

- `id`: The ID of the team

### Returns (#getteam-returns)

`Promise<Team | null>`: The team, or `null` if not found

```typescript
declare function getTeam(id: string): Promise<Team | null>;
```

## `currentUser.useTeam(id)`

Gets a team by ID as a React hook.

### Parameters (#useteam-parameters)

- `id`: The ID of the team

### Returns (#useteam-returns)

`Team | null`: The team, or `null` if not found

```typescript
declare function useTeam(id: string): Team | null;
```

## `currentUser.listTeams()`

Lists all teams the user is a member of.

### Returns (#listteams-returns)

`Promise<Team[]>`: The list of teams

```typescript
declare function listTeams(): Promise<Team[]>;
```

## `currentUser.useTeams()`

Lists all teams the user is a member of as a React hook.

### Returns (#useteams-returns)

`Team[]`: The list of teams

```typescript
declare function useTeams(): Team[];
```

## `currentUser.setSelectedTeam(team)`

Sets the selected team.

### Parameters (#setselectedteam-parameters)

- `team`: The team to select

### Returns (#setselectedteam-returns)

`Promise<void>`

```typescript
declare function setSelectedTeam(team: Team): Promise<void>;
```

## `currentUser.createTeam(data)`

Creates a new team.

### Parameters (#createteam-parameters)

- `data`: An object containing team data:
  - `name`: The name of the team
  - `displayName`: The display name of the team
  - `profileImageUrl`: The profile image URL of the team

### Returns (#createteam-returns)

`Promise<Team>`: The created team

```typescript
declare function createTeam(data: {
  name: string;
  displayName?: string | null;
  profileImageUrl?: string | null;
}): Promise<Team>;
```

## `currentUser.leaveTeam(team)`

Leaves a team.

### Parameters (#leaveteam-parameters)

- `team`: The team to leave

### Returns (#leaveteam-returns)

`Promise<void>`

```typescript
declare function leaveTeam(team: Team): Promise<void>;
```

## `currentUser.getTeamProfile(team)`

Gets the team profile for a team.

### Parameters (#getteamprofile-parameters)

- `team`: The team

### Returns (#getteamprofile-returns)

`Promise<EditableTeamMemberProfile>`: The team profile

```typescript
declare function getTeamProfile(team: Team): Promise<EditableTeamMemberProfile>;
```

## `currentUser.useTeamProfile(team)`

Gets the team profile for a team as a React hook.

### Parameters (#useteamprofile-parameters)

- `team`: The team

### Returns (#useteamprofile-returns)

`EditableTeamMemberProfile`: The team profile

```typescript
declare function useTeamProfile(team: Team): EditableTeamMemberProfile;
```

## `currentUser.hasPermission(scope, permissionId)`

Checks if the user has a permission.

### Parameters (#haspermission-parameters)

- `scope`: The scope of the permission
- `permissionId`: The ID of the permission

### Returns (#haspermission-returns)

`Promise<boolean>`: Whether the user has the permission

```typescript
declare function hasPermission(scope: string, permissionId: string): Promise<boolean>;
```

## `currentUser.getPermission(scope, permissionId[, options])`

Gets a permission.

### Parameters (#getpermission-parameters)

- `scope`: The scope of the permission
- `permissionId`: The ID of the permission
- `options`: An object containing options:
  - `or`: What to do if the permission is not found:
    - `"return-null"`: Return null (default)
    - `"throw"`: Throw an error

### Returns (#getpermission-returns)

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

## `currentUser.usePermission(scope, permissionId[, options])`

Gets a permission as a React hook.

### Parameters (#usepermission-parameters)

- `scope`: The scope of the permission
- `permissionId`: The ID of the permission
- `options`: An object containing options:
  - `or`: What to do if the permission is not found:
    - `"return-null"`: Return null (default)
    - `"throw"`: Throw an error

### Returns (#usepermission-returns)

`TeamPermission | null`: The permission, or `null` if not found

```typescript
declare function usePermission(
  scope: string,
  permissionId: string,
  options?: {
    or?: 'return-null' | 'throw';
  }
): TeamPermission | null;
```

## `currentUser.listPermissions(scope[, options])`

Lists all permissions in a scope.

### Parameters (#listpermissions-parameters)

- `scope`: The scope of the permissions
- `options`: An object containing options:
  - `or`: What to do if no permissions are found:
    - `"return-empty"`: Return an empty array (default)
    - `"throw"`: Throw an error

### Returns (#listpermissions-returns)

`Promise<TeamPermission[]>`: The list of permissions

```typescript
declare function listPermissions(
  scope: string,
  options?: {
    or?: 'return-empty' | 'throw';
  }
): Promise<TeamPermission[]>;
```

## `currentUser.usePermissions(scope[, options])`

Lists all permissions in a scope as a React hook.

### Parameters (#usepermissions-parameters)

- `scope`: The scope of the permissions
- `options`: An object containing options:
  - `or`: What to do if no permissions are found:
    - `"return-empty"`: Return an empty array (default)
    - `"throw"`: Throw an error

### Returns (#usepermissions-returns)

`TeamPermission[]`: The list of permissions

```typescript
declare function usePermissions(
  scope: string,
  options?: {
    or?: 'return-empty' | 'throw';
  }
): TeamPermission[];
```

## `currentUser.listContactChannels()`

Lists all contact channels for the user.

### Returns (#listcontactchannels-returns)

`Promise<ContactChannel[]>`: The list of contact channels

```typescript
declare function listContactChannels(): Promise<ContactChannel[]>;
```

## `currentUser.useContactChannels()`

Lists all contact channels for the user as a React hook.

### Returns (#usecontactchannels-returns)

`ContactChannel[]`: The list of contact channels

```typescript
declare function useContactChannels(): ContactChannel[];
```

## `currentUser.createApiKey(options)`

Creates a new API key for the user.

### Parameters (#createapikey-parameters)

- `options`: An object containing options:
  - `name`: The name of the API key
  - `expiresAt`: The expiration date of the API key

### Returns (#createapikey-returns)

`Promise<UserApiKeyFirstView>`: The created API key

```typescript
declare function createApiKey(options: {
  name: string;
  expiresAt?: Date;
}): Promise<UserApiKeyFirstView>;
```

## `currentUser.listApiKeys()`

Lists all API keys for the user.

### Returns (#listapikeys-returns)

`Promise<UserApiKey[]>`: The list of API keys

```typescript
declare function listApiKeys(): Promise<UserApiKey[]>;
```

## `currentUser.useApiKeys()`

Lists all API keys for the user as a React hook.

### Returns (#useapikeys-returns)

`UserApiKey[]`: The list of API keys

```typescript
declare function useApiKeys(): UserApiKey[];
```
