[#id](#PREVENTING-SERVER-SPOOFING)

## 19.7. Preventing Server Spoofing [#](#PREVENTING-SERVER-SPOOFING)

While the server is running, it is not possible for a malicious user to take the place of the normal database server. However, when the server is down, it is possible for a local user to spoof the normal server by starting their own server. The spoof server could read passwords and queries sent by clients, but could not return any data because the `PGDATA` directory would still be secure because of directory permissions. Spoofing is possible because any user can start a database server; a client cannot identify an invalid server unless it is specially configured.

One way to prevent spoofing of `local` connections is to use a Unix domain socket directory ([unix_socket_directories](runtime-config-connection#GUC-UNIX-SOCKET-DIRECTORIES)) that has write permission only for a trusted local user. This prevents a malicious user from creating their own socket file in that directory. If you are concerned that some applications might still reference `/tmp` for the socket file and hence be vulnerable to spoofing, during operating system startup create a symbolic link `/tmp/.s.PGSQL.5432` that points to the relocated socket file. You also might need to modify your `/tmp` cleanup script to prevent removal of the symbolic link.

Another option for `local` connections is for clients to use [`requirepeer`](libpq-connect#LIBPQ-CONNECT-REQUIREPEER) to specify the required owner of the server process connected to the socket.

To prevent spoofing on TCP connections, either use SSL certificates and make sure that clients check the server's certificate, or use GSSAPI encryption (or both, if they're on separate connections).

To prevent spoofing with SSL, the server must be configured to accept only `hostssl` connections ([Section 21.1](auth-pg-hba-conf)) and have SSL key and certificate files ([Section 19.9](ssl-tcp)). The TCP client must connect using `sslmode=verify-ca` or `verify-full` and have the appropriate root certificate file installed ([Section 34.19.1](libpq-ssl#LIBQ-SSL-CERTIFICATES)). Alternatively the system CA pool can be used using `sslrootcert=system`; in this case, `sslmode=verify-full` is forced for safety, since it is generally trivial to obtain certificates which are signed by a public CA.

To prevent server spoofing from occurring when using [scram-sha-256](auth-password) password authentication over a network, you should ensure that you connect to the server using SSL and with one of the anti-spoofing methods described in the previous paragraph. Additionally, the SCRAM implementation in libpq cannot protect the entire authentication exchange, but using the `channel_binding=require` connection parameter provides a mitigation against server spoofing. An attacker that uses a rogue server to intercept a SCRAM exchange can use offline analysis to potentially determine the hashed password from the client.

To prevent spoofing with GSSAPI, the server must be configured to accept only `hostgssenc` connections ([Section 21.1](auth-pg-hba-conf)) and use `gss` authentication with them. The TCP client must connect using `gssencmode=require`.
