---
title: CredentialSignIn Component
subtitle: Neon Auth credential sign-in component
enableTableOfContents: true
tag: beta
---

# `<CredentialSignIn />`

A component that renders a sign-in form with email and password fields.

![CredentialSignIn](/docs/neon-auth/images/credential-sign-in.png)

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
