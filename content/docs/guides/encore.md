---
title: Connect an Encore application to Neon
subtitle: Install Encore, declare a database in code, and connect it to Lakebase Postgres on Neon in Encore Cloud or in a self-hosted Docker image
summary: >-
  To connect an Encore app to Lakebase Postgres on Neon, declare the database in
  code with SQLDatabase, then add a Neon API key to Encore Cloud or pass the
  database's connection details to a Docker image built with encore build docker.
  Covers Encore.ts, local Postgres in Docker, deploying to Encore Cloud,
  self-hosting, and troubleshooting.
enableTableOfContents: true
updatedOn: '2026-11-20T23:55:45.722Z'
---

<PromptBlock src="/prompts/encore-prompt.md" labels={["Set up your agent and follow this guide", "Look up Encore's docs", "Connect your Encore app"]} />

<Steps>

## Install the Encore CLI

Install the Encore CLI, which runs your app locally and deploys it to Encore Cloud, Encore's hosted platform. Encore is a development platform for backends. It provisions the databases that your code declares. This guide uses TypeScript.

<CodeTabs labels={["macOS", "Linux", "Windows"]}>

```bash
brew install encoredev/tap/encore
```

```bash
curl -L https://encore.dev/install.sh | bash
```

```bash
iwr https://encore.dev/install.ps1 | iex
```

</CodeTabs>

## Sign in and create an app

Sign in with `encore auth login`, which opens a browser, then create the app with `encore app create`. Signing in first makes the CLI create the app on Encore Cloud, which the deploy step needs.

```bash filename="Terminal"
encore auth login
encore app create my-neon-app --example=ts/empty
cd my-neon-app
```

`--example=ts/empty` creates a TypeScript app from Encore's empty template. Always pass `--example`: without a terminal, the CLI can't ask for a language, and it creates a Go app. If you aren't signed in, the CLI asks you to sign in when it runs in a terminal. Without a terminal, it creates the app locally and reports that it isn't linked to Encore Cloud. To link it later, run `encore app link <app-id>`, using the app ID shown in the Encore Cloud dashboard.

## Declare a database in a service

Create a service named `hello`. Encore creates a database named `hello` for it, and applies the migration in `hello/migrations` to that database. The service also has three endpoints: one that writes a message, one that lists messages, and one that returns the Postgres version.

```typescript filename="hello/encore.service.ts"
import { Service } from 'encore.dev/service';

export default new Service('hello');
```

```sql filename="hello/migrations/1_create_table.up.sql"
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

```typescript filename="hello/hello.ts"
import { api } from 'encore.dev/api';
import { SQLDatabase } from 'encore.dev/storage/sqldb';

// Encore creates this database, runs the migrations, and connects the app to it.
export const db = new SQLDatabase('hello', {
  migrations: './migrations',
});

interface Message {
  id: number;
  text: string;
  created_at: Date;
}

export const create = api(
  { expose: true, method: 'POST', path: '/messages' },
  async (req: { text: string }): Promise<Message> => {
    const row = await db.queryRow<Message>`
      INSERT INTO messages (text)
      VALUES (${req.text})
      RETURNING id, text, created_at
    `;
    if (!row) throw new Error('Failed to create message');
    return row;
  }
);

export const list = api(
  { expose: true, method: 'GET', path: '/messages' },
  async (): Promise<{ messages: Message[] }> => {
    const messages = await db.queryAll<Message>`
      SELECT id, text, created_at FROM messages ORDER BY created_at DESC
    `;
    return { messages };
  }
);

export const version = api(
  { expose: true, method: 'GET', path: '/version' },
  async (): Promise<{ version: string | undefined }> => {
    const row = await db.queryRow<{ version: string }>`SELECT version()`;
    return { version: row?.version };
  }
);
```

## Run the app locally

Start Docker, then run the app. Keep it running in its own terminal:

```bash filename="Terminal"
encore run
```

Encore starts Postgres in Docker for local development, creates the `hello` database, and applies the migration. This local database isn't your Neon project. The API runs at `http://localhost:4000`, and the local development dashboard runs at `http://localhost:9400`.

From another terminal, create a message and read the Postgres version.

```bash filename="Terminal"
curl -X POST http://localhost:4000/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Encore!"}'

curl http://localhost:4000/version
```

The `/version` route returns the version of Encore's local Postgres.

## Connect a Neon database to Encore

Encore doesn't read `DATABASE_URL` or other env files, so `neon link` isn't used here. `encore run` uses the local Postgres. A Neon environment in Encore Cloud uses the Neon branch you pick when you create it.

To let Encore Cloud use your Neon account, add a Neon API key to your app. The person who owns the Neon account does both steps:

1. Create an API key in the [Neon Console](https://console.neon.tech/app/settings/api-keys). See [Manage API keys](/docs/manage/api-keys).
2. In the [Encore Cloud dashboard](https://app.encore.dev), open your app and go to **App Settings** > **Integrations** > **Neon**. Click **Connect Account**, give it a name, and paste the key.

</Steps>

## Deploy

### Deploy to Encore Cloud

Every Encore Cloud app starts with an environment named `staging`, a development environment on Encore Cloud's free hosting. Its database is managed by Encore Cloud, not in your Neon account. Each push to your app's `main` branch deploys to it. Commit your code, then push to the `encore` remote:

```bash filename="Terminal"
git add -A
git commit -m "Add hello service"
git push encore
```

To run production on Neon, create a production environment. Encore Cloud deploys production environments to your own AWS or Google Cloud account, which you connect in the dashboard first; its free hosting is for development environments (see Encore's [environments docs](https://encore.dev/docs/platform/deploy/environments)).

1. In the Encore Cloud dashboard, open your app's **Environments** page and click **Create Environment**. Choose the **Production** type and name the environment `production`.
2. In the Database section, select **Neon database**. To have Encore create a new Neon project, select **New Neon project**, then choose a Neon account and region. Encore creates the project and branch. To use an existing Neon project instead, choose **Branch from Neon project** or **Import Neon branch**.
3. In **Deployments** > **New Deploy**, choose the `production` environment and your branch.

Encore runs your migrations as part of each deploy.

To create a development branch of your database, create another environment and choose **Branch from Encore environment**.

With Neon as the database, Encore's [preview environments](https://encore.dev/docs/platform/deploy/preview-environments) for pull requests each get their own copy of the database of an environment you choose, such as `staging`, as a Neon branch. Set the source environment in **App Settings** > **Preview Environments**.

### Self-host with Docker

To run the app on your own infrastructure, build a Docker image with `encore build docker`. The build needs an infra config file, a JSON file that tells the image where its database is. Without `--config`, the build fails with the error "Your infra configuration is incomplete".

Create a project in the Neon Console. Then copy the host, database name, and role name from the **Connect** dialog for your default branch. Use the pooled host (with `-pooler`), the dialog's default, which suits an app that serves requests. Leave the password out of the file, and set it in the environment that runs the image:

```json filename="infra-config.json"
{
  "$schema": "https://encore.dev/schemas/infra.schema.json",
  "metadata": {
    "app_id": "your-app-id",
    "env_name": "production",
    "env_type": "production"
  },
  "sql_servers": [
    {
      "host": "your-neon-host",
      "databases": {
        "hello": {
          "name": "your-database-name",
          "username": "your-role-name",
          "password": { "$env": "NEON_PASSWORD" }
        }
      }
    }
  ]
}
```

Set `app_id` to the `id` in your `encore.app` file. Encore sets it when the app is created while you're signed in, or when you run `encore app link`. The `hello` key matches the name in `new SQLDatabase('hello')`. Then build the image and run it:

```bash filename="Terminal"
encore build docker --config infra-config.json my-neon-app:latest
docker run -e NEON_PASSWORD -p 8080:8080 my-neon-app:latest
```

`-e NEON_PASSWORD` passes the value from your shell, so it doesn't appear on the command line.

The image doesn't run migrations. Before you start it, apply each database's SQL migration files to that database. For the `hello` database, those are the files in `hello/migrations`. Run them over the direct connection (the host without `-pooler`), as Neon recommends for [schema migrations](/docs/connect/connection-pooling#when-to-use-pooled-vs-direct-connections). Any migration tool that does this works. Encore's self-hosting docs name golang-migrate as an example.

## Troubleshooting

<DefinitionList>

`encore run` can't create the local database
: Docker isn't running, or it can't be reached. Start Docker, then run `encore run` again.

"Your infra configuration is incomplete" from `encore build docker`
: The app has a database, but the build has no infra config. Pass one with `--config infra-config.json`, as shown in [Self-host with Docker](#self-host-with-docker).

Migrations fail on an imported Neon branch
: Encore creates roles for each database, and migrations need the database owner to be the `db_<name>_admin` role. Change the owner of the database on the imported branch to that role. See [Use Neon Postgres](https://encore.dev/docs/platform/infrastructure/neon) in Encore's docs.

</DefinitionList>

## Next steps

- [Encore's SQL databases](https://encore.dev/docs/ts/primitives/databases): migrations, transactions, and `encore db shell` for querying local and cloud databases.
- [Branching](/docs/introduction/branching): how Neon branches work with your data.
- [Encore with Neon example](https://github.com/neondatabase/examples/tree/main/with-encore): a complete Encore.ts app that uses a Neon database.

Add more Neon services to your app with the guides for each:

- [Managed Better Auth](/docs/auth/overview): sign-up and sign-in, stored in your database.
- [Object Storage](/docs/storage/overview): S3-compatible buckets for uploads and files.
- [Neon Functions](/docs/compute/functions/overview): long-running Node.js compute next to your database.
- [AI Gateway](/docs/ai-gateway/overview): one credential for models from Anthropic, OpenAI, Google, and more.

<NeedHelp/>
