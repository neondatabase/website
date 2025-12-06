---
title: Set up OAuth
subtitle: Add Google or GitHub sign-in to your application
enableTableOfContents: true
updatedOn: '2025-11-30T00:00:00.000Z'
---

OAuth lets users sign in with their Google or GitHub account. Neon Auth handles the OAuth flow and creates a session after authorization.

## Development mode

OAuth providers (Google and GitHub) are enabled by default with shared credentials. This means you can start using OAuth in your app immediately. When you call `signIn.social()` with `"google"` or `"github"`, it works right away using Neon's shared keys.

These shared credentials are intended for development and testing only. For [production](#production-setup), configure your own OAuth app credentials.

## Sign in with OAuth

Call `signIn.social()` with your provider (`"google"` or `"github"`). The SDK redirects the user to the provider's authorization page, then back to your `callbackURL`:

<CodeWithLabel label="src/App.jsx">

<CodeTabs labels={["Google","GitHub"]}>

```jsx{6}
const handleGoogleSignIn = async () => {
  try {
    await auth.signIn.social({
      provider: "google",
      callbackURL: window.location.origin,
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};
```

```jsx{6}
const handleGitHubSignIn = async () => {
  try {
    await auth.signIn.social({
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

## Handle the callback

After the provider redirects back to your app, check for a session:

<CodeWithLabel label="src/App.jsx">

```jsx{9}
useEffect(() => {
  auth.getSession().then(({ data }) => {
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
await auth.signIn.social({
  provider: "google", // or "github"
  callbackURL: "/dashboard",
  newUserCallbackURL: "/welcome",
  errorCallbackURL: "/error",
});
```

</CodeWithLabel>

## Production setup

OAuth providers are enabled by default with shared keys. For production, configure your own OAuth app credentials:

1. Create OAuth apps with your providers:
   - [Google OAuth setup](https://developers.google.com/identity/protocols/oauth2/web-server)
   - [GitHub OAuth setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
2. In your project's **Settings** → **Auth** page, configure your Client ID and Client Secret for each provider

Your app will automatically use your configured credentials instead of the shared keys.

<DetailIconCards>

<a href="/docs/auth/guides/email-verification" description="Add email verification" icon="check">Email Verification</a>

</DetailIconCards>

<NeedHelp/>
