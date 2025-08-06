---
title: Project
subtitle: Reference for the Project type
enableTableOfContents: true
tag: beta
---

<SdkProject sdkName="Next.js" />

The `Project` object contains the information and configuration of a project, such as the name, description, and enabled authentication methods.

Each [Stack app](/docs/neon-auth/concepts/stack-app) corresponds to a project. You can obtain its `Project` object by calling [`stackApp.getProject()`](/docs/neon-auth/sdk/nextjs/objects/stack-app#stackappgetproject)
or [`stackApp.useProject()`](/docs/neon-auth/sdk/nextjs/objects/stack-app#stackappuseproject).

## Type Definition

```typescript
type Project = {
  id: string;
  displayName: string;
  config: {
    signUpEnabled: boolean;
    credentialEnabled: boolean;
    magicLinkEnabled: boolean;
    clientTeamCreationEnabled: boolean;
    clientUserDeletionEnabled: boolean;
  };
};
```

### `project.id`

The unique ID of the project as a `string`.

```typescript
declare const id: string;
```

### `project.displayName`

The display name of the project as a `string`.

```typescript
declare const displayName: string;
```

### `project.config`

The configuration settings for the project.

- `signUpEnabled`: Indicates if sign-up is enabled for the project.
- `credentialEnabled`: Specifies if credential-based authentication is enabled for the project.
- `magicLinkEnabled`: States whether magic link authentication is enabled for the project.
- `clientTeamCreationEnabled`: Determines if client-side team creation is permitted within the project.
- `clientUserDeletionEnabled`: Indicates if client-side user deletion is enabled for the project.

```typescript
declare const config: {
  signUpEnabled: boolean;
  credentialEnabled: boolean;
  magicLinkEnabled: boolean;
  clientTeamCreationEnabled: boolean;
  clientUserDeletionEnabled: boolean;
};
```
