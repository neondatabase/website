[#id](#AUTH-PEER)

## 21.9. Peer Authentication [#](#AUTH-PEER)

The peer authentication method works by obtaining the client's operating system user name from the kernel and using it as the allowed database user name (with optional user name mapping). This method is only supported on local connections.

The following configuration options are supported for `peer`:

- `map`

  Allows for mapping between system and database user names. See [Section 21.2](auth-username-maps) for details.

Peer authentication is only available on operating systems providing the `getpeereid()` function, the `SO_PEERCRED` socket parameter, or similar mechanisms. Currently that includes Linux, most flavors of BSD including macOS, and Solaris.
