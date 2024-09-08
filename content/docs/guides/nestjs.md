---
title: Connect a NestJS application to Neon
subtitle: Set up a Neon project in seconds and connect from a NestJS application
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.660Z'
---

NestJS is a framework for building efficient, scalable Node.js server-side applications<sup><a target="_blank" href="https://docs.nestjs.com/">1</a></sup>. This guide explains how to connect NestJS with Neon using a secure server-side request.

To create a Neon project and access it from a NestJS application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create a NestJS project and add dependencies](#create-a-nestjs-project-and-add-dependencies)
3. [Configure a Postgres client](#configure-the-postgres-client)
4. [Run the app](#run-the-app)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a NestJS project and add dependencies

1. Create a NestJS project if you do not have one. For instructions, see [Quick Start](https://docs.nestjs.com/first-steps), in the NestJS documentation.

2. Add project dependencies using one of the following commands:

   <CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

   ```shell
   npm install pg
   ```

   ```shell
   npm install postgres
   ```

   ```shell
   npm install @neondatabase/serverless
   ```

   </CodeTabs>

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

## Configure the Postgres client

### 1. Create a Database Module

To manage the connection to your Neon database, start by creating a **DatabaseModule** in your NestJS application. This module will handle the configuration and provisioning of the Postgres client.

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

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

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

const sql = neon(process.env.DATABASE_URL);

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

### 2. Create a Service for Database Interaction

Next, implement a service to facilitate interaction with your Postgres database. This service will use the database connection defined in the DatabaseModule.

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getTable(name: string): Promise<any[]> {
    const client = await this.sql.connect();
    const { rows } = await client.query(`SELECT * FROM ${name}`);
    return rows;
  }
}
```

```typescript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getTable(name: string): Promise<any[]> {
    return await this.sql(`SELECT * FROM ${name}`);
  }
}
```

```typescript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getTable(name: string): Promise<any[]> {
    return await this.sql(`SELECT * FROM ${name}`);
  }
}
```

</CodeTabs>

### 3. Integrate the Database Module and Service

Import and inject the DatabaseModule and AppService into your AppModule. This ensures that the database connection and services are available throughout your application.

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 4. Define a Controller Endpoint

Finally, define a `GET` endpoint in your AppController to fetch data from your Postgres database. This endpoint will use the AppService to query the database.

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getTable() {
    return this.appService.getTable('playing_with_neon');
  }
}
```

## Run the app

When you run `npm run start` you can expect to see output similar to the following at [localhost:3000](localhost:3000):

```shell shouldWrap
[{"id":1,"name":"c4ca4238a0","value":0.39330545},{"id":2,"name":"c81e728d9d","value":0.14468245}]
```

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-nestjs" description="Get started with NestJS and Neon" icon="github">Get started with NestJS and Neon</a>

</DetailIconCards>

<NeedHelp/>
