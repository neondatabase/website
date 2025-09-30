---
title: 'PostgreSQL 18 Security Improvements: Wire Protocol 3.2, Advanced TLS and FIPS Validation'
page_title: 'PostgreSQL 18 Security Improvements: Wire Protocol 3.2, Advanced TLS and FIPS Validation'
page_description: 'Learn about PostgreSQL 18 security improvements including wire protocol version 3.2, 256-bit cancel request keys, TLS 1.3 cipher configuration, and FIPS mode validation features for better database security.'
ogImage: ''
updatedOn: '2025-08-03T14:20:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 18 Not Null as Not Valid'
  slug: 'postgresql-18/not-null-as-not-valid'
nextLink:
  title: 'PostgreSQL 18 pg_stat_io Improvements'
  slug: 'postgresql-18/pg-stat-io'
---

**Summary**: Learn about PostgreSQL 18's security improvements including the new wire protocol version 3.2, 256-bit cancel request keys, TLS 1.3 cipher configuration options, and FIPS mode validation features that strengthen database security.

## Introduction to Security Improvements

PostgreSQL 18 introduces several important security improvements that strengthen database security at multiple levels. These focus on network protocol security, transport layer protection, and cryptographic compliance validation.

> **Note**: PostgreSQL 18 is currently in beta. While these security features are stable for testing, we recommend thorough testing in development environments before production deployment.

The security improvements in PostgreSQL 18 address real-world security needs:

- **Wire protocol modernization**: The first protocol update in over 20 years
- **Better query cancellation security**: Protection against brute-force attacks
- **Modern TLS support**: Fine-grained control over TLS 1.3 cipher suites
- **FIPS compliance validation**: Tools to verify cryptographic compliance

These features work together to provide a more secure foundation for database operations, particularly important for organizations with strict security requirements.

## Wire Protocol Version 3.2

PostgreSQL 18 introduces wire protocol version 3.2, the first new protocol version since version 3.0 was introduced in PostgreSQL 7.4 back in 2003. This represents a major step forward in the underlying communication protocol between clients and servers.

### Understanding the Wire Protocol

The wire protocol defines how PostgreSQL clients and servers communicate over the network. It handles everything from authentication to query execution and result delivery. The protocol has remained stable for over 20 years, which shows PostgreSQL's commitment to backward compatibility.

Protocol version 3.2 maintains full backward compatibility. Existing clients continue to work unchanged, while new clients can take advantage of features when both client and server support the newer protocol version.

### What's New in Protocol 3.2

The main improvement in protocol version 3.2 is support for stronger security features, particularly the new 256-bit cancel request keys. The protocol now supports variable-length cancel keys, which provides better security and flexibility for future improvements.

**Key changes in protocol 3.2:**

- Support for longer cancellation keys (up to 256 bits)
- Variable-length key support for future extensibility
- Improved protocol negotiation capabilities
- Foundation for future security improvements

### Current Implementation Status

While PostgreSQL 18 servers support protocol version 3.2, libpq (the standard PostgreSQL client library) continues to use protocol version 3.0 by default. Driver authors can opt into 3.2 using the new min/max protocol settings.

To check the negotiated protocol, call `PQfullProtocolVersion()` from libpq-based clients. Currently, there is no SQL command that reports the wire protocol version.

To use protocol version 3.2 features, both the client and server must support the new protocol version. Driver developers and application maintainers will gradually add support for the improved protocol features.

### Impact on Applications

For most applications, the protocol upgrade is transparent. Existing applications continue to work without modification. The new protocol features primarily benefit:

- **Database drivers**: Can implement improved security features
- **Connection poolers**: Can take advantage of improved cancellation key management
- **Monitoring tools**: Better access to protocol-level information
- **Security-focused applications**: Better protection against network-level attacks

## Cancel Request Keys

One of the most significant security improvements in PostgreSQL 18 when using protocol version 3.2 is the upgrade from 32-bit to 256-bit cancel request keys. This change dramatically improves security for query cancellation operations.

### Understanding Cancel Request Security

PostgreSQL allows clients to cancel running queries by sending a special cancel request message. To prevent unauthorized query cancellations, this request must include a secret key that was provided when the connection was established.

The problem with the traditional approach was that 32-bit keys provide limited security. With only 4 billion possible values, an attacker could potentially brute-force cancel requests to disrupt database operations.

### 256-Bit Cancel Keys

PostgreSQL 18 addresses this security concern by introducing 256-bit cancel request keys when using protocol version 3.2. This provides enormous improvement in security:

```
32-bit keys: ~4.3 billion possible values
256-bit keys: ~1.1 × 10^77 possible values
```

This makes brute-force attacks against cancel requests practically impossible, even with significant computing resources available to an attacker.

### How the Upgrade Works

The upgrade is automatic when both client and server support protocol version 3.2:

1. **Client connects** using protocol version 3.2
2. **Server generates** a 256-bit cancellation key
3. **Key is provided** to the client during connection establishment
4. **Cancel requests** use the longer key for authentication

For clients using protocol version 3.0, PostgreSQL 18 continues to generate 32-bit keys, maintaining full backward compatibility.

### Practical Impact

The longer cancel keys provide several benefits:

- Protection against brute-force cancellation attacks
- Better security in environments with network access
- Stronger isolation between different database users
- Foundation for additional security improvements

## TLS 1.3 Cipher Configuration

PostgreSQL 18 adds support for configuring TLS 1.3 cipher suites through the new `ssl_tls13_ciphers` parameter. This addresses a gap where TLS 1.3 connections couldn't be fine-tuned for security requirements.

### Background: TLS Cipher Configuration

Before PostgreSQL 18, the `ssl_ciphers` parameter could only configure cipher suites for TLS 1.2 and earlier versions. TLS 1.3 connections used default cipher selection, which wasn't suitable for environments with specific security requirements.

TLS 1.3 uses a different set of cipher suites than earlier TLS versions, and these suites are not compatible with the older configuration syntax. This created challenges for organizations needing to comply with specific security standards.

### The New ssl_tls13_ciphers Parameter

PostgreSQL 18 introduces the `ssl_tls13_ciphers` parameter specifically for TLS 1.3 cipher suite configuration:

```sql
-- Configure TLS 1.3 cipher suites
ALTER SYSTEM SET ssl_tls13_ciphers = 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';

-- Reload configuration
SELECT pg_reload_conf();
```

The parameter accepts a colon-separated list of TLS 1.3 cipher suite names. If left empty (the default), PostgreSQL uses OpenSSL's default TLS 1.3 cipher suite selection. The `ssl_tls13_ciphers` parameter wasn't available in earlier PostgreSQL versions, so it won't affect existing configurations.

### Supported TLS 1.3 Cipher Suites

Common TLS 1.3 cipher suites that can be configured include:

- **TLS_AES_256_GCM_SHA384**: AES 256-bit encryption with GCM mode
- **TLS_CHACHA20_POLY1305_SHA256**: ChaCha20-Poly1305 encryption
- **TLS_AES_128_GCM_SHA256**: AES 128-bit encryption with GCM mode

```sql
-- Example configuration for high security environments
ALTER SYSTEM SET ssl_tls13_ciphers = 'TLS_AES_256_GCM_SHA384';

-- Example configuration allowing multiple strong ciphers
ALTER SYSTEM SET ssl_tls13_ciphers = 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';

-- Check current configuration
SHOW ssl_tls13_ciphers;
```

For a complete list of supported TLS 1.3 cipher suites, refer to the OpenSSL documentation or the PostgreSQL release notes.

### Configuration Best Practices

When configuring TLS 1.3 cipher suites:

- Use cipher suites approved by your security policies
- Prioritize 256-bit encryption for sensitive environments
- Consider performance implications of different cipher suites
- Test client compatibility with restricted cipher lists

## FIPS Mode Validation Features

PostgreSQL 18 introduces new features to help organizations validate and maintain FIPS (Federal Information Processing Standards) compliance. These tools make it easier to ensure that cryptographic operations meet government security standards.

### Understanding FIPS Mode

FIPS 140-2 is a U.S. government standard that specifies security requirements for cryptographic modules. When a system operates in "FIPS mode", it restricts cryptographic operations to algorithms that have been validated by the National Institute of Standards and Technology (NIST).

PostgreSQL uses OpenSSL for various cryptographic operations. When OpenSSL operates in FIPS mode, it restricts available algorithms and can cause some PostgreSQL operations to fail if they rely on non-approved algorithms.

### New FIPS Validation Functions

PostgreSQL 18 adds the `fips_mode()` function to the pgcrypto extension, allowing you to check whether OpenSSL is operating in FIPS mode:

```sql
-- Load the pgcrypto extension (if not already loaded)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Check if FIPS mode is enabled
SELECT fips_mode();
```

This function returns:

- `true` if OpenSSL is operating in FIPS mode
- `false` if FIPS mode is not enabled

For more information about the `pgcrypto` extension and its functions, refer to the [`pgcrypto` documentation](https://www.postgresql.org/docs/18/pgcrypto.html).

### Built-in Crypto Control

PostgreSQL 18 also introduces the `builtin_crypto_enabled` configuration parameter in pgcrypto. This parameter controls whether built-in (non-OpenSSL) cryptographic functions are allowed:

```sql
-- Check current setting
SHOW pgcrypto.builtin_crypto_enabled;

-- Disable built-in crypto functions
ALTER SYSTEM SET pgcrypto.builtin_crypto_enabled = 'off';

-- Enable FIPS-aware mode (disables built-in crypto when OpenSSL is in FIPS mode)
ALTER SYSTEM SET pgcrypto.builtin_crypto_enabled = 'fips';
```

The parameter accepts three values:

- **`on`** (default): Built-in crypto functions are always enabled
- **`off`**: Built-in crypto functions are always disabled
- **`fips`**: Built-in crypto functions are disabled when OpenSSL is in FIPS mode

This allows administrators to make sure that only FIPS-approved algorithms are used when operating in FIPS mode, while still allowing built-in crypto functions in non-FIPS environments.

## Backward Compatibility

All security improvements maintain backward compatibility:

- Existing clients continue to work unchanged
- Protocol version 3.0 remains fully supported and version 3.2 is optional for drivers
- Legacy cipher configurations continue to function
- Non-FIPS environments are unaffected by FIPS features
