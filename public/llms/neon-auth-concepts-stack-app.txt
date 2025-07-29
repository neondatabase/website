# The StackApp Object

> The document details the StackApp object within Neon, explaining its structure and role in managing authentication and authorization processes for applications using Neon's platform.

## Source

- [The StackApp Object HTML](https://neon.com/docs/neon-auth/concepts/stack-app): The original HTML version of this documentation

> The most important object in your Neon Auth integration

By now, you may have seen the `useStackApp()` hook and the `stackServerApp` variable. Both return a `StackApp`, of type `StackClientApp` and `StackServerApp` respectively.

Nearly all of Neon Auth's functionality is on your `StackApp` object. Think of this object as the "connection" from your code to Neon Auth's servers. Each app is always associated with one specific project ID (by default the one found in your environment variables).

## `getXyz`/`listXyz` vs. `useXyz`

Most asynchronous functions on `StackApp` come in two flavors: `getXyz`/`listXyz` and `useXyz`. The former are asynchronous fetching functions which return a `Promise`, while the latter are React hooks that [suspend](https://react.dev/reference/react/Suspense) the current component until the data is available.

Normally, you would choose between the two based on whether you are in a React Server Component or a React Client Component. However, there are some scenarios where you use `getXyz` on the client, for example as the callback of an `onClick` handler.

```tsx
// server-component.tsx
async function ServerComponent() {
  const app = stackServerApp;
  // returns a Promise, must be awaited
  const user = await app.getUser();

  return <div>{user.displayName}</div>;
}

// client-component.tsx
('use client');
function ClientComponent() {
  const app = useStackApp();
  // returns the value directly
  const user = app.useUser();

  return <div>{user.displayName}</div>;
}
```

## Client vs. server

`StackClientApp` contains everything needed to build a frontend application, for example the currently authenticated user. It requires a publishable client key in its initialization (usually set by the `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` environment variable).

`StackServerApp` has all the functionality of `StackClientApp`, but also some functions with elevated permissions. This requires a secret server key (usually set by the `STACK_SECRET_SERVER_KEY` environment variable), which **must always be kept secret**.

   **Note**: Some of the functions have different return types; for example, `StackClientApp.getUser()` returns a `Promise<User>` while `StackServerApp.getUser()` returns a `Promise<ServerUser>`. The `Server` prefix indicates that the object contains server-only functionality.
