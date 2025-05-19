---
title: OAuthButton Component
subtitle: Neon Auth OAuth button component
enableTableOfContents: true
tag: beta
updatedOn: '2025-05-17T00:00:00.000Z'
---

Renders a customized `<OAuthButton />` for various providers to initiate sign-in or sign-up processes.

![OAuthButton](/docs/neon-auth/images/oauth-button.png)

For more information, see the [custom pages guide](/docs/neon-auth/customization/custom-pages).

## Props

- `provider`: `string` — The name of the OAuth provider (e.g., 'google', 'github', 'facebook').
- `type`: `'sign-in' | 'sign-up'` — Determines whether the button text is for signing in or signing up. (both are the same in terms of functionality)

## Example

```tsx
import { OAuthButton } from '@stackframe/stack';

export default function Page() {
  return (
    <div>
      <h1>Sign In</h1>
      <OAuthButton provider="google" type="sign-in" />
      <OAuthButton provider="github" type="sign-up" />
    </div>
  );
}
```
