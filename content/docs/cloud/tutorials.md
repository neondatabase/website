---
title: Tutorials
---

## Import an existing database to Neon Cloud Service

Migration of existed Postgres database to Neon can be done almost in the same way

as copying database from one server to another. Postgres provides several ways to do it.

The most straightforward and efficient is to use `pg_dump` utility:

```bash
pg_dump -h HOST-U USER DBNAME|psql -h start.neon.tech -U username@neon main
```

You may need to make `pg_dump` to create data in non-plain-text format.

In this case `pg_restore` utility should be used instead of `psql`.

Please notice that Neon is not able to create databases. So you can not use `pg_dumpall` or

`pg_dump` with `-C` option. If you have multiple databases in the Project you going to migrate, then you will have to migrate each database separately.

Since `pg_dump`` dumps a single database, it doesn't include information about roles which are stored in the global pg_authid catalog. Also Neon doesn't allow to create users and roles through psql, you can only do it through UI. If you have not done it, then while importing you will get multiple "role does not exist" exists. This warning can be ignored: data will be imported in any case.

You can also configure logical replication to let Neon receive stream of updates from existed system.

Please notice that some of Postgres features, requiring access to the local files system, are not supported by Neon. For example tablespaces, large objects. Please take it in account when migrating existed database schema to Neon.

You can definitely copy not only the whole database, but also particular tables. It can be done using `COPY` command in the same way as populating table in vanilla Postgres. The only specific of Neon is that populated data is transferred through replication stream and so may affect speed of execution of some other queries even not related with this table.

## Query via UI

In console ([https://console.neon.tech/](https://console.neon.tech/)) select your Project to see the Project details.

Select the SQL Editor tab.

Paste a query

```postgresql
create table t (c int);
insert into t select generate_series(1,100);
select count(*) from t;
```

Click run button to see the results.

## Query with psql

To follow this guide you will need a working install of [psql](https://www.postgresql.org/download/), PostgreSQL interactive terminal.

In the console go to the Project Dashboard, click “Generate Token” button, follow instructions to save the password into .pgpass file

Copy the connection string and run it in the shell:

```bash
psql -h start.neon.tech -U username@neon main
```

Run a simple query:

```postgresql
create my_table as select now();
select * from my_table;
```

## Quick connect with github single-sign on

```bash
psql -h start.neon.tech
```

The above command connects to your Project called 'main'. If it doesn't already exist, it is created. The "main" Project is a great way to get started. However, before moving to production, it is recommended to create a separate Project for each application.

By default, psql connects to a database with the same name as your OS username. For example, if your OS username is "alice", the above command will connect to a database called "alice".

To connect to a different Project:

```bash
psql -h <project>.start.neon.tech
```
