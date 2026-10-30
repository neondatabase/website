---
title: Set up OAuth
subtitle: Add Google, GitHub, Vercel, Apple, or Microsoft sign-in to your application
summary: >-
  Managed Better Auth OAuth setup adds Google, GitHub, Vercel, Apple, and
  Microsoft Entra ID social sign-in to an application using `signIn.social()`,
  with Google enabled in development via shared credentials and the other
  providers requiring custom OAuth app credentials.
  For production, register the provider's authorized redirect URI as
  `{NEON_AUTH_BASE_URL}/callback/{provider}` in each provider's console (not the
  app's callbackURL), and add every callbackURL origin to Managed Better Auth's trusted
  domains allowlist. Because each Neon branch has its own Auth base URL, OAuth
  credentials and redirect URIs must be configured per branch; preview
  deployments can use wildcard trusted domain patterns to cover multiple hosts.
enableTableOfContents: true
updatedOn: '2026-09-17T22:48:53.595Z'
---

OAuth lets users sign in with their Google, GitHub, Vercel, Apple, or Microsoft account. Managed Better Auth handles the OAuth flow and creates a session after authorization.

## Development mode

Google OAuth is enabled by default with shared credentials for development and testing. You can start using Google sign-in immediately without any configuration.

### About shared credentials

Shared credentials let you add Google sign-in with no setup, using a Google OAuth app that Neon owns. That one app is shared by every project that uses shared credentials, including projects belonging to other Neon users. It isn't unique to you.

When someone signs in, Google shows them Neon's name and logo, not your app's, because the sign-in runs through Neon's app rather than one you own. Your users are effectively trusting Neon, and you don't control the app's branding, its permission scopes, or the credentials.

This is safe for development and testing. An outside website can't use the shared app to capture your users, because Google only ever redirects sign-ins back to Neon, and Neon keeps each project's sign-ins separate. The reason not to use it in production is trust and control. Real users should see your app on the consent screen, and you should own the credentials.

For production, add your own Google Client ID and secret. See [Production setup](#production-setup).

<Admonition type="note">
GitHub, Vercel, Apple, and Microsoft OAuth require custom credentials and are not available with shared credentials. See [Production setup](#production-setup) to configure your own OAuth apps.
</Admonition>

## Sign in with OAuth

Call `signIn.social()` with your provider (`"google"`, `"github"`, `"vercel"`, `"apple"`, or `"microsoft"`). The SDK sends the user to the provider's sign-in page. After the user authorizes, the provider redirects to Managed Better Auth's OAuth callback route (see [Production setup](#production-setup)), then Managed Better Auth redirects the browser to your **`callbackURL`** (must use a [trusted domain](/docs/auth/guides/configure-domains) in production).

<CodeTabs labels={["Google","GitHub","Vercel","Apple","Microsoft"]}>

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

```jsx {6} filename="src/App.jsx"
import { authClient } from './auth';

const handleAppleSignIn = async () => {
  try {
    await authClient.signIn.social({
      provider: "apple",
      callbackURL: window.location.origin,
    });
  } catch (error) {
    console.error("Apple sign-in error:", error);
  }
};
```

```jsx {6} filename="src/App.jsx"
import { authClient } from './auth';

const handleMicrosoftSignIn = async () => {
  try {
    await authClient.signIn.social({
      provider: "microsoft",
      callbackURL: window.location.origin,
    });
  } catch (error) {
    console.error("Microsoft sign-in error:", error);
  }
};
```

</CodeTabs>

## Handle the callback

After the OAuth exchange completes, Managed Better Auth redirects the browser to your **`callbackURL`**. Then load or refresh session state in your client:

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
  provider: "google", // or "github", "vercel", "apple", "microsoft"
  callbackURL: "/dashboard",
  newUserCallbackURL: "/welcome",
  errorCallbackURL: "/error",
});
```

## Production setup

For production, configure your own OAuth app credentials. GitHub, Vercel, Apple, and Microsoft OAuth require custom credentials, while Google OAuth works with shared credentials for development but should use custom credentials in production.

### 1. Register redirect URIs with each provider

Managed Better Auth uses [Better Auth](https://www.better-auth.com/) callback routes. For each OAuth provider you enable, register a redirect URI with this shape:

```text
{NEON_AUTH_BASE_URL}/callback/{provider}
```

Use the **Auth base URL** from the Neon Console for that branch. In your app it is usually the `NEON_AUTH_BASE_URL` or `VITE_NEON_AUTH_URL` value, or the URL you pass to `createAuthClient`. Do not add a trailing slash before `/callback`.

Replace `{provider}` with `google`, `github`, `vercel`, `apple`, or `microsoft`.

Example authorized redirect URI for Google:

```text
https://ep-example.neonauth.us-east-2.aws.neon.tech/neondb/auth/callback/google
```

Whether you use the [Next.js auth proxy](/docs/auth/reference/nextjs-server#auth-handler) (`app/api/auth/[...path]/route.ts`) or call Managed Better Auth from the browser, the provider redirects to **`{NEON_AUTH_BASE_URL}/callback/{provider}`** for that branch.

<Admonition type="important" title="Do not confuse two different URLs">
The **`callbackURL`** argument in `signIn.social()` is where users land **after** Managed Better Auth finishes the flow. That URL must live on an origin you add under [trusted domains](/docs/auth/guides/configure-domains).

The provider's **authorized redirect URI** is where Google (or GitHub, and so on) sends the browser **during** the OAuth handshake. It must be **`{NEON_AUTH_BASE_URL}/callback/{provider}`**, not your app's homepage or only the `callbackURL`.

Using only your marketing site's URL in Google Cloud Console, or only the `callbackURL`, is a common cause of `redirect_uri_mismatch`.
</Admonition>

**Google Cloud Console**

Create an OAuth client with application type **Web application**. Under **Authorized redirect URIs**, add **`{NEON_AUTH_BASE_URL}/callback/google`** for each branch or environment (production, local testing against a branch, previews). Under **Authorized JavaScript origins**, include origins where your UI runs (for example `http://localhost:5173`, `https://myapp.com`) when Google asks for them, and include your Managed Better Auth origin (the scheme and host of `NEON_AUTH_BASE_URL`) if required.

**GitHub**

Set **Authorization callback URL** to **`{NEON_AUTH_BASE_URL}/callback/github`**.

**Vercel**

Set the authorization callback URL to **`{NEON_AUTH_BASE_URL}/callback/vercel`**. In the Vercel app's permissions, enable the **`openid`**, **`email`**, and **`profile`** scopes, which Managed Better Auth requires to create a session. See [Vercel's OAuth app docs](https://vercel.com/docs/sign-in-with-vercel/manage-from-dashboard#create-an-app).

**Apple**

In the [Apple Developer portal](https://developer.apple.com/account/resources/identifiers/list), create a **Services ID** and enable **Sign in with Apple** for it. When you configure it, add the host of your `NEON_AUTH_BASE_URL` under **Domains and Subdomains**, and set **Return URLs** to **`{NEON_AUTH_BASE_URL}/callback/apple`**. Then create a key with **Sign in with Apple** enabled and download the `.p8` file. Apple lets you download it only once.

You need four values for Neon:

- **Services ID**: the identifier of the Services ID (for example, `com.example.app.signin`). This is your client ID.
- **Team ID**: your 10-character Apple team ID, shown in your Apple Developer account's membership details.
- **Key ID**: the 10-character ID of the key you created.
- **Private key**: the full contents of the `.p8` file, including the `BEGIN` and `END` lines.

Managed Better Auth signs a fresh client secret from your private key for each sign-in, so you don't need to rotate a client secret every six months.

**Microsoft Entra ID**

In the [Microsoft Entra admin center](https://entra.microsoft.com), go to **App registrations** and create a new registration. Under **Redirect URI**, choose the **Web** platform and enter **`{NEON_AUTH_BASE_URL}/callback/microsoft`**. Copy the **Application (client) ID**, then go to **Certificates & secrets** and create a client secret. Copy the secret's **Value**, not its **Secret ID**.

The tenant controls which Microsoft accounts can sign in:

- `common`: work, school, and personal Microsoft accounts (the default)
- `organizations`: work and school accounts only
- `consumers`: personal Microsoft accounts only
- A tenant ID (GUID) or verified domain: accounts from that one tenant only

<Admonition type="important" title="Add the xms_edov and acct claims">
Managed Better Auth treats a Microsoft email as verified only when the ID token includes the `xms_edov` claim set to `true` and the `acct` claim set to `0` (a member of the tenant, not a guest). In your app registration, go to **Token configuration**, select **Add optional claim**, choose **ID**, and add `xms_edov` and `acct`.

Without these claims, every Microsoft email is treated as unverified. A Microsoft sign-in then can't link to an existing user with the same email, and the user is redirected to your app with `error=account_not_linked`.
</Admonition>

### 2. Add trusted domains for your app

Before testing production OAuth, add every origin you pass as **`callbackURL`** (and related URLs) to Managed Better Auth's allowlist. See [Configure trusted domains](/docs/auth/guides/configure-domains).

### 3. Create OAuth apps and paste credentials into Neon

Create OAuth apps with your providers:

- [Google OAuth setup](https://developers.google.com/identity/protocols/oauth2/web-server) (see [Google OAuth branding](#google-oauth-branding) below before going live)
- [GitHub OAuth setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- [Vercel OAuth setup](https://vercel.com/docs/sign-in-with-vercel/manage-from-dashboard#create-an-app)
- [Sign in with Apple setup](https://developer.apple.com/help/account/configure-app-capabilities/configure-sign-in-with-apple-for-the-web)
- [Microsoft Entra app registration](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)

Then give the credentials to Managed Better Auth for that branch. For most providers, that's the **Client ID** and **Client Secret**. Apple and Microsoft need [extra values](#1-register-redirect-uris-with-each-provider).

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

In the Neon Console, open your **project** and select the **branch**, then go to **Settings** > **Better Auth**. Under **OAuth providers**, click **Add OAuth provider** (or open an existing provider's **⋮** menu and choose **Configure**).

The dialog shows the exact **authorization callback URL** to register with the provider (for example, `{NEON_AUTH_BASE_URL}/callback/github`). Copy it from the dialog rather than assembling it by hand, then enter your **Client ID** and **Client Secret**. For Apple, enter the **Services ID**, **Team ID**, **Key ID**, and the contents of your `.p8` private key. For Microsoft, also enter the **Tenant ID**. If you leave it blank, Neon uses `common`.

Click **Add** (or **Update** when editing an existing provider) to save. Neon applies the change to the branch and confirms with a success message. Your app uses the new credentials on the next sign-in. A provider using Neon's shared credentials shows a **Shared credentials** badge until you add your own.

To disable a provider, open its **⋮** menu and choose **Remove**. Its sign-in button no longer appears in your app.

When you edit an Apple provider, leave the private key blank to keep the stored key. To replace the key, enter the new key and its Key ID together.

</TabItem>

<TabItem>

Add a provider with [`neon neon-auth oauth-provider add`](/docs/cli/neon-auth#oauth-provider-add):

```bash shouldWrap
neon neon-auth oauth-provider add --provider-id google --oauth-client-id <client-id> --oauth-client-secret <client-secret>
```

Apple and Microsoft need Neon CLI 8.14.0 or later. Use `--microsoft-tenant-id` for Microsoft, and `--apple-team-id`, `--apple-key-id`, and `--oauth-client-secret-file` (the path to your `.p8` key) for Apple:

```bash shouldWrap
neon neon-auth oauth-provider add --provider-id apple --oauth-client-id com.example.app.signin --oauth-client-secret-file AuthKey_ABC123DEFG.p8 --apple-team-id ABCDE12345 --apple-key-id ABC123DEFG
```

</TabItem>

<TabItem>

Send a `POST` request to the [add OAuth provider](/docs/reference/api/auth/add-branch-neon-auth-oauth-provider) endpoint. Replace `{project_id}` and `{branch_id}` with your project and branch IDs.

```bash shouldWrap
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/oauth_providers' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"id": "google", "client_id": "<client-id>", "client_secret": "<client-secret>"}'
```

For Microsoft, add `microsoft_tenant_id`:

```bash shouldWrap
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/oauth_providers' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"id": "microsoft", "client_id": "<client-id>", "client_secret": "<client-secret>", "microsoft_tenant_id": "common"}'
```

For Apple, send the Services ID as `client_id`, the contents of the `.p8` file as `client_secret`, and the `apple_team_id` and `apple_key_id`. This example uses `jq` to read the key file into the request body:

```bash shouldWrap
jq -n --rawfile key AuthKey_ABC123DEFG.p8 \
  '{id: "apple", client_id: "com.example.app.signin", client_secret: $key, apple_team_id: "ABCDE12345", apple_key_id: "ABC123DEFG"}' |
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/oauth_providers' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d @-
```

Responses never include the private key or client secret. They return a masked value instead.

</TabItem>

</Tabs>

Managed Better Auth will use your configured credentials for that branch.

### Branches and preview deployments

Each branch has its own **`NEON_AUTH_BASE_URL`**. Register **`{NEON_AUTH_BASE_URL}/callback/google`** (and other providers you use) for every branch you test against (for example preview databases).

For preview deployments, trusted domains support **wildcard patterns** (for example `https://*.my-app-preview.vercel.app`), so you can cover many preview hosts without listing each one. See [Configure trusted domains](/docs/auth/guides/configure-domains), [Branching authentication](/docs/auth/branching-authentication), and the API for [trusted domains](/docs/reference/api/auth/add-branch-neon-auth-trusted-domain).

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
