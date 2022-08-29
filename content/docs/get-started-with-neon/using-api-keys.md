---
title: Using API Keys
---

## Neon User

A Neon user is identified by their email address.

A user registers and authenticates in Neon Web UI with their GitHub or Google account. More authentication methods are coming soon.

Once authenticated, a user can create and access Projects and [query Project data](../tutorials#query-via-ui). You can also manage [Postgres Users](../../reference/glossary/#postgres-users) and [Databases](../../reference/glossary/#postgres-databases) in each Project.

## Using API keys as a Neon User

API keys allow users to access the Neon application programming interface.

An API key provides access to any action available to the user. An API key that is no longer needed can be revoked; this action cannot be reverted. Any issued API key is valid forever until it is revoked. Neon users can generate multiple API keys.

### Issue a New API Key

Here's how to issue a new API key:

1. Start by logging in to [Neon Console](https://console.neon.tech).
2. Click on your username in the upper right corner, then click `Account`.
3. Under `Developer Settings` click on `Generate new API Key`.
4. Choose a unique name that will help you remember what this key is for.
5. Click the `Create` button and copy the generated key.

You need to store your key in a safe location after generating it, you will not be able to access this value again after leaving your `Developer Settings`. If you lose your key, revoke the lost key and create a new key to access the Neon API. You can safely store your API key in a credential manager on your local machine, or using a credential management service like [AWS Key Management Service](https://aws.amazon.com/kms/).

Remember, all API keys remain valid until you revoke them.

### Revoke an API Key

1. In your Neon Console, click on your username in the upper right corner and click `Account`.
2. Under `Developer Settings` you will see the list of issued and active API keys.
3. To revoke the key forever, click the `Revoke` button. This will immediately revoke the key, all the requests using this key will now fail.

### Making API Calls

Every request to the Neon API endpoints should pass an API key in the `Authorization` HTTP header. You can see the available endpoints in our [API Reference](https://neon.tech/api-reference).

Let’s look at how to make a `curl` request using your Neon API key. We're going to use the `projects` endpoint to get a list of the projects in an account.

All requests to the API need to have the `Authorization` HTTP header with your API key in the form `Authorization: Bearer EXAMPLEKEY`.

```bash
curl -X GET -H "Authorization: Bearer $NEON_API_KEY" "accept: application/json"
```

Any request without this header, or containing an invalid or revoked API key, will fail and return a `401 Unauthorized` HTTP status code.

To make the API call, add `/projects` to the prefix `https://console.neon.tech/api/v1`. The full path should look like this:

```bash
"https://console.neon.tech/api/v1/projects" | jq
```

Once the request above receives a JSON response containing the saved projects, we use the third-party tool [`jq`](https://stedolan.github.io/jq/) to make it easier to parse the incoming JSON response. That's all you need to call the Neon API.

The full `curl` request should look like this:

```bash
curl -X GET -H "Authorization: Bearer $NEON_API_KEY" "accept: application/json"
"https://console.neon.tech/api/v1/projects" | jq
```

Your response will be a list of projects, below is a shortened example of what the response should look like:

```json
[
  {
    "created_at": "2022-07-29T08:00:40.502Z",
    "current_state": "init",
    "databases": [
      {
        "id": 0,
        "name": "ExampleDB",
        "owner_id": 0
      }
    ],
    "deleted": false,
    "id": "throbbing-forest-567082",
    "updated_at": "2022-07-29T08:00:40.502Z"
  },
  {
    "created_at": "2022-07-29T08:00:40.502Z",
    "current_state": "init",
    "databases": [
      {
        "id": 0,
        "name": "ExampleDB",
        "owner_id": 0
      }
    ],
    "deleted": false,
    "id": "purple-wave-147596",
    "updated_at": "2022-07-29T08:00:40.502Z"
  }
]
```

Check out the [API Reference](https://neon.tech/api-reference) for more information about using the API keys and available API methods.

Note: currently API keys cannot be scoped to specific Projects.
