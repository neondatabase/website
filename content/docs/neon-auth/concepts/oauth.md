---
title: OAuth Authentication
subtitle: Working with OAuth providers in Neon Auth
enableTableOfContents: true
tag: beta
updatedOn: '2025-07-23T17:00:18.142Z'
---

> Using OAuth providers for authentication and API access

Neon Auth comes with Google and GitHub OAuth providers pre-configured for authentication. When users sign in with these providers, their accounts are automatically connected, allowing you to access their connected accounts and make API calls on their behalf.

<Admonition type="info">
  You cannot connect a user's accounts with shared OAuth keys. You must set up your own OAuth client ID and client secret in the Neon Auth dashboard. For more details, see [Production OAuth setup](/docs/neon-auth/best-practices#production-oauth-setup).
</Admonition>

Neon Auth currently supports Google, GitHub, and Microsoft as OAuth providers.

## Connected accounts

A connected account represents an external OAuth provider account linked to your user. When a user signs in with OAuth, their account is automatically connected to that provider.

You can access a user's connected account using the `useConnectedAccount` hook:

```tsx shouldWrap
'use client';

import { useUser } from '@stackframe/stack';

export default function Page() {
  const user = useUser({ or: 'redirect' });
  // Redirects to provider authorization if not already connected
  const account = user.useConnectedAccount('google', { or: 'redirect' });

  return <div>Google account connected</div>;
}
```

## Providing scopes

Most providers have access control in the form of OAuth scopes. These are the permissions that the user will see on the authorization screen (eg. "Your App wants access to your calendar"). For instance, to read Google Drive content, you need the `https://www.googleapis.com/auth/drive.readonly` scope:

```tsx shouldWrap
'use client';

import { useUser } from '@stackframe/stack';

export default function Page() {
  const user = useUser({ or: 'redirect' });
  // Redirects to the Google authorization page, requesting access to Google Drive
  const account = user.useConnectedAccount('google', {
    or: 'redirect',
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  // Account is always defined because of the redirect
  return <div>Google Drive connected</div>;
}
```

Check your provider's API documentation to find a list of available scopes.

## Retrieving the access token

Once connected with an OAuth provider, obtain the access token with the `account.getAccessToken()` function. Check your provider's API documentation to understand how you can use this token to authorize the user in requests.

```tsx shouldWrap
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@stackframe/stack';

export default function Page() {
  const user = useUser({ or: 'redirect' });
  const account = user.useConnectedAccount('google', {
    or: 'redirect',
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  const { accessToken } = account.useAccessToken();
  const [response, setResponse] = useState<any>();

  useEffect(() => {
    fetch('https://www.googleapis.com/drive/v3/files', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setResponse(data))
      .catch((err) => console.error(err));
  }, [accessToken]);

  return <div>{response ? JSON.stringify(response) : 'Loading...'}</div>;
}
```

## Sign-in default scopes

To avoid showing the authorization page twice, you can already request scopes during the sign-in flow. This approach is optional. Some applications may prefer to request extra permissions only when needed, while others might want to obtain all necessary permissions upfront.

To do this, edit the `oauthScopesOnSignIn` setting of your `stackServerApp`:

```tsx title='stack.ts'
export const stackServerApp = new StackServerApp({
  // ...your other settings...
  oauthScopesOnSignIn: {
    google: ['https://www.googleapis.com/auth/drive.readonly'],
  },
});
```

## Account merging strategies

When a user attempts to sign in with an OAuth provider that matches an existing account, Neon Auth uses the following behavior:

- If a user signs in with an OAuth provider that matches an existing account, Neon Auth will link the OAuth identity to the existing account
- The user will be signed into their existing account
- This requires both credentials to be verified for security

<Admonition type="note">
  The available OAuth providers and their scopes are pre-configured in Neon Auth. Currently, Neon Auth does not support adding or modifying OAuth providers.
</Admonition>

## Managing OAuth providers via the UI and API

You can add, update, and remove OAuth providers directly in the Neon Auth dashboard UI. For advanced or automated workflows, you can also manage providers programmatically using the Neon Auth API.

See [Manage OAuth providers via API](/docs/neon-auth/api#manage-oauth-providers-via-api) for detailed documentation and examples of all available endpoints.
