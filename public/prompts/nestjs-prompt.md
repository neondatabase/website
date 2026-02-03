# 💡 AI Prompt: Connect NestJS to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and the NestJS framework. Your task is to configure the current NestJS project to connect to a Neon Postgres database.

**Purpose:** Configure a NestJS project to connect to Neon Postgres. Install a database driver, set up environment variables, create a `DatabaseModule`, and implement a test route.

**Scope:**
Must be run inside an existing NestJS project directory (check `package.json` for `@nestjs/core` dependency). If no project exists, first run:
```bash
npm i -g @nestjs/cli
nest new my-nestjs-app --skip-git --package-manager npm
```

---

## Instructions

### 1. Install Dependencies

**Prompt user to select a PostgreSQL driver:**
- `@neondatabase/serverless` (Recommended): Optimized for serverless functions on Vercel/AWS Lambda
- `postgres` (postgres.js): Fast, full-featured for long-running Node.js servers
- `pg` (node-postgres): Classic, widely-used driver for Node.js

Wait for user choice, then run:

```bash
npm install @neondatabase/serverless    # or postgres or pg based on user choice
npm i -D dotenv
```

### 2. Configure Environment Variables

Create `.env` if missing, add:

```env
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Prompt user to replace with their Neon connection string** (Neon Console → Project → Connect)

### 3. Create Database Module

Create `src/database/database.module.ts` with the driver-specific code:

**For @neondatabase/serverless:**
```ts
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

**For postgres:**
```ts
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

**For pg:**
```ts
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

### 4. Integrate Module and Test Connection

**Update `src/app.module.ts`:**
```ts
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

**Update `src/app.service.ts`:**

*For @neondatabase/serverless or postgres:*
```ts
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('NEON_CONNECTION') private readonly sql: any) {}

  async getDbVersion(): Promise<object> {
    try {
      const result = await this.sql`SELECT version()`;
      const version = result[0]?.version || 'No version found';
      return { message: 'Connection successful!', version };
    } catch (error) {
      console.error('Database query failed:', error);
      throw new Error('Failed to connect to the database.');
    }
  }
}
```

*For pg:*
```ts
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
      return { message: 'Connection successful!', version };
    } catch (error) {
      console.error('Database query failed:', error);
      throw new Error('Failed to connect to the database.');
    } finally {
      client?.release();
    }
  }
}
```

**Update `src/app.controller.ts`:**
```ts
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

## Next Steps

Verify DATABASE_URL is set (no placeholders), then:
```bash
npm run start:dev
```

Test at `http://localhost:3000` - should return JSON with PostgreSQL version.

## Validation

- Project has `@nestjs/core` and a postgres driver installed
- `.env` with `DATABASE_URL` exists
- `src/database/database.module.ts` exports `NEON_CONNECTION` provider
- `src/app.module.ts` imports `DatabaseModule`
- `src/app.service.ts` injects `NEON_CONNECTION` and queries the database

## Important

- Never hardcode credentials; always use `process.env`
- Never output user's connection string in responses
- Only modify specified files (`app.module.ts`, `app.service.ts`, `app.controller.ts`)
