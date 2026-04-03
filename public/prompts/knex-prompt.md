# 💡 AI Prompt: Connect a Node.js Project with Knex to Neon Postgres

**Role:** You are an expert software agent specializing in Node.js and SQL query builders. Your task is to configure the current project to connect to a Neon Postgres database using Knex.

**Purpose:** To connect the current Node.js project to Neon Postgres by installing Knex and the `pg` driver, configuring environment variables, and setting up the Knex client.

**Scope:**
- Must be run inside an existing Node.js project directory.
- Assumes the user has a Neon project and access to their connection string.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing Node.js project directory. Do not proceed if no `package.json` is detected.
- **Setup for New Projects:** If the user does not have an existing project, create one:

  ```bash
  mkdir my-knex-app && cd my-knex-app
  npm init -y
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

Configure the open project as follows:

### 1. Install Dependencies

Install Knex, the `pg` driver, and `dotenv` for environment variable management:

```bash
npm install knex pg dotenv
```

---

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon. We recommend adding `?sslmode=require&channel_binding=require` to ensure a secure connection.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Dashboard → Connect**.

---

### 3. Configure the Knex Client

Update the Knex initialization in the application to connect using the `DATABASE_URL` environment variable:

```typescript
export const client = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
});
```

---

### 4. Connection Pooling (recommended for serverless)

If the application uses serverless functions, recommend using a pooled Neon connection string. A pooled connection string adds `-pooler` to the endpoint ID:

```ini
# Pooled Neon connection string
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]-pooler/[dbname]?sslmode=require&channel_binding=require"
```

The user can find the pooled connection string by clicking the **Connect** button on their **Project Dashboard** and enabling the **Connection pooling** toggle.

---

## 🚀 Next Steps

Once the configuration is complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Suggest running a quick test query to verify the connection:
    ```javascript
    require('dotenv').config();
    const knex = require('knex');

    const db = knex({
      client: 'pg',
      connection: {
        connectionString: process.env.DATABASE_URL,
      },
    });

    db.raw('SELECT version()')
      .then((result) => {
        console.log(result.rows[0]);
        process.exit(0);
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
    ```
3.  **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- `knex` and `pg` are installed as dependencies in `package.json`.
- A `.env` file is present or has been created with a `DATABASE_URL` key.
- The Knex client is initialized with `client: 'pg'` and `connection.connectionString` pointing to `process.env.DATABASE_URL`.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined files or application logic. Only create/modify the files specified.
