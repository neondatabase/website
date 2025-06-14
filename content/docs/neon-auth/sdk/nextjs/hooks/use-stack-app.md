---
title: useStackApp
subtitle: Neon Auth React hook for accessing the StackClientApp object
enableTableOfContents: true
tag: beta
---

The `useStackApp` hook returns a `StackClientApp` object from the one that you provided in the [`StackProvider` component](/docs/neon-auth/components/stack-provider). If you want to learn more about the `StackClientApp` object, check out the [StackApp](/docs/neon-auth/sdk/nextjs/objects/stack-app) documentation.

#### Example

```jsx
import { useStackApp } from '@stackframe/stack';

function MyComponent() {
  const stackApp = useStackApp();
  return <div>Sign In URL: {stackApp.urls.signIn}</div>;
}
```
