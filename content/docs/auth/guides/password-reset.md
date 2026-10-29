---
title: Password reset
subtitle: Allow users to reset forgotten passwords
summary: >-
  Managed Better Auth password reset sends a verification link to the user's email and
  requires email authentication to be enabled in project Settings. The pre-built
  `<ForgotPasswordForm>` and `<ResetPasswordForm>` components handle the full
  forgot-password flow; reset links expire after 15 minutes, and the SDK
  `resetPasswordForEmail` method is not yet supported.
enableTableOfContents: true
updatedOn: '2026-10-09T09:36:23.504Z'
---

Password reset allows users to securely reset forgotten passwords. Managed Better Auth supports password reset via verification links sent to the user's email address.

## Enable password reset

In your project's **Settings** → **Better Auth** page, ensure **Sign-up with Email** is enabled. Password reset is automatically available when email authentication is enabled.

## Using UI components

With [Better Auth UI](/docs/auth/reference/ui-components), password reset is built in. `npx shadcn@latest add @better-auth-ui/auth` adds the `forgot-password`, `reset-link-sent`, and `reset-password` views, and the sign-in view links to **Forgot password?**.

### 1. Route the auth views (#route-auth-views)

Render `<Auth>` for every auth path, as in the [Next.js App Router example](/docs/auth/reference/ui-components#nextjs-app-router):

```tsx filename="app/auth/[path]/page.tsx"
import { viewPaths } from '@better-auth-ui/core';
import { Auth } from '@/components/auth/auth';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(viewPaths.auth).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  return <Auth path={path} />;
}
```

`/auth/forgot-password` asks for the email and sends the reset link. The link opens `/auth/reset-password`, where the user sets a new password.

### 2. Render a single view (#render-a-single-view)

To place a view somewhere else, pass the view name instead of a path:

```tsx filename="src/ForgotPasswordPage.tsx"
import { Auth } from '@/components/auth/auth';

export function ForgotPasswordPage() {
  return <Auth view="forgotPassword" />;
}
```

The copied components (`components/auth/forgot-password.tsx` and `components/auth/reset-password.tsx`) are yours to edit.

<Admonition type="note">
SDK methods for password reset (`resetPasswordForEmail`) are not fully supported yet. Use the UI components for password reset functionality.
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
- [Customize the application name](/docs/auth/production-checklist#application-name) shown in password reset emails
- [Learn how to branch your auth](/docs/auth/branching-authentication) to use database branches with isolated auth environments
