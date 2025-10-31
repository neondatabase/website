# 💡 AI Prompt: Connect a JavaScript/Node.js Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Node.js project to connect to a Neon Postgres database.

**Purpose:** To install the necessary npm packages and provide a complete, working script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle within a robust, multi-table database transaction.

**Scope:**
- Assumes the user is working within a Node.js project directory.
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Node.js project as follows:

Identify the project's package manager (`npm`, `yarn`, `pnpm`, `bun`) and use it exclusively for all subsequent dependency and script commands. While the examples below use `npm`, substitute the appropriate commands for your project's manager.

### 1. Select a Database Driver

First, ask the user to choose their preferred Node.js Postgres driver and proceed based on their selection:
1.  **`pg` (node-postgres)**: The classic, most widely-used driver.
2.  **`postgres.js`**: A modern, high-performance driver with a great developer experience.
3.  **`@neondatabase/serverless`**: The Neon serverless driver, optimized for serverless functions (HTTP).

---

### 2. Configure Project and Install Dependencies

1.  Check if a `package.json` file exists. If not, create one by running:
    ```bash
    npm init -y
    ```
2.  Ensure the `package.json` file is configured for ES Modules by adding `"type": "module"`.
3.  Based on the user's driver selection, run the appropriate `npm install` command:
    *   **If `pg` is chosen:**
        ```bash
        npm install pg dotenv
        ```
    *   **If `postgres.js` is chosen:**
        ```bash
        npm install postgres dotenv
        ```
    *   **If `@neondatabase/serverless` is chosen:**
        ```bash
        npm install @neondatabase/serverless dotenv
        ```

---

### 3. Verify the `.env` File

- Check for the presence of a `.env` file at the root of the project.
- If it doesn't exist, create one and advise the user to add their Neon database connection string.
- Provide the following format and instruct the user to replace the placeholders:
  
  ```dotenv title=".env"
  DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
  ```

- Prompt the user to get their connection string from the **Neon Console → Project → Dashboard → Connect**.

---

### 4. Create an Example Script with a Two-Table Transaction

Modify the project's main file (e.g., `index.js`). Apply the following logic:

- **If the file is empty or contains only boilerplate**, replace the entire file content with the appropriate JavaScript code block below.
- **If the file contains custom user code, preserve it.** Comment out the existing code and add a note like `// Existing code commented out to add Neon connection example.` Then, append the new code block after the commented section.

#### Option 1: `pg` (node-postgres)
```javascript title="index.js"
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true },
});

async function main() {
  const client = await pool.connect();
  try {
    console.log("Connection successful!");

    // Setup schema
    await client.query(`
      DROP TABLE IF EXISTS books;
      DROP TABLE IF EXISTS authors;
      CREATE TABLE authors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
      CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE
      );
    `);
    console.log("Schema created.");

    // --- Start Transaction ---
    await client.query('BEGIN');
    console.log("\nTransaction started.");

    try {
      // CREATE: Insert an author and their book
      const authorRes = await client.query("INSERT INTO authors (name) VALUES ($1) RETURNING id;", ["George Orwell"]);
      const authorId = authorRes.rows[0].id;
      console.log(`CREATE: Author 'George Orwell' inserted with ID: ${authorId}`);
      
      await client.query("INSERT INTO books (title, author_id) VALUES ($1, $2);", ["1984", authorId]);
      console.log("CREATE: Book '1984' inserted.");

      // READ: Verify the data
      const { rows } = await client.query(
        "SELECT b.title, a.name AS author FROM books b JOIN authors a ON b.author_id = a.id WHERE a.id = $1;",
        [authorId]
      );
      console.log(`READ: Fetched '${rows[0].title}' by ${rows[0].author}`);
      
      // UPDATE: Change the book's title
      await client.query("UPDATE books SET title = $1 WHERE author_id = $2;", ["Nineteen Eighty-Four", authorId]);
      console.log("UPDATE: Book title updated.");

      // DELETE: Remove the author (which cascades to the book)
      await client.query("DELETE FROM authors WHERE id = $1;", [authorId]);
      console.log("DELETE: Author and their books deleted.");

      await client.query('COMMIT');
      console.log("Transaction committed successfully.\n");
    } catch (e) {
      await client.query('ROLLBACK');
      console.error("Transaction rolled back.");
      throw e;
    }

  } catch (err) {
    console.error("Database operation failed:", err);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

main();
```

#### Option 2: `postgres.js`
```javascript title="index.js"
import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function main() {
  try {
    console.log("Connection successful!");
    
    // Setup schema
    await sql`DROP TABLE IF EXISTS books;`;
    await sql`DROP TABLE IF EXISTS authors;`;
    await sql`
      CREATE TABLE authors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `;
    await sql`
      CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE
      );
    `;
    console.log("Schema created.");

    // --- Start Transaction ---
    await sql.begin(async (sql) => {
      console.log("\nTransaction started.");
      
      // CREATE: Insert an author and their book
      const [author] = await sql`INSERT INTO authors (name) VALUES ('George Orwell') RETURNING id;`;
      console.log(`CREATE: Author 'George Orwell' inserted with ID: ${author.id}`);

      await sql`INSERT INTO books (title, author_id) VALUES ('1984', ${author.id});`;
      console.log("CREATE: Book '1984' inserted.");
      
      // READ: Verify the data
      const [book] = await sql`
        SELECT b.title, a.name as author FROM books b JOIN authors a ON b.author_id = a.id WHERE a.id = ${author.id};
      `;
      console.log(`READ: Fetched '${book.title}' by ${book.author}`);

      // UPDATE: Change the book's title
      await sql`UPDATE books SET title = 'Nineteen Eighty-Four' WHERE author_id = ${author.id};`;
      console.log("UPDATE: Book title updated.");
      
      // DELETE: Remove the author (which cascades to the book)
      await sql`DELETE FROM authors WHERE id = ${author.id};`;
      console.log("DELETE: Author and their books deleted.");
    });
    console.log("Transaction committed successfully.\n");

  } catch (err) {
    console.error("Database operation failed:", err);
  } finally {
    await sql.end();
  }
}

main();
```

#### Option 3: `@neondatabase/serverless` (HTTP)
```javascript title="index.js"
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    console.log("Connection successful!");

    // Setup schema
    await sql`DROP TABLE IF EXISTS books;`;
    await sql`DROP TABLE IF EXISTS authors;`;
    await sql`
      CREATE TABLE authors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `;
    await sql`
      CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE
      );
    `;
    console.log("Schema created.");

    // --- Start Transaction ---
    // The `transaction` function executes all queries atomically and non interactively. Send all queries as an array.
    console.log("\nTransaction started.");
    await sql.transaction([
      sql`INSERT INTO authors (name) VALUES ('George Orwell')`,
      sql`INSERT INTO books (title, author_id) SELECT '1984', id FROM authors WHERE name = 'George Orwell'`,
      sql`UPDATE books SET title = 'Nineteen Eighty-Four' WHERE author_id = (SELECT id FROM authors WHERE name = 'George Orwell')`,
      sql`DELETE FROM authors WHERE name = 'George Orwell'`,
    ]);
    console.log("Transaction executed: Author/Book created, updated, and deleted.");
    console.log("Transaction committed successfully.\n");

  } catch (err) {
    console.error("Database operation failed:", err);
  }
}

main();
```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Verify that the user has correctly set their `DATABASE_URL` in the `.env` file. Do not proceed if placeholder values are still present.
2.  Run the application:
    ```bash
    node index.js
    ```
3.  If successful, the output should show messages indicating the success of each step and the final transaction commit.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The `package.json` file contains `"type": "module"`.
- A `.env` file is present or has been created.
- The connection string is loaded from the environment, not hardcoded.
- **All SQL operations use parameterized queries** to prevent SQL injection (`$1` for `pg`, tagged templates for `postgres.js` and `@neondatabase/serverless`).
- **The primary business logic is wrapped in a transaction block** that is idiomatic for the chosen driver (`BEGIN`/`COMMIT` for `pg`, `sql.begin` for `postgres.js`, `sql.transaction` for the serverless driver).
- Connections/pools are properly closed at the end of the script (`pool.end()` for `pg`, `sql.end()` for `postgres.js`).

---

## ❌ Do Not

- Do not hardcode credentials in any `.js` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- Do not expose database logic on the client-side. All code must be for a server-side Node.js environment.