# 💡 AI Prompt: Connect an Elixir Ecto Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Elixir project to connect to a Neon Postgres database using Ecto.

**Purpose:** To install `ecto_sql` and `postgrex` dependencies, configure an Ecto Repo and provide a working Elixir script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle using Ecto transactions.

**Scope:**
- Assumes the user is working within an Elixir project created with `mix new --sup`. The supervision tree is required for Ecto.
- Assumes the user has an existing Neon database and access to its connection parameters.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Elixir project as follows:

### 1. Identify Application Name

1.  Open the `mix.exs` file.
2.  Locate the `project/0` function and identify the value of the `:app` key (e.g., `:my_app`).
3.  Locate the `application/0` function and identify the value of the `:mod` key (e.g., `MyApp.Application`).
4.  Use these values consistently wherever `my_app` or `MyApp` are mentioned in the following instructions.

### 2. Add Ecto Dependencies

1.  Open the `mix.exs` file.
2.  Locate the `deps/0` private function.
3.  Add the following dependencies to the list:
    ```elixir
    {:ecto_sql, "~> 3.11"},
    {:postgrex, "~> 0.18.0"}
    ```
4.  After saving the file, run the following command in the terminal to install the dependencies:
    ```bash
    mix deps.get
    ```

### 3. Generate and Configure the Ecto Repo

1.  Run the following `mix` command in the terminal to generate the Repo boilerplate. **Replace `MyApp` with the application module name identified earlier.**
    ```bash
    mix ecto.gen.repo -r MyApp.Repo
    ```
2.  This command creates `lib/my_app/repo.ex`, `lib/my_app/application.ex` and adds a configuration block to `config/config.exs`.
3.  Open `config/config.exs` and update the generated configuration block that exists with the following content (Instruct the user to replace the placeholder values with their actual database credentials.)
    ```elixir
    import Config

    # Replace MyApp and my_app here
    config :my_app, MyApp.Repo,
      username: "[user]",
      password: "[password]",
      hostname: "[neon_hostname]",
      database: "[dbname]",
      ssl: [cacerts: :public_key.cacerts_get()],
      pool_size: 10

    # Configure Ecto migrations and seeds
    config :my_app, ecto_repos: [MyApp.Repo]
    ```
4.  Prompt the user to get their connection parameters from the **Neon Console → Project → Dashboard → Connect**, using the **Parameters only** view.
5.  Open `lib/my_app/application.ex` and ensure `MyApp.Repo` is added to the list of children in the `start/2` function.
    ```elixir
    # In lib/my_app/application.ex, replace MyApp with the correct module name
    def start(_type, _args) do
      children = [
        MyApp.Repo,
        # ... other children
      ]
      # ...
    end
    ```

### 4. Create the Database Migration and Schema

1.  Generate a new migration file by running this command in the terminal:
    ```bash
    mix ecto.gen.migration create_todos_table
    ```
2.  Open the newly created migration file in `priv/repo/migrations/`.
3.  Populate the `change/0` function to define the `todos` table schema:
    ```elixir
    defmodule MyApp.Repo.Migrations.CreateTodosTable do
      use Ecto.Migration

      def change do
        create table(:todos) do
          add :task, :string, null: false
          add :completed, :boolean, default: false, null: false

          timestamps()
        end
      end
    end
    ```
4.  Create a new file `lib/my_app/todo.ex` for the Ecto schema. This module will map Elixir structs to the `todos` database table.
    ```elixir
    # In lib/my_app/todo.ex, replace MyApp with the correct module name
    defmodule MyApp.Todo do
      use Ecto.Schema
      import Ecto.Changeset

      schema "todos" do
        field :task, :string
        field :completed, :boolean, default: false

        timestamps()
      end

      def changeset(todo, attrs) do
        todo
        |> cast(attrs, [:task, :completed])
        |> validate_required([:task, :completed])
      end
    end
    ```

### 5. Create an Example Script with CRUD Operations

Create a new file named `main.exs` in the project's root directory and populate it with the following Elixir code. This script will demonstrate a full C-R-U-D lifecycle within a database transaction using Ecto. **Ensure all module names (`MyApp`, `MyApp.Repo`, `MyApp.Todo`) are replaced with the correct application-specific names.**

```elixir
defmodule NeonEctoExample do
  # Replace MyApp.Repo and MyApp.Todo with your actual module names
  alias MyApp.Repo
  alias MyApp.Todo

  def run do
    IO.puts("Starting Neon Ecto example...")

    # Repo.transaction ensures all operations inside either succeed together or fail together.
    Repo.transaction(fn ->
      IO.puts("\n--- Transaction Started ---")

      # 1. CREATE
      IO.puts("\n[CREATE] Inserting a new todo...")
      {:ok, todo} =
        %Todo{task: "Learn Neon with Ecto"}
        |> Repo.insert()
      IO.puts("Inserted: #{inspect(todo)}")

      # 2. READ
      IO.puts("\n[READ] Fetching the new todo by ID...")
      fetched_todo = Repo.get!(Todo, todo.id)
      IO.puts("Fetched: #{inspect(fetched_todo)}")

      # 3. UPDATE
      IO.puts("\n[UPDATE] Marking the todo as complete...")
      changeset = Todo.changeset(fetched_todo, %{completed: true, task: "Master Neon with Ecto!"})
      {:ok, updated_todo} = Repo.update(changeset)
      IO.puts("Updated: #{inspect(updated_todo)}")

      # 4. DELETE
      IO.puts("\n[DELETE] Deleting the todo...")
      {:ok, deleted_todo} = Repo.delete(updated_todo)
      IO.puts("Deleted: #{inspect(deleted_todo)}")

      # Verify deletion
      IO.puts("\nVerifying deletion...")
      is_deleted = is_nil(Repo.get(Todo, deleted_todo.id))
      IO.puts("Todo with ID #{deleted_todo.id} exists? #{not is_deleted}")

      IO.puts("\n--- Transaction Committed Successfully ---\n")
    end)
  end
end

# Ensure the Ecto Repo is started before running the script
_ = Application.ensure_all_started(:my_app)

NeonEctoExample.run()
```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Verify the user has correctly set their connection parameters in `config/config.exs`. Do not proceed if placeholder values (e.g., `[user]`) are still present.
2.  Run the migration to create the `todos` table in their Neon database:
    ```bash
    mix ecto.migrate
    ```
3.  Finally, run the example script from their terminal:
    ```bash
    mix run main.exs
    ```
4.  If successful, the output should show messages indicating the success of each CRUD step inside the transaction.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
-   The `mix.exs` file contains both `ecto_sql` and `postgrex` dependencies.
-   The `MyApp.Repo` module exists at `lib/my_app/repo.ex`.
-   The `config/config.exs` file contains a configuration block for `MyApp.Repo` that matches the application's name.
-   **The `ssl: [cacerts: :public_key.cacerts_get()]` option is present and correctly formatted in the configuration.** This is required for a secure connection to Neon.
-   `MyApp.Repo` has been added as a child to the supervision tree in `lib/my_app/application.ex`.
-   A migration file exists in `priv/repo/migrations/` that defines the `todos` table.
-   The `MyApp.Todo` schema module exists at `lib/my_app/todo.ex`.
-   The `main.exs` script uses Ecto functions (`Repo.insert`, `Repo.get`, etc.) and wraps the logic in `Repo.transaction/1`.

---

## ❌ Do Not

-   **Do not add :ecto_sql or :postgrex to the :extra_applications list in mix.exs. These dependencies are started automatically by the runtime as needed.**
-   Do not hardcode credentials in any `.ex` or `.exs` file. Use the `config/config.exs` file for this purpose.
-   Do not output the contents of the `config/config.exs` file or the user's connection parameters in any response.
-   Do not forget the mandatory `ssl` option in the Ecto Repo configuration.
-   Do not perform database operations outside of a transaction in the example script.