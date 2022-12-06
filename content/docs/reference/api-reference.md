---
title: Neon API
redirectFrom:
  - /docs/reference/about
  - /docs/api/about
---

The Neon API allows you to manage projects your Neon projects programmatically.

Refer to the [Neon API v2 reference](https://neon.tech/api-reference/v2) for supported methods.

<Admonition type="warning">
The [Neon API v1 reference](https://neon.tech/api-reference) is deprecated. Support for it will be removed in a future release.
</Admonition>

The Neon API is a REST API. It provides resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and supports standard HTTP response codes, authentication, and verbs.

## Authentication

The Neon API uses API keys to authenticate requests. You can view and manage API keys for your account in the Neon Console. For instructions, refer to [API keys](../../manage/api-keys).

The client must send an API key in the Authorization header when making requests, using the bearer authentication scheme. For example:

```curl
curl -X GET -H "Authorization: Bearer $NEON_API_KEY" "accept: application/json"
"https://console.neon.tech/api/v2/projects"
```

## Neon API base URL

The base URL for a Neon API request is:

```text
https://console.neon.tech/api/v2/
```

Append a Neon API method path to the base URL to construct the full URL for a request. For example:

```text
https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}
```

## Using the Neon API reference to construct and execute requests

You can use the the [Neon API v2 reference](https://neon.tech/api-reference/v2) to construct and execute Neon API requests. Click **Authorize** to add your API key token, and for each method, click **Try it out** and supply the required parameters and request body attributes. Click **Execute** to create and run the request.

