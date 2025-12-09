---
title: Set up OAuth
subtitle: Add Google or GitHub sign-in to your application
enableTableOfContents: true
updatedOn: '2025-12-08T00:00:00.000Z'
---

OAuth lets users sign in with their Google or GitHub account. Neon Auth handles the OAuth flow and creates a session after authorization.

## Development mode

Google OAuth is enabled by default with shared credentials for development and testing. You can start using Google sign-in immediately without any configuration.

<Admonition type="note">
GitHub OAuth requires custom credentials and is not available with shared credentials. See [Production setup](#production-setup) to configure GitHub OAuth.
</Admonition>

For production, configure your own OAuth app credentials for both providers. See [Production setup](#production-setup) below.

## Sign in with OAuth

Call `signIn.social()` with your provider (`"google"` or `"github"`). The SDK redirects the user to the provider's authorization page, then back to your `callbackURL`:

<CodeWithLabel label="src/App.jsx">

<CodeTabs labels={["Google","GitHub"]}>

```jsx{6}
import { authClient } from './auth';

const handleGoogleSignIn = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin,
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};
```

```jsx{6}
import { authClient } from './auth';

const handleGitHubSignIn = async () => {
  try {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: window.location.origin,
    });
  } catch (error) {
    console.error("GitHub sign-in error:", error);
  }
};
```

</CodeTabs>

</CodeWithLabel>

<Admonition type="note">
GitHub OAuth requires custom credentials to be configured. Google OAuth works with shared credentials for development.
</Admonition>

## Handle the callback

After the provider redirects back to your app, check for a session:

<CodeWithLabel label="src/App.jsx">

```jsx{9}
import { authClient } from './auth';

useEffect(() => {
  authClient.getSession().then(({ data }) => {
    if (data?.session) {
      setUser(data.session.user);
    }
    setLoading(false);
  });
}, []);
```

</CodeWithLabel>

## Custom redirect URLs

Specify different URLs for new users or errors:

<CodeWithLabel label="src/App.jsx">

```jsx{3-5}
await authClient.signIn.social({
  provider: "google", // or "github"
  callbackURL: "/dashboard",
  newUserCallbackURL: "/welcome",
  errorCallbackURL: "/error",
});
```

</CodeWithLabel>

## Production setup

For production, configure your own OAuth app credentials. GitHub OAuth requires custom credentials (shared credentials are not available), and Google OAuth should use custom credentials for production.

1. Create OAuth apps with your providers:
   - [Google OAuth setup](https://developers.google.com/identity/protocols/oauth2/web-server)
   - [GitHub OAuth setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
2. In your project's **Settings** → **Auth** page, configure your Client ID and Client Secret for each provider

Your app will automatically use your configured credentials. For Google, custom credentials replace the shared keys. For GitHub, custom credentials are required.

<DetailIconCards>

<a href="/docs/auth/guides/email-verification" description="Add email verification" icon="check">Email Verification</a>

</DetailIconCards>

<NeedHelp/>
