---
title: Manage API Keys
summary: >-
  Neon API keys are bearer tokens required to authenticate Neon REST API
  requests, available in personal, organization, and project-scoped variants.
  Use this page to create, list, or revoke keys via the Console or API. Each
  key's secret is shown only once at creation; losing it requires revoking and
  replacing the key, since revocation is immediate and permanent.
enableTableOfContents: true
redirectFrom:
  - /docs/get-started/using-api-keys
  - /docs/get-started/api-keys
updatedOn: '2026-08-26T13:16:52.511Z'
---

Most actions performed in the Neon Console can also be performed using the [Neon API](/docs/reference/api). You'll need an API key to validate your requests. Each key is a randomly-generated 64-bit token that you must include when calling Neon API methods. All keys remain valid until deliberately revoked.

## Types of API keys

Neon supports three types of API keys:

| Key Type               | Who Can Create              | Scope                                                | Validity                                                                 |
| ---------------------- | --------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| Personal API Key       | Any user                    | All organization projects where the user is a member | Valid until revoked; org project access ends if user leaves organization |
| Organization API Key   | Organization administrators | All projects within the organization                 | Valid until revoked                                                      |
| Project-scoped API Key | Organization administrators | Single specified project                             | Valid until revoked or project leaves organization                       |

Only organization **Admins** can create organization or project-scoped keys. If you're an Editor, Viewer, or Collaborator, create a personal API key instead; it's scoped to your own access. See [User permissions](/docs/manage/user-permissions) for what each role can do.

While there is no strict limit on the number of API keys you can create, we recommend keeping it under 10,000 per Neon account.

## Creating API keys

You create and manage API keys in the [Neon Console](https://console.neon.tech), and where you go depends on the key type:

- **Personal keys:** open the user menu and select **Account settings** > **API keys**.
- **Organization and project-scoped keys:** switch to your organization, then go to **Settings** > **API keys**.

Each page lists your existing keys with their name, ID, and creation details, plus a button to create a new key. You'll need to create your first API key from the Console, where you are already authenticated. You can then use that key to generate new keys from the API.

> When creating API keys from the Neon Console, the secret token will be displayed only once. Copy it immediately and store it securely in a credential manager (like AWS Key Management Service or Azure Key Vault); you won't be able to retrieve it later. If you lose an API key, you'll need to revoke it and create a new one.

<Admonition type="important">
You are responsible for maintaining the records and associations of any API keys in your environment and systems.
</Admonition>

### Create a personal API key

You can create a personal API key in the Neon Console, with the Neon CLI, or using the Neon API.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>
In the Neon Console, select **Account settings** > **API keys**. You'll see a list of any existing keys, along with the button to create a new key.

![Creating a personal API key in the Neon Console](/docs/manage/personal_api_key.png)
</TabItem>

<TabItem>

The [`neon api-keys create`](/docs/cli/api-keys#create) command creates a personal key. `--name` is required, and the key is printed once:

```bash
neon api-keys create --name development
```

```text shouldWrap
API key
┌─────────┬─────────────┐
│ Id      │ Name        │
├─────────┼─────────────┤
│ 3225999 │ development │
└─────────┴─────────────┘

napi_examplekey1234567890abcdefghijklmnopqrstuvwxyz
WARNING: Store this key now: it is not shown again.
WARNING: This key reaches everything your account can, in every organization. Pass --org-id or --project-id to narrow it.
```

The key is the last line of stdout, so you can capture it directly:

```bash shouldWrap
echo "NEON_API_KEY=$(neon api-keys create --name local-dev -o json | jq -r .key)" >> .env
```

</TabItem>

<TabItem>
You'll need an existing personal key (create one from the Neon Console) in order to create new keys using the API. If you've got a key ready, you can use the following request to generate new keys:

```bash shouldWrap
curl https://console.neon.tech/api/v2/api_keys
  -H "Content-Type: application/json"
  -H "Authorization: Bearer $PERSONAL_API_KEY"
  -d '{"key_name": "my-key"}'
```

**Parameters:**

- `key_name`: A descriptive name for the API key (for example, "development", "staging", "ci-pipeline")

**Response:**

```json
{
  "id": 177630,
  "key": "neon_api_key_1234567890abcdef1234567890abcdef"
}
```

To view the API documentation for this method, refer to the [Neon API Reference](/docs/reference/api/api-keys/create-api-key).

</TabItem>
</Tabs>

### Create an organization API key

Organization API keys provide admin-level access to all organization resources. Only organization admins can create these keys. To create an organization API key, you must use your personal API key and be an administrator in the organization. Neon will verify your admin status before allowing the key creation.

For more detail about organization-related methods, see [Organization API Keys](/docs/manage/orgs-api#api-keys).

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

Navigate to your organization's **Settings** > **API keys** to view a list of existing keys and the button to create a new key.

![creating an api key from the console](/docs/manage/org_api_keys.png)
</TabItem>

<TabItem>

Pass `--org-id` to [`neon api-keys create`](/docs/cli/api-keys#create). Find your organization ID with `neon orgs list`:

```bash
neon api-keys create --name orgkey --org-id org-example-12345678
```

```text shouldWrap
API key
┌─────────┬────────┐
│ Id      │ Name   │
├─────────┼────────┤
│ 3243302 │ orgkey │
└─────────┴────────┘

napi_examplekey1234567890abcdefghijklmnopqrstuvwxyz
WARNING: Store this key now: it is not shown again.
WARNING: This key reaches every project in org-example-12345678, including ones created later. Pass --project-id instead to restrict it to one.
```

You need admin permissions in the organization. As a member the command fails with a permissions error naming your role.

</TabItem>

<TabItem>

To create an organization API key via the API, you need to use your personal API key. You also need to have admin-level permissions in the specified organization. This endpoint is rate limited to 10 requests per second; if you create many keys, throttle your requests or use retries with backoff.

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

### Create project-scoped organization API keys

Project-scoped API keys have [**Editor** access](/docs/manage/user-permissions#per-project-permissions) on their project, meaning they can read and modify project resources but **cannot** delete the project or manage who can access it. These keys:

- Can only access and manage the specified project
- Cannot perform organization-related actions or create new projects
- Will stop working if the project is transferred out of the organization

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>
In your organization's **Settings** > **API keys**, click **Create new** and select **Project-scoped** to create a key for your chosen project.

![Project-scoped API keys from the Console](/docs/manage/project_scoped_select.png)

</TabItem>

<TabItem>

Pass `--project-id` to [`neon api-keys create`](/docs/cli/api-keys#create). You don't name the organization: the CLI looks it up from the project, and `--org-id` and `--project-id` are mutually exclusive.

```bash shouldWrap
neon api-keys create --name only-this-project --project-id some-project-123
```

```text shouldWrap
API key
┌─────────┬───────────────────┬───────────────────┐
│ Id      │ Name              │ Project           │
├─────────┼───────────────────┼───────────────────┤
│ 3243162 │ only-this-project │ some-project-123  │
└─────────┴───────────────────┴───────────────────┘

napi_examplekey1234567890abcdefghijklmnopqrstuvwxyz
WARNING: Store this key now: it is not shown again.
INFO: Limited to some-project-123: it cannot create projects, mint API keys, or read any other project. It can still change and delete everything inside that project.
```

A project-scoped key is owned by the project's organization, not by your account, so it does not appear in `neon api-keys list`. Use `neon api-keys list --org-id <org-id>` to see it, and pass the same `--org-id` to revoke it.

</TabItem>

<TabItem>
Organization administrators can create an API key for any organization-owned project using the following command:

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

</TabItem>

</Tabs>

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

For attribute definitions, find the [Retrieve project details](/docs/reference/api/projects/get-project) endpoint in the [Neon API Reference](/docs/reference/api). Definitions are provided in the **Responses** section.

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

Refer to the [Neon API Reference](/docs/reference/api) for other supported Neon API methods.

## List API keys

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>
Navigate to **Account settings** > **API keys** to view your personal API keys, or your organization's **Settings** > **API keys** to view organization API keys.
</TabItem>

<TabItem>

List your account keys with [`neon api-keys list`](/docs/cli/api-keys#list). It shows key metadata, never the keys themselves:

```bash
neon api-keys list
```

Organization keys aren't visible to your account, so pass `--org-id` to list them.

</TabItem>

<TabItem>

For personal API keys:

```bash shouldWrap
curl "https://console.neon.tech/api/v2/api_keys" \
 -H "Authorization: Bearer $NEON_API_KEY" \
 -H "Accept: application/json" | jq
```

For organization API keys:

```bash shouldWrap
curl "https://console.neon.tech/api/v2/organizations/{org_id}/api_keys" \
 -H "Authorization: Bearer $NEON_API_KEY" \
 -H "Accept: application/json" | jq
```

</TabItem>
</Tabs>

## Revoke API Keys

You should revoke API keys that are no longer needed or if you suspect a key may have been compromised. Key details:

- The action is immediate and permanent
- All API requests using the revoked key will fail with a 401 Unauthorized error
- The key cannot be reactivated; you'll need to create a new key if access is needed again

### Who can revoke keys

- Personal API keys can only be revoked by the account owner
- Organization API keys can be revoked by organization admins
- Project-scoped keys can be revoked by organization admins

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>
In the Neon Console, navigate to **Account settings** > **API keys** and click **Revoke** next to the key you want to revoke. The key will be immediately revoked. Any request that uses this key will now fail.

![Revoking an API key in the Neon Console](/docs/manage/revoke_api_key.png)
</TabItem>

<TabItem>

Revoke a key with [`neon api-keys revoke`](/docs/cli/api-keys#revoke), passing the numeric key ID (not the name). The action is immediate and permanent, so confirm the ID with `neon api-keys list` first:

```bash
neon api-keys revoke 177630
```

Organization and project-scoped keys need admin permissions and `--org-id`.

</TabItem>

<TabItem>
The following Neon API method revokes the specified API key. The `key_id` is a required parameter:

```bash
curl -X DELETE \
  'https://console.neon.tech/api/v2/api_keys/177630' \
  -H "Accept: application/json"  \
  -H "Authorization: Bearer $NEON_API_KEY" | jq
```

<details>
<summary>Response body</summary>

For attribute definitions, find the [Revoke API key](/docs/reference/api/api-keys/revoke-api-key) endpoint in the [Neon API Reference](/docs/reference/api). Definitions are provided in the **Responses** section.

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
</TabItem>
</Tabs>

## Rotate an API key

Neon API keys don't expire or rotate on a schedule, so you rotate one manually. Because revocation is immediate, create the replacement first to avoid downtime:

1. Create a new key with the same scope as the old one (see [Creating API keys](#creating-api-keys)).
2. Update every caller that uses the old key, such as CI secrets, Terraform variables, serverless functions, the Neon CLI, and any MCP server configuration.
3. Revoke the old key once nothing depends on it.

If you're rotating because a key was exposed, revoke the compromised key first, then create and roll out its replacement. For rotating Postgres passwords alongside API keys, see [Reset a password](/docs/manage/roles#reset-a-password).

<NeedHelp/>

To view the API documentation for this method, refer to the [Neon API Reference](/docs/reference/api/api-keys/create-api-key).
