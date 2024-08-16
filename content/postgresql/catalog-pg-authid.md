[#id](#CATALOG-PG-AUTHID)

## 53.8. `pg_authid` [#](#CATALOG-PG-AUTHID)

The catalog `pg_authid` contains information about database authorization identifiers (roles). A role subsumes the concepts of “users” and “groups”. A user is essentially just a role with the `rolcanlogin` flag set. Any role (with or without `rolcanlogin`) can have other roles as members; see [`pg_auth_members`](catalog-pg-auth-members).

Since this catalog contains passwords, it must not be publicly readable. [`pg_roles`](view-pg-roles) is a publicly readable view on `pg_authid` that blanks out the password field.

[Chapter 22](user-manag) contains detailed information about user and privilege management.

Because user identities are cluster-wide, `pg_authid` is shared across all databases of a cluster: there is only one copy of `pg_authid` per cluster, not one per database.

[#id](#id-1.10.4.10.7)

**Table 53.8. `pg_authid` Columns**

| Column TypeDescription                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                         |
| `rolname` `name`Role name                                                                                                                         |
| `rolsuper` `bool`Role has superuser privileges                                                                                                    |
| `rolinherit` `bool`Role automatically inherits privileges of roles it is a member of                                                              |
| `rolcreaterole` `bool`Role can create more roles                                                                                                  |
| `rolcreatedb` `bool`Role can create databases                                                                                                     |
| `rolcanlogin` `bool`Role can log in. That is, this role can be given as the initial session authorization identifier.                             |
| `rolreplication` `bool`Role is a replication role. A replication role can initiate replication connections and create and drop replication slots. |
| `rolbypassrls` `bool`Role bypasses every row-level security policy, see [Section 5.8](ddl-rowsecurity) for more information.                      |
| `rolconnlimit` `int4`For roles that can log in, this sets maximum number of concurrent connections this role can make. -1 means no limit.         |
| `rolpassword` `text`Password (possibly encrypted); null if none. The format depends on the form of encryption used.                               |
| `rolvaliduntil` `timestamptz`Password expiry time (only used for password authentication); null if no expiration                                  |

For an MD5 encrypted password, `rolpassword` column will begin with the string `md5` followed by a 32-character hexadecimal MD5 hash. The MD5 hash will be of the user's password concatenated to their user name. For example, if user `joe` has password `xyzzy`, PostgreSQL will store the md5 hash of `xyzzyjoe`.

If the password is encrypted with SCRAM-SHA-256, it has the format:

```

SCRAM-SHA-256$<iteration count>:<salt>$<StoredKey>:<ServerKey>
```

where _`salt`_, _`StoredKey`_ and _`ServerKey`_ are in Base64 encoded format. This format is the same as that specified by [RFC 5803](https://tools.ietf.org/html/rfc5803).

A password that does not follow either of those formats is assumed to be unencrypted.
