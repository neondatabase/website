---
title: Custom authentication providers
subtitle: Configure custom authentication providers with the Data API
summary: >-
  Covers the configuration of custom authentication providers for the Data API,
  enabling integration with existing systems that issue JSON Web Tokens (JWTs)
  like Auth0, Clerk, and AWS Cognito.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.806Z'
redirectFrom:
  - /docs/guides/neon-authorize
---

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/data-api/get-started">Getting started with Data API</a>
    <a href="/docs/data-api/access-control">Access control & security</a>
    <a href="/docs/guides/rls-tutorial">Secure your app with RLS</a>
  </DocsList>
  <DocsList title="Source code" theme="repo">
    <a href="https://github.com/neondatabase/pg_session_jwt">pg_session_jwt extension</a>
  </DocsList>
</InfoBlock>

The Data API works with any authentication provider that issues [JSON Web Tokens (JWTs)](https://jwt.io/introduction). While [Neon Auth](/docs/auth/overview) provides the simplest setup, you can use existing authentication infrastructure with providers like Auth0, Clerk, AWS Cognito, and others.

## How it works

When you bring your own authentication provider, the JWT validation flow works as follows:

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Client    │         │   Your Auth      │         │  Neon Data  │
│ Application │         │    Provider      │         │     API     │
└──────┬──────┘         └────────┬─────────┘         └──────┬──────┘
       │                         │                          │
       │ 1. Authenticate         │                          │
       │────────────────────────>│                          │
       │                         │                          │
       │ 2. Return JWT token     │                          │
       │<────────────────────────│                          │
       │                         │                          │
       │ 3. API request with     │                          │
       │    Authorization header │                          │
       │────────────────────────────────────────────────────>│
       │                         │                          │
       │                         │ 4. Fetch JWKS keys       │
       │                         │<─────────────────────────│
       │                         │                          │
       │                         │ 5. Return public keys    │
       │                         │──────────────────────────>│
       │                         │                          │
       │                         │    6. Validate JWT       │
       │                         │    7. Extract user_id    │
       │                         │    8. Apply RLS policies │
       │                         │                          │
       │ 9. Return filtered data │                          │
       │<────────────────────────────────────────────────────│
       │                         │                          │
```

The key steps:

1. Your auth provider issues [JSON Web Tokens (JWTs)](https://jwt.io/introduction) to authenticated users.
2. Your application passes these JWTs to the Data API in the `Authorization` header.
3. Neon validates the tokens using your provider's [JWKS (JSON Web Key Set)](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets) URL.
4. The Data API enforces [Row-Level Security policies](/docs/guides/neon-rls) based on the user identity in the JWT.

## Add your authentication provider

You can configure your authentication provider when you first enable the Data API, or add it later from the **Configuration** tab. Select **Other Provider** from the dropdown and enter:

- Your provider's **JWKS URL** (see provider-specific instructions below).
- Your **JWT Audience** value, if required by your provider (see [What is JWT Audience?](#what-is-jwt-audience) below).

### What is JWT Audience?

The **JWT Audience** (the `aud` claim in a JWT) identifies the intended recipient of a token. It's a security measure that ensures tokens issued for one application can't be reused with another.

When you configure a JWT Audience value in the Data API:

- The Data API verifies that incoming JWTs contain a matching `aud` claim
- Tokens without a matching audience are rejected
- This prevents tokens meant for other services from being accepted by your API

**When is it required?**

- **Firebase/GCP**: Required — use your Firebase Project ID
- **Google Identity**: Required — use your OAuth 2.0 Client ID
- **Azure AD, Keycloak**: May be required depending on your configuration
- **Most other providers**: Optional — only configure if your provider includes an `aud` claim in tokens

If you're unsure whether your provider requires it, you can decode a sample JWT from your provider at [jwt.io](https://jwt.io) and check if it includes an `aud` claim.

<a id="supported-providers"></a>

## Find your JWKS URL

| Provider                            | JWKS URL Format                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| [Auth0](#auth0)                     | `https://{YOUR_AUTH0_DOMAIN}/.well-known/jwks.json`                                         |
| [Clerk](#clerk)                     | `https://{YOUR_CLERK_DOMAIN}/.well-known/jwks.json`                                         |
| [AWS Cognito](#aws-cognito)         | `https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json`           |
| [Azure AD](#azure-ad)               | `https://login.microsoftonline.com/{TENANT_ID}/discovery/v2.0/keys`                         |
| [Descope](#descope)                 | `https://api.descope.com/{PROJECT_ID}/.well-known/jwks.json`                                |
| [Firebase/GCP](#firebasegcp)        | `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com` |
| [Google Identity](#google-identity) | `https://www.googleapis.com/oauth2/v3/certs`                                                |
| [Keycloak](#keycloak)               | `https://{DOMAIN}/auth/realms/{REALM}/protocol/openid-connect/certs`                        |
| [PropelAuth](#propelauth)           | `https://{YOUR_PROPEL_AUTH_URL}/.well-known/jwks.json`                                      |
| [Stack Auth](#stack-auth)           | `https://api.stack-auth.com/api/v1/projects/{PROJECT_ID}/.well-known/jwks.json`             |
| [Stytch](#stytch)                   | `https://test.stytch.com/v1/sessions/jwks/{PROJECT_ID}`                                     |
| [SuperTokens](#supertokens)         | `{CORE_CONNECTION_URI}/.well-known/jwks.json`                                               |
| [WorkOS](#workos)                   | `https://api.workos.com/sso/jwks/{CLIENT_ID}`                                               |

### Auth0

Your Auth0 JWKS URL follows this format:

```bash shouldWrap
https://{YOUR_AUTH0_DOMAIN}/.well-known/jwks.json
```

To find your domain:

1. Open the **Settings** for your application in the Auth0 dashboard
2. Copy your **Domain** value
3. Use it to form your JWKS URL

![Find your Auth0 domain for JWKS URL](/docs/guides/auth0_neon_jwt.png)

For example, if your domain is `dev-abc123.us.auth0.com`, your JWKS URL would be:

```bash shouldWrap
https://dev-abc123.us.auth0.com/.well-known/jwks.json
```

### Clerk

Your Clerk JWKS URL follows this format:

```bash shouldWrap
https://{YOUR_CLERK_DOMAIN}/.well-known/jwks.json
```

To find your JWKS URL:

1. Go to the Clerk Dashboard
2. Navigate to **Configure → Developers → API Keys**
3. Click **Show JWT Public Key**
4. Copy the JWKS URL

For advanced JWT configuration (custom claims, token lifespans), you can use the dedicated Neon template in Clerk under **Configure > JWT Templates**.

### AWS Cognito

Your AWS Cognito JWKS URL follows this format:

```bash shouldWrap
https://cognito-idp.{YOUR_AWS_COGNITO_REGION}.amazonaws.com/{YOUR_AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json
```

To find your JWKS URL:

1. Open the AWS Cognito console
2. Navigate to **User pools**
3. Select your user pool
4. Find the **Token signing key URL** (this is your JWKS URL)

![Find your AWS Cognito JWKS URL](/docs/guides/aws_cognito_user_pool.png)

For example, if your region is `us-east-1` and your user pool ID is `us-east-1_XXXXXXXXX`, your JWKS URL would be:

```bash shouldWrap
https://cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX/.well-known/jwks.json
```

### Azure AD

Your Azure Active Directory JWKS URL follows this format:

```bash shouldWrap
https://login.microsoftonline.com/{YOUR_TENANT_ID}/discovery/v2.0/keys
```

Replace `{YOUR_TENANT_ID}` with your Azure Active Directory tenant ID.

For example, if your tenant ID is `12345678-1234-1234-1234-1234567890ab`, your JWKS URL would be:

```bash shouldWrap
https://login.microsoftonline.com/12345678-1234-1234-1234-1234567890ab/discovery/v2.0/keys
```

<Admonition type="note">
Depending on your Azure AD configuration, you may need to provide a JWT Audience value.
</Admonition>

### Descope

Your Descope JWKS URL follows this format:

```bash shouldWrap
https://api.descope.com/{YOUR_DESCOPE_PROJECT_ID}/.well-known/jwks.json
```

To find your Project ID:

1. Go to the Descope Dashboard
2. Navigate to **Project Settings**
3. Copy your **Project ID**

![Find your Descope Project ID](/docs/guides/descope_project_id.png)

For example, if your Project ID is `P1234`, your JWKS URL would be:

```bash shouldWrap
https://api.descope.com/P1234/.well-known/jwks.json
```

### Firebase/GCP

Firebase and Google Cloud Identity Platform share the same authentication infrastructure and use a common JWKS URL for all projects:

```bash shouldWrap
https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com
```

You must also provide your Firebase/GCP Project ID as the JWT Audience value.

To find your Project ID:

1. Go to the [Firebase Console](https://console.firebase.google.com)
2. Navigate to **Settings** > **General**
3. Copy your **Project ID**

![Firebase Project ID](/docs/guides/firebase_project_id.png)

Enter your Project ID in the **JWT Audience** field when configuring the Data API.

<Admonition type="note">
Every GCP Identity Platform project automatically creates a corresponding Firebase project, which is why we use the Firebase Console to get the Project ID.
</Admonition>

### Google Identity

Your Google Identity JWKS URL is:

```bash shouldWrap
https://www.googleapis.com/oauth2/v3/certs
```

You must also provide your OAuth 2.0 Client ID as the JWT Audience value. You can find your Client ID in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) under **APIs & Services > Credentials**.

### Keycloak

Your Keycloak JWKS URL follows this format:

```bash shouldWrap
https://{YOUR_KEYCLOAK_DOMAIN}/auth/realms/{YOUR_REALM}/protocol/openid-connect/certs
```

Replace:

- `{YOUR_KEYCLOAK_DOMAIN}` with your Keycloak domain
- `{YOUR_REALM}` with your Keycloak realm name

<Admonition type="note">
To ensure compatibility with the Data API, configure Keycloak to use only one signing algorithm (RS256 or ES256). You can verify this by opening the JWKS URL and checking the keys manually. Depending on your Keycloak configuration, you may also need to provide a JWT Audience value.
</Admonition>

### PropelAuth

Your PropelAuth JWKS URL follows this format:

```bash shouldWrap
https://{YOUR_PROPEL_AUTH_URL}/.well-known/jwks.json
```

To find your PropelAuth URL:

1. Go to your PropelAuth dashboard
2. Navigate to **Backend Integration** in your project settings
3. Copy your Auth URL

![PropelAuth Auth URL](/docs/guides/propelauth_backend_integration_page.png)

For example, if your PropelAuth URL is `https://3211758.propelauthtest.com`, your JWKS URL would be:

```bash shouldWrap
https://3211758.propelauthtest.com/.well-known/jwks.json
```

### Stack Auth

Your Stack Auth JWKS URL follows this format:

```bash shouldWrap
https://api.stack-auth.com/api/v1/projects/{YOUR_PROJECT_ID}/.well-known/jwks.json
```

Replace `{YOUR_PROJECT_ID}` with your Stack Auth project ID.

For example, if your project ID is `my-awesome-project`, your JWKS URL would be:

```bash shouldWrap
https://api.stack-auth.com/api/v1/projects/my-awesome-project/.well-known/jwks.json
```

### Stytch

Your Stytch JWKS URL follows this format:

```bash shouldWrap
https://test.stytch.com/v1/sessions/jwks/{YOUR_PROJECT_ID}
```

Replace `{YOUR_PROJECT_ID}` with your Stytch project ID.

For example, if your project ID is `my-awesome-project`, your JWKS URL would be:

```bash shouldWrap
https://test.stytch.com/v1/sessions/jwks/my-awesome-project
```

<Admonition type="note">
For production environments, replace `test.stytch.com` with `live.stytch.com`.
</Admonition>

### SuperTokens

Your SuperTokens JWKS URL follows this format:

```bash shouldWrap
{YOUR_SUPER_TOKENS_CORE_CONNECTION_URI}/.well-known/jwks.json
```

To find your Core connection URI:

1. Go to the SuperTokens Dashboard
2. Navigate to **Core Management**
3. Copy your Core connection URI

![SuperTokens Dashboard](/docs/guides/supertokens_dashboard.png)

For example, if your connection URI is `https://try.supertokens.io`, your JWKS URL would be:

```bash shouldWrap
https://try.supertokens.io/.well-known/jwks.json
```

### WorkOS

Your WorkOS JWKS URL follows this format:

```bash shouldWrap
https://api.workos.com/sso/jwks/{YOUR_CLIENT_ID}
```

To find your Client ID:

1. Go to the WorkOS Dashboard
2. Navigate to the **Overview** page
3. Copy your **Client ID**

![WorkOS Overview Page](/docs/guides/workos_overview_page.png)

For example, if your Client ID is `client_12345`, your JWKS URL would be:

```bash shouldWrap
https://api.workos.com/sso/jwks/client_12345
```

## Next steps

After configuring your authentication provider, include the JWT in your Data API requests:

```http
GET https://your-project.data.neon.tech/v1/posts
Authorization: Bearer {your_jwt_token}
```

Then set up [Row-Level Security policies](/docs/data-api/get-started#create-a-table-with-rls) to control data access using the `auth.user_id()` function, which extracts the user ID from your JWT.
