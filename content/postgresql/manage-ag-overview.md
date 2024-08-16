[#id](#MANAGE-AG-OVERVIEW)

## 23.1. Overview [#](#MANAGE-AG-OVERVIEW)

A small number of objects, like role, database, and tablespace names, are defined at the cluster level and stored in the `pg_global` tablespace. Inside the cluster are multiple databases, which are isolated from each other but can access cluster-level objects. Inside each database are multiple schemas, which contain objects like tables and functions. So the full hierarchy is: cluster, database, schema, table (or some other kind of object, such as a function).

When connecting to the database server, a client must specify the database name in its connection request. It is not possible to access more than one database per connection. However, clients can open multiple connections to the same database, or different databases. Database-level security has two components: access control (see [Section 21.1](auth-pg-hba-conf)), managed at the connection level, and authorization control (see [Section 5.7](ddl-priv)), managed via the grant system. Foreign data wrappers (see [postgres_fdw](postgres-fdw)) allow for objects within one database to act as proxies for objects in other database or clusters. The older dblink module (see [dblink](dblink)) provides a similar capability. By default, all users can connect to all databases using all connection methods.

If one PostgreSQL server cluster is planned to contain unrelated projects or users that should be, for the most part, unaware of each other, it is recommended to put them into separate databases and adjust authorizations and access controls accordingly. If the projects or users are interrelated, and thus should be able to use each other's resources, they should be put in the same database but probably into separate schemas; this provides a modular structure with namespace isolation and authorization control. More information about managing schemas is in [Section 5.9](ddl-schemas).

While multiple databases can be created within a single cluster, it is advised to consider carefully whether the benefits outweigh the risks and limitations. In particular, the impact that having a shared WAL (see [Chapter 30](wal)) has on backup and recovery options. While individual databases in the cluster are isolated when considered from the user's perspective, they are closely bound from the database administrator's point-of-view.

Databases are created with the `CREATE DATABASE` command (see [Section 23.2](manage-ag-createdb)) and destroyed with the `DROP DATABASE` command (see [Section 23.5](manage-ag-dropdb)). To determine the set of existing databases, examine the `pg_database` system catalog, for example

```
SELECT datname FROM pg_database;
```

The [psql](app-psql) program's `\l` meta-command and `-l` command-line option are also useful for listing the existing databases.

### Note

The SQL standard calls databases “catalogs”, but there is no difference in practice.
