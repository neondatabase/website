---
title: Using API Keys
enableTableOfContents: true
---

## Neon user

A Neon user registers and authenticates in the Neon Console using a GitHub, Google, or partner account.

Once authenticated, a Neon user can create and access projects and query project data through the [Neon SQL Editor](../query-with-neon-sql-editor) or some other client such as [psql](../query-with-psql-editor). A Neon user can also manage [PostgreSQL Users](../../reference/glossary/#postgres-users) and [Databases](../../reference/glossary/#postgres-databases) for each Neon project.

## Using API keys as a Neon User

An API key allows you to access the Neon API.

An API key provides access to any action available through the Neon Console. An API key that is no longer needed can be revoked; this action cannot be reverted. Any issued API key is valid forever until it is revoked. Neon users can generate multiple API keys.

### Generate an API key

To generate an API key:

1. Log in to [Neon Console](https://console.neon.tech).
2. Click your username in the upper right corner and click **Account**.
3. Under **Developer Settings** click **Generate new API Key**.
4. Choose a unique name that will help you remember what this key is for.
5. Click **Create** and copy the generated key.

Store your key in a safe location after generating it. You will not be able to access the key again after leaving the **Developer Settings** page. If you lose your key, revoke the lost key and generate a new key to access the Neon API. You can safely store your API key in a credential manager on your local machine, or using a credential management service like [AWS Key Management Service](https://aws.amazon.com/kms/).

API keys remain valid until you revoke them.

### Revoke an API key

To revoke an API key:

1. In the Neon Console, click your username in the upper right corner and click **Account**.
2. Under **Developer Settings**, you will see a list of issued and active API keys.
3. To revoke the key, click **Revoke**. The key is immediately revoked and any requests using the key will now fail.

### Making API calls

Every request to the Neon API endpoints must provide an API key in the `Authorization` HTTP header. For available endpoints, refer to the [Neon API Reference](https://neon.tech/api-reference).

**_Note_** The next version of the Neon API is currently in preview. It is partially implemented and intended for review purposes only. To try this version of the Neon API, refer to the [Neon API V2 reference](https://neon.tech/api-reference/v2). The API prefix for the the preview version of the Neon API is `https://console.neon.tech/api/v2`. Use this prefix when using the preview version of the Neon API.

Let’s look at how to make a `curl` request using your Neon API key. We're going to use the `projects` endpoint to get a list of the projects in an account.

All requests to the Neon API must provide the `Authorization` HTTP header with your API key in the form `Authorization: Bearer $NEON_API_KEY`.

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

The response is a list of projects. For example:

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

Refer to the [Neon API Reference](https://neon.tech/api-reference) for more information about using Neon API methods.

**_Note_:** Currently, API keys are global. When you create an API key, it is associated with the Neon user rather than a specific Neon project.
