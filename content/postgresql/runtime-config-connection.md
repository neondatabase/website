[#id](#RUNTIME-CONFIG-CONNECTION)

## 20.3. Connections and Authentication [#](#RUNTIME-CONFIG-CONNECTION)

- [20.3.1. Connection Settings](runtime-config-connection#RUNTIME-CONFIG-CONNECTION-SETTINGS)
- [20.3.2. TCP Settings](runtime-config-connection#RUNTIME-CONFIG-TCP-SETTINGS)
- [20.3.3. Authentication](runtime-config-connection#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)
- [20.3.4. SSL](runtime-config-connection#RUNTIME-CONFIG-CONNECTION-SSL)

[#id](#RUNTIME-CONFIG-CONNECTION-SETTINGS)

### 20.3.1. Connection Settings [#](#RUNTIME-CONFIG-CONNECTION-SETTINGS)

- `listen_addresses` (`string`) [#](#GUC-LISTEN-ADDRESSES)

  Specifies the TCP/IP address(es) on which the server is to listen for connections from client applications. The value takes the form of a comma-separated list of host names and/or numeric IP addresses. The special entry `*` corresponds to all available IP interfaces. The entry `0.0.0.0` allows listening for all IPv4 addresses and `::` allows listening for all IPv6 addresses. If the list is empty, the server does not listen on any IP interface at all, in which case only Unix-domain sockets can be used to connect to it. The default value is localhost, which allows only local TCP/IP “loopback” connections to be made. While client authentication ([Chapter 21](client-authentication)) allows fine-grained control over who can access the server, `listen_addresses` controls which interfaces accept connection attempts, which can help prevent repeated malicious connection requests on insecure network interfaces. This parameter can only be set at server start.

- `port` (`integer`) [#](#GUC-PORT)

  The TCP port the server listens on; 5432 by default. Note that the same port number is used for all IP addresses the server listens on. This parameter can only be set at server start.

- `max_connections` (`integer`) [#](#GUC-MAX-CONNECTIONS)

  Determines the maximum number of concurrent connections to the database server. The default is typically 100 connections, but might be less if your kernel settings will not support it (as determined during initdb). This parameter can only be set at server start.

  When running a standby server, you must set this parameter to the same or higher value than on the primary server. Otherwise, queries will not be allowed in the standby server.

- `reserved_connections` (`integer`) [#](#GUC-RESERVED-CONNECTIONS)

  Determines the number of connection “slots” that are reserved for connections by roles with privileges of the [`pg_use_reserved_connections`](predefined-roles#PREDEFINED-ROLES-TABLE) role. Whenever the number of free connection slots is greater than [superuser_reserved_connections](runtime-config-connection#GUC-SUPERUSER-RESERVED-CONNECTIONS) but less than or equal to the sum of `superuser_reserved_connections` and `reserved_connections`, new connections will be accepted only for superusers and roles with privileges of `pg_use_reserved_connections`. If `superuser_reserved_connections` or fewer connection slots are available, new connections will be accepted only for superusers.

  The default value is zero connections. The value must be less than `max_connections` minus `superuser_reserved_connections`. This parameter can only be set at server start.

- `superuser_reserved_connections` (`integer`) [#](#GUC-SUPERUSER-RESERVED-CONNECTIONS)

  Determines the number of connection “slots” that are reserved for connections by PostgreSQL superusers. At most [max_connections](runtime-config-connection#GUC-MAX-CONNECTIONS) connections can ever be active simultaneously. Whenever the number of active concurrent connections is at least `max_connections` minus `superuser_reserved_connections`, new connections will be accepted only for superusers. The connection slots reserved by this parameter are intended as final reserve for emergency use after the slots reserved by [reserved_connections](runtime-config-connection#GUC-RESERVED-CONNECTIONS) have been exhausted.

  The default value is three connections. The value must be less than `max_connections` minus `reserved_connections`. This parameter can only be set at server start.

- `unix_socket_directories` (`string`) [#](#GUC-UNIX-SOCKET-DIRECTORIES)

  Specifies the directory of the Unix-domain socket(s) on which the server is to listen for connections from client applications. Multiple sockets can be created by listing multiple directories separated by commas. Whitespace between entries is ignored; surround a directory name with double quotes if you need to include whitespace or commas in the name. An empty value specifies not listening on any Unix-domain sockets, in which case only TCP/IP sockets can be used to connect to the server.

  A value that starts with `@` specifies that a Unix-domain socket in the abstract namespace should be created (currently supported on Linux only). In that case, this value does not specify a “directory” but a prefix from which the actual socket name is computed in the same manner as for the file-system namespace. While the abstract socket name prefix can be chosen freely, since it is not a file-system location, the convention is to nonetheless use file-system-like values such as `@/tmp`.

  The default value is normally `/tmp`, but that can be changed at build time. On Windows, the default is empty, which means no Unix-domain socket is created by default. This parameter can only be set at server start.

  In addition to the socket file itself, which is named `.s.PGSQL.nnnn` where _`nnnn`_ is the server's port number, an ordinary file named `.s.PGSQL.nnnn.lock` will be created in each of the `unix_socket_directories` directories. Neither file should ever be removed manually. For sockets in the abstract namespace, no lock file is created.

- `unix_socket_group` (`string`) [#](#GUC-UNIX-SOCKET-GROUP)

  Sets the owning group of the Unix-domain socket(s). (The owning user of the sockets is always the user that starts the server.) In combination with the parameter `unix_socket_permissions` this can be used as an additional access control mechanism for Unix-domain connections. By default this is the empty string, which uses the default group of the server user. This parameter can only be set at server start.

  This parameter is not supported on Windows. Any setting will be ignored. Also, sockets in the abstract namespace have no file owner, so this setting is also ignored in that case.

- `unix_socket_permissions` (`integer`) [#](#GUC-UNIX-SOCKET-PERMISSIONS)

  Sets the access permissions of the Unix-domain socket(s). Unix-domain sockets use the usual Unix file system permission set. The parameter value is expected to be a numeric mode specified in the format accepted by the `chmod` and `umask` system calls. (To use the customary octal format the number must start with a `0` (zero).)

  The default permissions are `0777`, meaning anyone can connect. Reasonable alternatives are `0770` (only user and group, see also `unix_socket_group`) and `0700` (only user). (Note that for a Unix-domain socket, only write permission matters, so there is no point in setting or revoking read or execute permissions.)

  This access control mechanism is independent of the one described in [Chapter 21](client-authentication).

  This parameter can only be set at server start.

  This parameter is irrelevant on systems, notably Solaris as of Solaris 10, that ignore socket permissions entirely. There, one can achieve a similar effect by pointing `unix_socket_directories` to a directory having search permission limited to the desired audience.

  Sockets in the abstract namespace have no file permissions, so this setting is also ignored in that case.

- `bonjour` (`boolean`) [#](#GUC-BONJOUR)

  Enables advertising the server's existence via Bonjour. The default is off. This parameter can only be set at server start.

- `bonjour_name` (`string`) [#](#GUC-BONJOUR-NAME)

  Specifies the Bonjour service name. The computer name is used if this parameter is set to the empty string `''` (which is the default). This parameter is ignored if the server was not compiled with Bonjour support. This parameter can only be set at server start.

[#id](#RUNTIME-CONFIG-TCP-SETTINGS)

### 20.3.2. TCP Settings [#](#RUNTIME-CONFIG-TCP-SETTINGS)

- `tcp_keepalives_idle` (`integer`) [#](#GUC-TCP-KEEPALIVES-IDLE)

  Specifies the amount of time with no network activity after which the operating system should send a TCP keepalive message to the client. If this value is specified without units, it is taken as seconds. A value of 0 (the default) selects the operating system's default. On Windows, setting a value of 0 will set this parameter to 2 hours, since Windows does not provide a way to read the system default value. This parameter is supported only on systems that support `TCP_KEEPIDLE` or an equivalent socket option, and on Windows; on other systems, it must be zero. In sessions connected via a Unix-domain socket, this parameter is ignored and always reads as zero.

- `tcp_keepalives_interval` (`integer`) [#](#GUC-TCP-KEEPALIVES-INTERVAL)

  Specifies the amount of time after which a TCP keepalive message that has not been acknowledged by the client should be retransmitted. If this value is specified without units, it is taken as seconds. A value of 0 (the default) selects the operating system's default. On Windows, setting a value of 0 will set this parameter to 1 second, since Windows does not provide a way to read the system default value. This parameter is supported only on systems that support `TCP_KEEPINTVL` or an equivalent socket option, and on Windows; on other systems, it must be zero. In sessions connected via a Unix-domain socket, this parameter is ignored and always reads as zero.

- `tcp_keepalives_count` (`integer`) [#](#GUC-TCP-KEEPALIVES-COUNT)

  Specifies the number of TCP keepalive messages that can be lost before the server's connection to the client is considered dead. A value of 0 (the default) selects the operating system's default. This parameter is supported only on systems that support `TCP_KEEPCNT` or an equivalent socket option (which does not include Windows); on other systems, it must be zero. In sessions connected via a Unix-domain socket, this parameter is ignored and always reads as zero.

- `tcp_user_timeout` (`integer`) [#](#GUC-TCP-USER-TIMEOUT)

  Specifies the amount of time that transmitted data may remain unacknowledged before the TCP connection is forcibly closed. If this value is specified without units, it is taken as milliseconds. A value of 0 (the default) selects the operating system's default. This parameter is supported only on systems that support `TCP_USER_TIMEOUT` (which does not include Windows); on other systems, it must be zero. In sessions connected via a Unix-domain socket, this parameter is ignored and always reads as zero.

- `client_connection_check_interval` (`integer`) [#](#GUC-CLIENT-CONNECTION-CHECK-INTERVAL)

  Sets the time interval between optional checks that the client is still connected, while running queries. The check is performed by polling the socket, and allows long running queries to be aborted sooner if the kernel reports that the connection is closed.

  This option relies on kernel events exposed by Linux, macOS, illumos and the BSD family of operating systems, and is not currently available on other systems.

  If the value is specified without units, it is taken as milliseconds. The default value is `0`, which disables connection checks. Without connection checks, the server will detect the loss of the connection only at the next interaction with the socket, when it waits for, receives or sends data.

  For the kernel itself to detect lost TCP connections reliably and within a known timeframe in all scenarios including network failure, it may also be necessary to adjust the TCP keepalive settings of the operating system, or the [tcp_keepalives_idle](runtime-config-connection#GUC-TCP-KEEPALIVES-IDLE), [tcp_keepalives_interval](runtime-config-connection#GUC-TCP-KEEPALIVES-INTERVAL) and [tcp_keepalives_count](runtime-config-connection#GUC-TCP-KEEPALIVES-COUNT) settings of PostgreSQL.

[#id](#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)

### 20.3.3. Authentication [#](#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)

- `authentication_timeout` (`integer`) [#](#GUC-AUTHENTICATION-TIMEOUT)

  Maximum amount of time allowed to complete client authentication. If a would-be client has not completed the authentication protocol in this much time, the server closes the connection. This prevents hung clients from occupying a connection indefinitely. If this value is specified without units, it is taken as seconds. The default is one minute (`1m`). This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `password_encryption` (`enum`) [#](#GUC-PASSWORD-ENCRYPTION)

  When a password is specified in [CREATE ROLE](sql-createrole) or [ALTER ROLE](sql-alterrole), this parameter determines the algorithm to use to encrypt the password. Possible values are `scram-sha-256`, which will encrypt the password with SCRAM-SHA-256, and `md5`, which stores the password as an MD5 hash. The default is `scram-sha-256`.

  Note that older clients might lack support for the SCRAM authentication mechanism, and hence not work with passwords encrypted with SCRAM-SHA-256. See [Section 21.5](auth-password) for more details.

- `scram_iterations` (`integer`) [#](#GUC-SCRAM-ITERATIONS)

  The number of computational iterations to be performed when encrypting a password using SCRAM-SHA-256. The default is `4096`. A higher number of iterations provides additional protection against brute-force attacks on stored passwords, but makes authentication slower. Changing the value has no effect on existing passwords encrypted with SCRAM-SHA-256 as the iteration count is fixed at the time of encryption. In order to make use of a changed value, a new password must be set.

- `krb_server_keyfile` (`string`) [#](#GUC-KRB-SERVER-KEYFILE)

  Sets the location of the server's Kerberos key file. The default is `FILE:/usr/local/pgsql/etc/krb5.keytab` (where the directory part is whatever was specified as `sysconfdir` at build time; use `pg_config --sysconfdir` to determine that). If this parameter is set to an empty string, it is ignored and a system-dependent default is used. This parameter can only be set in the `postgresql.conf` file or on the server command line. See [Section 21.6](gssapi-auth) for more information.

- `krb_caseins_users` (`boolean`) [#](#GUC-KRB-CASEINS-USERS)

  Sets whether GSSAPI user names should be treated case-insensitively. The default is `off` (case sensitive). This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `gss_accept_delegation` (`boolean`) [#](#GUC-GSS-ACCEPT-DELEGATION)

  Sets whether GSSAPI delegation should be accepted from the client. The default is `off` meaning credentials from the client will _not_ be accepted. Changing this to `on` will make the server accept credentials delegated to it from the client. This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `db_user_namespace` (`boolean`) [#](#GUC-DB-USER-NAMESPACE)

  This parameter enables per-database user names. It is off by default. This parameter can only be set in the `postgresql.conf` file or on the server command line.

  If this is on, you should create users as _`username@dbname`_. When _`username`_ is passed by a connecting client, `@` and the database name are appended to the user name and that database-specific user name is looked up by the server. Note that when you create users with names containing `@` within the SQL environment, you will need to quote the user name.

  With this parameter enabled, you can still create ordinary global users. Simply append `@` when specifying the user name in the client, e.g., `joe@`. The `@` will be stripped off before the user name is looked up by the server.

  `db_user_namespace` causes the client's and server's user name representation to differ. Authentication checks are always done with the server's user name so authentication methods must be configured for the server's user name, not the client's. Because `md5` uses the user name as salt on both the client and server, `md5` cannot be used with `db_user_namespace`.

  ### Note

  This feature is intended as a temporary measure until a complete solution is found. At that time, this option will be removed.

[#id](#RUNTIME-CONFIG-CONNECTION-SSL)

### 20.3.4. SSL [#](#RUNTIME-CONFIG-CONNECTION-SSL)

See [Section 19.9](ssl-tcp) for more information about setting up SSL. The configuration parameters for controlling transfer encryption using TLS protocols are named `ssl` for historic reasons, even though support for the SSL protocol has been deprecated. SSL is in this context used interchangeably with TLS.

- `ssl` (`boolean`) [#](#GUC-SSL)

  Enables SSL connections. This parameter can only be set in the `postgresql.conf` file or on the server command line. The default is `off`.

- `ssl_ca_file` (`string`) [#](#GUC-SSL-CA-FILE)

  Specifies the name of the file containing the SSL server certificate authority (CA). Relative paths are relative to the data directory. This parameter can only be set in the `postgresql.conf` file or on the server command line. The default is empty, meaning no CA file is loaded, and client certificate verification is not performed.

- `ssl_cert_file` (`string`) [#](#GUC-SSL-CERT-FILE)

  Specifies the name of the file containing the SSL server certificate. Relative paths are relative to the data directory. This parameter can only be set in the `postgresql.conf` file or on the server command line. The default is `server.crt`.

- `ssl_crl_file` (`string`) [#](#GUC-SSL-CRL-FILE)

  Specifies the name of the file containing the SSL client certificate revocation list (CRL). Relative paths are relative to the data directory. This parameter can only be set in the `postgresql.conf` file or on the server command line. The default is empty, meaning no CRL file is loaded (unless [ssl_crl_dir](runtime-config-connection#GUC-SSL-CRL-DIR) is set).

- `ssl_crl_dir` (`string`) [#](#GUC-SSL-CRL-DIR)

  Specifies the name of the directory containing the SSL client certificate revocation list (CRL). Relative paths are relative to the data directory. This parameter can only be set in the `postgresql.conf` file or on the server command line. The default is empty, meaning no CRLs are used (unless [ssl_crl_file](runtime-config-connection#GUC-SSL-CRL-FILE) is set).

  The directory needs to be prepared with the OpenSSL command `openssl rehash` or `c_rehash`. See its documentation for details.

  When using this setting, CRLs in the specified directory are loaded on-demand at connection time. New CRLs can be added to the directory and will be used immediately. This is unlike [ssl_crl_file](runtime-config-connection#GUC-SSL-CRL-FILE), which causes the CRL in the file to be loaded at server start time or when the configuration is reloaded. Both settings can be used together.

- `ssl_key_file` (`string`) [#](#GUC-SSL-KEY-FILE)

  Specifies the name of the file containing the SSL server private key. Relative paths are relative to the data directory. This parameter can only be set in the `postgresql.conf` file or on the server command line. The default is `server.key`.

- `ssl_ciphers` (`string`) [#](#GUC-SSL-CIPHERS)

  Specifies a list of SSL cipher suites that are allowed to be used by SSL connections. See the ciphers manual page in the OpenSSL package for the syntax of this setting and a list of supported values. Only connections using TLS version 1.2 and lower are affected. There is currently no setting that controls the cipher choices used by TLS version 1.3 connections. The default value is `HIGH:MEDIUM:+3DES:!aNULL`. The default is usually a reasonable choice unless you have specific security requirements.

  This parameter can only be set in the `postgresql.conf` file or on the server command line.

  Explanation of the default value:

  - `HIGH` [#](#GUC-SSL-CIPHERS-HIGH)

    Cipher suites that use ciphers from `HIGH` group (e.g., AES, Camellia, 3DES)

  - `MEDIUM` [#](#GUC-SSL-CIPHERS-MEDIUM)

    Cipher suites that use ciphers from `MEDIUM` group (e.g., RC4, SEED)

  - `+3DES` [#](#GUC-SSL-CIPHERS-PLUS-3DES)

    The OpenSSL default order for `HIGH` is problematic because it orders 3DES higher than AES128. This is wrong because 3DES offers less security than AES128, and it is also much slower. `+3DES` reorders it after all other `HIGH` and `MEDIUM` ciphers.

  - `!aNULL` [#](#GUC-SSL-CIPHERS-NOT-ANULL)

    Disables anonymous cipher suites that do no authentication. Such cipher suites are vulnerable to MITM attacks and therefore should not be used.

  Available cipher suite details will vary across OpenSSL versions. Use the command `openssl ciphers -v 'HIGH:MEDIUM:+3DES:!aNULL'` to see actual details for the currently installed OpenSSL version. Note that this list is filtered at run time based on the server key type.

- `ssl_prefer_server_ciphers` (`boolean`) [#](#GUC-SSL-PREFER-SERVER-CIPHERS)

  Specifies whether to use the server's SSL cipher preferences, rather than the client's. This parameter can only be set in the `postgresql.conf` file or on the server command line. The default is `on`.

  Older PostgreSQL versions do not have this setting and always use the client's preferences. This setting is mainly for backward compatibility with those versions. Using the server's preferences is usually better because it is more likely that the server is appropriately configured.

- `ssl_ecdh_curve` (`string`) [#](#GUC-SSL-ECDH-CURVE)

  Specifies the name of the curve to use in ECDH key exchange. It needs to be supported by all clients that connect. It does not need to be the same curve used by the server's Elliptic Curve key. This parameter can only be set in the `postgresql.conf` file or on the server command line. The default is `prime256v1`.

  OpenSSL names for the most common curves are: `prime256v1` (NIST P-256), `secp384r1` (NIST P-384), `secp521r1` (NIST P-521). The full list of available curves can be shown with the command `openssl ecparam -list_curves`. Not all of them are usable in TLS though.

- `ssl_min_protocol_version` (`enum`) [#](#GUC-SSL-MIN-PROTOCOL-VERSION)

  Sets the minimum SSL/TLS protocol version to use. Valid values are currently: `TLSv1`, `TLSv1.1`, `TLSv1.2`, `TLSv1.3`. Older versions of the OpenSSL library do not support all values; an error will be raised if an unsupported setting is chosen. Protocol versions before TLS 1.0, namely SSL version 2 and 3, are always disabled.

  The default is `TLSv1.2`, which satisfies industry best practices as of this writing.

  This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `ssl_max_protocol_version` (`enum`) [#](#GUC-SSL-MAX-PROTOCOL-VERSION)

  Sets the maximum SSL/TLS protocol version to use. Valid values are as for [ssl_min_protocol_version](runtime-config-connection#GUC-SSL-MIN-PROTOCOL-VERSION), with addition of an empty string, which allows any protocol version. The default is to allow any version. Setting the maximum protocol version is mainly useful for testing or if some component has issues working with a newer protocol.

  This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `ssl_dh_params_file` (`string`) [#](#GUC-SSL-DH-PARAMS-FILE)

  Specifies the name of the file containing Diffie-Hellman parameters used for so-called ephemeral DH family of SSL ciphers. The default is empty, in which case compiled-in default DH parameters used. Using custom DH parameters reduces the exposure if an attacker manages to crack the well-known compiled-in DH parameters. You can create your own DH parameters file with the command `openssl dhparam -out dhparams.pem 2048`.

  This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `ssl_passphrase_command` (`string`) [#](#GUC-SSL-PASSPHRASE-COMMAND)

  Sets an external command to be invoked when a passphrase for decrypting an SSL file such as a private key needs to be obtained. By default, this parameter is empty, which means the built-in prompting mechanism is used.

  The command must print the passphrase to the standard output and exit with code 0. In the parameter value, `%p` is replaced by a prompt string. (Write `%%` for a literal `%`.) Note that the prompt string will probably contain whitespace, so be sure to quote adequately. A single newline is stripped from the end of the output if present.

  The command does not actually have to prompt the user for a passphrase. It can read it from a file, obtain it from a keychain facility, or similar. It is up to the user to make sure the chosen mechanism is adequately secure.

  This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `ssl_passphrase_command_supports_reload` (`boolean`) [#](#GUC-SSL-PASSPHRASE-COMMAND-SUPPORTS-RELOAD)

  This parameter determines whether the passphrase command set by `ssl_passphrase_command` will also be called during a configuration reload if a key file needs a passphrase. If this parameter is off (the default), then `ssl_passphrase_command` will be ignored during a reload and the SSL configuration will not be reloaded if a passphrase is needed. That setting is appropriate for a command that requires a TTY for prompting, which might not be available when the server is running. Setting this parameter to on might be appropriate if the passphrase is obtained from a file, for example.

  This parameter can only be set in the `postgresql.conf` file or on the server command line.
