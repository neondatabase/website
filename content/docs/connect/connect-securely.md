---
title: Connect to Neon securely
subtitle: Learn how to connect to Neon securely when using a connection string
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/security/secure-connections
updatedOn: '2024-07-15T20:56:16.362Z'
---

Neon requires that all connections use SSL/TLS encryption to ensure that data sent over the Internet cannot be viewed or manipulated by third parties. Neon rejects connections that do not use SSL/TLS, behaving in the same way as standalone Postgres with only `hostssl` records in a `pg_hba.conf` configuration file.

However, there are different levels of protection when using SSL/TLS encryption, which you can configure by appending an `sslmode` parameter to your connection string.

## Connection modes

When connecting to Neon or any Postgres database, the `sslmode` parameter setting determines the security of the connection. You can append the `sslmode` parameter to your Neon connection string as shown:

```text shouldWrap
postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=verify-full
```

Neon supports the following `sslmode` settings, in order of least to most secure.

| sslmode       | Description                                                                                                                                                                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `require`     | Encryption is required and the server's SSL/TLS certificate is verified. If verification fails, the connection is refused.                                                                                                                                                        |
| `verify-ca`   | Encryption is required and the server's SSL/TLS certificate is verified. In addition, the client verifies that the server's certificate has been signed by a trusted certificate authority (CA).                                                                                  |
| `verify-full` | Encryption is required and the server's SSL/TLS certificate is fully verified, including hostname verification, expiration checks, and revocation checks. In addition, the client verifies that the server's certificate has been signed by a trusted certificate authority (CA). |

The choice of which mode to use depends on the specific security requirements of the application and the level of risk that you are willing to tolerate. Neon recommends that you always use `verify-full` mode, which ensures the highest level of security and protects against a wide range of attacks including man-in-the-middle attacks. The following sections describe how to configure connections using `verify-full` mode.

The required configuration for your connection depends on the client you are using.

## Connect from the psql client

To connect from the `psql` command-line client with `sslmode=verify-full`, provide the path to your system root certificates by setting the `PGSSLROOTCERT` variable to the location of your operating system's root certificates. You can set this environment variable in your shell, typically bash or similar, using the export command. For example, if your root certificate is at `/path/to/root.crt`, you would set the variable like so:

```bash
export PGSSLROOTCERT="/path/to/your/root.crt"
```

Refer to [Location of system root certificates](#location-of-system-root-certificates) below to find the path to system root certificates for your operating system.

## Connect from other clients

If the client application uses a popular Postgres client library, such as `psycopg2` for Python or JDBC for Java, the library typically provides built-in support for SSL/TLS encryption and verification, allowing you to configure an `sslmode` setting in the connection parameters. For example:

```python
import psycopg2

conn = psycopg2.connect(
    dbname='dbname',
    user='alex',
    password='AbC123dEf',
    host='ep-cool-darkness-123456.us-east-2.aws.neon.tech',
    port='5432',
    sslmode='verify-full',
    sslrootcert='/path/to/your/root.crt'
)
```

However, if your client application uses a non-standard Postgres client, SSL/TLS may not be enabled by default. In this case, you must manually configure the client to use SSL/TLS and specify an `sslmode` configuration. Refer to the client or the client's driver documentation for how to configure the path to your operating system's root certificates.

### Location of system root certificates

Neon uses the public ISRG Root X1 certificate issued by [Let’s Encrypt](https://letsencrypt.org/). You can find the PEM-encoded certificate here: [isrgrootx1.pem](https://letsencrypt.org/certs/isrgrootx1.pem). Typically, you do not need to download this file directly, as it is usually available in a root store on your operating system. A root store is a collection of pre-downloaded root certificates from various Certificate Authorities (CAs). These are highly trusted CAs, and their certificates are typically shipped with operating systems and some applications.

The location of the root store varies by operating system or distribution. Here are some locations where you might find the required root certificates on popular operating systems:

- Debian, Ubuntu, Gentoo, etc.

  ```bash
  /etc/ssl/certs/ca-certificates.crt
  ```

- CentOS, Fedora, RedHat

  ```bash
  /etc/pki/tls/certs/ca-bundle.crt
  ```

- OpenSUSE

  ```bash
  /etc/ssl/ca-bundle.pem
  ```

- Alpine Linux

  ```bash
  /etc/ssl/cert.pem
  ```

- Android

  ```bash
  /system/etc/security/cacerts
  ```

- macOS:

  ```bash
  /etc/ssl/cert.pem
  ```

- Windows

  Windows does not provide a file containing the CA roots that can be used by your driver. However, many popular programming languages used on Windows like C#, Java, or Go do not require the CA root path to be specified and will use the Windows internal system roots by default.

  However, if you are using a language that requires specifying the CA root path, such as C or PHP, you can obtain a bundle of root certificates from the Mozilla CA Certificate program provided by the Curl project. You can download the bundle at [https://curl.se/docs/caextract.html](https://curl.se/docs/caextract.html). After downloading the file, you will need to configure your driver to point to the bundle.

The system root certificate locations listed above may differ depending on the version, distribution, and configuration of your operating system. If you do not find the root certificates in these locations, refer to your operating system documentation.

<NeedHelp/>
