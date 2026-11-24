---
title: Connect a Laravel application to Neon
subtitle: Connect a Laravel app to Lakebase Postgres on Neon, run its migrations, query it from a route, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a Laravel 13 app to Lakebase Postgres on Neon: optionally add Neon's
  agent skills, create a Neon project (Neon CLI, API, or Console), link it with
  the Neon CLI, which writes the connection strings into the .env file Laravel
  reads, set DB_URL, run migrations, and query Postgres from a route. Covers
  Laravel 12, production with a pooled connection, troubleshooting, and Neon's
  other backend services from Laravel.
enableTableOfContents: true
updatedOn: '2026-11-19T01:53:36.641Z'
---

<PromptBlock src="/prompts/laravel-prompt.md" labels={["Set up your agent and follow this guide", "Look up Laravel's docs", "Connect your Laravel app"]} />

<Steps>

## Create a Laravel app

Install [PHP](https://www.php.net/downloads) 8.3 or later with the `pdo_pgsql` extension, and [Composer](https://getcomposer.org/download/), then create a project if you don't have one:

```bash filename="Terminal"
composer create-project laravel/laravel my-app
cd my-app
```

This guide uses Laravel 13. The scaffold creates `.env` from `.env.example`, generates an `APP_KEY`, and runs the default migrations on a local SQLite database. The next steps point the app at Neon instead. Its `.gitignore` already excludes `.env`, which keeps your connection string out of git. It doesn't run `git init`.

The scaffold also writes an `AGENTS.md` and a `CLAUDE.md` with steps to install Laravel Boost. The steps include piping a `php.new` installer to a shell. This guide doesn't use Boost, so skip those steps.

If your app is on Laravel 12, the steps are the same except the production settings in Deploy. See [Laravel 12](#laravel-12) in Troubleshooting.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

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

`--region-id` sets the region; pass a different one to pick another of the regions above. `--no-secrets` keeps the connection string out of the output, since the next step writes it into your `.env` file. Pass `--org-id` to choose the organization (find IDs with `neon orgs list`).

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

Laravel reads its database settings from `.env` in the project root. It doesn't read `DATABASE_URL`, and it doesn't read `.env.local`. Laravel's `pgsql` connection reads `DB_URL`, so the app needs that variable.

If your project has no `.env` file (this happens after a clone), create one from the example and generate a key before you connect it:

```bash filename="Terminal"
cp .env.example .env
php artisan key:generate
```

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link --no-config
```

`--no-config` stops `neon link` from offering to create a `neon.ts` file, which this guide doesn't use. `neon link` prompts you to pick an organization and a project, or to create a new project.

It writes a `.neon` file with the project context, pins a branch (pass `--branch` to choose one), and writes the branch's connection strings to `.env`. The strings are `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct). Run `neon link` before you add `DB_URL`.

The CLI updates a key that's already in `.env` in place, and appends a key that isn't there to the end of the file. If `DATABASE_URL_UNPOOLED` is missing from `.env` when you run it again, move `DB_URL` below the line it appends.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response. Turn off **Connection pooling** in the Connect modal to get the direct string. Then add it to `.env` as shown below. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

</TabItem>

</Tabs>

Open `.env` and change `DB_CONNECTION` from `sqlite` to `pgsql`. Then add the `DB_URL` line.

With the Neon CLI, add this line at the end of `.env`. It refers to the `DATABASE_URL_UNPOOLED` value that `neon link` wrote, so you don't copy the string:

```shell filename=".env" shouldWrap
DB_URL="${DATABASE_URL_UNPOOLED}"
```

Without the CLI, paste the direct connection string into `DB_URL`:

```shell filename=".env" shouldWrap
DB_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
```

Keep `sslmode=require` in the URL. Laravel's default is `prefer`, and the URL's value replaces it. Laravel ignores `channel_binding`, so the `channel_binding=require` in the Console's string can stay or go. Laravel expands `${...}` from variables defined above the line in the file or already set in the process environment, so keep `DB_URL` below `DATABASE_URL_UNPOOLED`.

`DB_URL` uses the direct (unpooled) connection, the same one the [Laravel migrations guide](/docs/guides/laravel-migrations) uses. For a pooled connection in production, see [Deploy](#deploy).

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and writes its connection strings into the same `.env` file. The keys already exist there, so the CLI updates them in place and `DB_URL` follows the branch. To switch back, run `neon checkout main` (or `production`).

## Use Laravel's database connection

Laravel's `pgsql` connection in `config/database.php` reads `DB_URL` through `env()`, so there's no client file to write. Queries use Laravel's `DB` facade, and it connects on the first query.

Keep the connection string in `.env`, not in your code.

## Run migrations and check the connection

Clear Laravel's cached configuration and run its default migrations against your Neon database:

```bash filename="Terminal"
php artisan config:clear
php artisan migrate
php artisan migrate:status
```

`migrate` creates Laravel's default tables (`users`, `cache`, `jobs`, and the rest of the scaffold's migrations) in your Neon database. `migrate:status` lists each migration as ran or pending.

This guide doesn't use `php artisan db:show`, because it prints the full `DB_URL`, password included. Check the connection with the route in the next step instead.

## Query the database from a route

Replace the default `/` route in `routes/web.php`. The scaffold's route returns the welcome view. This route returns the Postgres version as JSON:

```php filename="routes/web.php"
<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['version' => DB::selectOne('select version() as version')->version];
});
```

If your app already has a `/` route, add this one as `/neon` instead, so you don't replace one of yours. Change the route's path in the code above to `/neon`.

If a query fails, Laravel returns a `500` response and the server keeps running. With `APP_DEBUG=true` (the scaffold's default), it shows the error page.

## Run the app

Start the development server:

```bash filename="Terminal"
php artisan serve
```

Open [127.0.0.1:8000](http://127.0.0.1:8000), or `127.0.0.1:8000/neon` if you used `/neon`. The response is JSON with your Postgres version, which confirms the connection. `php artisan serve` reads `.env` when it starts, so restart it after you change `.env`. Stop it with Ctrl+C.

</Steps>

## Deploy

Set the same settings on your host. Environment variables set on the host take priority over `.env`, so you can keep the file out of deployments.

- `APP_KEY`, `APP_ENV=production`, `APP_DEBUG=false`, and `APP_URL`.
- `DB_CONNECTION=pgsql` and the connection variables below.
- Run `php artisan config:cache` after the environment is set. Once the configuration is cached, `env()` calls outside `config/` files return `null`.
- Run migrations with `php artisan migrate --force`. Laravel asks for confirmation in production without `--force`.

For production, use the pooled connection for app traffic and the direct connection for migrations. Laravel's PDO options don't keep connections open between requests, so each request opens its own connection. Neon's [connection pooling](/docs/connect/connection-pooling#how-to-use-connection-pooling) guide recommends the pooled connection for connection-per-request frameworks. Laravel 13 can do this split, and its [database docs](https://laravel.com/docs/13.x/database) describe the settings. Laravel 12 can't, so see [Laravel 12](#laravel-12) in Troubleshooting.

Server connections are capped by compute size. On a compute with 0.25 compute units (CU), `max_connections` is 112, and a direct connection fails at the 106th client with `remaining connection slots are reserved`. The pooler keeps its server pool at 90% of `max_connections`, so many app clients share those connections. Add a `direct` key to the `pgsql` connection in `config/database.php`:

```php filename="config/database.php"
'pgsql' => [
    'driver' => 'pgsql',
    // ... the existing settings ...
    'direct' => array_filter([
        'host' => env('DB_DIRECT_HOST'),
        'port' => env('DB_DIRECT_PORT'),
        'username' => env('DB_DIRECT_USERNAME'),
        'password' => env('DB_DIRECT_PASSWORD'),
        'sslmode' => env('DB_DIRECT_SSLMODE'),
    ]),
],
```

Then set the production variables. Use your default branch for production, and get its pooled string with `neon connection-string main --pooled` (or `production`). Its host has `-pooler` in the endpoint name. `DB_DIRECT_HOST` is the same host without `-pooler`:

```shell filename=".env" shouldWrap
DB_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require"
DB_DIRECT_HOST=[endpoint].[region].aws.neon.tech
DB_DIRECT_SSLMODE=require
```

The scaffold's `pgsql` block sets `search_path` to `public`, and Laravel runs it as a `SET` on each connection. Neon's pooler doesn't support `SET` on pooled connections, and a setting can carry over to another client. Keep it at `public`. See [common issues with SET statements](/docs/connect/connection-pooling#common-issues-with-set-statements).

Laravel sends app queries to `DB_URL` and sends migrations and `migrate:status` to the direct host. This guide doesn't test that setup against Neon. For background on the pooler, see [Connection pooling](/docs/connect/connection-pooling).

## Add more of your backend

Neon's other backend services branch with your database. They need a project in a [supported region](#create-a-neon-project). Add each one with its own command. Don't use `neon config add` in this project: it creates a `neon.ts` file, a `package.json`, and installs npm packages, which a Laravel app doesn't need.

For background jobs and scheduled PHP work, use Laravel's [queues](https://laravel.com/docs/13.x/queues) and [scheduler](https://laravel.com/docs/13.x/scheduling). For long-lived streaming or WebSocket work, use a Neon Function.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Enable it with `neon neon-auth enable`. The command prints the auth base URL and JWKS URL, not secrets. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Create a bucket with `neon buckets create my-bucket --access-level private`. The command prints only the bucket's name and access level. Run `neon env pull` to write its credentials to `.env`. For uploads from Laravel, see the [filesystem docs](https://laravel.com/docs/13.x/filesystem) for the S3 disk. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: `neon env pull` writes the default AI Gateway credential to `.env`. Call the gateway over HTTP from your routes. See [AI Gateway](/docs/ai-gateway/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Enable it with `neon realtime enable --allowed-origin http://127.0.0.1:8000`, using the origin your frontend loads from. See [Realtime](/docs/realtime/overview).

Neon Functions
: Node.js or TypeScript code that runs next to your database, as a separate service.
: Functions run JavaScript or TypeScript on the Node.js runtime, not PHP. They can run on a schedule with Function Triggers, but they aren't a job queue. For this app's queued and scheduled PHP work, use Laravel's queues and scheduler above. Call a function from Laravel over HTTP only if you run one as a separate service. See [Neon Functions](/docs/compute/functions/overview).

</DefinitionList>

## Troubleshooting

<DefinitionList>

`SQLSTATE[08006] [7] connection to server at "127.0.0.1", port 5432 failed: Connection refused`
: Laravel used its default host, `127.0.0.1`, because it didn't read `DB_URL`. Check that `.env` has `DB_CONNECTION=pgsql` and a `DB_URL` line. Make sure any `${...}` reference in `DB_URL` points at a line above it. Then run `php artisan config:clear`. Restart `php artisan serve` after you change `.env`.

`could not find driver`
: PHP doesn't have the `pdo_pgsql` extension enabled. Run `php -m | grep pdo_pgsql`. If nothing prints, enable the extension in your `php.ini` (or install your PHP's Postgres extension package), then run the check again.

</DefinitionList>

### Laravel 12

The steps are the same on Laravel 12 (PHP 8.2 or later), and it uses the same `DB_URL` setting and `migrate:status` command. Laravel 12 ignores the `direct` settings in Deploy, so it can't split app traffic and migrations for you. Set up a second connection for migrations:

1. In production, keep `DB_URL` on the pooled string for the app, as Deploy does. With the Neon CLI, use `DB_URL="${DATABASE_URL}"`.
2. Add a `pgsql_direct` connection to `config/database.php` that reads the direct string from `DB_DIRECT_URL`:

```php filename="config/database.php"
'pgsql_direct' => [
    'driver' => 'pgsql',
    'url' => env('DB_DIRECT_URL'),
],
```

3. In `.env`, set `DB_DIRECT_URL="${DATABASE_URL_UNPOOLED}"` below the `DATABASE_URL_UNPOOLED` line. Without the CLI, paste the direct connection string.
4. Run migrations on that connection with `php artisan migrate --database=pgsql_direct`. In production, add `--force`, as Deploy does. The app's queries keep using `DB_URL`.

The Deploy split needs Laravel 13. Laravel 12's bug fixes ended on August 13, 2026, and it receives security fixes until February 24, 2027. To move to Laravel 13, follow Laravel's [upgrade guide](https://laravel.com/docs/13.x/upgrade).

### The endpoint ID is not specified

If you see this error, the TLS library under PHP's Postgres extension (libpq) doesn't support Server Name Indication (SNI), which Neon uses for routing. Neon's [connection errors](/docs/connect/connection-errors#the-endpoint-id-is-not-specified) page gives the same text as this:

```txt shouldWrap
ERROR: Endpoint ID is not specified. Either please upgrade the postgres client library (libpq) for SNI support or pass the endpoint ID (first part of the domain name) as a parameter: '?options=endpoint%3D<endpoint-id>'. See more at https://neon.com/sni
```

Neon's page says `libpq` added SNI support in Postgres 14, so upgrade PHP's libpq to Postgres 14 or later first. If you can't, use separate `DB_*` variables instead of `DB_URL`, with the endpoint ID in the password field. In `.env`, remove the `DB_URL` line and set:

```shell filename=".env" shouldWrap
DB_HOST=[neon_hostname]
DB_PORT=5432
DB_DATABASE=[dbname]
DB_USERNAME=[user]
DB_PASSWORD="endpoint=[endpoint_id]$[password]"
DB_SSLMODE=verify-full
DB_SSLROOTCERT=[path_to_root_cert]
```

This is Neon's [Workaround D](/docs/connect/connection-errors#d-specify-the-endpoint-id-in-the-password-field). It downgrades the authentication method from `scram-sha-256` to `password`, so the password crosses the connection in plain text, inside TLS.

<Admonition type="warning" title="Security trade-off">
Neon says this is as secure as HTTPS as long as `sslmode=verify-full` is used. `DB_SSLMODE=require` doesn't verify the server's certificate. Channel binding doesn't apply here, because this workaround uses cleartext `password` auth and Laravel doesn't pass `channel_binding` to the connection. Use `verify-full` with a root certificate.
</Admonition>

Laravel's `pgsql` config has no `sslrootcert` key by default. Add one to the `pgsql` connection in `config/database.php`:

```php filename="config/database.php"
'pgsql' => [
    // ... the existing settings ...
    'sslrootcert' => env('DB_SSLROOTCERT'),
],
```

Then set the path in one of these ways:

- Set `DB_SSLROOTCERT` in `.env` to the certificate's path. Laravel reads `env()` in `config/` files when it caches config, so this works on a host that runs `config:cache`.
- Set `PGSSLROOTCERT` to the path. libpq reads it from the process environment. Laravel's env loader sets `.env` values there with `putenv`, but only when it loads `.env`. Laravel skips `.env` once config is cached, and Deploy runs `config:cache`. On a host, set `PGSSLROOTCERT` as a real environment variable.
- [Connect securely](/docs/connect/connect-securely) describes `PGSSLROOTCERT` for the `psql` client.

This guide hasn't tested `verify-full` with PHP. It also hasn't tested Workaround D against Neon. An offline check confirmed only that Laravel keeps the password value intact.

Don't put `options=endpoint%3D...` in `DB_URL`. Laravel reads the URL's `options` value as its PDO options array. A string there throws `TypeError: array_diff_key(): Argument #2 must be of type array, string given`. For the other workarounds, see [The endpoint ID is not specified](/docs/connect/connection-errors#the-endpoint-id-is-not-specified).

## Next steps

- **Create your first table:** run `php artisan make:migration create_<table>_table`, write the schema, and run `php artisan migrate`. Or run `neon psql` in your project directory to open a SQL shell on your linked branch. It uses an installed `psql` client if there is one, and otherwise a built-in client. See [Schema migration with Laravel](/docs/guides/laravel-migrations) for Eloquent models and migrations.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.

<NeedHelp/>
