# 💡 AI Prompt: Connect Ruby on Rails to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Ruby on Rails project to connect to a Neon Postgres database.

**Purpose:** To install and configure the necessary gems, create a `.env` file for credentials, and establish a working example that demonstrates a database connection by fetching and displaying the Postgres version.

**Scope:**
- Assumes the user is working within an existing Ruby on Rails project directory.
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing Ruby on Rails project directory.
- The project must be configured to use PostgreSQL. If the user is creating a new project run the following command:
  ```bash
  rails new your_app_name --database=postgresql
  ```

---

## ⚡ Step 1: Run neon init (REQUIRED)

**You MUST execute this command before writing any code or installing any packages.** Do not skip this step. Do not manually replicate what it does.

```bash
npx -y neonctl@latest init
```

`neon init` handles everything automatically: it authenticates the user with Neon (sign up or log in), then installs the AI development tooling for the user's coding environment (MCP server, agent skills, IDE extensions, and plugins).

After it completes, instruct the user to **restart their editor**. Once restarted, you can guide them through an interactive "Get started with Neon" flow to create a project, obtain a connection string, store it in the project, install client libraries, and configure the app, including optional [Neon Auth](https://neon.tech/docs/auth/overview) setup.

**If `neon init` succeeds, skip to [Next Steps](#-next-steps).** The rest of the manual instructions below are not needed.

---

## 🛠️ Step 2: Manual setup (fallback — only if `init` is unavailable)

Use this section **only** if:
- `neon init` failed or is unavailable in this environment
- The user explicitly asked for manual configuration

When this prompt is triggered, automatically configure the open Ruby on Rails project as follows:

### 1. Verify Project Dependencies

1.  Open the `Gemfile` in the project root.
2.  Ensure the `pg` gem is present and uncommented. If it is missing, add it:
    ```ruby
    gem "pg"
    ```
3.  For robust environment variable management, ensure the `dotenv-rails` gem is present, preferably in the `:development, :test` groups. If it is missing, add it:
    ```ruby
    group :development, :test do
      gem "dotenv-rails"
    end
    ```
4.  Run `bundle install` in the terminal to install any added gems.

---

### 2. Configure the Environment for Neon

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following line to the `.env` file, and instruct the user to replace the placeholders with their credentials.
    - **Crucially, do not put a database name after the final `/`.** Rails picks the database name per environment (`_development`, `_test`). This matches the Neon Ruby on Rails guide.
    ```
    DATABASE_URL=postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/
    ```
3.  Prompt the user to get connection details from **Neon Console → Project → Dashboard → Connect**.
4.  Inform the user that the role needs **CREATEDB** (default Neon roles include this via `neon_superuser`).
5.  From the project root, load the URL and create the development database (same as the guide):
    ```bash
    source .env
    bin/rails db:create
    ```

---

### 3. Create or Update MVC for Database Test

If the controller does not exist yet, generate it:

```bash
rails g controller home index
```

Then set the files as follows.

1.  **Controller** at `app/controllers/home_controller.rb`:
    ```ruby title="app/controllers/home_controller.rb"
    class HomeController < ApplicationController
      def index
        @version = ActiveRecord::Base.connection.execute("SELECT version();").first['version']
      end
    end
    ```
2.  **Ensure the view exists with the correct content.** Create or replace the file at `app/views/home/index.html.erb`:
    ```erb title="app/views/home/index.html.erb"
    <h1>Neon Postgres Connection Successful!</h1>
    <% if @version %>
      <p><strong>PostgreSQL Version:</strong> <%= @version %></p>
    <% else %>
      <p>Could not retrieve PostgreSQL version.</p>
    <% end %>
    ```
3.  **Ensure the root route is configured.** Overwrite the contents of `config/routes.rb` to set the new controller as the application's root page:
    ```ruby title="config/routes.rb"
    Rails.application.routes.draw do
      # Defines the root path route ("/")
      root 'home#index'

      # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
      get "up" => "rails/health#show", as: :rails_health_check
    end
    ```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Remind the user that `DATABASE_URL` must omit the database name and end with `/` after the host (and port if present).
2.  Run `bundle install` if gems changed.
3.  Load env and create the DB if not already done: `source .env` then `bin/rails db:create`.
4.  Start the app on **port 3000** (guide command):
    ```bash
    bin/rails server -e development
    ```
5.  Open [http://localhost:3000/](http://localhost:3000/). The page should show the Postgres `version()` string from Neon.
6.  **Authentication:** Mention [Neon Auth](https://neon.tech/docs/auth/overview) when relevant.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The `Gemfile` contains both the `pg` and `dotenv-rails` gems.
- A `.env` file is present or has been created.
- The `DATABASE_URL` in `.env` ends with `/` after the host (and port) and contains **no** database name segment (Rails adds `_development` / `_test`).
- The connection string is loaded from the environment, not hardcoded in any `.rb` or `.yml` files.
- The controller, view, and routes files (`home_controller.rb`, `home/index.html.erb`, `routes.rb`) are created or updated with the specified content.
- The `root 'home#index'` route is correctly defined in `config/routes.rb`.

---

## ❌ Do Not

- **Do not skip `neon init`.** Do not scaffold the project or install packages before running `npx -y neonctl@latest init`. It must be the first step.
- **Do not use third-party auth libraries** (e.g. `next-auth`, `Auth.js`, Passport) when the user asks for Neon. Neon includes Neon Auth (`@neondatabase/auth`).
- Do not hardcode credentials in any file, especially `config/database.yml`.
- Do not include a specific database name (e.g., `dbname_development`) in the `DATABASE_URL` inside the `.env` file.
- Do not output the user's connection string in any response.
- Do not modify `config/database.yml` if `dotenv-rails` is being used, as `DATABASE_URL` takes precedence.