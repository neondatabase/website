---
title: Connect from Ecto to Neon
subtitle: Create a Neon project, link it with neon link, and query Lakebase Postgres from Ecto with Postgrex
summary: >-
  To connect an Elixir app with Ecto to Lakebase Postgres on Neon, run neon link
  to write DATABASE_URL and DATABASE_URL_UNPOOLED to an env file, configure the Ecto
  repo with SSL in config/runtime.exs, then define a schema, run a migration, and
  query it. Covers ecto_sql 3.14 and Postgrex 0.22, why migrations use the direct
  connection, an optional development branch, the agent prompt, and links for
  Phoenix and Elixir users.
enableTableOfContents: true
updatedOn: '2026-11-20T23:02:12.987Z'
---

<PromptBlock src="/prompts/elixir-ecto-prompt.md" labels={["Set up your agent and follow this guide", "Look up Ecto's docs", "Connect your Ecto app"]} />

<Steps>

## Start from a Mix project with a supervision tree

Create the project with `mix new friends --sup`, which adds the supervision tree that Ecto, the database wrapper and query generator for Elixir, needs. This guide needs Elixir 1.15 or later on Erlang/OTP 25 or later. Skip this step if you already have such a project. A Phoenix app has one (see the [Phoenix guide](/docs/guides/phoenix)). For Elixir without Ecto, see the [Elixir guide](/docs/guides/elixir), which creates a project without `--sup`.

```bash filename="Terminal"
mix new friends --sup
cd friends
```

## Add Neon's agent skills (optional)

Run `npx neon@latest skills` from your project directory to add Neon's [agent skills](/docs/ai/agent-skills), which teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The command needs Node.js 22.20 or later, even though the app is Elixir. The agent prompt at the top of this page installs them, so skip this step if you used it:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Ecto publishes its docs for AI agents at [hexdocs.pm/ecto/llms.txt](https://hexdocs.pm/ecto/llms.txt), and the agent prompt points your agent there.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and Managed Better Auth run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

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

Get two connection strings into an env file. The **pooled** connection goes through Neon's connection pooler, and its host name has `-pooler`. Your app uses it. The **direct** connection goes straight to Postgres, and migrations use it (see [Why two connection strings?](#why-two-connection-strings)). Add the env files to `.gitignore` first, so the connection strings stay out of git:

```bash filename="Terminal"
printf '\n.env\n.env.local\n' >> .gitignore
```

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your project's directory, link it to the Neon project. Install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't.

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) into `.env.local`, or into `.env` if your project already has one.

`--no-config` skips the offer to create a [`neon.ts`](/docs/reference/neon-ts) file, which is for JavaScript projects.

```bash filename="Terminal"
neon link --no-config
```

Without a terminal, as in a script or an agent's shell, `neon link` doesn't prompt. Pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy both connection strings from **Connect** in the Neon Console, or from the API response, and add them to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
```

The development branch step needs the Neon CLI, so skip it in this tab.

</TabItem>

</Tabs>

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install Ecto and Postgrex

Install [`ecto_sql`](https://hexdocs.pm/ecto_sql), which provides Ecto's SQL adapters and its migration tool. Install [Postgrex](https://hexdocs.pm/postgrex/Postgrex.html), the Postgres driver that Ecto uses. Install [Dotenvy](https://hexdocs.pm/dotenvy), which loads the env file in development, because Elixir doesn't read env files on its own. Add all three to the `deps` function in `mix.exs`:

```elixir filename="mix.exs"
defp deps do
  [
    {:ecto_sql, "~> 3.14"},
    {:postgrex, "~> 0.22"},
    {:dotenvy, "~> 1.2"}
  ]
end
```

Then download them:

```bash filename="Terminal"
mix deps.get
```

This guide is for Ecto 3, the current major version. For an older Ecto project, read the [Ecto changelog](https://hexdocs.pm/ecto/changelog.html) before you upgrade.

## Configure Ecto

The code in this section uses the app name `friends` and the module `Friends`. In an existing app, replace them with your app's name and module from `mix.exs`.

Ecto needs a repo module, which runs the queries, and its configuration. Create the repo in `lib/friends/repo.ex`:

```elixir filename="lib/friends/repo.ex"
defmodule Friends.Repo do
  use Ecto.Repo,
    otp_app: :friends,
    adapter: Ecto.Adapters.Postgres
end
```

Add the repo to the children of the application in `lib/friends/application.ex`, so it starts with the app:

```elixir filename="lib/friends/application.ex"
children = [
  Friends.Repo
]
```

Create `config/config.exs`. It names the repo so Ecto's Mix tasks can find it:

```elixir filename="config/config.exs"
import Config

config :friends, ecto_repos: [Friends.Repo]
```

Create `config/runtime.exs`. Mix reads it every time it starts the app, including for `mix ecto.migrate`, so the repo gets its connection from `DATABASE_URL` each time:

```elixir filename="config/runtime.exs"
import Config

# In development, load the env file that neon link wrote (.env, or .env.local).
# Variables set in your shell come last, so they override the file.
if config_env() == :dev do
  Dotenvy.source!([".env", ".env.local", System.get_env()], side_effect: &System.put_env/1)
end

config :friends, Friends.Repo,
  url: System.get_env("DATABASE_URL"),
  ssl: [cacerts: :public_key.cacerts_get()]
```

The `ssl` option is required to connect to Neon. Postgrex verifies the server certificate, so it needs a trust store, and `:public_key.cacerts_get()` uses your operating system's CA certificates. Postgrex doesn't read `sslmode` from the URL, so this option is what turns on TLS. Postgrex also sends the URL's host name as the TLS server name, so the config doesn't need to set it.

Production reads `DATABASE_URL` from the host's environment, not from an env file. The dev block is the only one that loads a file.

## Define a schema and run a migration

Generate a migration with `mix ecto.gen.migration create_people`. The generator writes an empty file in `priv/repo/migrations`, named with a timestamp, like `<timestamp>_create_people.exs`. Replace its `change/0` function so the file reads:

```elixir filename="priv/repo/migrations/<timestamp>_create_people.exs"
defmodule Friends.Repo.Migrations.CreatePeople do
  use Ecto.Migration

  def change do
    create table(:people) do
      add :first_name, :string
      add :last_name, :string
      add :age, :integer
    end
  end
end
```

Create `lib/friends/person.ex`, the schema that maps Elixir structs to the `people` table:

```elixir filename="lib/friends/person.ex"
defmodule Friends.Person do
  use Ecto.Schema

  schema "people" do
    field :first_name, :string
    field :last_name, :string
    field :age, :integer
  end
end
```

Run the migration on your development branch if you made one. It creates the table and records the migration in the `schema_migrations` table. Ecto's repo reads a single `DATABASE_URL`, so this command sets it to the direct string for that run. The Neon CLI prints the direct string:

```bash filename="Terminal"
DATABASE_URL="$(neon connection-string)" mix ecto.migrate
```

Without the CLI, replace `$(neon connection-string)` with the value of `DATABASE_URL_UNPOOLED` from your env file, keeping the double quotes.

## Query it

Create `query.exs` in the project root. It inserts a row, reads it back, and prints the Postgres version:

```elixir filename="query.exs"
alias Friends.{Person, Repo}

person = Repo.insert!(%Person{first_name: "Ada", last_name: "Lovelace", age: 36})
IO.inspect(Repo.get!(Person, person.id), label: "Person")

%{rows: [[version]]} = Repo.query!("SELECT version()")
IO.puts(version)
```

Run the script:

```bash filename="Terminal"
mix run query.exs
```

The output shows the new row and the Postgres version. Each run adds one row, so run it on your development branch if you made one.

</Steps>

## Why two connection strings?

Your app uses the pooled `DATABASE_URL`, which goes through PgBouncer, the connection pooler Neon runs. Migrations use the direct `DATABASE_URL_UNPOOLED`, because PgBouncer runs in [transaction mode](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode). Ecto's repo reads one URL, so the migration command sets `DATABASE_URL` to the direct string (see [Neon's connection pooling page](/docs/connect/connection-pooling) for which tasks use the direct connection).

## Troubleshooting

<DefinitionList>

`** (ArgumentError) missing the :database key in options for Friends.Repo`
: `DATABASE_URL` isn't set when the app starts, so the repo has no connection options. Check that `.env.local` or `.env` sets it. In production, set it in the host's environment. Queries that wait for a connection then fail with `DBConnection.ConnectionError` after about six seconds.

`ssl send: closed`
: The connection to Neon closed before Ecto used it. We saw this once, after an idle period; running the command again worked. See [Postgrex: DBConnection ConnectionError ssl send: closed](/docs/connect/connection-errors#postgrex-dbconnection-connectionerror-ssl-send-closed).
</DefinitionList>

## Next steps

- **Deploy:** set `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in the host's environment, since only the dev block of `config/runtime.exs` reads an env file. Run migrations before you start a new version with `DATABASE_URL="$DATABASE_URL_UNPOOLED" mix ecto.migrate` (the [Phoenix guide's deploy section](/docs/guides/phoenix#deploy) shows a release and its migrate script).
- [Ecto Getting Started](https://hexdocs.pm/ecto/getting-started.html): schemas, queries, and changesets.
- [Connect a Phoenix application to Neon](/docs/guides/phoenix): Ecto and Postgrex in a Phoenix app, with configuration for development and production.
- [Connect an Elixir application to Neon](/docs/guides/elixir): Postgrex without Ecto.
- **Add more of your backend:** [Managed Better Auth](/docs/auth/overview) for sign-in, [Object Storage](/docs/storage/overview) for files, [Neon Functions](/docs/compute/functions/overview) for long-running work, and [AI Gateway](/docs/ai-gateway/overview) for LLM calls. Each one branches with your database.

<NeedHelp/>
