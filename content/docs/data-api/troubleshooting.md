---
title: Data API troubleshooting
subtitle: Common issues and solutions when using the Neon Data API
summary: >-
  Covers common issues and solutions for troubleshooting the Neon Data API,
  including permission errors and JWT validation failures, along with steps to
  resolve them.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.817Z'
---

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/data-api/get-started">Getting started with Data API</a>
    <a href="/docs/data-api/manage">Manage Data API</a>
    <a href="/docs/data-api/access-control">Access control & security</a>
  </DocsList>
</InfoBlock>

## Permission denied to create extension "pg_session_jwt"

```bash
Request failed: database CREATE permission is required for neon_superuser
```

### Why this happens

You created your database with a direct SQL query (`CREATE DATABASE foo;`) instead of using the Console UI or Neon API. The Data API requires specific database permissions that aren't automatically granted when you create databases this way.

### Fix

Grant `neon_superuser` permissions to the database you want to enable the Data API for.

```sql
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO neon_superuser;
```

For future databases, create them using the Console UI or Neon API instead of direct SQL. Neon automatically sets up the required permissions when you use these methods.

**Example**

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/${projectId}/branches/${branchId}/databases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -d '{
    "database": {
      "name": "your_database_name"
    }
  }'
```

## JWT Audience validation failed

If you've configured a **JWT Audience** value in the Data API but your tokens are being rejected, the `aud` claim in your JWT may not match the configured value.

### Fix

1. Decode your JWT token at [jwt.io](https://jwt.io) to inspect the `aud` claim
2. Ensure the `aud` value in your token exactly matches what you've configured in the Data API
3. If your provider doesn't include an `aud` claim, remove the JWT Audience value from your Data API configuration

For more information, see [What is JWT Audience?](/docs/data-api/custom-authentication-providers#what-is-jwt-audience)

## JWT token missing `sub` claim

The JWT token must include the `sub` claim, which identifies the user, to enable Row-Level Security (RLS) policies. Ensure your authentication system includes this claim when generating JWT tokens for the Neon Data API. An example JWT payload with the `sub` claim is shown below:

```json
{
  "iat": 1764502220,
  "createdAt": "2025-11-28T15:01:13.821Z",
  "updatedAt": "2025-11-28T15:01:13.821Z",
  "role": "authenticated",
  "id": "41a5f680-89d2-474d-ae59-e27bfbbbd293",
  "sub": "41a5f680-89d2-474d-ae59-e27bfbbbd293", // [!code ++]
  "exp": 1764503120,
  "iss": "https://ep-spring-silence-ad3hu80n.neonauth.c-2.us-east-1.aws.neon.tech",
  "aud": "https://ep-spring-silence-ad3hu80n.neonauth.c-2.us-east-1.aws.neon.tech"
}
```

The `sub` claim in this example: `41a5f680-89d2-474d-ae59-e27bfbbbd293` represents the unique identifier for the authenticated user. This claim is used by your RLS policies to determine which data the user is allowed to access.

## How do I test the Data API without building an app?

If you're using Neon Auth, you can use the Auth API reference UI to create test users and obtain JWT tokens for testing with tools like Postman or cURL.

Navigate to your Auth URL with `/reference` appended (e.g., `https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth/reference`). You can find your **Auth URL** on the **Auth** page on the **Configuration** tab in the Neon Console. From there, you can:

1. Create a test user with `POST /api/auth/sign-up/email`.
2. Sign in with `POST /api/auth/sign-in/email`.
3. Call `GET /api/auth/get-session` and copy the JWT from the `Set-Auth-Jwt` response header.
4. Use that JWT in your Data API requests.

For step-by-step instructions, see [Testing with Postman or cURL](/docs/data-api/get-started#testing-with-postman-or-curl).

## Permission denied for table

```bash
{"code":"42501","detail":null,"hint":null,"message":"permission denied for table your_table_name"}
```

### Why this happens

The `authenticated` role doesn't have GRANT permissions on the table. This commonly occurs when:

- The table was created before the Data API was enabled
- The table was created after enabling the Data API, but default privileges weren't applied
- You disabled the "Grant public schema access" option when enabling the Data API

### Fix

Grant the `authenticated` role access to the table:

```sql
GRANT SELECT, UPDATE, INSERT, DELETE ON your_table_name TO authenticated;
```

Or grant access to all tables in the schema:

```sql
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Also set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES TO authenticated;
```

## I can see all rows in my table

If authenticated users can see all rows in a table regardless of ownership, Row-Level Security (RLS) is likely disabled on that table.

### Check RLS status

In the Neon Console, go to the **Data API** page. If a table has RLS disabled, you'll see a warning:

> "table_name has RLS disabled. All authenticated users can view all rows in this table(s)."

### Fix

1. Click the **Enable RLS** button in the Console, or run:

   ```sql
   ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;
   ```

2. Create a policy to control access. For example, to let users see only their own rows:
   ```sql
   CREATE POLICY "Users see own data" ON your_table_name
     FOR ALL TO authenticated
     USING (auth.user_id() = user_id);
   ```

For more details, see [Row-Level Security](/docs/data-api/access-control#layer-2-row-level-security-rls).

## RLS is enabled but I can't see any rows

If you've enabled RLS but queries return no data, you likely haven't created any policies yet.

### Why this happens

When RLS is enabled on a table, all access is blocked by default until you create policies that grant access. This is a security feature — it ensures data is protected even if you forget to add policies.

### Fix

Create policies that define who can access what data. For example:

```sql
-- Allow users to see their own rows
CREATE POLICY "Users see own data" ON your_table_name
  FOR SELECT TO authenticated
  USING (auth.user_id() = user_id);

-- Allow users to insert their own rows
CREATE POLICY "Users insert own data" ON your_table_name
  FOR INSERT TO authenticated
  WITH CHECK (auth.user_id() = user_id);
```

See [Access control & security](/docs/data-api/access-control) for more examples.

## OpenAPI spec returns "Entry not found"

```bash
{"message":"Entry 'openapi.json' not found"}
```

### Why this happens

The OpenAPI schema feature is disabled in your Data API configuration.

### Fix

1. Go to the **Data API** page in the Neon Console
2. Open the **Configuration** panel
3. Enable the **OpenAPI schema** toggle
4. Try your request again

## Can't access OpenAPI spec

If you're getting authentication errors when trying to access the OpenAPI spec, remember that it requires a valid JWT token like any other Data API request.

### Fix

Include the `Authorization` header with a valid JWT:

```bash
curl -X GET 'https://your-data-api-endpoint/rest/v1/openapi.json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

To get a JWT token for testing, see [Testing with Postman or cURL](/docs/data-api/get-started#testing-with-postman-or-curl).

## New table not found or returns empty schema

If you've created a new table but the Data API doesn't recognize it, or the OpenAPI spec doesn't include it, the schema cache may be stale.

### Why this happens

The Data API caches your database schema for performance. When you create or modify tables, the cache doesn't automatically update.

### Fix

1. Go to the **Data API** page in the Neon Console
2. Click the **Refresh schema cache** button
3. Retry your request

You'll need to refresh the schema cache whenever you:

- Create new tables
- Add or remove columns
- Change column types
- Modify table structure

## JWT token has expired

```bash
{"message":"JWT token has expired (exp=...)"}
```

### Why this happens

JWT tokens have a limited lifespan (typically around 15 minutes). Once expired, they can no longer be used to authenticate requests.

### Fix

Sign in again to get a fresh token. If you're using Neon Auth, call `POST /api/auth/sign-in/email` in the Auth API reference UI, then call `GET /api/auth/get-session` and copy the new JWT from the `Set-Auth-Jwt` response header.

For programmatic token refresh, see your authentication provider's documentation on token renewal.
