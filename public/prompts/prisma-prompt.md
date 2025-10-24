# 💡 AI Prompt: Integrate a TypeScript/Node.js Project with Neon and Prisma ORM

**Role:** You are an expert software agent responsible for configuring the current TypeScript/Node.js project to connect to a Neon Postgres database using Prisma ORM.

**Purpose:** To install the necessary packages, initialize a Prisma schema, configure the database connection for both application and migration workflows, define a sample schema, and provide a working script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle.

**Scope:**
- Assumes the user is working within an existing Node.js project directory.
- Assumes the user has a Neon project and access to its database connection string.

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
2.  Install the Prisma CLI as a development dependency and the Prisma Client as a production dependency. `tsx` is included for running TypeScript files directly.
    ```bash
    # Production dependencies
    npm install @prisma/client

    # Development dependencies
    npm install -D prisma typescript tsx @types/node
    ```
3.  Initialize the Prisma project, which creates a `prisma/schema.prisma` file and a `.env` file.
    ```bash
    npx prisma init
    ```

### 2. Select a Connection Method

Ask the user to choose their preferred connection method. Explain the use cases to help them decide:

1.  **Standard TCP Driver with Connection Pooling:** Recommended for long-running applications like traditional Node.js servers (e.g., Express.js, NestJS). It uses Neon's built-in PgBouncer for efficient connection management.
2.  **Neon Serverless Driver:** Recommended for short-lived, serverless environments like Vercel Edge Functions, Cloudflare Workers, or AWS Lambda. It connects over HTTP, bypassing TCP connection limits in these environments.

---

### 3. Configure Based on Selection

Execute the appropriate configuration steps based on the user's choice.

#### Option A: Standard TCP Driver (with Connection Pooling)

1.  **Update `.env` File:**
    Instruct the user to populate the `.env` file with the connection string from their Neon Console.
    ```env title=".env"
    # Get your connection string from the Neon Console
    # Project -> Dashboard -> Connect
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]-pooler/[dbname]?sslmode=require&channel_binding=require"
    ```

2.  **Update `prisma/schema.prisma`:**
    Ensure the `datasource` block is configured to use the environment variable.
    ```prisma title="prisma/schema.prisma"
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```

#### Option B: Neon Serverless Driver

**Install Additional Dependency:**
Install the Prisma adapter for Neon.
```bash
npm install @prisma/adapter-neon
```

Configure `.env` file and `prisma/schema.prisma` using the same steps outlined for the Standard TCP Driver.

---

### 4. Define a Sample Schema

Update the `prisma/schema.prisma` file with a sample `User` model. This schema is identical for both connection methods.

```prisma title="prisma/schema.prisma"
// This section is added below the datasource and generator blocks

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

### 5. Create CRUD Example Script

Create a `main.ts` file in the project root. The content of this file **depends on the connection method selected in step 2**.

#### For Standard TCP Driver
```typescript title="main.ts"
import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Performing CRUD operations...');

    // CREATE
    const newUser = await prisma.user.create({
      data: { name: 'Alice', email: `alice-${Date.now()}@prisma.io` },
    });
    console.log('✅ CREATE: New user created:', newUser);

    // READ
    const foundUser = await prisma.user.findUnique({ where: { id: newUser.id } });
    console.log('✅ READ: Found user:', foundUser);

    // UPDATE
    const updatedUser = await prisma.user.update({
      where: { id: newUser.id },
      data: { name: 'Alice Smith' },
    });
    console.log('✅ UPDATE: User updated:', updatedUser);

    // DELETE
    await prisma.user.delete({ where: { id: newUser.id } });
    console.log('✅ DELETE: User deleted.');

    console.log('\nCRUD operations completed successfully.');
  } catch (error) {
    console.error('❌ Error performing CRUD operations:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

#### For Neon Serverless Driver
```typescript title="main.ts"
import 'dotenv/config';
import { PrismaClient } from './generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log('🚀 Performing CRUD operations...');

        // CREATE
        const newUser = await prisma.user.create({
            data: { name: 'Alice', email: `alice-${Date.now()}@prisma.io` },
        });
        console.log('✅ CREATE: New user created:', newUser);

        // READ
        const foundUser = await prisma.user.findUnique({ where: { id: newUser.id } });
        console.log('✅ READ: Found user:', foundUser);

        // UPDATE
        const updatedUser = await prisma.user.update({
            where: { id: newUser.id },
            data: { name: 'Alice Smith' },
        });
        console.log('✅ UPDATE: User updated:', updatedUser);

        // DELETE
        await prisma.user.delete({ where: { id: newUser.id } });
        console.log('✅ DELETE: User deleted.');

        console.log('\nCRUD operations completed successfully.');
    } catch (error) {
        console.error('❌ Error performing CRUD operations:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
```
---

## 🚀 Next Steps

Once the setup is complete:

1.  Verify the user has correctly set their `DATABASE_URL` in `.env`.
2.  Generate the Prisma Client based on the schema:
    ```bash
    npx prisma generate
    ```
3.  Create and apply the initial migration to their Neon database:
    ```bash
    npx prisma migrate dev --name initialize_schema
    ```
4.  Finally, run the example CRUD script:
    ```bash
    npx tsx main.ts
    ```
5.  If successful, the output should show log messages for each C-R-U-D step.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The `package.json` contains `prisma` (dev), `@prisma/client` (prod), and `tsx` (dev).
- The `.env` file is present, and the connection string is loaded from `process.env`.
- A sample `User` model exists in `schema.prisma`.
- The `main.ts` script correctly imports `PrismaClient` from `./generated/prisma`.

---

## ❌ Do Not

- Do not hardcode credentials in any `.ts`, `.prisma`, or `.json` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- **Do not import `PrismaClient` from `@prisma/client`. Always use the generated client path: `./generated/prisma`.**