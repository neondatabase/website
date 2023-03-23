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

```bash
export PGSSLROOTCERT=/path/to/root/certs/
psql postgres://sally:<password>@ep-wild-haze-482989.us-east-2.aws.neon.tech?sslmode=verify-full
```

Refer to [Location of system root certificates](#location-of-system-root-certificates) below to find the path to system root certificates for your operating system and distribution.

### Connect from other clients

If the client application uses a popular PostgreSQL client library, such as `psycopg2` for Python or JDBC for Java, the library typically provides built-in support for SSL/TLS encryption and verification, allowing you to specify an `sslmode` setting in the connection parameters.

However, if the client application uses a non-standard PostgreSQL client, SSL/TLS may not be enabled by default. In this case, you must manually configure the client to use SSL/TLS and specify the `sslmode` setting. Please refer to the client or the client's driver documentation for how to configure the path to your system's root certificates.

### Location of system root certificates

The location of root certificates varies depending on the operating system or distribution you are using. You should only configure a a path to a CA root store if your client or driver absolutely requires it. Here are some common locations where you can find root certificates on popular operating systems and distributions:

- Linux (Debian-based distributions):

    ```bash
    /etc/ssl/certs/ca-certificates.crt
    ```

- Linux (Red Hat-based distributions):

    ```bash
    /etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem
    ```

- macOS:

  On macOS, the system's root certificates are stored in the Keychain Access application. These root certificates are automatically used by most applications that require SSL/TLS connections. Therefore, you typically do not need to specify the root CA path when connecting to a PostgreSQL database from macOS.

- Windows

  Windows does not provide a file containing the CA roots that can be used by your driver. However, many popular programming languages used on Windows like C#, Java, or Go do not require the CA root path to be specified and will use the Windows internal system roots by default.

  However, if you are using a language that requires specifying the CA root path, such as C or PHP, you can obtain a bundle of root certificates from the Mozilla CA Certificate program provided by the Curl project. You can download the bundle at https://curl.se/docs/caextract.html. After downloading the file, you will need to configure your driver to point to the bundle.

System root certificate locations listed above may differ depending on the version, distribution, and configuration of your operating system. If you do not find the root certificates in these locations, refer to your operating system documentation.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
