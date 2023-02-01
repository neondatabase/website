---
title: Secure connections
---

Neon requires that all connections use SSL/TLS encryption to ensure that data sent over the Internet cannot be viewed or manipulated by third parties. Neon rejects connections that do not use SSL/TLS, behaving in the same way as standalone PostgreSQL with only `hostssl` records in a `pg_hba.conf` configuration file.

When connecting via `psql`, you can verify that the connection to Neon uses SSL/TLS by viewing the connection response, which shows the connection protocol (TLSv1.3) and the encryption cipher. For example:

```bash
$> psql postgres://sally:************@ep-white-thunder-123456.us-east-2.aws.neon.tech/neondb
psql (15.0 (Ubuntu 15.0-1.pgdg22.04+1), server 15.1)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
Type "help" for help.

neondb=>
```

In addition to enforcing SSL/TLS for all connections, Neon implements the SNI (Server Name Indication) extension of the TLS protocol to ensure that clients access the correct SSL certificate for the Neon endpoint compute instance they are connecting to. SNI is an extension of the TLS protocol. The `libpq` PostgreSQL client library includes SNI support, in version 14 and higher. Please refer to the discussion in [Connect from old clients](/docs/connect/connectivity-issues/) for workarounds for clients that do not support SNI.
