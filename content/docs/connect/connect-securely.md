---
title: Connect to Neon securely
subtitle: Learn how to connect to Neon securely when using connection strings
enableTableOfContents: true
isDraft: true
---

Neon requires that all connections use SSL/TLS encryption to ensure that data sent over the Internet cannot be viewed or manipulated by third parties. Neon rejects connections that do not use SSL/TLS, behaving in the same way as standalone PostgreSQL with only `hostssl` records in a `pg_hba.conf` configuration file.

However, there are different levels of protection when using SSL/TLS encryption, which you can configure by appending an `sslmode` parameter to your connection string.

## Connection modes

When connecting to Neon or any PostgreSQL database, the `sslmode` parameter setting determines the security of the connection. You can append the `sslmode` parameter to your Neon connection string as shown:

```text
postgres://sally:<password>@ep-wild-haze-482989.us-east-2.aws.neon.tech?sslmode=verify-full
```

Neon permits specifying the following `sslmode` settings, in order of least to most secure.

| sslmode | Description |
| --- | --- |
| allow | Encryption is used if the server supports it, but the server's SSL/TLS certificate is not verified. This means that the server's identity cannot be trusted and the connection may be vulnerable to man-in-the-middle attacks. |
| prefer | Encryption is used if the server supports it, and the server's SSL/TLS certificate is verified if possible. If verification fails, the connection is still allowed but a warning is issued. |
| require | Encryption is required and the server's SSL/TLS certificate is verified. If verification fails, the connection is refused. |
| verify-ca | Encryption is required and the server's SSL/TLS certificate is verified. In addition, the client verifies that the server's certificate has been signed by a trusted certificate authority (CA). |
| verify-full | Encryption is required and the server's SSL/TLS certificate is fully verified, including hostname verification, expiration checks, and revocation checks. In addition, the client verifies that the server's certificate has been signed by a trusted certificate authority (CA). |

Neon requires an encrypted connection, so specifying the `allow` and `prefer` settings always use encryption.

The choice of which mode to use depends on the specific security requirements of the application and the level of risk that you are willing to tolerate. Neon recommends that you always use `verify-full` mode, which ensures the highest level of security and protects against a wide range of attacks including man-in-the-middle attacks. The following sections describe how to configure connections using `verify-full` mode.

## Connection configuration

The required configuration for your connection depends on the client you are using.

### Connect from the psql client

To connect from the `psql` command-line client with `sslmode=verify-full`, provide the path to your system root certificates by setting the `PGSSLROOTCERT` variable. For example, you can connect with `verify-full` by setting `PGSSLROOTCERT` to the location of your system's root certificates:

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
