[#id](#AUTH-IDENT)

## 21.8. Ident Authentication [#](#AUTH-IDENT)

The ident authentication method works by obtaining the client's operating system user name from an ident server and using it as the allowed database user name (with an optional user name mapping). This is only supported on TCP/IP connections.

### Note

When ident is specified for a local (non-TCP/IP) connection, peer authentication (see [Section 21.9](auth-peer)) will be used instead.

The following configuration options are supported for `ident`:

- `map`

  Allows for mapping between system and database user names. See [Section 21.2](auth-username-maps) for details.

The “Identification Protocol” is described in [RFC 1413](https://tools.ietf.org/html/rfc1413). Virtually every Unix-like operating system ships with an ident server that listens on TCP port 113 by default. The basic functionality of an ident server is to answer questions like “What user initiated the connection that goes out of your port _`X`_ and connects to my port _`Y`_?”. Since PostgreSQL knows both _`X`_ and _`Y`_ when a physical connection is established, it can interrogate the ident server on the host of the connecting client and can theoretically determine the operating system user for any given connection.

The drawback of this procedure is that it depends on the integrity of the client: if the client machine is untrusted or compromised, an attacker could run just about any program on port 113 and return any user name they choose. This authentication method is therefore only appropriate for closed networks where each client machine is under tight control and where the database and system administrators operate in close contact. In other words, you must trust the machine running the ident server. Heed the warning:

|     |                                                                                             |     |
| --- | ------------------------------------------------------------------------------------------- | --- |
|     | The Identification Protocol is not intended as an authorization or access control protocol. |     |
|     | --RFC 1413                                                                                  |     |

Some ident servers have a nonstandard option that causes the returned user name to be encrypted, using a key that only the originating machine's administrator knows. This option _must not_ be used when using the ident server with PostgreSQL, since PostgreSQL does not have any way to decrypt the returned string to determine the actual user name.
