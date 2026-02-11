---
title: Schema migrations with Prisma and Neon
subtitle: Learn how to manage database schema changes using Prisma Migrate with Neon
summary: >-
  Step-by-step guide for managing database schema changes using Prisma Migrate
  with Neon, including setting up a Node.js application and creating a book
  catalog API while applying schema migrations.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.032Z'
---

<CopyPrompt src="/prompts/prisma-prompt.md" 
description="Pre-built prompt for connecting Node/TypeScript applications to Neon using Prisma ORM."/>

This tutorial walks you through building a Node.js application with Prisma ORM and Neon, focusing on how to create and apply schema migrations. You'll build a simple book catalog API while learning the migration workflow.

<Admonition type="tip">
If you just need to connect Prisma to Neon without a full tutorial, see [Connect from Prisma to Neon](/docs/guides/prisma).
</Admonition>

## Prerequisites

- A [Neon account and project](/docs/get-started-with-neon/signing-up)
- [Node.js 18+](https://nodejs.org/) installed
- Both connection strings from your Neon Console (pooled and direct)

## Create the project

Set up a new Node.js project with Express and Prisma:

```bash
mkdir neon-prisma-migrations && cd neon-prisma-migrations
npm init -y
npm pkg set type="module"
npm install express dotenv @prisma/client @prisma/adapter-neon
npm install prisma typescript tsx @types/node --save-dev
npx prisma init
```

## Configure Prisma for Neon

### Set up environment variables

Add both connection strings to your `.env` file. Get these from your Neon Console by clicking **Connect**:

```ini shouldWrap
# Pooled connection for your application (note the -pooler suffix)
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require"

# Direct connection for Prisma CLI (migrations, introspection)
DIRECT_URL="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require"
```

<Admonition type="important">
Prisma Migrate requires a direct connection to perform schema changes. The pooled connection is used by your application at runtime.
</Admonition>

### Configure prisma.config.ts

Update the `prisma.config.ts` file in your project root:

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'),
  },
})
```

### Update the Prisma schema

Replace the contents of `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Author {
  id        Int      @id @default(autoincrement())
  name      String
  bio       String?
  createdAt DateTime @default(now()) @map("created_at")
  books     Book[]

  @@map("authors")
}

model Book {
  id        Int      @id @default(autoincrement())
  title     String
  authorId  Int      @map("author_id")
  createdAt DateTime @default(now()) @map("created_at")
  author    Author   @relation(fields: [authorId], references: [id])

  @@map("books")
}
```

## Create and run your first migration

Run the following command to create your initial migration:

```bash
npx prisma migrate dev --name init
```

This command:

1. Creates a `prisma/migrations` folder with SQL migration files
2. Applies the migration to your Neon database
3. Generates the Prisma Client

You should see output confirming the migration was applied.

## Set up Prisma Client

Create `src/db.ts` to instantiate Prisma Client with the Neon adapter:

```typescript
import 'dotenv/config'
import { PrismaClient } from './generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter })
```

## Seed the database

Create `src/seed.ts` to populate the database with sample data:

```typescript
import { prisma } from './db'

async function seed() {
  const authors = [
    {
      name: 'J.R.R. Tolkien',
      bio: 'Creator of Middle-earth and author of The Lord of the Rings.',
      books: {
        create: [
          { title: 'The Hobbit' },
          { title: 'The Fellowship of the Ring' },
          { title: 'The Two Towers' },
        ],
      },
    },
    {
      name: 'George R.R. Martin',
      bio: 'Author of the epic fantasy series A Song of Ice and Fire.',
      books: {
        create: [
          { title: 'A Game of Thrones' },
          { title: 'A Clash of Kings' },
        ],
      },
    },
  ]

  for (const author of authors) {
    await prisma.author.create({ data: author })
  }

  console.log('✅ Database seeded')
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run the seed script:

```bash
npx tsx src/seed.ts
```

## Build the API

Create `src/index.ts` with Express endpoints:

```typescript
import express from 'express'
import { prisma } from './db'

const app = express()
const port = process.env.PORT || 3000

app.get('/authors', async (req, res) => {
  const authors = await prisma.author.findMany({
    include: { books: true },
  })
  res.json(authors)
})

app.get('/books', async (req, res) => {
  const books = await prisma.book.findMany({
    include: { author: true },
  })
  res.json(books)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
```

Add a start script to `package.json`:

```bash
npm pkg set scripts.start="tsx src/index.ts"
```

Start the server:

```bash
npm start
```

Visit `http://localhost:3000/authors` to see the data.

## Make a schema change

Now let's add a `country` field to the `Author` model to demonstrate the migration workflow.

### Update the model

Modify the `Author` model in `prisma/schema.prisma`:

```prisma
model Author {
  id        Int      @id @default(autoincrement())
  name      String
  bio       String?
  country   String?
  createdAt DateTime @default(now()) @map("created_at")
  books     Book[]

  @@map("authors")
}
```

### Generate and apply the migration

```bash
npx prisma migrate dev --name add-author-country
```

Prisma creates a new migration file and applies it. The Prisma Client is automatically regenerated.

### Verify the change

Restart your server and check `http://localhost:3000/authors`. Each author now has a `country` field (set to `null` for existing records).

## Migration workflow summary

The typical workflow for schema changes with Prisma and Neon:

1. **Modify your schema** — Update models in `prisma/schema.prisma`
2. **Generate migration** — Run `npx prisma migrate dev --name descriptive-name`
3. **Review the migration** — Check the generated SQL in `prisma/migrations/`
4. **Test locally** — Verify your application works with the changes
5. **Deploy** — In production, use `npx prisma migrate deploy`

<Admonition type="tip">
For production deployments, always use `prisma migrate deploy` instead of `prisma migrate dev`. The `deploy` command only applies pending migrations without generating new ones.
</Admonition>

## Source code

Find the complete source code for this tutorial on GitHub:

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-prisma" description="Run Neon database migrations using Prisma" icon="github">Migrations with Neon and Prisma</a>
</DetailIconCards>

## Next steps

- [Connect from Prisma to Neon](/docs/guides/prisma) — Connection setup reference
- [Prisma Migrate documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate) — Deep dive into Prisma migrations
- [Neon branching](/docs/introduction/branching) — Use database branches to test migrations safely

<NeedHelp/>
