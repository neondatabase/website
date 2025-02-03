---
title: Connect from any application
subtitle: Learn how to connect to Neon from any application
enableTableOfContents: true
updatedOn: '2024-10-09T22:51:39.818Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>Where to find database connections details</p>
<p>Where to find example connection snippets</p>
<p>Protocols supported by Neon</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/connect/choose-connection">Choosing a driver and connection type</a>
<a href="/docs/connect/connect-securely">Connect to Neon securely</a>
<a href="/docs/connect/connection-pooling">Connection pooling</a>
<a href="/docs/connect/query-with-psql-editor">Connect with psql</a>
</DocsList>
</InfoBlock>

## Database connection details

When connecting to Neon from an application or client, you connect to a database in your Neon project. In Neon, a database belongs to a branch, which may be the default branch of your project (`main`) or a child branch.

You can find the connection details for your database by clicking the **Connect** button on your **Project Dashboard**. This opens the **Connect to your database** modal. Select a branch, a compute, a database, and a role. A connection string is constructed for you.

![Connection details modal](/docs/connect/connection_details.png)

Neon supports both pooled and direct connections to your database. Neon's connection pooler supports a higher number of concurrent connections, so we provide pooled connection details in the in the the **Connect to your database** modal by default, which adds a `-pooler` option to your connection string. If needed, you can get direct database connection details from the modal disabling the **Connection pooling** toggle. For more information about pooled connections, see [Connection pooling](/docs/connect/connection-pooling#connection-pooling).

A Neon connection string includes the role, password, hostname, and database name.

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
             ^    ^         ^                         ^                              ^
       role -|    |         |- hostname               |- pooler option               |- database
                  |
                  |- password
```

<Admonition type="note">
The hostname includes the ID of the compute, which has an `ep-` prefix: `ep-cool-darkness-123456`. For more information about Neon connection strings, see [connection string](/docs/reference/glossary#connection-string).
</Admonition>

You can use the details from the the **Connect to your database** modal to configure your database connection. For example, you might place the connection details in an `.env` file, assign the connection string to a variable, or pass the connection string on the command-line.

**.env file**

```text
PGHOST=ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech
PGDATABASE=dbname
PGUSER=alex
PGPASSWORD=AbC123dEf
PGPORT=5432
```

**Variable**

```text shouldWrap
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

**Command-line**

```bash shouldWrap
psql postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

<Admonition type="note">
Neon requires that all connections use SSL/TLS encryption, but you can increase the level of protection by configuring the `sslmode` option. For more information, see [Connect to Neon securely](/docs/connect/connect-securely).
</Admonition>

## Where can I find my password?

It's included in your Neon connection string. Click the **Connection** button on your **Project Dashboard** to open the **Connect to your database** modal.

## What port does Neon use?

Neon uses the default Postgres port, `5432`.

## Connection examples

The **Connect to your database** modal provides connection examples for different frameworks and languages, constructed for the branch, database, and role that you select.

![Language and framework connection examples](/docs/connect/code_connection_examples.png)

See our [frameworks](/docs/get-started-with-neon/frameworks) and [languages](/docs/get-started-with-neon/languages) guides for more connection examples.

## Network protocol support

Neon projects provisioned on AWS support both [IPv4](https://en.wikipedia.org/wiki/Internet_Protocol_version_4) and [IPv6](https://en.wikipedia.org/wiki/IPv6) addresses. Neon projects provisioned on Azure support IPv4.

Additionally, Neon provides a low-latency serverless driver that supports connections over WebSockets and HTTP. Great for serverless or edge environments where connections over TCP may not be not supported. For further information, refer to our [Neon serverless driver](/docs/serverless/serverless-driver) documentation.

## Connection notes

- Some older Postgres client libraries and drivers, including older `psql` executables, are built without [Server Name Indication (SNI)](/docs/reference/glossary#sni) support, which means that a connection workaround may be required. For more information, see [Connection errors: The endpoint ID is not specified](/docs/connect/connection-errors#the-endpoint-id-is-not-specified).
- Some Java-based tools that use the pgJDBC driver for connecting to Postgres, such as DBeaver, DataGrip, and CLion, do not support including a role name and password in a database connection string or URL field. When you find that a connection string is not accepted, try entering the database name, role, and password values in the appropriate fields in the tool's connection UI when configuring a connection to Neon. For examples, see [Connect a GUI or IDE](/docs/connect/connect-postgres-gui#connect-to-the-database).

<NeedHelp/>
