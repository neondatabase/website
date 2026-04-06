# 💡 AI Prompt: Connect Symfony to Neon Postgres with Doctrine

**Role:** You are an expert software agent responsible for configuring the current Symfony project to connect to a Neon Postgres database using Doctrine ORM.

**Purpose:** To configure the Symfony project to connect to Neon Postgres via Doctrine using `DATABASE_URL`, matching the Neon Symfony guide’s **Connect manually** steps.

**Scope:**
- Assumes the user is working within an existing Symfony project directory.
- Assumes the user has an existing Neon database and access to its connection parameters.
- Assumes the user has Composer and the Symfony CLI installed.

✅ Read and understand the entire instruction set before executing.

---

**MANDATORY EXECUTION PROTOCOL**

**The following rules apply to all commands you are about to run following this guide and are non-negotiable:**

- **Execute Verbatim:** You must execute all commands exactly as they are provided. Do not add, remove, or alter any part of a command.
- **Handle Interactive Prompts:** For interactive commands, provide only the inputs specified in these instructions.
- **On Any Failure, HALT:** If any command fails, gets stuck, or produces an unexpected prompt, you must **immediately halt all operations**.
- **Under no circumstances should you retry, improvise, or attempt any alternative solutions.** Your only permitted action in a failure state is to halt and request assistance, instructing the user to manually enter the required commands or inputs into their terminal to proceed.

---

## 📋 Prerequisites

- **Symfony CLI**: The user must have the [Symfony CLI](https://symfony.com/download) installed.
- **Existing Project**: This prompt should be run inside a Symfony project directory. If the user needs to create a new project, run the following command, which creates a new Symfony project:

    ```bash
    symfony new project_name --version="7.3.x"
    ```
- **Required PHP Extensions**: Before proceeding, ensure the user's PHP environment has the necessary PostgreSQL drivers enabled. These are the **`pdo_pgsql`** and **`pgsql`** extensions. Without them, the application will fail with a "driver not found" error. To verify, run `php -m | grep pgsql`. If the extensions are missing, inform the user they must install them for their specific platform (e.g., `sudo apt install php-pgsql` for Debian/Ubuntu) before continuing.
- **Required Composer Packages**: Ensure Doctrine is installed for database access, for example:
    ```bash
    composer require doctrine/dbal doctrine/orm symfony/orm-pack
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

When this prompt is triggered, automatically configure the open Symfony project as follows:

### 1. Configure `DATABASE_URL` for Neon

1. Locate the `.env` file at the root of the project.
2. Set `DATABASE_URL` to the Neon connection string. Use the same shape as the Symfony guide (Doctrine expects `charset=utf8` here):

    ```dotenv title=".env"
    DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?charset=utf8&sslmode=require&channel_binding=require"
    ```

3. Direct the user to **Neon Console → Project → Dashboard → Connect** for the full string or parameters.

4. Ensure Doctrine packages are installed (`doctrine/dbal`, `doctrine/orm`, `symfony/orm-pack`) per the project’s needs.

---

## 🚀 Next Steps

Once the setup is complete:

1.  Verify that the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Run the migration to create the `todos` table in their Neon database.
    ```bash
    php bin/console doctrine:migrations:migrate
    ```
    *(The user should confirm the migration by typing `yes`)*.
3.  Finally, run the example command to test the full lifecycle:
    ```bash
    php bin/console app:test-neon-connection
    ```
4.  If successful, the output should show success messages for each C-R-U-D step, indicating a successful connection and operation.
5.  **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A `.env` file is present and contains `DATABASE_URL` starting with `postgresql://`.
- The URL includes `sslmode=require`, `channel_binding=require`, and `charset=utf8` as in the Symfony guide.
- Doctrine is available (`symfony/orm-pack` / `doctrine/orm` as appropriate for the project).
- **MANDATORY EXECUTION PROTOCOL IS ALWAYS FOLLOWED.** NEVER TRY DIFFERENT APPROACHES IF A COMMAND FAILS. HALT IMMEDIATELY AND ASK THE USER TO MANUALLY EXECUTE THE COMMANDS.

---

## ❌ Do Not

- **Do not skip `neon init`.** Do not scaffold the project or install packages before running `npx -y neonctl@latest init`. It must be the first step.
- **Do not use third-party auth libraries** (e.g. `next-auth`, `Auth.js`, Passport) when the user asks for Neon. Neon includes Neon Auth (`@neondatabase/auth`).
- **Do not hardcode credentials** in any `.php` or `.yaml` file. Always use `env()` for sensitive data.
- **Do not output the contents of the `.env` file** or the user's connection string in any response.
- **Do not try different commands or approaches** if any command fails. Always halt and request user intervention.