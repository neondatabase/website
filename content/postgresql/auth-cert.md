<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             21.12. Certificate Authentication            |                                                                      |                                   |                                                       |                                                    |
| :------------------------------------------------------: | :------------------------------------------------------------------- | :-------------------------------: | ----------------------------------------------------: | -------------------------------------------------: |
| [Prev](auth-radius.html "21.11. RADIUS Authentication")  | [Up](client-authentication.html "Chapter 21. Client Authentication") | Chapter 21. Client Authentication | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](auth-pam.html "21.13. PAM Authentication") |

***

## 21.12. Certificate Authentication [#](#AUTH-CERT)



This authentication method uses SSL client certificates to perform authentication. It is therefore only available for SSL connections; see [Section 19.9.2](ssl-tcp.html#SSL-OPENSSL-CONFIG "19.9.2. OpenSSL Configuration") for SSL configuration instructions. When using this authentication method, the server will require that the client provide a valid, trusted certificate. No password prompt will be sent to the client. The `cn` (Common Name) attribute of the certificate will be compared to the requested database user name, and if they match the login will be allowed. User name mapping can be used to allow `cn` to be different from the database user name.

The following configuration options are supported for SSL certificate authentication:

*   `map`

    Allows for mapping between system and database user names. See [Section 21.2](auth-username-maps.html "21.2. User Name Maps") for details.

It is redundant to use the `clientcert` option with `cert` authentication because `cert` authentication is effectively `trust` authentication with `clientcert=verify-full`.

***

|                                                          |                                                                      |                                                    |
| :------------------------------------------------------- | :------------------------------------------------------------------: | -------------------------------------------------: |
| [Prev](auth-radius.html "21.11. RADIUS Authentication")  | [Up](client-authentication.html "Chapter 21. Client Authentication") |  [Next](auth-pam.html "21.13. PAM Authentication") |
| 21.11. RADIUS Authentication                             |         [Home](index.html "PostgreSQL 17devel Documentation")        |                          21.13. PAM Authentication |
