---
title: Tutorials
---

## Import an existing database to Neon Cloud Service

Migration of existed Postgres database to Neon can be done almost in the same way

as copying database from one server to another. Postgres provides several ways to do it.

The most straightforward and efficient is to use `pg_dump` utility:

```bash
pg_dump -h HOST-U USER DBNAME|psql -h start.neon.tech -U username@neon main
```

You may need to make `pg_dump` to create data in non-plain-text format.

In this case `pg_restore` utility should be used instead of `psql`.

Please notice that Neon is not able to create databases. So you can not use `pg_dumpall` or

`pg_dump` with `-C` option. If you have multiple databases in the Project you going to migrate, then you will have to migrate each database separately.

Since `pg_dump`` dumps a single database, it doesn't include information about roles which are stored in the global pg_authid catalog. Also Neon doesn't allow to create users and roles through psql, you can only do it through UI. If you have not done it, then while importing you will get multiple "role does not exist" exists. This warning can be ignored: data will be imported in any case.

You can also configure logical replication to let Neon receive stream of updates from existed system.

Please notice that some of Postgres features, requiring access to the local files system, are not supported by Neon. For example tablespaces, large objects. Please take it in account when migrating existed database schema to Neon.

You can definitely copy not only the whole database, but also particular tables. It can be done using `COPY` command in the same way as populating table in vanilla Postgres. The only specific of Neon is that populated data is transferred through replication stream and so may affect speed of execution of some other queries even not related with this table.

## Query via UI

In console ([https://console.neon.tech/](https://console.neon.tech/)) select your Project to see the Project details.

Select the SQL Editor tab.

Paste a query

```postgresql
create table t (c int);
insert into t select generate_series(1,100);
select count(*) from t;
```

Click run button to see the results.

## Query with psql

To follow this guide you will need a working install of [psql](https://www.postgresql.org/download/), PostgreSQL interactive terminal.

In the console go to the Project Dashboard, click “Generate Token” button, follow instructions to save the password into .pgpass file

Copy the connection string and run it in the shell:

```bash
psql -h start.neon.tech -U username@neon main
```

Run a simple query:

```postgresql
create my_table as select now();
select * from my_table;
```

## Quick connect with github single-sign on

```bash
psql -h start.neon.tech
```

The above command connects to your Project called 'main'. If it doesn't already exist, it is created. The "main" Project is a great way to get started. However, before moving to production, it is recommended to create a separate Project for each application.

By default, psql connects to a database with the same name as your OS username. For example, if your OS username is "alice", the above command will connect to a database called "alice".

To connect to a different Project:

```bash
psql -h <project>.start.neon.tech
```

## Integrate

Neon support the standard PostgreSQL wire protocol. You can use all the normal client utilities like ‘psql’ and ‘pg_dump’, and standard client libraries and drivers to connect.

There are two ways to authenticate:

- using github single-sign-on, or
- using an authentication token

Github single-sign-on makes it very easy to connect interactively. However, as it requires opening a link with a web browser, it is not suitable for applications. For applications, generate an authentication token in the Cloud Console.

### Using from Vercel

### Using from Hasura

Hasura is a cloud-based GraphQL provider for existing databases. This guide will cover zero-coding integration between Neon cloud service and Hasura Cloud. By the end of this guide, we will have a working HTTP API endpoint that uses GraphQL to query our serverless database and responds with a set of rows.

First, let us set up a Neon project:

1. Go to the Neon console <https://console.neon.tech/app/projects>.
2. Create a new Project or use any existing one.
3. Open the Project page and click the 'Generate token' button.
4. Copy DATABASE_URL. We will need it later.

Second, add this Project as a data source in the Hasura Cloud project:

1. Go to the Hasura Cloud projects list <https://cloud.hasura.io/projects>.
2. Create a new project or launch a console for the existing one.
3. Go to the DATA section, and in the 'Connect Existing Database' tab, paste DATABASE_URL into the corresponding form field. Give it some name and click connect.
4. That is mostly it! Hasura Cloud will connect and automatically discover the public schema. While Neon will spin up a new compute node for your database when any new connection arrives and suspend it when it is idle.

Now we can create the first table using the Hasura Console web interface. Let it be table 't' with a single column 'text' of a type 'Text'. Once created, you can put some rows into it and finally navigate to the API section for endpoint creation. In the GraphQL tab, we can query our table with GraphQL, for example:

```graphql
query MyQuery {
  t {
    text
  }
}
```

Save this GraphQL query as an HTTP API endpoint by clicking the REST tab. Let us call the endpoint 'query_t'.

Finally, you can use this endpoint to get the table content now. For example, that is how it works from the shell:

```bash
$ curl -H 'x-hasura-admin-secret: {admin_secret}' https://{your_project_name}.hasura.app/api/rest/query_t
{"t":[{"text":"test"}]}
```

Thanks for your time, and keep hacking!

### Using with Prisma

Prisma is an open-source type-safe ORM for the javascript ecosystem. It consists of the following parts:

- Prisma Client: Auto-generated and type-safe query builder for Node.js & TypeScript
- Prisma Migrate: Migration tool to easily evolve your database schema from prototyping to production
- Prisma Studio: GUI to view and edit data in your database

This document discusses the concepts behind using Prisma with Neon for development and production setups.

#### Connecting to Neon from Prisma

To connect Prisma-based app to Neon you need to specify `postgresql` datasource and connection string.

First, add the following to the `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url   = env("DATABASE_URL")
}
```

Then, go to the Project dashboard in Neon and generate a connection string in `Connection Details` widget. You can specify this connection string in `.env`:

```shell
DATABASE_URL=postgres://user:pass@start.stage.neon.tech/project-name-123
```

#### Using Neon for development with Prisma

Prisma used a so-called shadow database to detect schema drift, therefore you need to have a second database to perform `prisma migrate dev` command. One way to deal with it is to create a separate Project in Neon and specify it via `shadowDatabaseUrl` in `prisma/schema.prisma`.

For example, you can configure Prisma in the following way:

in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url   = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

and in `.env`:

```shell
DATABASE_URL="<connection string to the project1>"
SHADOW_DATABASE_URL="<connection string to the project2>"
```

### Using from Django

Django is one of the most popular backend frameworks. Because Neon is fully compatible with vanilla PostgreSQL, you only need to fill in the correct connection details. To use Neon with Django, you have create a Project on Neon and specify the project connection settings in your settings.py in the same way as for standalone Postgres.

See the following example of specifying connection properties for Neon:

```json
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': '<here goes your project id>',
        'USER': '<your github nickname from account used to authenticate in neon>@neon,
        'PASSWORD': '<token generated in "Connection Details" tab>',
        'HOST': 'start.neon.tech',
        'PORT': '5432',
    }
}
```

Note:

Currently, it is not possible to run Django tests against Neon because Django test runner needs to create a new database for tests which is currently not supported in Neon.

References:

- [Django Settings: Databases](https://docs.djangoproject.com/en/4.0/ref/settings/#databases)

### Using from SQLAlchemy

SQLAlchemy is among the most popular ORMs in the Python universe. Because Neon is fully compatible with vanilla PostgreSQL, you only need to fill in the correct connection details.

Prerequisites:

Here we assume that you have already created a project on Neon cloud service and have sqlalchemy installed with a PostgreSQL driver (example assumes psycopg2 - the default one for PostgreSQL in SQLAlchemy). For installation details see corresponding pages for [SQLAlchemy](https://docs.sqlalchemy.org/en/14/intro.html#installation) and [psycopg2](https://www.psycopg.org/docs/install.html).

SQLALchemy uses Engine abstraction to manage database connections and exposes a `create_engine` function as the primary endpoint for engine initialization. See the following example on how to create SQLAlchemy engine pointing to the Neon Project.

```python
from sqlalchemy import create_engine

USERNAME = # Your GitHub username
TOKEN = # Token generated in "Connection Details" tab
DBNAME = # Name of your project
CONNSTR = f'postgresql://{USERNAME}@neon:{TOKEN}@start.stage.neon.tech/{DBNAME}

engine = create_engine(CONNSTR)
```

References:

- [Establishing Connectivity - the Engine](https://docs.sqlalchemy.org/en/14/tutorial/engine.html)
- [Connecting to PostgreSQL with SQLAlchemy](https://docs.sqlalchemy.org/en/14/core/engines.html#postgresql)

### Using from python + psycopg2

Psycopg2 is the most popular python library for running raw postgres queries. If you’re interested in a higher-level ORM on top of psycopg2, see our guides on [SQLAlchemy](#using-from-sqlalchemy) and [Django](#using-from-django).

To get started writing postgres queries against neon via psycopg2:

1. Register on Neon cloud service and create a project
2. Navigate to your Project on console.neon.tech and find the Postgres Username and access token in the “Connection Details” section. The Postgres Username should end with @neon.
3. Install psycopg2. You might also need psycopg2-binary depending on your system. You can run “pip install psycopg2 psycopg2-binary” or use a dependency manager like poetry to do the same.
4. Run the “hello neon” program:

```python
import psycopg2

# Optional: tell psycopg2 to cancel the query on Ctrl-C
import psycopg2.extras; psycopg2.extensions.set_wait_callback(psycopg2.extras.wait_select)

# NOTE: the password can be set to None if it's specified in the ~/.pgpass file
USERNAME = "<your-username>"
ACCESS_TOKEN = "<your-access-token>"
HOST = "start.neon.tech"
PORT = "5432"
PROJECT = "main"

conn = psycopg2.connect(
 host=HOST,
 port=PORT,
 user=USERNAME,
 password=ACCESS_TOKEN,
 database=PROJECT)

with conn.cursor() as cur:
 cur.execute("SELECT 'hello neon';")
 print(cur.fetchall())
```

5. Build great things with Neon! Any postgres tutorial will be able to guide you on the syntax.

Note: This example was tested with python 3 and psycopg2 version 2.9.3

### Using from Node.js

1. Add postgres client to your project. In this example we used [postgres.js](https://www.npmjs.com/package/postgres), but feel free to choose another one
2. Store your Neon credentials somewhere, for example in the `.env` file.

```shell
    NEON_HOST=...
    NEON_DB=...
    NEON_USER=...
    NEON_PASS=...
    NEON_PORT=...` \
```

3. To connect to the database using postgres client and your Neon credentials, add the following code to the `pages/api/hello_worlds.js`

```javascript
import postgres from 'postgres';

const sql = postgres({
  host: process.env.NEON_HOST,
  port: process.env.NEON_PORT,
  database: process.env.NEON_DB,
  username: process.env.NEON_USER,
  password: process.env.NEON_PASS,
});

const result = await sql.uafe(req.body);
```

### Using from Next.js + vercel

1. [Create a next.js project](https://nextjs.org/learn/basics/create-nextjs-app/setup) if you don’t have one.
2. Create a Neon project for your app. You can configure your db schema from Neon Console or using tools like Prisma.
3. Add postgres client to your app. In this example we used [postgres.js](https://www.npmjs.com/package/postgres), but feel free to choose another one.
4. Put your Neon credentials to the `.env` file. \

```shell
NEON_HOST=...
NEON_DB=...
NEON_USER=...
NEON_PASS=...
NEON_PORT=...
```

You can use either a connection string or connection options separately.

5. Connect to the database with postgres client and your Neon credentials from your api handlers or server functions.

```javascript pages/api/hello_worlds.js
import postgres from 'postgres';

const sql = postgres({
  host: process.env.NEON_HOST,
  port: process.env.NEON_PORT,
  database: process.env.NEON_DB,
  username: process.env.NEON_USER,
  password: process.env.NEON_PASS,
});

const result = await sql.uafe(req.body);
```

Do not ever expose your Neon credentials to the browser.

You can also use Prisma to manage your database, check our how-to [here](#using-with-prisma). \

### Using from Symphony

Symfony is a framework for building web applications in PHP. Symfony uses Doctrine library to access database. Using Neon from Symfony + Doctrine is straightforward and differs nothing from using a vanilla postgresql.

First, obtain secret token from “Connection details” panel:

1. Select Project you wish to use in the UI. Click on it.
2. Click “Generate token” link.
3. Substitue token placeholder below with this token.

For example, if you configure your Symfony project with `.env` file, then DATABASE_URL entry in `.env` file should look like this:

```shell
# cat .env | grep DATABASE_URL
DATABASE_URL="postgresql://<user>%40neon:<token>@start.neon.tech:5432/<project_id>?charset=utf8"
```

Make sure that you are using `<user>%40neon` as username. This is url encoded value for `<user>@neon`. You can find `<user>` string in the upper right corner of the UI.

### Using from Java Ecosystem

#### Connect with JDBC

The JDBC API is a Java API for relational databases. PostgreSQL has a well-supported open-source JDBC driver, which can be used to access Neon. All popular Java frameworks use JDBC internally, so the only thing you need to do is use a correct connection URL.

To get a JDBC connection URL, replace placeholders with your credentials in the following template:

```java
jdbc:postgresql://start.neon.tech/<project>?user=<user>@neon&password=<token>
```

For more information about JDBC, refer to the standard JDBC API documentation and [PostgreSQL JDBC Driver documentation](https://jdbc.postgresql.org/documentation/head/index.html).

#### Using from Spring Data

Spring relies on JDBC and PostgreSQL driver to connect to PostgreSQL databases. If you are starting your project with Spring Initializr, do not forget to add **PostgreSQL Driver** as a dependency. If you have an existing project, ensure driver dependency is installed.

The only configuration required for connection is a datasource URL. It should specified inside `application.properties` file in the following format:

```java
spring.datasource.url=jdbc:postgresql://start.neon.tech/<project>?user=<user>@neon&password=<token>
```

### Using from Go

Neon is fully compatible with sql/db package and common Postgres drivers ie. lib/pq, pgx etc.

```go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "github.com/lib/pq"
)

func main() {
    connStr := "user=<user>@neon password=<token> dbname=<project> host=start.neon.tech"
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    rows, err := db.Query("select version()")
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()

    var version string
    for rows.Next() {
        err := rows.Scan(&version)
        if err != nil {
            log.Fatal(err)
        }
    }
    fmt.Printf("version=%s\n", version)
}
```

[On golang playground](https://play.golang.com/p/gl69dT0HtHN)

### Using from Rust

```rust
use postgres::{Client, NoTls};

fn main() {
 let mut client = Client::connect("user=<user name> dbname=<db name> host=start.neon.tech password=<password>", NoTls).expect("connection error");

 for row in client.query("select version()", &[]).expect("query error") {
     let version: &str = row.get(0);
     println!("version: {}", version);
 }
}
```

[On rust-lang playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=0d9daa9cde3c74d2916c8f05b24707a3)
