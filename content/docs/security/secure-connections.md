---
title: Secure connections
---

Neon requires that all connections use TLS encryption by default to ensure that data you send over the Internet cannot be viewed or manipulated by third parties.

Neon also implements the SNI (Server Name Indication) extension of the TLS protocol. SNI is an extension of the TLS protocol. SNI is included in the TLS handshake process to ensure that clients are able to access the correct SSL certificate for Neon endpoint compute instance they are connecting to. SNI support was added to the `libpq` PostgreSQL client library in version 14. Connection requests from clients that do not support SNI are not permitted. Please refer to the discussion in [Connect from old clients](../../https://neon.tech/docs/connect/connectivity-issues/) for possible workarounds for clients that do not support SNI.
