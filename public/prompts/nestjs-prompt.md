# 💡 AI Prompt: Connect NestJS to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the NestJS framework. Your task is to configure the current NestJS project to connect to a Neon Postgres database.

**Purpose:** To connect the current NestJS project to Neon Postgres by installing a database driver, configuring environment variables, creating a dedicated `DatabaseModule`, and implementing a test route to validate the connection.

**Scope:**
- Must be run inside an existing NestJS project directory.
- Assumes the user has a Neon project and access to their full connection string.
- All file modifications should follow NestJS conventions for modules, providers, and dependency injection.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing NestJS project directory. Do not proceed if no NestJS project is detected. You can identify a NestJS project by the presence of `@nestjs/core` in the `dependencies` section of `package.json`.
- **Manual Setup for New Projects:** If the user does not have a project yet, instruct them to run the following commands manually in their terminal:

  ⚠️ IMPORTANT: You should never attempt to run these commands automatically. They are interactive and require user input that cannot be automated by you as an AI agent. Ask the user to run them themselves even if they request you to do so.

  ```bash
  npm i -g @nestjs/cli
  nest new my-nestjs-app
  ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open NestJS project as follows:

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options:

    *   **`@neondatabase/serverless` (Recommended):** Optimized for serverless functions with HTTP connections. A great choice for NestJS applications deployed on Vercel or AWS Lambda.
    *   **`postgres` (postgres.js):** A fast, full-featured client, excellent for long-running Node.js server environments.
    *   **`pg` (node-postgres):** The classic, widely-used driver for Node.js.

    Make sure to ask the user to choose one of the above options and do not proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2.  Based on the user's selection, run the corresponding installation command. Also install `dotenv` for managing environment variables.

    ```bash
    # For @neondatabase/serverless
    npm install @neondatabase/serverless

    # For postgres (postgres.js)
    npm install postgres

    # For pg (node-postgres)
    npm install pg

    # Install dotenv for all options
    npm i -D dotenv
    ```

---

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 3. Create a Centralized Database Module

To manage the database connection according to NestJS best practices, create a new module.

1.  Create a new directory `src/database`.
2.  Inside `src/database`, create a file named `database.module.ts`.
3.  **Use the code block that corresponds to the driver selected in Step 1** to populate `src/database/database.module.ts`. This module will create and provide an injectable database connection client.

    #### Option A: Using `@neondatabase/serverless`

    ```typescript title="src/database/database.module.ts"
    import 'dotenv/config';
    import { Module } from '@nestjs/common';
    import { neon } from '@neondatabase/serverless';

    const dbProvider = {
      provide: 'NEON_CONNECTION',
      useValue: neon(process.env.DATABASE_URL!),
    };

    @Module({
      providers: [dbProvider],
      exports: [dbProvider],
    })
    export class DatabaseModule {}
    ```

    #### Option B: Using `postgres` (postgres.js)

    ```typescript title="src/database/database.module.ts"
    import 'dotenv/config';
    import { Module } from '@nestjs/common';
    import postgres from 'postgres';

    const dbProvider = {
      provide: 'NEON_CONNECTION',
      useValue: postgres(process.env.DATABASE_URL!, { ssl: 'require' }),
    };

    @Module({
      providers: [dbProvider],
      exports: [dbProvider],
    })
    export class DatabaseModule {}
    ```

    #### Option C: Using `pg` (node-postgres)

    ```typescript title="src/database/database.module.ts"
    import 'dotenv/config';
    import { Module } from '@nestjs/common';
    import { Pool } from 'pg';

    const dbProvider = {
      provide: 'NEON_CONNECTION',
      useValue: new Pool({ connectionString: process.env.DATABASE_URL! }),
    };

    @Module({
      providers: [dbProvider],
      exports: [dbProvider],
    })
    export class DatabaseModule {}
    ```

---

### 4. Integrate the Database Module and Test Connection

Modify the main application files to use the new `DatabaseModule` and create a test endpoint.

1.  **Import the module:** Open `src/app.module.ts` and add `DatabaseModule` to the `imports` array.

    ```typescript title="src/app.module.ts"
    import { Module } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { DatabaseModule } from './database/database.module'; // <-- Import this

    @Module({
      imports: [DatabaseModule], // <-- Add this
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}
    ```

2.  **Update the service:** Open `src/app.service.ts` and replace its contents to inject the database connection and query the PostgreSQL version. **Use the code block that corresponds to the driver selected in Step 1.**

    #### Option A & B: For `@neondatabase/serverless` or `postgres`

    ```typescript title="src/app.service.ts"
    import { Injectable, Inject } from '@nestjs/common';

    @Injectable()
    export class AppService {
      constructor(@Inject('NEON_CONNECTION') private readonly sql: any) {}

      async getDbVersion(): Promise<object> {
        try {
          const result = await this.sql`SELECT version()`;
          const version = result[0]?.version || 'No version found';
          return {
            message: 'Connection successful!',
            version: version,
          };
        } catch (error) {
          console.error('Database query failed:', error);
          throw new Error('Failed to connect to the database.');
        }
      }
    }
    ```

    #### Option C: For `pg` (node-postgres)

    ```typescript title="src/app.service.ts"
    import { Injectable, Inject } from '@nestjs/common';
    import { Pool } from 'pg';

    @Injectable()
    export class AppService {
      constructor(@Inject('NEON_CONNECTION') private readonly pool: Pool) {}

      async getDbVersion(): Promise<object> {
        let client;
        try {
          client = await this.pool.connect();
          const { rows } = await client.query('SELECT version()');
          const version = rows[0]?.version || 'No version found';
          return {
            message: 'Connection successful!',
            version: version,
          };
        } catch (error) {
          console.error('Database query failed:', error);
          throw new Error('Failed to connect to the database.');
        } finally {
          client?.release();
        }
      }
    }
    ```

3.  **Update the controller:** Open `src/app.controller.ts` and modify the root `GET` endpoint to call the new service method.

    ```typescript title="src/app.controller.ts"
    import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
    import { AppService } from './app.service';

    @Controller()
    export class AppController {
      constructor(private readonly appService: AppService) {}

      @Get()
      async getDbVersion() {
        try {
          return await this.appService.getDbVersion();
        } catch (error) {
          throw new InternalServerErrorException(error.message);
        }
      }
    }
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Start the NestJS development server:
    ```bash
    npm run start:dev
    ```
3.  Inform the user that the setup is complete. To test the connection, they can visit `http://localhost:3000` in their browser or use a tool like `curl`. They should see a JSON response containing the PostgreSQL version from their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A supported PostgreSQL driver (`@neondatabase/serverless`, `postgres`, or `pg`) and `dotenv` are installed.
- A `.env` file is present or has been created with a `DATABASE_URL` key.
- A `src/database/database.module.ts` file exists and correctly provides the chosen database client under the `NEON_CONNECTION` token.
- `src/app.module.ts` correctly imports the `DatabaseModule`.
- `src/app.service.ts` correctly injects the `NEON_CONNECTION` token and uses the corresponding driver syntax.
- The database query logic is wrapped in a `try...catch` block to handle potential errors gracefully.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any `.ts` source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined modules, controllers, or providers. Only modify the default files as specified (`app.module.ts`, `app.service.ts`, `app.controller.ts`).