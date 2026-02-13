---
title: The pg_session_jwt extension
subtitle: Handle authenticated sessions through JWTs in Postgres
summary: >-
  Covers the setup of the `pg_session_jwt` extension in Postgres for managing
  authenticated sessions using JSON Web Tokens (JWTs), including JWK validation
  and PostgREST compatibility for secure user identity handling.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.839Z'
---

<InfoBlock>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/data-api/overview">Neon Data API</a>
  <a href="/docs/data-api/custom-authentication-providers">Custom authentication providers</a>
  <a href="/docs/guides/neon-rls">Row-Level Security (RLS)</a>
</DocsList>

<DocsList title="Source code" theme="repo">
  <a href="https://github.com/neondatabase/pg_session_jwt">pg_session_jwt on GitHub</a>
</DocsList>

</InfoBlock>

The `pg_session_jwt` extension is a Postgres extension designed to handle authenticated sessions through JSON Web Tokens (JWTs). When configured with a JWK (JSON Web Key), it verifies JWT authenticity. When operating without a JWK, it falls back to using PostgREST-compatible JWT claims.

This extension powers the [Neon Data API](/docs/data-api/overview), enabling secure session management and Row-Level Security (RLS) based on user identity.

## Features

- **JWT session initialization** using a JWK (JSON Web Key) for secure JWT validation
- **Flexible authentication modes** — use either JWK-validated JWTs or PostgREST-compatible JWT claims
- **User ID retrieval** directly from the database for use in RLS policies
- **JSONB-based storage** and retrieval of session information

## How it works

The extension can operate in two modes:

### With JWK validation

When a JWK is configured, the extension validates JWT signatures and extracts user information from verified tokens. This is the mode used by the Neon Data API.

### With PostgREST-compatible JWT claims

When operating without a JWK, the extension works with PostgREST-compatible JWT claims via the `request.jwt.claims` parameter. This provides compatibility with PostgREST's JWT handling.

## Functions

The `pg_session_jwt` extension provides functions in the `auth` schema:

### auth.user_id()

Returns the user ID (`sub` claim) from the current session's JWT.

```sql
SELECT auth.user_id();
```

This function is commonly used in RLS policies to filter data by the authenticated user:

```sql
CREATE POLICY "Users can only see their own data"
  ON todos
  FOR SELECT
  USING (user_id = auth.user_id());
```

### auth.session()

Returns the entire JWT payload as JSONB, giving you access to all claims in the token.

```sql
SELECT auth.session();
```

### auth.jwt()

Alias for `auth.session()`.

### auth.uid()

Similar to `auth.user_id()` but returns UUID type. Expects the `sub` claim to be a valid UUID, otherwise returns NULL.

```sql
SELECT auth.uid();
```

## Usage with Neon Data API

The `pg_session_jwt` extension is automatically configured when you enable the [Neon Data API](/docs/data-api/overview). The Data API handles JWT validation using your configured authentication provider's JWKS URL.

When making requests to the Data API, include your JWT in the `Authorization` header:

```http
GET https://your-project.data.neon.tech/v1/todos
Authorization: Bearer <your-jwt-token>
```

The Data API validates the token and makes the user identity available via `auth.user_id()` for your RLS policies.

## Usage with custom setups

For custom implementations outside of the Neon Data API, you can configure the extension manually:

### Initialize with JWK

Set the JWK at connection time using libpq options:

```bash
export PGOPTIONS="-c pg_session_jwt.jwk=$MY_JWK"
```

Then in your session:

```sql
-- Initialize the session with the configured JWK
SELECT auth.init();

-- Set the JWT for the current session
SELECT auth.jwt_session_init('your.jwt.token');

-- Now you can use auth functions
SELECT auth.user_id();
```

### Using PostgREST-compatible claims

When no JWK is configured, set claims via the `request.jwt.claims` parameter:

```sql
SET request.jwt.claims = '{"sub": "user-123", "role": "authenticated"}';
SELECT auth.user_id();  -- Returns 'user-123'
```

<Admonition type="warning">
When using the fallback mode without JWK validation, `request.jwt.claims` is a regular Postgres parameter that can be modified by any database user. Ensure your application sets these claims securely before executing user queries.
</Admonition>

## References

- [pg_session_jwt on GitHub](https://github.com/neondatabase/pg_session_jwt)
- [Neon Data API documentation](/docs/data-api/overview)
- [Custom authentication providers](/docs/data-api/custom-authentication-providers)
- [Row-Level Security guide](/docs/guides/neon-rls)

<NeedHelp/>
