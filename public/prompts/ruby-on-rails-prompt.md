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

## 🛠️ Instructions (for AI-enabled editors)

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
    - **Crucially, the connection string must end with a `/` and should not include a specific database name.** Rails will manage the database name (`_development`, `_test`) automatically based on the environment. Inform this clearly to the user when you prompt them.
    ```
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/"
    ```
3.  Prompt the user to get their connection string from the **Neon Console → Project → Dashboard → Connect**.
4.  Inform the user that the database role provided requires `CREATEDB` privileges, which is standard for roles created via the Neon Console.

---

### 3. Create or Update MVC for Database Test

To avoid potential naming collisions with generators, directly create or overwrite the necessary files.

1.  **Ensure the controller exists with the correct content.** Create or replace the file at `app/controllers/home_controller.rb`:
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

1.  Remind the user to set their `DATABASE_URL` in the .env file, ensuring the connection string is modified to remove the database name and ends with a trailing slash (`/`).
2.  Install any new gems by running:
    ```bash
    bundle install
    ```
3.  Create the development database:
    ```bash
    bin/rails db:create
    ```
4.  Start the Rails server:
    ```bash
    bin/rails server
    ```
5.  To test the connection, visit `http://localhost:3000` in a browser. The page should display the PostgreSQL version reported by your Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The `Gemfile` contains both the `pg` and `dotenv-rails` gems.
- A `.env` file is present or has been created.
- The `DATABASE_URL` format in the `.env` template ends with a `/` and contains no database name.
- The connection string is loaded from the environment, not hardcoded in any `.rb` or `.yml` files.
- The controller, view, and routes files (`home_controller.rb`, `home/index.html.erb`, `routes.rb`) are created or updated with the specified content.
- The `root 'home#index'` route is correctly defined in `config/routes.rb`.

---

## ❌ Do Not

- Do not hardcode credentials in any file, especially `config/database.yml`.
- Do not include a specific database name (e.g., `dbname_development`) in the `DATABASE_URL` inside the `.env` file.
- Do not output the user's connection string in any response.
- Do not modify `config/database.yml` if `dotenv-rails` is being used, as `DATABASE_URL` takes precedence.