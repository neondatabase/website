---
title: Set up OAuth
subtitle: Add Google, GitHub, Vercel, Microsoft, or Apple sign-in to your application
summary: >-
  Managed Better Auth OAuth setup adds Google, GitHub, Vercel, Microsoft, and Apple
  social sign-in to an application using `signIn.social()`, with Google enabled in
  development via shared credentials and the other providers requiring custom OAuth
  app credentials.
  For production, register the provider's authorized redirect URI as
  `{NEON_AUTH_BASE_URL}/callback/{provider}` in each provider's console (not the
  app's callbackURL), and add every callbackURL origin to Managed Better Auth's trusted
  domains allowlist. Because each Neon branch has its own Auth base URL, OAuth
  credentials and redirect URIs must be configured per branch; preview
  deployments can use wildcard trusted domain patterns to cover multiple hosts.
enableTableOfContents: true
updatedOn: '2026-09-17T22:48:53.595Z'
---

OAuth lets users sign in with their Google, GitHub, Vercel, Microsoft, or Apple account. Managed Better Auth handles the OAuth flow and creates a session after authorization.

## Development mode

Google OAuth is enabled by default with shared credentials for development and testing. You can start using Google sign-in immediately without any configuration.

### About shared credentials

Shared credentials let you add Google sign-in with no setup, using a Google OAuth app that Neon owns. That one app is shared by every project that uses shared credentials, including projects belonging to other Neon users. It isn't unique to you.

When someone signs in, Google shows them Neon's name and logo, not your app's, because the sign-in runs through Neon's app rather than one you own. Your users are effectively trusting Neon, and you don't control the app's branding, its permission scopes, or the credentials.

This is safe for development and testing. An outside website can't use the shared app to capture your users, because Google only ever redirects sign-ins back to Neon, and Neon keeps each project's sign-ins separate. The reason not to use it in production is trust and control. Real users should see your app on the consent screen, and you should own the credentials.

For production, add your own Google Client ID and secret. See [Production setup](#production-setup).

<Admonition type="note">
GitHub, Vercel, Microsoft, and Apple OAuth require custom credentials and are not available with shared credentials. See [Production setup](#production-setup) to configure your own OAuth apps.
</Admonition>

## Sign in with OAuth

Call `signIn.social()` with your provider (`"google"`, `"github"`, `"vercel"`, `"microsoft"`, or `"apple"`). The SDK sends the user to the provider's sign-in page. After the user authorizes, the provider redirects to Managed Better Auth's OAuth callback route (see [Production setup](#production-setup)), then Managed Better Auth redirects the browser to your **`callbackURL`** (must use a [trusted domain](/docs/auth/guides/configure-domains) in production).

<CodeTabs labels={["Google","GitHub","Vercel","Microsoft","Apple"]}>

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
  provider: "google", // or "github", "vercel", "microsoft", "apple"
  callbackURL: "/dashboard",
  newUserCallbackURL: "/welcome",
  errorCallbackURL: "/error",
});
```

## Production setup

For production, configure your own OAuth app credentials. GitHub, Vercel, Microsoft, and Apple OAuth require custom credentials, while Google OAuth works with shared credentials for development but should use custom credentials in production.

### 1. Register redirect URIs with each provider

Managed Better Auth uses [Better Auth](https://www.better-auth.com/) callback routes. For each OAuth provider you enable, register a redirect URI with this shape:

```text
{NEON_AUTH_BASE_URL}/callback/{provider}
```

Use the **Auth base URL** from the Neon Console for that branch. In your app it is usually the `NEON_AUTH_BASE_URL` or `VITE_NEON_AUTH_URL` value, or the URL you pass to `createAuthClient`. Do not add a trailing slash before `/callback`.

Replace `{provider}` with `google`, `github`, `vercel`, `microsoft`, or `apple`.

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

**Microsoft**

See [Microsoft setup](#microsoft-setup) for the redirect URI, tenant, and email verification settings.

**Apple**

See [Apple setup](#apple-setup). Apple requires an HTTPS redirect URI, so it can't be used with `localhost`.

### 2. Add trusted domains for your app

Before testing production OAuth, add every origin you pass as **`callbackURL`** (and related URLs) to Managed Better Auth's allowlist. See [Configure trusted domains](/docs/auth/guides/configure-domains).

### 3. Create OAuth apps and paste credentials into Neon

Create OAuth apps with your providers:

- [Google OAuth setup](https://developers.google.com/identity/protocols/oauth2/web-server) (see [Google OAuth branding](#google-oauth-branding) below before going live)
- [GitHub OAuth setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- [Vercel OAuth setup](https://vercel.com/docs/sign-in-with-vercel/manage-from-dashboard#create-an-app)
- [Microsoft setup](#microsoft-setup)
- [Apple setup](#apple-setup)

Then give the **Client ID** and **Client Secret** to Managed Better Auth for that branch. Apple and Microsoft take a few extra fields, described in their sections below.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

In the Neon Console, open your **project** and select the **branch**, then go to **Settings → Auth**. Under **OAuth providers**, click **Add OAuth provider** (or open an existing provider's **⋮** menu and choose **Configure**).

The dialog shows the exact **authorization callback URL** to register with the provider (for example, `{NEON_AUTH_BASE_URL}/callback/github`). Copy it from the dialog rather than assembling it by hand, then enter your **Client ID** and **Client Secret**.

Click **Add** (or **Update** when editing an existing provider) to save. Neon applies the change to the branch and confirms with a success message. Your app uses the new credentials on the next sign-in. A provider using Neon's shared credentials shows a **Shared credentials** badge until you add your own.

To disable a provider, open its **⋮** menu and choose **Remove**. Its sign-in button no longer appears in your app.

</TabItem>

<TabItem>

Add a provider with [`neon neon-auth oauth-provider add`](/docs/cli/neon-auth#oauth-provider-add):

```bash shouldWrap
neon neon-auth oauth-provider add --provider-id google --oauth-client-id <client-id> --oauth-client-secret <client-secret>
```

For Apple, pass the `.p8` key file, your Team ID, and the Key ID. For Microsoft, `--microsoft-tenant-id` is optional:

```bash shouldWrap
neon neon-auth oauth-provider add --provider-id apple --oauth-client-id <services-id> --oauth-client-secret-file AuthKey_XXXXXXXXXX.p8 --apple-team-id <team-id> --apple-key-id <key-id>

neon neon-auth oauth-provider add --provider-id microsoft --oauth-client-id <client-id> --oauth-client-secret <client-secret> --microsoft-tenant-id <tenant>
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

Apple and Microsoft accept additional fields. For Apple, `client_secret` is the full contents of the `.p8` file, including the `BEGIN` and `END` lines, with newlines encoded as `\n` in JSON:

```json
{
  "id": "apple",
  "client_id": "<services-id>",
  "client_secret": "<contents-of-p8-file>",
  "apple_team_id": "<team-id>",
  "apple_key_id": "<key-id>"
}
```

```json
{
  "id": "microsoft",
  "client_id": "<client-id>",
  "client_secret": "<client-secret>",
  "microsoft_tenant_id": "<tenant>"
}
```

</TabItem>

</Tabs>

Managed Better Auth will use your configured credentials for that branch.

### Branches and preview deployments

Each branch has its own **`NEON_AUTH_BASE_URL`**. Register **`{NEON_AUTH_BASE_URL}/callback/google`** (and other providers you use) for every branch you test against (for example preview databases).

For preview deployments, trusted domains support **wildcard patterns** (for example `https://*.my-app-preview.vercel.app`), so you can cover many preview hosts without listing each one. See [Configure trusted domains](/docs/auth/guides/configure-domains), [Branching authentication](/docs/auth/branching-authentication), and the API for [trusted domains](/docs/reference/api/auth/add-branch-neon-auth-trusted-domain).

## Microsoft setup

Register an app in the [Microsoft Entra admin center](https://entra.microsoft.com) and give its credentials to Managed Better Auth.

1. Go to **Entra ID** > **App registrations** and select **New registration**.
2. Choose the **Supported account types** that match who should be able to sign in. This setting should agree with the tenant value you set in Neon (see below).
3. Under **Redirect URI**, select the **Web** platform and enter **`{NEON_AUTH_BASE_URL}/callback/microsoft`**.
4. After you register the app, copy the **Application (client) ID**.
5. Go to **Certificates & secrets**, create a **New client secret**, and copy its **Value**. Microsoft shows the value only once.
6. Add the Client ID and Client Secret to the branch, as described in [Create OAuth apps and paste credentials into Neon](#3-create-oauth-apps-and-paste-credentials-into-neon).

Microsoft client secrets expire. Create a new secret and update the provider in Neon before the old one expires.

### Tenant

By default, Managed Better Auth signs users in against the `common` Microsoft endpoint. To restrict sign-in, set the optional **`microsoft_tenant_id`** (`--microsoft-tenant-id` in the CLI) to one of:

| Value           | Who can sign in                                                  |
| --------------- | ---------------------------------------------------------------- |
| `common`        | Work or school accounts from any tenant, and personal accounts   |
| `organizations` | Work or school accounts from any tenant                          |
| `consumers`     | Personal Microsoft accounts only                                 |
| A tenant ID     | Accounts in that tenant (a GUID)                                 |
| A tenant domain | Accounts in that tenant (for example, `contoso.onmicrosoft.com`) |

The tenant value must be compatible with the **Supported account types** you chose for the app registration. The tenant ID is returned in API responses.

### Email verification

Managed Better Auth treats a Microsoft email as verified only when Microsoft says the user's home tenant owns the email domain. Microsoft sends this in two optional ID token claims, `xms_edov` and `acct`. They aren't in the token by default, so you add them to your app registration.

Without these claims, Microsoft sign-in still works, but the email is treated as unverified:

- If a user with the same email already exists (for example, from Google, GitHub, or email and password), Microsoft sign-in fails with `account_not_linked` and no account is created.
- A new user who signs in with Microsoft is created with an unverified email.
- A signed-in user can't link a Microsoft account, and the attempt fails with `unable_to_link_account`.

To add the claims:

1. In the Entra admin center, go to **Entra ID** > **App registrations** and select your app.
2. Under **Manage**, select **Token configuration**.
3. Select **Add optional claim**, choose the **ID** token type, select `acct` and `xms_edov`, then select **Add**.
4. If you're asked to turn on the Microsoft Graph `email` permission, accept. `xms_edov` is sent only when the token also has the `email` claim.

You can also edit the app manifest (**Manage** > **Manifest**). Keep any optional claims you already have:

```json
"optionalClaims": {
  "idToken": [
    { "name": "acct", "essential": false },
    { "name": "xms_edov", "essential": false },
    { "name": "email", "essential": false }
  ]
}
```

Managed Better Auth marks the email verified only when `xms_edov` is `true` and `acct` is `0`:

- `xms_edov` is `true` when the email belongs to a domain that the user's tenant has verified.
- `acct` is `0` for a member of the tenant and `1` for a guest.

Users who sign in as guests or with a personal Microsoft account don't meet both conditions, so their emails stay unverified. See Microsoft's [optional claims reference](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims-reference) and [Configure optional claims](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims).

## Apple setup

Sign in with Apple needs four values from your [Apple Developer account](https://developer.apple.com/account):

| Apple value                    | Managed Better Auth field                                         |
| ------------------------------ | ----------------------------------------------------------------- |
| Services ID                    | Client ID (`client_id`)                                           |
| Sign in with Apple key (`.p8`) | Client secret (`client_secret`), the full multi-line PEM contents |
| Team ID                        | `apple_team_id`                                                   |
| Key ID (10 characters)         | `apple_key_id`                                                    |

To get them:

1. Under **Certificates, Identifiers & Profiles** > **Identifiers**, create an **App ID** with the **Sign in with Apple** capability enabled if you don't have one.
2. Create a **Services ID**. Enable **Sign in with Apple** for it and select **Configure**.
3. Set the primary App ID. Add your Auth base URL's host as a **Domain**, and add **`{NEON_AUTH_BASE_URL}/callback/apple`** as a **Return URL**. For example:

   ```text
   https://ep-example.neonauth.us-east-2.aws.neon.tech/neondb/auth/callback/apple
   ```

4. Under **Keys**, create a key with **Sign in with Apple** enabled, associated with your App ID. Download the `.p8` file (Apple lets you download it once) and note the **Key ID**.
5. Copy your **Team ID** from the Membership details page.

Apple requires an HTTPS return URL, so `localhost` URLs aren't accepted.

Managed Better Auth signs the client secret JWT that Apple expects, using your private key, so you don't generate or rotate a client secret yourself. API responses show a masked fingerprint of the key and never return the key itself.

To rotate the key, create a new key in Apple Developer and update the provider with the new `.p8` contents. The request must include the new key's `apple_key_id` (`--apple-key-id`) in the same request.

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
