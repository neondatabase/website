# 💡 AI Prompt: Integrate a TypeScript/Node.js Project with Neon and Drizzle ORM

**Role:** You are an expert software agent responsible for configuring the current TypeScript/Node.js project to connect to a Neon Postgres database using Drizzle ORM.

**Purpose:** To install the necessary packages, configure Drizzle Kit for migrations, define a database schema, and provide a working script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle.

**Scope:**
- Assumes the user is working within a Node.js project directory.
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open TypeScript/Node.js project as follows:

Detect the package manager used in this project (`npm`, `yarn`, `pnpm`, `bun`, etc.). Use it for all subsequent package management and script execution commands. The following instructions assume `npm`, but adapt commands as necessary for the detected package manager.

### 1. Initialize Project

1.  Check if a `package.json` file exists. If not, create one by running:
    ```bash
    npm init -y
    ```
2.  Ensure the `package.json` file is configured for ES Modules by adding `"type": "module"`.

### 2. Select a Driver Adapter

First, ask the user to choose their preferred driver and Drizzle adapter. Explain the use cases to help them decide:

1.  **Neon Serverless (HTTP):** Recommended for short-lived, stateless environments like Vercel Edge Functions or AWS Lambda. Each query is a separate `fetch` request, offering very low latency for individual operations.
2.  **Neon WebSocket:** Ideal for long-running applications like a standard Node.js server. It maintains a persistent WebSocket connection, which is more efficient for applications with frequent queries.
3.  **`node-postgres` (`pg`):** The classic, most widely-used driver for Node.js. A stable and mature choice that connects to Neon like any other Postgres database.

---

### 3. Install Dependencies (Based on Selection)

Based on the user's choice, run the appropriate installation command:

*   **If 'Neon Serverless (HTTP)' is chosen:**
    ```bash
    npm install drizzle-orm @neondatabase/serverless dotenv
    npm install -D drizzle-kit typescript tsx
    ```
*   **If 'Neon WebSocket' is chosen:**
    ```bash
    npm install drizzle-orm @neondatabase/serverless dotenv ws
    npm install -D drizzle-kit typescript tsx @types/ws
    ```
*   **If '`node-postgres`' is chosen:**
    ```bash
    npm install drizzle-orm pg dotenv
    npm install -D drizzle-kit typescript tsx @types/pg
    ```

### 4. Configure Environment

1.  Check for a `.env` file at the root of the project. If it does not exist, create it.
2.  Advise the user to add their Neon database connection string to the `.env` file. Provide the following format and instruct the user to replace the placeholders.
    ```env
    # Get your connection string from the Neon Console:
    # Project -> Dashboard -> Connect
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
    ```

### 5. Create Drizzle Configuration

Create a `drizzle.config.ts` file in the project root. This file is the same for all driver choices.

```typescript title="drizzle.config.ts"
import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  }
});
```

### 6. Define Database Schema

Create a `src/schema.ts` file to define the database tables. This schema is the same for all driver choices.

```typescript title="src/schema.ts"
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'demo_users' table
export const demoUsers = pgTable('demo_users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Export types for type-safe queries
export type User = typeof demoUsers.$inferSelect;
export type NewUser = typeof demoUsers.$inferInsert;
```

### 7. Create the Database Client (`src/db.ts`)

Create a `src/db.ts` file with the content corresponding to the user's chosen driver.

#### Option 1: Neon Serverless (HTTP) Driver
```typescript title="src/db.ts"
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
```

#### Option 2: Neon WebSocket Driver
```typescript title="src/db.ts"
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Required for Node.js environments older than v22
neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
```

#### Option 3: `node-postgres` Driver
```typescript title="src/db.ts"
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
```

### 8. Create CRUD Example Script

Create a `src/index.ts` file. This script will work with any of the driver configurations.

```typescript title="src/index.ts"
import { eq } from 'drizzle-orm';
// The 'pool' export will only exist for WebSocket and node-postgres drivers
import { db, pool } from './db';
import { demoUsers } from './schema';

async function main() {
  try {
    console.log('Performing CRUD operations...');

    // CREATE: Insert a new user
    const [newUser] = await db
      .insert(demoUsers)
      .values({ name: 'Admin User', email: 'admin@example.com' })
      .returning();

    if (!newUser) {
      throw new Error('Failed to create user');
    }
    
    console.log('✅ CREATE: New user created:', newUser);

    // READ: Select the user
    const foundUser = await db.select().from(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('✅ READ: Found user:', foundUser[0]);

    // UPDATE: Change the user's name
    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name: 'Super Admin' })
      .where(eq(demoUsers.id, newUser.id))
      .returning();
    
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }
    
    console.log('✅ UPDATE: User updated:', updatedUser);

    // DELETE: Remove the user
    await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('✅ DELETE: User deleted.');

    console.log('\nCRUD operations completed successfully.');
  } catch (error) {
    console.error('❌ Error performing CRUD operations:', error);
    process.exit(1);
  } finally {
    // If the pool exists, end it to close the connection
    if (pool) {
      await pool.end();
      console.log('Database pool closed.');
    }
  }
}

main();
```

### 9. Add Migration Scripts to `package.json`

Modify the `scripts` section of `package.json` to add commands for migrations.

```json title="package.json"
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Verify the user has correctly set their connection string in `.env`. Do not proceed if placeholder value are still present.
2.  Generate the initial migration file:
    ```bash
    npm run db:generate
    ```
3.  Next, apply the migration to their Neon database:
    ```bash
    npm run db:migrate
    ```
4.  Finally, run the example CRUD script:
    ```bash
    npx tsx src/index.ts
    ```
5.  If successful, the output should show log messages for each C-R-U-D step.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The user's choice of driver adapter is respected throughout the setup.
- The project's detected package manager is used for all commands.
- The `drizzle.config.ts` file is correctly configured.
- The `src/db.ts` file uses the correct Drizzle adapter (`neon-http`, `neon-serverless`, or `node-postgres`) and underlying driver (`@neondatabase/serverless` or `pg`) based on the selection.
- **If the Neon WebSocket driver is chosen,** ensure `ws` is a dependency and `neonConfig.webSocketConstructor = ws;` is present.
- **If a connection pool is created (`node-postgres` or WebSocket),** ensure it is exported from `src/db.ts` and the `finally` block in `src/index.ts` correctly closes it.

---

## ❌ Do Not

- Do not hardcode credentials in any `.ts` or `.json` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.