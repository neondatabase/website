---
title: "How do I use Clerk, Auth0, or Firebase tokens with Postgres Row-Level Security?"
subtitle: "Register your provider's JWKS URL with the Neon Data API, make sure tokens carry a role claim of authenticated, and write RLS policies on auth.user_id(). The Data API verifies each token and runs the query as that role."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'Which tools support testing fixes against real production data?'
  slug: tools-testing-fixes-production-data
nextLink:
  title: 'What is Lakebase Postgres, and why does it matter for app developers?'
  slug: what-is-lakebase-postgres
---

Use the Neon [Data API](/docs/data-api/overview) with your existing provider. The Data API works with any authentication provider that issues JWTs: you give it the provider's JWKS URL, it verifies the signature on every request, and your Postgres Row-Level Security policies read the user ID from the token ([custom providers](/docs/data-api/custom-authentication-providers)). You keep Clerk, Auth0, or Firebase for sign-in and move authorization into your Lakebase Postgres database.

## Register the JWKS URL

In the Console, open **Postgres database** > **Data API** > **Settings**, choose **Add provider**, and enter the JWKS URL. You can do the same with the Neon API, `neon data-api create --auth-provider external --jwks-url ...`, or in [`neon.ts`](/docs/reference/neon-ts#dataapi) ([manage](/docs/data-api/manage#manage-authentication-providers)):

```ts
dataApi: {
  authProvider: "external",
  jwksUrl: "https://your-idp/.well-known/jwks.json",
}
```

The URL formats for common providers ([find your JWKS URL](/docs/data-api/custom-authentication-providers#supported-providers)):

- **Clerk**: `https://{YOUR_CLERK_DOMAIN}/.well-known/jwks.json`, shown under **Configure** > **Developers** > **API Keys**
- **Auth0**: `https://{YOUR_AUTH0_DOMAIN}/.well-known/jwks.json`
- **Firebase**: `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`, with your Firebase project ID as the **JWT Audience**

AWS Cognito, Azure AD, Keycloak, Descope, Google Identity, PropelAuth, Stack Auth, Stytch, SuperTokens, and WorkOS are documented too. Firebase and Google Identity require an audience value; Azure AD and Keycloak may, depending on configuration.

## Add the role claim

This is the step people miss. A valid signature doesn't decide which Postgres role runs the query: the token's `role` claim does. Requests run as `authenticated`, the role the default `GRANT`s target, only if the token carries `"role": "authenticated"`. Without a `role` claim, the request falls back to `anonymous`, which has no table grants by default, so you get `42501 permission denied for table` ([required claims](/docs/data-api/custom-authentication-providers#required-jwt-claims)).

Managed Better Auth adds this claim for you; external providers need configuring:

- **Clerk**: create a JWT template with a static claim such as `"role": "authenticated"` and request tokens with `getToken()` using that template ([Clerk JWT templates](https://clerk.com/docs/guides/sessions/jwt-templates)). Neon's docs point to a dedicated Neon template under **Configure** > **JWT Templates**.
- **Auth0**: add the claim in an Action with `api.accessToken.setCustomClaim()` ([Auth0 custom claims](https://auth0.com/docs/secure/tokens/json-web-tokens/create-custom-claims)). Auth0 limits non-namespaced custom claims on some access tokens. If your claim ends up under a different path, change the Data API's **JWT role claim key** setting (default `.role`) to match ([manage](/docs/data-api/manage#jwt-role-claim-key)).
- **Firebase**: set custom claims per user with the Admin SDK's `setCustomUserClaims()`. They propagate to the user's ID token, and the payload can't exceed 1,000 bytes ([Firebase custom claims](https://firebase.google.com/docs/auth/admin/custom-claims)).

## Write policies on the user ID

The token's `sub` claim identifies the user. `auth.user_id()` returns it as `text`, which suits Clerk and Auth0 IDs; `auth.uid()` returns it as `uuid` and is `NULL` when `sub` isn't a valid UUID ([get started](/docs/data-api/get-started#create-a-table-with-rls)).

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User owns data" ON posts
  FOR ALL TO authenticated
  USING ((SELECT auth.user_id()) = user_id)
  WITH CHECK ((SELECT auth.user_id()) = user_id);
```

Wrapping the function in `SELECT` lets Postgres evaluate it once per query rather than once per row ([advisors](/docs/data-api/database-advisor#auth-rls-initplan)). On the client, [`@neon/postgrest-js`](/docs/data-api/get-started#option-1-using-a-client-library) takes a function that returns your provider's token and attaches it to each request with `fetchWithToken`.

## Limits to know

- Only one provider can be configured at a time. Switching means removing the current one first, which invalidates every token it issued ([manage](/docs/data-api/manage#manage-authentication-providers)).
- Keycloak must use a single signing algorithm (RS256 or ES256).
- The Data API doesn't support projects with IP Allow or Private Networking enabled.

If you'd rather not configure claims at all, [Managed Better Auth](/docs/auth/overview) issues tokens the Data API accepts out of the box and stores users in your database.

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Bring your own auth provider" description="Register a JWKS URL and enforce RLS on tokens from Clerk, Auth0, or Firebase." buttonText="Custom providers" buttonUrl="/docs/data-api/custom-authentication-providers" />
