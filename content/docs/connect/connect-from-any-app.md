---
title: Connect from any application
subtitle: Learn how to connect to Neon from any application
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

Neon supports pooled and direct connections to the database. Use a pooled connection string if your application uses a high number of concurrent connections. For more information, see [Connection pooling](/docs/connect/connection-pooling#connection-pooling).

A Neon connection string includes the role, the compute endpoint hostname, and the database name.

```text
postgres://daniel:<password>@ep-damp-cell-18160816.us-east-2.aws.neon.tech/neondb
             ^                                ^                              ^
             |- <role>                        |- <hostname>                  |- <database>
```

<Admonition type="note">
The hostname includes the ID of the compute endpoint, which has an `ep-` prefix: `ep-damp-cell-18160816`. For more information about Neon connection strings, see [Connection string](/docs/reference/glossary#connection-string).
</Admonition>

You can use the details from the connection string or the connection string itself to configure a connection. For example, you might place the connection details in an `.env` file, assign the connection string to a variable, or pass the connection string on the command-line, as shown:

`.env` file:

```text
PGHOST='ep-damp-cell-18160816.us-east-2.aws.neon.tech'
PGDATABASE='neondb'
PGUSER='daniel'
PGPASSWORD='<password>'
PGPORT='5432'
```

Variable:

<CodeBlock shouldWrap>

```text
DATABASE_URL="postgres://daniel:<password>@ep-damp-cell-18160816.us-east-2.aws.neon.tech/neondb"
```

</CodeBlock>

Command-line:

<CodeBlock shouldWrap>

```bash
psql postgres://daniel:<password>@ep-damp-cell-18160816.us-east-2.aws.neon.tech/neondb
```

</CodeBlock>

<Admonition type="note">
Neon requires that all connections use SSL/TLS encryption, but you can increase the level of protection by appending an `sslmode` parameter setting to your connection string. For instructions, see [Connect to Neon securely](/docs/connect/connect-securely).
</Admonition>

## Where do I obtain a password?

You can obtain a Neon connection string with your password from the Neon **Dashboard**, under **Connection Details**.

## What port does Neon use?

Neon uses the default Postgres port, `5432`.

## Connection examples

The **Connection Details** widget on the **Neon Dashboard** also provides connection examples for different programming languages and application frameworks, constructed for the branch, database, and role that you select. Click **connection examples**  in the **Connection Details** widget to view or copy the examples.

![Language and framework connection examples](/docs/connect/code_connection_examples.png)

Our *Guides* documentation also provides connection examples.

## Network protocol support

Neon currently supports **IPv4**. Support for other network protocols, including IPv6, is **not available** at this time.

## Connection notes

- Some older client libraries and drivers, including older `psql` executables, are built without [Server Name Indication (SNI)](/docs/reference/glossary#sni) support and require a workaround. For more information, see [Connection errors](/docs/connect/connection-errors).
- Some Java-based tools that use the pgJDBC driver for connecting to Postgres, such as DBeaver, DataGrip, and CLion, do not support including a role name and password in a database connection string or URL field. When you find that a connection string is not accepted, try entering the database name, role, and password values in the appropriate fields in the tool's connection UI when configuring a connection to Neon. For an example, see [Connect a GUI or IDE](/docs/connect/connect-postgres-gui#connect-to-the-database).

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
