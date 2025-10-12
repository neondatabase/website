# 💡 AI Prompt: Connect Laravel to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Laravel project to connect to a Neon Postgres database.

**Purpose:** To connect the current Laravel project to Neon Postgres and creating a working example to validate the connection.

**Scope:**
- Assumes the user has a Neon project and access to their connection parameters.
- Assumes `composer` is installed and has been used to set up the project.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing Laravel project directory.
- If the user is creating a new project run the following command:
  ```bash
  composer create-project laravel/laravel project_name
  ```
- **PHP PostgreSQL Extension**: Before you begin, ensure your PHP environment has the PostgreSQL driver installed and enabled. This is typically the `pdo_pgsql` extension. If it is missing, `php artisan migrate` and `php artisan serve` will fail with a could not find driver error.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Laravel project as follows:

### 1. Configure Environment Variables

1.  Locate the `.env` file at the root of the project. If it does not exist, create one.
2.  Update the file with the following database connection variables. **Prompt the user to replace the placeholder values** with their actual credentials from Neon.

    ```dotenv title=".env"
    DB_CONNECTION=pgsql
    DB_HOST="aws-0-us-west-1.pooler.neon.tech"
    DB_PORT=5432
    DB_DATABASE="neondb"
    DB_USERNAME="your_neon_user"
    DB_PASSWORD="your_neon_password"
    ```

3.  Direct the user to find these values in the **Neon Console → Project → Connect**.

---

### 2. Create an Example to Test the Connection

To provide a clear way to verify the setup, create a simple route and view that displays the PostgreSQL version from the connected Neon database.

1.  **Create a view:**
    - Create a new file named `neon.blade.php` inside the `resources/views` directory.
    - Add the following content to the file:

    ```php title="resources/views/neon.blade.php"
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Laravel + Neon</title>
      </head>
      <body>
        <h1>Neon Connection Successful!</h1>
        <p><strong>PostgreSQL Version:</strong> {{ $db_version }}</p>
      </body>
    </html>
    ```

2.  **Create a route:**
    - Open the `routes/web.php` file.
    - Add the following route to fetch the database version and render the view. Ensure the `DB` facade is imported.

    ```php title="routes/web.php"
    <?php

    use Illuminate\Support\Facades\Route;
    use Illuminate\Support\Facades\DB; // <-- Add this import

    /*
    |--------------------------------------------------------------------------
    | Web Routes
    |--------------------------------------------------------------------------
    */

    Route::get('/', function () {
        try {
            // Execute a raw query to get the database version
            $result = DB::select('select version()');
            $db_version = $result[0]->version;
        } catch (\Exception $e) {
            // If the connection fails, display an error message
            $db_version = 'Error: Could not connect to the database. ' . $e->getMessage();
        }

        // Pass the version to the view
        return view('neon', ['db_version' => $db_version]);
    });
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Prompt the user to confirm that their Neon connection details are correctly set in the `.env` file.
2.  Clear any cached configuration to ensure the new database settings are loaded:
    ```bash
    php artisan config:clear
    ```
3.  Run the initial database migrations to test write access to the database:
    ```bash
    php artisan migrate
    ```
4.  Start the Laravel development server:
    ```bash
    php artisan serve
    ```
5.  Finally, inform the user that the setup is complete. To test the connection, they can visit `http://127.0.0.1:8000` in their browser, where they should see the PostgreSQL version from their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A `.env` file is present or has been created.
- The `.env` file contains the `DB_CONNECTION=pgsql` variable and the host, database, user, and password variables.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in `config/database.php` or any other source code file. Always use the `env()` helper.
- **Do not output the contents of the `.env` file** or the user's connection string in any response.
- Do not modify existing user routes, but replace the default welcome route with the test route if it exists.