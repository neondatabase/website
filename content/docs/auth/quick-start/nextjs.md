---
title: Use Neon Auth with Next.js (UI Components)
subtitle: Set up authentication in Next.js using pre-built UI components
summary: >-
  Covers the setup of Neon Auth in a Next.js application using pre-built UI
  components, including enabling authentication, installing the SDK, configuring
  environment variables, and creating an auth server instance.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.768Z'
layout: wide
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

<Admonition type="note">
Upgrading from Neon Auth SDK v0.1? See the [migration guide](/docs/auth/migrate/from-auth-v0.1) for step-by-step instructions.
</Admonition>

<TwoColumnLayout>

<TwoColumnLayout.Step title="Enable Auth in your Neon project">
<TwoColumnLayout.Block>

Enable Auth in your [Neon project](https://console.neon.tech) and copy your Auth URL from Configuration.

**Console path:** Project → Branch → Auth → Configuration

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Console">

![Neon Auth Base URL](/docs/auth/neon-auth-base-url.png)

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Install the Neon Auth SDK">
<TwoColumnLayout.Block>

Install the Neon SDK into your Next.js app.

<details>
<summary>_If you don't have a Next.js project_</summary>
```bash
npx create-next-app@latest my-app --yes
cd my-app
```
</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Terminal">

```bash
npm install @neondatabase/auth
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Set up environment variables">
<TwoColumnLayout.Block>

Create a `.env` file in your project root and add your Auth URL and a cookie secret:

<Admonition type="note">
Replace the Auth URL with your actual Auth URL from the Neon Console. Generate a secure cookie secret with `openssl rand -base64 32`.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label=".env">

```bash
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create auth server instance">
<TwoColumnLayout.Block>

Create a unified auth instance in `lib/auth/server.ts`. This single instance provides all server-side auth functionality:

- `.handler()` for API routes
- `.middleware()` for route protection
- `.getSession()` and all Better Auth server methods

See the [Next.js Server SDK reference](/docs/auth/reference/nextjs-server) for complete API documentation.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="lib/auth/server.ts">

```typescript
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Set up auth API routes">
<TwoColumnLayout.Block>

Create an API route handler that proxies auth requests. All Neon Auth APIs will be routed through this handler. Create a route file inside `/api/auth/[...path]` directory:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="app/api/auth/[...path]/route.ts">

```typescript
import { auth } from '@/lib/auth/server';

export const { GET, POST } = auth.handler();
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Add authentication middleware">
<TwoColumnLayout.Block>

The middleware ensures users are authenticated before accessing protected routes. Create `proxy.ts` file in your project root:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="proxy.ts">

```typescript
import { auth } from '@/lib/auth/server';

export default auth.middleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: '/auth/sign-in',
});

export const config = {
  matcher: [
    // Protected routes requiring authentication
    '/account/:path*',
  ],
};
```

</TwoColumnLayout.Block>

<TwoColumnLayout.Footer>
<Admonition type="note">
Your Next.js project is now fully configured to use Neon Auth. Now, lets proceed with setting up the Auth UI Provider and wrap your layout with auth context.
</Admonition>
</TwoColumnLayout.Footer>

</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Configure the auth client">
<TwoColumnLayout.Block>

The Auth UI components need access to auth APIs. Create the auth client in `lib/auth/client.ts` file, which you'll pass to `NeonAuthUIProvider`.

<Admonition type="note">
The server-side `auth` instance was already created in a previous step. The client is separate and handles browser-side auth operations.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="lib/auth/client.ts">

```tsx
'use client';

import { createAuthClient } from '@neondatabase/auth/next';

export const authClient = createAuthClient();
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Wrap app layout with auth provider">
<TwoColumnLayout.Block>

The `NeonAuthUIProvider` component wraps your application with authentication context and provides essential hooks and auth methods required by auth components throughout your app. To make authentication globally accessible, wrap your entire app with `NeonAuthUIProvider`.

<Admonition type="important" title="Hydration Warning">
Add `suppressHydrationWarning` to the `<html>` tag to prevent React hydration errors caused by `next-themes` client-side theme switching. This property only applies one level deep, so it won't block hydration warnings on other elements.
</Admonition>

Copy and paste the following code into your `app/layout.tsx` file.

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

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="app/layout.tsx">

```tsx
import { authClient } from '@/lib/auth/client'; // [!code ++]
import { NeonAuthUIProvider, UserButton } from '@neondatabase/auth/react'; // [!code ++]
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
    <html lang="en" suppressHydrationWarning> // [!code ++]
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

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>
<TwoColumnLayout.Step title="Add Neon Auth styles">
<TwoColumnLayout.Block>

Import the Neon Auth UI styles in your `app/globals.css` file. Add this line at the top of the file:

<Admonition type="tip" title="Not using Tailwind?">
See [UI Component Styles](/docs/auth/reference/ui-components#styling) for alternative setup options.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="app/globals.css">

```css
@import "tailwindcss";
@import "@neondatabase/auth/ui/tailwind"; // [!code ++]

```

</TwoColumnLayout.Block>
<TwoColumnLayout.Footer>
<Admonition type="note">
Now that the Auth provider and styles are set up, let's build the pages for signing up and signing in
</Admonition>
</TwoColumnLayout.Footer>
</TwoColumnLayout.Step>
<TwoColumnLayout.Step title="Create the Auth & Account pages">
<TwoColumnLayout.Block>
Create a dynamic route segment for authentication and account views in `app/auth/[path]/page.tsx` and `app/account/[path]/page.tsx` respectively.

- `AuthView` - with dynamic route segment covers the following paths:
  - `/auth/sign-in` - Sign in with email/password and social providers
  - `/auth/sign-up` New account registration
  - `/auth/sign-out` Sign the user out of the applications
- `AccountView` - with dynamic route segment covers the following paths:
  - `/account/settings` - User can manage their profile details
  - `/account/security` - Change password and list active session

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="create app & account page">

<Tabs labels={["Auth Page", "Account Page"]}>

<TabItem>

Create a new page in `app/auth/[path]/page.tsx` and copy-paste following code:

```tsx
import { AuthView } from '@neondatabase/auth/react';

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
import { AccountView } from '@neondatabase/auth/react';
import { accountViewPaths } from '@neondatabase/auth/react/ui/server';

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

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Access user data on server and client">
<TwoColumnLayout.Block>

**Server Components:**

- Use the `auth` instance from `lib/auth/server.ts` to access session data and call auth methods in server components and server actions.

**Client Components:**

- Use the `authClient` from `lib/auth/client.ts` to access session data and call auth methods in client components.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Access user data">

<Tabs labels={["Server Component", "Client Component", "API Route"]}>

<TabItem>

Create a new page at `app/server-rendered-page/page.tsx` and add the following code:

```tsx
import { auth } from '@/lib/auth/server';

// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default async function ServerRenderedPage() {
  const { data: session } = await auth.getSession();

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Server Rendered Page</h1>

      <p className="text-gray-400">
        Authenticated:{' '}
        <span className={session ? 'text-green-500' : 'text-red-500'}>
          {session ? 'Yes' : 'No'}
        </span>
      </p>

      {session?.user && <p className="text-gray-400">User ID: {session.user.id}</p>}

      <p className="font-medium text-gray-700 dark:text-gray-200">Session and User Data:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
        {JSON.stringify({ session: session?.session, user: session?.user }, null, 2)}
      </pre>
    </div>
  );
}
```

</TabItem>

<TabItem>

Create a new page at `app/client-rendered-page/page.tsx` and add the following code:

```tsx
'use client';

import { authClient } from '@/lib/auth/client';

export default function ClientRenderedPage() {
  const { data } = authClient.useSession();

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Client Rendered Page</h1>

      <p className="text-gray-400">
        Authenticated:{' '}
        <span className={data?.session ? 'text-green-500' : 'text-red-500'}>
          {data?.session ? 'Yes' : 'No'}
        </span>
      </p>

      {data?.user && <p className="text-gray-400">User ID: {data.user.id}</p>}

      <p className="font-medium text-gray-700 dark:text-gray-200">Session and User Data:</p>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
        {JSON.stringify({ session: data?.session, user: data?.user }, null, 2)}
      </pre>
    </div>
  );
}
```

</TabItem>

<TabItem>

Create a new API route at `app/api/secure-api-route/route.ts` and add the following code:

```tsx
import { auth } from '@/lib/auth/server';

export async function GET() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return Response.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  return Response.json({ session: session.session, user: session.user });
}
```

</TabItem>
</Tabs>

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>
<TwoColumnLayout.Step title="Start your app">
<TwoColumnLayout.Block>

Start the development server, and then open http://localhost:3000/

- Visit `/auth/sign-in` to sign in or sign up
- Visit `/account/settings` to view account settings
- Visit `/server-rendered-page` to see user data on server
- Visit `/client-rendered-page` to see user data on client
- Visit `/api/secure-api-route` to see user data from API route

<Admonition type="note" title="Safari users">
Safari blocks third-party cookies on non-HTTPS connections. Use `npm run dev -- --experimental-https` and open `https://localhost:3000` instead.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Terminal">

```bash
npm run dev
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

</TwoColumnLayout>

## Next steps

- [Add email verification](/docs/auth/guides/email-verification)
- [Learn how to branch your auth](/docs/auth/branching-authentication)
