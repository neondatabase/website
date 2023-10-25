

|               21.9. Peer Authentication               |                                                                      |                                   |                                                       |                                                      |
| :---------------------------------------------------: | :------------------------------------------------------------------- | :-------------------------------: | ----------------------------------------------------: | ---------------------------------------------------: |
| [Prev](auth-ident.html "21.8. Ident Authentication")  | [Up](client-authentication.html "Chapter 21. Client Authentication") | Chapter 21. Client Authentication | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](auth-ldap.html "21.10. LDAP Authentication") |

***

## 21.9. Peer Authentication [#](#AUTH-PEER)

The peer authentication method works by obtaining the client's operating system user name from the kernel and using it as the allowed database user name (with optional user name mapping). This method is only supported on local connections.

The following configuration options are supported for `peer`:

* `map`

    Allows for mapping between system and database user names. See [Section 21.2](auth-username-maps.html "21.2. User Name Maps") for details.

Peer authentication is only available on operating systems providing the `getpeereid()` function, the `SO_PEERCRED` socket parameter, or similar mechanisms. Currently that includes Linux, most flavors of BSD including macOS, and Solaris.

***

|                                                       |                                                                      |                                                      |
| :---------------------------------------------------- | :------------------------------------------------------------------: | ---------------------------------------------------: |
| [Prev](auth-ident.html "21.8. Ident Authentication")  | [Up](client-authentication.html "Chapter 21. Client Authentication") |  [Next](auth-ldap.html "21.10. LDAP Authentication") |
| 21.8. Ident Authentication                            |         [Home](index.html "PostgreSQL 17devel Documentation")        |                           21.10. LDAP Authentication |
