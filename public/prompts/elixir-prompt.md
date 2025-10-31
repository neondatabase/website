# 💡 AI Prompt: Connect an Elixir Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Elixir project to connect to a Neon Postgres database.

**Purpose:** To install the `postgrex` dependency and provide a working Elixir script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle and transaction management with Neon.

**Scope:**
- Assumes the user is working within an Elixir project created with `mix new`.
- Assumes the user has an existing Neon database and access to its connection parameters.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Elixir project as follows:

### 1. Add `postgrex` Dependency

1.  Open the `mix.exs` file.
2.  Locate the `deps/0` private function.
3.  Add `{:postgrex, "~> 0.18.0"}` to the list of dependencies.
4.  After saving the file, run the following command in the terminal to install the dependency:
    ```bash
    mix deps.get
    ```

### 2. Configure Neon Connection Details

1.  Identify the application name. This is the value of the `:app` key in the `project/0` function of `mix.exs`.
2.  Check for the `config/config.exs` file. If it does not exist, create it.
3.  Add the following configuration block to `config/config.exs`. Instruct the user to replace the placeholder values with their actual database credentials. **Crucially, use the application name identified in the previous step.**
    ```elixir
    import Config

    # Replace :my_app_name with your actual application name from mix.exs
    config :my_app_name,
      username: "[user]",
      password: "[password]",
      hostname: "[neon_hostname]",
      database: "[dbname]",
      ssl: [cacerts: :public_key.cacerts_get()]
    ```
4.  Prompt the user to get their connection parameters from the **Neon Console → Project → Dashboard → Connect**, using the **Parameters only** view.

---

### 3. Create an Example Script with CRUD and Transactions

Create a new file named `main.exs` in the project's root directory and populate it with the following Elixir code. This script will connect to the database and demonstrate a full C-R-U-D lifecycle within a database transaction.

```elixir
defmodule NeonExample do
  @app_name: APP_NAME_FROM_MIX_EXS_FILE

  def run do
    # 1. Fetch connection config and start Postgrex
    config = Application.get_all_env(@app_name)
    {:ok, pid} = Postgrex.start_link(config)
    IO.puts("Connection successful!")

    try do
      # Set up a table for the example
      Postgrex.query!(pid, "DROP TABLE IF EXISTS todos;", [])
      Postgrex.query!(pid, "CREATE TABLE todos (id SERIAL PRIMARY KEY, task TEXT NOT NULL);", [])
      IO.puts("Table 'todos' created.")

      # --- Start Transaction for atomic CRUD Operations ---
      # Postgrex.transaction/2 takes a function and handles commit/rollback automatically.
      {:ok, _} =
        Postgrex.transaction(pid, fn conn ->
          IO.puts("\nTransaction started.")

          # CREATE: Insert a new todo item
          Postgrex.query!(conn, "INSERT INTO todos (task) VALUES ($1);", ["Learn Neon with Elixir"])
          IO.puts("CREATE: Row inserted.")

          # READ: Retrieve the new todo item
          result = Postgrex.query!(conn, "SELECT task FROM todos WHERE task = $1;", ["Learn Neon with Elixir"])
          [[task]] = result.rows
          IO.puts("READ: Fetched task - '#{task}'")

          # UPDATE: Modify the todo item
          Postgrex.query!(conn, "UPDATE todos SET task = $1 WHERE task = $2;", ["Master Neon with Elixir!", "Learn Neon with Elixir"])
          IO.puts("UPDATE: Row updated.")

          # DELETE: Remove the todo item
          Postgrex.query!(conn, "DELETE FROM todos WHERE task = $1;", ["Master Neon with Elixir!"])
          IO.puts("DELETE: Row deleted.")

          IO.puts("Transaction committed successfully.\n")
        end)
    rescue
      e in Postgrex.Error ->
        IO.puts("\nOperation failed. Transaction rolled back.")
        IO.inspect(e)
    end
  end
end

# Run the example
NeonExample.run()
```

---

## 🚀 Next Steps

Once the setup is complete:

1. Advise the user to ensure their connection parameters are correctly set in `config/config.exs`.
2. Instruct them to run the example script from their terminal:
   ```bash
   mix run main.exs
   ```
3. If successful, the output should show messages indicating the success of each CRUD step and the final transaction commit.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:

- The `{:postgrex, ...}` dependency is added to the `deps` function in `mix.exs`.
- The `mix deps.get` command has been run.
- A `config/config.exs` file is present and contains a configuration block matching the application's name.
- **The `ssl: [cacerts: :public_key.cacerts_get()]` option is present and correctly formatted in the configuration.** This is required for a secure connection to Neon.
- All SQL operations use parameterized queries (`$1`, `$2`, etc.) to prevent SQL injection.
- The primary business logic (CRUD operations) is wrapped in a `Postgrex.transaction/2` block.

---

## ❌ Do Not

- Do not hardcode credentials in any `.ex` or `.exs` file.
- Do not output the contents of the `config/config.exs` file or the user's connection parameters in any response.
- Do not forget the mandatory `ssl` option in the Postgrex configuration.
