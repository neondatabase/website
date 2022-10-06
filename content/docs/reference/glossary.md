---
title: Glossary
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/glossary
  - /docs/cloud/concepts/
---

### Access token

See [Token](#token).

### Activity Monitor

A process that monitors a Neon Compute for activity. During periods of inactivity, the Activity Monitor gracefully places the Compute into an idle state to save energy and resources. The Activity Monitor closes idle connections after 5 minutes of complete inactivity. When a connection is made to an idle Compute, the Activity Monitor reactivates the Compute.

### API 

See [Neon API](#neon-api).

### API Key

A unique identifier used to authenticate a user or a calling program to an API. An API key is required to authenticate to the Neon API. For more information, see [Using API keys](/docs/get-started-with-neon/using-api-keys/).

<a id="branches-coming-soon/"></a>

### Branch

A copy of a Neon project created from a current or past state. Project data is copied using the [copy-on-write](#copy-on-write) technique. The data in a branched project can be independently modified. See [Branching](/docs/conceptual-guides/branching/).

### CI/CD

Continuous integration and continuous delivery or continuous deployment.

### Compute

A service that provides virtualized computing resources (CPU, memory, and storage) for running applications. A Neon Compute runs PostgreSQL. Each Neon project contains a Compute. The amount of Compute resources available to a Neon project is currently subject to the limits defined by the Technical Preview Free Tier. A Neon Compute is stateless and is automatically activated or suspended based on user activity.

### Connection pooling

A method of creating a pool of connections and caching those connections for reuse. Neon uses `pgbouncer` in `transaction mode` for connection pooling. Neon’s connection pooling feature can be enabled or disabled for a project on the **Settings** tab, under **General Settings**.

### Connection string

A string containing details for connecting to a Neon project. The details include a user name, project ID, host address, port number, and database name; for example:

```terminal
postgres://user1@black-sky-342827.cloud.neon.tech:5432/main`
```

The connection string for a Neon project is provided on the **Dashboard** tab in the Neon Console, under **Connection Details**. The connection string that is displayed immediately after creating a project also includes the user’s password, temporarily. For security reasons, the password is removed from the connection string after navigating away from the Dashboard.

### Console

See [Neon Console](#neon-console).

### Control Plane

A part of the Neon architecture that manages cloud storage and compute resources.

### Copy-on-write

A technique used to efficiently copy data. Neon uses the copy-on-write technique to efficiently copy project data when creating a branch.

### Database

A named collection of database objects. A Neon project has a default database named main which resides in the default `public` schema. A Neon project can contain multiple databases. Users cannot manipulate system databases, such as `postgres`, `template0`, or `template1`.

### Free Tier

A Neon service tier for which there are no usage charges. For information about Neon’s Free Tier and associated limits, see [Technical Preview Free Tier](/docs/reference/technical-preview-free-tier/).

### LSN

Log Sequence Number. A byte offset to a location in the [WAL stream](#wal-stream).

### Neon

A fully managed serverless PostgreSQL. Neon separates storage and compute and offers modern developer features such as branching and bottomless storage. For more information, see [What is Neon?](https://neon.tech/docs/cloud/about/).

### Neon API

The Neon RESTful Application Programming Interface. Any operation performed in the Neon Console can also be performed using the Neon API.

### Neon Console

A browser-based graphical interface for managing Neon projects and resources.

### Neon user

The user that registers and authenticates with Neon using a GitHub or Google account. Once authenticated, a Neon user can create and access projects, and manage users, databases, and other project resources.

### Page

An 8KB unit of data, which is the smallest unit that PostgreSQL uses for storing relations and indexes on disk. In Neon, a page is also the smallest unit of data that resides on a Pageserver. For information about PostgreSQL page format, see [Database Page Layout](https://www.postgresql.org/docs/14/storage-page-layout.html), in the _PostgreSQL Documentation_.

### Pageserver

A Neon architecture component that reads WAL records from Safekeepers to identify modified pages. The Pageserver accumulates and indexes incoming WAL records in memory and writes them to disk in batches. Each batch is written to an immutable file that is never modified after creation. Using these files, the Pageserver can quickly reconstruct any version of a page dating back to the user-defined retention period.

The Pageserver uploads immutable files to cloud storage, which is the final, highly durable destination for data. Once a file is successfully uploaded to cloud storage, the corresponding WAL records can be removed from the Safekeepers.

### Passwordless authentication

The ability to authenticate without providing a password. Neon’s [Passwordless auth](#passwordless-auth) feature supports passwordless authentication.  

### PostgreSQL user

Two PostgreSQL database users are created with each Neon project. The first is named for the registered Neon account and can be used to access the Neon project from a client. This user’s credentials can be managed and used for password-based `psql` authentication. The second user is the `web-access` system user, which is used by the SQL Editor and Neon’s (/docs/reference/glossary/#quick-auth) feature. The `web-access` user is system managed. It cannot be modified, removed, or used in other authentication scenarios.

Additional PostgreSQL users can be created in the Neon Console.

In PostgreSQL, a role with the `LOGIN` attribute is considered the same as a _database user_. For additional information, refer to [Database roles](https://www.postgresql.org/docs/14/user-manag.html) and [Role Attributes](https://www.postgresql.org/docs/14/role-attributes.html), in the PostgreSQL documentation.

### Project

A collection of PostgreSQL databases, PostgreSQL users, and other project resources and settings. A project contains a Compute with a PostgreSQL server as well as storage for the project data.

### Proxy

A Neon component which functions as a multitenant service that accepts and handles connections from clients that use the PostgreSQL protocol.

### Passwordless auth

A Neon feature that allows users to connect to a Neon project with a single `psql` command. See [Query with psql](/docs/get-started-with-neon/query-with-psql-editor/).

### Regular PostgreSQL

Refers to the standard PostgreSQL open-source database system, maintained by [postgresql.org](https://www.postgresql.org/).

### Safekeeper

A Neon architecture component responsible for the durability of database changes. PostgreSQL streams WAL records to Safekeepers. A quorum algorithm based on Paxos ensures that when a transaction is committed, it is stored on a majority of Safekeepers and can be recovered if a node is lost. Safekeepers are deployed in different availability zones to ensure high availability and durability.

### Serverless

A cloud-based development model that enables developing and running applications without having to manage servers.

### SNI

Server Name Indication. A TLS protocol extension that allows a client or browser to indicate which hostname it wants to connect to at the beginning of a TLS handshake.

### SQL Editor

A feature of the Neon Console that enables running queries on a Neon project database. The SQL Editor also enables saving queries, viewing query history, and analyzing or explaining queries.

### Storage

Where data is recorded and stored. Neon storage consists of Pageserver which stores hot data and a cloud object store such as Amazon S3 that stores cold data for cost optimization and durability.

### Technical Preview

A preview of Neon during which users are able to try Neon's Free Tier. For more information, see [Technical Preview Free Tier](/docs/reference/technical-preview-free-tier/).

### Token

An encrypted access token that enables users to authenticate with Neon using the Neon API. An access token is generated when creating a Neon API key. For more information, see [Using API keys](https://neon.tech/docs/get-started-with-neon/using-api-keys/).

## PostgreSQL users

PostgreSQL users are created as a part of your Neon project and can be managed via the Neon web UI. A system user `web-access` is used for the SQL Editor in Neon UI and for link authentication for psql. This user cannot be removed or used for authenticating in other scenarios.

### User

See [Neon user](#neon-user) and [PostgreSQL user](#postgresql-user).

### WAL

Write-Ahead Logging (WAL). A standard method for ensuring data integrity. Neon relies on WAL to separate storage and compute.

### WAL slice

Write-ahead logs in a specific LSN range.

### WAL stream

The stream of data that is written to the Write-Ahead Log (WAL) during transactional processing.