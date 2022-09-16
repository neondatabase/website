---
title: Import an Existing Database
redirectFrom:
  - /docs/cloud/tutorials
---

Importing an existing PostgreSQL database to Neon can be done in almost the same way
as copying a database from one server to another. PostgreSQL provides several import methods.
The most efficient and straightforward method is using the `pg_dump` utility.

```bash
pg_dump -h <host> -U <username> <dbname> | psql -h pg.neon.tech
```

In the `pg_dump` command shown above, replace `<host>`, `<user>`, and `<dbname>` with the appropriate values for the database you are importing.

**_Note_**: If you create an archive using `pg_dump` that is in a non-plain-text format, use the `pg_restore` utility instead of `psql` to restore the database to Neon.

Neon is not able to create databases, so you can not use `pg_dumpall` or
`pg_dump` with the `-C` option. If there are multiple databases in the project that you want to import, you must migrate each database separately.

Because `pg_dump` dumps a single database, it does not include information about roles that are stored in the global `pg_authid` catalog. Also, Neon does not support creating users or roles using `psql`. Those can only be created using the Neon Console. If you do not create roles in Neon before importing a database that has roles, you will receive "role does not exist" errors during the import operation. You can ignore this warning. It does not prevent data from being imported.

You can also configure logical replication to allow Neon to receive a stream of updates from an existing system.

Some PostgreSQL features that require access to the local file system are not supported by Neon. For example, tablespaces and large objects are not supported. Please take this into account when importing an existing database to Neon.

In addition to databases, Neon supports importing individual tables. You can do this using the `COPY` command, as you would in vanilla PostgreSQL. The only requirement is that the data is transferred through a replication stream, which may affect the performance of other queries, including those unrelated to the table you are copying.

For information about the commands referred to in this topic, refer to the following topics in the PostgreSQL documentation:

- [pgdump](https://www.postgresql.org/docs/14/app-pgdump.html)
- [pg_restore](https://www.postgresql.org/docs/14/app-pgrestore.html)
- [psql](https://www.postgresql.org/docs/14/app-psql.html)
- [COPY](https://www.postgresql.org/docs/14/sql-copy.html)
