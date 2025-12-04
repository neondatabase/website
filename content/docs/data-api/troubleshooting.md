---
title: Data API troubleshooting
subtitle: Common issues and solutions when using the Neon Data API
enableTableOfContents: true
updatedOn: '2025-10-20T17:51:35.130Z'
---

<FeatureBetaProps feature_name="Neon Data API" />

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
