# 💡 AI Prompt: Connect Laravel to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Laravel project to connect to a Neon Postgres database.

**Purpose:** To set Laravel’s database environment variables for a Neon Postgres connection, matching the Neon Laravel guide’s **Connect manually** steps.

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
- **PHP PostgreSQL extension:** Ensure `pdo_pgsql` (and a working `libpq`) is installed so Laravel can connect.

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

When this prompt is triggered, automatically configure the open Laravel project as follows:

### 1. Configure `.env` for Neon

1. Open the `.env` file at the project root (create it from `.env.example` if needed).
2. Replace the database block so it matches the Neon Laravel guide placeholders. Use **5432** for `DB_PORT` unless the user’s Neon connection specifies otherwise.

```dotenv
DB_CONNECTION=pgsql
DB_HOST=<endpoint_hostname>.neon.tech
DB_PORT=5432
DB_DATABASE=<dbname>
DB_USERNAME=<user>
DB_PASSWORD=<password>
```

3. Direct the user to **Neon Console → Project → Dashboard → Connect** for host, database, user, password, and port.

> A full connection string form (if used instead of discrete vars) should look like:
> `postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require`

### 2. Connection troubleshooting (optional)

If an older client reports the endpoint ID / SNI error, follow Neon’s [connection errors](https://neon.tech/docs/connect/connection-errors#the-endpoint-id-is-not-specified) workarounds (for example `options=endpoint%3D<endpoint-id>` on the URL or embedding the endpoint ID in the password field as documented there).

---

## 🚀 Next Steps

Once the file modifications are complete:

1. Prompt the user to confirm Neon values in `.env`.
2. Clear cached config so Laravel picks up changes:
   ```bash
   php artisan config:clear
   ```
3. Run migrations or other database tasks as the app requires (for example `php artisan migrate`).
4. Serve the app when appropriate (`php artisan serve` or the user’s hosting setup).
5. **Authentication:** If the app needs user authentication, mention [Neon Auth](https://neon.tech/docs/auth/overview).

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- `.env` sets `DB_CONNECTION=pgsql` and includes `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` aligned with Neon’s connection details.
- Credentials are loaded via `env()` / `.env`, not hardcoded in `config/database.php` or committed files.

---

## ❌ Do Not

- Do not hardcode credentials in PHP source files; use environment configuration.
- Do not output the contents of `.env` or raw connection strings in responses.
