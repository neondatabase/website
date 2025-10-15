---
title: Custom Authentication Providers
description: Learn how to use your own authentication provider with the Neon Data API
enableTableOfContents: true
updatedOn: '2025-10-15T00:00:00.000Z'
tag: beta
---

<FeatureBetaProps feature_name="Neon Data API" />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/data-api/get-started">Getting started with Data API</a>
    <a href="/docs/guides/neon-auth">Neon Auth</a>
  </DocsList>
</InfoBlock>

While [Neon Auth](/docs/guides/neon-auth) is the recommended authentication solution for most use cases with the Data API, you can bring your own authentication provider if needed. This allows you to use existing authentication infrastructure with providers like Auth0, Clerk, AWS Cognito, and others.

## How it works

When you bring your own authentication provider:

1. Your auth provider issues JSON Web Tokens (JWTs) to authenticated users
2. Your application passes these JWTs to the Data API
3. Neon validates the tokens using your provider's JWKS (JSON Web Key Set) URL
4. The Data API enforces Row-Level Security policies based on the user identity in the JWT

<Admonition type="note" title="Neon Auth is recommended">
For most applications, [Neon Auth](/docs/guides/neon-auth) provides the simplest setup with the Data API. Consider using a custom provider only if you have existing authentication infrastructure or specific requirements that Neon Auth doesn't meet.
</Admonition>

## Add your authentication provider

To configure a custom authentication provider:

1. Navigate to your project in the Neon Console
2. Open the **Data API** page from the sidebar
3. In the **Authentication provider** section, select **Other Provider** from the dropdown
4. Enter your provider's **JWKS URL** (see provider-specific instructions below)
5. If required by your provider, enter the **JWT Audience** value

![Data API custom authentication provider configuration](/docs/data-api/data_api_custom_auth.png)

## Find your JWKS URL

Select your authentication provider below to find instructions for locating your JWKS URL:

<Tabs labels={["Auth0", "Clerk", "AWS Cognito", "Azure AD", "Descope", "Firebase/GCP", "Google Identity", "Keycloak", "PropelAuth", "Stack Auth", "Stytch", "SuperTokens", "WorkOS"]}>

<TabItem>

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

</TabItem>

<TabItem>

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

</TabItem>

<TabItem>

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

</TabItem>

<TabItem>

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

</TabItem>

<TabItem>

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

</TabItem>

<TabItem>

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

</TabItem>

<TabItem>

Your Google Identity JWKS URL is:

```bash shouldWrap
https://www.googleapis.com/oauth2/v3/certs
```

You must also provide your OAuth 2.0 Client ID as the JWT Audience value. You can find your Client ID in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) under **APIs & Services > Credentials**.

</TabItem>

<TabItem>

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

</TabItem>

<TabItem>

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

</TabItem>

<TabItem>

Your Stack Auth JWKS URL follows this format:

```bash shouldWrap
https://api.stack-auth.com/api/v1/projects/{YOUR_PROJECT_ID}/.well-known/jwks.json
```

Replace `{YOUR_PROJECT_ID}` with your Stack Auth project ID.

For example, if your project ID is `my-awesome-project`, your JWKS URL would be:

```bash shouldWrap
https://api.stack-auth.com/api/v1/projects/my-awesome-project/.well-known/jwks.json
```

</TabItem>

<TabItem>

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

</TabItem>

<TabItem>

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

</TabItem>

<TabItem>

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

</TabItem>

</Tabs>

## Next steps

After configuring your authentication provider:

1. Ensure your application passes JWTs from your provider in the `Authorization` header when making Data API requests
2. Set up [Row-Level Security policies](/docs/data-api/get-started#create-a-table-with-rls) to control data access based on user identity
3. Use the `auth.user_id()` function in your RLS policies to access the user ID from the JWT

For a complete example of using the Data API with authentication, see the [Getting started guide](/docs/data-api/get-started).
