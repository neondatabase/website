This is a reference for the `useUser` hook in the {sdkName} SDK.

This standalone React hook is an alias for `useStackApp().useUser()`. It only exists for convenience; it does not have any additional functionality.

For more information, see the [documentation for `stackClientApp.useUser()`](/docs/neon-auth/sdk/nextjs/objects/stack-app#stackclientappuseuseroptions).

Returns the current user object, or `null` if not signed in.

## Usage

```jsx
import { useUser } from '@neondatabase/neon-auth-{sdkSlug}';

function MyComponent() {
  const user = useUser();
  return user ? <div>Hello, {user.name}</div> : <div>Not signed in</div>;
}
```

## Returns

- `CurrentUser | null`: The current user, or `null` if not signed in.

### tokenStore `union` **required**
Where to store the user's session tokens.

#### Next.js
In Next.js apps, use `"nextjs-cookie"` to store tokens in Next.js cookies.

#### React
In React apps, use `"cookie"` to store tokens in browser cookies.

#### Possible values
- `"nextjs-cookie"`: Uses Next.js cookies (Next.js only)
- `"cookie"`: Uses browser cookies (both React and Next.js)
- `"memory"`: Uses in-memory storage (both React and Next.js)
- `{ accessToken: string, refreshToken: string }`: Uses provided tokens (both React and Next.js)
- `Request`: Uses the provided request object (server-side only)
