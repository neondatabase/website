---
title: Password reset
subtitle: Allow users to reset forgotten passwords
summary: >-
  Covers the setup of password reset functionality in Neon Auth, including
  enabling email authentication and using pre-built UI components for user
  password recovery.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.740Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Password reset allows users to securely reset forgotten passwords. Neon Auth supports password reset via verification links sent to the user's email address.

## Enable password reset

In your project's **Settings** → **Auth** page, ensure **Sign-up with Email** is enabled. Password reset is automatically available when email authentication is enabled.

## Using UI components

The easiest way to add password reset is using the pre-built UI components `<ForgotPasswordForm>` and `<ResetPasswordForm>`.

### 1. Enable forgot password in AuthView (#enable-forgot-password-authview)

If you're using `<AuthView>`, enable the forgot password flow:

```tsx filename="src/App.tsx"
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { authClient } from './auth';

export default function App() {
  return (
    <NeonAuthUIProvider authClient={authClient}>
      <AuthView pathname="sign-in" credentials={{ forgotPassword: true }} />
    </NeonAuthUIProvider>
  );
}
```

The `<AuthView>` component automatically includes a "Forgot password?" link when `forgotPassword` is enabled.

### 2. Use standalone form components (#use-standalone-forms)

For more control, use `<ForgotPasswordForm>` and `<ResetPasswordForm>` separately:

```tsx filename="src/App.tsx"
import { useState } from 'react';
import { ForgotPasswordForm, ResetPasswordForm } from '@neondatabase/neon-js/auth/react/ui';
import { authClient } from './auth';

export default function App() {
  const [step, setStep] = useState<'forgot' | 'reset'>('forgot');
  const [email, setEmail] = useState('');

  if (step === 'forgot') {
    return (
      <ForgotPasswordForm
        authClient={authClient}
        redirectTo={`${window.location.origin}/reset-password`}
        onSuccess={(data) => {
          setEmail(data.email);
          setStep('reset');
        }}
      />
    );
  }

  return (
    <ResetPasswordForm
      authClient={authClient}
      email={email}
      onSuccess={() => {
        setStep('forgot');
        // Redirect to sign-in or show success message
      }}
    />
  );
}
```

<Admonition type="note">
SDK methods for password reset (`resetPasswordForEmail`) are not fully supported yet. Use the UI components (`<ForgotPasswordForm>` and `<ResetPasswordForm>`) for password reset functionality.
</Admonition>

## Password reset flow

The complete password reset flow works as follows:

1. **User requests reset**: User enters their email and clicks "Send reset link"
2. **Email sent**: User receives a verification link with a reset token
3. **User clicks link**: User is redirected to your app's reset password page
4. **User enters new password**: User submits the new password
5. **Password reset**: Password is updated and user is signed in (if auto-sign-in is enabled)

## Reset link expiration

Password reset links expire after **15 minutes**. If a link expires, users need to request a new one.

## Next steps

- [Add email verification](/docs/auth/guides/email-verification) to ensure users own their email addresses
- [Learn how to branch your auth](/docs/auth/branching-authentication) to use database branches with isolated auth environments
