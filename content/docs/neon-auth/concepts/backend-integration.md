---
title: Backend Integration
subtitle: Integrate Neon Auth with your own server using the REST APIs
enableTableOfContents: true
tag: beta
---

To authenticate your endpoints, you need to send the user's access token in the headers of the request to your server, and then make a request to Neon Auth's server API to verify the user's identity.

## Sending requests to your server endpoints

To authenticate your own server endpoints using Neon Auth's server API, you need to protect your endpoints by sending the user's access token in the headers of the request.

On the client side, you can retrieve the access token from the `user` object by calling `user.getAuthJson()`. This will return an object containing `accessToken`.

Then, you can call your server endpoint with these two tokens in the headers, like this:

```typescript shouldWrap
const { accessToken } = await user.getAuthJson();
const response = await fetch('/api/users/me', {
  headers: {
    'x-stack-access-token': accessToken,
  },
  // your other options and parameters
});
```

## Authenticating the user on the server endpoints

Neon Auth provides two methods for authenticating users on your server endpoints:

1. **JWT Verification**: A fast, lightweight approach that validates the user's token locally without making external requests. While efficient, it provides only essential user information encoded in the JWT.
2. **REST API Verification**: Makes a request to Neon Auth's servers to validate the token and retrieve comprehensive user information. This method provides access to the complete, up-to-date user profile.

### Using JWT

<Tabs labels={["Node.js"]}>

<TabItem>

```javascript shouldWrap
// you need to install the jose library if it's not already installed
import * as jose from 'jose';

// you can cache this and refresh it with a low frequency
const jwks = jose.createRemoteJWKSet(
  new URL('https://api.stack-auth.com/api/v1/projects/<your-project-id>/.well-known/jwks.json')
);

const accessToken = 'access token from the headers';

try {
  const { payload } = await jose.jwtVerify(accessToken, jwks);
  console.log('Authenticated user with ID:', payload.sub);
} catch (error) {
  console.error(error);
  console.log('Invalid user');
}
```

</TabItem>

</Tabs>

### Using the REST API

<Tabs labels={["Node.js", "Python"]}>

<TabItem>

```javascript shouldWrap
const url = 'https://api.stack-auth.com/api/v1/users/me';
const headers = {
  'x-stack-access-type': 'server',
  'x-stack-project-id': 'your Neon Auth project ID',
  'x-stack-secret-server-key': 'your Neon Auth server key',
  'x-stack-access-token': 'access token from the headers',
};

const response = await fetch(url, { headers });
if (response.status === 200) {
  console.log('User is authenticated', await response.json());
} else {
  console.log('User is not authenticated', response.status, await response.text());
}
```

</TabItem>

<TabItem>

```python shouldWrap
import requests

url = 'https://api.stack-auth.com/api/v1/users/me'
headers = {
'x-stack-access-type': 'server',
'x-stack-project-id': 'your Neon Auth project ID',
'x-stack-secret-server-key': 'your Neon Auth server key',
'x-stack-access-token': 'access token from the headers',
}

response = requests.get(url, headers=headers)
if response.status_code == 200:
print('User is authenticated', response.json())
else:
print('User is not authenticated', response.status_code, response.text)
```

</TabItem>

</Tabs>
