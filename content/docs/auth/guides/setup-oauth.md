---
title: Set up OAuth
subtitle: Add Google, GitHub, or Vercel sign-in to your application
summary: >-
  Neon Auth OAuth setup adds Google, GitHub, and Vercel social sign-in to
  an application using `signIn.social()`, with Google enabled in development via
  shared credentials and GitHub and Vercel requiring custom OAuth app credentials.
  For production, register the provider's authorized redirect URI as
  `{NEON_AUTH_BASE_URL}/callback/{provider}` in each provider's console (not the
  app's callbackURL), and add every callbackURL origin to Neon Auth's trusted
  domains allowlist. Because each Neon branch has its own Auth base URL, OAuth
  credentials and redirect URIs must be configured per branch; preview
  deployments can use wildcard trusted domain patterns to cover multiple hosts.
enableTableOfContents: true
updatedOn: '2026-06-05T17:20:32.620Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

OAuth lets users sign in with their Google, GitHub, or Vercel account. Neon Auth handles the OAuth flow and creates a session after authorization.

## Development mode

Google OAuth is enabled by default with shared credentials for development and testing. You can start using Google sign-in immediately without any configuration.

<Admonition type="note">
GitHub and Vercel OAuth require custom credentials and are not available with shared credentials. See [Production setup](#production-setup) to configure your own OAuth apps.
</Admonition>

For production, configure your own OAuth app credentials for each provider you use. See [Production setup](#production-setup) below.

## Sign in with OAuth

Call `signIn.social()` with your provider (`"google"`, `"github"`, or `"vercel"`). The SDK sends the user to the provider's sign-in page. After the user authorizes, the provider redirects to Neon Auth's OAuth callback route (see [Production setup](#production-setup)), then Neon Auth redirects the browser to your **`callbackURL`** (must use a [trusted domain](/docs/auth/guides/configure-domains) in production).

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

After the OAuth exchange completes, Neon Auth redirects the browser to your **`callbackURL`**. Then load or refresh session state in your client:

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

### 1. Register redirect URIs with each provider

Neon Auth uses [Better Auth](https://www.better-auth.com/) callback routes. For each OAuth provider you enable, register a redirect URI with this shape:

```text
{NEON_AUTH_BASE_URL}/callback/{provider}
```

Use the **Auth base URL** from the Neon Console for that branch. In your app it is usually the `NEON_AUTH_BASE_URL` or `VITE_NEON_AUTH_URL` value, or the URL you pass to `createAuthClient`. Do not add a trailing slash before `/callback`.

Replace `{provider}` with `google`, `github`, or `vercel`.

Example authorized redirect URI for Google:

```text
https://ep-example.neonauth.us-east-2.aws.neon.tech/neondb/auth/callback/google
```

Whether you use the [Next.js auth proxy](/docs/auth/reference/nextjs-server#auth-handler) (`app/api/auth/[...path]/route.ts`) or call Neon Auth from the browser, the provider redirects to **`{NEON_AUTH_BASE_URL}/callback/{provider}`** for that branch.

<Admonition type="important" title="Do not confuse two different URLs">
The **`callbackURL`** argument in `signIn.social()` is where users land **after** Neon Auth finishes the flow. That URL must live on an origin you add under [trusted domains](/docs/auth/guides/configure-domains).

The provider's **authorized redirect URI** is where Google (or GitHub, and so on) sends the browser **during** the OAuth handshake. It must be **`{NEON_AUTH_BASE_URL}/callback/{provider}`**, not your app's homepage or only the `callbackURL`.

Using only your marketing site's URL in Google Cloud Console, or only the `callbackURL`, is a common cause of `redirect_uri_mismatch`.
</Admonition>

**Google Cloud Console**

Create an OAuth client with application type **Web application**. Under **Authorized redirect URIs**, add **`{NEON_AUTH_BASE_URL}/callback/google`** for each branch or environment (production, local testing against a branch, previews). Under **Authorized JavaScript origins**, include origins where your UI runs (for example `http://localhost:5173`, `https://myapp.com`) when Google asks for them, and include your Neon Auth origin (the scheme and host of `NEON_AUTH_BASE_URL`) if required.

**GitHub**

Set **Authorization callback URL** to **`{NEON_AUTH_BASE_URL}/callback/github`**.

**Vercel**

Follow [Vercel's OAuth app docs](https://vercel.com/docs/sign-in-with-vercel/manage-from-dashboard#create-an-app) and register **`{NEON_AUTH_BASE_URL}/callback/vercel`**.

### 2. Add trusted domains for your app

Before testing production OAuth, add every origin you pass as **`callbackURL`** (and related URLs) to Neon Auth's allowlist. See [Configure trusted domains](/docs/auth/guides/configure-domains).

### 3. Create OAuth apps and paste credentials into Neon

1. Create OAuth apps with your providers:
   - [Google OAuth setup](https://developers.google.com/identity/protocols/oauth2/web-server) (see [Google OAuth branding](#google-oauth-branding) below before going live)
   - [GitHub OAuth setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
   - [Vercel OAuth setup](https://vercel.com/docs/sign-in-with-vercel/manage-from-dashboard#create-an-app)
2. In the Neon Console, open your **project**, select the **branch**, open **Auth**, then enter the **Client ID** and **Client Secret** for each provider.

Neon Auth will use your configured credentials for that branch.

### Branches and preview deployments

Each branch has its own **`NEON_AUTH_BASE_URL`**. Register **`{NEON_AUTH_BASE_URL}/callback/google`** (and other providers you use) for every branch you test against (for example preview databases).

For preview deployments, trusted domains support **wildcard patterns** (for example `https://*.my-app-preview.vercel.app`), so you can cover many preview hosts without listing each one. See [Configure trusted domains](/docs/auth/guides/configure-domains), [Branching authentication](/docs/auth/branching-authentication), and the API for [trusted domains](https://api-docs.neon.tech/reference/addbranchneonauthtrusteddomain).

## Google OAuth branding

When using your own Google OAuth credentials, users will see a consent screen before signing in. Google shows a **Continue to** label that uses the hostname from your OAuth redirect URI (see [Production setup](#production-setup)), typically the Neon-managed host from your **`NEON_AUTH_BASE_URL`**.

Without completing the OAuth consent screen branding (app name, support email, and authorized domains in Google Cloud Console), the consent UI can look generic or confusing even when your Client ID and Client Secret are correct.

To show your app's name on the consent screen:

1. Go to [Google Cloud Console → OAuth consent screen](https://console.cloud.google.com/auth/branding)
2. Fill in the required app information:
   - **App name**: the name users will see on the consent screen
   - **User support email**: a contact email for users with auth questions
   - **Developer contact information**: your email address (not shown to users)
3. Under **Authorized domains**, add your app's domain (for example, `myapp.com`)
4. Save your changes

<Admonition type="important" title="Verification required for public apps">
Apps in **Testing** status only allow Google accounts you list as **test users**. Everyone else sees errors or a blocked consent flow regardless of branding. To show your production branding and allow all users, publish the OAuth consent screen and complete Google verification when required. Verification typically takes a few business days but can take longer depending on the scopes you request.
</Admonition>

<DetailIconCards>

<a href="/docs/auth/guides/email-verification" description="Add email verification" icon="check">Email Verification</a>

</DetailIconCards>

<NeedHelp/>
