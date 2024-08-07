---
title: Use FerretDB with Neon
subtitle: Add MongoDB compatibility to your Neon database with FerretDB
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.390Z'
---

FerretDB is an open source document database that adds MongoDB compatibility to other databases, including Postgres. By using FerretDB, developers can access familiar MongoDB features and tools using the same syntax and commands for many of their use cases.

In this guide, you'll learn about FerretDB and how you can add MongoDB compatibility to your Neon Postgres database.

## Advantages of FerretDB

The benefits of using FerretDB include:

- **MongoDB compatibility**

  FerretDB gives you access to the syntax, tools, querying language, and commands available in MongoDB for many common use cases. MongoDB is known for its simple and intuitive NoSQL query language which is widely used by many developers. By using FerretDB, you can enable Postgres databases like Neon to run MongoDB workloads.

  For related information, see [MongoDB Compatibility - What's Really Important?](https://blog.ferretdb.io/mongodb-compatibility-whats-really-important/)

- **Open source**

  As an open source document database, you won't be at risk of vendor lock-in. Since MongoDB's license change to Server Side Public License (SSPL), there's been a lot of confusion regarding what this means for users and what it would mean for their applications. According to the Open Source Initiative – the steward of open source and the set of rules that define open source software – SSPL is not considered open source.

  FerretDB is licensed under Apache 2.0, makes it a good option for users looking for a MongoDB alternative.

- **Multiple backend options**

  FerretDB currently supports Postgres and SQLite backends, with many ongoing efforts to support other backends. Many databases built on Postgres can serve as a backend for FerretDB, including Neon. That means you can take advantage of all the features available in the backend of your choice to scale and manage your database infrastructure without fear of vendor lock-in.

To learn more, see [Understanding FerretDB](https://docs.ferretdb.io/understanding-ferretdb/).

## Prerequisites

The prerequisites for this guide include the following:

- A Neon account and project. See [Sign up](/docs/get-started-with-neon/signing-up).
- A database. This guide uses a database named `ferretdb`. It's easy to create a database in Neon. See [Create a database](/docs/manage/databases#create-a-database) for instructions.
- Docker. For instructions, see [Get Docker](https://docs.docker.com/get-docker/). To verify your installation or check if you already have Docker installed, you can run `docker --version`.
- The `mongosh` command-line tool. For installation instructions, see [Install mongosh](https://www.mongodb.com/docs/mongodb-shell/install/). If you are a macOS user, you can quickly install with Homebrew: `brew install mongosh`.

## Retrieve your Neon database connection string

From the Neon **Dashboard**, retrieve the connection string for your `ferretdb` database from the **Connection Details** widget.

Your database connection string will look something like this:

```bash shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/ferretdb
```

## Run FerretDB with Neon via Docker

Execute the following command to run FerretDB in a Docker container and connect it to your Neon Postgres database (`NEON_DB_CONNECTION_STRING`):

```bash shouldWrap
docker run docker run -p 27017:27017 -e FERRETDB_POSTGRESQL_URL=<NEON_DB_CONNECTION_STRING> ghcr.io/ferretdb/ferretdb
```

## Test via mongosh

From another terminal, test to see if the FerretDB instance is connected to your Neon database using `mongosh`. To connect via `mongosh`, you will need a connection string. Use the credentials for your Neon database connection string.

So in this case, the MongoDB connection string will be:

```bash shouldWrap
mongosh 'mongodb://<postgres-username>:<postgres-password>@127.0.0.1/ferretdb?authMechanism=PLAIN'
```

This will connect you directly to the FerretDB instance where you can run MongoDB commands.

```bash
~$ mongosh 'mongodb://<username>:<password>@127.0.0.1/ferretdb?authMechanism=PLAIN'
Current Mongosh Log ID: 657c28296fda6bb93a0c0058
Connecting to:      mongodb://<credentials>@127.0.0.1/?authMechanism=PLAIN&directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2
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

You are now directly connected to your `ferretdb` database.

## Insert documents into FerretDB

With `mongosh`, you can now insert some documents into your FerretDB instance directly from the `ferretdb>` prompt shown above. You are going to insert two basketball player documents into a `players` collection.

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

Now, when you run `db.players.find()`, it should return all the documents stored in the collection:

```json
ferretdb> db.players.find()
[
  {
    _id: ObjectId('65a1b5d53d6122d2b5122e41'),
    nba_id: 34,
    player_name: 'Barkley',
    player_extended_name: 'Charles Barkley',
    quality: 'Gold - Rare',
    overall: 93,
    nationality: 'USA',
    position: 'PF',
    shooting: 86,
    passing: 76,
    dribbling: 78,
    defense: 88,
    physicality: 94,
    rebounding: 95,
    base_id: 332
  },
  {
    _id: ObjectId('65a1b5d53d6122d2b5122e40'),
    nba_id: 23,
    player_name: 'Jordan',
    player_extended_name: 'Michael Jordan',
    quality: 'Gold - Legendary',
    overall: 99,
    nationality: 'USA',
    position: 'SF',
    shooting: 98,
    passing: 85,
    dribbling: 95,
    defense: 93,
    physicality: 92,
    rebounding: 87
  }
]

```

## Update a record in FerretDB

Next, you need to update the "Jordan" record to reflect his current position as a `SF`. To do this, we can just run an `updateOne` command to target just that particular player:

```json
db.players.updateOne(
    { player_name: "Jordan" },
    { $set: { position: "SF" } }
);
```

Query the collection to see if the changes have been made:

```json
ferretdb> db.players.find({player_name: "Jordan"})
[
  {
    _id: ObjectId('65a1b5d53d6122d2b5122e40'),
    nba_id: 23,
    player_name: 'Jordan',
    player_extended_name: 'Michael Jordan',
    quality: 'Gold - Legendary',
    overall: 99,
    nationality: 'USA',
    position: 'SF',
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

In addition to a document database view of the collection in FerretDB, you can also view and query the data in Neon.

To view your current documents, go to the Neon **Dashboard** and select **Tables** from the sidebar. Then, from the **Schema** menu, select `ferretdb`. FerretDB stores the documents in Postgres as [JSONB](https://www.postgresql.org/docs/current/datatype-json.html) data.

![FerretDB table showing player data](/docs/guides/ferretdb_table.png)

To query the data for a specific player via SQL, you can do so via the [Neon SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor) or an SQL client like [psql](/docs/connect/query-with-psql-editor):

```sql
SELECT _jsonb
FROM ferretdb.players_a90eae09
WHERE _jsonb ->> 'player_name' = 'Jordan';
```

## Get started with FerretDB

FerretDB lets you run MongoDB workloads on relational databases. This flexibility means you can easily add MongoDB compatibility to your Neon Postgres database while avoiding vendor lock-in and retaining control of your data architecture.

To get started with FerretDB, check out the [FerretDB Get Started](https://docs.ferretdb.io/quickstart-guide/) docs.

## References

- [Sign up for Neon](/docs/get-started-with-neon/signing-up)
- [Get Docker](https://docs.docker.com/get-docker/)
- [Install mongosh](https://www.mongodb.com/docs/mongodb-shell/install/)
- [MongoDB Compatibility - What's Really Important?](https://blog.ferretdb.io/mongodb-compatibility-whats-really-important/)
- [JSON types in Postgres](https://www.postgresql.org/docs/current/datatype-json.html)
- [FerretDB on GitHub](https://github.com/FerretDB/FerretDB)
- [FerretDB supported commands](https://docs.ferretdb.io/reference/supported-commands/)
- [Postgres JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
- [Neon SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor)
- [Connect with psql](/docs/connect/query-with-psql-editor)
- [Understanding FerretDB](https://docs.ferretdb.io/understanding-ferretdb/)
- [FerretDB Get Started](https://docs.ferretdb.io/quickstart-guide/)

<NeedHelp/>
