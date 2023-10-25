<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               22.5. Predefined Roles              |                                                    |                            |                                                       |                                                        |
| :-----------------------------------------------: | :------------------------------------------------- | :------------------------: | ----------------------------------------------------: | -----------------------------------------------------: |
| [Prev](role-removal.html "22.4. Dropping Roles")  | [Up](user-manag.html "Chapter 22. Database Roles") | Chapter 22. Database Roles | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](perm-functions.html "22.6. Function Security") |

***

## 22.5. Predefined Roles [#](#PREDEFINED-ROLES)

[]()

PostgreSQL provides a set of predefined roles that provide access to certain, commonly needed, privileged capabilities and information. Administrators (including roles that have the `CREATEROLE` privilege) can `GRANT` these roles to users and/or other roles in their environment, providing those users with access to the specified capabilities and information.

The predefined roles are described in [Table 22.1](predefined-roles.html#PREDEFINED-ROLES-TABLE "Table 22.1. Predefined Roles"). Note that the specific permissions for each of the roles may change in the future as additional capabilities are added. Administrators should monitor the release notes for changes.

**Table 22.1. Predefined Roles**

| Role                           | Allowed Access                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| pg\_read\_all\_data            | Read all data (tables, views, sequences), as if having `SELECT` rights on those objects, and USAGE rights on all schemas, even without having it explicitly. This role does not have the role attribute `BYPASSRLS` set. If RLS is being used, an administrator may wish to set `BYPASSRLS` on roles which this role is GRANTed to.                          |
| pg\_write\_all\_data           | Write all data (tables, views, sequences), as if having `INSERT`, `UPDATE`, and `DELETE` rights on those objects, and USAGE rights on all schemas, even without having it explicitly. This role does not have the role attribute `BYPASSRLS` set. If RLS is being used, an administrator may wish to set `BYPASSRLS` on roles which this role is GRANTed to. |
| pg\_read\_all\_settings        | Read all configuration variables, even those normally visible only to superusers.                                                                                                                                                                                                                                                                            |
| pg\_read\_all\_stats           | Read all pg\_stat\_\* views and use various statistics related extensions, even those normally visible only to superusers.                                                                                                                                                                                                                                   |
| pg\_stat\_scan\_tables         | Execute monitoring functions that may take `ACCESS SHARE` locks on tables, potentially for a long time.                                                                                                                                                                                                                                                      |
| pg\_monitor                    | Read/execute various monitoring views and functions. This role is a member of `pg_read_all_settings`, `pg_read_all_stats` and `pg_stat_scan_tables`.                                                                                                                                                                                                         |
| pg\_database\_owner            | None. Membership consists, implicitly, of the current database owner.                                                                                                                                                                                                                                                                                        |
| pg\_signal\_backend            | Signal another backend to cancel a query or terminate its session.                                                                                                                                                                                                                                                                                           |
| pg\_read\_server\_files        | Allow reading files from any location the database can access on the server with COPY and other file-access functions.                                                                                                                                                                                                                                       |
| pg\_write\_server\_files       | Allow writing to files in any location the database can access on the server with COPY and other file-access functions.                                                                                                                                                                                                                                      |
| pg\_execute\_server\_program   | Allow executing programs on the database server as the user the database runs as with COPY and other functions which allow executing a server-side program.                                                                                                                                                                                                  |
| pg\_checkpoint                 | Allow executing the [`CHECKPOINT`](sql-checkpoint.html "CHECKPOINT") command.                                                                                                                                                                                                                                                                                |
| pg\_use\_reserved\_connections | Allow use of connection slots reserved via [reserved\_connections](runtime-config-connection.html#GUC-RESERVED-CONNECTIONS).                                                                                                                                                                                                                                 |
| pg\_create\_subscription       | Allow users with `CREATE` permission on the database to issue [`CREATE SUBSCRIPTION`](sql-createsubscription.html "CREATE SUBSCRIPTION").                                                                                                                                                                                                                    |

\


The `pg_monitor`, `pg_read_all_settings`, `pg_read_all_stats` and `pg_stat_scan_tables` roles are intended to allow administrators to easily configure a role for the purpose of monitoring the database server. They grant a set of common privileges allowing the role to read various useful configuration settings, statistics and other system information normally restricted to superusers.

The `pg_database_owner` role has one implicit, situation-dependent member, namely the owner of the current database. Like any role, it can own objects or receive grants of access privileges. Consequently, once `pg_database_owner` has rights within a template database, each owner of a database instantiated from that template will exercise those rights. `pg_database_owner` cannot be a member of any role, and it cannot have non-implicit members. Initially, this role owns the `public` schema, so each database owner governs local use of the schema.

The `pg_signal_backend` role is intended to allow administrators to enable trusted, but non-superuser, roles to send signals to other backends. Currently this role enables sending of signals for canceling a query on another backend or terminating its session. A user granted this role cannot however send signals to a backend owned by a superuser. See [Section 9.27.2](functions-admin.html#FUNCTIONS-ADMIN-SIGNAL "9.27.2. Server Signaling Functions").

The `pg_read_server_files`, `pg_write_server_files` and `pg_execute_server_program` roles are intended to allow administrators to have trusted, but non-superuser, roles which are able to access files and run programs on the database server as the user the database runs as. As these roles are able to access any file on the server file system, they bypass all database-level permission checks when accessing files directly and they could be used to gain superuser-level access, therefore great care should be taken when granting these roles to users.

Care should be taken when granting these roles to ensure they are only used where needed and with the understanding that these roles grant access to privileged information.

Administrators can grant access to these roles to users using the [`GRANT`](sql-grant.html "GRANT") command, for example:

```

GRANT pg_signal_backend TO admin_user;
```

***

|                                                   |                                                       |                                                        |
| :------------------------------------------------ | :---------------------------------------------------: | -----------------------------------------------------: |
| [Prev](role-removal.html "22.4. Dropping Roles")  |   [Up](user-manag.html "Chapter 22. Database Roles")  |  [Next](perm-functions.html "22.6. Function Security") |
| 22.4. Dropping Roles                              | [Home](index.html "PostgreSQL 17devel Documentation") |                                22.6. Function Security |
