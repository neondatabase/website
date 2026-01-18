# 💡 AI Prompt: Connect a JavaScript/Node.js Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Node.js project to connect to a Neon Postgres database.

**Purpose:** Install necessary packages and provide a working script demonstrating connection and basic CRUD operations.

**Scope:**
- Assumes user is working within a Node.js project directory
- Assumes user has an existing Neon database and connection string

---

## 🛠️ Instructions (for AI-enabled editors)

Identify the project's package manager (`npm`, `yarn`, `pnpm`, `bun`) and use it for all dependency commands. Examples use `npm` - substitute accordingly.

### 1. Select a Database Driver

Ask user to choose their preferred Node.js Postgres driver. Proceed based on their choice:
1. **`pg` (node-postgres)**: Classic, widely-used driver
2. **`postgres.js`**: Modern, high-performance driver
3. **`@neondatabase/serverless`**: Neon serverless driver for serverless functions

### 2. Install Dependencies

1. If no `package.json`, run `npm init -y`
2. Ensure `package.json` has `"type": "module"` for ES Modules
3. Install based on driver choice:

**pg:**
```bash
npm install pg dotenv
```

**postgres.js:**
```bash
npm install postgres dotenv
```

**@neondatabase/serverless:**
```bash
npm install @neondatabase/serverless dotenv
```

### 3. Configure `.env` File

Create `.env` at project root if missing:

```dotenv
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

Instruct user to replace placeholders with connection string from **Neon Console → Project → Dashboard → Connect**.

### 4. Create Example Script

Modify main file (e.g., `index.js`):
- If empty/boilerplate: replace with code below
- If has user code: comment it out and append new code

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
    await client.query(`DROP TABLE IF EXISTS users;`);
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `);
    console.log("Schema created.");

    // CREATE
    const res = await client.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id;",
      ["John Doe", "john@example.com"]
    );
    const userId = res.rows[0].id;
    console.log(`CREATE: User inserted with ID: ${userId}`);

    // READ
    const { rows } = await client.query("SELECT * FROM users WHERE id = $1;", [userId]);
    console.log(`READ: ${JSON.stringify(rows[0])}`);

    // UPDATE
    await client.query("UPDATE users SET email = $1 WHERE id = $2;", ["john.doe@example.com", userId]);
    console.log("UPDATE: User email updated.");

    // DELETE
    await client.query("DELETE FROM users WHERE id = $1;", [userId]);
    console.log("DELETE: User deleted.");

  } catch (err) {
    console.error("Database operation failed:", err);
  } finally {
    client.release();
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
    await sql`DROP TABLE IF EXISTS users;`;
    await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `;
    console.log("Schema created.");

    // CREATE
    const [user] = await sql`
      INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com') RETURNING id;
    `;
    console.log(`CREATE: User inserted with ID: ${user.id}`);

    // READ
    const [record] = await sql`SELECT * FROM users WHERE id = ${user.id};`;
    console.log(`READ: ${JSON.stringify(record)}`);

    // UPDATE
    await sql`UPDATE users SET email = 'john.doe@example.com' WHERE id = ${user.id};`;
    console.log("UPDATE: User email updated.");

    // DELETE
    await sql`DELETE FROM users WHERE id = ${user.id};`;
    console.log("DELETE: User deleted.");

  } catch (err) {
    console.error("Database operation failed:", err);
  } finally {
    await sql.end();
  }
}

main();
```

#### Option 3: `@neondatabase/serverless`

```javascript title="index.js"
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function main() {
  try {
    console.log("Connection successful!");

    // Setup schema
    await sql`DROP TABLE IF EXISTS users;`;
    await sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `;
    console.log("Schema created.");

    // CREATE
    const [user] = await sql`
      INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com') RETURNING id;
    `;
    console.log(`CREATE: User inserted with ID: ${user.id}`);

    // READ
    const [record] = await sql`SELECT * FROM users WHERE id = ${user.id};`;
    console.log(`READ: ${JSON.stringify(record)}`);

    // UPDATE
    await sql`UPDATE users SET email = 'john.doe@example.com' WHERE id = ${user.id};`;
    console.log("UPDATE: User email updated.");

    // DELETE
    await sql`DELETE FROM users WHERE id = ${user.id};`;
    console.log("DELETE: User deleted.");

  } catch (err) {
    console.error("Database operation failed:", err);
  }
}

main();
```

---

## 🚀 Next Steps

1. Verify user has set `DATABASE_URL` in `.env` (no placeholders)
2. Run `node index.js`
3. Output should show connection success and each CRUD operation

---

## ✅ Validation Rules

Before suggesting code:
- `package.json` contains `"type": "module"`
- `.env` file is present or created
- Connection string loaded from environment, not hardcoded
- SQL operations use parameterized queries (prevent injection)
- Connections/pools properly closed (`pool.end()`, `sql.end()`)

---

## ❌ Do Not

- Hardcode credentials in `.js` files
- Output `.env` contents or connection string
- Expose database logic on client-side (server-side only)
