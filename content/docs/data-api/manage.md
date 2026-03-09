---
title: Manage Data API
subtitle: 'Configure schemas, manage authentication providers, and control API access.'
summary: >-
  How to manage the Data API by configuring schemas, setting up authentication
  providers, and controlling API access to customize its behavior and security
  settings.
enableTableOfContents: true
updatedOn: '2026-02-27T20:43:26.152Z'
---

<FeatureBetaProps feature_name="Neon Data API" />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/data-api/get-started">Getting started with Data API</a>
    <a href="/docs/data-api/access-control">Access control & security</a>
    <a href="/docs/data-api/troubleshooting">Troubleshooting</a>
  </DocsList>
</InfoBlock>

This page covers managing the Data API after it is enabled. To enable via the Console, see [Getting started with Data API](/docs/data-api/get-started). To enable programmatically, see [Enable via the Neon API](#enable). To disable from the Console, scroll to **Disable** at the bottom of the **Settings** tab.

## Manage authentication providers

You can configure which authentication provider validates JWT tokens for your Data API requests. Only one provider can be configured at a time. If you enabled the Data API with [Neon Auth](/docs/auth/overview), it is already set as the default provider.

<Tabs labels={["Console", "API"]}>

<TabItem>

Navigate to the **Data API** page in your project sidebar and select the **Settings** tab. The **Authentication** section shows the current provider.

![Data API settings](/docs/data-api/data_api_advanced_settings.png)

- **Add a provider:** If no provider is currently configured, click **Add provider** and enter the JWKS URL supplied by your auth service (for example, Auth0, Clerk, or Firebase). For help finding your provider's JWKS URL, see [Custom authentication providers](/docs/data-api/custom-authentication-providers#supported-providers). Some providers also require a [JWT Audience](/docs/data-api/custom-authentication-providers#what-is-jwt-audience) value.
- **Replace a provider:** To switch to a different provider, remove the current one first, then add the new one using **Add provider**.
- **Remove a provider:** Use the provider dropdown menu to remove the current provider.

</TabItem>

<TabItem>

Add an external authentication provider by registering a JWKS URL:

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/jwks' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "jwks_url": "https://your-provider/.well-known/jwks.json",
    "provider_name": "Auth0",
    "branch_id": "{branch_id}"
  }'
```

You can also include an optional `jwt_audience` field if your provider requires it.

To remove a provider, first list the configured JWKS URLs to find the `jwks_id`:

```bash
curl -X GET 'https://console.neon.tech/api/v2/projects/{project_id}/jwks' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

Then delete it:

```bash
curl -X DELETE 'https://console.neon.tech/api/v2/projects/{project_id}/jwks/{jwks_id}' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

For the full JWKS specification, see the [Neon API reference](https://api-docs.neon.tech/reference/createprojectjwks).

</TabItem>

</Tabs>

<Admonition type="warning">
Removing an authentication provider invalidates all tokens issued by that provider. Users relying on that provider will receive `401 Unauthorized` errors until they authenticate via a valid provider.
</Admonition>

<Admonition type="tip" title="Auth API reference">
If you're using Neon Auth, there's an interactive API reference for authentication endpoints at your Auth URL with `/reference` appended (for example, `https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth/reference`). See [Testing with Postman or cURL](/docs/data-api/get-started#testing-with-postman-or-curl) for details.
</Admonition>

## Advanced settings

The **Advanced settings** section on the Settings tab controls the security, performance, and behavior of your Data API endpoint. After making changes, click **Save** to apply them.

### Exposed schemas

**Default:** `public`

Defines which PostgreSQL schemas are exposed as REST API endpoints. By default, only the `public` schema is accessible. If you use other schemas (for example, `api`, `v1`), select them from the drop-down list to add them.

<Admonition type="note">
**Permissions apply:** Adding a schema here exposes the *endpoints*, but the database role used by the API must still have `USAGE` privileges on the schema and `SELECT` privileges on the tables. Refer to [Access control for Data API](/docs/data-api/access-control) for more details.
</Admonition>

### Anonymous role

**Default:** `anonymous`

Specifies the database role used for **unauthenticated requests** (requests sent without an Authorization header). To allow public access to specific data, configure this role in your database using SQL `GRANT` statements.

### Maximum rows per request

**Default:** `Empty`

Enforces a hard limit on the number of rows returned in a single API response. This prevents accidental performance degradation from large queries. Clients should use pagination limits to retrieve data within this threshold. This also prevents unexpected egress costs from large data transfers.

### JWT role claim key

**Default:** `.role`

Specifies the path within the JWT token that contains the database role name. The Data API uses this role to execute queries on behalf of the authenticated user. For example, `.role` extracts the value of the top-level `role` claim from the token. Corresponds to the `jwt_role_claim_key` field in the API settings object. This field is required when updating settings via the API.

### CORS allowed origins

**Default:** `Empty (Allows all origins)`

Controls which web domains are permitted to fetch data from your API via the browser.

- **Empty:** Allows `*` (any domain). Useful for development.
- **Production:** List your specific domains (for example, `https://myapp.com`) to prevent unauthorized websites from querying your API.

### OpenAPI specification

**Default:** `Disabled`

When enabled, an auto-generated OpenAPI 3 schema describing your tables, columns, and REST endpoints is available at your Data API URL with `/openapi.json` appended:

```
https://your-data-api-endpoint/rest/v1/openapi.json
```

<Admonition type="important" title="Authentication required">
Accessing the OpenAPI spec requires a valid JWT token, just like other Data API requests. Include the `Authorization: Bearer` header when fetching the spec:

```bash
curl -X GET 'https://your-data-api-endpoint/rest/v1/openapi.json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

</Admonition>

### Server timing headers

**Default:** `Disabled`

When enabled, the Data API includes `Server-Timing` headers in each response. These headers show how long different parts of the request took to process (for example, database execution time and internal processing time). You can use this information to debug slow queries, measure performance, and troubleshoot latency issues in your application.

## Manage via the Neon API

You can manage the Data API programmatically using the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). All Data API endpoints use the following base path:

```
/projects/{project_id}/branches/{branch_id}/data-api/{database_name}
```

You can find your `project_id` and `branch_id` on the [Project settings](/docs/manage/projects#project-settings) page in the Neon Console. The `database_name` is the name of the database you want to expose (for example, `neondb`). You will also need an [API key](/docs/manage/api-keys).

### Enable

Send a POST request to [enable the Data API](https://api-docs.neon.tech/reference/createprojectbranchdataapi) for a database on a branch. If the Data API is already enabled, this call returns an error.

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/data-api/{database_name}' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Response (201 Created):

```json
{
  "url": "https://ep-example.apirest.us-east-1.aws.neon.tech/neondb/rest/v1"
}
```

The empty body enables the Data API without an authentication provider. To configure authentication at enable time, change the request body:

- **Neon Auth:** `-d '{"auth_provider": "neon_auth", "add_default_grants": true}'`

  If Neon Auth is not already enabled on the branch, this automatically provisions it. The optional `add_default_grants` option grants authenticated users permissions on tables in the `public` schema, matching the default Console behavior. See [Neon Auth](/docs/auth/overview) to learn more.

- **External provider:** `-d '{"auth_provider": "external", "jwks_url": "https://your-provider/.well-known/jwks.json"}'`

  See [Custom authentication providers](/docs/data-api/custom-authentication-providers) for supported providers and how to find your JWKS URL.

Optional fields in the enable request body:

- **`add_default_grants`** (boolean, default `false`): When `true`, grants all permissions on tables in the `public` schema to authenticated users.
- **`settings`**: Include a [settings object](#update-configuration) to configure the Data API in a single request instead of making a separate PATCH call.

### Get Data API details

[Retrieve the current status and configuration](https://api-docs.neon.tech/reference/getprojectbranchdataapi) of the Data API for a branch.

```bash
curl -X GET 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/data-api/{database_name}' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

Response (200 OK):

```json
{
  "url": "https://ep-example.apirest.us-east-1.aws.neon.tech/neondb/rest/v1",
  "status": "active",
  "settings": {
    "db_aggregates_enabled": true,
    "db_anon_role": "anonymous",
    "db_schemas": [
      "public"
    ],
    "jwt_role_claim_key": ".role"
  },
  "available_schemas": [
    "auth",
    "public"
  ]
}
```

The `settings` object reflects the current configuration (see [Advanced settings](#advanced-settings) for field descriptions). The `available_schemas` array lists the schemas in your database that can be exposed via the API.

### Update configuration

Send a PATCH request to [update the configuration](https://api-docs.neon.tech/reference/updateprojectbranchdataapi). This also refreshes the schema cache. The response is always an empty object (`{}`), with status 201.

```bash
curl -X PATCH 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/data-api/{database_name}' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

An empty body refreshes the schema cache without changing settings. To update settings, include a `settings` object in the request body. First retrieve the current settings with a [GET request](#get-data-api-details), then send all fields with your changes:

`-d '{"settings": {"db_max_rows": 100, "db_schemas": ["public"], "jwt_role_claim_key": ".role", "db_anon_role": "anonymous", "db_aggregates_enabled": true}}'`

<Admonition type="important">
The `settings` object replaces the existing settings entirely. It is not merged. Any field you omit is reset to its default. The `jwt_role_claim_key` field is required.
</Admonition>

### Disable

[Remove the Data API](https://api-docs.neon.tech/reference/deleteprojectbranchdataapi) from a branch. The response is an empty object (`{}`), with status 200.

```bash
curl -X DELETE 'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/data-api/{database_name}' \
  -H 'Authorization: Bearer $NEON_API_KEY'
```

<Admonition type="danger" title="Immediate effect">
Disabling the Data API immediately terminates all active connections and blocks all incoming HTTP requests. Any applications, edge functions, or websites relying on the API will stop working instantly. Re-enabling the Data API creates a fresh instance with default settings; the previous configuration is not restored.
</Admonition>

For the full Data API specification, see the [Neon API reference](https://api-docs.neon.tech/reference/createprojectbranchdataapi).
