---
title: "<CredentialSignIn />"
subtitle: Neon Auth credential sign-in component
enableTableOfContents: true
tag: beta
---

A component that renders a sign-in form with email and password fields.

<img src="/docs/neon-auth/credential-sign-in.png" alt="CredentialSignIn" width="400" />

For more information, see the [custom pages guide](/docs/neon-auth/customization/custom-pages).

## Props

This component does not accept any props.

## Example

```tsx
import { CredentialSignIn } from '@stackframe/stack';

export default function Page() {
  return (
    <div>
      <h1>Sign In</h1>
      <CredentialSignIn />
    </div>
  );
}
```
