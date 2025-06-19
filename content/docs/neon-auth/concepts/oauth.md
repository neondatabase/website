---
title: OAuth Authentication
subtitle: Working with OAuth providers in Neon Auth
enableTableOfContents: true
tag: beta
---

> Using OAuth providers for authentication and API access

Neon Auth comes with GitHub and Google OAuth providers pre-configured for authentication. When users sign in with these providers, their accounts are automatically connected, allowing you to access their connected accounts and make API calls on their behalf.

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

## Account merging strategies

When a user attempts to sign in with an OAuth provider that matches an existing account, Neon Auth uses the following behavior:

- If a user signs in with an OAuth provider that matches an existing account, Neon Auth will link the OAuth identity to the existing account
- The user will be signed into their existing account
- This requires both credentials to be verified for security

<Admonition type="note">
  The available OAuth providers and their scopes are pre-configured in Neon Auth. Currently, Neon Auth does not support adding or modifying OAuth providers.
</Admonition>
