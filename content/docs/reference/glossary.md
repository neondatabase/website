---
title: Glossary
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/glossary
  - /docs/cloud/concepts/
---

## A

<a id="access-token">Access token</a>

See [Token](/docs/reference/glossary/#token).

<a id="activity-monitor">Activity Monitor</a>

A processes that monitors a Neon Compute for activity. During periods of inactivity, the Activity Monitor gracefully places the Compute into an idle state to save energy and resources. The Activity Monitor closes idle connections after 5 minutes of complete inactivity. When a connection is made to an idle Compute, the Activity Monitor automatically reactivates the Compute.

<a id="api">API</a> 

See [Neon API](/docs/reference/glossary/#neon-api).

<a id="api-key">API Key</a>

A unique identifier used to authenticate a user or calling program to an API. An API key is required to authenticate to the Neon API. For more information, see [Using API keys](/docs/get-started-with-neon/using-api-keys/).

## B

<a id="branches-coming-soon/"></a>

<a id="branch">Branch</a>

A copy of Project data created from a current or past state. A branch can be independently modified from its originating Project data. See [Branching](/docs/conceptual-guides/branching/).

## C

<a id="ci-cd">CI/CD</a>

Continuous integration and continuous delivery or continuous deployment.

<a id="connection-pooling">Connection pooling</a>

A method of creating a pool of connections and caching those connections for reuse. Neon uses `pgbouncer` in `transaction mode` for connection pooling. Neon’s connection pooling feature can be enabled or disabled for a Project on the **Settings** tab, under **General Settings**.

<a id="control-plane">Control Plane</a>

A part of the Neon architecture that manages cloud storage and compute resources.

<a id="compute">Compute</a>

A service that provides virtualized computing resources (CPU, memory, and storage) for running applications. A Neon Compute runs PostgreSQL. Each Neon Project contains a Compute. The amount of Compute resources available to a Neon Project is currently subject to the limits defined by the Technical Preview Free Tier. A Neon Compute is stateless and is automatically activated or suspended based on user activity.

<a id="connection-pstring">Connection String</a>

A string containing details for connecting to a Neon Project. The details include a user name, Project ID, host address, port number, and database name; for example:

```terminal
postgres://user1@black-sky-342827.cloud.neon.tech:5432/main`.
```

The connection string for a Neon Project is provided on the **Dashboard** tab in the Neon Console, under **Connection Details**. The connection string displayed that is displayed immediately after creating a Project also includes the user’s password, temporarily. For security, the password is removed from the connection string after navigating away from the Dashboard.

<a id="console">Console</a>

See [Neon Console](/docs/reference/glossary/#neon-console).

<a id="copy-on-write">Copy-on-write</a>

A technique used to efficiently copy data. Neon uses the copy-on-write technique to efficiently copy Project data when creating a branch.

## D

<a id="database">Database</a>

A named collection of database objects. A Neon Project has a default database named main which resides in the default public schema. A Neon Project can contain multiple databases. Users cannot manipulate system databases, such as `postgres`, `template0`, or `template1`.

## F

<a id="free-tier">Free Tier</a>

A Neon service tier for which there are no usage charges. For information about Neon’s Free Tier and associated limits, see [Technical Preview Free Tier](/docs/reference/technical-preview-free-tier/).

## L

<a id="lsn">LSN</a>

Log Sequence Number. A byte offset to a location inside the WAL stream.

## N

<a id="neon">Neon</a>

A fully managed serverless PostgreSQL. Neon separates storage and compute and offers modern developer features such as branching and bottomless storage. For more information, see [What is Neon?](https://neon.tech/docs/cloud/about/).

<a id="neon-api">Neon API</a>

The Neon RESTful Application Programming Interface. Any operation performed in the Neon Console can also be performed using the Neon API.

<a id="neon-console">Neon Console</a>

A browser-based graphical interface for managing Neon Projects and resources.s

<a id="neon-user">Neon user</a>

The user that registers and authenticates with Neon using a GitHub or Google account. Once authenticated, a Neon user can create and access Projects, and manage users, databases, and other Project resources.

## O

<a id="object-storage">Object storage</a>

Computer data storage that manages data as objects. Neon uses cloud object storage for long-term data storage.

## P

<a id="page">Page</a>

An 8KB unit of data, which is the smallest unit that PostgreSQL uses for storing relations and indexes on disk. In Neon, a page is also the smallest unit of data that resides on a Pageserver. For information about PostgreSQL page format, see [Database Page Layout](https://www.postgresql.org/docs/14/storage-page-layout.html), in the _PostgreSQL Documentation_.

<a id="page-server">Page Server</a>

A Neon architecture component that reads WAL records from Safekeepers to identify modified pages. The Pageserver accumulates and indexes incoming WAL records in memory and writes them to disk in batches. Each batch is written to an immutable file that is never modified after creation. Using these files, the Pageserver can quickly reconstruct any version of a page dating back to the user-defined retention period.

The Pageserver uploads the immutable files to cloud storage, which is the final  destination for data and considered to be a highly durable store. Once a file is successfully uploaded to cloud storage, the corresponding WAL records can be removed from the Safekeepers.

<a id="passwordless-authentication">Passwordless authentication</a>

The ability to authenticate without providing a password. Neon’s Quick auth feature supports passwordless authentication.  

<a id="postgresql-user">PostgreSQL user</a>

Two PostgreSQL users are created with each Neon Project. The first is named for the registered Neon account and can be used to access the Neon Project from a client. This user’s credentials can be managed and used for password-based `psql` authentication. The second user is the web-access system user, which is used by the SQL Editor and Neon’s Quick auth feature. The web-access user is system managed. It cannot be modified, removed, or used in other authentication scenarios.

Additional PostgreSQL users can be created in the Neon Console.

<a id="project">Project</a>

A collection of PostgreSQL databases, PostgreSQL users, and other Project resources and settings. A Project contains a Compute with a PostgreSQL server as well as storage for the Project data. 

<a id="proxy">Proxy</a>

A multitenant service that accepts and handles connections from clients that use the PostgreSQL protocol.

## Q

<a id="quick-auth">Quick auth</a>

A passwordless authentication feature that allows users to connect to a Neon Project  with a single psql command. See [Query with psql](/docs/get-started-with-neon/query-with-psql-editor/).

## R

<a id="regular-postgresql">Regular PostgreSQL</a>

Refers to the standard PostgreSQL open-source database system, maintained by the [PostgreSQL project](https://www.postgresql.org/).

## S

<a id="safekeeper">Safekeeper</a>

A Neon architecture component responsible for durability of database changes. PostgreSQL streams WAL records to Safekeepers, and a quorum algorithm based on Paxos ensures that when a transaction is acknowledged as committed, it is stored on a majority of Safekeepers and can be recovered if a node is lost. Safekeepers are deployed in different availability zones to ensure high availability and durability.

<a id="serverless">Serverless</a>

A cloud-based development model that enables developing and running applications without having to manage servers.

<a id="regular-postgresql">SNI</a>

Server Name Indication. A TLS protocol extension that allows a client or browser to indicate which hostname it wants to connect to at the beginning of a TLS handshake.

<a id="sql-editor">SQL Editor</a>

A feature of the Neon Console that enables running queries on a Neon Project database. The SQL Editor also enables saving queries, viewing query history, and analyzing or explaining queries.

<a id="storage">Storage</a>

Where data is recorded and stored.

Also see [Object storage](/docs/reference/glossary/#object-storage).

## T

<a id="technical-preview">Technical Preview</a>

A preview of Neon during which users are able to try Neon's Free Tier. For more information, see [Technical Preview Free Tier](/docs/reference/technical-preview-free-tier/).

<a id="token">Token</a>

An encrypted access token that enables users to authenticate with Neon using the Neon API. An access token is generated when creating a Neon API key. For more information, see [Using API keys](https://neon.tech/docs/get-started-with-neon/using-api-keys/).

## U

<a id="user">User</a>

See [Neon user](/docs/reference/glossary/#neon-user) and [PostgreSQL user](/docs/reference/glossary/#postgresql-user).

## V

<a id="vanilla-postgresql">Vanilla PostgreSQL</a>

Refers to the standard PostgreSQL open-source database system, maintained by the [PostgreSQL project](https://www.postgresql.org/). 

## W

<a id="wal">WAL</a>

Write-Ahead Logging (WAL). A standard method for ensuring data integrity. Neon relies on WAL to separate storage and compute.

<a id="wal-slice">WAL slice</a>

Write-ahead logs in a specific LSN range.

<a id="was-stream">WAL stream</a>

The stream of data that is written to the Write-Ahead Log (WAL) during transactional processing.