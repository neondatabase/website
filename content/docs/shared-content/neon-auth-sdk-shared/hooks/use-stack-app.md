This is a reference for the `useStackApp` hook in the {sdkName} SDK.

The `useStackApp` hook returns a `StackClientApp` object from the one that you provided in the [`StackProvider` component](../../components/stack-provider). If you want to learn more about the `StackClientApp` object, check out the [StackApp](../objects/stack-app) documentation.

Example:

```jsx
import { useStackApp } from "@stackframe/stack";

function MyComponent() {
  const stackApp = useStackApp();
  return <div>Sign In URL: {stackApp.urls.signIn}</div>;
}
```

## Usage

```jsx
import { useStackApp } from '@neondatabase/neon-auth-{sdkSlug}';

function MyComponent() {
  const stackApp = useStackApp();
  // ...
}
```

## Returns

- `StackClientApp`: The main client-side SDK object.
