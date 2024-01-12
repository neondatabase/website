---
title: Use FerretDB with Neon
subtitle: Add MongoDB compatibility to your Neon database with FerretDB
enableTableOfContents: true
isDraft: true
---

FerretDB is an open source document database that adds MongoDB compatibility to other databases, including Postgres. By using FerretDB, developers can access familiar MongoDB features and tools using the same syntax and commands for many of their use cases.

In this guide, you'll learn about FerretDB and how you can add MongoDB compatibility to Neon.

## Advantages of FerretDB

The benefits of using FerretDB include:

- **MongoDB compatibility**

    FerretDB gives you access to the syntax, tools, querying language, and commands available in MongoDB for many common use cases. MongoDB is known for its simple and intuitive NoSQL query language which is widely used by many developers. By using FerretDB, you can enable Postgres databases like Neon to run MongoDB workloads. For related information, see [MongoDB Compatibility - What's Really Important?](https://blog.ferretdb.io/mongodb-compatibility-whats-really-important/)

- **Open source** 

    As an open source document database, you won't be at risk of vendor lock-in. Since MongoDB's license change to Server Side Public License (SSPL), there's been a lot of confusion regarding what this means for users and what it would mean for their applications. According to the Open Source Initiative – the steward of open source and the set of rules that define open source software – SSPL is not considered open source.

    FerretDB is licensed under Apache 2.0, makes it a good option for users looking for a MongoDB alternative.

- **Multiple backend options** 

    FerretDB currently supports Postgres and SQLite backends, with many ongoing works to support other backends. Many databases built on Postgres can serve as a backend for FerretDB, including Neon. That means you can take advantage of all the features available in that backend to scale and manage your database infrastructure without fear of vendor lock-in.

## Prerequisites

The prerequisites for this guide include the following:

- Neon account. See [Sign up](/docs/get-started-with-neon/signing-up).
- Neon project. See [Create your first project](/docs/get-started-with-neon/setting-up-a-project).
- A database. This guide uses a database named `ferretdb`. It's very easy to create a database in Neon. See [Create a database](/docs/manage/databases#create-a-database) for instructions.
- Docker. For instructions, see [Get Docker](https://docs.docker.com/get-docker/). To verify your installation or check if you already have Docker installed, you can run `docker --version`.
- The `mongosh` command-line tool. For installation instructions, see [Install mongosh](https://www.mongodb.com/docs/mongodb-shell/install/).

## Retrieve your Neon database connection string

From the Neon **Dashboard**, retrieve your connection string from the **Connection Details** widget.

Your connection string should look something like this:

<CodeBlock shouldWrap>

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/ferretdb
```

</CodeBlock>

## Run FerretDB with Neon via Docker

Run the following command to run FerretDB in a Docker container and connect it to your Neon Postgres database (`NEON_DB_CONNECTION_STRING`):

<CodeBlock shouldWrap>

```bash
docker run -e FERRETDB_POSTGRESQL_URL=<NEON_DB_CONNECTION_STRING> ghcr.io/ferretdb/ferretdb
```

</CodeBlock>

## Test via mongosh

From another terminal, test to see if the FerretDB instance is connected to your Neon database using `mongosh`. To connect via `mongosh`, you will need a connection string. Use your Neon Postgres credentials to connect to the database.

So in this case, the MongoDB connection string will be:

<CodeBlock shouldWrap>

```bash
mongosh 'mongodb://<postgres-username>:<postgres-password>@127.0.0.1:27017/ferretdb?authMechanism=PLAIN'
```

</CodeBlock>

This should connect you directly to the FerretDB instance, and you can go ahead to try out different MongoDB commands.

```bash
~$ mongosh 'mongodb://<username>:<password>@127.0.0.1:27017/ferretdb?authMechanism=PLAIN'
Current Mongosh Log ID: 657c28296fda6bb93a0c0058
Connecting to:      mongodb://<credentials>@127.0.0.1:27017/?authMechanism=PLAIN&directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2
Using MongoDB:      6.0.42
Using Mongosh:      2.0.2
mongosh 2.1.1 is available for download: https://www.mongodb.com/try/download/shell

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

------
   The server generated these startup warnings when booting
   2023-12-15T10:19:28.991Z: Powered by FerretDB v1.17.0 and PostgreSQL 15.4 on x86_64-pc-linux-gnu, compiled by gcc.
   2023-12-15T10:19:28.991Z: Please star us on GitHub: https://github.com/FerretDB/FerretDB.
   2023-12-15T10:19:28.991Z: The telemetry state is undecided.
   2023-12-15T10:19:28.991Z: Read more about FerretDB telemetry and how to opt out at https://beacon.ferretdb.io.
------

ferretdb>
```

This connects you directly to your `ferretdb` database.

## Insert documents into FerretDB

With `mongosh` running, insert some documents into your FerretDB instance. You are going to insert two basketball player data items into a `players` collection.

```json
db.players.insertMany([
    {
        nba_id: 23,
        player_name: "Jordan",
        player_extended_name: "Michael Jordan",
        quality: "Gold - Legendary",
        overall: 99,
        nationality: "USA",
        position: "SG",
        shooting: 98,
        passing: 85,
        dribbling: 95,
        defense: 93,
        physicality: 92,
        rebounding: 87
    },
    {
        nba_id: 34,
        player_name: "Barkley",
        player_extended_name: "Charles Barkley",
        quality: "Gold - Rare",
        overall: 93,
        nationality: "USA",
        position: "PF",
        shooting: 86,
        passing: 76,
        dribbling: 78,
        defense: 88,
        physicality: 94,
        rebounding: 95,
        base_id: 332
    }
]);
```

Now, when you run `db.players.find()`, it should return all the documents stored in the collection.

## Update document record in FerretDB

Next, you need to update "Jordan" record to reflect his current position as a `SF`. To do this, we can just run an `updateOne` command to target just that particular player:

```bash
db.players.updateOne(
    { player_name: "Jordan" },
    { $set: { position: "SF" } }
);
```

Query the collection to see if the changes have been made:

```bash
ferretdb> db.players.find({player_name: "Jordan"})
[
    {
        nba_id: 23,
        player_name: "Jordan",
        player_extended_name: "Michael Jordan",
        quality: "Gold - Legendary",
        overall: 99,
        nationality: "USA",
        position: "SF",  // Updated field
        shooting: 98,
        passing: 85,
        dribbling: 95,
        defense: 93,
        physicality: 92,
        rebounding: 87
    }
]
```

You can run many MongoDB operations on FerretDB. See the list of [supported commands](https://docs.ferretdb.io/reference/supported-commands/) in the FerretDB documentation.

## View your database on Neon

Besides having a document database view of the collection in FerretDB, you can also view the data through the Neon Dashboard.

To view your current documents, go to the Neon Dashboard and select **Tables** from the sidebar. Then, from the **Schema** menu, select `ferretdb`. FerretDB stores the documents in Postgres as `JSONB`.

## Get started with FerretDB

FerretDB lets you run MongoDB workloads on relational databases. This flexibility means you can easily add MongoDB compatibility to Neon Postgres database, while avoiding vendor lock-in and retaining control of your data architecture.

To get started with FerretDB, check out the [FerretDB quickstart guide](https://docs.ferretdb.io/quickstart-guide/).

<NeedHelp/>