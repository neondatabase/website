---
title: Connect a NestJS application to Neon
subtitle: Set up a Neon project in seconds and connect from a NestJS application
summary: >-
  NestJS-to-Neon integration uses a DatabaseModule that provisions a connection
  pool via node-postgres, postgres.js, or the Neon serverless driver and injects
  it as a NestJS provider. Choose this guide when adding a Lakebase Postgres
  database on Neon to a TypeScript NestJS project without an ORM. The steps
  cover Neon project creation, DATABASE_URL configuration in .env, and wiring
  a service and GET controller endpoint to query the database.
enableTableOfContents: true
updatedOn: '2026-10-05T12:27:24.167Z'
---

<CopyPrompt src="/prompts/nestjs-prompt.md"
description="Pre-built prompt for connecting NestJS applications to Lakebase Postgres"/>

[NestJS](https://docs.nestjs.com/) is a framework for building Node.js server-side applications. This guide explains how to connect a NestJS application to Neon.

To create a Neon project and access it from a NestJS application:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a NestJS project and add dependencies

1. Create a NestJS project if you do not have one. For instructions, see [First steps](https://docs.nestjs.com/first-steps) in the NestJS documentation.

2. Add project dependencies using one of the following commands. Each installs the driver and `dotenv`, which the database module uses to load your connection string.

   <CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

   ```shell
   npm install pg dotenv
   npm install -D @types/pg
   ```

   ```shell
   npm install postgres dotenv
   ```

   ```shell
   npm install @neondatabase/serverless dotenv
   ```

   </CodeTabs>

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find your connection details by clicking **Connect** in the Console nav. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

## Create a sample table

The example endpoint reads from a table named `playing_with_neon`. Create it and add a few rows by running the following SQL in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or with `psql`:

```sql
CREATE TABLE playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
```

## Configure the Postgres client

New NestJS projects use ES modules, so the relative imports below include the `.js` extension. The `.js` extension also works in projects that compile to CommonJS.

### 1. Create a database module

To manage the connection to your Neon database, create a `DatabaseModule` in `src/database/database.module.ts`. This module creates the Postgres client and provides it to the rest of your application.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript
import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import pg from 'pg';

// Load Environment Variables
config({
  path: ['.env', '.env.production', '.env.local'],
});

const sql = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const dbProvider = {
  provide: 'POSTGRES_POOL',
  useValue: sql,
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
```

```typescript
import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import postgres from 'postgres';

// Load Environment Variables
config({
  path: ['.env', '.env.production', '.env.local'],
});

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

const dbProvider = {
  provide: 'POSTGRES_POOL',
  useValue: sql,
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
```

```typescript
import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { neon } from '@neondatabase/serverless';

// Load Environment Variables
config({
  path: ['.env', '.env.production', '.env.local'],
});

const sql = neon(process.env.DATABASE_URL!);

const dbProvider = {
  provide: 'POSTGRES_POOL',
  useValue: sql,
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
```

</CodeTabs>

### 2. Create a service for database interaction

Next, replace `src/app.service.ts` with a service that queries your database through the client provided by `DatabaseModule`.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript
import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'pg';

@Injectable()
export class AppService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: Pool) {}

  async getRows() {
    const { rows } = await this.sql.query('SELECT * FROM playing_with_neon');
    return rows;
  }
}
```

```typescript
import { Injectable, Inject } from '@nestjs/common';
import type { Sql } from 'postgres';

@Injectable()
export class AppService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: Sql) {}

  async getRows() {
    return await this.sql`SELECT * FROM playing_with_neon`;
  }
}
```

```typescript
import { Injectable, Inject } from '@nestjs/common';
import type { NeonQueryFunction } from '@neondatabase/serverless';

@Injectable()
export class AppService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: NeonQueryFunction<false, false>) {}

  async getRows() {
    return await this.sql`SELECT * FROM playing_with_neon`;
  }
}
```

</CodeTabs>

### 3. Integrate the database module and service

Import `DatabaseModule` and `AppService` in `src/app.module.ts`. This makes the database client and service available throughout your application.

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 4. Define a controller endpoint

Finally, replace `src/app.controller.ts` with a `GET` endpoint that returns the rows from your table through `AppService`.

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getRows() {
    return this.appService.getRows();
  }
}
```

If your project has the default `src/app.controller.spec.ts`, update or remove it: it tests `getHello()`, which the new controller replaces.

## Run the app

When you run `npm run start` you can expect to see output similar to the following at [localhost:3000](http://localhost:3000):

```json shouldWrap
[{"id":1,"name":"c4ca4238a0","value":0.39330545},{"id":2,"name":"c81e728d9d","value":0.14468245}]
```

</Steps>

## Next steps

- [Set up Managed Better Auth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>
