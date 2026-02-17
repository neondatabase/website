---
title: Set up OAuth
subtitle: Add Google or GitHub sign-in to your application
summary: >-
  Step-by-step guide for setting up OAuth sign-in with Google, GitHub, or Vercel
  in your application using Neon Auth, including development and production
  configurations.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.749Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

OAuth lets users sign in with their Google, GitHub, or Vercel account. Neon Auth handles the OAuth flow and creates a session after authorization.

## Development mode

Google OAuth is enabled by default with shared credentials for development and testing. You can start using Google sign-in immediately without any configuration.

<Admonition type="note">
GitHub and Vercel OAuth require custom credentials and is not available with shared credentials. See [Production setup](#production-setup) to configure your own OAuth apps.
</Admonition>

For production, configure your own OAuth app credentials for both providers. See [Production setup](#production-setup) below.

## Sign in with OAuth

Call `signIn.social()` with your provider (`"google"`, `"github"` or `"vercel"`). The SDK redirects the user to the provider's authorization page, then back to your `callbackURL`:

<CodeTabs labels={["Google","GitHub","Vercel"]}>

```jsx {6} filename="src/App.jsx"
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

```jsx {6} filename="src/App.jsx"
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

```jsx {6} filename="src/App.jsx"
import { authClient } from './auth';

const handleVercelSignIn = async () => {
  try {
    await authClient.signIn.social({
      provider: "vercel",
      callbackURL: window.location.origin,
    });
  } catch (error) {
    console.error("Vercel sign-in error:", error);
  }
};
```

</CodeTabs>

## Handle the callback

After the provider redirects back to your app, check for a session:

```jsx {4-9} filename="src/App.jsx"
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

## Custom redirect URLs

Specify different URLs for new users or errors:

```jsx {3-5} filename="src/App.jsx"
await authClient.signIn.social({
  provider: "google", // or "github", "vercel"
  callbackURL: "/dashboard",
  newUserCallbackURL: "/welcome",
  errorCallbackURL: "/error",
});
```

## Production setup

For production, configure your own OAuth app credentials. GitHub and Vercel OAuth require custom credentials, while Google OAuth works with shared credentials for development but should use custom credentials in production.

1. Create OAuth apps with your providers:
   - [Google OAuth setup](https://developers.google.com/identity/protocols/oauth2/web-server)
   - [GitHub OAuth setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
   - [Vercel OAuth setup](https://vercel.com/docs/sign-in-with-vercel/manage-from-dashboard#create-an-app)
2. In your project's **Settings** → **Auth** page, configure your Client ID and Client Secret for each provider

Your app will automatically use your configured credentials

<DetailIconCards>

<a href="/docs/auth/guides/email-verification" description="Add email verification" icon="check">Email Verification</a>

</DetailIconCards>

<NeedHelp/>
