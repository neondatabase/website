---
title: JWT
subtitle: Authenticate using JSON Web Tokens (JWT) for external services
summary: >-
  Covers the setup of JWT authentication using the Neon SDK for scenarios
  requiring raw tokens, such as microservices and API requests from different
  domains, while emphasizing that it does not replace session management for
  standard web applications.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.746Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is built on [Better Auth](https://www.better-auth.com/) and provides support for JWT plugin APIs through the Neon SDK. You do not need to manually install or configure the Better Auth JWT plugin.

While Neon Auth primarily relies on **secure, HTTP‑only cookies** (sessions) for browser‑based authentication, certain scenarios require a raw token. In these cases, the JWT plugin is especially useful:

- **Microservices:** Sharing identity between backend services.
- **Separate frontend and backend domains:** Authenticating API requests from a domain different than your main application.
- **CLI tools:** Enabling authentication from the command‑line interface.

<Admonition type="warning" title="Sessions vs. JWTs">
This plugin is **not** a replacement for session management in web applications. For standard browser-based apps (Next.js, React, Vue, etc.), rely on the default session cookie mechanism provided by `authClient.signIn` and `authClient.getSession`.

Only use JWTs when you specifically need to authorize requests to services that cannot access the browser's cookie jar.
</Admonition>

## Prerequisites

- A Neon project with **Auth enabled**.

## Retrieve a Token

You can retrieve a JWT for the currently signed-in user using the Neon SDK.

### Using the SDK method

To fetch a raw token string, use the `authClient.token()` method. This is the recommended approach for client applications that need to attach a token to an API request header manually.

```ts shouldWrap filename="src/get-token.ts"
import { authClient } from './auth';

export async function getJwtToken() {
  const { data, error } = await authClient.token();

  if (error) throw error;

  // The token string (e.g., "eyJhbGciOiJFZ...")
  return data.token;
}
```

### Using the session header

When you call `authClient.getSession()`, Neon Auth automatically includes a JWT in the response headers. If you are using a custom fetcher or need to intercept the token immediately after a session check:

```ts
await authClient.getSession({
  fetchOptions: {
    onSuccess: (ctx) => {
      const jwt = ctx.response.headers.get('set-auth-jwt');
      console.log('JWT:', jwt);
    },
  },
});
```

### Example decoded JWT payload

A typical decoded JWT payload looks like this:

```json
{
  "iat": 1766320685,
  "name": "User Name",
  "email": "user@email.com",
  "emailVerified": false,
  "image": null,
  "createdAt": "2025-12-20T11:04:41.437Z",
  "updatedAt": "2025-12-20T11:04:41.437Z",
  "role": "authenticated",
  "banned": false,
  "banReason": null,
  "banExpires": null,
  "id": "860dc360-609f-4b7d-9e70-ec93fe6414d3",
  "sub": "860dc360-609f-4b7d-9e70-ec93fe6414d3",
  "exp": 1766321585,
  "iss": "<YOUR_NEON_AUTH_URL_ORIGIN>",
  "aud": "<YOUR_NEON_AUTH_URL_ORIGIN>"
}
```

## Verify a token

To verify the authenticity of a JWT, you need to validate its signature using the public keys provided by JWKS (JSON Web Key Set).

Neon Auth exposes a public JWKS endpoint that contains the public keys necessary to verify the signature of your JWTs.

### The JWKS endpoint

Your Neon Auth JWKS endpoint is located at:

```
<YOUR_NEON_AUTH_URL>/.well-known/jwks.json
```

### Verification example

The following examples demonstrate how to verify a Neon Auth JWT in several programming languages. No matter which language you use, the process is the same: fetch the JWKS from the provided endpoint and use it to validate the token’s signature and claims. If your preferred language isn’t included here, you can apply these same principles in your own environment.

<Admonition type="info" title="Production Readiness">
The following examples are provided for reference only and are not guaranteed to be production‑ready. Be sure to implement proper caching, error handling, and security best practices as required for your application.
</Admonition>

<Tabs labels={["Node.js", "Python", "Go"]}>

<TabItem>

1. Install the library:

   ```bash
   npm install jose
   ```

2. Use the following example code as a reference to verify a JWT:

   ```ts shouldWrap
   import { jwtVerify, createRemoteJWKSet } from 'jose';

   const NEON_JWKS_URL = `${process.env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`;
   const JWKS = createRemoteJWKSet(new URL(NEON_JWKS_URL));

   export async function validateNeonToken(token: string) {
       try {
           const { payload } = await jwtVerify(token, JWKS, {
               issuer: new URL(process.env.NEON_AUTH_BASE_URL!).origin
           });

           return payload;
       } catch (error) {
           console.error('Token validation failed:', error);
           return null;
       }
   }

   validateNeonToken(<YOUR_JWT_TOKEN>).then((payload) => {
       console.log('Token is valid. Payload:', payload);
   }).catch(() => {
       console.log('Token is invalid.');
   });
   ```

   > Replace `<YOUR_JWT_TOKEN>` with the actual JWT token you want to verify.

</TabItem>

<TabItem>

1. Install the library:

   ```bash
   pip install PyJWT requests cryptography
   ```

2. Use the following example code as a reference to verify a JWT:

   ```py
   import base64
   import os
   from urllib.parse import urlparse

   import jwt
   import requests
   from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
   from jwt import PyJWTError

   NEON_AUTH_BASE_URL = os.environ.get("NEON_AUTH_BASE_URL", "")
   NEON_JWKS_URL = f"{NEON_AUTH_BASE_URL}/.well-known/jwks.json"
   parsed = urlparse(NEON_AUTH_BASE_URL)
   ORIGIN = f"{parsed.scheme}://{parsed.netloc}"

   def get_jwks():
       response = requests.get(NEON_JWKS_URL)
       response.raise_for_status()
       return response.json()

   def get_signing_key(token, jwks):
       unverified_header = jwt.get_unverified_header(token)
       kid = unverified_header["kid"]

       for jwk in jwks["keys"]:
           if jwk["kid"] == kid:
               x = jwk["x"]
               public_key_bytes = base64.urlsafe_b64decode(x + "==")
               return Ed25519PublicKey.from_public_bytes(public_key_bytes)

       raise ValueError("Matching JWK not found")

   def validate_neon_token(token: str):
       try:
           jwks = get_jwks()
           signing_key = get_signing_key(token, jwks)

           payload = jwt.decode(
               token, key=signing_key, algorithms=["EdDSA"], issuer=ORIGIN, audience=ORIGIN
           )

           return payload

       except PyJWTError as error:
           print("Token validation failed:", error)
           return None
       except Exception as error:
           print("Unexpected error:", error)
           return None


   payload = validate_neon_token("<YOUR_JWT_TOKEN>")

   if payload:
       print("Token is valid. Payload:", payload)
   else:
       print("Token is invalid.")
   ```

   > Replace `<YOUR_JWT_TOKEN>` with the actual JWT token you want to verify.

</TabItem>

<TabItem>

1. Install the library:

   ```bash
   go get github.com/golang-jwt/jwt/v5
   go get github.com/MicahParks/keyfunc/v3
   ```

2. Use the following example code as a reference to verify a JWT:

   ```go
   package main

   import (
       "fmt"
       "log"
       "net/url"
       "os"

       "github.com/MicahParks/keyfunc/v3"
       "github.com/golang-jwt/jwt/v5"
   )

   func ValidateNeonToken(tokenString string) (jwt.MapClaims, error) {
       baseURL := os.Getenv("NEON_AUTH_BASE_URL")
       if baseURL == "" {
           return nil, fmt.Errorf("NEON_AUTH_BASE_URL is not set")
       }

       jwksURL := fmt.Sprintf("%s/.well-known/jwks.json", baseURL)

       u, err := url.Parse(baseURL)
       if err != nil {
           return nil, fmt.Errorf("failed to parse base URL: %w", err)
       }
       expectedIssuer := fmt.Sprintf("%s://%s", u.Scheme, u.Host)

       jwks, err := keyfunc.NewDefault([]string{jwksURL})
       if err != nil {
           return nil, fmt.Errorf("failed to create JWKS from resource at %s: %w", jwksURL, err)
       }

       token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
           return jwks.Keyfunc(token)
       },
           jwt.WithIssuer(expectedIssuer),
           jwt.WithValidMethods([]string{"EdDSA"}),
       )

       if err != nil {
           return nil, err
       }

       if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
           return claims, nil
       }

       return nil, fmt.Errorf("invalid token claims")
   }

   func main() {
       tokenString := "<YOUR_JWT_TOKEN>"

       claims, err := ValidateNeonToken(tokenString)
       if err != nil {
           log.Printf("Token validation failed: %v\n", err)
           return
       }

       fmt.Printf("Token is valid. Payload: %+v\n", claims)
   }
   ```

   > Replace `<YOUR_JWT_TOKEN>` with the actual JWT token you want to verify.

</TabItem>

</Tabs>

## Limitations

Because Neon Auth is a managed service, certain server-side configurations available in the standalone Better Auth library are pre-configured by Neon and cannot be changed:

- **Signing algorithm:** Neon Auth uses **EdDSA (Ed25519)** by default for high security and performance. Ensure your verification libraries support this algorithm.
- **Expiration:** Tokens expire in **15 minutes** (access tokens). You should implement logic to refresh the token using `authClient.token()` when it expires.
- **Custom claims:** Currently, the JWT payload contains the default user information. Custom claims are not supported at this time.

## Troubleshooting

### Token rejection

If a token is rejected during verification, check the following:

1. Verify that you are using the correct JWKS endpoint for your Neon Auth instance. The issuer of the token must match the origin of your Neon Auth URL. (e.g., if your Neon Auth URL is `https://ep-xx.aws.neon.tech/neondb/auth`, the issuer should be `https://ep-xx.aws.neon.tech`).
2. Confirm that your verification library supports **EdDSA** (Ed25519).
3. Make sure the token has not expired.
4. Check that the `kid` in the JWT header matches one of the keys in the JWKS response. If not, fetch the latest keys from the JWKS endpoint.

<NeedHelp />
