---
title: Connect a Phoenix application to Neon
subtitle: Connect a Phoenix app to Lakebase Postgres on Neon, query it from a controller, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a Phoenix 1.8 app to Lakebase Postgres on Neon: optionally add Neon's
  agent skills, create a Neon project (Neon CLI, API, or Console), link it with
  the Neon CLI, set DATABASE_URL in each shell command because Phoenix doesn't
  read env files, optionally develop on a Neon branch, and query it with Ecto
  and Postgrex from a controller. Covers Phoenix 1.8 (Elixir 1.17 or later) and
  Phoenix 1.7 (Elixir 1.14 or later), plus configuration for development and
  production, a release for deployment, troubleshooting, and Neon's other
  backend services from Phoenix.
enableTableOfContents: true
updatedOn: '2026-11-19T01:51:37.167Z'
---

<PromptBlock src="/prompts/phoenix-prompt.md" labels={["Set up your agent and follow this guide", "Look up Phoenix's docs", "Connect your Phoenix app"]} />

<Steps>

## Create a Phoenix app (skip if you already have an app)

Install [Elixir](https://elixir-lang.org/install.html) 1.17 or later, which the Phoenix 1.8 generator requires. Then install the generator and create the app without fetching dependencies yet:

```bash filename="Terminal"
mix archive.install hex phx_new --force
mix phx.new hello --no-install
cd hello
```

`mix archive.install` installs the generator for your user account. `--force` skips its confirmation prompt, and `--no-install` skips the dependency prompt. The next step fetches the dependencies.

The generator also creates a Git repository and an `AGENTS.md` file with Phoenix conventions for AI agents. Keep that file in place.

The generated `.gitignore` doesn't exclude env files, and `neon link` may write your connection string to one. Add them now:

```bash filename="Terminal"
printf '\n.env\n.env.local\n' >> .gitignore
```

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The agent prompt at the top of this page installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

This command needs [Node.js](https://nodejs.org/en/download) 22.20 or later.

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Phoenix publishes its docs for AI agents at [hexdocs.pm/phoenix/llms.txt](https://hexdocs.pm/phoenix/llms.txt). The prompt above has your agent look up Phoenix docs there.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and Managed Better Auth run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), which needs [Node.js](https://nodejs.org/en/download) 20.19 or later, sign in, and create the project:

```bash filename="Terminal"
npm i -g neon@latest
neon login
neon projects create --name hello --region-id aws-us-east-2 --no-secrets
```

`--region-id` sets the region; pass a different one to pick another of the regions above. `--no-secrets` keeps the connection string out of the output, since the next step reads it from the project. Pass `--org-id` to choose the organization (find IDs with `neon orgs list`).

</TabItem>

<TabItem>

Create an [API key](https://console.neon.tech/app/settings/api-keys), export it, then create the project in your organization:

```bash filename="Terminal"
export NEON_API_KEY=napi_...

curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "hello", "region_id": "aws-us-east-2", "org_id": "<org-id>"}}'
```

The response includes the project's connection string in `connection_uris[0].connection_uri`. See [Create a project with the API](/docs/manage/projects#create-a-project-with-the-api) for the other options.

</TabItem>

<TabItem>

Go to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console, click **New Project**, and pick one of the regions above.

</TabItem>

</Tabs>

## Connect your app to the project

Phoenix doesn't read env files. The app gets `DATABASE_URL` from the environment, so link the project (CLI tab) or save the connection string (without the CLI tab), then set `DATABASE_URL` in each shell command that runs `mix`.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link
```

`neon link` prompts you to pick an organization and a project, or to create a new project. It writes a `.neon` file with the project context and pins a branch (pass `--branch` to choose one). `neon link` also pulls the branch's `DATABASE_URL` into `.env.local`, or into `.env` if your app already has one. It also offers to create a [`neon.ts`](/docs/reference/neon-ts) file. This guide doesn't use that file, so decline the offer.

Without a terminal, as in a script or an agent's shell, `link` doesn't prompt. If the project has more than one branch, pass `--branch` with the branch name (`main` for projects created with the CLI or API, `production` for projects created in the Console) or `-y` to pin the project's default branch. A project with one branch gets pinned automatically. The command below works for either kind of project:

```bash filename="Terminal"
neon link --org-id <org-id> --project-id <project-id> -y
```

To create a project instead, pass `--project-name` and `--region-id` in place of `--project-id`. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response. Add it to your env file in your app's directory. The example uses `.env.local`. Use `.env` instead if it exists. For more information, see [Connect from any application](/docs/connect/connect-from-any-app). Use the direct string (the one without the pooled option), since this guide uses it for `mix ecto.create` and migrations.

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

</TabItem>

</Tabs>

In an agent's shell, each command starts a new shell, so set `DATABASE_URL` on the same command line that runs `mix`. With the CLI, `neon connection-string` uses the branch that `.neon` pins and prints the URL. Use the pooled string for the app:

```bash filename="Terminal"
export DATABASE_URL="$(neon connection-string --pooled)" && test -n "$DATABASE_URL" && mix phx.server
```

Use the direct string (leave out `--pooled`) for `mix ecto.create` and migrations, because schema changes need a direct connection. See [connection pooling](/docs/connect/connection-pooling):

```bash filename="Terminal"
export DATABASE_URL="$(neon connection-string)" && test -n "$DATABASE_URL" && mix ecto.create
```

Without the CLI, read the `DATABASE_URL` line from your env file. `neon link` writes to `.env` if your app already has one, and to `.env.local` otherwise. The command below reads `.env` when it exists.

Don't `source` the file instead. The command reads only the `DATABASE_URL` line and doesn't evaluate its value, so a `$` or a backtick in a password doesn't expand in the shell:

```bash filename="Terminal" shouldWrap
f=.env.local; [ -f .env ] && f=.env; export DATABASE_URL="$(sed -n 's/^DATABASE_URL="\{0,1\}\([^"]*\)"\{0,1\}$/\1/p' "$f")" && test -n "$DATABASE_URL" && mix phx.server
```

Keep `DATABASE_URL` in one place only. In production, set it in your host's environment instead (see [Deploy](#deploy)).

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch and pins it in `.neon`. From then on, `neon connection-string` returns the `dev` branch's URLs, so the commands in the Connect step use the branch. Without the CLI, copy the branch's connection string into `.env.local` yourself.

## Configure the database connection

If your app already exists, skip the generator and make these changes in your files. Phoenix 1.7 apps have the same repo blocks in `config/dev.exs` and `config/runtime.exs`. They also have the same `/api` scope in the router, so the steps apply to them too. Phoenix 1.7 needs Elixir 1.14 or later.

Phoenix's generator writes a repo configuration for a local Postgres. Replace it with one that reads `DATABASE_URL`, in development, test, and production.

The examples assume an app named `hello`, so the repo is `Hello.Repo` and the web module is `HelloWeb`. In an existing app, use the `app:` value in `mix.exs` and the module names that match it, such as `MyApp.Repo`.

1. In `config/dev.exs`, replace the `Hello.Repo` block with:

   ```elixir filename="config/dev.exs"
   config :hello, Hello.Repo,
     url: System.get_env("DATABASE_URL"),
     database: "hello_dev",
     ssl: [cacerts: :public_key.cacerts_get()],
     stacktrace: true,
     show_sensitive_data_on_connection_error: true,
     pool_size: 10
   ```

   When `DATABASE_URL` is set, its database name takes the place of `database`, which applies only when the variable is missing.

   <Admonition type="note">
   The `ssl` option is required to connect to Neon. Postgrex verifies the server certificate by default, so it needs a CA trust store. `:public_key.cacerts_get()` uses the CA certificates of your operating system. Neon's certificates are publicly trusted, so no other setting is needed.

   Postgrex ignores the `sslmode` and `channel_binding` parameters in the connection string, so `ssl` is what turns on TLS. The dev and test blocks require TLS too, so they fail against a local Postgres that doesn't offer it (`ssl not available`).

   Don't use `ssl: [verify: :verify_none]` to get past a certificate error. It turns off certificate checks.
   </Admonition>

   <Admonition type="note">
   Postgrex pings idle connections every 1000 milliseconds by default. Neon's [connection errors](/docs/connect/connection-errors#postgrex-dbconnection-connectionerror-ssl-send-closed) page and the [Ecto guide](/docs/guides/elixir-ecto) both say that this default prevents [Scale to Zero](/docs/introduction/scale-to-zero) from suspending the compute. If you rely on Scale to Zero, you can raise the interval in the same list, for example `idle_interval: :timer.hours(24)`. This guide hasn't tested that change, so check on your project that the compute suspends and that you don't see `ssl send: closed` errors.
   </Admonition>

2. In `config/runtime.exs`, inside the `if config_env() == :prod do` block, replace `# ssl: true,` with:

   ```elixir filename="config/runtime.exs"
   ssl: [cacerts: :public_key.cacerts_get()],
   ```

   The production block reads `DATABASE_URL` and stops the app at startup if the variable isn't set. It also reads `ECTO_IPV6`: set it to `true` on an IPv6-only host. That's why the generated `socket_options: maybe_ipv6` line stays in the block. The `idle_interval` note above applies to production connections too.

3. In `config/test.exs`, replace the `Hello.Repo` block with:

   ```elixir filename="config/test.exs"
   config :hello, Hello.Repo,
     url: System.get_env("DATABASE_URL"),
     database: "hello_test#{System.get_env("MIX_TEST_PARTITION")}",
     pool: Ecto.Adapters.SQL.Sandbox,
     pool_size: System.schedulers_online() * 2,
     ssl: [cacerts: :public_key.cacerts_get()]
   ```

<Admonition type="warning">
`mix test` runs the `test` alias, which creates and migrates the database that `DATABASE_URL` names. Run it only with a development or test branch URL set explicitly, never with your default branch. For example, if you created the dev branch, `export DATABASE_URL="$(neon connection-string dev)" && test -n "$DATABASE_URL" && mix test` runs against the `dev` branch. Naming the branch keeps the command from resolving to your default branch. Like the dev block, the test block uses TLS, so it can't use a local Postgres without SSL.
</Admonition>

## Add a database check route

Add a controller that runs `SELECT version()` and returns the result as JSON, then a route for it.

1. In `lib/hello_web/router.ex`, replace the commented-out `/api` scope with:

   ```elixir filename="lib/hello_web/router.ex"
   scope "/api", HelloWeb do
     pipe_through :api

     get "/db_version", DBCheckController, :version
   end
   ```

   If your router already has an `/api` scope, add the `get` line inside it.

2. Create `lib/hello_web/controllers/db_check_controller.ex`:

   ```elixir filename="lib/hello_web/controllers/db_check_controller.ex"
   defmodule HelloWeb.DBCheckController do
     use HelloWeb, :controller

     def version(conn, _params) do
       %{rows: [[version]]} = Hello.Repo.query!("SELECT version()")
       json(conn, %{version: version})
     end
   end
   ```

   `query!` raises an error if the query fails. Phoenix turns that into a `500` response, and the server keeps running.

## Install dependencies and create the database

Fetch the dependencies, then create the database with the direct string from the Connect step:

```bash filename="Terminal"
mix deps.get
export DATABASE_URL="$(neon connection-string)" && test -n "$DATABASE_URL" && mix ecto.create
```

Without the CLI, use the file-reading command from the Connect step instead. `mix ecto.create` creates the database named in `DATABASE_URL`. A new Neon project already has a `neondb` database, so the command reports that the database has already been created.

## Run the app

Start the server with the pooled string from the Connect step:

```bash filename="Terminal"
export DATABASE_URL="$(neon connection-string --pooled)" && test -n "$DATABASE_URL" && mix phx.server
```

Without the CLI, use the file-reading command from the Connect step instead.

Phoenix serves the app at [localhost:4000](http://localhost:4000), or on the port in `PORT` if you set one. Stop the server with Ctrl-C when you're done. In a second terminal, while the server runs, query the new route:

```bash filename="Terminal"
curl http://localhost:4000/api/db_version
```

The response shows your Postgres version, which confirms the connection:

```json filename="Example output"
{"version":"PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu, compiled by gcc ..."}
```

</Steps>

## Deploy

This guide deploys an Elixir release. A release is a build that runs without Mix, so the host doesn't need Elixir or the build tools. Phoenix's [releases guide](https://hexdocs.pm/phoenix/releases.html) covers the details. Build the release on a machine or image with the same operating system and CPU architecture as your host.

- Generate the release files once. Run `mix phx.gen.release`. It creates `lib/hello/release.ex`, with the `Hello.Release` module that the migrate script calls, and the `rel/overlays/bin/migrate` and `server` scripts.

  ```bash filename="Terminal"
  mix phx.gen.release
  ```

- Build the code, the assets, and the release. Compiling before `assets.deploy` follows Phoenix's releases guide. The first asset build downloads esbuild and Tailwind.

  ```bash filename="Terminal"
  MIX_ENV=prod mix deps.get --only prod
  MIX_ENV=prod mix compile
  MIX_ENV=prod mix assets.deploy
  MIX_ENV=prod mix release
  ```

  The release is in `_build/prod/rel/hello`. Copy that directory to your host.

- Set these variables in your host's environment. Phoenix reads them at startup and doesn't read env files. Every release command reads the same production configuration, so `SECRET_KEY_BASE` is needed for the migrate script too.
  - `DATABASE_URL`: the pooled string for the branch you deploy (`neon connection-string main --pooled`, or `production`). The app uses it. See [connection pooling](/docs/connect/connection-pooling).
  - `SECRET_KEY_BASE`: a secret for signing and encrypting data. Generate it with `mix phx.gen.secret`, and keep it out of git.
  - `PHX_HOST`: the public hostname of your app.
  - `PORT`: most hosts set this for you. The app listens on it.
  - `POOL_SIZE` (optional): the number of connections in the pool. The default is 10.

- Run migrations. Use the direct string, once per deploy, before you start the new version. Migrations change the schema, and Neon recommends a direct connection for them. Replace `main` with the branch you deploy (`production` for projects created in the Console).

  ```bash filename="Terminal" shouldWrap
  export DATABASE_URL="$(neon connection-string main)" && test -n "$DATABASE_URL" && _build/prod/rel/hello/bin/migrate
  ```

  Skip this step if your app has no migrations. The migrate script also needs `SECRET_KEY_BASE` in its environment.

- Start the server. The server script sets `PHX_SERVER=true`.

  ```bash filename="Terminal"
  _build/prod/rel/hello/bin/server
  ```

Running `MIX_ENV=prod mix phx.server` on the host also works, but then the host needs Elixir and the build tools, so this guide uses the release.

## Add more of your backend

Neon's other backend services run on a branch of your project. The commands below act on the branch that `.neon` pins, so try them on your development branch first.

<DefinitionList>

Managed Better Auth
: Sign-up, sign-in, and sessions stored in your database.
: Enable it with `neon neon-auth enable`. See [Managed Better Auth](/docs/auth/overview).

Object Storage
: S3-compatible buckets for uploads and files.
: Create a bucket with `neon buckets create <name>`. `neon env pull` writes the bucket's credentials to your env file. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: `neon env pull` writes the default AI Gateway credential (`NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL`) to your env file. To call the gateway over HTTP, add `{:req, "~> 0.5"}` to `deps` in `mix.exs` if it isn't there, then run `mix deps.get`. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute next to your database, for work that outlasts a request, such as agents and webhooks.
: Create and deploy a function with `neon functions new` and `neon functions deploy`. Function code is Node.js, so keep it apart from this Elixir app, and call a deployed function over HTTP. See [Neon Functions](/docs/compute/functions/overview).

Realtime (beta)
: Live SQL query subscriptions.
: Enable it with `neon realtime enable --allowed-origin https://<your-app-origin>`. Without `--allowed-origin`, any browser origin can connect; with it, only the origins you list can. Repeat the flag for each origin, such as `http://localhost:4000` during development. Server clients aren't affected by the list. See [Realtime](/docs/realtime/overview).

</DefinitionList>

Keep each service's credentials in your env file, out of git, and set them on your host too. Use each service's CLI command rather than `neon config add`, which creates a `neon.ts` file and installs npm packages that a Phoenix app doesn't need.

## Troubleshooting

<DefinitionList>

`** (RuntimeError) environment variable DATABASE_URL is missing.`
: The production server or a release command started without `DATABASE_URL`. Set it in the host's environment. `mix phx.server` doesn't read `.env.local`.

`** (RuntimeError) environment variable SECRET_KEY_BASE is missing.`
: Production configuration requires `SECRET_KEY_BASE`, including for `bin/migrate`. Generate one with `mix phx.gen.secret` and set it in the environment.

`tcp connect (localhost:5432): connection refused`
: The app didn't get `DATABASE_URL`, so it fell back to a local Postgres. Set `DATABASE_URL` in the same command as `mix`, as in the Connect step, then start the server again.

`ssl not available`
: The dev or test configuration asked for TLS, and the server didn't offer it. Neon requires TLS, so this error means `DATABASE_URL` points at a server without SSL, usually a local Postgres. Point it at your Neon branch.

`DBConnection.ConnectionError` with `connection not available and request was dropped from queue`
: The app couldn't get a connection to Neon, and `/api/db_version` returns a `500` with this error. The server keeps running. Check that `DATABASE_URL` is set and points at your project.

`ssl send: closed`
: A connection to Neon was closed before the app used it. See [Postgrex: DBConnection ConnectionError ssl send: closed](/docs/connect/connection-errors#postgrex-dbconnection-connectionerror-ssl-send-closed) and the `idle_interval` note in [Configure the database connection](#configure-the-database-connection). This guide doesn't verify the workaround.

`installer requires Elixir v1.17 or later`
: The Phoenix 1.8 generator needs Elixir 1.17 or later. Install a newer Elixir, then run `mix archive.install hex phx_new --force` again. Phoenix 1.7 apps need Elixir 1.14 or later.

</DefinitionList>

## Next steps

- **Create a table:** run `mix ecto.gen.migration create_people`, add the table in the new file in `priv/repo/migrations`, then run the migration on the direct string of the branch `.neon` pins:

  ```bash filename="Terminal"
  export DATABASE_URL="$(neon connection-string)" && test -n "$DATABASE_URL" && mix ecto.migrate
  ```

  With no branch name, `neon connection-string` uses the branch that `.neon` pins, or the project's default branch if nothing is pinned. For the Ecto and Postgrex details, see [Connect from Elixir with Ecto](/docs/guides/elixir-ecto).

- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.

<NeedHelp/>
