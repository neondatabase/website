---
title: StackServerApp
subtitle: Reference for the StackServerApp object (server-side)
enableTableOfContents: true
tag: beta
---

`StackServerApp` is the main object for interacting with Stack Auth on the server. It provides methods for authentication, user management, and team management with full server permissions.

> **Note:** Only use `StackServerApp` in trusted server environments. It requires your `SECRET_SERVER_KEY`.

### Table of Contents

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
  <span><span style={{ color: "#a5b4fc" }}>type</span>{" "}<span style={{ color: "#facc15" }}>StackServerApp</span> <span style={{ color: "#60a5fa" }}>= {'{'}</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><span style={{ color: "#60a5fa" }}>new</span><span style={{ color: "#60a5fa" }}>(</span><span style={{ color: "#fff" }}>options</span><span style={{ color: "#60a5fa" }}>)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>StackServerApp</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#stackserverappgetuserid-options" style={{ color: "#f59e42", textDecoration: "none" }}>getUser</a><span style={{ color: "#60a5fa" }}>([id], [options])</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>ServerUser</span><span style={{ color: "#60a5fa" }}>|null&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "4ch" }}></span><span style={{ color: "#fff" }}>⤷ </span><a href="#stackserverappuseuserid-options" style={{ color: "#f59e42", textDecoration: "none" }}>useUser</a><span style={{ color: "#60a5fa" }}>([id], [options])</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>ServerUser</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#stackserverapplistusersoptions" style={{ color: "#f59e42", textDecoration: "none" }}>listUsers</a><span style={{ color: "#60a5fa" }}>([options])</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>ServerUser[]</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "4ch" }}></span><span style={{ color: "#fff" }}>⤷ </span><a href="#stackserverappuseusersoptions" style={{ color: "#f59e42", textDecoration: "none" }}>useUsers</a><span style={{ color: "#60a5fa" }}>([options])</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>ServerUser[]</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#stackserverappcreateuseroptions" style={{ color: "#f59e42", textDecoration: "none" }}>createUser</a><span style={{ color: "#60a5fa" }}>([options])</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>ServerUser</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#stackserverappgetteamid" style={{ color: "#f59e42", textDecoration: "none" }}>getTeam</a><span style={{ color: "#60a5fa" }}>(id)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>ServerTeam|null</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "4ch" }}></span><span style={{ color: "#fff" }}>⤷ </span><a href="#stackserverappuseteamid" style={{ color: "#f59e42", textDecoration: "none" }}>useTeam</a><span style={{ color: "#60a5fa" }}>(id)</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>ServerTeam</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#stackserverapplistteams" style={{ color: "#f59e42", textDecoration: "none" }}>listTeams</a><span style={{ color: "#60a5fa" }}>()</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>ServerTeam[]</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ display: "inline-block", width: "4ch" }}></span><span style={{ color: "#fff" }}>⤷ </span><a href="#stackserverappuseteams" style={{ color: "#f59e42", textDecoration: "none" }}>useTeams</a><span style={{ color: "#60a5fa" }}>()</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>ServerTeam[]</span><span style={{ color: "#60a5fa" }}>;</span></span><br />
  <span><span style={{ display: "inline-block", width: "2ch" }}></span><a href="#stackserverappcreateteamoptions" style={{ color: "#f59e42", textDecoration: "none" }}>createTeam</a><span style={{ color: "#60a5fa" }}>([options])</span><span style={{ color: "#60a5fa" }}>: </span><span style={{ color: "#facc15" }}>Promise</span><span style={{ color: "#60a5fa" }}>&lt;</span><span style={{ color: "#facc15" }}>ServerTeam</span><span style={{ color: "#60a5fa" }}>&gt;;</span></span><br />
  <span><span style={{ color: "#60a5fa" }}>{"};"}</span></span>
</div>

## Constructor

Creates a new `StackServerApp` instance.

### Parameters

- `tokenStore`: The token store to use. Can be one of:
  - `"nextjs-cookie"`: Uses Next.js cookies (recommended for Next.js apps)
  - `"cookie"`: Uses browser cookies
  - `{ accessToken: string, refreshToken: string }`: Uses provided tokens
  - `Request`: Uses the provided request object
- `secretServerKey`: The secret server key for your app.
- `baseUrl`, `projectId`, `publishableClientKey`, `urls`, `noAutomaticPrefetch`: (see [StackClientApp](./stack-client-app.md) for details)

### Signature

```typescript
declare new(options: {
  tokenStore: "nextjs-cookie" | "cookie" | { accessToken: string, refreshToken: string } | Request;
  secretServerKey?: string;
  baseUrl?: string;
  projectId?: string;
  publishableClientKey?: string;
  urls: { signIn: string; signUp?: string; forgotPassword?: string; };
  noAutomaticPrefetch?: boolean;
}): StackServerApp;
```

### Example

```typescript
const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  secretServerKey: process.env.SECRET_SERVER_KEY,
  urls: { signIn: "/my-custom-sign-in-page" },
});
```

## Methods

## `stackServerApp.getUser([id], [options])`

Returns a `ServerUser` by ID, or the current user if no ID is provided.

**Parameters:**
- `id` (string, optional): The user ID.
- `options` (object, optional): `{ or?: "return-null" | "redirect" | "throw" }`

**Returns:**  
`Promise<ServerUser | null>`

**Example:**
```typescript
const user = await stackServerApp.getUser("user_id");
```


## `stackServerApp.useUser([id], [options])`

Functionally equivalent to `getUser([id], [options])`, but as a React hook.

**Parameters:**
- `id` (string, optional): The user ID.
- `options` (object, optional): `{ or?: "return-null" | "redirect" | "throw" }`

**Returns:**  
`ServerUser`

**Example:**
```typescript
const user = await stackServerApp.useUser("user_id");
```

## `stackServerApp.listUsers([options])`

Lists all users on the project.

**Parameters:**
- `options` (object, optional):
  - `cursor` (string): The cursor to start from.
  - `limit` (number): Max number of users to return.
  - `orderBy` (string): Field to sort by (`"signedUpAt"`).
  - `desc` (boolean): Sort descending.
  - `query` (string): Free-text search.

**Returns:**  
`Promise<ServerUser[]>` (with `nextCursor` property)

**Example:**
```typescript
const users = await stackServerApp.listUsers({ limit: 20 });
```


## `stackServerApp.useUsers([options])`

Functionally equivalent to `listUsers([options])`, but as a React hook.

**Parameters:**
- `options` (object, optional):
  - `cursor` (string): The cursor to start from.
  - `limit` (number): Max number of users to return.
  - `orderBy` (string): Field to sort by (`"signedUpAt"`).
  - `desc` (boolean): Sort descending.
  - `query` (string): Free-text search.

**Returns:**  
`ServerUser[]`

**Example:**
```typescript
const users = await stackServerApp.useUsers({ limit: 20 });
```

## `stackServerApp.createUser([options])`

Creates a new user from the server.

**Parameters:**
- `options` (object):
  - `primaryEmail` (string)
  - `primaryEmailVerified` (boolean)
  - `primaryEmailAuthEnabled` (boolean)
  - `password` (string)
  - `otpAuthEnabled` (boolean)
  - `displayName` (string)

**Returns:**  
`Promise<ServerUser>`

**Example:**
```typescript
const user = await stackServerApp.createUser({
  primaryEmail: "test@example.com",
  primaryEmailAuthEnabled: true,
  password: "password123",
});
```

## `stackServerApp.getTeam(id)`

Gets a team by its ID.

**Parameters:**
- `id` (string): The team ID.

**Returns:**  
`Promise<ServerTeam | null>`

**Example:**
```typescript
const team = await stackServerApp.getTeam("team_id");
```


## `stackServerApp.useTeam(id)`

Functionally equivalent to `getTeam(id)`, but as a React hook.

**Parameters:**
- `id` (string): The team ID.

**Returns:**  
`ServerTeam`

**Example:**
```typescript
const team = stackServerApp.useTeam("team_id");
```


## `stackServerApp.listTeams()`

Lists all teams on the current project.

**Returns:**  
`Promise<ServerTeam[]>`

**Example:**
```typescript
const teams = await stackServerApp.listTeams();
```


## `stackServerApp.useTeams()`

Functionally equivalent to `listTeams()`, but as a React hook.

**Returns:**  
`ServerTeam[]`

**Example:**
```typescript
const teams = stackServerApp.useTeams();
```


## `stackServerApp.createTeam([options])`

Creates a team.

**Parameters:**
- `options` (object):
  - `displayName` (string): The display name for the team.
  - `profileImageUrl` (string | null): The URL of the team's profile image, or null to remove.

**Returns:**  
`Promise<ServerTeam>`

**Example:**
```typescript
const team = await stackServerApp.createTeam({
  displayName: "New Team",
  profileImageUrl: "https://example.com/profile.jpg",
});
```

## See also

- [StackClientApp](./stack-client-app.md)
- [User object reference](../types/user.md)
- [Team object reference](../types/team.md)
