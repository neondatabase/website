---
title: Neon OAuth integration
enableTableOfContents: true
updatedOn: '2024-10-05T09:31:59.748Z'
---

You can integrate your application or service with Neon using OAuth. The Neon OAuth integration enables your application to interact with Neon user accounts, carrying out permitted actions on their behalf. Our integration does not require direct access to user login credentials and is conducted with their approval, ensuring data privacy and security.

To set up the integration and create a Neon OAuth application, you can apply on our [Partners page](https://neon.tech/partners). You will need to provide the following information:

1. Details about your application, including the application name, what it does, and a link to the website.
2. Callback URL(s), which are used to redirect users after completing the authorization flow. For example `https://yourapplication.com/api/oauth/callback`, `http://localhost:3000/api/oauth/callback`
3. Scopes, defining the type of access you require. Currently, we provide access to the following scopes:
   - Create Projects
   - Read Projects
   - Modify Projects
   - Delete Projects
4. Whether or not you will make API calls from a backend.
5. A logo to be displayed on Neon's OAuth consent dialog when users authorize your application to access their Neon account.

After your application is reviewed, we will get in touch with you and provide you with two credentials: a client ID and a client secret. These credentials are sensitive and should be stored securely.

## How the OAuth integration works

Here is a high-level overview of how Neon's OAuth implementation works:

![OAuth flow diagram](/docs/oauth/flow.png)

1. The user initiates the OAuth flow in your application by clicking a button or link.
2. An authorization URL is generated, and the user is redirected to Neon’s OAuth consent screen to authorize the application and grant the necessary permissions.
3. The application receives an access token to manage Neon resources on the user’s behalf.

## About the Neon OAuth server

The Neon OAuth server implements the OpenID Connect protocol and supports [OpenID Connect Discovery specification](https://openid.net/specs/openid-connect-discovery-1_0.html). The server metadata is published at the following well-known URL: [https://oauth2.neon.tech/.well-known/openid-configuration](https://oauth2.neon.tech/.well-known/openid-configuration).

Here is an example response:

```json
{
  "issuer": "https://oauth2.neon.tech/",
  "authorization_endpoint": "https://oauth2.neon.tech/oauth2/auth",
  "token_endpoint": "https://oauth2.neon.tech/oauth2/token",
  "jwks_uri": "https://oauth2.neon.tech/.well-known/jwks.json",
  "subject_types_supported": ["public"],
  "response_types_supported": [
    "code",
    "code id_token",
    "id_token",
    "token id_token",
    "token",
    "token id_token code"
  ],
  "claims_supported": ["sub"],
  "grant_types_supported": [
    "authorization_code",
    "implicit",
    "client_credentials",
    "refresh_token"
  ],
  "response_modes_supported": ["query", "fragment"],
  "userinfo_endpoint": "https://oauth2.neon.tech/userinfo",
  "scopes_supported": ["offline_access", "offline", "openid"],
  "token_endpoint_auth_methods_supported": [
    "client_secret_post",
    "client_secret_basic",
    "private_key_jwt",
    "none"
  ],
  "userinfo_signing_alg_values_supported": ["none", "RS256"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "request_parameter_supported": true,
  "request_uri_parameter_supported": true,
  "require_request_uri_registration": true,
  "claims_parameter_supported": false,
  "revocation_endpoint": "https://oauth2.neon.tech/oauth2/revoke",
  "backchannel_logout_supported": true,
  "backchannel_logout_session_supported": true,
  "frontchannel_logout_supported": true,
  "frontchannel_logout_session_supported": true,
  "end_session_endpoint": "https://oauth2.neon.tech/oauth2/sessions/logout",
  "request_object_signing_alg_values_supported": ["RS256", "none"],
  "code_challenge_methods_supported": ["plain", "S256"]
}
```

<Admonition type="note">
You must add `offline` and `offline_access` scopes to your request to receive the `refresh_token`.
</Admonition>

Depending on the OpenID client you’re using, you might not need to explicitly interact with the API endpoints listed below. OAuth 2.0 clients typically handle this interaction automatically. For example, the [Neon CLI](https://neon.tech/docs/reference/neon-cli), written in Typescript, interacts with the API endpoints automatically to retrieve the `refresh_token` and `access_token`. For an example, refer to this part of the Neon CLI [source code](https://github.com/neondatabase/neonctl/blob/main/src/auth.ts#L54-L71). In this example, the `oauthHost` is `https://oauth2.neon.tech`.

### 1. Initiating the OAuth flow

To initiate the OAuth flow, you need to generate an authorization URL. You can do that by directing your users to `https://oauth2.neon.tech/oauth2/auth` while passing the following query parameters:

- `client_id`: your OAuth application's ID.
- `redirect_uri`: the full URL that Neon should redirect users to after authorizing your application. The URL should match at least one of the callback URLs you provided when applying to become a partner.
- `scope`: This is a space-separated list of scopes that you want to request access to. For example: `urn:neoncloud:projects:create urn:neoncloud:projects:read urn:neoncloud:projects:update urn:neoncloud:projects:delete`
- `response_type`: This should be set to `code` to indicate that you are using the [Authorization Code grant type](https://oauth.net/2/grant-types/authorization-code/).
- `code_challenge`: This is a random string that is used to verify the integrity of the authorization code.
- `state`: This is a random string that is returned to your callback URL. You can use this parameter to verify that the request came from your application and not from a third party.

Here is an example of what the authorization URL might look like:

```text
https://oauth2.neon.tech/oauth2/auth?client_id=neon-experimental&scope=openid%20offline%20offline_access%20urn%3Aneoncloud%3Aprojects%3Acreate%20urn%3Aneoncloud%3Aprojects%3Aread%20urn%3Aneoncloud%3Aprojects%3Aupdate%20urn%3Aneoncloud%3Aprojects%3Adelete&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fneon&grant_type=authorization_code&state=H58y-rSTebc3QmNbRjNTX9dL73-IyoU2T_WNievO9as&code_challenge=99XcbwOFU6iEsvXr77Xxwsk9I0GL4c4c4Q8yPIVrF_0&code_challenge_method=S256
```

After being redirected to the authorization URL, the user is presented with Neon's consent screen, which is pre-populated with the scopes you requested. From the consent screen, the user is able to review the scopes and authorize the application to connect their Neon account.

![Neon OAuth consent screen](/docs/oauth/consent.png)

<Admonition type="note">
The [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) provides a [Get current user details](https://api-docs.neon.tech/reference/getcurrentuserinfo) endpoint for retrieving information about the currently authorized Neon user.
</Admonition>

### 2. Authorization code is returned to your callback URL

After successfully completing the authorization flow, the user is redirected to the callback URL with the following query parameters appended to the URL:

- `code`: an authorization code that will be exchanged for an access token
- `scope`: the scopes that the user authorized your application to access
- `state`: you can compare the value of this parameter with the original `state` you provided in the previous step to ensure that the request came from your application and not from a third party

### 3. Exchanging the authorization code for an access token

You can now exchange the authorization code returned from the previous step for an access token. To do that, you need to send a `POST` request to `https://oauth2.neon.tech/oauth2/token` with the following parameters:

- `client_id`: your OAuth application's ID.
- `redirect_uri`: the full URL that Neon should redirect users to after authorizing your application. The URL should match at least one of the callback URLs you provided when applying to become a partner.
- `client_secret`: your OAuth application's secret
- `grant_type`: set this to `authorization_code` to indicate that you are using the [Authorization Code grant type](https://oauth.net/2/grant-types/authorization-code/)
- `code`: the authorization code returned from the previous step

The response object includes an `access_token` value, required for making requests to the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) on your users' behalf. This value must be supplied in the Authorization header of the HTTP request when sending requests to the Neon API.

## Example OAuth applications

For an example application that leverages the Neon OAuth integration, see the [Visualizing Neon Database Branches](https://neon-experimental.vercel.app) application. You can find the application code on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/neon-branches-visualizer" description="A Neon branching visualizer app showcasing how to build an OAuth integration with Neon" icon="github">Neon Branches Visualizer</a>
</DetailIconCards>
