---
title: UI Components Reference
subtitle: Quick reference for Neon Auth UI components
summary: >-
  Step-by-step guide for integrating Neon Auth UI components using
  `@neondatabase/neon-js`, including installation, provider setup, and
  configuration of common props for customization.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.773Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Quick reference for Neon Auth UI components from `@neondatabase/neon-js`. These components are built with [Better Auth UI](https://better-auth-ui.com/) and work with Neon Auth.

## Installation

```bash
npm install @neondatabase/neon-js
```

## Provider Setup

Wrap your app with `NeonAuthUIProvider` to enable the UI components. The provider accepts configuration props that control which features are available.

### Basic Setup

```tsx
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import '@neondatabase/neon-js/ui/css';
import { authClient } from './auth';

function App() {
  return (
    <NeonAuthUIProvider authClient={authClient}>{/* Your app components */}</NeonAuthUIProvider>
  );
}
```

### Common Props

| Prop                         | Type                     | Description                                                       | Example                                                  |
| ---------------------------- | ------------------------ | ----------------------------------------------------------------- | -------------------------------------------------------- |
| `authClient`                 | `NeonAuthPublicApi`      | **Required.** Your Neon Auth client instance                      | `authClient={authClient}`                                |
| `social.providers`           | `SocialProvider[]`       | Array of OAuth providers to enable (e.g., Google, GitHub, Vercel) | `social={{ providers: ['google', 'github', 'vercel'] }}` |
| `navigate`                   | `(href: string) => void` | Navigation function for React Router                              | `navigate={navigate}`                                    |
| `Link`                       | `ComponentType`          | Custom Link component for routing                                 | `Link={RouterLink}`                                      |
| `localization`               | `AuthLocalization`       | Customize text labels throughout the UI                           | See example below                                        |
| `avatar`                     | `AvatarOptions`          | Avatar upload and display configuration                           | `avatar={{ size: 256, extension: 'webp' }}`              |
| `additionalFields`           | `AdditionalFields`       | Custom fields for sign-up and account settings                    | See example below                                        |
| `credentials.forgotPassword` | `boolean`                | Enable forgot password flow                                       | `credentials={{ forgotPassword: true }}`                 |

### Enable OAuth Providers

To enable Google sign-in (or other OAuth providers), add the `social` prop to the provider:

```tsx
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { authClient } from './auth';

function App() {
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      social={{
        providers: ['google', 'github', 'vercel'], // Enable Google, GitHub, and Vercel sign-in
      }}
    >
      {/* Your app */}
    </NeonAuthUIProvider>
  );
}
```

**Note:** Google OAuth works with shared credentials for development. GitHub OAuth requires custom credentials. The `social.providers` prop controls which provider buttons are displayed in the UI. For production, configure your own OAuth credentials in the Neon Console (Settings → Auth). See the [OAuth setup guide](/docs/auth/guides/setup-oauth) for details.

### React Router Integration

If using React Router, pass the `navigate` function and a custom `Link` component:

```tsx
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authClient } from './auth';

function App() {
  const navigate = useNavigate();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={navigate}
      Link={RouterLink}
      social={{
        providers: ['google', 'github', 'vercel'],
      }}
    >
      {/* Your app */}
    </NeonAuthUIProvider>
  );
}
```

### Customization Examples

**Custom localization:**

```tsx
<NeonAuthUIProvider
  authClient={authClient}
  localization={{
    SIGN_IN: 'Welcome Back',
    SIGN_UP: 'Create Account',
    FORGOT_PASSWORD: 'Forgot Password?',
  }}
>
```

**Custom sign-up fields:**

```tsx
<NeonAuthUIProvider
  authClient={authClient}
  additionalFields={{
    company: {
      label: 'Company',
      placeholder: 'Your company name',
      type: 'string',
      required: false,
    },
  }}
  signUp={{
    fields: ['name', 'company'],
  }}
>
```

For complete prop documentation, see the TypeScript types exported from `@neondatabase/neon-js/auth/react`.

## Core Components

### Authentication Components

| Component    | Purpose                                           | Key Props  | Docs                                                         |
| ------------ | ------------------------------------------------- | ---------- | ------------------------------------------------------------ |
| `<AuthView>` | All-in-one auth UI with sign-in and sign-up forms | `pathname` | [auth-view](https://better-auth-ui.com/components/auth-view) |

**Form Components:** `<SignUpForm>`, `<SignInForm>`, `<ForgotPasswordForm>`, `<ResetPasswordForm>`, and `<AuthCallback>` are also available. `<AuthView>` includes sign-in and sign-up functionality with a "create account" link to switch between forms. Use the form components separately if you need more control over layout.

**OAuth Provider Buttons:** OAuth provider buttons (Google, GitHub, Vercel, etc.) appear automatically in `<AuthView>` when configured via the `social.providers` prop. OAuth buttons do not appear in standalone `<SignInForm>` or `<SignUpForm>` components.

### User Management Components

| Component            | Purpose                               | Key Props              | Docs                                                                             |
| -------------------- | ------------------------------------- | ---------------------- | -------------------------------------------------------------------------------- |
| `<UserButton>`       | User menu dropdown with avatar        | -                      | [user-button](https://better-auth-ui.com/components/user-button)                 |
| `<UserAvatar>`       | Profile picture with Gravatar support | `user`, `size`         | [user-avatar](https://better-auth-ui.com/components/user-avatar)                 |
| `<SignedIn>`         | Conditional rendering when signed in  | `children`, `fallback` | [signed-in](https://better-auth-ui.com/components/signed-in)                     |
| `<SignedOut>`        | Conditional rendering when signed out | `children`, `fallback` | [signed-out](https://better-auth-ui.com/components/signed-out)                   |
| `<RedirectToSignIn>` | Redirect helper to sign-in page       | `redirectTo`           | [redirect-to-sign-in](https://better-auth-ui.com/components/redirect-to-sign-in) |
| `<RedirectToSignUp>` | Redirect helper to sign-up page       | `redirectTo`           | [redirect-to-sign-up](https://better-auth-ui.com/components/redirect-to-sign-up) |

## Styling

Choose the import method based on your project setup:

### Without Tailwind CSS

If your project doesn't use Tailwind CSS, import the pre-built CSS bundle:

```typescript
// In your root layout or app entry point
import '@neondatabase/neon-js/ui/css';
```

This includes all necessary styles (~47KB minified) with no additional configuration required.

### With Tailwind CSS v4

If your project already uses Tailwind CSS v4, import the Tailwind-ready CSS to avoid duplicate styles:

```css
/* In your main CSS file (e.g., globals.css) */
@import 'tailwindcss';
@import '@neondatabase/neon-js/ui/tailwind';
```

This imports only the theme variables. Your Tailwind build generates the utility classes.

<Admonition type="warning">
Never import both paths. This causes duplicate styles.
</Admonition>

For customization options, see **Styling** details within each Better Auth UI component docs page. Example: [Auth View styling](https://better-auth-ui.com/components/auth-view#styling).

## Example Usage

### Basic Auth Flow

```tsx
import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import '@neondatabase/neon-js/ui/css';

function App() {
  return <AuthView pathname="sign-in" />;
}
```

### User Menu

```tsx
import { UserButton } from '@neondatabase/neon-js/auth/react/ui';
import { authClient } from './auth';

function Header() {
  return (
    <header>
      <UserButton authClient={authClient} />
    </header>
  );
}
```

### Protected Route

```tsx
import { SignedIn, SignedOut, RedirectToSignIn } from '@neondatabase/neon-js/auth/react/ui';

function Dashboard() {
  return (
    <>
      <SignedIn>
        <h1>Dashboard</h1>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
```

## Next Steps

- See [React with Neon Auth UI](/docs/auth/quick-start/react-router-components) for a complete example
- Check the [Neon Auth & Data API TypeScript SDKs](/docs/reference/javascript-sdk) for programmatic auth methods
