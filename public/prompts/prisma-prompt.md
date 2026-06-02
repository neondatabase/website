# 💡 AI Prompt: Integrate a TypeScript/Node.js Project with Neon and Prisma ORM

**Role:** You are an expert software agent responsible for configuring the current TypeScript/Node.js project to connect to a Neon Postgres database using Prisma ORM with the Neon serverless driver.

**Purpose:** To install the necessary packages, configure Prisma for both application and CLI workflows, define a sample schema, and provide a working script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle.

**Scope:**
- Assumes the user is working within an existing Node.js project directory.
- Assumes the user has a Neon project and access to its database connection strings.
- Uses Prisma 7+ with the `@prisma/adapter-neon` driver adapter (GA since v6.16.0).

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open TypeScript/Node.js project as follows:

Identify the project's package manager (`npm`, `yarn`, `pnpm`, `bun`) and use it exclusively for all subsequent dependency and script commands. While the examples below use `npm`, substitute the appropriate commands for your project's manager.

### 1. Initialize Project and Install Dependencies

1.  Check if a `package.json` file exists. If not, create one by running:
    ```bash
    npm init -y
    ```
2.  Install dependencies:
    ```bash
    # Production dependencies
    npm install @prisma/client @prisma/adapter-neon dotenv

    # Development dependencies
    npm install -D prisma typescript tsx @types/node
    ```

### 2. Initialize Prisma

```bash
npx prisma init
```

This creates a `prisma/schema.prisma` file and a `.env` file.

### 3. Configure Environment Variables

Update the `.env` file with both connection strings from the Neon Console:

```env title=".env"
# Pooled connection for your application (note the -pooler suffix in hostname)
# Get this from Neon Console -> Connect -> Connection string (pooled)
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require"

# Direct connection for Prisma CLI (migrations, db push, introspection)
# Get this from Neon Console -> Connect -> Connection string (direct)
DIRECT_URL="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require"
```

**Important:** The pooled URL has `-pooler` in the hostname. The direct URL does not.

### 4. Configure prisma.config.ts

Create a `prisma.config.ts` file in the project root. This is required for Prisma 7+ to configure the CLI:

```typescript title="prisma.config.ts"
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL'),
  },
})
```

### 5. Update Prisma Schema

Update `prisma/schema.prisma`. **Important:** In Prisma 7+, do NOT include a `url` property in the datasource block:

```prisma title="prisma/schema.prisma"
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

### 6. Create Prisma Client with Neon Adapter

Create `src/db.ts` to instantiate Prisma Client with the Neon serverless driver:

```typescript title="src/db.ts"
import 'dotenv/config'
import { PrismaClient } from './generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ 
  connectionString: process.env.DATABASE_URL! 
})

export const prisma = new PrismaClient({ adapter })
```

### 7. Create CRUD Example Script

Create `src/main.ts`:

```typescript title="src/main.ts"
import { prisma } from './db'

async function main() {
  console.log('🚀 Performing CRUD operations...')

  // CREATE
  const newUser = await prisma.user.create({
    data: { name: 'Alice', email: `alice-${Date.now()}@example.com` },
  })
  console.log('✅ CREATE: New user created:', newUser)

  // READ
  const foundUser = await prisma.user.findUnique({ where: { id: newUser.id } })
  console.log('✅ READ: Found user:', foundUser)

  // UPDATE
  const updatedUser = await prisma.user.update({
    where: { id: newUser.id },
    data: { name: 'Alice Smith' },
  })
  console.log('✅ UPDATE: User updated:', updatedUser)

  // DELETE
  await prisma.user.delete({ where: { id: newUser.id } })
  console.log('✅ DELETE: User deleted.')

  console.log('\n🎉 CRUD operations completed successfully!')
}

main()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Verify the user has correctly set both `DATABASE_URL` and `DIRECT_URL` in `.env`.
2.  Generate the Prisma Client:
    ```bash
    npx prisma generate
    ```
3.  Push the schema to the Neon database:
    ```bash
    npx prisma db push
    ```
4.  Run the example CRUD script:
    ```bash
    npx tsx src/main.ts
    ```
5.  If successful, the output should show log messages for each C-R-U-D step.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The `package.json` contains `prisma` (dev), `@prisma/client` (prod), `@prisma/adapter-neon` (prod), and `tsx` (dev).
- The `.env` file has both `DATABASE_URL` (pooled) and `DIRECT_URL` (direct).
- The `prisma.config.ts` file exists and points to `DIRECT_URL`.
- The `prisma/schema.prisma` does NOT have a `url` property in the datasource block.
- The Prisma Client import uses the generated path: `./generated/prisma`.
- The `PrismaNeon` adapter is instantiated with `{ connectionString: process.env.DATABASE_URL! }`.

---

## ❌ Do Not

- Do not hardcode credentials in any `.ts`, `.prisma`, or `.json` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- **Do not import `PrismaClient` from `@prisma/client`. Always use the generated client path: `./generated/prisma`.**
- **Do not include `url = env("DATABASE_URL")` in the datasource block for Prisma 7+.**
- **Do not install `@neondatabase/serverless` or `ws` packages — they are not needed with `@prisma/adapter-neon`.**
