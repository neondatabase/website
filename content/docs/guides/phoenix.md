---
title: Connect from Phoenix to Neon
subtitle: Set up a Neon project in seconds and connect from Phoenix
summary: >-
  Step-by-step guide for connecting a Phoenix application to a Neon database,
  including project creation, credential storage, and configuration of database
  connections using Ecto.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.031Z'
---

<CopyPrompt src="/prompts/phoenix-prompt.md"
description="Pre-built prompt for connecting Phoenix applications to Neon Postgres"/>

This guide describes how to connect Neon in a [Phoenix](https://www.phoenixframework.org) application. [Ecto](https://hexdocs.pm/ecto/3.11.2/Ecto.html) provides an API and abstractions for interacting databases, enabling Elixir developers to query any database using similar constructs.

It is assumed that you have a working installation of [Elixir](https://elixir-lang.org/install.html) (1.15 or later) and Erlang/OTP 25+.

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a Phoenix project

[Create a Phoenix project](https://hexdocs.pm/phoenix/installation.html#phoenix) if you do not have one:

```bash
# install phx.new if you haven't already
# mix archive.install hex phx_new
mix phx.new hello
```

When prompted, choose to not install the dependencies yet.

## Configure database connections

Update the following configuration files with your Neon database connection details. You can find your connection parameters by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

1. Update `config/dev.exs` with your database credentials:

   ```elixir {2-5,9}
   config :hello, Hello.Repo,
      username: "<YOUR_DB_USER>",
      password: "<YOUR_DB_PASSWORD>",
      hostname: "ep-xxx.aws.neon.tech",
      database: "neondb",
      stacktrace: true,
      show_sensitive_data_on_connection_error: true,
      pool_size: 10,
      ssl: [cacerts: :public_key.cacerts_get()]
   ```

   <Admonition type="note">
   The `:ssl` option is required to connect to Neon. Postgrex, since v0.18, verifies the server SSL certificate and you need to select CA trust store using `:cacerts` or `:cacertfile` options. You can use the OS-provided CA store by setting `cacerts: :public_key.cacerts_get()`. While not recommended, you can disable certificate verification by setting `ssl: [verify: :verify_none]`.
   </Admonition>

2. Update `config/runtime.exs` to read from the `DATABASE_URL` environment variable in production:

   ```elixir {2}
   config :hello, Hello.Repo,
      ssl: [cacerts: :public_key.cacerts_get()],
      url: database_url,
      pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
      socket_options: maybe_ipv6
   ```

3. Update `config/test.exs` with your testing credentials:

   ```elixir {2,3,4,8}
   config :hello, Hello.Repo,
      username: "<YOUR_DB_USER>",
      password: "<YOUR_DB_PASSWORD>",
      hostname: "ep-xxx.aws.neon.tech",
      database: "with_phoenix_test#{System.get_env("MIX_TEST_PARTITION")}",
      pool: Ecto.Adapters.SQL.Sandbox,
      pool_size: System.schedulers_online() * 2,
      ssl: [cacerts: :public_key.cacerts_get()]
   ```

   <Admonition type="tip">
   This guide configures the test environment for completeness but doesn't cover running tests. For production workflows, consider using [Neon branches](/docs/introduction/branching) instead of a separate test database. Branches provide isolated, cost-effective copies of your database that are ideal for testing and CI/CD pipelines.
   </Admonition>

## Install dependencies and create databases

1. Navigate into your project directory and install the dependencies:

   ```bash
   cd hello
   mix deps.get
   ```

2. Create the development and test databases:

   ```bash
   mix ecto.create
   MIX_ENV=test mix ecto.create
   ```

   The first command creates the development database (`neondb`). The second creates the test database (`with_phoenix_test`). This will also create the `schema_migrations` table to prepare your database for Ecto migrations.

</Steps>

## Examples

This section demonstrates how to create a simple API endpoint in your Phoenix application to verify the database connection by querying the PostgreSQL version.

### Create a database version check controller

Create a new file named `lib/hello_web/controllers/db_check_controller.ex` and add the following code:

```elixir
defmodule HelloWeb.DBCheckController do
  use HelloWeb, :controller

  alias Hello.Repo

  def version(conn, _params) do
    # Execute a raw SQL query to get the PostgreSQL version
    {:ok, result} = Ecto.Adapters.SQL.query(Repo, "SELECT version();", [])

    # The result is a list with one row and one column
    [[version_string]] = result.rows

    # Return the version string as a JSON response
    json(conn, %{version: version_string})
  end
end
```

### Add a route

Open `lib/hello_web/router.ex`. Inside the existing `scope "/api", HelloWeb do` block, add the following route:

```elixir {3}
scope "/api", HelloWeb do
  # ...
  get "/db_version", DBCheckController, :version
end
```

### Run the application locally

Start your Phoenix server in development mode:

```bash
mix phx.server
```

Open a new terminal window and run the following `curl` command to verify your database connection:

```bash
curl http://localhost:4000/api/db_version
```

If successful, the output will return your database version as JSON:

```json
{"version":"PostgreSQL 17.8 (a48d9ca) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 12.2.0-14+deb12u1) 12.2.0, 64-bit"}
```

## Production deployment

When you are ready to deploy your application in production, you compile your app and pass your credentials securely using environment variables rather than hardcoded configuration files.

To compile the app and assets in production mode:

```bash
MIX_ENV=prod mix compile
MIX_ENV=prod mix assets.deploy
```

Generate a secret key required for encrypting and signing data:

```bash
mix phx.gen.secret
```

Run the Phoenix application using your full `DATABASE_URL` connection string:

```bash shouldWrap
PORT=4001 \
MIX_ENV=prod \
PHX_HOST=localhost \
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech/<dbname>?sslmode=require&channel_binding=require" \
SECRET_KEY_BASE="<your_generated_secret_key>" \
mix phx.server
```

You can expect to see the Phoenix application running at [http://localhost:4001](http://localhost:4001).

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with_phoenix" description="Get started with Phoenix and Neon" icon="github">Get started with Phoenix and Neon</a>

</DetailIconCards>

<details>
<summary>**Notes for AI-assisted setup**</summary>

- The `ssl: [cacerts: :public_key.cacerts_get()]` option is mandatory in all config files (`dev.exs`, `runtime.exs`, `test.exs`). The connection to Neon will fail without it.
- This guide uses `hello` as the app and module name. For existing projects, read the `:app` and `:mod` values from `mix.exs` and use those consistently in config and module names.
- Do not hardcode credentials in config files committed to version control. The `config/runtime.exs` pattern shown in this guide reads from `DATABASE_URL` at runtime, which is the recommended approach for production. For more information, see [Security overview](/docs/security/security-overview).
- The `mix phx.new` command is interactive and requires user input. It cannot be run non-interactively without specific flags.

</details>

<NeedHelp/>
