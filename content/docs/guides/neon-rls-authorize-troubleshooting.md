---
title: Troubleshooting Neon RLS Authorize
subtitle: Common issues and solutions when using Neon RLS Authorize
enableTableOfContents: true
updatedOn: '2024-10-30T14:14:05.674Z'
redirectFrom:
  - /docs/guides/neon-authorize-troubleshooting
---

This page covers common errors you might encounter when implementing Row-Level Security (RLS) policies with Neon RLS Authorize and your authentication provider.

Errors:

- [`NeonDbError: password authentication failed for user 'jwk not found'`](#password-authentication-error)
- [`NeonDbError: permission denied for table X`](#permission-denied-error)
- [`invalid RSA Signing Algorithm`](#invalid-rsa-signing-algorithm)

---

<a id="password-authentication-error"></a>

```bash
NeonDbError: password authentication failed for user 'jwk not found'
```

This error indicates that Neon couldn't locate the expected JSON Web Key (JWK) based on its key ID (`kid`) in the Authorize configuration.

This issue typically occurs when:

1. **JWKS URL not configured or incorrect**

   You did not add the JWKS URL in the RLS Authorize settings, or the configured JWKS URL is not returning the key associated with the `kid` field in your JWT.

2. **JWT and JWKS mismatch**

   The `kid` field in your JWT doesn't match any of the keys being returned by your JWKS URL.

3. **Unsupported role name**

   The Postgres username used in your connection string is not a role registered for Neon RLS Authorize. Currently, only the roles `anonymous` and `authenticated` are supported. Make sure that the role name in your connection string matches one of these supported roles.

**Solution:**

- Verify that the JWKS URL is correctly configured in the Authorize UI and that it returns the expected keys.
- Ensure that the `kid` field in your JWT matches at least one key from the JWKS URL.
- Check that the role name in your connection string matches either `anonymous` or `authenticated`.

**Helpful Links:**

- [Introduction to JSON Web Tokens](https://jwt.io/introduction/)
- [JSON Web Key (JWK) Specification](https://datatracker.ietf.org/doc/html/rfc7517)

---

<a id="permission-denied-error"></a>

```bash
NeonDbError: permission denied for table X
```

This error typically indicates that you haven't yet granted the necessary permissions to the `authenticated` and `anonymous` roles.

**Solution:**\
Run the following commands to grant permissions:

For existing tables:

```sql
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
IN SCHEMA public
TO authenticated;

GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
IN SCHEMA public
TO anonymous;
```

For future tables:

```sql
ALTER DEFAULT PRIVILEGES
IN SCHEMA public
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
TO authenticated;

ALTER DEFAULT PRIVILEGES
IN SCHEMA public
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
TO anonymous;
```

<Admonition type="note">
Neon RLS Authorize prompts you to run these commands when you first set up your authentication provider on the Neon RLS Authorize drawer in the Neon Console. If you're using a different database, you will have to run these commands manually.
</Admonition>

---

<a id="invalid-rsa-signing-algorithm"></a>

```bash
invalid RSA signing algorithm
```

Neon RLS Authorize only supports JWTs signed with the `ES256` and `RS256` algorithms. If the Neon Proxy receives a JWT signed with any other algorithm, it will produce an error.

**Solution:**

Ensure your JWTs are signed using either the `ES256` or `RS256` algorithms.
