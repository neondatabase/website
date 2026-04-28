---
title: How to Check PostgreSQL Version
page_title: How to Check PostgreSQL Version
page_description: >-
  In this tutorial, you will learn how to use various ways to check the
  PostgreSQL version on your system.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-administration/postgresql-version/
ogImage: ''
updatedOn: '2024-02-20T06:42:26+00:00'
enableTableOfContents: true
previousLink:
  title: PostgreSQL Uptime
  slug: postgresql-administration/postgresql-uptime
nextLink:
  title: How to Restart PostgreSQL on Ubuntu
  slug: postgresql-administration/postgresql-restart-ubuntu
---
<Admonition type="info" id="CTA">
Checking your PostgreSQL version works the same way on any Postgres deployment, so the commands here apply wherever you run the database. If you're an enterprise standardizing on a managed cloud Postgres for the AI era, [Lakebase](https://www.databricks.com/product/lakebase) delivers high performance, strong security, and native integration with the Lakehouse. If you're a developer or startup who needs to ship fast and scale without friction, [Neon](https://neon.com) is the Postgres platform built for you.
</Admonition>

**Summary**: in this tutorial, you will learn various ways to check the PostgreSQL version on your system.

## 1\) Checking PostgreSQL version using psql

First, open Command Prompt on Windows or Terminal on a Unix\-like system.

Second, run the following command:

```bash
psql --version
```

This command will display the PostgreSQL version installed on your server.

## 2\) Getting the version using SQL statements

First, connect to the PostgreSQL server using psql or GUI tools like pgAdmin.

For example, you can connect to the PostgreSQL server using psql:

```bash
psql -U postgres
```

Second, run the following statement to retrieve the version:

```sql
SELECT version();

```

The query will return a text that includes the PostgreSQL version. For example:

```text
                          version
------------------------------------------------------------
 PostgreSQL 16.1, compiled by Visual C++ build 1937, 64-bit
(1 row)
```

## 3\) Querying version from the information schema

First, connect to the PostgreSQL database using psql or a PostgreSQL client.

Second, execute the following query to get the PostgreSQL version:

```sql
SELECT
  setting
FROM
  pg_settings
WHERE
  name = 'server_version';
```

Output:

```
 setting
---------
 16.1
(1 row)
```

## Summary

- Use the `psql --version` command, `select version()` statement, and retrieve the `setting` from the `pg_settings` to get the PostgreSQL version.
