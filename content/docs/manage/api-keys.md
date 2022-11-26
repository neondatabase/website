---
title: API Keys
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/using-api-keys
---

Any action performed in the Neon Console can be performed using the [Neon API](https://neon.tech/api-reference). Using the Neon API requires an API key. This topic describes how to generate, revoke, and use API keys.

API keys are global and belong to the Neon account. They can be used with any project that belongs to the Neon account. A Neon account can create unlimited API keys.

### Generate an API key

An API key is a secure, randomly generated, 64-bit key that you must provide when calling Neon API methods. An API key remains valid until it is revoked. 

To generate an API key:

1. Log in to [Neon Console](https://console.neon.tech).
2. Click your account in the upper right corner of the Neon Console and click **Account**.
3. Select **Developer Settings** and click **Generate new API Key**.
4. Enter a name for the API key.
5. Click **Create** and copy the generated key.

Store your key in a safe location immediately after generating it. You will not be able to view or copy the key again after leaving the **Developer Settings** page. You can safely store an API key in a locally installed credential manager or in a credential management service such as the [AWS Key Management Service](https://aws.amazon.com/kms/). If you lose an API key, revoke it and generate a new one.

### Revoke an API key

An API key that is no longer needed can be revoked. This action cannot be reverted.

To revoke an API key:

1. Click your account in the upper right corner of the Neon Console and click **Account**.
2. Select **Developer Settings** to see a list of API keys.
3. To revoke a key, click **Revoke**. The key is immediately revoked. Any request that uses the key will now fail.

### Make an API call

<Admonition type="important">
The next version of the Neon API is currently in preview. It is partially implemented and intended for review purposes only. To try this version of the Neon API, refer to the [Neon API V2 reference](https://neon.tech/api-reference/v2) for supported endpoints. The base URL for the preview version of the Neon API is `https://console.neon.tech/api/v2`. Use this base URL when using the preview version of the Neon API.
</Admonition>

The following `cURL` example uses the `/projects` endpoint to retrieve projects that belong to your Neon account.

```bash
curl -X GET -H "Authorization: Bearer $NEON_API_KEY" "accept: application/json"
"https://console.neon.tech/api/v1/projects" | jq
```

where:

- The `Authorization: Bearer $NEON_API_KEY` entry in the header specifies your API key. Replace `$NEON_API_KEY` with your actual 64-bit API key. A request without this header, or containing an invalid or revoked API key, fails and returns a `401 Unauthorized` HTTP status code.
- `"accept: application/json"` specifies the accepted response type.
- `"https://console.neon.tech/api/v1/projects"` is the resource URL, which includes the base URL for the Neon API and the `/projects` endpoint.  
- [`jq`](https://stedolan.github.io/jq/) is an optional third-party tool that formats the JSON response, making it easier to read.

A response for a Neon user with a single project appears similar to the following:

```json
[

  {

    "id": "wispy-sea-654321",
    "parent_id": null,
    "roles": [
      {
        "id": 683636,
        "name": "casey",
        "password": "",
        "dsn": "postgres://casey@wispy-sea-654321.cloud.neon.tech:31062"
      },
      {
        "id": 683637,
        "name": "web_access",
        "password": "",
        "dsn": "postgres://web_access@wispy-sea-654321.cloud.neon.tech:31062"
      }
    ],
    "databases": [
      {
        "id": 378719,
        "name": "main",
        "owner_id": 683636
      }
    ],
    "name": "wispy-sea-654321",
    "created_at": "2022-11-08T17:54:08.467908Z",
    "updated_at": "2022-11-08T17:54:08.467908Z",
    "region_id": "aws-us-west-2",
    "instance_handle": "scalable",
    "instance_type_id": "1",
    "region_name": "US West (Oregon)",
    "platform_name": "Serverless",
    "platform_id": "aws",
    "settings": {},
    "pending_state": null,
    "current_state": "idle",
    "deleted": false,
    "size": 0,
    "max_project_size": 0,
    "pooler_enabled": false,
    "pg_version": 15,
    "proxy_host": "cloud.neon.tech"
  }
]
```

Refer to the [Neon API Reference](https://neon.tech/api-reference) for other supported Neon API endpoints.
