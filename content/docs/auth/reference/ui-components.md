---
title: UI Components Reference
subtitle: Quick reference for @neondatabase/neon-auth-ui components
enableTableOfContents: true
updatedOn: '2025-12-03T00:00:00.000Z'
---

Quick reference for `@neondatabase/neon-auth-ui` components. These components are built with [Better Auth UI](https://better-auth-ui.com/) and work with any Neon Auth adapter (Supabase, Better Auth, etc.).

## Installation

```bash
npm install @neondatabase/neon-auth-ui
```

## Core Components

### Authentication Components

| Component          | Purpose                                                            | Key Props               | Docs                                                                   |
| ------------------ | ------------------------------------------------------------------ | ----------------------- | ---------------------------------------------------------------------- |
| `<AuthView>`       | All-in-one auth UI with tab navigation between sign-in and sign-up | `pathname`              | [auth-view](https://better-auth-ui.com/components/auth-view)           |
| `<ProviderButton>` | Social OAuth buttons                                               | `provider`, `onSuccess` | [providers-card](https://better-auth-ui.com/components/providers-card) |

**Form Components:** `<SignUpForm>`, `<SignInForm>`, `<ForgotPasswordForm>`, `<ResetPasswordForm>`, and `<AuthCallback>` are also available. `<AuthView>` includes sign-in and sign-up functionality internally with tab navigation. Use the form components separately if you need more control over layout.

### User Management Components

| Component            | Purpose                               | Key Props              | Docs                                                                             |
| -------------------- | ------------------------------------- | ---------------------- | -------------------------------------------------------------------------------- |
| `<UserButton>`       | User menu dropdown with avatar        | -                      | [user-button](https://better-auth-ui.com/components/user-button)                 |
| `<UserAvatar>`       | Profile picture with Gravatar support | `user`, `size`         | [user-avatar](https://better-auth-ui.com/components/user-avatar)                 |
| `<SignedIn>`         | Conditional rendering when signed in  | `children`, `fallback` | [signed-in](https://better-auth-ui.com/components/signed-in)                     |
| `<SignedOut>`        | Conditional rendering when signed out | `children`, `fallback` | [signed-out](https://better-auth-ui.com/components/signed-out)                   |
| `<RedirectToSignIn>` | Redirect helper to sign-in page       | `redirectTo`           | [redirect-to-sign-in](https://better-auth-ui.com/components/redirect-to-sign-in) |
| `<RedirectToSignUp>` | Redirect helper to sign-up page       | `redirectTo`           | [redirect-to-sign-up](https://better-auth-ui.com/components/redirect-to-sign-up) |

### Settings Components

| Component              | Purpose                    | Docs                                                                                   |
| ---------------------- | -------------------------- | -------------------------------------------------------------------------------------- |
| Account settings cards | Account management UI      | [account-settings-cards](https://better-auth-ui.com/components/account-settings-cards) |
| Sessions management    | Active sessions list       | [sessions-card](https://better-auth-ui.com/components/sessions-card)                   |
| API keys               | API key management         | [api-keys-card](https://better-auth-ui.com/components/api-keys-card)                   |
| OAuth providers        | Linked accounts management | [accounts-card](https://better-auth-ui.com/components/accounts-card)                   |

### Organization Components

| Component                | Purpose                              | Key Props                    | Docs                                                                                         |
| ------------------------ | ------------------------------------ | ---------------------------- | -------------------------------------------------------------------------------------------- |
| `<OrganizationSwitcher>` | Switch between orgs/personal account | `onSelect`                   | [organization-switcher](https://better-auth-ui.com/components/organization-switcher)         |
| `<OrganizationsCard>`    | List user's organizations            | `onSelect`                   | [organizations-card](https://better-auth-ui.com/components/organizations-card)               |
| `<OrganizationView>`     | Organization details and settings    | `organizationId`             | [organization-view](https://better-auth-ui.com/components/organization-view)                 |
| Member management        | Organization member list with roles  | `organizationId`, `onUpdate` | [organization-members-card](https://better-auth-ui.com/components/organization-members-card) |
| Invitations              | Organization invitation management   | `organizationId`             | [accept-invitation-card](https://better-auth-ui.com/components/accept-invitation-card)       |

## Styling

Components use Tailwind CSS v4. Import the stylesheet:

```tsx
import '@neondatabase/neon-auth-ui/css';
```

For customization options, see **Styling** details within each Better Auth UI component docs page. Example: [Auth View styling](https://better-auth-ui.com/components/auth-view#styling).

## Example Usage

### Basic Auth Flow

```tsx
import { AuthView } from '@neondatabase/neon-auth-ui';
import '@neondatabase/neon-auth-ui/css';

function App() {
  return <AuthView />;
}
```

### User Menu

```tsx
import { UserButton } from '@neondatabase/neon-auth-ui';

function Header() {
  return (
    <header>
      <UserButton />
    </header>
  );
}
```

### Protected Route

```tsx
import { SignedIn, SignedOut, RedirectToSignIn } from '@neondatabase/neon-auth-ui';

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
- Check the [JavaScript SDK reference](/docs/auth/reference/javascript-sdk) for programmatic auth methods
