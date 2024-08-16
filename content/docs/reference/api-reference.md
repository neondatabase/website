---
title: Neon API
enableTableOfContents: true
redirectFrom:
  - /docs/reference/about
  - /docs/api/about
updatedOn: '2024-07-25T12:53:42.435Z'
---

The Neon API allows you to manage your Neon projects programmatically.

Refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) for supported methods.

The Neon API is a REST API. It provides resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and supports standard HTTP response codes, authentication, and verbs.

## Authentication

The Neon API uses API keys to authenticate requests. You can view and manage API keys for your account in the Neon Console. For instructions, refer to [Manage API keys](/docs/manage/api-keys).

The client must send an API key in the Authorization header when making requests, using the bearer authentication scheme. For example:

```bash
curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
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

You can use the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) to execute Neon API requests. Select an endpoint, enter an API key token in the **Bearer** field, supply any required parameters and properties, and click **Try it!** to execute the request. For information about obtaining API keys, see [Manage API keys](/docs/manage/api-keys).

The [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) also provides request and response body examples that you can reference when constructing your own requests.

For additional Neon API examples, refer to the following topics:

- [Manage API keys with the Neon API](/docs/manage/api-keys#manage-api-keys-with-the-neon-api)
- [Manage projects with the Neon API](/docs/manage/projects#manage-projects-with-the-neon-api)
- [Manage branches with the Neon API](/docs/manage/branches#branching-with-the-neon-api)
- [Manage computes with the Neon API](/docs/manage/endpoints#manage-computes-with-the-neon-api)
- [Manage roles with the Neon API](/docs/manage/users#manage-roles-with-the-neon-api)
- [Manage databases with the Neon API](/docs/manage/databases#manage-databases-with-the-neon-api)
- [View operations with the Neon API](/docs/manage/operations#operations-and-the-neon-api)

<Admonition type="important">
When using the Neon API programmatically, you can poll the operation `status` to ensure that an operation is finished before proceeding with the next API request. For more information, see [Poll operation status](/docs/manage/operations#poll-operation-status).
</Admonition>

<NeedHelp/>
