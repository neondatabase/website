[#id](#LIBPQ-SSL)

## 34.19. SSL Support [#](#LIBPQ-SSL)

- [34.19.1. Client Verification of Server Certificates](libpq-ssl#LIBQ-SSL-CERTIFICATES)
- [34.19.2. Client Certificates](libpq-ssl#LIBPQ-SSL-CLIENTCERT)
- [34.19.3. Protection Provided in Different Modes](libpq-ssl#LIBPQ-SSL-PROTECTION)
- [34.19.4. SSL Client File Usage](libpq-ssl#LIBPQ-SSL-FILEUSAGE)
- [34.19.5. SSL Library Initialization](libpq-ssl#LIBPQ-SSL-INITIALIZE)

PostgreSQL has native support for using SSL connections to encrypt client/server communications using TLS protocols for increased security. See [Section 19.9](ssl-tcp) for details about the server-side SSL functionality.

libpq reads the system-wide OpenSSL configuration file. By default, this file is named `openssl.cnf` and is located in the directory reported by `openssl version -d`. This default can be overridden by setting environment variable `OPENSSL_CONF` to the name of the desired configuration file.

[#id](#LIBQ-SSL-CERTIFICATES)

### 34.19.1. Client Verification of Server Certificates [#](#LIBQ-SSL-CERTIFICATES)

By default, PostgreSQL will not perform any verification of the server certificate. This means that it is possible to spoof the server identity (for example by modifying a DNS record or by taking over the server IP address) without the client knowing. In order to prevent spoofing, the client must be able to verify the server's identity via a chain of trust. A chain of trust is established by placing a root (self-signed) certificate authority (CA) certificate on one computer and a leaf certificate _signed_ by the root certificate on another computer. It is also possible to use an “intermediate” certificate which is signed by the root certificate and signs leaf certificates.

To allow the client to verify the identity of the server, place a root certificate on the client and a leaf certificate signed by the root certificate on the server. To allow the server to verify the identity of the client, place a root certificate on the server and a leaf certificate signed by the root certificate on the client. One or more intermediate certificates (usually stored with the leaf certificate) can also be used to link the leaf certificate to the root certificate.

Once a chain of trust has been established, there are two ways for the client to validate the leaf certificate sent by the server. If the parameter `sslmode` is set to `verify-ca`, libpq will verify that the server is trustworthy by checking the certificate chain up to the root certificate stored on the client. If `sslmode` is set to `verify-full`, libpq will _also_ verify that the server host name matches the name stored in the server certificate. The SSL connection will fail if the server certificate cannot be verified. `verify-full` is recommended in most security-sensitive environments.

In `verify-full` mode, the host name is matched against the certificate's Subject Alternative Name attribute(s) (SAN), or against the Common Name attribute if no SAN of type `dNSName` is present. If the certificate's name attribute starts with an asterisk (`*`), the asterisk will be treated as a wildcard, which will match all characters _except_ a dot (`.`). This means the certificate will not match subdomains. If the connection is made using an IP address instead of a host name, the IP address will be matched (without doing any DNS lookups) against SANs of type `iPAddress` or `dNSName`. If no `iPAddress` SAN is present and no matching `dNSName` SAN is present, the host IP address is matched against the Common Name attribute.

### Note

For backward compatibility with earlier versions of PostgreSQL, the host IP address is verified in a manner different from [RFC 6125](https://tools.ietf.org/html/rfc6125). The host IP address is always matched against `dNSName` SANs as well as `iPAddress` SANs, and can be matched against the Common Name attribute if no relevant SANs exist.

To allow server certificate verification, one or more root certificates must be placed in the file `~/.postgresql/root.crt` in the user's home directory. (On Microsoft Windows the file is named `%APPDATA%\postgresql\root.crt`.) Intermediate certificates should also be added to the file if they are needed to link the certificate chain sent by the server to the root certificates stored on the client.

Certificate Revocation List (CRL) entries are also checked if the file `~/.postgresql/root.crl` exists (`%APPDATA%\postgresql\root.crl` on Microsoft Windows).

The location of the root certificate file and the CRL can be changed by setting the connection parameters `sslrootcert` and `sslcrl` or the environment variables `PGSSLROOTCERT` and `PGSSLCRL`. `sslcrldir` or the environment variable `PGSSLCRLDIR` can also be used to specify a directory containing CRL files.

### Note

For backwards compatibility with earlier versions of PostgreSQL, if a root CA file exists, the behavior of `sslmode`=`require` will be the same as that of `verify-ca`, meaning the server certificate is validated against the CA. Relying on this behavior is discouraged, and applications that need certificate validation should always use `verify-ca` or `verify-full`.

[#id](#LIBPQ-SSL-CLIENTCERT)

### 34.19.2. Client Certificates [#](#LIBPQ-SSL-CLIENTCERT)

If the server attempts to verify the identity of the client by requesting the client's leaf certificate, libpq will send the certificate(s) stored in file `~/.postgresql/postgresql.crt` in the user's home directory. The certificates must chain to the root certificate trusted by the server. A matching private key file `~/.postgresql/postgresql.key` must also be present. On Microsoft Windows these files are named `%APPDATA%\postgresql\postgresql.crt` and `%APPDATA%\postgresql\postgresql.key`. The location of the certificate and key files can be overridden by the connection parameters `sslcert` and `sslkey`, or by the environment variables `PGSSLCERT` and `PGSSLKEY`.

On Unix systems, the permissions on the private key file must disallow any access to world or group; achieve this by a command such as `chmod 0600 ~/.postgresql/postgresql.key`. Alternatively, the file can be owned by root and have group read access (that is, `0640` permissions). That setup is intended for installations where certificate and key files are managed by the operating system. The user of libpq should then be made a member of the group that has access to those certificate and key files. (On Microsoft Windows, there is no file permissions check, since the `%APPDATA%\postgresql` directory is presumed secure.)

The first certificate in `postgresql.crt` must be the client's certificate because it must match the client's private key. “Intermediate” certificates can be optionally appended to the file — doing so avoids requiring storage of intermediate certificates on the server ([ssl_ca_file](runtime-config-connection#GUC-SSL-CA-FILE)).

The certificate and key may be in PEM or ASN.1 DER format.

The key may be stored in cleartext or encrypted with a passphrase using any algorithm supported by OpenSSL, like AES-128. If the key is stored encrypted, then the passphrase may be provided in the [sslpassword](libpq-connect#LIBPQ-CONNECT-SSLPASSWORD) connection option. If an encrypted key is supplied and the `sslpassword` option is absent or blank, a password will be prompted for interactively by OpenSSL with a `Enter PEM pass phrase:` prompt if a TTY is available. Applications can override the client certificate prompt and the handling of the `sslpassword` parameter by supplying their own key password callback; see [`PQsetSSLKeyPassHook_OpenSSL`](libpq-connect#LIBPQ-PQSETSSLKEYPASSHOOK-OPENSSL).

For instructions on creating certificates, see [Section 19.9.5](ssl-tcp#SSL-CERTIFICATE-CREATION).

[#id](#LIBPQ-SSL-PROTECTION)

### 34.19.3. Protection Provided in Different Modes [#](#LIBPQ-SSL-PROTECTION)

The different values for the `sslmode` parameter provide different levels of protection. SSL can provide protection against three types of attacks:

- Eavesdropping

  If a third party can examine the network traffic between the client and the server, it can read both connection information (including the user name and password) and the data that is passed. SSL uses encryption to prevent this.

- Man-in-the-middle (MITM)

  If a third party can modify the data while passing between the client and server, it can pretend to be the server and therefore see and modify data _even if it is encrypted_. The third party can then forward the connection information and data to the original server, making it impossible to detect this attack. Common vectors to do this include DNS poisoning and address hijacking, whereby the client is directed to a different server than intended. There are also several other attack methods that can accomplish this. SSL uses certificate verification to prevent this, by authenticating the server to the client.

- Impersonation

  If a third party can pretend to be an authorized client, it can simply access data it should not have access to. Typically this can happen through insecure password management. SSL uses client certificates to prevent this, by making sure that only holders of valid certificates can access the server.

For a connection to be known SSL-secured, SSL usage must be configured on _both the client and the server_ before the connection is made. If it is only configured on the server, the client may end up sending sensitive information (e.g., passwords) before it knows that the server requires high security. In libpq, secure connections can be ensured by setting the `sslmode` parameter to `verify-full` or `verify-ca`, and providing the system with a root certificate to verify against. This is analogous to using an `https` URL for encrypted web browsing.

Once the server has been authenticated, the client can pass sensitive data. This means that up until this point, the client does not need to know if certificates will be used for authentication, making it safe to specify that only in the server configuration.

All SSL options carry overhead in the form of encryption and key-exchange, so there is a trade-off that has to be made between performance and security. [Table 34.1](libpq-ssl#LIBPQ-SSL-SSLMODE-STATEMENTS) illustrates the risks the different `sslmode` values protect against, and what statement they make about security and overhead.

[#id](#LIBPQ-SSL-SSLMODE-STATEMENTS)

**Table 34.1. SSL Mode Descriptions**

| `sslmode`     | Eavesdropping protection | MITM protection      | Statement                                                                                                                                   |
| ------------- | ------------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `disable`     | No                       | No                   | I don't care about security, and I don't want to pay the overhead of encryption.                                                            |
| `allow`       | Maybe                    | No                   | I don't care about security, but I will pay the overhead of encryption if the server insists on it.                                         |
| `prefer`      | Maybe                    | No                   | I don't care about encryption, but I wish to pay the overhead of encryption if the server supports it.                                      |
| `require`     | Yes                      | No                   | I want my data to be encrypted, and I accept the overhead. I trust that the network will make sure I always connect to the server I want.   |
| `verify-ca`   | Yes                      | Depends on CA policy | I want my data encrypted, and I accept the overhead. I want to be sure that I connect to a server that I trust.                             |
| `verify-full` | Yes                      | Yes                  | I want my data encrypted, and I accept the overhead. I want to be sure that I connect to a server I trust, and that it's the one I specify. |

The difference between `verify-ca` and `verify-full` depends on the policy of the root CA. If a public CA is used, `verify-ca` allows connections to a server that _somebody else_ may have registered with the CA. In this case, `verify-full` should always be used. If a local CA is used, or even a self-signed certificate, using `verify-ca` often provides enough protection.

The default value for `sslmode` is `prefer`. As is shown in the table, this makes no sense from a security point of view, and it only promises performance overhead if possible. It is only provided as the default for backward compatibility, and is not recommended in secure deployments.

[#id](#LIBPQ-SSL-FILEUSAGE)

### 34.19.4. SSL Client File Usage [#](#LIBPQ-SSL-FILEUSAGE)

[Table 34.2](libpq-ssl#LIBPQ-SSL-FILE-USAGE) summarizes the files that are relevant to the SSL setup on the client.

[#id](#LIBPQ-SSL-FILE-USAGE)

**Table 34.2. Libpq/Client SSL File Usage**

| File                           | Contents                                        | Effect                                                                                      |
| ------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `~/.postgresql/postgresql.crt` | client certificate                              | sent to server                                                                              |
| `~/.postgresql/postgresql.key` | client private key                              | proves client certificate sent by owner; does not indicate certificate owner is trustworthy |
| `~/.postgresql/root.crt`       | trusted certificate authorities                 | checks that server certificate is signed by a trusted certificate authority                 |
| `~/.postgresql/root.crl`       | certificates revoked by certificate authorities | server certificate must not be on this list                                                 |

[#id](#LIBPQ-SSL-INITIALIZE)

### 34.19.5. SSL Library Initialization [#](#LIBPQ-SSL-INITIALIZE)

If your application initializes `libssl` and/or `libcrypto` libraries and libpq is built with SSL support, you should call [`PQinitOpenSSL`](libpq-ssl#LIBPQ-PQINITOPENSSL) to tell libpq that the `libssl` and/or `libcrypto` libraries have been initialized by your application, so that libpq will not also initialize those libraries. However, this is unnecessary when using OpenSSL version 1.1.0 or later, as duplicate initializations are no longer problematic.

- `PQinitOpenSSL` [#](#LIBPQ-PQINITOPENSSL)

  Allows applications to select which security libraries to initialize.

  ```
  void PQinitOpenSSL(int do_ssl, int do_crypto);
  ```

  When _`do_ssl`_ is non-zero, libpq will initialize the OpenSSL library before first opening a database connection. When _`do_crypto`_ is non-zero, the `libcrypto` library will be initialized. By default (if [`PQinitOpenSSL`](libpq-ssl#LIBPQ-PQINITOPENSSL) is not called), both libraries are initialized. When SSL support is not compiled in, this function is present but does nothing.

  If your application uses and initializes either OpenSSL or its underlying `libcrypto` library, you _must_ call this function with zeroes for the appropriate parameter(s) before first opening a database connection. Also be sure that you have done that initialization before opening a database connection.

- `PQinitSSL` [#](#LIBPQ-PQINITSSL)

  Allows applications to select which security libraries to initialize.

  ```
  void PQinitSSL(int do_ssl);
  ```

  This function is equivalent to `PQinitOpenSSL(do_ssl, do_ssl)`. It is sufficient for applications that initialize both or neither of OpenSSL and `libcrypto`.

  [`PQinitSSL`](libpq-ssl#LIBPQ-PQINITSSL) has been present since PostgreSQL 8.0, while [`PQinitOpenSSL`](libpq-ssl#LIBPQ-PQINITOPENSSL) was added in PostgreSQL 8.4, so [`PQinitSSL`](libpq-ssl#LIBPQ-PQINITSSL) might be preferable for applications that need to work with older versions of libpq.
