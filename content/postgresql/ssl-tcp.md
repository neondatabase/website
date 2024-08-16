[#id](#SSL-TCP)

## 19.9. Secure TCP/IP Connections with SSL [#](#SSL-TCP)

- [19.9.1. Basic Setup](ssl-tcp#SSL-SETUP)
- [19.9.2. OpenSSL Configuration](ssl-tcp#SSL-OPENSSL-CONFIG)
- [19.9.3. Using Client Certificates](ssl-tcp#SSL-CLIENT-CERTIFICATES)
- [19.9.4. SSL Server File Usage](ssl-tcp#SSL-SERVER-FILES)
- [19.9.5. Creating Certificates](ssl-tcp#SSL-CERTIFICATE-CREATION)

PostgreSQL has native support for using SSL connections to encrypt client/server communications for increased security. This requires that OpenSSL is installed on both client and server systems and that support in PostgreSQL is enabled at build time (see [Chapter 17](installation)).

The terms SSL and TLS are often used interchangeably to mean a secure encrypted connection using a TLS protocol. SSL protocols are the precursors to TLS protocols, and the term SSL is still used for encrypted connections even though SSL protocols are no longer supported. SSL is used interchangeably with TLS in PostgreSQL.

[#id](#SSL-SETUP)

### 19.9.1. Basic Setup [#](#SSL-SETUP)

With SSL support compiled in, the PostgreSQL server can be started with support for encrypted connections using TLS protocols enabled by setting the parameter [ssl](runtime-config-connection#GUC-SSL) to `on` in `postgresql.conf`. The server will listen for both normal and SSL connections on the same TCP port, and will negotiate with any connecting client on whether to use SSL. By default, this is at the client's option; see [Section 21.1](auth-pg-hba-conf) about how to set up the server to require use of SSL for some or all connections.

To start in SSL mode, files containing the server certificate and private key must exist. By default, these files are expected to be named `server.crt` and `server.key`, respectively, in the server's data directory, but other names and locations can be specified using the configuration parameters [ssl_cert_file](runtime-config-connection#GUC-SSL-CERT-FILE) and [ssl_key_file](runtime-config-connection#GUC-SSL-KEY-FILE).

On Unix systems, the permissions on `server.key` must disallow any access to world or group; achieve this by the command `chmod 0600 server.key`. Alternatively, the file can be owned by root and have group read access (that is, `0640` permissions). That setup is intended for installations where certificate and key files are managed by the operating system. The user under which the PostgreSQL server runs should then be made a member of the group that has access to those certificate and key files.

If the data directory allows group read access then certificate files may need to be located outside of the data directory in order to conform to the security requirements outlined above. Generally, group access is enabled to allow an unprivileged user to backup the database, and in that case the backup software will not be able to read the certificate files and will likely error.

If the private key is protected with a passphrase, the server will prompt for the passphrase and will not start until it has been entered. Using a passphrase by default disables the ability to change the server's SSL configuration without a server restart, but see [ssl_passphrase_command_supports_reload](runtime-config-connection#GUC-SSL-PASSPHRASE-COMMAND-SUPPORTS-RELOAD). Furthermore, passphrase-protected private keys cannot be used at all on Windows.

The first certificate in `server.crt` must be the server's certificate because it must match the server's private key. The certificates of “intermediate” certificate authorities can also be appended to the file. Doing this avoids the necessity of storing intermediate certificates on clients, assuming the root and intermediate certificates were created with `v3_ca` extensions. (This sets the certificate's basic constraint of `CA` to `true`.) This allows easier expiration of intermediate certificates.

It is not necessary to add the root certificate to `server.crt`. Instead, clients must have the root certificate of the server's certificate chain.

[#id](#SSL-OPENSSL-CONFIG)

### 19.9.2. OpenSSL Configuration [#](#SSL-OPENSSL-CONFIG)

PostgreSQL reads the system-wide OpenSSL configuration file. By default, this file is named `openssl.cnf` and is located in the directory reported by `openssl version -d`. This default can be overridden by setting environment variable `OPENSSL_CONF` to the name of the desired configuration file.

OpenSSL supports a wide range of ciphers and authentication algorithms, of varying strength. While a list of ciphers can be specified in the OpenSSL configuration file, you can specify ciphers specifically for use by the database server by modifying [ssl_ciphers](runtime-config-connection#GUC-SSL-CIPHERS) in `postgresql.conf`.

### Note

It is possible to have authentication without encryption overhead by using `NULL-SHA` or `NULL-MD5` ciphers. However, a man-in-the-middle could read and pass communications between client and server. Also, encryption overhead is minimal compared to the overhead of authentication. For these reasons NULL ciphers are not recommended.

[#id](#SSL-CLIENT-CERTIFICATES)

### 19.9.3. Using Client Certificates [#](#SSL-CLIENT-CERTIFICATES)

To require the client to supply a trusted certificate, place certificates of the root certificate authorities (CAs) you trust in a file in the data directory, set the parameter [ssl_ca_file](runtime-config-connection#GUC-SSL-CA-FILE) in `postgresql.conf` to the new file name, and add the authentication option `clientcert=verify-ca` or `clientcert=verify-full` to the appropriate `hostssl` line(s) in `pg_hba.conf`. A certificate will then be requested from the client during SSL connection startup. (See [Section 34.19](libpq-ssl) for a description of how to set up certificates on the client.)

For a `hostssl` entry with `clientcert=verify-ca`, the server will verify that the client's certificate is signed by one of the trusted certificate authorities. If `clientcert=verify-full` is specified, the server will not only verify the certificate chain, but it will also check whether the username or its mapping matches the `cn` (Common Name) of the provided certificate. Note that certificate chain validation is always ensured when the `cert` authentication method is used (see [Section 21.12](auth-cert)).

Intermediate certificates that chain up to existing root certificates can also appear in the [ssl_ca_file](runtime-config-connection#GUC-SSL-CA-FILE) file if you wish to avoid storing them on clients (assuming the root and intermediate certificates were created with `v3_ca` extensions). Certificate Revocation List (CRL) entries are also checked if the parameter [ssl_crl_file](runtime-config-connection#GUC-SSL-CRL-FILE) or [ssl_crl_dir](runtime-config-connection#GUC-SSL-CRL-DIR) is set.

The `clientcert` authentication option is available for all authentication methods, but only in `pg_hba.conf` lines specified as `hostssl`. When `clientcert` is not specified, the server verifies the client certificate against its CA file only if a client certificate is presented and the CA is configured.

There are two approaches to enforce that users provide a certificate during login.

The first approach makes use of the `cert` authentication method for `hostssl` entries in `pg_hba.conf`, such that the certificate itself is used for authentication while also providing ssl connection security. See [Section 21.12](auth-cert) for details. (It is not necessary to specify any `clientcert` options explicitly when using the `cert` authentication method.) In this case, the `cn` (Common Name) provided in the certificate is checked against the user name or an applicable mapping.

The second approach combines any authentication method for `hostssl` entries with the verification of client certificates by setting the `clientcert` authentication option to `verify-ca` or `verify-full`. The former option only enforces that the certificate is valid, while the latter also ensures that the `cn` (Common Name) in the certificate matches the user name or an applicable mapping.

[#id](#SSL-SERVER-FILES)

### 19.9.4. SSL Server File Usage [#](#SSL-SERVER-FILES)

[Table 19.2](ssl-tcp#SSL-FILE-USAGE) summarizes the files that are relevant to the SSL setup on the server. (The shown file names are default names. The locally configured names could be different.)

[#id](#SSL-FILE-USAGE)

**Table 19.2. SSL Server File Usage**

| File                                                                                | Contents                                        | Effect                                                                                              |
| ----------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [ssl_cert_file](runtime-config-connection#GUC-SSL-CERT-FILE) (`$PGDATA/server.crt`) | server certificate                              | sent to client to indicate server's identity                                                        |
| [ssl_key_file](runtime-config-connection#GUC-SSL-KEY-FILE) (`$PGDATA/server.key`)   | server private key                              | proves server certificate was sent by the owner; does not indicate certificate owner is trustworthy |
| [ssl_ca_file](runtime-config-connection#GUC-SSL-CA-FILE)                            | trusted certificate authorities                 | checks that client certificate is signed by a trusted certificate authority                         |
| [ssl_crl_file](runtime-config-connection#GUC-SSL-CRL-FILE)                          | certificates revoked by certificate authorities | client certificate must not be on this list                                                         |

The server reads these files at server start and whenever the server configuration is reloaded. On Windows systems, they are also re-read whenever a new backend process is spawned for a new client connection.

If an error in these files is detected at server start, the server will refuse to start. But if an error is detected during a configuration reload, the files are ignored and the old SSL configuration continues to be used. On Windows systems, if an error in these files is detected at backend start, that backend will be unable to establish an SSL connection. In all these cases, the error condition is reported in the server log.

[#id](#SSL-CERTIFICATE-CREATION)

### 19.9.5. Creating Certificates [#](#SSL-CERTIFICATE-CREATION)

To create a simple self-signed certificate for the server, valid for 365 days, use the following OpenSSL command, replacing _`dbhost.yourdomain.com`_ with the server's host name:

```
openssl req -new -x509 -days 365 -nodes -text -out server.crt \
  -keyout server.key -subj "/CN=dbhost.yourdomain.com"
```

Then do:

```
chmod og-rwx server.key
```

because the server will reject the file if its permissions are more liberal than this. For more details on how to create your server private key and certificate, refer to the OpenSSL documentation.

While a self-signed certificate can be used for testing, a certificate signed by a certificate authority (CA) (usually an enterprise-wide root CA) should be used in production.

To create a server certificate whose identity can be validated by clients, first create a certificate signing request (CSR) and a public/private key file:

```
openssl req -new -nodes -text -out root.csr \
  -keyout root.key -subj "/CN=root.yourdomain.com"
chmod og-rwx root.key
```

Then, sign the request with the key to create a root certificate authority (using the default OpenSSL configuration file location on Linux):

```
openssl x509 -req -in root.csr -text -days 3650 \
  -extfile /etc/ssl/openssl.cnf -extensions v3_ca \
  -signkey root.key -out root.crt
```

Finally, create a server certificate signed by the new root certificate authority:

```
openssl req -new -nodes -text -out server.csr \
  -keyout server.key -subj "/CN=dbhost.yourdomain.com"
chmod og-rwx server.key

openssl x509 -req -in server.csr -text -days 365 \
  -CA root.crt -CAkey root.key -CAcreateserial \
  -out server.crt
```

`server.crt` and `server.key` should be stored on the server, and `root.crt` should be stored on the client so the client can verify that the server's leaf certificate was signed by its trusted root certificate. `root.key` should be stored offline for use in creating future certificates.

It is also possible to create a chain of trust that includes intermediate certificates:

```
# root
openssl req -new -nodes -text -out root.csr \
  -keyout root.key -subj "/CN=root.yourdomain.com"
chmod og-rwx root.key
openssl x509 -req -in root.csr -text -days 3650 \
  -extfile /etc/ssl/openssl.cnf -extensions v3_ca \
  -signkey root.key -out root.crt

# intermediate
openssl req -new -nodes -text -out intermediate.csr \
  -keyout intermediate.key -subj "/CN=intermediate.yourdomain.com"
chmod og-rwx intermediate.key
openssl x509 -req -in intermediate.csr -text -days 1825 \
  -extfile /etc/ssl/openssl.cnf -extensions v3_ca \
  -CA root.crt -CAkey root.key -CAcreateserial \
  -out intermediate.crt

# leaf
openssl req -new -nodes -text -out server.csr \
  -keyout server.key -subj "/CN=dbhost.yourdomain.com"
chmod og-rwx server.key
openssl x509 -req -in server.csr -text -days 365 \
  -CA intermediate.crt -CAkey intermediate.key -CAcreateserial \
  -out server.crt
```

`server.crt` and `intermediate.crt` should be concatenated into a certificate file bundle and stored on the server. `server.key` should also be stored on the server. `root.crt` should be stored on the client so the client can verify that the server's leaf certificate was signed by a chain of certificates linked to its trusted root certificate. `root.key` and `intermediate.key` should be stored offline for use in creating future certificates.
