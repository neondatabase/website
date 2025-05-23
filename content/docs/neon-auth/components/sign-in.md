---
title: SignIn Component
subtitle: Neon Auth sign-in component for your app
enableTableOfContents: true
tag: beta
---

Renders a sign-in component with customizable options.

<img src="/docs/neon-auth/sign-in.png" alt="SignIn" width="400" />

For more information, see the [custom pages guide](/docs/neon-auth/customization/custom-pages).

## Props

- `fullPage` (optional): `boolean` — If true, renders the sign-in page in full-page mode.
- `automaticRedirect` (optional): `boolean` — If true, redirects to afterSignIn/afterSignUp URL when user is already signed in without showing the 'You are signed in' message.
- `extraInfo` (optional): `React.ReactNode` — Additional content to be displayed on the sign-in page.
- `firstTab` (optional): `'magic-link' | 'password'` — Determines which tab is initially active. Defaults to 'magic-link' if not specified.

## Example

```tsx
import { SignIn } from '@stackframe/stack';

export default function Page() {
  return (
    <div>
      <h1>Sign In</h1>
      <SignIn
        fullPage={true}
        automaticRedirect={true}
        firstTab='password'
        extraInfo={<>When signing in, you agree to our <a href="/terms">Terms</a></>}
      />
    </div>
  );
}
```
