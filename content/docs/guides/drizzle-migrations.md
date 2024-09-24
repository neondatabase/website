---
title: Schema migration with Neon Postgres and Drizzle ORM
subtitle: Set up Neon Postgres and run migrations for your TypeScript project using
  Drizzle ORM
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.650Z'
---

[Drizzle](https://orm.drizzle.team/) is a TypeScript-first ORM that connects to all major databases and works across most Javascript runtimes. It provides a simple way to define database schemas and queries in an SQL-like dialect and tools to generate and run migrations.

This guide shows how to use `Drizzle` with the `Neon` Postgres database in a Typescript project. We'll create a simple Node.js application with `Hono.js` and demonstrate the full workflow of setting up and working with your database using `Drizzle`.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and test the application locally.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.
2. Select a project or click the `New Project` button to create a new one.

### Retrieve your Neon database connection string

Navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Keep your connection string handy for later use.

<Admonition type="note">
Neon supports both direct and pooled database connection strings, which can be copied from the **Connection Details** widget on your Neon Project Dashboard. A pooled connection string connects your application to the database via a PgBouncer connection pool, allowing for a higher number of concurrent connections. However, using a pooled connection string for migrations can lead to errors. For this reason, we recommend using a direct (non-pooled) connection when performing migrations. For more information about direct and pooled connections, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## Setting up the TypeScript application

### Create a new Hono.js project

We'll create a simple catalog, with API endpoints that query the database for authors and a list of their books. Run the following command in your terminal to set up a new project using `Hono.js`:

```bash
npm create hono@latest neon-drizzle-guide
```

This initiates an interactive CLI prompt to set up a new project. To follow along with this guide, you can use the following settings:

```bash
Need to install the following packages:
create-hono@0.9.0
Ok to proceed? (y) y

create-hono version 0.9.0
✔ Using target directory … neon-drizzle-guide
✔ Which template do you want to use? › nodejs
cloned honojs/starter#main to ./repos/javascript/neon-drizzle-guide
✔ Do you want to install project dependencies? … yes
✔ Which package manager do you want to use? › npm
```

To use Drizzle and connect to the Neon database, we also add the `drizzle-orm` and `drizzle-kit` packages to our project, along with the `Neon serverless` driver library.

```bash
cd neon-drizzle-guide && touch .env
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit dotenv
```

Add the `DATABASE_URL` environment variable to your `.env` file, which you'll use to connect to our Neon database. Use the connection string that you obtained from the Neon Console earlier:

```bash
# .env
DATABASE_URL=NEON_DATABASE_CONNECTION_STRING
```

Test that the starter `Hono.js` application works by running `npm run dev` in the terminal. You should see the `Hello, Hono!` message when you navigate to `http://localhost:3000` in your browser.

### Set up the database schema

Now, we will define the schema for the application using the `Drizzle` ORM. Create a new `schema.ts` file in your `src` directory and add the following code:

```typescript
// src/schema.ts

import { pgTable, integer, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const authors = pgTable('authors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  bio: text('bio'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  authorId: integer('author_id').references(() => authors.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

The code defines two tables: `authors`, which will contain the list of all the authors, and `books`, which will contain the list of books written by the authors. Each book is associated with an author using the `authorId` field.

To generate a migration to create these tables in the database, we'll use the `drizzle-kit` command. Add the following script to the `package.json` file at the root of your project:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate --dialect=postgresql --schema=src/schema.ts --out=./drizzle"
  }
}
```

Then, run the following command in your terminal to generate the migration files:

```bash
npm run db:generate
```

This command generates a new folder named `drizzle` containing the migration files for the `authors` and `books` tables.

### Run the migration

The generated migration file is written in SQL and contains the necessary commands to create the tables in the database. To apply these migrations, we'll use the [Neon serverless driver](/docs/serverless/serverless-driver) and helper functions provided by the `drizzle-orm` library.

Create a new `migrate.ts` in your `src` directory and add the following code:

```typescript
// src/migrate.ts

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { config } from 'dotenv';

config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

main();
```

The `drizzle-orm` package comes with an integration for `Neon`, which allows us to run the migrations using the `migrate` function. Add a new script to the `package.json` file that executes the migration.

```json
{
  "scripts": {
    "db:migrate": "tsx ./src/migrate.ts"
  }
}
```

You can now run the migration script using the following command:

```bash
npm run db:migrate
```

You should see the `Migration completed` message in the terminal, indicating that the migration was successful.

### Seed the database

To test the application works, we need to add some example data to our tables. Create a new file at `src/seed.ts` and add the following code to it:

```typescript
// src/seed.ts

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { authors, books } from './schema';
import { config } from 'dotenv';

config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  await db.insert(authors).values([
    {
      name: 'J.R.R. Tolkien',
      bio: 'The creator of Middle-earth and author of The Lord of the Rings.',
    },
    {
      name: 'George R.R. Martin',
      bio: 'The author of the epic fantasy series A Song of Ice and Fire.',
    },
    {
      name: 'J.K. Rowling',
      bio: 'The creator of the Harry Potter series.',
    },
  ]);

  const authorRows = await db.select().from(authors);
  const authorIds = authorRows.map((row) => row.id);

  await db.insert(books).values([
    {
      title: 'The Fellowship of the Ring',
      authorId: authorIds[0],
    },
    {
      title: 'The Two Towers',
      authorId: authorIds[0],
    },
    {
      title: 'The Return of the King',
      authorId: authorIds[0],
    },
    {
      title: 'A Game of Thrones',
      authorId: authorIds[1],
    },
    {
      title: 'A Clash of Kings',
      authorId: authorIds[1],
    },
    {
      title: "Harry Potter and the Philosopher's Stone",
      authorId: authorIds[2],
    },
    {
      title: 'Harry Potter and the Chamber of Secrets',
      authorId: authorIds[2],
    },
  ]);
}

async function main() {
  try {
    await seed();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();
```

This script inserts some seed data into the `authors` and `books` tables. Add a new script to the `package.json` file that runs the seeding program.

```json
{
  "scripts": {
    "db:seed": "tsx ./src/seed.ts"
  }
}
```

Run the seed script using the following command:

```bash
npm run db:seed
```

You should see the `Seeding completed` message in the terminal, indicating that the seed data was inserted into the database.

### Implement the API endpoints

Now that the database is set up and populated with data, we can implement the API to query the authors and their books. Replace the existing `src/index.ts` file with the following code:

```typescript
// src/index.ts

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { config } from 'dotenv';

import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { authors, books } from './schema';

config({ path: '.env' });
const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello, this is a catalog of books!');
});

app.get('/authors', async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const sql = neon(DATABASE_URL);
  const db = drizzle(sql);

  const output = await db.select().from(authors);
  return c.json(output);
});

app.get('/books/:authorId', async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
  const sql = neon(DATABASE_URL);
  const db = drizzle(sql);

  const authorId = c.req.param('authorId');
  const output = await db
    .select()
    .from(books)
    .where(eq(books.authorId, Number(authorId)));
  return c.json(output);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
```

This code sets up a simple API with two endpoints: `/authors` and `/books/:authorId`. The `/authors` endpoint returns a list of all the authors, and the `/books/:authorId` endpoint returns a list of books written by the specific author with the given `authorId`.

Run the application using the following command:

```bash
npm run dev
```

This will start a `Hono.js` server at `http://localhost:3000`. Navigate to `http://localhost:3000/authors` and `http://localhost:3000/books/1` in your browser to check that the API works as expected.

## Migration after a schema change

To demonstrate how to execute a schema change, we'll add a new column to the `authors` table, listing the country of origin for each author.

### Generate the new migration

Modify the code in the `src/schema.ts` file to add the new column to the `authors` table:

```typescript
// src/schema.ts

import { pgTable, integer, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const authors = pgTable('authors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  bio: text('bio'),
  country: text('country'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  authorId: integer('author_id').references(() => authors.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

Now, we can run the following command to generate a new migration file:

```bash
npm run db:generate
```

This command generates a new migration file in the `drizzle` folder, with the SQL command to add the new column to the `authors` table.

### Run the migration

Run the migration script using the following command:

```bash
npm run db:migrate
```

You should see the `Migration completed` message in the terminal, indicating it was successful.

### Verify the schema change

To verify that the schema change was successful, run the application using the following command:

```bash
npm run dev
```

You can navigate to `http://localhost:3000/authors` in your browser to check that each author entry has a `country` field, currently set to `null`.

## Conclusion

In this guide, we set up a new TypeScript project using `Hono.js` and `Drizzle` ORM and connected it to a `Neon` Postgres database. We created a schema for the database, generated and ran migrations, and implemented API endpoints to query the database.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-drizzle" description="Run Neon database migrations using Drizzle" icon="github">Migrations with Neon and Drizzle</a>
</DetailIconCards>

## Resources

For more information on the tools used in this guide, refer to the following resources:

- [Drizzle ORM](https://orm.drizzle.team/)
- [Hono.js](https://hono.dev/)

<NeedHelp/>
