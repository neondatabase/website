---
title: Connect from Tortoise ORM to Neon
subtitle: Create a Neon project, link it with neon link, and query Lakebase Postgres from Tortoise ORM with the asyncpg driver
summary: >-
  To connect a Tortoise ORM app to Lakebase Postgres on Neon, run neon link to
  get a pooled DATABASE_URL and a direct DATABASE_URL_UNPOOLED, define a model,
  run Tortoise's built-in migrations through the direct connection, and query it
  with the asyncpg driver. Covers why migrations use the direct connection, the
  URL change Tortoise needs, an optional development branch, running the app
  elsewhere, the agent prompt, and a link for Tortoise ORM 0.x users.
enableTableOfContents: true
updatedOn: '2026-11-20T21:28:54.525Z'
---

<PromptBlock src="/prompts/tortoise-orm-prompt.md" labels={["Set up your agent and follow this guide", "Look up Tortoise ORM's docs", "Connect your Tortoise ORM project"]} />

<Steps>

## Start from a Python project

Tortoise ORM, an asyncio ORM inspired by Django, needs Python 3.10 or later. Use a project you already have, or create one with the [Python guide](/docs/guides/python), which uses uv. Skip this step if you already have a project.

## Add Neon's agent skills (optional)

Run `npx neon@latest skills` from your project directory to add Neon's [agent skills](/docs/ai/agent-skills), which teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The command needs Node.js 22.20 or later, even though the app is Python. The agent prompt at the top of this page installs them, so skip this step if you used it:

```bash filename="Terminal"
npx neon@latest skills
```

The [Neon MCP Server](/docs/ai/neon-mcp-server) connects your agent to Neon's tools as well; its page covers the setup.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and [Managed Better Auth](/docs/auth/overview) run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), sign in, and create the project. The npm install needs Node.js 20.19 or later; without Node.js, run `brew install neonctl` (Homebrew) or use another option on the install page:

```bash filename="Terminal"
npm i -g neon@latest
neon login
neon projects create --name my-app --region-id aws-us-east-2 --no-secrets
```

`--region-id` sets the region. `--no-secrets` keeps the connection string out of the output, since the next step pulls it into your env file. Pass `--org-id` to choose the organization (find IDs with `neon orgs list`).

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

Get two connection strings into an env file. The **pooled** `DATABASE_URL` goes through Neon's connection pooler, and your app uses it. The **direct** `DATABASE_URL_UNPOOLED` goes straight to Postgres, and Tortoise's migration commands use it (see [Why two connection strings?](#why-two-connection-strings)). The first tab runs `neon link --no-config` in your project directory, which writes both into `.env.local` (or `.env` if one exists); the second tab copies them into that file by hand. Add the env files to `.gitignore` first, so the connection strings stay out of git:

```bash filename="Terminal"
printf '\n.env\n.env.local\n' >> .gitignore
```

Python doesn't read env files itself: `uv run --env-file`, used in [Query it](#query-it), loads them, so you don't need `python-dotenv`.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your project's directory, link it to the Neon project. Install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't.

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into `.env.local`, or into `.env` if your project already has one.

`--no-config` skips the offer to create a [`neon.ts`](/docs/reference/neon-ts) file, which is for Node.js projects.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy both connection strings from **Connect** in the Neon Console, or from the API response, and add them to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
```

The development branch step below needs the Neon CLI, so skip it in this tab.

</TabItem>

</Tabs>

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install Tortoise ORM

Install [Tortoise ORM](https://tortoise.github.io/) with its asyncpg driver, an asyncio Postgres driver. The `asyncpg` extra installs the driver. The version range installs the latest 1.x release, and this guide is written for 1.x.

```bash filename="Terminal"
uv add "tortoise-orm[asyncpg]>=1,<2"
```

`uv add` records the package in `pyproject.toml` and installs it into the project's `.venv` directory. If you use pip in a virtual environment instead of uv, run `pip install "tortoise-orm[asyncpg]>=1,<2"` in the activated environment in place of `uv add`, and run each command below with `uv run --no-project --env-file .env.local` in front of the environment's own program, such as `.venv/bin/python main.py`. Tortoise ORM 0.x projects should follow Tortoise's [1.0 migration guide](https://tortoise.github.io/migration_guide.html) first, because 1.0 changed the connection API and replaced Aerich with a built-in migration tool.

## Configure Tortoise ORM

Create `db.py` with the connection settings. The `database_url()` function takes the name of an environment variable, keeps that URL's host and credentials, and replaces its query with `ssl=true`. With `ssl=true`, asyncpg encrypts the connection and checks the server certificate and host name, which is stricter than `sslmode=require`. asyncpg doesn't do SCRAM channel binding, so dropping `channel_binding` loses nothing. [Why the URL changes](#why-the-url-changes) explains the change. If Python on macOS reports `CERTIFICATE_VERIFY_FAILED`, run the `Install Certificates` command that comes with python.org builds.

```python filename="db.py"
import os
from urllib.parse import urlsplit, urlunsplit


def database_url(name: str) -> str:
    url = urlsplit(os.environ[name])
    return urlunsplit(url._replace(query="ssl=true"))


TORTOISE_ORM = {
    "connections": {"default": database_url("DATABASE_URL")},
    "apps": {
        "models": {
            "models": ["models"],
            # Set explicitly: the default location needs models to be a package.
            "migrations": "migrations",
            "default_connection": "default",
        },
    },
}

# The tortoise CLI (see pyproject.toml) migrates through the direct connection.
MIGRATION_ORM = {
    **TORTOISE_ORM,
    "connections": {"default": database_url("DATABASE_URL_UNPOOLED")},
}
```

Add a `[tool.tortoise]` table to `pyproject.toml`, so the `tortoise` command finds `MIGRATION_ORM`:

```toml filename="pyproject.toml"
[tool.tortoise]
tortoise_orm = "db.MIGRATION_ORM"
```

## Define a model and run a migration

Create `models.py` with a `User` model. Each field maps to a column in the `users` table:

```python filename="models.py"
from tortoise import fields
from tortoise.models import Model


class User(Model):
    id = fields.IntField(primary_key=True)
    name = fields.CharField(max_length=50)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "users"
```

Create the migrations folder, generate a migration from the model, and apply it:

```bash filename="Terminal"
uv run --env-file .env.local tortoise init
uv run --env-file .env.local tortoise makemigrations -n init
uv run --env-file .env.local tortoise migrate
```

`init` creates the `migrations` folder, `makemigrations` writes `migrations/0001_init.py` from your models, and `migrate` applies it to the database that `DATABASE_URL_UNPOOLED` points to. Run `makemigrations` and `migrate` again after each model change.

## Query it

Replace the `main.py` that `uv init` created (or your existing script) with this one, which adds a user, reads it back, and prints the Postgres version:

```python filename="main.py"
from tortoise import Tortoise, run_async

from db import TORTOISE_ORM
from models import User


async def main() -> None:
    await Tortoise.init(config=TORTOISE_ORM)

    user = await User.create(name="Ada")
    found = await User.get(id=user.id)
    print("User:", found.id, found.name, found.created_at)

    connection = Tortoise.get_connection("default")
    rows = await connection.execute_query_dict("SELECT version() AS version")
    print("Postgres version:", rows[0]["version"])

    await Tortoise.close_connections()


if __name__ == "__main__":
    run_async(main())
```

Run the script:

```bash filename="Terminal"
uv run --env-file .env.local main.py
```

The output shows the new user and the Postgres version. Each run adds one user, so run the script on a development branch, not on production.

</Steps>

## Why two connection strings?

Your app uses the pooled `DATABASE_URL`, which goes through PgBouncer, the connection pooler Neon runs. Migrations use the direct `DATABASE_URL_UNPOOLED`, because PgBouncer runs in [transaction mode](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode), and Neon recommends a direct connection for [schema changes](/docs/connect/connection-pooling).

## Why the URL changes

`neon link` writes a URL with `sslmode=require&channel_binding=require`. Tortoise passes each query parameter to the driver as a keyword argument, and asyncpg doesn't accept `sslmode` or `channel_binding`. A URL that Neon writes unchanged fails with `TypeError: connect() got an unexpected keyword argument 'sslmode'`. `database_url()` in `db.py` avoids that by replacing the query, so the env file keeps the URL as Neon writes it. `ssl=true` is the only SSL setting Tortoise's asyncpg backend needs: it makes asyncpg verify the server certificate and host name, and the channel binding that `neon link` requests isn't something asyncpg does. This is also why the guide sets the `ssl` option in code rather than in the env file: `neon checkout` rewrites the env file with Neon's original query.

## Troubleshooting

<DefinitionList>

`KeyError: 'DATABASE_URL'`
: The script ran without `DATABASE_URL` in its environment. Run it with `uv run --env-file .env.local`, or set the variable in your shell. The `tortoise` migration commands read `DATABASE_URL_UNPOOLED` instead, so a missing direct URL fails with `KeyError: 'DATABASE_URL_UNPOOLED'`.

``error: No environment file found at: `.env.local` ``
: `neon link` wrote `.env` because your project already had one, so `.env.local` doesn't exist. Pass `--env-file .env` instead.

`TypeError: connect() got an unexpected keyword argument 'sslmode'`
: The code passed `DATABASE_URL` to Tortoise unchanged. Pass `TORTOISE_ORM` from `db.py` to `Tortoise.init`, which uses `database_url()` for the connection.

`OperationalError: relation "users" does not exist`
: The `users` table isn't in the database that `DATABASE_URL` points to, because the migration hasn't run there. Run `uv run --env-file .env.local tortoise migrate`, after checking that `.neon` pins the branch you intended.

`ModuleNotFoundError: No module named 'tortoise'`
: The script ran with `python` instead of `uv run`, so it isn't using the project's virtual environment. Run it with `uv run --env-file .env.local` from the project directory.

</DefinitionList>

## Next steps

- [Tortoise ORM documentation](https://tortoise.github.io/): the reference, including models, queries, and migrations.
- **Deploy:** set `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in your host's environment, using the pooled string from `neon connection-string main --pooled` and the direct string from `neon connection-string main`. Run those commands in your own terminal, replacing `main` with `production` if that's your default branch, because they print the password. Run `uv run tortoise migrate` once per deploy, from one place, not from each instance, because Tortoise's migration tool doesn't lock the database, so two runs at the same time could both apply the same migration. Tortoise keeps its own pool of connections, so the app doesn't need one.
- **Add more of your backend:** [Managed Better Auth](/docs/auth/overview) for sign-in, [Object Storage](/docs/storage/overview) for files, [Neon Functions](/docs/compute/functions/overview) for long-running work, and [AI Gateway](/docs/ai-gateway/overview) for LLM calls. Each one branches with your database.

<NeedHelp/>
