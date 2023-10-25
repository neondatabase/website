<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               21.3. Authentication Methods              |                                                                      |                                   |                                                       |                                                       |
| :-----------------------------------------------------: | :------------------------------------------------------------------- | :-------------------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](auth-username-maps.html "21.2. User Name Maps")  | [Up](client-authentication.html "Chapter 21. Client Authentication") | Chapter 21. Client Authentication | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](auth-trust.html "21.4. Trust Authentication") |

***

## 21.3. Authentication Methods [#](#AUTH-METHODS)

PostgreSQL provides various methods for authenticating users:

*   [Trust authentication](auth-trust.html "21.4. Trust Authentication"), which simply trusts that users are who they say they are.
*   [Password authentication](auth-password.html "21.5. Password Authentication"), which requires that users send a password.
*   [GSSAPI authentication](gssapi-auth.html "21.6. GSSAPI Authentication"), which relies on a GSSAPI-compatible security library. Typically this is used to access an authentication server such as a Kerberos or Microsoft Active Directory server.
*   [SSPI authentication](sspi-auth.html "21.7. SSPI Authentication"), which uses a Windows-specific protocol similar to GSSAPI.
*   [Ident authentication](auth-ident.html "21.8. Ident Authentication"), which relies on an “Identification Protocol” ([RFC 1413](https://tools.ietf.org/html/rfc1413)) service on the client's machine. (On local Unix-socket connections, this is treated as peer authentication.)
*   [Peer authentication](auth-peer.html "21.9. Peer Authentication"), which relies on operating system facilities to identify the process at the other end of a local connection. This is not supported for remote connections.
*   [LDAP authentication](auth-ldap.html "21.10. LDAP Authentication"), which relies on an LDAP authentication server.
*   [RADIUS authentication](auth-radius.html "21.11. RADIUS Authentication"), which relies on a RADIUS authentication server.
*   [Certificate authentication](auth-cert.html "21.12. Certificate Authentication"), which requires an SSL connection and authenticates users by checking the SSL certificate they send.
*   [PAM authentication](auth-pam.html "21.13. PAM Authentication"), which relies on a PAM (Pluggable Authentication Modules) library.
*   [BSD authentication](auth-bsd.html "21.14. BSD Authentication"), which relies on the BSD Authentication framework (currently available only on OpenBSD).

Peer authentication is usually recommendable for local connections, though trust authentication might be sufficient in some circumstances. Password authentication is the easiest choice for remote connections. All the other options require some kind of external security infrastructure (usually an authentication server or a certificate authority for issuing SSL certificates), or are platform-specific.

The following sections describe each of these authentication methods in more detail.

***

|                                                         |                                                                      |                                                       |
| :------------------------------------------------------ | :------------------------------------------------------------------: | ----------------------------------------------------: |
| [Prev](auth-username-maps.html "21.2. User Name Maps")  | [Up](client-authentication.html "Chapter 21. Client Authentication") |  [Next](auth-trust.html "21.4. Trust Authentication") |
| 21.2. User Name Maps                                    |         [Home](index.html "PostgreSQL 17devel Documentation")        |                            21.4. Trust Authentication |
