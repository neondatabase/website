---
title: Use Prisma with Neon
subtitle: Follow this step-by-step guide to learn how to use Prisma with Neon
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/guides/prisma-tutorial
updatedOn: '2024-07-25T12:53:42.439Z'
---

Prisma is an open source next-generation ORM that consists of the following parts:

- Prisma Client: An auto-generated and type-safe query builder for Node.js & TypeScript
- Prisma Migrate: A schema migration system
- Prisma Studio: A GUI for viewing and editing data in your database

This guide steps you through how to connect from Prisma to Neon, how to use Prisma Migrate to create and evolve a schema, how to add data using the Neon SQL Editor or Prisma Studio, how to send queries using Prisma Client, and finally, how to introspect an existing database using the Prisma CLI.

## Create a Neon project and copy the connection string

1. In the Neon Console, click **Create a project** to open the **Project Creation** dialog.
1. Specify your project settings and click **Create Project**.

The project is created and you are presented with a dialog that provides connection details. Copy the connection string, which looks similar to the following:

```text shouldWrap
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb
```

<Admonition type="info">
Each Neon project is created with a Postgres role that is named for your database. For example, if your database is named `neondb`, the project is created with a default role named `neondb_owner`. This guide uses a `neondb` database as the primary database.
</Admonition>

## Create a shadow database for Prisma Migrate

Prisma Migrate requires a "shadow" database to detect schema drift and generate new migrations. For more information about the purpose of the shadow database, refer to [About the shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database), in the _Prisma documentation_.

For cloud-hosted databases like Neon, you must create the shadow database manually. To create the shadow database:

1. In the Neon Console, select **Databases**.
1. Click **New Database**.
1. Select the branch where you want to create the database, enter a database name, and select a database owner. For simplicity, name the shadow database `shadow`, and select the same branch where the `neondb` database resides.

The connection string for this database should be the same as the connection string for your `neondb` database except for the database name:

```text shouldWrap
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/shadow
```

## Set up your Prisma project

Deploy a sample Typescript project and set up Prisma.

To complete these steps, you require Node.js v14.17.0 or higher. For more information about Prisma's system requirements, see [System requirements](https://www.prisma.io/docs/reference/system-requirements).

1. Create a project directory and navigate to it.

   ```bash
   mkdir hello-neon-prisma
   cd hello-neon-prisma
   ```

1. Initialize a TypeScript project using `npm`. This creates a `package.json` file with the initial setup for your TypeScript project.

   ```bash
   npm init -y
   npm install typescript ts-node @types/node --save-dev
   ```

1. Initialize TypeScript:

   ```bash
   npx tsc --init
   ```

1. Install the Prisma CLI, which is a Prisma project dependency:

   ```bash
   npm install prisma --save-dev
   ```

1. Set up Prisma with the Prisma CLI `init` command. This creates a `prisma` directory with a Prisma schema file and configures Postgres as your database.

   ```bash
   npx prisma init --datasource-provider postgresql
   ```

## Connect your Prisma project to Neon

In this step, you will update your project's `.env` file with the connection strings for your `neondb` and `shadow` databases.

1. Open the `.env` file located in your `prisma` directory.
2. Update the value of the `DATABASE_URL` variable to the connection string you copied when you created your Neon project.
3. Add a `SHADOW_DATABASE_URL` variable and set the value to the connection string for the shadow database you created previously.

When you are finished, your `.env` file should have entries similar to the following:

```text shouldWrap
DATABASE_URL=postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?connect_timeout=10
SHADOW_DATABASE_URL=postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/shadow?connect_timeout=10
```

<Admonition type="note">
A `?connect_timeout=10` parameter is added to the connection strings above to avoid database connection timeouts. The default `connect_timeout` setting is 5 seconds, which is usually enough time for a database connection to be established. However, network latency combined with the short amount of time required to start an idle Neon compute can sometimes result in a connection failure. Setting `connect_timeout=10` helps avoid this issue.
</Admonition>

## Add a model to your schema.prisma file

In this step, you will update the `datasource db` entry in your `schema.prisma` file and add a model for the `Elements` table. A model represents the table in your underlying database and serves as the foundation for the generated Client API. For more information about data modeling, see [Data modeling](https://www.prisma.io/docs/concepts/overview/what-is-prisma/data-modeling), in the _Prisma documentation_.

1. Update the `datasource db` entry. Ensure that the provider is set to `postgresql`, and add a `shadowDatabaseUrl` entry.

2. Add the model for the `Elements` table.

   Your `schema.prisma` file should now appear as follows:

   ```text
   // This is your Prisma schema file,
   // learn more about it in the docs: https://pris.ly/d/prisma-schema

   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
   }

   model Elements {
     AtomicNumber Int @id
     Element String?
     Symbol  String?
   }
   ```

  <Admonition type="note">
  Prisma [naming conventions](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#naming-conventions) recommend using PascalCase when defining models. However, be aware that the letter case in your Prisma schema is reflected in Postgres identifier names. If an identifier name in Postgres includes an upper case letter, you must quote the name when specifying it in a Postgres query. For example, the `Elements` table has an upper case letter in its name. When querying this table in Postgres, you must enclose `Elements` in quotes: `SELECT * FROM "Elements"`. Otherwise, the identifier name is changed to lowercase, and the query will not find the table.

To name objects in your Prisma schema (and in the generated API) differently than how they are named in your database, Prisma provides a mapping mechanism that you can use. For example, to map a model named "Elements" to table named "elements", you can use the `@@map` API attribute in your Prisma schema.

For more information, see [Mapping collection/table and field/column names](https://www.prisma.io/docs/concepts/components/prisma-schema/names-in-underlying-database#mapping-collectiontable-and-fieldcolumn-names), in the _Prisma documentation_.
</Admonition>

## Run a migration to create the table in Neon

At this point, you do not have a table in your `neondb` database. In this step, you will run a migration with Prisma Migrate, which creates the table. The table is created based on the `Elements` table model you defined in the `schema.prisma` file in the previous step.

During the migration, Prisma Migrate performs the following actions:

- Creates an SQL migration file in your `prisma/migrate` directory.
- Runs the SQL migration file on your database

To run Prisma Migrate, issue the following command from your `hello-neon-prisma` project directory:

```bash
$> npx prisma migrate dev --name init
```

<Admonition type="note">
Since this is your project's first migration, the migration `--name` flag is set to `init`. You can use a different name for future migrations.
</Admonition>

The output of this command appears similar to the following:

```bash
Environment variables loaded from ../.env
Prisma schema loaded from schema.prisma
Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432"

Applying migration `20230105222046_init`

The following migration(s) have been created and applied from new schema changes:

migrations/

  └─ 20230105222046_init/

    └─ migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)

added 2 packages, and audited 24 packages in 3s

found 0 vulnerabilities

✔ Generated Prisma Client (4.8.1 | library) to ./../node_modules/@prisma/client in 73ms
```

## View your table in the Neon Console

To view the `Elements` table that was created in your `neondb` database by the migration performed in the previous step:

1. Navigate to the [Neon Console](https://console.neon.tech/).
2. Select your project.
3. Select **Tables**.
4. Select the `neondb` database and default `public` schema. The `Elements` table should be visible in the sidebar. The table has no data at this point. Data is added later in this guide.

## Evolve your schema with Prisma Migrate

In this step, you will evolve your Prisma schema by performing another migration with `prisma migrate dev`.

Assume that you want to add an `AtomicMass` field to your `Elements` model. The modified schema model should now appear as follows:

```text
model Elements {
  AtomicNumber Int @id
  Element String?
  Symbol  String?
  AtomicMass Decimal
}
```

3. Apply the schema change to your database using the `prisma migrate dev` command. In this example, the name given to the migration is `add-field`.

   ```bash
   $> npx prisma migrate dev --name add-field
   ```

   This command creates a new SQL migration file for the migration, applies the generated SQL migration to your database, and regenerates the Prisma Client. The output resembles the following:

   ```bash
   Environment variables loaded from .env
   Prisma schema loaded from prisma/schema.prisma
   Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432"

   Applying migration `20230113120852_add_field`

   The following migration(s) have been created and applied from new schema changes:

   migrations/
     └─ 20230113120852_add_field/
       └─ migration.sql

   Your database is now in sync with your schema.

   ✔ Generated Prisma Client (4.8.1 | library) to ./node_modules/@prisma/client in
   91ms
   ```

   You can view the migration in your `prisma/migrations` folder.

## Add data to your table

You have a couple of options for adding data to the `Elements` table. You can add data using the Neon SQL Editor or with Prisma Studio. Both methods are described below.

### Option A: Add data using the Neon SQL Editor

1. Navigate to the [Neon Console](https://console.neon.tech/).
1. Select your project.
1. Select the **SQL Editor**.
1. Select the `main` branch of your project and select the `neondb` database.
1. To add data, enter the following statement into the editor and click **Run**.

```sql
INSERT INTO "Elements" VALUES  (10, 'Neon', 'Ne', 20.1797);
```

To verify that data was added, run the following query:

```sql
SELECT * FROM "Elements";
```

### Option B: Add data using Prisma Studio

To add data from Prisma Studio:

Open your terminal and run the `npx prisma studio` command from your `prisma` directory:

```bash
$> npx prisma studio
Environment variables loaded from ../.env
Prisma schema loaded from schema.prisma
Prisma Studio is up on http://localhost:5555
```

Prisma Studio opens locally in your browser.

Click **Add record** and enter some values as follows:

- AtomicNumber: 10
- Element: Neon
- Symbol: Ne
- AtomicMass: 20.1797

To add the record, click the **Save 1 change** button.

## Send queries to your Neon database with Prisma Client

Follow the steps below to create a TypeScript file for executing queries with Prisma Client. Two examples are provided, one for creating a new record, and one for retrieving all records.

### Create a TypeScript file to execute Prisma Client queries

In your `hello-neon-prisma` directory, create a new file called `query.ts`:

```bash
touch query.js
```

Add the following code to the `query.ts` file:

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ... write Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

This code contains a `main()` function that's invoked at the end of the script. It also instantiates Prisma Client, which acts as the query interface to your database.

### Create a new record

Add a query to the `main()` function in your `query.ts` file that creates a new record in the `Elements` table and logs the result to the console. With the query added, your `query.ts` file will look like this:

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const elements = await prisma.elements.create({
    data: {
      AtomicNumber: 8,
      Element: 'Oxygen',
      Symbol: 'O',
      AtomicMass: 15.999,
    },
  });
  console.log(elements);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Next, execute the `query.ts` script with the following command:

```bash
$ npx ts-node query.ts
{ AtomicNumber: 8, Element: 'Oxygen', Symbol: 'O', AtomicMass: 15.999 }
```

Congratulations! You have created your first record with Prisma Client.

### Retrieve all records

Prisma Client offers various queries to read data from your database. In this section, you will use the `findMany` query to retrieve all records in the database for the specified model.

Delete the previous query from your `query.ts` file and replace it with the `findMany` query. Your `query.ts` file should now appear as follows:

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const elements = await prisma.elements.findMany();
  console.log(elements);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Execute the `query.ts` script again to retrieve the records from the `Elements` table.

```bash
$ npx ts-node query.ts
[
  {
    AtomicNumber: 10,
    Element: 'Neon',
    Symbol: 'Ne',
    AtomicMass: 20.1797
  },
  {
    AtomicNumber: 8,
    Element: 'Oxygen',
    Symbol: 'O',
    AtomicMass: 15.999
  }
]
```

## Introspect a database using Prisma CLI

Instead of creating data models in your Prisma schema and using Prisma Migrate to create the tables in your database, as you did for the `Elements` table in the previous steps, you can use Prisma's [Introspection](https://www.prisma.io/docs/concepts/components/introspection) capability to generate data models from an existing database.

Introspection is often used to generate an initial version of the data model when adding Prisma to an existing project and may be more convenient than developing your data model manually, especially if you have numerous tables or tables with many columns.

Another use case for Introspection is when using plain SQL for schema changes or a tool other than Prisma Migrate to perform schema migrations. In these cases, you might introspect your database after each schema change to regenerate your Prisma Client to reflect the changes in your Prisma Client API.

### Create a schema in Neon

Let's assume your database has an extended version of the `Elements` table used in the previous steps. This table is called `Elements_ext`. Let's create that table in the Neon SQL Editor:

1. Navigate to the [Neon Console](https://console.neon.tech/).
1. Select your project.
1. Select the **SQL Editor**.
1. Select the `main` branch of your project and select the `neondb` database.
1. Enter the following statement into the editor and click **Run**.

```sql
CREATE TABLE "Elements_ext" (
  "AtomicNumber" INTEGER PRIMARY KEY,
  "Element" TEXT,
  "Symbol" TEXT,
  "AtomicMass" DECIMAL,
  "NumberOfNeutrons" INTEGER,
  "NumberOfProtons" INTEGER,
  "NumberOfElectrons" INTEGER,
  "Period" INTEGER,
  "Group" INTEGER,
  "Phase" TEXT,
  "Radioactive" BOOLEAN,
  "Natural" BOOLEAN,
  "Metal" BOOLEAN,
  "Nonmetal" BOOLEAN,
  "Metalloid" BOOLEAN,
  "Type" TEXT,
  "AtomicRadius" DECIMAL,
  "Electronegativity" DECIMAL,
  "FirstIonization" DECIMAL,
  "Density" DECIMAL,
  "MeltingPoint" DECIMAL,
  "BoilingPoint" DECIMAL,
  "NumberOfIsotopes" INTEGER,
  "Discoverer" TEXT,
  "Year" INTEGER,
  "SpecificHeat" DECIMAL,
  "NumberOfShells" INTEGER,
  "NumberOfValence" INTEGER
);
```

<Admonition type="info">
You can find the `Elements` and `Elements_ext` tables in Neon's example GitHub repository with a full set of data that you can import and play around with. [Elements data set](https://github.com/neondatabase/examples/tree/main/elements_data_set).
</Admonition>

### Run prisma db pull

To introspect the `Elements_ext` table to generate the data model, run the `prisma db pull` command:

```sql
$ npx prisma db pull
Prisma schema loaded from prisma/schema.prisma
Environment variables loaded from .env
Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432"

✔ Introspected 2 models and wrote them into prisma/schema.prisma in 1.78s
```

Two models were introspected because of the `Elements` table that existed in the `neondb` database previously. Prisma does not yet support introspecting a subset of a database schema, so you cannot introspect an individual table.

### View the introspected model

To view the model generated for the new `Elements_ext` table, open your `schema.prisma` file. You will find the following model is now defined:

```text
model Elements_ext {
  AtomicNumber      Int      @id
  Element           String?
  symbol            String?
  AtomicMass        Decimal? @db.Decimal
  NumberOfNeutrons  Int?
  NumberOfProtons   Int?
  NumberOfElectrons Int?
  Period            Int?
  Group             Int?
  Phase             String?
  Radioactive       Boolean?
  Natural           Boolean?
  Metal             Boolean?
  Nonmetal          Boolean?
  Metalloid         Boolean?
  Type              String?
  AtomicRadius      Decimal? @db.Decimal
  Electronegativity Decimal? @db.Decimal
  FirstIonization   Decimal? @db.Decimal
  Density           Decimal? @db.Decimal
  MeltingPoint      Decimal? @db.Decimal
  BoilingPoint      Decimal? @db.Decimal
  NumberOfIsotopes  Int?
  Discoverer        String?
  Year              Int?
  SpecificHeat      Decimal? @db.Decimal
  NumberOfShells    Int?
  NumberOfValence   Int?
}
```

The typical workflow for a project that does not use Prisma Migrate is:

1. Change the database schema (using plain SQL, for example)
1. Run `prisma db pull` to update the Prisma schema
1. Run `prisma generate` to update Prisma Client
1. Use the updated Prisma Client in your application

You can read more about this workflow in the Prisma documentation. See [Introspection workflow](https://www.prisma.io/docs/concepts/components/introspection#introspection-workflow).

## Conclusion

You have completed the _Use Prisma with Neon_ guide. To recap, you have learned how to connect from Prisma to Neon, use Prisma Migrate to evolve a schema, add data using the Neon SQL Editor and Prisma Studio, send queries using Prisma Client, and finally, introspect an existing database.

<NeedHelp/>
