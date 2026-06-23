---
title: Magic Link
subtitle: Passwordless sign-in via email magic links
summary: >-
  Magic Link is a Neon Auth plugin that lets users sign in without a
  password by clicking a time-limited link sent to their email, with expiration
  configurable from 5 to 1440 minutes. Use this page when you want to add
  passwordless email authentication to a project that already has Neon Auth
  enabled, using either the Neon SDK's `signIn.magicLink()` method or the
  `magicLink` prop on `NeonAuthUIProvider`. The plugin also supports a webhook
  event (`send.magic_link`) to bypass the built-in mailer and deliver links
  through a custom email provider.
enableTableOfContents: true
updatedOn: '2026-06-05T17:20:32.620Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is built on [Better Auth](https://www.better-auth.com/) and provides full support for the [Magic Link](https://www.better-auth.com/docs/plugins/magic-link) plugin APIs through the Neon SDK. You do not need to manually install or configure the Better Auth Magic Link plugin.

Magic Link lets users sign in by clicking a link sent to their email. No password is required. The flow works like this:

1. The user enters their email address.
2. Neon Auth sends an email containing a unique, time-limited link.
3. The user clicks the link, which verifies the token, creates a session, and redirects them to your app.

## Prerequisites

- A Neon project with **Auth enabled**
- The **Magic Link plugin enabled** (see [Enable Magic Link](#enable-magic-link) below)

## Enable Magic Link

<Tabs labels={["Console", "API"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech).
2. Select your project and go to **Auth** > **Plugins**.
3. Toggle **Magic Link** on.
4. Configure the options:
   - **Link Expiration** (5-1440 minutes, default: 5) controls how long a magic link stays valid.
   - **Allow New User Registration** controls whether magic links can be used to create new accounts. When off, magic links only work for existing users.

![Neon Console Auth Plugins tab with Magic Link settings](/docs/auth/neon_auth_plugins_magic_link.png)

</TabItem>

<TabItem>

Send a `PATCH` request to configure the Magic Link plugin. All request body fields are optional; send only the fields you want to change.

```bash shouldWrap
curl -X PATCH \
  "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/plugins/magic-link" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "expires_in": 5,
    "disable_sign_up": false
  }'
```

| Field             | Type    | Default | Description                                           |
| ----------------- | ------- | ------- | ----------------------------------------------------- |
| `enabled`         | boolean | `false` | Whether the Magic Link plugin is active               |
| `expires_in`      | integer | `5`     | Minutes before the magic link expires (5-1440)        |
| `disable_sign_up` | boolean | `false` | When `true`, magic links only work for existing users |

</TabItem>

</Tabs>

## Use Magic Link with SDK methods

Build a custom magic link flow using the [Neon SDK](/docs/reference/javascript-sdk). Call `signIn.magicLink()` with the user's email and a callback URL. Neon Auth sends the email and redirects the user to `callbackURL` after they click the link.

```ts shouldWrap filename="src/send-magic-link.ts"
import { authClient } from '@/lib/auth/client';

export async function sendMagicLink(email: string) {
  const { error } = await authClient.signIn.magicLink({
    email,
    callbackURL: '/dashboard',
  });

  if (error) throw error;
}
```

After calling `signIn.magicLink()`, show the user a "check your email" message. For a complete working example with error handling, resend, and state management, see the [magic link example app](https://github.com/neondatabase/neon-js/tree/main/examples/neon-auth-magic-link-example) in the neon-js repository.

## Use Magic Link with UI components

If you're already using Neon Auth UI components, you can enable Magic Link with a single prop instead of building a custom form. Pass the `magicLink` prop to `NeonAuthUIProvider`:

```tsx shouldWrap filename="app/layout.tsx"
'use client';

import { authClient } from '@/lib/auth/client';
import { NeonAuthUIProvider } from '@neondatabase/auth-ui';
import '@neondatabase/auth-ui/css';
import './globals.css';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={'antialiased'}>
        <NeonAuthUIProvider
          authClient={authClient}
          magicLink // [!code ++]
        >
          {children}
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
```

Users can now sign in with a magic link by selecting the option on the sign-in screen and entering their email.

> If you haven't set up Neon Auth UI components yet, see the [UI components reference](/docs/auth/reference/ui-components) for setup, or the [Next.js](/docs/auth/quick-start/nextjs-api-only) or [React](/docs/auth/quick-start/react) quick start for building custom forms instead.

## Webhooks

If you subscribe to the `send.magic_link` event, Neon Auth skips its built-in email and calls your webhook instead, passing `link_type: "sign-in"` in the payload. Your handler is responsible for delivering the link (for example, via a custom email template or SMS).

See the [Webhooks guide](/docs/auth/guides/webhooks) for configuration details and payload format.

## Email provider configuration

For production environments, we strongly recommend using a dedicated email provider. The default shared SMTP should be used only during development. See the [Email provider configuration guide](/docs/auth/production-checklist#email-provider) for setup instructions.

<NeedHelp/>
