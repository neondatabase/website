---
title: '<StackHandler />'
subtitle: Neon Auth handler component for authentication routes
enableTableOfContents: true
tag: beta
---

Renders the appropriate authentication or account-related component based on the current route.

For detailed usage instructions, see the manual section of the [setup guide](/docs/neon-auth).

## Props

- `app`: `StackServerApp` — The Neon Auth server application instance.
- `routeProps`: `NextRouteProps` — The Next.js route props, usually the first argument of the page component (see below)
- `fullPage`: `boolean` — Whether to render the component in full-page mode.
- `componentProps`: `{ [K in keyof Components]?: Partial<ComponentProps<Components[K]>> }` — Props to pass to the rendered components.

## Example

```tsx title="app/handler/[...stack].tsx"
import { StackHandler } from '@stackframe/stack';
import { stackServerApp } from '@/stack';

export default function Handler(props: { params: any; searchParams: any }) {
  return (
    <StackHandler
      app={stackServerApp}
      routeProps={props}
      fullPage={true}
      componentProps={{
        SignIn: {
          /* SignIn component props */
        },
        SignUp: {
          /* SignUp component props */
        },
        // ... other component props
      }}
    />
  );
}
```
