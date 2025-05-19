---
title: CredentialSignUp Component
subtitle: Neon Auth credential sign-up component
enableTableOfContents: true
tag: beta
---

A component that renders a sign-up form with email and password fields.

![CredentialSignUp](/docs/neon-auth/images/credential-sign-up.png)

For more information, see the [custom pages guide](/docs/neon-auth/customization/custom-pages).

## Props

- `noPasswordRepeat` (optional): `boolean` — If set to `true`, the form will not include a password repeat field.

## Example

```tsx
import { CredentialSignUp } from '@stackframe/stack';

export default function Page() {
  return (
    <div>
      <h1>Sign Up</h1>
      <CredentialSignUp noPasswordRepeat />
    </div>
  );
}
```
