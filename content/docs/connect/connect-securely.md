---
title: Connecting to Neon securely
subtitle: How to connect to Neon securely when using connection strings
enableTableOfContents: true
isDraft: true
---

This topic describes how to connect to Neon securely to avoid having your database connection compromised.

## Connection modes

When connecting to Neon or any PostgreSQL database using TLS/SSL, the `sslmode` parameter setting determines the security of the connection. You can append the `sslmode` parameter to your Neon connection string. For example:

```text
postgres://sally:<password>@ep-wild-haze-482989.us-east-2.aws.neon.tech?sslmode=verify-full
```

Neon permits specifying the following modes, in order of least to most secure.

| sslmode | Description |
| --- | --- |
| allow | Encryption is used if the server supports it, but the server's SSL/TLS certificate is not verified. This means that the server's identity cannot be trusted and the connection may be vulnerable to man-in-the-middle attacks. |
| prefer | Encryption is used if the server supports it, and the server's SSL/TLS certificate is verified if possible. If verification fails, the connection is still allowed but a warning is issued. |
| require | Encryption is required and the server's SSL/TLS certificate is verified. If verification fails, the connection is refused. |
| verify-ca | Encryption is required and the server's SSL/TLS certificate is verified. In addition, the client verifies that the server's certificate has been signed by a trusted certificate authority (CA). |
| verify-full | Encryption is required and the server's SSL/TLS certificate is fully verified, including hostname verification, expiration checks, and revocation checks. In addition, the client verifies that the server's certificate has been signed by a trusted certificate authority (CA). |

The choice of which mode to use depends on the specific security requirements of the application and the level of risk that you are willing to tolerate. Neon recommends `verify-full` mode, which ensures the highest level of security and protects against a wide range of attacks. The following sections describe how to configure connections using `verify-full` mode.

## Connection configuration

The required configuration for your connection depends on the client you are using.

### Connect from the psql command-line client

To connect from the `psql` command-line client with `sslmode=verify-full`, provide the path to your system root certificates by setting the `PGSSLROOTCERT` variable. For example, on Debian or Ubuntu systems, you can connect with `verify-full` by setting `PGSSLROOTCERT` to the location of your system's root certificates:

```bash
export PGSSLROOTCERT=/etc/ssl/certs/ca-certificates.crt
psql postgres://sally:<password>@ep-wild-haze-482989.us-east-2.aws.neon.tech?sslmode=verify-full
```

Refer to [Location of system root certificates](#location-of-system-root-certificates) below to find the path to system root certificates for your operating system and distribution.

### Connect from other clients and libraries

If the client application uses a popular PostgreSQL client library, such as `psycopg2` for Python or JDBC for Java, the library typically provides built-in support for SSL/TLS encryption and verification, allowing you to specify an `sslmode` setting in the connection parameters.

However, if the client application uses a non-standard PostgreSQL client, SSL/TLS may not be enabled by default. In this case, you must manually configure the client to use SSL/TLS and specify the `sslmode` setting. Please refer to the client or driver documentation for how to configure the path to your system's root certificates.

### Location of system root certificates

The location of root certificates varies depending on the operating system or distribution you are using. Here are some common locations where you can find root certificates on popular operating systems and distributions:

- macOS:

    ```text
    /etc/ssl/cert.pem
    ```

- Linux (Debian-based distributions including Ubuntu):

    ```bash
    /etc/ssl/certs/ca-certificates.crt
    ```

- Linux (Red Hat-based distributions):

    ```bash
    /etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem
    ```

    or, on some Red Hat systems, root certificate are stored in:

    ```bash
    /etc/pki/tls/certs/ca-bundle.crt
    ```

These locations may differ depending on the version and configuration of the operating system you are using. Additionally, some applications may have their own certificate stores, separate from the operating system's default store. If you do not find the root certificates in the locations listed above, refer to your operating system or distribution documentation.
