---
title: Schema migration with Neon Postgres and Prisma ORM
subtitle: Set up Neon Postgres and run migrations for your Javascript project using
  Prisma ORM
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.404Z'
---

[Prisma](https://www.prisma.io/) is an open-source ORM for Node.js and Typescript, known for its ease of use and focus on type safety. It supports many databases, including Postgres, and provides a robust system for managing database schemas and migrations.

This guide walks you through using `Prisma` ORM with a `Neon` Postgres database in a Javascript project. We'll create a Node.js application, set up Prisma, and show how to run migrations using Prisma.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and test the application locally.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.
2. Select an existing project or click the `New Project` button to create a new one.

### Retrieve your Neon database connection string

Navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Keep your connection string handy for later use.

## Setting Up the Node application

### Create a new Node project

We'll create a simple catalog, with API endpoints that query the database for authors and a list of their books. Run the following command in your terminal to set up a new project using `Express.js`:

```bash
mkdir neon-prisma-guide && cd neon-prisma-guide
npm init -y && touch .env index.js
npm pkg set type="module" && npm pkg set scripts.start="node index.js"
npm install express
```

To use the Prisma ORM for making queries, install the `@prisma/client` package and the Prisma CLI. The CLI is only needed as a development dependency to generate the Prisma Client for the given schema.

```bash
npm install @prisma/client && npm install prisma --save-dev
npx prisma init
```

These commands create a new `prisma` folder in your project with a `schema.prisma` file, where we will define the database schema for our application.

### Configure Prisma to Use Neon Database

Open the `prisma/schema.prisma` file and update the `datasource db` block with your Neon database connection details:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Add the `DATABASE_URL` environment variable to your `.env` file, which you'll use to connect to your Neon database. Use the connection string that you obtained from the Neon Console earlier:

```bash
# .env
DATABASE_URL=NEON_DATABASE_CONNECTION_STRING
```

### Define the Database schema

In the `prisma/schema.prisma` file, add the following model definitions:

```prisma
model Author {
  @@map("authors")

  id        Int      @id @default(autoincrement())
  name      String
  bio       String?
  createdAt DateTime @default(now()) @map("created_at")
  books     Book[]
}

model Book {
  @@map("books")

  id        Int      @id @default(autoincrement())
  title     String
  authorId  Int      @map("author_id")
  createdAt DateTime @default(now()) @map("created_at")
  author    Author   @relation(fields: [authorId], references: [id])
}
```

Two models are defined above: `Author`, which contains information about authors, and `Book`, for details about published books. The `Book` model includes a foreign key that references the `Author` model.

### Generate Prisma client and run migrations

To create and apply migrations based on your schema, run the following command in the terminal:

```bash
npx prisma migrate dev --name init
```

This command generates migration files written in SQL corresponding to our schema definitions and applies them to create the tables in your Neon database. We used the `--name` flag to name the migration.

The command also generates a Prisma Client that is aware of our schemas:

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```

We'll use this client later to interact with the database.

### Seed the Database

To test that the application works, we need to add some example data to our tables. Create a `seed.js` file in your project and add the following code to it:

```javascript
// seed.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seed = async () => {
  const authors = [
    {
      name: 'J.R.R. Tolkien',
      bio: 'The creator of Middle-earth and author of The Lord of the Rings.',
      books: {
        create: [
          { title: 'The Hobbit' },
          { title: 'The Fellowship of the Ring' },
          { title: 'The Two Towers' },
          { title: 'The Return of the King' },
        ],
      },
    },
    {
      name: 'George R.R. Martin',
      bio: 'The author of the epic fantasy series A Song of Ice and Fire.',
      books: {
        create: [{ title: 'A Game of Thrones' }, { title: 'A Clash of Kings' }],
      },
    },
    {
      name: 'J.K. Rowling',
      bio: 'The creator of the Harry Potter series.',
      books: {
        create: [
          { title: "Harry Potter and the Philosopher's Stone" },
          { title: 'Harry Potter and the Chamber of Secrets' },
        ],
      },
    },
  ];

  for (const author of authors) {
    await prisma.author.create({
      data: author,
    });
  }
};

async function main() {
  try {
    await seed();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

Run the seed script to populate the database with the initial data:

```bash
node seed.js
```

You should see the `Seeding completed` message in the terminal, indicating that the seed data was inserted into the database.

### Implementing the API Endpoints

Now that the database is set up and populated with data, we can implement the API to query the authors and their books. We'll use [Express](https://expressjs.com/), which is a minimal web application framework for Node.js.

Create an `index.ts` file at the project root, and add the following code to set up your Express server:

```javascript
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  res.send('Hello World! This is a book catalog.');
});

app.get('/authors', async (req, res) => {
  const authors = await prisma.author.findMany();
  res.json(authors);
});

app.get('/books/:author_id', async (req, res) => {
  const authorId = parseInt(req.params.author_id);
  const books = await prisma.book.findMany({
    where: {
      authorId: authorId,
    },
  });
  res.json(books);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

This code sets up a simple API with two endpoints: `/authors` and `/books/:authorId`. The `/authors` endpoint returns a list of all the authors, and the `/books/:authorId` endpoint returns a list of books written by the specific author with the given `authorId`.

Run the application using the following command:

```bash
npm run start
```

This will start the server at `http://localhost:3000`. Navigate to `http://localhost:3000/authors` and `http://localhost:3000/books/1` in your browser to check that the API works as expected.

## Migration after a schema change

To demonstrate how to execute a schema change, we'll add a new column to the `authors` table, listing the country of origin for each author.

### Update the Prisma model

Modify the `Author` model in the `prisma/schema.prisma` file to add the new `country` field:

```prisma

model Author {
  @@map("authors")

  id        Int      @id @default(autoincrement())
  name      String
  bio       String?
  country   String?
  createdAt DateTime @default(now()) @map("created_at")
  books     Book[]
}
```

### Generate and apply the migration

Run the following command to generate a new migration and apply it to the database:

```bash
npx prisma migrate dev --name add-country
```

This command generates a new migration file to add the new field and applies it to the database. It also updates the Prisma client to reflect the change in the schema.

### Verify the migration

To verify the migration, run the application again:

```bash
npm run start
```

You can navigate to `http://localhost:3000/authors` in your browser to check that each author entry has a `country` field, currently set to `null`.

## Conclusion

In this guide, we set up a new Javascript project using `Express.js` and `Prisma` ORM and connected it to a `Neon` Postgres database. We created a schema for the database, generated and ran migrations, and implemented API endpoints to query the database.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-prisma" description="Run Neon database migrations using Prisma" icon="github">Migrations with Neon and Prisma</a>
</DetailIconCards>

## Resources

For more information on the tools used in this guide, refer to the following resources:

- [Prisma ORM](https://www.prisma.io/)
- [Express.js](https://expressjs.com/)

<NeedHelp/>
