---
title: Connect with psql
subtitle: Learn how to connect to Neon using psql
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/postgres
  - /docs/integrations/postgres
  - /docs/get-started-with-neon/query-with-psql-editor
updatedOn: '2024-07-25T12:53:42.418Z'
---

The following instructions require a working installation of [psql](https://www.postgresql.org/download/). The `psql` client is the native command-line client for Postgres. It provides an interactive session for sending commands to Postgres and running ad-hoc queries. For more information about `psql`, refer to the [psql reference](https://www.postgresql.org/docs/15/app-psql.html), in the _PostgreSQL Documentation_.

<Admonition type="note">
A Neon compute runs Postgres, which means that any Postgres application or standard utility such as `psql` is compatible with Neon. You can also use Postgres client libraries and drivers to connect. However, please be aware that some older client libraries and drivers, including older `psql` executables, are built without [Server Name Indication (SNI)](/docs/reference/glossary#sni) support and require a workaround. For more information, see [Connection errors](/docs/connect/connection-errors).

Neon also provides a passwordless auth feature that uses `psql`. For more information, see [Passwordless auth](/docs/connect/passwordless-connect).
</Admonition>

The easiest way to connect to Neon using `psql` is with a connection string.

You can obtain a connection string from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a role, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

From your terminal or command prompt, run the `psql` client with the connection string copied from the Neon **Dashboard**.

```bash shouldWrap
psql postgresql://[user]:[password]@[neon_hostname]/[dbname]
```

<Admonition type="note">
Neon requires that all connections use SSL/TLS encryption, but you can increase the level of protection by appending an `sslmode` parameter setting to your connection string. For instructions, see [Connect to Neon securely](/docs/connect/connect-securely).
</Admonition>

## Where do I obtain a password?

You can obtain a Neon connection string with your password from the Neon **Dashboard**, under **Connection Details**.

## What port does Neon use?

Neon uses the default Postgres port, `5432`. If you need to specify the port in your connection string, you can do so as follows:

```bash shouldWrap
psql postgresql://[user]:[password]@[neon_hostname][:port]/[dbname]
```

## Running queries

After establishing a connection, try running the following queries:

```sql
CREATE TABLE my_table AS SELECT now();
SELECT * FROM my_table;
```

The following result set is returned:

```sql
SELECT 1
              now
-------------------------------
 2022-09-11 23:12:15.083565+00
(1 row)
```

<NeedHelp/>
