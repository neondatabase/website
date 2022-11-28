---
title: Connect from any application
enableTableOfContents: true
---
When connecting to Neon from an application or client, you will need to connect to a database in your Neon project. In Neon, a database belongs to a branch, which may the root branch of your project (`main`) or a child branch.

In order to connect to a database, you must connect to the branch where the database resides, and you must do so by connecting through an endpoint, which is the compute instance associated with the branch.

```text
Project
    |----root branch (main) ---- endpoint (compute) <--- application/client
             |    |
             |    |---- database (main)
             |
             ---- child branch ---- endpoint (compute) <--- application/client
                            |
                            |---- database (mydb)  
```

You can obtain the connection details for a database from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](./images/connection_details.png)

The details from the connection string or the connection string itself can be used configure a connection. For example, connection details might be placed in an `.env` file, assigned to a variable, or passed on the command-line. Given the following connection string, an `.env` file, a variable, or a client command-line string can be configured as shown.

Connection string:

```text
postgres://casey@ep-polished-water-579720.us-east-2.aws.neon.tech/main
             ^                       ^                              ^
             |- <user>               |- <endpoint_hostname>         |- <database>
```

`.env` file:

```text
PGHOST='ep-polished-water-579720.us-east-2.aws.neon.tech'
PGDATABASE='main'
PGUSER='casey'
PGPASSWORD='<password>'
PGPORT='5432'
```

Variable:

```text
DATABASE_URL="postgres://casey:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech:5432/main"
```

Command-line:

```bash
psql postgres://casey:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech:5432/main
```

For more information about connecting using `psql`, see [Connect with psql](../query-with-psql-editor).

## Where do I obtain a password?

The connection string on the Neon **Dashboard** only includes a password immediately after you create a project. The password no longer appears in the connection string once you navigate away from the Neon Console or refresh the browser. If you have misplaced your password, refer to [Users](tbd) for password reset instructions.

## What port does Neon use?

Neon uses the default PostgreSQL port, `5432`.

## Connection examples

The **Connection Details** widget on the **Neon Dashboard** provides connection examples for different languages and frameworks, constructed for the branch, database, and user that you select. Click **connection examples**  in the **Connection Details** widget to view or copy them.

![Connection details widget](./images/code_connection_examples.png)

Connection examples for various languages and frameworks are also provided in our *Guides* section.
