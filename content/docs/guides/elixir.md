---
title: Connect an Elixir application to Neon
subtitle: Create a Mix project, link it with neon link, and query Lakebase Postgres from Elixir with Postgrex
summary: >-
  To connect an Elixir app to Lakebase Postgres on Neon, create a Mix project, run
  neon link to write DATABASE_URL to .env.local, and query it with Postgrex. Covers
  one runnable example (create, insert, select, update, delete, and a transaction),
  running the app elsewhere, troubleshooting, and the Phoenix and Ecto guides as next
  steps.
enableTableOfContents: true
updatedOn: '2026-11-20T21:27:08.550Z'
---

<PromptBlock src="/prompts/elixir-prompt.md" labels={["Set up your agent and follow this guide", "Look up driver docs", "Connect your Elixir project"]} />

<Steps>

## Create an Elixir project

Create a project with [Mix](https://hexdocs.pm/mix/Mix.html), Elixir's build tool. You need Elixir 1.15 or later on Erlang/OTP 25 or later, the minimum for Postgrex 0.22 and for the `:public_key.cacerts_get()` call in the config. Skip this step if you already have a Mix project.

```bash filename="Terminal"
mix new neon_elixir_quickstart
cd neon_elixir_quickstart
```

This creates `mix.exs`, the project file, along with a `lib` directory for your code and a `test` directory.

## Add Neon's agent skills (optional)

Add Neon's [agent skills](/docs/ai/agent-skills) to your project with the command below. They teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The agent prompt at the top of this page installs them, so skip this step if you used it. The command runs through npm, so it needs Node.js 22.20 or later, even though the app is Elixir.

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

The first tab runs `neon link --no-config` in your project directory, which writes `DATABASE_URL` into `.env.local` (or `.env` if one exists); the second tab copies the connection string into that file by hand. Add the env files to `.gitignore` first, so the connection string stays out of git:

```bash filename="Terminal"
printf '\n.env\n.env.local\n' >> .gitignore
```

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your project's directory, link it to the Neon project. Install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't.

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's Neon variables, including `DATABASE_URL`, into `.env.local`, or into `.env` if your project already has one.

`--no-config` skips the offer to create a [`neon.ts`](/docs/reference/neon-ts) file, which is for Node.js projects.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response, and add it to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The development branch step below needs the Neon CLI, so skip it in this tab.

</TabItem>

</Tabs>

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

Install [Postgrex](https://hexdocs.pm/postgrex/Postgrex.html), the Postgres driver for Elixir, and [Dotenvy](https://hexdocs.pm/dotenvy), which loads the env file in development and tests. Elixir doesn't read env files on its own. Add both to the `deps` function in `mix.exs`:

```elixir filename="mix.exs"
defp deps do
  [
    {:postgrex, "~> 0.22"},
    {:dotenvy, "~> 1.2"}
  ]
end
```

Then download them:

```bash filename="Terminal"
mix deps.get
```

## Connect and run a query

Postgrex takes separate connection options, not a `postgresql://` URL, so `config/runtime.exs` splits `DATABASE_URL` into its parts. Create the file with this content (`mix new` doesn't make a `config` directory, so create that first). Replace `neon_elixir_quickstart` with the `app:` value in your `mix.exs` if your project has a different name.

```elixir filename="config/runtime.exs"
import Config

# In development and tests, load the env file that neon link wrote (.env, or .env.local).
# Variables set in your shell come last, so they override the file.
if config_env() in [:dev, :test] do
  Dotenvy.source!([".env", ".env.local", System.get_env()], side_effect: &System.put_env/1)
end

uri = URI.parse(System.fetch_env!("DATABASE_URL"))
[username, password] = uri.userinfo |> String.split(":", parts: 2) |> Enum.map(&URI.decode/1)

config :neon_elixir_quickstart, :database,
  hostname: uri.host,
  port: uri.port,
  database: uri.path |> String.trim_leading("/") |> URI.decode(),
  username: username,
  password: password,
  # Neon requires TLS. Postgrex doesn't read the URL's query parameters (sslmode, channel_binding)
  # and does no SCRAM channel binding, so this option turns TLS on.
  ssl: [cacerts: :public_key.cacerts_get()]
```

The `ssl` option verifies the server certificate against the CA certificates in your operating system. `mix compile` runs without `DATABASE_URL`. `mix run` and `mix test` read `config/runtime.exs`, so they need it; in development and tests, the env file provides it.

Create `version.exs` in the project directory. The script connects with that configuration and prints the Postgres version:

```elixir filename="version.exs"
config = Application.fetch_env!(:neon_elixir_quickstart, :database)
{:ok, conn} = Postgrex.start_link(config)

%{rows: [[version]]} = Postgrex.query!(conn, "SELECT version()", [])
IO.puts(version)
```

```bash filename="Terminal"
mix run version.exs
```

The output shows the Postgres version of your database, which confirms the connection:

```text
PostgreSQL 18.7 (84da7d8) on aarch64-unknown-linux-gnu, compiled by gcc ...
```

</Steps>

## Examples

Each example is one script that creates a `books` table, then inserts, selects, updates, and deletes rows, with a transaction in the middle. The script deletes the rows it adds, so you can run it again. Save it as `books.exs` in your project, and run it with `mix run books.exs`. The examples create the `books` table and write rows to the branch that your `DATABASE_URL` points at, so run them on a development branch: complete [Work on a development branch](#work-on-a-development-branch-optional) first. Without the CLI, create a branch in the Neon Console and copy its connection string into `.env.local`, as described in [Create a branch](/docs/manage/branches#create-a-branch).

```elixir filename="books.exs"
config = Application.fetch_env!(:neon_elixir_quickstart, :database)
{:ok, conn} = Postgrex.start_link(config)

# Create a table
Postgrex.query!(conn, """
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  year INT
)
""", [])

# Insert a row and get its id back
%{rows: [[dune_id]]} =
  Postgrex.query!(
    conn,
    "INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id",
    ["Dune", "Frank Herbert", 1965]
  )

# Select the row
%{rows: selected} =
  Postgrex.query!(conn, "SELECT id, title, year FROM books WHERE id = $1", [dune_id])

IO.inspect(selected, label: "Selected")

# Update the row
Postgrex.query!(conn, "UPDATE books SET year = $1 WHERE id = $2", [1966, dune_id])

# Insert two rows in a transaction: both commit, or neither does
{:ok, {emma_id, persuasion_id}} =
  Postgrex.transaction(conn, fn tx ->
    %{rows: [[emma_id]]} =
      Postgrex.query!(
        tx,
        "INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id",
        ["Emma", "Jane Austen", 1815]
      )

    %{rows: [[persuasion_id]]} =
      Postgrex.query!(
        tx,
        "INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id",
        ["Persuasion", "Jane Austen", 1817]
      )

    {emma_id, persuasion_id}
  end)

%{rows: all} = Postgrex.query!(conn, "SELECT title, year FROM books ORDER BY year", [])
IO.inspect(all, label: "All books")

# Delete the rows this script added
Postgrex.query!(conn, "DELETE FROM books WHERE id = ANY($1)", [[dune_id, emma_id, persuasion_id]])
```

`Postgrex.transaction/2` commits when the function returns. An exception inside it, or a call to `Postgrex.rollback/2`, rolls the transaction back.

## Run it elsewhere

On a host, set `DATABASE_URL` in the host's environment instead of an env file. `config/runtime.exs` reads it at startup in every environment; in development and tests, the env files fill it in first. For production, use your default branch's pooled connection string, which goes through [Neon's connection pooler](/docs/connect/connection-pooling): run `neon connection-string main --pooled` in your own terminal, replacing `main` with `production` if that's your project's default branch, because the command prints the password. Postgrex keeps its own small pool (`pool_size`, default 1) and returns the connection after each query, so you don't need another pool on top of Neon's pooler (see [Double pooling](/docs/connect/choose-connection#common-pitfalls)). For idle connections that drop, see the [connection errors](/docs/connect/connection-errors#postgrex-dbconnection-connectionerror-ssl-send-closed) page.

## Add more of your backend

Neon also runs object storage, a model gateway, and serverless functions next to your database. Each entry below says what the service does.

<DefinitionList>

Object Storage
: S3-compatible buckets for uploads and files. See [Object Storage](/docs/storage/overview).

AI Gateway
: Routes calls to models from Anthropic, OpenAI, Google, and more through one endpoint on your branch. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute (the server that runs your code next to your database), called over HTTP. See [Neon Functions](/docs/compute/functions/overview).

</DefinitionList>

## Troubleshooting

<DefinitionList>

`** (System.EnvError) could not fetch environment variable "DATABASE_URL" because it is not set`
: The script ran without `DATABASE_URL`. Run `mix run` from the project directory, where `neon link` wrote the env file, or set the variable in your shell.

``ERROR 28000 (invalid_authorization_specification) connection is insecure (try using `sslmode=require`)``
: Postgrex connected without TLS, because the `ssl` option is missing from `config/runtime.exs`. Add `ssl: [cacerts: :public_key.cacerts_get()]` to the configuration.

</DefinitionList>

## Next steps

- [Connect a Phoenix application to Neon](/docs/guides/phoenix): Use Postgrex and Ecto in a Phoenix app, with configuration for development and production.
- [Connect from Elixir with Ecto to Neon](/docs/guides/elixir-ecto): Define schemas and run migrations with Ecto instead of raw SQL.

<NeedHelp/>
