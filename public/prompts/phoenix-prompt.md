# 💡 AI Prompt: Connect a Phoenix Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Elixir Phoenix project to connect to a Neon Postgres database.

**Purpose:** To correctly configure the Ecto Repo for a secure Neon connection and add a new API endpoint that demonstrates a successful database query.

**Scope:**
- Assumes the user has a Neon project and has access to their connection parameters.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt should be run from the root of an existing Phoenix project, which can be identified by the presence of a `mix.exs` file.
- **Setup for New Projects:** If the user does not have a Phoenix project, create one using the following commands:

  1.  First, ensure the Phoenix project generator is installed:
      ```bash
      mix archive.install hex phx_new
      ```
  2.  Next, create the new Phoenix application:
      ```bash
      mix phx.new my_phoenix_app
      ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered inside a valid Phoenix project, automatically configure it as follows:

### 1. Identify Application Name and Modules

1.  Open the `mix.exs` file.
2.  Locate the `project/0` function and identify the value of the `:app` key (e.g., `:my_app`).
3.  Based on the app name, determine the primary application module (e.g., `MyApp`) and the web module (e.g., `MyAppWeb`). These will be used to configure the Repo and the Router.

### 2. Configure the Development Database Connection

1.  Open the `config/dev.exs` file.
2.  Locate the configuration block for the Ecto Repo (it will look like `config :my_app, MyApp.Repo, ...`).
3.  Replace the default configuration with the following structure. Instruct the user to substitute the placeholder values with their actual Neon database credentials. **Crucially, ensure the `ssl` option is included.**

    ```elixir
    # In config/dev.exs
    # Replace :my_app and MyApp with your actual application names
    config :my_app, MyApp.Repo,
      # ==> Replace these with your Neon credentials
      username: "[user]",
      password: "[password]",
      hostname: "[neon_hostname]",
      database: "[dbname]",
      # <== End of user-specific credentials
      stacktrace: true,
      show_sensitive_data_on_connection_error: true,
      pool_size: 10,
      # This SSL option is REQUIRED to connect to Neon
      ssl: [cacerts: :public_key.cacerts_get()]
    ```
4.  Prompt the user to get their connection parameters from the **Neon Console → Project → Dashboard → Connect**, using the **Parameters only** view.

### 3. Create a Database Version Check API Endpoint

This will provide a simple, stateless way to verify that the database connection is working correctly.

1.  **Add a new route:** Open `lib/my_app_web/router.ex` (replace `my_app_web` with the correct web module name). Inside the `scope "/api", MyAppWeb do` block, add the following route:
    ```elixir
    # In lib/my_app_web/router.ex
    get "/db_version", DBCheckController, :version
    ```

2.  **Create a new controller:** Create a new file named `lib/my_app_web/controllers/db_check_controller.ex`. Populate it with the following code. **Remember to replace `MyAppWeb` and `MyApp.Repo` with the correct module names.**

    ```elixir
    # In lib/my_app_web/controllers/db_check_controller.ex
    defmodule MyAppWeb.DBCheckController do
      use MyAppWeb, :controller

      # Replace MyApp.Repo with your actual Repo module
      alias MyApp.Repo

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

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their connection string in `config/dev.exs`. Do not proceed if placeholder value are still present.
2.  Fetch the project's dependencies:
    ```bash
    mix deps.get
    ```
3.  Create the database in Neon using the Ecto mix task. This will also create the `schema_migrations` table.
    ```bash
    mix ecto.create
    ```
4.  Start the Phoenix server:
    ```bash
    mix phx.server
    ```
5.  To verify the connection, instruct the user to open a new terminal and run the following `curl` command:
    ```bash
    curl http://localhost:4000/api/db_version
    # Expected output: {"version":"PostgreSQL XX.XX on ..."}
    ```

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
-   A Phoenix project structure is detected (i.e., `mix.exs`, `config/`, `lib/`).
-   The `config/dev.exs` file contains an Ecto Repo configuration block matching the application's name.
-   **The `ssl: [cacerts: :public_key.cacerts_get()]` option is present and correctly formatted in the Repo configuration.** This is a mandatory requirement for connecting to Neon.
-   A new route for `GET /api/db_version` is added to `lib/my_app_web/router.ex`.
-   A new controller file, `lib/my_app_web/controllers/db_check_controller.ex`, has been created.
-   The controller uses `Ecto.Adapters.SQL.query/3` to execute a query against the application's configured `Repo`.

---

## ❌ Do Not

-   Do not hardcode user credentials in any file other than the `config/{env}.exs` files.
-   Do not output the user's connection parameters or the contents of their config files in any response.
-   **Do not forget the mandatory `ssl` option in the Ecto Repo configuration.** Connection will fail without it.
-   Do not modify any files other than `config/dev.exs`, `lib/my_app_web/router.ex`, and the new controller file.