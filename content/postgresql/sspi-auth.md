<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                21.7. SSPI Authentication                |                                                                      |                                   |                                                       |                                                       |
| :-----------------------------------------------------: | :------------------------------------------------------------------- | :-------------------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](gssapi-auth.html "21.6. GSSAPI Authentication")  | [Up](client-authentication.html "Chapter 21. Client Authentication") | Chapter 21. Client Authentication | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](auth-ident.html "21.8. Ident Authentication") |

***

## 21.7. SSPI Authentication [#](#SSPI-AUTH)

SSPI is a Windows technology for secure authentication with single sign-on. PostgreSQL will use SSPI in `negotiate` mode, which will use Kerberos when possible and automatically fall back to NTLM in other cases. SSPI and GSSAPI interoperate as clients and servers, e.g., an SSPI client can authenticate to an GSSAPI server. It is recommended to use SSPI on Windows clients and servers and GSSAPI on non-Windows platforms.

When using Kerberos authentication, SSPI works the same way GSSAPI does; see [Section 21.6](gssapi-auth.html "21.6. GSSAPI Authentication") for details.

The following configuration options are supported for SSPI:

* `include_realm`

    If set to 0, the realm name from the authenticated user principal is stripped off before being passed through the user name mapping ([Section 21.2](auth-username-maps.html "21.2. User Name Maps")). This is discouraged and is primarily available for backwards compatibility, as it is not secure in multi-realm environments unless `krb_realm` is also used. It is recommended to leave `include_realm` set to the default (1) and to provide an explicit mapping in `pg_ident.conf` to convert principal names to PostgreSQL user names.

* `compat_realm`

    If set to 1, the domain's SAM-compatible name (also known as the NetBIOS name) is used for the `include_realm` option. This is the default. If set to 0, the true realm name from the Kerberos user principal name is used.

    Do not disable this option unless your server runs under a domain account (this includes virtual service accounts on a domain member system) and all clients authenticating through SSPI are also using domain accounts, or authentication will fail.

* `upn_username`

    If this option is enabled along with `compat_realm`, the user name from the Kerberos UPN is used for authentication. If it is disabled (the default), the SAM-compatible user name is used. By default, these two names are identical for new user accounts.

    Note that libpq uses the SAM-compatible name if no explicit user name is specified. If you use libpq or a driver based on it, you should leave this option disabled or explicitly specify user name in the connection string.

* `map`

    Allows for mapping between system and database user names. See [Section 21.2](auth-username-maps.html "21.2. User Name Maps") for details. For an SSPI/Kerberos principal, such as `username@EXAMPLE.COM` (or, less commonly, `username/hostbased@EXAMPLE.COM`), the user name used for mapping is `username@EXAMPLE.COM` (or `username/hostbased@EXAMPLE.COM`, respectively), unless `include_realm` has been set to 0, in which case `username` (or `username/hostbased`) is what is seen as the system user name when mapping.

* `krb_realm`

    Sets the realm to match user principal names against. If this parameter is set, only users of that realm will be accepted. If it is not set, users of any realm can connect, subject to whatever user name mapping is done.

***

|                                                         |                                                                      |                                                       |
| :------------------------------------------------------ | :------------------------------------------------------------------: | ----------------------------------------------------: |
| [Prev](gssapi-auth.html "21.6. GSSAPI Authentication")  | [Up](client-authentication.html "Chapter 21. Client Authentication") |  [Next](auth-ident.html "21.8. Ident Authentication") |
| 21.6. GSSAPI Authentication                             |         [Home](index.html "PostgreSQL 17devel Documentation")        |                            21.8. Ident Authentication |
