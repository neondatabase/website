---
title: Neon OAuth integration
enableTableOfContents: true
---


You can integrate your application with Neon by leveraging our secure OAuth integration. The integration enables your application to interact with users' Neon accounts, carrying out permitted actions on their behalf. Our integration does not require direct access to users' personal login credentials and is conducted with their  approval, ensuring data privacy and security.

To set up the integration and create a Neon OAuth application, you can apply on our [Partners page](https://neon.tech/partner). You will need to provide us with the following information:

1. Details about your application, such as its name, what it does, and a link to the website.
2. Callback URL(s): URLs used to redirect users after completing the authorization flow. For example `https://yourapplication.com/api/oauth/callback`, `http://localhost:3000/api/oauth/callback`
3. Scopes: scopes let you specify the type of access you require. Currently, we provide access to the following scopes:
   - Create Projects
   - Read Projects
   - Modify Projects
   - Delete Projects
4. Whether or not you will make API calls from a backend.
5. Logo: an image to be displayed on Neon's OAuth consent dialog when users authorize your app to access their Neon account.

After your application is reviewed, we will get in touch with you and provide you with two credentials: a client ID and a client secret. These credentials are sensitive and should be stored securely.

## How the OAuth integration works

Here is a high-level overview of how Neon's OAuth implementation works:

![OAuth flow diagram](/docs/oauth/flow.png)

1. The user initiates the OAuth flow in your application by clicking a button or link.
2. An authorization URL is generated, and the user is redirected to Neon’s OAuth consent screen, where they  authorize your application and grant the necessary permissions.
3. Finally, your application receives an access token to manage Neon resources on the user’s behalf.

Here is a more detailed breakdown of the steps involved in the OAuth flow:

### 1. Initiating the OAuth flow

To initiate the OAuth flow, you will need to generate an authorization URL. To do that you can redirect your users to `https://oauth2.neon.tech/oauth2/auth` while passing the following query parameters:

- `client_id`: your OAuth application's ID
- `redirect_uri`: the full URL that Neon should redirect users to after authorizing your app. This URL should match at least one of the callback URLs you provided when applying to become a partner.
- `scope`: This is a space-separated list of scopes that you want to request access to. Example value: `urn:neoncloud:projects:create urn:neoncloud:projects:read urn:neoncloud:projects:update urn:neoncloud:projects:delete`
- `response_type`: This should be set to `code` to indicate that you are using the [Authorization Code grant type]().
- `code_challenge`: This is a random string that will be used to verify the integrity of the authorization code.
- `state`: This is a random string that will be returned to your callback URL. You can use this parameter to verify that the request came from your application and not from a third party.

Here is an example of what the authorization URL might look like:

```text
https://oauth2.neon.tech/oauth2/auth?client_id=neon-experimental&scope=openid%20offline%20offline_access%20urn%3Aneoncloud%3Aprojects%3Acreate%20urn%3Aneoncloud%3Aprojects%3Aread%20urn%3Aneoncloud%3Aprojects%3Aupdate%20urn%3Aneoncloud%3Aprojects%3Adelete&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fneon&grant_type=authorization_code&state=H58y-rSTebc3QmNbRjNTX9dL73-IyoU2T_WNievO9as&code_challenge=99XcbwOFU6iEsvXr77Xxwsk9I0GL4c4c4Q8yPIVrF_0&code_challenge_method=S256
```

After the user is redirected to the authorization URL, they will be presented with Neon's consent screen, which will be pre-populated with the scopes you requested. The user will be able to review the scopes and authorize your application to connect their Neon account.

![Neon OAuth consent screen](/docs/oauth/consent.png)

### 2. Authorization code is returned to your callback URL

After your user successfully completes the authorization flow, they will be redirected to the callback URL with the following query parameters appended to the URL:

- `code`: an authorization code that will be exchanged for an access token
- `scope`: the scopes that the user authorized your application to access
- `state`: you can compare the value of this parameter with the original `state` you provided in the previous step to ensure that the request came from your application and not from a third party

### 3. Exchanging the authorization code for an access token

You can now exchange the authorization code returned from the previous step for an access token. To do that, you will need to send a `POST` request to `https://oauth2.neon.tech/oauth2/token` with the following parameters:

- `client_id`
- `redirect_uri`
- `client_secret`: your OAuth application's secret
- `grant_type`: This should be set to `authorization_code` to indicate that you are using the [Authorization Code grant type](https://oauth.net/2/grant-types/authorization-code/).
- `code`: the authorization code returned from the previous step

The response object will contain an `access_token` field value to send API calls on behalf of your users. You do that by passing it in the `Authorization` header of the HTTP request when sending requests to Neon's API.

## Example apps

You can check out the following example apps that leverage the Neon OAuth integration:

- Visualizing Neon Postgres branches: [demo](https://neon-experimental.vercel.app), code([http//github.com/neondatabase/neon-](https://github.com/neondatabase/neon-branches-visualizer))
