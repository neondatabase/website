# <OAuthButtonGroup />

> The document details the implementation of the `<OAuthButtonGroup />` component, which facilitates OAuth authentication integration for Neon applications by providing a standardized button group for various OAuth providers.

## Source

- [<OAuthButtonGroup /> HTML](https://neon.com/docs/neon-auth/components/oauth-button-group): The original HTML version of this documentation

Renders all the `<OAuthButton />`s enabled for your Neon Auth project.



   **Note**: If there are no OAuth providers enabled, this component will be empty.

## Props

- `type`: `'sign-in' | 'sign-up'` — Specifies whether the buttons text are for sign-in or sign-up (both are the same in terms of functionality).

## Example

```tsx
import { OAuthButtonGroup } from '@stackframe/stack';

export default function Page() {
  return (
    <div>
      <h1>Sign In</h1>
      <OAuthButtonGroup type="sign-in" />
    </div>
  );
}
```
