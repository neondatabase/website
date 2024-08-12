---
title: Connect from Phoenix to Neon
subtitle: Set up a Neon project in seconds and connect from Phoenix
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.660Z'
---

This guide describes how to connect Neon in a [Phoenix](https://www.phoenixframework.org) application. [Ecto](https://hexdocs.pm/ecto/3.11.2/Ecto.html) provides an API and abstractions for interacting databases, enabling Elixir developers to query any database using similar constructs.

It is assumed that you have a working installation of [Elixir](https://elixir-lang.org/install.html).

To connect to Neon from Phoenix with Ecto:

- [Create a Neon project](#create-a-neon-project)
- [Store your Neon credentials](#store-your-neon-credentials)
- [Create a Phoenix project](#create-a-phoenix-project)
- [Build and Run the Phoenix application](#build-and-run-the-phoenix-application)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

You will need the connection string details later in the setup.

## Create a Phoenix project

1. [Create a Phoenix project](https://hexdocs.pm/phoenix/installation.html#phoenix) if you do not have one, with the following command:

   ```bash
   mix phx.new hello
   ```

   When prompted to, choose to not install the dependencies.

2. Update `config/dev.exs` file's configuration with your Neon database connection details. Use the connection details from the Neon connection string you copied previously.

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

3. Update`config/runtime.exs` file's configuration with your Neon database connection details. Use the connection details from the Neon connection string you copied previously.

   ```elixir {2}
   config :hello, Hello.Repo,
      ssl: [cacerts: :public_key.cacerts_get()],
      url: database_url,
      pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
      socket_options: maybe_ipv6
   ```

4. Update`config/test.exs` file's configuration with your Neon database connection details. Use the connection details from the Neon connection string you copied in the first part of the guide.

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

5. Now, install the dependencies used in your Phoenix application using the following command:

   ```bash
   mix deps.get
   ```

6. Seed the Neon database with the following command:

   ```bash
   mix ecto.create
   ```

Once that's done, move on to building and running the application in production mode.

## Build and Run the Phoenix application

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

When you run the following command, you can expect to see the Phoenix application on [localhost:4001](localhost:4001):

```bash shouldWrap
PORT=4001 \
MIX_ENV=prod \
DATABASE_URL="postgresql://...:...@...aws.neon.tech/neondb?sslmode=require" \
SECRET_KEY_BASE=".../..." \
mix phx.server
```

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with_phoenix" description="Get started with Phoenix and Neon" icon="github">Get started with Phoenix and Neon</a>

</DetailIconCards>

<NeedHelp/>
