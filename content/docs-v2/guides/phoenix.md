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

It is assumed that you have a working installation of [Elixir](https://elixir-lang.org/install.html).

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find your connection string by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
```

You will need the connection string details later in the setup.

## Create a Phoenix project

[Create a Phoenix project](https://hexdocs.pm/phoenix/installation.html#phoenix) if you do not have one:

```bash
# install phx.new if you haven't already
# mix archive.install hex phx_new
mix phx.new hello
```

When prompted, choose to not install the dependencies yet.

## Configure database connections

Update the following configuration files with your Neon database connection details from the connection string you copied earlier.

1. Update `config/dev.exs`:

   ```elixir {2-5,9}
   config :hello, Hello.Repo,
      username: "neondb_owner",
      password: "JngqXejzvb93",
      hostname: "ep-rough-snowflake-a5j76tr5.us-east-2.aws.neon.tech",
      database: "neondb",
      stacktrace: true,
      show_sensitive_data_on_connection_error: true,
      pool_size: 10,
      ssl: [cacerts: :public_key.cacerts_get()]
   ```

   <Admonition type="note">
   The `:ssl` option is required to connect to Neon. Postgrex, since v0.18, verifies the server SSL certificate and you need to select CA trust store using `:cacerts` or `:cacertfile` options. You can use the OS-provided CA store by setting `cacerts: :public_key.cacerts_get()`. While not recommended, you can disable certificate verification by setting `ssl: [verify: :verify_none]`.
   </Admonition>

2. Update `config/runtime.exs`:

   ```elixir {2}
   config :hello, Hello.Repo,
      ssl: [cacerts: :public_key.cacerts_get()],
      url: database_url,
      pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
      socket_options: maybe_ipv6
   ```

3. Update `config/test.exs`:

   ```elixir {2,3,4,8}
   config :hello, Hello.Repo,
      username: "neondb_owner",
      password: "JngqXejzvb93",
      hostname: "ep-rough-snowflake-a5j76tr5.us-east-2.aws.neon.tech",
      database: "with_phoenix_test#{System.get_env("MIX_TEST_PARTITION")}",
      pool: Ecto.Adapters.SQL.Sandbox,
      pool_size: System.schedulers_online() * 2,
      ssl: [cacerts: :public_key.cacerts_get()]
   ```

   <Admonition type="tip">
   This guide configures the test environment for completeness but doesn't cover running tests. For production workflows, consider using [Neon branches](/docs/introduction/branching) instead of a separate test database. Branches provide isolated, cost-effective copies of your database that are ideal for testing and CI/CD pipelines.
   </Admonition>

## Install dependencies and create databases

1. Install the dependencies:

   ```bash
   mix deps.get
   ```

2. Create the development and test databases:

   ```bash
   mix ecto.create
   MIX_ENV=test mix ecto.create
   ```

   The first command creates the development database (`neondb`). The second creates the test database (`with_phoenix_test`).

## Build and run the Phoenix application

To compile the app in production mode, run the following command:

```bash
MIX_ENV=prod mix compile
```

To compile assets for the production mode, run the following command:

```bash
MIX_ENV=prod mix assets.deploy
```

For each deployment, a secret key is required for encrypting and signing data. Run the following command to generate the key:

```bash
mix phx.gen.secret
```

When you run the following command, you can expect to see the Phoenix application at [http://localhost:4001](http://localhost:4001):

```bash shouldWrap
PORT=4001 \
MIX_ENV=prod \
PHX_HOST=localhost \
DATABASE_URL="postgresql://...:...@...aws.neon.tech/neondb?sslmode=require&channel_binding=require" \
SECRET_KEY_BASE=".../..." \
mix phx.server
```

</Steps>

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with_phoenix" description="Get started with Phoenix and Neon" icon="github">Get started with Phoenix and Neon</a>

</DetailIconCards>

<NeedHelp/>
