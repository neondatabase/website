---
title: Secure connections
---

Neon requires that all connections use TLS encryption to ensure that data sent over the Internet cannot be viewed or manipulated by third parties.

Neon implements the SNI (Server Name Indication) extension of the TLS protocol to ensure that clients connect using TLS and access the correct SSL certificate for the Neon endpoint compute instance they are connecting to. SNI is an extension of the TLS protocol. SNI support is included in the `libpq` PostgreSQL client library, in version 14 and higher. Connection requests from clients that do not support SNI are not permitted. Please refer to the discussion in [Connect from old clients](../../https://neon.tech/docs/connect/connectivity-issues/) for possible workarounds for clients that do not support SNI.
