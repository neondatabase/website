---
title: Use Neon Auth with Next.js (UI Components)
subtitle: Set up authentication in Next.js using pre-built UI components
enableTableOfContents: true
updatedOn: '2025-12-04T00:00:00.000Z'
layout: wide
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

<TwoColumnLayout>

<TwoColumnStep title="Enable Auth in your Neon project">
  <LeftContent>

Enable Auth in your [Neon project](https://console.neon.tech) and copy your Auth URL from Configuration.

**Console path:** Project → Branch → Auth → Configuration

  </LeftContent>
  <RightImage label="Console">

![Neon Auth Base URL](/docs/auth/neon-auth-base-url.png)

  </RightImage>
</TwoColumnStep>

<TwoColumnStep title="Install the Neon Auth SDK">
  <LeftContent>

Install the Neon SDK into your Next.js app.

<details>
<summary>_If you don't have a Next.js project_</summary>
```bash
npx create-next-app@latest my-app --yes
cd my-app
```
</details>
  </LeftContent>
  <RightCode label="Terminal">

```bash
npm install @neondatabase/neon-js
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up environment variables">
  <LeftContent>

Create a `.env` file in your project root and add your Auth URL:

<Admonition type="note">
Replace the URL with your actual Auth URL from the Neon Console.
</Admonition>

  </LeftContent>
  <RightCode label=".env">

```bash
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
```

  </RightCode>
</TwoColumnStep>


<TwoColumnStep title="Set up your auth API routes">
  <LeftContent>

We need to mount the `authApiHandler` handler to the auth API route. All Neon Auth APIs will be routed through this handler. Create a route file inside `/api/auth/[...path]` directory and add the following code:

  </LeftContent>
  <RightCode label="app/api/auth/[...path]/route.ts">

```typescript
import { authApiHandler } from '@neondatabase/neon-js/auth/next';

export const { GET, POST } = authApiHandler();
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Add neonAuthMiddleware()">
  <LeftContent>

The `neonAuthMiddleware()` ensures that user is authenticated before the request reaches your page components or API routes. Create `proxy.ts` file in your project root:

  </LeftContent>
  <RightCode label="proxy.ts">

```typescript
import { neonAuthMiddleware } from "@neondatabase/neon-js/auth/next";

export default neonAuthMiddleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    // Protected routes requiring authentication
    "/account/:path*",
  ],
};
```

  </RightCode>
</TwoColumnStep>



<Admonition type="note">
Your Next.js project is now fully configured to use Neon Auth. Now, lets proceed with setting up the Auth UI Provider and wrap your layout with auth context. 
</Admonition>


<TwoColumnStep title="Configure the auth client">
  <LeftContent>

The Auth UI components need access to auth APIs. Lets first create the auth client in `lib/auth/client.ts` file then we pass it to `NeonAuthUIProvider`

  </LeftContent>
  <RightCode label="lib/auth/client.ts">

```tsx
'use client';

import { createAuthClient } from '@neondatabase/neon-js/auth/next';

export const authClient = createAuthClient();
```

  </RightCode>
</TwoColumnStep>


<TwoColumnStep title="Wrap app layout with auth provider">
  <LeftContent>

The `NeonAuthUIProvider` component wraps your application with authentication context and provides essential hooks and auth methods required by auth components throughout your app. To make authentication globally accessible, wrap your entire app with `NeonAuthUIProvider`.

Copy and pase the following code into your `app/layout.tsx` file.

The `NeonAuthUIProvider` can be fully customized with settings you have configured in Neon Console. For example:

  - Add social providers like Google, Github, and Vercel on sign-in page
  - Allow your users to create and manage organizations in `/account/organizations` 
  - Localization support

<details>
<summary>Example: Adding optional props</summary>

```tsx
<NeonAuthUIProvider
  authClient={authClient}
  redirectTo="/account/settings"
  emailOTP

  social={{  // [!code ++]
    providers: ['google', 'github', 'vercel']  // [!code ++]
  }} // [!code ++]
  credentials={{ forgotPassword: true }} // [!code ++]
  organization // [!code ++]
>
  {children}
</NeonAuthUIProvider>
```
</details>


  </LeftContent>
  <RightCode label="app/layout.tsx">

```tsx
import { authClient } from '@/lib/auth/client'; // [!code ++]
import { NeonAuthUIProvider, UserButton } from '@neondatabase/neon-js/auth/react/ui'; // [!code ++]
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'My Neon App',
  description: 'A Next.js application with Neon Auth',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NeonAuthUIProvider  // [!code ++]
          authClient={authClient} // [!code ++]
          redirectTo="/account/settings" // [!code ++]
          emailOTP // [!code ++]
        > // [!code ++]
          <header className='flex justify-end items-center p-4 gap-4 h-16'> // [!code ++]
            <UserButton size="icon" /> // [!code ++]
          </header> // [!code ++]

          {children} // [!code ++]
        </NeonAuthUIProvider> // [!code ++]
      </body>
    </html>
  );
}
```

  </RightCode>
</TwoColumnStep>


<TwoColumnStep title="Add Neon Auth styles">
  <LeftContent>

Import the Neon Auth UI styles in your `app/globals.css` file. Add this line at the top of the file:

  </LeftContent>
  <RightCode label="app/globals.css">

```css
@import "tailwindcss";
@import "@neondatabase/neon-js/ui/css"; // [!code ++]

```

  </RightCode>
</TwoColumnStep>


<Admonition type="note">
Now that the Auth provider and styles are set up, let’s build the pages for signing up and signing in
</Admonition>

<TwoColumnStep title="Create the Auth & Account pages">
  <LeftContent>

Create a dynamic route segment for authentication and account views in `app/auth/[path]/page.tsx` and `app/account/[path]/page.tsx` respectively.

  - `AuthView` - with dynamic route segment covers the following paths:
    - `/auth/sign-in` - Sign in with email/password and social providers
    - `/auth/sign-up` New account registration
    - `/auth/sign-out` Sign the user out of the applications
  - `AccountView` - with dynamic route segment covers the following paths:
    - `/account/settings` - User can manage their profile details
    - `/account/security` - Change password and list active session


  </LeftContent>
  <RightCode label="create app & account page">

<Tabs labels={["Auth Page", "Account Page"]}>

<TabItem>

Create a new page in `app/auth/[path]/page.tsx` and copy-paste following code:

```tsx
import { AuthView } from '@neondatabase/neon-js/auth/react/ui';

export const dynamicParams = false;

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <AuthView path={path} />
    </main>
  );
}
```
</TabItem>

<TabItem>

Create a new page in `app/account/[path]/page.tsx` and copy-paste following code:

```tsx
import { AccountView } from '@neondatabase/neon-js/auth/react/ui';
import { accountViewPaths } from '@neondatabase/neon-js/auth/react/ui/server';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <main className="container p-4 md:p-6">
      <AccountView path={path} />
    </main>
  );
}
```

</TabItem>
</Tabs>

  </RightCode>
</TwoColumnStep>


<TwoColumnStep title="Start your app">
  <LeftContent>

Start the development server, and then open http://localhost:3000


  </LeftContent>
  <RightCode label="Terminal">

```bash
npm run dev
```

  </RightCode>
</TwoColumnStep>

</TwoColumnLayout>

## Next steps

- [Add email verification](/docs/auth/guides/email-verification)
- [Learn how to branch your auth](/docs/auth/branching-authentication)
