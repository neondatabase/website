---
title: Connect with pgcli
enableTableOfContents: true
isDraft: true
---

The following instructions require a working installation of [pgcli](https://www.pgcli.com/). The `pgcli` client is an alternative command-line client for PostgreSQL with an auto-completing interactive interface. It offers additional features such as syntax highlighting, smart completion, and query history. For more information about `pgcli`, refer to the [pgcli documentation](https://www.pgcli.com/docs).

The easiest way to connect to Neon using the `pgcli` client is with a Neon connection string.
You can obtain a connection string from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a role, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

From your terminal or command prompt, run the `psql` client with the connection string copied from the Neon **Dashboard**, but be sure to add your password, as shown:

```bash
pgcli postgres://daniel:<password>@ep-restless-rice.us-east-2.aws.neon.tech/neondb
```

## Where do I obtain a password?

You can obtain a Neon connection string with your password from the Neon **Dashboard**, under **Connection Details**.

## What port does Neon use?

Neon uses the default PostgreSQL port, `5432`. If you need to specify the port in your connection string, you can do so as follows:

```bash
pgcli postgres://daniel:<password>@ep-restless-rice.us-east-2.aws.neon.tech:5432/neondb
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

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
