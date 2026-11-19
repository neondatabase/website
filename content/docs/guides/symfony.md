---
title: Connect a Symfony application to Neon
subtitle: Connect a Symfony app to Lakebase Postgres on Neon, query it from a controller with Doctrine, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a Symfony app to Lakebase Postgres on Neon: optionally add Neon's agent
  skills, create a Neon project (Neon CLI, API, or Console), write DATABASE_URL to
  .env.local with the Neon CLI, optionally develop on a Neon branch, and query it
  through Doctrine DBAL from a route. Covers Symfony 8.1 on PHP 8.4, plus
  deployment, troubleshooting, and Neon's other backend services from Symfony.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/symfony
  - /docs/integrations/symfony
updatedOn: '2026-11-19T01:46:56.035Z'
---

<PromptBlock src="/prompts/symfony-prompt.md" labels={["Set up your agent and follow this guide", "Look up Symfony's docs", "Connect your Symfony app"]} />

<Steps>

## Create a Symfony app

Skip this step if you already have a Symfony app you want to use. If that app doesn't use Doctrine yet, run `composer require symfony/orm-pack --no-interaction` in its directory, which adds the Doctrine configuration this guide uses. On PHP 8.2 or 8.3, Composer installs older Doctrine packages (doctrine-bundle 2.x), a different stack that this guide doesn't cover.

This guide uses Symfony 8.1 on PHP 8.4 or later, which `symfony/skeleton` 8.1 requires.

Install PHP 8.4 or later and [Composer](https://getcomposer.org/download/) if you don't have them. Check that PHP has the Postgres extensions, `pdo_pgsql` and `pgsql`:

```bash filename="Terminal"
php -m | grep pgsql
```

If nothing prints, install them for your platform, for example `sudo apt install php-pgsql` on Debian or Ubuntu. Then create a project:

```bash filename="Terminal"
composer create-project "symfony/skeleton:8.1.*" my-app --no-interaction
cd my-app
composer require symfony/orm-pack --no-interaction
```

`symfony/orm-pack` adds Doctrine ORM, Doctrine Bundle, and Doctrine migrations. Check that the project's `.gitignore` lists `/.env.local`, which holds the connection string. Symfony's docs say the skeleton's `.gitignore` does. If the project isn't a git repository yet, run `git init` in its directory.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Symfony publishes its documentation at [symfony.com/doc](https://symfony.com/doc/current/index.html). The prompt above has your agent look up Symfony docs there.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and Managed Better Auth run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

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

Symfony reads two env files that matter here. `.env` holds defaults and is committed to git. The `symfony/orm-pack` Doctrine recipe adds a `DATABASE_URL` default to it that points at a local Postgres server. `.env.local` holds your machine's values, is git-ignored, and overrides `.env`. Put the connection string in `.env.local`.

<Admonition type="warning">

Don't run plain `neon link` here. The Neon CLI writes to an existing `.env` rather than `.env.local`, and the Symfony skeleton always creates one, so the password would end up in a committed file.

</Admonition>

Skip the CLI's own write with `--no-env-pull`, then pull the variables into `.env.local` explicitly:

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install) and run `neon login` if you haven't. Then, from your app's directory, link it to the Neon project and write the connection string to `.env.local`:

```bash filename="Terminal"
neon link --no-env-pull --no-config
neon env pull --file .env.local
```

`neon link` prompts you to pick an organization and a project, or to create a new project. It writes a `.neon` file with the project context and pins a branch (pass `--branch` to choose one). `--no-env-pull` stops it from writing to `.env`. `--no-config` stops it from offering to create a `neon.ts` file, which is for Node.js projects. `neon env pull --file .env.local` writes the branch's Neon variables into `.env.local`. It replaces the `DATABASE_URL` value, dropping any options you added to the URL by hand, and keeps lines it doesn't manage. It can also remove Neon variables the pull didn't return.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response, and add it to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```text filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
```

Leave the skeleton's `DATABASE_URL` in `.env` as it is. The optional development branch step and [Add more of your backend](#add-more-of-your-backend) use the Neon CLI. To use them, run `neon link --no-env-pull --no-config` in this directory.

</TabItem>

</Tabs>

Set Doctrine's server version once in `config/packages/doctrine.yaml` (the major version is `pg_version` in `neon projects list --output json`), as shown in [Use Doctrine as the database client](#use-doctrine-as-the-database-client). That keeps `DATABASE_URL` exactly as Neon writes it.

The `channel_binding` parameter that some Neon connection strings include has no effect here. Doctrine drops it, so the connection doesn't require channel binding.

Symfony loads `.env.local` on top of `.env` in every environment except `test`, so your local value wins. A variable set in your shell or on your host wins over both files.

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema with copy-on-write, so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create --no-env-pull
neon env pull --file .env.local
```

This creates the `dev` branch and pins it in `.neon`. The second command replaces the `DATABASE_URL` value in `.env.local` with the branch's, so your app now uses the branch. To switch back, run `neon checkout main --no-env-pull` (or `production`), then `neon env pull --file .env.local`.

## Use Doctrine as the database client

The Doctrine recipe that `symfony/orm-pack` installs already reads `DATABASE_URL` in `config/packages/doctrine.yaml`. Check that the `dbal` section has the `url` line, which passes the URL through unchanged. The recipe also has a commented `#server_version: '16'` line. Uncomment it and set it to `'18'`, or your project's major version:

```yaml filename="config/packages/doctrine.yaml"
doctrine:
    dbal:
        url: '%env(resolve:DATABASE_URL)%'
        server_version: '18'
```

Set `server_version` to your project's Postgres major version, which `neon projects list --output json` shows as `pg_version`. New Neon projects default to Postgres 18. Doctrine uses the same platform for every PostgreSQL 12 and later.

Doctrine connects through PDO with the `pdo_pgsql` extension you checked earlier. Doctrine sets PDO's `ATTR_DISABLE_PREPARES` by default, which avoids named server-side prepared statements. Neon's pooler supports protocol-level prepared statements, but not SQL-level `PREPARE`, so this is a conservative choice for the pooled hostname, not a requirement.

Use Doctrine's service from a controller. Doctrine adds a `Connection` service that Symfony injects automatically:

```php filename="src/Controller/NeonController.php"
<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class NeonController extends AbstractController
{
    #[Route('/neon', name: 'neon_version')]
    public function version(Connection $connection): JsonResponse
    {
        $version = $connection->fetchOne('SELECT version()');

        return $this->json(['version' => $version]);
    }
}
```

Symfony's routing reads attributes from `src/Controller/`, so the route at `/neon` works without more configuration. If your app already has a route for `/`, this one doesn't replace it.

## Run the app

Start the local server with the Symfony CLI from your project directory:

```bash filename="Terminal"
symfony serve
```

The command prints a local URL. Open that URL with `/neon` added. Symfony reads the env files itself, so the server needs no extra flags. The response shows your Postgres version, confirming the connection. The output looks like this (the exact version and build vary):

```json
{"version":"PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu, compiled by gcc ..."}
```

To check the connection from the command line instead, run `php bin/console dbal:run-sql "SELECT version()"`.

Stop the server with Ctrl+C. Without the Symfony CLI, run PHP's built-in server with Symfony's front controller as its router, then open [127.0.0.1:8000/neon](http://127.0.0.1:8000/neon):

```bash filename="Terminal"
php -S 127.0.0.1:8000 -t public public/index.php
```

</Steps>

## Deploy

Set `DATABASE_URL` everywhere your app runs.

- Use your default branch for production. Get its connection string with `neon connection-string main --pooled` (or `production`), and set it as `DATABASE_URL`. If you set `server_version` in `config/packages/doctrine.yaml` as shown above, the connection string needs no extra options.
- Set `APP_ENV=prod` in your host's environment. Generate `APP_SECRET` once for production, for example with `php -r "echo bin2hex(random_bytes(16));"`, and store it in the host's environment.
- Set `DATABASE_URL`, `APP_ENV`, and `APP_SECRET` as real environment variables on the host. Symfony reads them at runtime and they take priority over the env files. `composer dump-env` doesn't use them. It layers `.env.local` over `.env` and writes the merged values. Run it where `.env.local` has no development or branch URL, such as a fresh deploy checkout. Never ship `.env.local`.
- Install dependencies without development packages: `composer install --no-dev --optimize-autoloader`.
- Dump the env files so Symfony skips parsing them on each request: `composer dump-env prod`. It writes the merged values from `.env` and `.env.local` into `.env.local.php`. Keep that file on the server and never commit it.
- Clear the production cache: `APP_ENV=prod APP_DEBUG=0 php bin/console cache:clear`.
- Run migrations before you start the app: `php bin/console doctrine:migrations:migrate --no-interaction --env=prod`.
- Pick a host that runs PHP-FPM or another long-running PHP server. Serverless PHP platforms that start a new process per request can open a new database connection on each request. Check your host's docs on connection limits.

<Admonition type="warning">

Keep `APP_SECRET` the same value across deploys. Symfony uses it for signing, so changing it breaks anything signed with the old value.

</Admonition>

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). Each service has its own CLI commands. For example, to add an Object Storage bucket:

```bash filename="Terminal"
neon buckets create uploads
```

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Create a bucket with `neon buckets create <name>`. In Symfony, use it from a controller. See [Object Storage](/docs/storage/overview) and [`neon buckets`](/docs/cli/buckets).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: Call models from a controller. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database.
: Use a function for work that outlasts a request on your Symfony host, such as agents and webhooks, and call it over HTTP. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Enable it with `neon realtime enable`. To seal live queries and subscribe to them, see [Realtime](/docs/realtime/overview). For the CLI commands, see [`neon realtime`](/docs/cli/realtime).

</DefinitionList>

## Troubleshooting

<DefinitionList>

Symfony reports that `DATABASE_URL` isn't set
: Check that `.env.local` has the line, and that you run the app from the project directory. On a host, set it in the environment. Symfony doesn't read `.env.local` in the `test` environment.

`DATABASE_URL` is in `.env` and that file is in git
: `neon link` or `neon env pull` wrote to `.env`, which the skeleton commits. Move the line to `.env.local`, and remove it from `.env` and from git history if you already committed it. Then reset the database password in the Console, and update `.env.local`.

`could not find driver`
: PHP doesn't have the `pdo_pgsql` extension. Install it, then check with `php -m | grep pgsql`.

`endpoint ID is not specified`
: The Postgres client library (libpq) that PHP uses is too old for Server Name Indication, which Neon uses to route connections. Upgrade `libpq` and the PHP PostgreSQL extensions, or pass the endpoint ID in the connection string. See [The endpoint ID is not specified](/docs/connect/connection-errors#the-endpoint-id-is-not-specified).

`Address already in use`
: Another server is using port 8000. Stop it, or use another port in the `php -S` command.

</DefinitionList>

## Next steps

- **Create your first table:** write a Doctrine entity in `src/Entity/`, then run `php bin/console doctrine:migrations:diff` and `php bin/console doctrine:migrations:migrate --no-interaction`. You can also run `neon psql` in your project directory to open a SQL shell on your linked branch.
- [Build a full backend](/docs/get-started/full-backend-quickstart): Postgres, Object Storage, and a Neon Function in one project.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.

<NeedHelp/>
