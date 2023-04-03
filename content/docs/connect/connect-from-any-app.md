---
title: Connect from any application
enableTableOfContents: true
---
When connecting to Neon from an application or client, you connect to a database in your Neon project. In Neon, a database belongs to a branch, which may be the primary branch of your project (`main`) or a child branch. The primary branch in a Neon project is created with a default database named `neondb`.

To connect to a database, you must connect to the branch where the database resides, and you must do so by connecting through a compute endpoint associated with the branch.

```text
Project
    |----primary branch (main) ---- compute endpoint <--- application/client
             |    |
             |    |---- database (neondb)
             |
             ---- child branch ---- compute endpoint <--- application/client
                            |
                            |---- database (mydb)  
```

You can obtain the connection details you require from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a role, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

A Neon connection string includes the role, the compute endpoint hostname, and the database name.

```text
postgres://daniel:<password>@ep-restless-rice.us-east-2.aws.neon.tech/neondb
             ^                          ^                               ^
             |- <role>                  |- <hostname>                   |- <database>
```

You can use the details from the connection string or the connection string itself to configure a connection. For example, you might place the connection details in an `.env` file, assign the connection string to a variable, or pass the connection string on the command-line, as shown:

`.env` file:

```text
PGHOST='ep-restless-rice.us-east-2.aws.neon.tech'
PGDATABASE='neondb'
PGUSER='daniel'
PGPASSWORD='<password>'
PGPORT='5432'
```

Variable:

```text
DATABASE_URL="postgres://daniel:<password>@ep-restless-rice.us-east-2.aws.neon.tech:5432/neondb"
```

Command-line:

```bash
psql postgres://daniel:<password>@ep-restless-rice.us-east-2.aws.neon.tech/neondb
```

<Admonition type="note">
Neon requires that all connections use SSL/TLS encryption, but you can increase the level of protection by appending an `sslmode` parameter setting to your connection string. For instructions, see [Connect to Neon securely](/docs/connect/connect-securely).

Please be aware that some older client libraries and drivers, including older `psql` executables, are built without SNI support and require a workaround. For more information, see [Connect from older clients](/docs/connect/connectivity-issues).
For information about connecting with `psql`, see [Connect with psql](/docs/connect/query-with-psql-editor). Please be aware that some older client libraries and drivers, including older `psql` executables, are built without [Server Name Indication (SNI)](/docs/reference/glossary#sni) support and require a workaround. For more information, see [Connect from older clients](/docs/connect/connectivity-issues).

Some Java-based tools that use the pgJDBC driver for connecting to PostgreSQL, such as DBeaver, DataGrip, and CLion, do not support including a role name and password in a database connection string. When you find that a connection string is not accepted, try entering the role name and password values in the appropriate fields in the tool's UI when configuring a connection to Neon.

Certain applications and clients may require or disallow connection pooling. Neon supports both pooled and non-pooled connection strings. For more information, see [Connection pooling](/docs/connect/connection-pooling#connection-pooling).
</Admonition>

## Where do I obtain a password?

You can obtain a Neon connection string with your password from the Neon **Dashboard**, under **Connection Details**.

## What port does Neon use?

Neon uses the default PostgreSQL port, `5432`.

## Connection examples

The **Connection Details** widget on the **Neon Dashboard** also provides connection examples for different programming languages and application frameworks, constructed for the branch, database, and role that you select. Click **connection examples**  in the **Connection Details** widget to view or copy the examples.

![Connection details widget](/docs/connect/code_connection_examples.png)

Our *Guides* documentation also provides connection examples.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
