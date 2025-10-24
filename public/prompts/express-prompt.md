# 💡 AI Prompt: Connect ExpressJS to Neon Postgres

**Role:** You are an expert software agent specializing in Node.js and the ExpressJS framework. Your task is to configure the current ExpressJS project to connect to a Neon Postgres database.

**Purpose:** To connect the current ExpressJS project to Neon Postgres by installing a database driver, configuring environment variables, and creating a test route to validate the connection.

**Scope:**
- Must be run inside an existing Node.js project directory with ExpressJS installed.
- Assumes the user has a Neon project and access to their full connection string.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing ExpressJS project directory. Do not proceed if no ExpressJS project is detected. You can identify an ExpressJS project by the presence of `express` in the `dependencies` section of `package.json`.
- **Setup for New Projects:** If the user does not have an existing ExpressJS project, create one by running the following commands in their terminal:

  ```bash
  # mkdir my-express-app && cd my-express-app # Create folder if needed
  npm init -y
  npm install express
  ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open ExpressJS project as follows:

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options, explaining the ideal use case for each:

    *   **`@neondatabase/serverless` (Recommended for Serverless):** Optimized for serverless and edge functions with HTTP connections. Best choice for apps deployed on Vercel, Netlify, or AWS Lambda.
    *   **`postgres` (postgres.js):** A fast, full-featured client, great for both serverless and traditional Node.js server environments.
    *   **`pg` (node-postgres):** The classic, widely-used driver for traditional, long-running Node.js servers.

    Make sure to ask the user to choose one of the above options and do not proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2.  Based on the user's selection, run the corresponding installation command. Also install `dotenv` for managing environment variables.

    ```bash
    # For @neondatabase/serverless
    npm install @neondatabase/serverless

    # For postgres (postgres.js)
    npm install postgres

    # For pg (node-postgres)
    npm install pg

    # Install dotenv for all options
    npm i dotenv
    ```

---

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from Neon.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Dashboard → Connect**.

---

### 3. Create an Example to Test the Connection

To provide a clear way to verify the setup, create a main application file that queries the database and returns the PostgreSQL version.

1.  **Locate or create the main entry point file** (usually `index.js`). If it doesn't exist, create it.
2.  **Populate the file with the code that corresponds to the driver selected in Step 1.** This code will set up a basic Express server with a single root route (`/`) to test the database connection.

    #### Option A: Using `@neondatabase/serverless`

    ```javascript title="index.js"
    require('dotenv').config();
    const express = require('express');
    const { neon } = require('@neondatabase/serverless');

    const app = express();
    const PORT = process.env.PORT || 3000;

    const sql = neon(process.env.DATABASE_URL);

    app.get('/', async (req, res) => {
      try {
        const [result] = await sql`SELECT version()`;
        const version = result?.version || 'No version found';
        res.json({
          message: 'Connection successful!',
          version: version,
        });
      } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: 'Failed to connect to the database.' });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    ```

    #### Option B: Using `postgres` (postgres.js)

    ```javascript title="index.js"
    require('dotenv').config();
    const express = require('express');
    const postgres = require('postgres');

    const app = express();
    const PORT = process.env.PORT || 3000;

    const sql = postgres(process.env.DATABASE_URL);

    app.get('/', async (req, res) => {
      try {
        const [result] = await sql`SELECT version()`;
        const version = result?.version || 'No version found';
        res.json({
          message: 'Connection successful!',
          version: version,
        });
      } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: 'Failed to connect to the database.' });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    ```

    #### Option C: Using `pg` (node-postgres)

    ```javascript title="index.js"
    require('dotenv').config();
    const express = require('express');
    const { Pool } = require('pg');

    const app = express();
    const PORT = process.env.PORT || 3000;

    // Create a connection pool. The pool will manage connections for you.
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    app.get('/', async (req, res) => {
      let client;
      try {
        client = await pool.connect();
        const { rows } = await client.query('SELECT version()');
        const version = rows[0]?.version || 'No version found';
        res.json({
          message: 'Connection successful!',
          version: version,
        });
      } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: 'Failed to connect to the database.' });
      } finally {
        // Make sure to release the client back to the pool
        client?.release();
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Start the Express development server:
    ```bash
    node index.js
    ```
3.  Inform the user that the setup is complete. To test the connection, they can visit `http://localhost:3000` in their browser. They should see a JSON response containing the PostgreSQL version from their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A supported PostgreSQL driver (`@neondatabase/serverless`, `postgres`, or `pg`) is installed as a dependency in `package.json`.
- A `.env` file is present or has been created with a `DATABASE_URL` placeholder.
- An `index.js` file is present and contains a root (`/`) route handler.
- The test route correctly imports and uses the chosen driver's syntax.
- The connection logic is wrapped in a `try...catch` block to handle potential errors gracefully.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any `.js` source code file. Always use `process.env`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined routes or application logic. Only add the root test route if one does not exist.