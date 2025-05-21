---
title: Accessing User Data
subtitle: How to read, update, and protect user data in your app
enableTableOfContents: true
tag: beta
---

> Reading and writing user information, and protecting pages

You can build custom components that access the current user in your app. This guide covers the functions and hooks that let you do this.

## Client Component basics

The `useUser()` hook returns the current user in a Client Component. By default, it will return `null` if the user is not signed in.

```tsx shouldWrap
"use client";
import { useUser } from "@stackframe/stack"

export function MyClientComponent() {
  const user = useUser();
  return <div>{user ? `Hello, ${user.displayName ?? "anon"}` : 'You are not logged in'}</div>;
}
```

You can also use `useUser({ or: "redirect" })` to automatically redirect to the sign-in page if the user is not signed in.

## Server Component basics

Since `useUser()` is a stateful hook, you can't use it on server components. Instead, import `stackServerApp` and call `getUser()`:

```tsx shouldWrap
import { stackServerApp } from "@/stack";

export default async function MyServerComponent() {
  const user = await stackServerApp.getUser();
  return <div>{user ? `Hello, ${user.displayName ?? "anon"}` : 'You are not logged in'}</div>;
}
```

## Protecting a page

You can protect a page in three ways:  
- In Client Components with `useUser({ or: "redirect" })`
- In Server Components with `await getUser({ or: "redirect" })`
- With middleware

**Client Component:**
```tsx shouldWrap
"use client";
import { useUser } from "@stackframe/stack";

export default function MyProtectedClientComponent() {
  useUser({ or: 'redirect' });
  return <h1>You can only see this if you are logged in</h1>
}
```

**Server Component:**
```tsx shouldWrap
import { stackServerApp } from "@/stack";

export default async function MyProtectedServerComponent() {
  await stackServerApp.getUser({ or: 'redirect' });
  return <h1>You can only see this if you are logged in</h1>
}
```

**Middleware:**
```tsx shouldWrap
export async function middleware(request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return Response.redirect(new URL('/handler/sign-in', request.url));
  }
  return Response.next();
}
```

## User data

You can update attributes on a user object with the `user.update()` function (if your white-labeled setup allows it):

```tsx shouldWrap
'use client';
import { useUser } from "@stackframe/stack";

export default function MyClientComponent() {
  const user = useUser();
  return <button onClick={async () => await user.update({ displayName: "New Name" })}>
    Change Name
  </button>;
}
```

You can also store custom user data in the `clientMetadata`, `serverMetadata`, or `clientReadonlyMetadata` fields.

## Signing out

You can sign out the user by redirecting them to `/handler/sign-out` or by calling `user.signOut()`:

```tsx shouldWrap
"use client";
import { useUser } from "@stackframe/stack";

export default function SignOutButton() {
  const user = useUser();
  return user ? <button onClick={() => user.signOut()}>Sign Out</button> : "Not signed in";
}
```

## Example: Custom profile page

Stack automatically creates a user profile on sign-up. Here's an example page that displays this information:

```tsx shouldWrap
'use client';
import { useUser, useStackApp, UserButton } from "@stackframe/stack";

export default function PageClient() {
  const user = useUser();
  const app = useStackApp();
  return (
    <div>
      {user ? (
        <div>
          <UserButton />
          <p>Welcome, {user.displayName ?? "unnamed user"}</p>
          <p>Your e-mail: {user.primaryEmail}</p>
          <button onClick={() => user.signOut()}>Sign Out</button>
        </div>
      ) : (
        <div>
          <p>You are not logged in</p>
          <button onClick={() => app.redirectToSignIn()}>Sign in</button>
          <button onClick={() => app.redirectToSignUp()}>Sign up</button>
        </div>
      )}
    </div>
  );
}
```
