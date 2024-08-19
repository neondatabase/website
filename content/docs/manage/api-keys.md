---
title: Manage API Keys
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/using-api-keys
  - /docs/get-started-with-neon/api-keys
updatedOn: '2024-08-13T15:31:30.507Z'
---

Most actions performed in the Neon Console can be performed using the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). Using the Neon API requires an API key. This topic describes how to generate, revoke, and use API keys.

API keys are global and belong to your Neon account. They can be used with any project that belongs to your Neon account. While there is no strict limit on the number of API keys you can create, we recommend keeping it under 10,000 per Neon account.

## Create an API key

An API key (or token) is a randomly-generated 64-bit key that you must provide when calling Neon API methods. An API key remains valid until it is revoked.

To generate an API key:

1. Log in to the [Neon Console](https://console.neon.tech).
2. Click your account in the top right corner of the Neon Console, and select **Account settings**.
3. Select **API keys** and click **Create new API Key**.
4. Enter a name for the API key.
5. Click **Create** and copy the generated key.

Store your key in a safe location. You will not be able to view or copy the key again after leaving the **Account settings** page. You can safely store an API key in a locally installed credential manager or in a credential management service such as the [AWS Key Management Service](https://aws.amazon.com/kms/). If you lose an API key, revoke it and generate a new one.

## Revoke an API key

An API key that is no longer needed can be revoked. This action cannot be reversed.

To revoke an API key:

1. Click your account in the top right corner of the Neon Console and select **Account settings**.
2. Select **API keys** to see a list of API keys.
3. To revoke a key, click **Revoke**. The key is immediately revoked. Any request that uses the key now fails.

## Make an API call

The following `cURL` example uses the `/projects` endpoint to retrieve projects that belong to your Neon account.

```bash
curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" | jq
```

where:

- `"https://console.neon.tech/api/v2/projects"` is the resource URL, which includes the base URL for the Neon API and the `/projects` endpoint.
- The `"Accept: application/json"` in the header specifies the accepted response type.
- The `Authorization: Bearer $NEON_API_KEY` entry in the header specifies your API key. Replace `$NEON_API_KEY` with an actual 64-bit API key. A request without this header, or containing an invalid or revoked API key, fails and returns a `401 Unauthorized` HTTP status code.
- [`jq`](https://stedolan.github.io/jq/) is an optional third-party tool that formats the JSON response, making it easier to read.

<details>
<summary>Response body</summary>

```json
{
  "projects": [
    {
      "cpu_used_sec": 0,
      "id": "purple-shape-411361",
      "platform_id": "aws",
      "region_id": "aws-us-east-2",
      "name": "purple-shape-411361",
      "provisioner": "k8s-pod",
      "pg_version": 15,
      "locked": false,
      "created_at": "2023-01-03T18:22:56Z",
      "updated_at": "2023-01-03T18:22:56Z",
      "proxy_host": "us-east-2.aws.neon.tech",
      "branch_logical_size_limit": 3072
    }
  ]
}
```

</details>

Refer to the [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api) for other supported Neon API methods.

## Manage API keys with the Neon API

API key actions performed in the Neon Console can also be performed using the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). The following examples demonstrate how to create, view, and revoke API keys using the Neon API.

### Prerequisites

You can create and manage API keys using the Neon API, but you need an API key to start with. You can obtain an API key from the Neon Console. For instructions, see [Create an API key](#create-an-api-key). In the examples shown below, `$NEON_API_KEY` is specified in place of an actual API key, which you must provide when making a Neon API request.

The `jq` option specified in each example is an optional third-party tool that formats the JSON response, making it easier to read. For information about this utility, see [jq](https://stedolan.github.io/jq/).

### Create an API key with the API

The following Neon API method creates an API key. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/createapikey).

```http
POST /api_keys
```

The API method appears as follows when specified in a cURL command. You must specify the `key_name` attribute and a name for the API key.

```bash
curl https://console.neon.tech/api/v2/api_keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -d '{"key_name": "mynewkey"}' | jq
```

The response body includes an `id` for the key and a generated 64-bit `key` value, which can be used to access the Neon API. API keys should stored and managed securely, as they provide access to all objects in your Neon account.

<details>
<summary>Response body</summary>

```json
{
  "id": 177630,
  "key": "pgh66qptg0cdbzk9jmu4qpvn65jhvwkpfzc6qzi57z814ispmhfu7q4q85r44zv8"
}
```

</details>

### List API keys with the API

The following Neon API method lists API keys for your Neon account. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/listapikeys).

```http
GET /api_keys
```

The API method appears as follows when specified in a cURL command. No parameters are required.

```bash
curl "https://console.neon.tech/api/v2/api_keys" \
 -H "Authorization: Bearer $NEON_API_KEY" \
 -H "Accept: application/json"  | jq
```

<details>
<summary>Response body</summary>

```json
[
  {
    "created_at": "2022-12-23T20:52:29Z",
    "id": 177630,
    "last_used_at": "2022-12-23T20:53:19Z",
    "last_used_from_addr": "192.0.2.21",
    "name": "mykey"
  },
  {
    "created_at": "2022-12-23T20:49:01Z",
    "id": 177626,
    "last_used_at": "2022-12-23T20:53:19Z",
    "last_used_from_addr": "192.0.2.21",
    "name": "sam_key"
  },
  {
    "created_at": "2022-12-23T20:48:31Z",
    "id": 177624,
    "last_used_at": "2022-12-23T20:53:19Z",
    "last_used_from_addr": "192.0.2.21",
    "name": "sally_key"
  }
]
```

</details>

### Revoke an API key with the API

The following Neon API method revokes the specified API key. The `key_id` is a required parameter. To view the API documentation for this method, refer to the [Neon API reference](https://api-docs.neon.tech/reference/revokeapikey).

```http
DELETE /api_keys/{key_id}
```

The API method appears as follows when specified in a cURL command:

```bash
curl -X DELETE \
  'https://console.neon.tech/api/v2/api_keys/177630' \
  -H "Accept: application/json"  \
  -H "Authorization: Bearer $NEON_API_KEY" | jq
```

<details>
<summary>Response body</summary>

```json
{
  "id": 177630,
  "name": "mykey",
  "revoked": true,
  "last_used_at": "2022-12-23T23:38:35Z",
  "last_used_from_addr": "192.0.2.21"
}
```

</details>

<NeedHelp/>
