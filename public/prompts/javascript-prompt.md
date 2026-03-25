# 💡 AI Prompt: Connect a JavaScript/Node.js Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Node.js project to connect to a Neon Postgres database.

**Purpose:** To install the chosen client library, configure `.env`, and add `create_table.js`, `read_data.js`, `update_data.js`, and `delete_data.js` that exercise a `books` table—matching the Neon JavaScript guide’s **Connect manually** tab (including `pg`, `@neondatabase/serverless`, and `postgres.js` patterns).

**Scope:**
- Assumes a Node.js project directory.
- Assumes server-side execution only (never expose `DATABASE_URL` in browser code).

✅ Read and understand the entire instruction set before executing.

---

## ⚡ Step 1: Try neon init (recommended)

If you can execute terminal commands, start by running `neon init`. This is the fastest path to a fully configured project.

```bash
npx neonctl@latest init
```

`neon init` handles everything automatically: it authenticates the user with Neon (sign up or log in), then installs the AI development tooling for the user's coding environment (MCP server, agent skills, IDE extensions, and plugins).

After it completes, instruct the user to **restart their editor**. Once restarted, you can guide them through an interactive "Get started with Neon" flow to create a project, obtain a connection string, store it in the project, install client libraries, and configure the app, including optional [Neon Auth](https://neon.tech/docs/auth/overview) setup.

**If `neon init` succeeds, skip to [Next Steps](#-next-steps).** The rest of the manual instructions below are not needed.

---

## 🛠️ Step 2: Manual setup (fallback)

Use this section only if:

- Your environment does not support running terminal commands
- `neon init` is unavailable or failed
- The user explicitly prefers manual configuration

Identify the package manager (`npm`, `yarn`, `pnpm`, `bun`) and use it consistently. Examples below use `npm`.

### 1. Choose a driver

Ask the user which client to use:

1. **`pg` (node-postgres)**
2. **`@neondatabase/serverless`**
3. **`postgres` (postgres.js)**

### 2. Project setup and installs

1. `npm init -y` if `package.json` is missing.
2. Add `"type": "module"` to `package.json`.
3. Install:

- **pg:** `npm install pg dotenv`
- **Neon serverless:** `npm install @neondatabase/serverless dotenv`
- **postgres.js:** `npm install postgres dotenv`

### 3. `.env`

Create `.env` with:

```dotenv
DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
```

Use **Neon Console → Connect** (Node.js snippet is fine). Replace placeholders with real values.

### 4. Scripts (`books` table)

Create four files in the project root. Keep the same SQL, logging, and flow as the Neon JavaScript guide (**Connect manually** → Examples).

| File | Purpose |
|------|---------|
| `create_table.js` | `DROP`/`CREATE books`, insert sample rows |
| `read_data.js` | `SELECT * FROM books ORDER BY publication_year` |
| `update_data.js` | `UPDATE` Dune’s `in_stock` to `true` |
| `delete_data.js` | `DELETE` the `1984` row |

#### `pg` (node-postgres) — full reference

`create_table.js`

```javascript
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function setup() {
  const client = await pool.connect();
  try {
    console.log('Connection established');

    await client.query('DROP TABLE IF EXISTS books;');
    console.log('Finished dropping table (if it existed).');

    await client.query(`
      CREATE TABLE books (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          author VARCHAR(255),
          publication_year INT,
          in_stock BOOLEAN DEFAULT TRUE
      );
    `);
    console.log('Finished creating table.');

    await client.query(
      'INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4);',
      ['The Catcher in the Rye', 'J.D. Salinger', 1951, true]
    );
    console.log('Inserted a single book.');

    const booksToInsert = [
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, in_stock: true },
      { title: '1984', author: 'George Orwell', year: 1949, in_stock: true },
      { title: 'Dune', author: 'Frank Herbert', year: 1965, in_stock: false },
    ];

    for (const book of booksToInsert) {
      await client.query(
        'INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4);',
        [book.title, book.author, book.year, book.in_stock]
      );
    }
    console.log('Inserted 3 rows of data.');
  } catch (err) {
    console.error('Connection failed.', err.stack);
  } finally {
    client.release();
    pool.end();
  }
}

setup();
```

`read_data.js`

```javascript
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function readData() {
  const client = await pool.connect();
  try {
    console.log('Connection established');

    const { rows } = await client.query('SELECT * FROM books ORDER BY publication_year;');

    console.log('\n--- Book Library ---');
    rows.forEach((row) => {
      console.log(
        `ID: ${row.id}, Title: ${row.title}, Author: ${row.author}, Year: ${row.publication_year}, In Stock: ${row.in_stock}`
      );
    });
    console.log('--------------------\n');
  } catch (err) {
    console.error('Connection failed.', err.stack);
  } finally {
    client.release();
    pool.end();
  }
}

readData();
```

`update_data.js`

```javascript
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function updateData() {
  const client = await pool.connect();
  try {
    console.log('Connection established');

    await client.query('UPDATE books SET in_stock = $1 WHERE title = $2;', [true, 'Dune']);
    console.log("Updated stock status for 'Dune'.");
  } catch (err) {
    console.error('Connection failed.', err.stack);
  } finally {
    client.release();
    pool.end();
  }
}

updateData();
```

`delete_data.js`

```javascript
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function deleteData() {
  const client = await pool.connect();
  try {
    console.log('Connection established');

    await client.query('DELETE FROM books WHERE title = $1;', ['1984']);
    console.log("Deleted the book '1984' from the table.");
  } catch (err) {
    console.error('Connection failed.', err.stack);
  } finally {
    client.release();
    pool.end();
  }
}

deleteData();
```

#### `@neondatabase/serverless` and `postgres.js`

Mirror the **Neon JavaScript guide** CodeTabs for those drivers: same four filenames and SQL, swapping in `neon(process.env.DATABASE_URL)` with tagged templates (including the multi-row insert for serverless) or `postgres(..., { ssl: 'require' })` with `sql.end()` in `finally` as shown there.

---

## 🚀 Next Steps

1. Verify `DATABASE_URL` in `.env`.
2. Run scripts in order:

```bash
node create_table.js
node read_data.js
node update_data.js
node read_data.js
node delete_data.js
node read_data.js
```

3. **Authentication:** Mention [Neon Auth](https://neon.tech/docs/auth/overview) when relevant.

---

## ✅ Validation Rules for AI

- `package.json` includes `"type": "module"` and the correct dependency for the chosen driver.
- `.env` uses the canonical Neon URL shape (`sslmode=require`, `channel_binding=require`, explicit host/port as provided by Neon).
- Four scripts exist with the guide’s SQL, logging, and driver-specific connection patterns.
- Parameterized queries: `$n` for `pg`; tagged templates for Neon serverless and `postgres.js`.
- No database credentials in client-side bundles.

---

## ❌ Do Not

- Do not hardcode credentials in `.js` files.
- Do not expose `DATABASE_URL` or `.env` contents in assistant output.
- Do not merge the guide’s four scripts into a single demo file for this flow.
