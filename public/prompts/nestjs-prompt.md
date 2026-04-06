# 💡 AI Prompt: Connect NestJS to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the NestJS framework. Your task is to configure the current NestJS project to connect to a Neon Postgres database.

**Purpose:** To connect the current NestJS project to Neon Postgres by installing a database driver, configuring environment variables, creating a `DatabaseModule` with the `POSTGRES_POOL` provider pattern from the Neon NestJS guide, and wiring `AppService` / `AppController` to query a sample table.

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

## ⚡ Step 1: Run neon init (REQUIRED)

**You MUST execute this command before writing any code or installing any packages.** Do not skip this step. Do not manually replicate what it does.

```bash
npx -y neonctl@latest init
```

`neon init` handles everything automatically: it authenticates the user with Neon (sign up or log in), then installs the AI development tooling for the user's coding environment (MCP server, agent skills, IDE extensions, and plugins).

After it completes, instruct the user to **restart their editor**. Once restarted, you can guide them through an interactive "Get started with Neon" flow to create a project, obtain a connection string, store it in the project, install client libraries, and configure the app, including optional [Neon Auth](https://neon.tech/docs/auth/overview) setup.

**If `neon init` succeeds, skip to [Next Steps](#-next-steps).** The rest of the manual instructions below are not needed.

---

## 🛠️ Step 2: Manual setup (fallback — only if `init` is unavailable)

Use this section **only** if:
- `neon init` failed or is unavailable in this environment
- The user explicitly asked for manual configuration

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

    npm install dotenv
    ```

---

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 3. Create a Database Module

Create `src/database/database.module.ts` that loads `.env` with `dotenv`'s `config()` and provides the client under the token `POSTGRES_POOL`, matching the Neon NestJS guide.

1.  Create a new directory `src/database`.
2.  Inside `src/database`, create `database.module.ts`.
3.  **Use the code block that corresponds to the driver selected in Step 1.**

    #### Option A: Using `pg` (node-postgres)

    ```typescript title="src/database/database.module.ts"
    import { config } from 'dotenv';
    import { Module } from '@nestjs/common';
    import pg from 'pg';

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

    #### Option B: Using `postgres` (postgres.js)

    ```typescript title="src/database/database.module.ts"
    import { config } from 'dotenv';
    import { Module } from '@nestjs/common';
    import postgres from 'postgres';

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

    #### Option C: Using `@neondatabase/serverless`

    ```typescript title="src/database/database.module.ts"
    import { config } from 'dotenv';
    import { Module } from '@nestjs/common';
    import { neon } from '@neondatabase/serverless';

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

---

### 4. Create `AppService` (database access)

**Use the code block that corresponds to the driver selected in Step 1.**

#### Option A: Using `pg` (node-postgres)

```typescript title="src/app.service.ts"
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

#### Option B: Using `postgres` (postgres.js)

```typescript title="src/app.service.ts"
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getTable(name: string): Promise<any[]> {
    return await this.sql(`SELECT * FROM ${name}`);
  }
}
```

#### Option C: Using `@neondatabase/serverless`

```typescript title="src/app.service.ts"
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getTable(name: string): Promise<any[]> {
    return await this.sql(`SELECT * FROM ${name}`);
  }
}
```

---

### 5. Integrate `DatabaseModule` and `AppController`

1.  **Import the module:** Open `src/app.module.ts` and add `DatabaseModule` to the `imports` array.

    ```typescript title="src/app.module.ts"
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

2.  **Controller:** Open `src/app.controller.ts` and expose a root `GET` that loads rows from the sample table `playing_with_neon` (create this table in Neon if needed, or change the name to match an existing table).

    ```typescript title="src/app.controller.ts"
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

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Ensure a `playing_with_neon` table exists (or the table name used in `AppController`).
3.  Start the NestJS development server:
    ```bash
    npm run start:dev
    ```
4.  Inform the user that the setup is complete. They can visit `http://localhost:3000` or use `curl` and should see JSON rows from the queried table, as in the Neon NestJS guide.
5.  **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A supported PostgreSQL driver (`@neondatabase/serverless`, `postgres`, or `pg`) and `dotenv` are installed.
- A `.env` file is present or has been created with a `DATABASE_URL` key.
- `src/database/database.module.ts` calls `config({ path: ['.env', '.env.production', '.env.local'] })` and provides the client under the `POSTGRES_POOL` token.
- For `postgres` (postgres.js), the client uses `{ ssl: 'require' }`; for `pg`, the pool uses `connectionString: process.env.DATABASE_URL` only, as in the guide.
- `src/app.module.ts` imports `DatabaseModule`.
- `src/app.service.ts` injects `POSTGRES_POOL` and implements `getTable` with the guide's driver-specific pattern.
- `src/app.controller.ts` calls `getTable('playing_with_neon')` (or an agreed table name).

---

## ❌ Do Not

- **Do not skip `neon init`.** Do not scaffold the project or install packages before running `npx -y neonctl@latest init`. It must be the first step.
- **Do not use third-party auth libraries** (e.g. `next-auth`, `Auth.js`, Passport) when the user asks for Neon. Neon includes Neon Auth (`@neondatabase/auth`).
- **Do not hardcode credentials** or sensitive information in any `.ts` source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined modules, controllers, or providers. Only modify the default files as specified (`app.module.ts`, `app.service.ts`, `app.controller.ts`).