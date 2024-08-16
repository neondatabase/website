[#id](#CLIENT-AUTHENTICATION)

## Chapter 21. Client Authentication

**Table of Contents**

- [21.1. The `pg_hba.conf` File](auth-pg-hba-conf)
- [21.2. User Name Maps](auth-username-maps)
- [21.3. Authentication Methods](auth-methods)
- [21.4. Trust Authentication](auth-trust)
- [21.5. Password Authentication](auth-password)
- [21.6. GSSAPI Authentication](gssapi-auth)
- [21.7. SSPI Authentication](sspi-auth)
- [21.8. Ident Authentication](auth-ident)
- [21.9. Peer Authentication](auth-peer)
- [21.10. LDAP Authentication](auth-ldap)
- [21.11. RADIUS Authentication](auth-radius)
- [21.12. Certificate Authentication](auth-cert)
- [21.13. PAM Authentication](auth-pam)
- [21.14. BSD Authentication](auth-bsd)
- [21.15. Authentication Problems](client-authentication-problems)

When a client application connects to the database server, it specifies which PostgreSQL database user name it wants to connect as, much the same way one logs into a Unix computer as a particular user. Within the SQL environment the active database user name determines access privileges to database objects — see [Chapter 22](user-manag) for more information. Therefore, it is essential to restrict which database users can connect.

### Note

As explained in [Chapter 22](user-manag), PostgreSQL actually does privilege management in terms of “roles”. In this chapter, we consistently use _database user_ to mean “role with the `LOGIN` privilege”.

_Authentication_ is the process by which the database server establishes the identity of the client, and by extension determines whether the client application (or the user who runs the client application) is permitted to connect with the database user name that was requested.

PostgreSQL offers a number of different client authentication methods. The method used to authenticate a particular client connection can be selected on the basis of (client) host address, database, and user.

PostgreSQL database user names are logically separate from user names of the operating system in which the server runs. If all the users of a particular server also have accounts on the server's machine, it makes sense to assign database user names that match their operating system user names. However, a server that accepts remote connections might have many database users who have no local operating system account, and in such cases there need be no connection between database user names and OS user names.
