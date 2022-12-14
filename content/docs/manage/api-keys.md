---
title: Manage API Keys
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/using-api-keys
  - /docs/get-started-with-neon/api-keys
---

Most actions performed in the Neon Console can be performed using the [Neon API](https://neon.tech/api-reference). Using the Neon API requires an API key. This topic describes how to generate, revoke, and use API keys.

API keys are global and belong to your Neon account. They can be used with any project that belongs to your Neon account. A Neon account can create unlimited API keys.

### Generate an API key

An API key is a secure, randomly generated, 64-bit key that you must provide when calling Neon API methods. An API key remains valid until it is revoked.

To generate an API key:

1. Log in to [Neon Console](https://console.neon.tech).
2. Click your account in the upper right corner of the Neon Console, and click **Account**.
3. Select **Developer Settings** and click **Generate new API Key**.
4. Enter a name for the API key.
5. Click **Create** and copy the generated key.

Store your key in a safe location immediately after generating it. You will not be able to view or copy the key again after leaving the **Developer Settings** page. You can safely store an API key in a locally installed credential manager or in a credential management service such as the [AWS Key Management Service](https://aws.amazon.com/kms/). If you lose an API key, revoke it and generate a new one.

### Revoke an API key

An API key that is no longer needed can be revoked. This action cannot be reversed.

To revoke an API key:

1. Click your account in the upper right corner of the Neon Console and click **Account**.
2. Select **Developer Settings** to see a list of API keys.
3. To revoke a key, click **Revoke**. The key is immediately revoked. Any request that uses the key will now fail.

### Make an API call

<Admonition type="important">
[Neon API v1](https://neon.tech/api-reference) is deprecated. Support for it will be removed in a future release. Please migrate your applications to [Neon API V2 reference](https://neon.tech/api-reference/v2/). The base URL for the new Neon API is `https://neon.tech/api-reference/v2/`.
</Admonition>

The following `cURL` example uses the `/projects` endpoint to retrieve projects that belong to your Neon account.

```bash
curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer $NEON_API_KEY' | jq
```

where:

- `"https://neon.tech/api-reference/v2/projects"` is the resource URL, which includes the base URL for the Neon API and the `/projects` endpoint.
- The `"Accept: application/json"` in the header specifies the accepted response type.
- The `Authorization: Bearer $NEON_API_KEY` entry in the header specifies your API key. Replace `$NEON_API_KEY` with your actual 64-bit API key. A request without this header, or containing an invalid or revoked API key, fails and returns a `401 Unauthorized` HTTP status code.
- [`jq`](https://stedolan.github.io/jq/) is an optional third-party tool that formats the JSON response, making it easier to read.

A response for a Neon user with a single project appears similar to the following:

```json
{
  "projects": [
    {
      "id": "autumn-disk-123331",
      "platform_id": "aws",
      "region_id": "aws-us-east-2",
      "name": "autumn-disk-123331",
      "provisioner": "k8s-pod",
      "pg_version": 15,
      "locked": false,
      "created_at": "2022-12-07T00:45:05Z",
      "updated_at": "2022-12-07T00:45:05Z",
      "proxy_host": "us-east-2.aws.neon.tech"
    }
  ]
}
```

Refer to the [Neon API Reference](https://neon.tech/api-reference) for other supported Neon API endpoints.
