---
title: SignUp Component
subtitle: Neon Auth sign-up component for your app
enableTableOfContents: true
tag: beta
updatedOn: '2025-05-17T00:00:00.000Z'
---

A component that renders a sign-up page with various customization options.

<img src="/docs/neon-auth/sign-up.png" alt="SignUp" width="400" />

For more information, see the [custom pages guide](/docs/neon-auth/customization/custom-pages).

## Props

- `fullPage` (optional): `boolean` — If true, renders the sign-up page in full-page mode.
- `automaticRedirect` (optional): `boolean` — If true, redirects to afterSignIn/afterSignUp URL when user is already signed in without showing the 'You are signed in' message.
- `noPasswordRepeat` (optional): `boolean` — If true, removes the password confirmation field.
- `extraInfo` (optional): `React.ReactNode` — Additional information to display on the sign-up page.
- `firstTab` (optional): `'magic-link' | 'password'` — Determines which tab is initially active. Defaults to 'magic-link' if not specified.

## Example

```tsx
import { SignUp } from '@stackframe/stack';

export default function Page() {
  return (
    <div>
      <h1>Sign Up</h1>
      <SignUp
        fullPage={true}
        automaticRedirect={true}
        firstTab="password"
        extraInfo={
          <>
            By signing up, you agree to our <a href="/terms">Terms</a>
          </>
        }
      />
    </div>
  );
}
```
