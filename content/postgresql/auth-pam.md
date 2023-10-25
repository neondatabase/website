<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  21.13. PAM Authentication                  |                                                                      |                                   |                                                       |                                                    |
| :---------------------------------------------------------: | :------------------------------------------------------------------- | :-------------------------------: | ----------------------------------------------------: | -------------------------------------------------: |
| [Prev](auth-cert.html "21.12. Certificate Authentication")  | [Up](client-authentication.html "Chapter 21. Client Authentication") | Chapter 21. Client Authentication | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](auth-bsd.html "21.14. BSD Authentication") |

***

## 21.13. PAM Authentication [#](#AUTH-PAM)



This authentication method operates similarly to `password` except that it uses PAM (Pluggable Authentication Modules) as the authentication mechanism. The default PAM service name is `postgresql`. PAM is used only to validate user name/password pairs and optionally the connected remote host name or IP address. Therefore the user must already exist in the database before PAM can be used for authentication. For more information about PAM, please read the [Linux-PAM Page](https://www.kernel.org/pub/linux/libs/pam/).

The following configuration options are supported for PAM:

*   `pamservice`

    PAM service name.

*   `pam_use_hostname`

    Determines whether the remote IP address or the host name is provided to PAM modules through the `PAM_RHOST` item. By default, the IP address is used. Set this option to 1 to use the resolved host name instead. Host name resolution can lead to login delays. (Most PAM configurations don't use this information, so it is only necessary to consider this setting if a PAM configuration was specifically created to make use of it.)

### Note

If PAM is set up to read `/etc/shadow`, authentication will fail because the PostgreSQL server is started by a non-root user. However, this is not an issue when PAM is configured to use LDAP or other authentication methods.

***

|                                                             |                                                                      |                                                    |
| :---------------------------------------------------------- | :------------------------------------------------------------------: | -------------------------------------------------: |
| [Prev](auth-cert.html "21.12. Certificate Authentication")  | [Up](client-authentication.html "Chapter 21. Client Authentication") |  [Next](auth-bsd.html "21.14. BSD Authentication") |
| 21.12. Certificate Authentication                           |         [Home](index.html "PostgreSQL 17devel Documentation")        |                          21.14. BSD Authentication |
