## 19.10. Secure TCP/IP Connections with GSSAPI Encryption [#](#GSSAPI-ENC)

* [19.10.1. Basic Setup](gssapi-enc.html#GSSAPI-SETUP)

PostgreSQL also has native support for using GSSAPI to encrypt client/server communications for increased security. Support requires that a GSSAPI implementation (such as MIT Kerberos) is installed on both client and server systems, and that support in PostgreSQL is enabled at build time (see [Chapter 17](installation.html "Chapter 17. Installation from Source Code")).

### 19.10.1. Basic Setup [#](#GSSAPI-SETUP)

The PostgreSQL server will listen for both normal and GSSAPI-encrypted connections on the same TCP port, and will negotiate with any connecting client whether to use GSSAPI for encryption (and for authentication). By default, this decision is up to the client (which means it can be downgraded by an attacker); see [Section 21.1](auth-pg-hba-conf.html "21.1. The pg_hba.conf File") about setting up the server to require the use of GSSAPI for some or all connections.

When using GSSAPI for encryption, it is common to use GSSAPI for authentication as well, since the underlying mechanism will determine both client and server identities (according to the GSSAPI implementation) in any case. But this is not required; another PostgreSQL authentication method can be chosen to perform additional verification.

Other than configuration of the negotiation behavior, GSSAPI encryption requires no setup beyond that which is necessary for GSSAPI authentication. (For more information on configuring that, see [Section 21.6](gssapi-auth.html "21.6. GSSAPI Authentication").)