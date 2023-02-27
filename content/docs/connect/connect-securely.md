---
title: Connecting to Neon securely
enableTableOfContents: true
isDraft: true
---

This topic describes how to connect to Neon securely.

## Connection modes

When connecting to Neon or any PostgreSQL database using TLS/SSL, the `sslmode` parameter setting determines the security of the connection. Neon permits specifying the following modes, in order of least to most secure.

| sslmode | Description |
| --- | --- |
| allow | Encryption is used if the server supports it, but the server's SSL/TLS certificate is not verified. This means that the server's identity cannot be trusted and the connection may be vulnerable to man-in-the-middle attacks. |
| prefer | Encryption is used if the server supports it, and the server's SSL/TLS certificate is verified if possible. If verification fails, the connection is still allowed but a warning is issued. |
| require | Encryption is required and the server's SSL/TLS certificate is verified. If verification fails, the connection is refused. |
| verify-ca | Encryption is required and the server's SSL/TLS certificate is verified. In addition, the client verifies that the server's certificate has been signed by a trusted certificate authority (CA). |
| verify-full | Encryption is required and the server's SSL/TLS certificate is fully verified, including hostname verification, expiration checks, and revocation checks. In addition, the client verifies that the server's certificate has been signed by a trusted certificate authority (CA). |

The choice of which mode to use depends on the specific security requirements of the application and the level of risk that you are willing to tolerate. Neon recommends `verify-full` mode, which ensures the highest level of security and protect against a wide range of attacks. The following sections describe how to configure connections using `verify-full` mode.

## Connection configuration

The required configuration for your connection depends on the client you are using.

### psql command-line client

To use the `psql` command-line client with `sslmode=verify-full`, you need to provide the path to your system root certificates by setting the `PGSSLROOTCERT` variable. For example, on Debian or Ubuntu systems, you can connect with verify-full by setting `PGSSLROOTCERT` to the location of your system's root certificates:

```bash
export PGSSLROOTCERT=/etc/ssl/certs/ca-certificates.crt
psql postgres://sally:<password>@ep-wild-haze-482989.us-east-2.aws.neon.tech?sslmode=verify-full
```

Please check the CA root configuration below to find the appropriate path for your operating system and distribution.

### Other clients and libraries

If the client application uses a popular PostgreSQL client library, such as `psycopg2` for Python or JDBC for Java, the library typically provides built-in support for SSL/TLS encryption and verification, allowing you to specify an `sslmode` setting in the connection parameters.

However, if the client application uses a non-standard PostgreSQL client, SSL/TLS may not be enabled by default. In this case, you must manually configure the client to use SSL/TLS and specify the `sslmode` setting. Please reference the documentation of the driver for how to configure the path to the system's root certificates.

### Location of system root certificates

The location of root certificates will vary depending on the operating system you are using. Here are some common locations where you can find root certificates on popular operating systems:

- MacOS:

    ```text
    System: /Library/Keychains/System.keychain
    User: /Users/<username>/Library/Keychains/login.keychain
    ```

- Linux (Debian-based distributions):

    ```bash
    /etc/ssl/certs/ca-certificates.crt
    ```

- Linux (Red Hat-based distributions):

    ```bash
    /etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem
    ```

These locations may differ depending on the version and configuration of the operating system you are using. Additionally, some applications may have their own certificate stores, separate from the operating system's default store.
