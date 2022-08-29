---
title: Import an Existing Database
redirectFrom:
  - /docs/cloud/tutorials
---

Migrating an existing Postgres database to Neon can be done almost in the same way
as copying database from one server to another. Postgres provides several ways to do it.

The most straightforward and efficient is to use the `pg_dump` utility:

```bash
pg_dump -h HOST -U USER DBNAME | psql -h pg.neon.tech
```

In this command, replace `HOST`, `USER`, and `DBNAME` with the appropriate values for the database you are importing into neon.

You may need to make `pg_dump` to create data in non-plain-text format.

In this case `pg_restore` utility should be used instead of `psql`.

Please notice that Neon is not able to create databases. So you can not use `pg_dumpall` or
`pg_dump` with `-C` option. If you have multiple databases in the Project you are migrating, you will have to migrate each database separately.

Since `pg_dump` dumps a single database, it doesn't include information about roles that are stored in the global pg_authid catalog. Also Neon doesn't allow you to create users and roles through psql, you can only do it through UI. If you have not created roles in the UI before importing the schema, you will get multiple "role does not exist" errors when import. This warning can be ignored: data will be imported in any case.

You can also configure logical replication to let Neon receive stream of updates from an existing system.

Please note that some of Postgres features that require access to the local file system are not supported by Neon. For example tablespaces, large objects. Please take it in account when migrating an existing database schema to Neon.

You can definitely copy not only the whole database, but also particular tables. It can be done using `COPY` command in the same way as populating table in vanilla Postgres. The only specific of Neon is that populated data is transferred through replication stream and so may affect speed of execution of some other queries even not related with this table.
