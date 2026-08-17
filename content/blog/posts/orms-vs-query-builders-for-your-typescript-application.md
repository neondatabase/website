---
title: ORMs vs. Query Builders for your Typescript application
description: Comparing type-safe SQL libraries
excerpt: >-
  Typed SQL libraries for Typescript are designed to provide a robust,
  maintainable, and developer-friendly interface between your code and the
  database. However, choosing the right library for your Typescript project can
  be difficult since they all offer similar functionalities. T...
date: '2023-05-16T13:21:31'
updatedOn: '2024-03-01T15:59:25'
category: community
categories:
  - community
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/orms-vs-query-builders-for-your-typescript-application/cover.jpg
  alt: null
isFeatured: false
seo:
  title: ORMs vs. Query Builders for your Typescript application - Neon
  description: Comparing type-safe SQL libraries
  keywords: []
  noindex: false
  ogTitle: ORMs vs. Query Builders for your Typescript application - Neon
  ogDescription: >-
    Typed SQL libraries for Typescript are designed to provide a robust,
    maintainable, and developer-friendly interface between your code and the
    database. However, choosing the right library for your Typescript project
    can be difficult since they all offer similar functionalities. This blog
    post will discuss choosing the right SQL library for your Typescript
    application by comparing […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/orms-vs-query-builders-for-your-typescript-application/cover.jpg
---

Typed SQL libraries for Typescript are designed to provide a robust, maintainable, and developer-friendly interface between your code and the database. However, choosing the right library for your Typescript project can be difficult since they all offer similar functionalities.

This blog post will discuss choosing the right SQL library for your Typescript application by comparing prominent Typescript-based libraries designed to work with Postgres databases: [Drizzle](https://github.com/drizzle-team/drizzle-orm), [Kysely](https://github.com/kysely-org/kysely), [Prisma](https://www.prisma.io/), and [Zapatos](https://jawj.github.io/zapatos/).

_Note that this article is not meant to be an in-depth comparison between the tools, and some of the examples are simplified. We highly encourage you to dig deeper into the libraries to decide which tool to use for your Typescript projects._

These four libraries typically fall under two different categories: Object-Relation Mappers and Query Builders. Let’s start by explaining what they are and the difference between them.

### Object Relation Mappers (ORMs)

ORMs manage the synchronization between your objects or classes and the corresponding database tables. However, they can have limitations regarding complex queries and can lead to [performance issues](https://en.wikipedia.org/wiki/Object%E2%80%93relational_impedance_mismatch). Those abstractions and “magic under the hood” are some of the motivations behind alternative solutions such as Query Builders.

### Query Builders

These libraries allow you to declare your tables in Typescript and write your queries in a way that closely mirrors raw SQL. They leverage the Typescript type system to infer the return types of any complex query. However, they come with limitations, especially when it comes to handling things like migrations.

We will also use the following criteria to compare the SQL libraries:

1. Learning curve
2. Support for complex queries
3. SQL migrations
4. Supported runtimes
5. And, most importantly, their communities

What about performance, You ask?

After a small experiment comparing Drizzle, Kysely, Prisma, and Zapatos with Postgres databases, their average latencies were within 3ms, while their 95th percentile was within 2ms.

Latency is in the eye of the beholder and heavily depends on the circumstances in which the framework is used. We leave it as an exercise for the reader to measure their latencies.

## Learning curve

We’ll pick two factors for the learning curve: schema definition and query syntax. In the first area, Kysely offers the lowest barrier to entry since it uses Typescript interfaces for a cleaner and more direct representation.

```javascript
// Example of a Kysely object

interface PersonTable {
  id: Generated<number>
  first_name: string
  gender: 'male' | 'female' | 'other'
  last_name: string | null
}
```

Drizzle and Zapatos also use Typescript but introduce new types and functions to create table schema.

```javascript
import { text, serial, pgTable } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

// Zapatos

  export type Table = 'authors';

  export interface Selectable {
    id: number;
    name: string;
    isLiving: boolean | null;
  }

  export interface Insertable {
    id?: number | db.Parameter<number> | db.DefaultType | db.SQLFragment;
    name: string | db.Parameter<string> | db.SQLFragment;
    isLiving?: boolean | db.Parameter<boolean> | null | db.DefaultType | db.SQLFragment;
  }
```

In contrast, Prisma uses its own Schema Language (PSL) for defining the database schema, relations, and constraints. Although the syntax is not so different from a language such as Typescript, PSL uses attributes and functions such as `@id` and `autoincrement` to modify the behavior of a field.

```javascript
model Person {
  id        Int      @id @default(autoincrement())
  firstName String
  lastName  String?
  gender    Gender
}
```

Luckily for us, SQL is the only language you need to know to generate your Typescript types. Drizzle, Kysely, Prisma, and Zapatos provide commands to introspect the database and generate Typescript-type definitions based on your schema. Kysely does not include a built-in CLI but utilizes a third-party library for code generation, `kysely-codegen`.

### Syntax philosophy

Do you like the SQL syntax? or prefer a Typescript-centric or even a human-readable syntax? Conveniently, there is much to choose from regarding SQL libraries in your Typescript application.

Drizzle’s principle is “If you know SQL, you know Drizzle ORM. Drizzle uses a SQL-like syntax for running queries and focuses on a function-based approach.

```javascript
// In Drizzle, the syntax read similarly to the query

let books = await db.select().from(booksTable);
```

Here is another example with Left JOIN:

```javascript
const cities = pgTable('cities', {
    id: serial('id').primaryKey(),
    name: text('name'),
  });
  
  const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name'),
    cityId: integer('city_id').references(() => cities.id),
  });
  
  const result = db.select().from(cities).leftJoin(users, eq(cities.id, users.cityId)).toSQL();
```

The code above would generate the following SQL query:

```sql
SELECT "cities"."id", "cities"."name", "users"."id", "users"."name", "users"."city_id" FROM "cities" LEFT JOIN "users" ON "cities"."id" = "users"."city_id"
```

Find out more about [printing SQL queries in Drizzle ORM’ in their ‘s docs](https://orm.drizzle.team/docs/goodies#printing-sql-query).

Kysely and Zapatos, on the other hand, use a Typescript-centric syntax focusing on type safety and interfaces.

```javascript
// Equivalent of "SELECT * FROM BOOKS"

// Kysely
books = await db.selectFrom('books').select(['author'])

// Zapatos
persons = await db.select('books', db.all).run(pool);
```

However, it’s important to note that although Knex inspires Kysely, it doesn’t share its abstraction layer. Kysely’s design decisions are driven by the “what you see is what you get” principle. For example:

```javascript
db.insertInto('person')
  .values(person)
  .onConflictDoNothing('id')
```

Will generate the following SQL:

```sql
insert into "person" (id, first_name, last_name)
values ($1, $2, $3)
on conflict ("id") do nothing
```

You can find more examples and side-by-side comparisons between Kysely code and compiled SQL on [Kysely’s community playground](https://kyse.link/?p=s&i=sTfsb0cbF7y112i4Ohom).

Syntax-wise, Prisma offers a human-readable approach because the ORM was designed with all kinds of data stores in mind, including SQL and NoSQL databases.

```javascript
// Prisma
books = await prisma.books.findMany()
```

In summary, Drizzle is the most intuitive if you are familiar with SQL. Zapatos and Kysely SQL keywords are Typescript-friendly, with WYSIWYG driving design decisions in Kysely. Prisma supports databases other than relational ones, which is why they favor a human-readable syntax that works with all.

## Support for complex SQL queries

In some cases, you need more complex SQL queries that are impossible using a standard ORM. That’s why support for raw SQL queries is important when choosing the right tool for your Typescript application.

Here, Drizzle, Kysely, Prisma, and Zapatos all support raw SQL queries using template tags, which make your queries SQL injection-proof. Below are examples of how to use raw SQL queries:

```bash
// Drizzle
await sql`SELECT * FROM ${users}`

// Kysely
await sql<User[]>`SELECT * FROM User`

// Prisma
await prisma.$queryRaw`SELECT * FROM User`

// Zapatos
await db.sql`SELECT * FROM User`
```

## SQL Migrations and the single source of truth

Migrations are essential to working with databases, as they allow developers to update and manage their schema over time.

Prisma and Drizzle provide a similar approach to handling migrations using their respective CLIs. At the same time, Kysely offers flexibility and strong typing but lacks a built-in CLI and requires developers to handle Typescript compilation.

_Note that Zapatos doesn’t handle migrations. However, its CLI speaks to your Postgres database to generate types, ensuring your schema and Typescript type definitions are always consistent._

Let’s have a closer look at both approaches to SQL migrations:

### Prisma

Prisma Migrate keeps track of the migration history in a dedicated \_prisma_migrations table, ensuring that your database schema is always up-to-date and consistent.

To create and apply migrations, you can use the Prisma CLI commands:

```bash
# Local development environment (Feature branch)
npx prisma migrate dev

# Push your changes to the feature pull request
npx prisma migrate deploy
```

The `prisma migrate dev` command tracks database changes, automatically generates SQL migration files in the /prisma/migrations folder and applies them to the database. It also updates the \_prisma_migrations table in the database.

The `prisma migrate deploy` command syncs your migration history from the development environment to your staging or production database. It compares applied migrations with the migration history, applies pending migrations, and updates the \_prisma_migrations table accordingly. This command is typically ran in a CI/CD pipeline.

### Drizzle

In Drizzle, the [`drizzle-kit`](https://www.npmjs.com/package/drizzle-kit) CLI generates SQL migrations. The CLI traverses the schema folder, generates a schema snapshot, and compares it to the previous version if there’s one. Based on the difference, it will generate all needed SQL migrations, and if there are any automatically unresolvable cases like renames, it will prompt the user for input.

You can run migrations with `drizzle-kit` using the following command:

```bash
npx drizzle-kit generate:pg --out migrations-folder --schema src/db/schema.ts
```

For schema file:

```javascript
// ./src/db/schema.ts

import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

const users = pgTable("users", {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 256 }),
  }, (table) => ({
    nameIdx: index("name_idx", table.fullName),
  })
);

export const authOtp = pgTable("auth_otp", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 256 }),
  userId: integer("user_id").references(() => users.id),
});
```

It will generate:

```sql
CREATE TABLE IF NOT EXISTS auth_otp (
 "id" SERIAL PRIMARY KEY,
 "phone" character varying(256),
 "user_id" INT
);

CREATE TABLE IF NOT EXISTS users (
 "id" SERIAL PRIMARY KEY,
 "full_name" character varying(256)
);

DO $$ BEGIN
 ALTER TABLE auth_otp ADD CONSTRAINT auth_otp_user_id_fkey FOREIGN KEY ("user_id") REFERENCES users(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS users_full_name_index ON users (full_name);
```

### Kysely

Kysely does not provide a built-in CLI for running migrations. Instead, it offers a flexible approach, allowing developers to write migration files using Typescript. Developers can create “up” and “down” functions in the migration files, which are responsible for updating the database schema to the next version or rolling back to a previous version.

```javascript
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Migration code
}

export async function down(db: Kysely<any>): Promise<void> {
  // Migration code
}
```

Migrations in Kysely can use the Kysely.schema module to modify the schema and run normal queries to modify data.

Here is a summary of the SQL migrations

|         | Pros                                                                                                                                                                                                                                                                                                                                                    | Cons                                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Prisma  | – Built-in CLI tool for generating and running migrations.<br /> – Ensures a consistent and up-to-date database schema. The prisma migrate dev command automatically generates SQL migration files and applies them to the database.<br /> – The prisma migrate deploy command syncs migration history between development and production environments. | – Not flexible when handling specific migration scenarios.                                                                       |
| Drizzle | – Built-in CLI tool for generating and running migrations. Automates the process of generating SQL migrations.<br /> – Prompts users for input in cases that cannot be resolved automatically, like renames.                                                                                                                                            | – May not cover all edge cases or complex scenarios.<br /> – May not provide as much control over migrations as other solutions. |
| Kysely  | – Flexible and customizable approach to migrations.<br /> – Strong typing for database schema changes.                                                                                                                                                                                                                                                  | – No built-in CLI for running migrations.                                                                                        |

Ultimately, the choice between SQL migration solutions will depend on your project requirements, the complexity of your schema, and your preference for a more flexible or automated approach.

## Supported Runtimes

When comparing edge runtime compatibility, Drizzle, Kysely, and Zapatos have a clear advantage over Prisma.

Drizzle, Kysely, and Zapatos work in edge-runtimes and Postgres using the `@neondatabase/serverless` driver or the `@vercel/kysely` driver, which allows developers to deploy their applications on edge networks, taking advantage of lower latency and improved performance.

In contrast, Prisma does not support edge-runtimes (yet) with Postgres. This limitation and lack of support for edge-runtimes may limit its applicability in scenarios where low latency and high availability are crucial.

## Community

We are comparing community engagement using Stack Overflow questions and the number of weekly downloads on npm.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/orms-vs-query-builders-for-your-typescript-application/image-5-1024x632-d5f82c63.png)

The data sheds light on the growth and community engagement of the four libraries. Among these, Prisma is the most popular with the highest weekly downloads, reaching 1,168,489 by 15 May 2023, marking a 58% increase from 1 January. Additionally, Prisma exhibits a robust community on Stack Overflow, with 2,819 associated tags, indicating a substantial user base and active discussion around this tool.

## Conclusion

In conclusion, type-safe SQL libraries offer powerful tools to enhance the development experience when working with Typescript and databases.

Despite the differences, community engagement, syntax preference, SQL migrations, and runtimes are the key determining factors in selecting a library.

Prisma remains the most popular of the four, with the largest community and number of questions on Stack Overflow, which makes running into errors more solvable.

Kysely and Zapatos’ more direct representation of table schema, Typescript-centric syntax, and edge-runtime compatibility make it an attractive option for developers looking for a modern and efficient solution.

Meanwhile, Drizzle’s function-based approach to schema definition and built-in CLI tool for managing migrations may appeal to those who prefer a SQL-like syntax and an automated migration process.

[Try Neon today for free](https://console.neon.tech), and let us know which SQL library you use for your Typescript applications and what other criteria you use to assess tools.
