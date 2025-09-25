---
title: 'PostgreSQL 18 OAuth Support'
page_title: 'PostgreSQL 18 OAuth Support'
page_description: 'PostgreSQL 18 introduces native OAuth 2.0 authentication, enabling secure token-based database connections with your existing identity providers like Google, Auth0, or enterprise SSO systems.'
ogImage: ''
updatedOn: '2025-06-28T01:40:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 Logical Replication Improvements'
  slug: 'postgresql-18/logical-replication-improvements'
nextLink:
  title: 'PostgreSQL 18 NOT NULL as NOT VALID'
  slug: 'postgresql-18/not-null-as-not-valid'
---

**Summary**: PostgreSQL 18 adds native OAuth 2.0 authentication, letting you connect to your database using tokens from identity providers like Google, Auth0, or your company's SSO system instead of managing database passwords.

> **Note**: As of this writing, PostgreSQL 18 is in beta. The OAuth features described here are subject to change before the final release. Always refer to the [official PostgreSQL 18 documentation](https://www.postgresql.org/docs/18/) for the most current information.

## What's New with OAuth Authentication

PostgreSQL 18 introduces built-in OAuth 2.0 support, making it a resource server that can validate bearer tokens from external identity providers. This means your apps can authenticate against your existing identity infrastructure instead of managing separate database credentials.

This feature enables a range of authentication scenarios like:

- Single Sign-On (SSO) for database access
- Centralized user management through your existing identity provider
- Token-based authentication that eliminates password storage in applications
- Fine-grained access control through OAuth scopes

PostgreSQL validates tokens but doesn't issue them, that's handled by your OAuth provider (Google, Microsoft Azure AD, Keycloak, Auth0, etc.).

## Build Requirements

OAuth support must be enabled when PostgreSQL is compiled.

As of the latest beta, most distributions do not include this by default, but if you're building from source, you can `--with-libcurl` to enable OAuth client features.

Note that you will also need a compatible PostgreSQL client which supports OAuth connections, in the case of `psql`, this is available in PostgreSQL 18 and later.

## How It Works

When a client connects with OAuth:

1. Your app presents a bearer token to PostgreSQL (an opaque string that proves authentication)
2. PostgreSQL uses a validator module to verify the token with your OAuth provider
3. If valid, PostgreSQL extracts the user identity and maps it to a database role
4. Connection proceeds with the mapped role's permissions

The client-side flow is handled automatically by `libpq`, including support for the OAuth Device Authorization flow (great for CLI tools like `psql`).

The main components that you need to understand are:

- **Discovery Process**: When you specify an issuer, PostgreSQL's client automatically discovers OAuth endpoints by fetching `/.well-known/openid-configuration` from your provider. This follows OpenID Connect Discovery standards, so most modern identity providers work out of the box.

- **Validator Modules**: These are the bridge between PostgreSQL and your specific OAuth provider. The validator handles provider-specific token verification, whether that's validating JWT signatures, calling token introspection endpoints, or other methods. You can write custom validators for proprietary systems or use existing ones for popular providers.

## Basic Setup

To enable OAuth authentication, you need to configure PostgreSQL's `pg_hba.conf` file and set up a validator module. Along with the PostgreSQL server, you will also need to ensure your OAuth provider is set up to issue tokens that PostgreSQL can validate.

OAuth authentication is configured in `pg_hba.conf` using the `oauth` method with specific parameters for your OAuth provider. Similar to how you configure other authentication methods. Here's a basic example:

```
host  myapp  all  0.0.0.0/0  oauth  issuer=https://your-provider.com  scope="openid profile"
```

Key parameters:

- `issuer`: Your OAuth provider's HTTPS URL (must exactly match the issuer in tokens)
- `scope`: Required OAuth scopes (space-separated)
- `validator`: Which validator module to use (required if you have multiple)
- `map`: Optional identity mapping name for complex user mapping

You'll also need to configure a validator module in `postgresql.conf`:

```sql
oauth_validator_libraries = 'your_oauth_validator'
```

The issuer URL must match exactly between your `pg_hba.conf`, the provider's discovery document, and client connections. No variations in case, trailing slashes, or formatting are allowed, OAuth is strict about issuer matching.

If you configure multiple validator libraries, each `pg_hba.conf` entry must specify which validator to use with the `validator` parameter.

## Connecting with OAuth

To connect to PostgreSQL using OAuth, clients must provide the necessary connection parameters. In the case of `psql`, you can use the following connection string format:

```bash
# Using psql with OAuth Device Authorization flow
psql "host=db.example.com dbname=myapp oauth_issuer=https://your-provider.com oauth_client_id=your-client-id"
```

This triggers a web-based authentication flow where you'll complete login in your browser, then `psql` automatically receives the token and connects.

For applications, you can provide tokens directly:

```bash
# Direct token usage (for apps that already have tokens)
psql "host=db.example.com dbname=myapp oauth_issuer=https://your-provider.com oauth_client_id=your-client-id oauth_token=your-bearer-token"
```

Additional OAuth connection parameters:

- `oauth_client_secret`: For confidential clients that require authentication
- `oauth_scope`: Override the default scopes (useful for requesting additional permissions)
- `require_auth`: Specify acceptable authentication methods (e.g., `require_auth=oauth`)

## User Mapping

OAuth user identities often don't match PostgreSQL role names directly. You have several mapping options:

- **Direct matching**: The username from your OAuth provider must exactly match a PostgreSQL role.

- **Identity mapping**: Use `pg_ident.conf` to map OAuth identities to database roles:

  ```
  # In pg_hba.conf
  host  myapp  all  0.0.0.0/0  oauth  issuer=https://provider.com  scope="openid"  map=oauth_map

  # In pg_ident.conf
  oauth_map    alice@company.com    alice
  oauth_map    admin@company.com    postgres
  ```

- **Delegated mapping**: Let your validator module handle all user mapping logic by setting `delegate_ident_mapping=1` in `pg_hba.conf`. This is an advanced option where the validator takes full responsibility for determining which PostgreSQL role the user should connect as.

  ```
  host  myapp  all  0.0.0.0/0  oauth  issuer=https://provider.com  scope="openid"  delegate_ident_mapping=1
  ```

> **Warning**: `delegate_ident_mapping` requires careful validator implementation since it bypasses PostgreSQL's standard user mapping. The validator must verify that the token holder has sufficient privileges for the requested role. Use with caution and ensure your validator properly handles authorization checks.

## Security Considerations

OAuth authentication requires HTTPS for all endpoints, PostgreSQL enforces this unless you explicitly enable debug mode. Always treat bearer tokens as sensitive credentials and ensure proper token lifetime management.

The validator module is critical for security since it verifies token authenticity and extracts user identity. Choose a well-maintained validator that properly handles signature verification, expiration checks, and audience validation.

## Summary

PostgreSQL 18's OAuth support is a great addition for many applications, allowing you to use existing identity providers for database authentication. This simplifies user management, security, and access control.

For complete configuration details check out the [official PostgreSQL OAuth documentation](https://www.postgresql.org/docs/18/auth-oauth.html).

The OAuth implementation also integrates with PostgreSQL's existing authentication features, so you can gradually migrate from password-based authentication while maintaining compatibility with legacy systems.
