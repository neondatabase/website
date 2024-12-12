---
title: Manage API Keys
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/using-api-keys
  - /docs/get-started-with-neon/api-keys
updatedOn: '2024-12-04T16:09:42.523Z'
---

Most actions performed in the Neon Console can also be performed using the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). You'll need an API key to validate your requests. Each key is a randomly-generated 64-bit token that you must include when calling Neon API methods. All keys remain valid until deliberately revoked.

## Types of API keys

Neon supports these types of API keys:

- **Personal API key** — These keys are tied to your individual Neon account. They can access your personal projects by default, and organization projects if you specify the organization ID in your API requests.
- **Organization API key** — These keys are scoped to a specific organization. They allow full [admin-level access](/docs/manage/organizations#user-roles-and-permissions) to all projects within that organization.
- **Project-scoped organization API key** — These keys are scoped to a specific project within an organization. They provide [member-level access](/docs/manage/organizations#user-roles-and-permissions) to the specified project, and only that project, and cannot perform destructive actions like project deletion.

While there is no strict limit on the number of API keys you can create, we recommend keeping it under 10,000 per Neon account.

## Create a personal API key

You can create a personal API key in the Neon Console or using the Neon API.
<Tabs labels={["Console", "API"]}>

<TabItem>
In the Neon Console, select **Account settings** > **API keys**. You'll see a list of existing keys. Click **Create key** to create a new key.

<Admonition type="note">Make sure you copy the key immediately. You won't be able to view it again after leaving the page.</Admonition>

![Creating a personal API key in the Neon Console](/docs/manage/personal_api_key.png)

</TabItem>

<TabItem>

You'll need an existing personal key (create one from the Neon Console) in order to create new keys using the API. If you've got a key ready, you can use the following request to generate new keys:

```bash shouldWrap
curl https://console.neon.tech/api/v2/api_keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PERSONAL_API_KEY" \
  -d '{"key_name": "my-key"}'
```

**Parameters:**
- `key_name`: A descriptive name for the API key (e.g., "development", "staging", "ci-pipeline")

**Response:**
```json
{
  "id": 177630,
  "key": "neon_api_key_1234567890abcdef1234567890abcdef"
}
```

</TabItem>
</Tabs>

## Create an organization API key

Organization API keys provide admin-level access to all organization resources. Only admins can create these keys. When creating an organization API key, Neon verifies that your personal API key belongs to a user with admin permissions in the specified organization. 

For more detail about organization-related methods, see [Organization API Keys](/docs/manage/orgs-api#api-keys).

<Tabs labels={["Console", "API"]}>

<TabItem>

Navigate to your organization's **Settings** > **API keys** to create a new key.

Make sure you copy the key immediately. You won't be able to view it again after leaving the page.

![creating an api key from the console](/docs/manage/org_api_keys.png)
</TabItem>

<TabItem>

To create an organization API key via the API, you need to use your personal API key and have admin permissions in the specified organization.

```bash shouldWrap
curl --request POST \
     --url 'https://console.neon.tech/api/v2/organizations/{org_id}/api_keys' \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer $PERSONAL_API_KEY' \
     --data '{"key_name": "orgkey"}'
```

**Response:**
```json
{
    "id": 165434,
    "key": "neon_org_key_1234567890abcdef1234567890abcdef",
    "name": "orgkey",
    "created_at": "2022-11-15T20:13:35Z",
    "created_by": "user_01h84bfr2npa81rn8h8jzz8mx4"
}
```
</TabItem>

</Tabs>

## Create a project-scoped organization API key

Organization API keys can be scoped to individual projects within that organization. Project-scoped API keys have [member-level access](/docs/manage/organizations#user-roles-and-permissions), meaning they **cannot** delete the project they are associated with.

<Admonition type="note">Creating project-scoped keys requires using a personal API key. Organization API keys cannot be used to create additional API keys.</Admonition>

To create an API key scoped to a specific project:

```bash shouldWrap
curl --request POST \
     --url 'https://console.neon.tech/api/v2/organizations/{org_id}/api_keys' \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer $PERSONAL_API_KEY' \
     --data '{"key_name":"only-this-project", "project_id": "some-project-123"}'
```

**Parameters:**

- `org_id`: The ID of your organization
- `key_name`: A descriptive name for the API key
- `project_id`: The ID of the project to which the API key will be scoped

**Example Response:**

```json
{
  "id": 1904821,
  "key": "neon_project_key_1234567890abcdef1234567890abcdef",
  "name": "test-project-scope",
  "created_at": "2024-12-11T21:34:58Z",
  "created_by": "user_01h84bfr2npa81rn8h8jzz8mx4",
  "project_id": "project-id-123"
}
```

**Usage:**

API keys scoped to a project will have permissions limited to the specified project. This enhances security by ensuring that the API key cannot access other projects within the organization.

**Member-Level Access Restrictions:**

- **Cannot Delete Scoped Project**: Project-scoped API keys are restricted from deleting the project they are associated with.
  
  ```bash
  curl --request DELETE \
       --url 'https://console.neon.tech/api/v2/projects/some-project-123' \
       --header 'authorization: Bearer $ONLY_THIS_PROJECT_API_KEY'
  ```
  
  **Response:**
  
  ```json
  {
    "error": "Not Found",
    "message": "Project not found or access denied."
  }
  ```

### Using API keys

When using an **Organization API Key**:

- **Without Project Scope**: Automatically scoped to the entire organization
  
  ```bash shouldWrap
  curl --request GET \
       --url 'https://console.neon.tech/api/v2/projects' \
       --header 'authorization: Bearer $ORG_API_KEY'
  ```

- **With Project Scope**: Scoped to the specified project
  
  ```bash shouldWrap
  curl --request GET \
       --url 'https://console.neon.tech/api/v2/projects/some-project-123' \
       --header 'authorization: Bearer $ONLY_THIS_PROJECT_API_KEY'
  ```

### Member-level access restrictions

Project-scoped API keys have member-level access, which means they:
- **Cannot Delete Scoped Project**: Project-scoped API keys are restricted from deleting the project they are associated with.
  
  ```bash shouldWrap
  curl --request DELETE \
       --url 'https://console.neon.tech/api/v2/projects/some-project-123' \
       --header 'authorization: Bearer $ONLY_THIS_PROJECT_API_KEY'
  ```
  
  **Response:**
  ```json
  {
    "error": "Not Found",
    "message": "Project not found or access denied."
  }
  ```

## Make an API call

The following example demonstrates how to use your API key to retrieve projects:

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
  "key": "neon_api_key_1234567890abcdef1234567890abcdef"
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

## List API keys

<Tabs labels={["Console", "API"]}>

<TabItem>
1. Click your account in the top right corner of the Neon Console and select **Account settings**
2. Select **API keys** to see a list of API keys
</TabItem>

<TabItem>
```bash
curl "https://console.neon.tech/api/v2/organizations/{org_id}/api_keys" \
 -H "Authorization: Bearer $PERSONAL_API_KEY" \
 -H "Accept: application/json"
```

**Response:**
```json
[
  {
    "id": 165432,
    "name": "orgkey_1",
    "key": "neon_org_key_abcdef1234567890abcdef1234567890",
    "created_at": "2022-11-15T20:13:35Z",
    "created_by": {
      "id": "user_01h84bfr2npa81rn8h8jzz8mx4",
      "name": "John Smith",
      "image": "http://link.to.image"
    },
    "last_used_at": "2022-11-15T20:22:51Z",
    "last_used_from_addr": "192.0.2.255"
  }
]
```
</TabItem>

</Tabs>

## Revoke API Keys

You should revoke API keys that are no longer needed or if you suspect a key may have been compromised. Key details:

- The action is immediate and permanent
- All API requests using the revoked key will fail with a 401 Unauthorized error
- The key cannot be reactivated - you'll need to create a new key if access is needed again

### Who can revoke keys

- Personal API keys can only be revoked by the account owner
- Organization API keys can be revoked by organization admins
- Project-scoped keys can be revoked by organization admins

<Tabs labels={["Console", "API"]}>

<TabItem>

In the Neon Console, navigate to **Account settings** > **API keys** and click **Revoke** next to the key you want to revoke. The key will be immediately revoked. Any request that uses this key will now fail.

![Revoking an API key in the Neon Console](/docs/manage/revoke_api_key.png)

</TabItem>

<TabItem>
```bash
curl -X DELETE \
  'https://console.neon.tech/api/v2/organizations/{org_id}/api_keys/{key_id}' \
  -H "Accept: application/json"  \
  -H "Authorization: Bearer $PERSONAL_API_KEY"
```

**Response:**
```json
{
  "id": 165435,
  "name": "orgkey",
  "created_at": "2022-11-15T20:13:35Z",
  "created_by": "user_01h84bfr2npa81rn8h8jzz8mx4",
  "last_used_at": "2022-11-15T20:15:04Z",
  "last_used_from_addr": "192.0.2.255",
  "revoked": true
}
```

You can obtain `key_id` values by listing the API keys for an organization.
</TabItem>

</Tabs>

<NeedHelp/>
