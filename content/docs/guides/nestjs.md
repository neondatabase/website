---
title: Connect a NestJS application to Neon
subtitle: Connect a NestJS app to Lakebase Postgres on Neon, query it from a controller, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a NestJS app to Lakebase Postgres on Neon: create the app with the
  Nest CLI (ES modules), optionally add Neon's agent skills, create a Neon
  project (Neon CLI, API, or Console), link it with the Neon CLI to pull
  DATABASE_URL into .env.local, load it with @nestjs/config, optionally develop
  on a Neon branch, and query it with node-postgres, postgres.js, or the Neon
  serverless driver from a database module, a service, and a controller.
  Covers NestJS 12 on Node.js 22.22.3, 24.15, or 26 or later, plus deployment,
  troubleshooting, and Neon's other backend services from NestJS.
enableTableOfContents: true
updatedOn: '2026-11-19T01:53:55.480Z'
---

<PromptBlock src="/prompts/nestjs-prompt.md" labels={["Set up your agent and follow this guide", "Look up NestJS's docs", "Connect your NestJS app"]} />

<Steps>

## Create a NestJS app

Install [Node.js](https://nodejs.org/en/download) 22.22.3 or later, 24.15 or later, or 26 or later. Run `node -v` to check, and upgrade if your version is older or on another line. `nest new` doesn't support the 23.x and 25.x lines. A NestJS 12 app itself runs on Node.js 20.19 or later (22.12 or later on the 22.x line; 21.x isn't supported).

Then create a project if you don't have one (see [First steps](https://docs.nestjs.com/first-steps.md) in the NestJS docs):

```bash filename="Terminal"
npx @nestjs/cli new my-app --package-manager npm --no-observe
cd my-app
```

`--package-manager npm` and `--no-observe` answer two of the CLI's questions. In a terminal, it also asks for a module system; choose **ESM (ES Modules)**, which this guide uses (without a terminal, it uses ESM). The CLI creates a git repository and a `.gitignore` that already excludes `.env` and `.env.local`, which will hold your connection string.

The project also gets an `AGENTS.md` that points coding agents to the NestJS docs and Nest's own packages. It has a section on NestJS Observe, Nest's observability service; skip it unless you use Observe. In an ESM project, relative imports end in `.js`.

If your existing app uses CommonJS, keep it. As NestJS's [migration guide](https://docs.nestjs.com/migration-guide.md) says for CommonJS, drop the `.js` extensions from the relative imports below and call `bootstrap()` without `await` in `src/main.ts`. NestJS 12's packages are ES modules, which a CommonJS app loads on Node.js 20.19 or later (22.12 or later on the 22.x line). A CommonJS project's Jest tests load NestJS 12's packages only on Node.js 24.9 or later.

On NestJS 11, the app code is the same (with the CommonJS note if your app uses CommonJS); to upgrade, follow the migration guide.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

NestJS publishes its docs for AI agents at [docs.nestjs.com/llms.txt](https://docs.nestjs.com/llms.txt). The prompt above has your agent look up NestJS docs there.

## Create a Neon project

Skip this step if you already have a Neon project you want to use.

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and Managed Better Auth run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)).

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), sign in, and create the project:

```bash filename="Terminal"
npm i -g neon@latest
neon login
neon projects create --name my-app --region-id aws-us-east-2 --no-secrets
```

`--region-id` sets the region; pass a different one to pick another of the regions above. `--no-secrets` keeps the connection string out of the output, since the next step pulls it into your env file. Pass `--org-id` to choose the organization (find IDs with `neon orgs list`).

</TabItem>

<TabItem>

Create an [API key](https://console.neon.tech/app/settings/api-keys), export it, then create the project in your organization:

```bash filename="Terminal"
export NEON_API_KEY=napi_...

curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "my-app", "region_id": "aws-us-east-2", "org_id": "<org-id>"}}'
```

The response includes the project's connection string in `connection_uris[0].connection_uri`. See [Create a project with the API](/docs/manage/projects#create-a-project-with-the-api) for the other options.

</TabItem>

<TabItem>

Go to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console, click **New Project**, and pick one of the regions above.

</TabItem>

</Tabs>

## Connect your app to the project

Get a `DATABASE_URL` into an env file. NestJS doesn't read env files by itself; the next step loads them with `@nestjs/config`.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link
```

`neon link` prompts you to pick an organization and a project, or to create a new project. It writes a `.neon` file with the project context, pins a branch (pass `--branch` to choose one), and pulls that branch's `DATABASE_URL` into `.env.local`, or into `.env` if your project already has one. It also offers to create a [`neon.ts`](/docs/reference/neon-ts) file; that's optional and covered in [Add more of your backend](#add-more-of-your-backend).

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response, and add it to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The optional development branch step and [Add more of your backend](#add-more-of-your-backend) use the Neon CLI. To use them, run `neon link` in this directory.

</TabItem>

</Tabs>

## Load the env file

Install [`@nestjs/config`](https://docs.nestjs.com/application/configuration.md), Nest's configuration module:

```bash filename="Terminal"
npm install @nestjs/config
```

Register it in `src/app.module.ts`, before the database module you add below. It reads the files in `envFilePath` in order, and the first one that sets a variable wins, so `.env.local` wins over `.env`. A variable already set in your shell or on your host wins over both. It also copies the values into `process.env`, so SDKs that read `process.env` find them. If your app loaded other files, such as `.env.production`, add them to `envFilePath` or set those variables in the environment:

```typescript filename="src/app.module.ts"
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

The Neon CLI writes `DATABASE_URL` to one file: `.env` if it exists, otherwise `.env.local`. Keep `DATABASE_URL` in that file only, so an old value in `.env.local` doesn't hide a new one the CLI writes to `.env`.

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema with copy-on-write, so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

[node-postgres](https://node-postgres.com) (`pg`) suits a long-running NestJS server, and [postgres.js](https://github.com/porsager/postgres) works there too. The [Neon serverless driver](/docs/serverless/serverless-driver) queries over HTTP, which suits serverless and edge hosts. See [Choosing your connection method](/docs/connect/choose-connection).

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```bash
npm install pg
npm install -D @types/pg
```

```bash
npm install postgres
```

```bash
npm install @neondatabase/serverless
```

</CodeTabs>

If you use node-postgres, current `pg` versions print a `SECURITY WARNING` for `sslmode=require`. Change it to `sslmode=verify-full` in your env file to keep the same behavior without the warning. `neon link`, `neon checkout`, `neon env pull`, and `neon deploy` write `sslmode=require` again, so repeat the change after you run them.

## Create the database module

Create the client once for the whole app, in a module that provides it to the rest of the app. It reads `DATABASE_URL` through `ConfigService`, so the app stops at startup if the variable isn't set:

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/database/database.module.ts"
import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pg from 'pg';

export const DATABASE = 'DATABASE';

@Module({
  providers: [
    {
      provide: DATABASE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pool = new pg.Pool({ connectionString: config.getOrThrow<string>('DATABASE_URL') });
        // An idle connection can drop, for example when the compute scales to zero.
        // Without a listener, the pool's error event stops the app.
        pool.on('error', (error) => console.error('Postgres pool error:', error.message));
        return pool;
      },
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(DATABASE) private readonly pool: pg.Pool) {}

  onApplicationShutdown() {
    return this.pool.end();
  }
}
```

```typescript filename="src/database/database.module.ts"
import { Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import postgres from 'postgres';

export const DATABASE = 'DATABASE';

@Module({
  providers: [
    {
      provide: DATABASE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => postgres(config.getOrThrow<string>('DATABASE_URL')),
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(DATABASE) private readonly sql: postgres.Sql) {}

  onApplicationShutdown() {
    return this.sql.end();
  }
}
```

```typescript filename="src/database/database.module.ts"
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { neon } from '@neondatabase/serverless';

export const DATABASE = 'DATABASE';

@Module({
  providers: [
    {
      provide: DATABASE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => neon(config.getOrThrow<string>('DATABASE_URL')),
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}
```

</CodeTabs>

The node-postgres and postgres.js modules close their connections when the app shuts down. Nest runs shutdown hooks only when you turn them on, so add `app.enableShutdownHooks()` to `src/main.ts`:

```typescript filename="src/main.ts"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
```

## Query the database from a controller

Replace `src/app.service.ts` with a service that queries the database through the module's client (in an existing app, add the `getVersion` method and the constructor's `DATABASE` injection to your service instead):

<CodeTabs reverse={true} labels={["node-postgres", "postgres.js", "Neon serverless driver"]}>

```typescript filename="src/app.service.ts"
import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'pg';
import { DATABASE } from './database/database.module.js';

@Injectable()
export class AppService {
  constructor(@Inject(DATABASE) private readonly pool: Pool) {}

  async getVersion() {
    const { rows } = await this.pool.query('SELECT version()');
    return { version: rows[0].version };
  }
}
```

```typescript filename="src/app.service.ts"
import { Inject, Injectable } from '@nestjs/common';
import type { Sql } from 'postgres';
import { DATABASE } from './database/database.module.js';

@Injectable()
export class AppService {
  constructor(@Inject(DATABASE) private readonly sql: Sql) {}

  async getVersion() {
    const [row] = await this.sql`SELECT version()`;
    return { version: row?.version };
  }
}
```

```typescript filename="src/app.service.ts"
import { Inject, Injectable } from '@nestjs/common';
import type { NeonQueryFunction } from '@neondatabase/serverless';
import { DATABASE } from './database/database.module.js';

@Injectable()
export class AppService {
  constructor(@Inject(DATABASE) private readonly sql: NeonQueryFunction<false, false>) {}

  async getVersion() {
    const [row] = await this.sql`SELECT version()`;
    return { version: row?.version };
  }
}
```

</CodeTabs>

Then replace `src/app.controller.ts` with a `GET` route that returns the version. If your app already has a `/` route, give this one a path such as `@Get('neon')` so you don't replace yours:

```typescript filename="src/app.controller.ts"
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getVersion() {
    return this.appService.getVersion();
  }
}
```

The generated tests expect the old controller. `src/app.controller.spec.ts` calls `getHello()` and provides only `AppService`, which now also needs the `DATABASE` provider. `test/app.e2e-spec.ts` expects `Hello World!` from `/` and now needs a `DATABASE_URL`. Update them or delete them.

## Run the app

Start the server in watch mode:

```bash filename="Terminal"
npm run start:dev
```

Open [localhost:3000](http://localhost:3000), or the port in `PORT` if you set one. The response shows your Postgres version, confirming the connection:

```json
{"version":"PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu, compiled by gcc ..."}
```

If a query fails, Nest responds with a `500` and keeps the server running.

</Steps>

## Deploy

Set `DATABASE_URL` everywhere your app runs.

- Use your default branch for production. Get its connection string with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Console.
- Build with `npm run build` and start with `npm run start:prod` (`node dist/main`). Set `DATABASE_URL` in your host's environment; it takes priority over any env file. Env files are optional; the app loads the ones in `envFilePath` that exist.
- Most Node.js hosts set `PORT` for you, and the app listens on it.
- A CommonJS app on NestJS 12 needs `require(esm)`, which AWS Lambda's Node.js runtimes turn off by default; see the [migration guide](https://docs.nestjs.com/migration-guide.md) for the setting.
- Pick the driver for your host. node-postgres suits long-running servers and [Vercel Fluid compute](https://vercel.com/docs/functions/fluid-compute). On serverless platforms without built-in connection pooling, use the Neon serverless driver. See [Choosing your connection method](/docs/connect/choose-connection).
- The NestJS docs cover [deployment](https://docs.nestjs.com/deployment.md).

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Add a service with [`neon config add`](/docs/cli/config#add), then provision it with [`neon deploy`](/docs/cli/deploy). For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon config add bucket uploads
neon deploy
```

`neon config add` creates a [`neon.ts`](/docs/reference/neon-ts) file at your project root if you don't have one, installs `@neon/config` and `@neon/env`, and declares the service. `neon deploy` provisions it and writes its variables to your env file (`.env` if it exists, otherwise `.env.local`). `@nestjs/config` loads them. Set them on your host too.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Add it with `neon config add auth`. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Add a bucket with `neon config add bucket <name>`. In NestJS, use it from a service. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Add it with `neon config add ai-gateway`. In NestJS, call models from a service. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Add one with `neon config add function <slug>`, which also creates its handler file in `functions/`. Use a function for work that outlasts a request on your NestJS host, such as agents and webhooks, and call it with `fetch`. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Add it with `neon config add realtime`. In NestJS, seal live queries in a controller with `NEON_REALTIME_SECRET`, then subscribe from the browser with `NEON_REALTIME_URL`. Keep the secret on the server. See [Realtime](/docs/realtime/overview).

</DefinitionList>

To declare several services at once before you have a `neon.ts`, run `neon config init --services auth,functions,realtime`, or edit the file directly. With every service declared, it looks like this. The comments list the variables each service adds:

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  auth: true, // NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL
  buckets: {
    uploads: {}, // AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT_URL_S3, AWS_REGION
  },
  aiGateway: true, // NEON_AI_GATEWAY_TOKEN, NEON_AI_GATEWAY_BASE_URL
  functions: {
    jobs: { name: 'Jobs', source: './functions/jobs.ts' }, // NEON_FUNCTION_HOST_SUFFIX
  },
  preview: {
    realtime: true, // NEON_REALTIME_URL, NEON_REALTIME_SECRET
  },
});
```

To skip `neon.ts`, use each service's own CLI commands, such as [`neon buckets create`](/docs/cli/buckets) or [`neon realtime enable`](/docs/cli/realtime).

## Troubleshooting

<DefinitionList>

`TypeError: Configuration key "DATABASE_URL" does not exist`
: The app started without `DATABASE_URL`. Locally, check that `.env.local` or `.env` has it and that `ConfigModule` is registered before `DatabaseModule`, or run `neon env pull`. On a host, set it in the environment.

`Error: listen EADDRINUSE: address already in use :::3000`
: Another server, often an earlier `npm run start:dev`, is still using the port. Stop it, or set `PORT` to use another port.

`Nest can't resolve dependencies of the AppService (?)`
: The generated unit test, `src/app.controller.spec.ts`, builds a testing module with only `AppService`, which now needs the `DATABASE` provider, and it still tests `getHello()`. `test/app.e2e-spec.ts` also expects `Hello World!` from `/`. Update both tests, or delete them.

`Cannot find module './app.service' or its corresponding type declarations`
: In an ESM project, relative imports need the `.js` extension, as in this guide's code.

</DefinitionList>

## Next steps

- **Create your first table:** run `neon psql` in your project directory to open a SQL shell on your linked branch, or use an ORM such as [Drizzle](/docs/guides/drizzle) or [Prisma](/docs/guides/prisma) to manage your schema with migrations.
- [Build a full backend](/docs/get-started/full-backend-quickstart): Postgres, Object Storage, and a Neon Function declared in one `neon.ts`.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.

<NeedHelp/>
