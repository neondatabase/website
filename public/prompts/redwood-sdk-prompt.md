# 💡 AI Prompt: Connect RedwoodSDK to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and modern web frameworks built for edge environments like Cloudflare Workers. Your task is to configure the current RedwoodSDK project to connect to a Neon Postgres database.

**Purpose:** To connect the current RedwoodSDK project to Neon Postgres by installing a database driver, configuring environment variables, and creating a test route to validate the connection.

**Scope:**
- Must be run inside an existing RedwoodSDK project directory.
- Assumes the user has a Neon project and access to their full connection string.
- All modifications must follow RedwoodSDK and Cloudflare Workers conventions.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing RedwoodSDK project directory. Do not proceed if no RedwoodSDK project is detected. You can identify a RedwoodSDK project by the presence of `"rwsdk/worker"` in the `dependencies` or `devDependencies` section of `package.json`.
- **Setup for New Projects:** If the user does not have a project yet, run the following command to create a new RedwoodSDK project:

  ```bash
  npx create-rwsdk my-redwood-app
  ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open RedwoodSDK project as follows:

### 1. Install Dependencies

1.  **Prompt the user to select a PostgreSQL driver.** Present the following options, explaining the benefits of each:

    *   **`@neondatabase/serverless` (Recommended):** Optimized for serverless and edge functions with HTTP connections. This is the ideal choice for RedwoodSDK as it runs on Cloudflare Workers.
    *   **`postgres` (postgres.js):** A fast, full-featured client that also works well in the Cloudflare Workers environment.

   Make sure to ask the user to choose one of the above options and do not proceed until they provide their choice. Clearly explain the pros of each option to help them decide.

2.  Based on the user's selection, run the corresponding installation command:

    ```bash
    # For @neondatabase/serverless
    npm install @neondatabase/serverless

    # For postgres (postgres.js)
    npm install postgres
    ```

---

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from their Neon project.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Dashboard → Connect**.

---

### 3. Create an Example to Test the Connection

To provide a clear way to verify the setup, modify a page component to query the database and display the PostgreSQL version.

1.  **Locate the main page component file**, which is typically created at `src/app/pages/Home.tsx`.
2.  **Replace the contents of this file** to implement a database query.
3.  **Use the code block that corresponds to the driver selected in Step 1.**

    #### Option A: Using `@neondatabase/serverless`

    ```typescript title="src/app/pages/Home.tsx"
    import { RequestInfo } from "rwsdk/worker";
    import { neon } from '@neondatabase/serverless';
    import { env } from "cloudflare:workers";

    async function getData() {
      const sql = neon(env.DATABASE_URL);
      const response = await sql`SELECT version()`;
      return response[0].version;
    }

    export async function Home({ ctx }: RequestInfo) {
      const data = await getData();
      return <>{data}</>;
    }
    ```

    #### Option B: Using `postgres` (postgres.js)

    ```typescript title="src/app/pages/Home.tsx"
    import { RequestInfo } from "rwsdk/worker";
    import postgres from 'postgres';
    import { env } from "cloudflare:workers";

    async function getData() {
      const sql = postgres(env.DATABASE_URL);
      const response = await sql`SELECT version()`;
      return response[0].version;
    }

    export async function Home({ ctx }: RequestInfo) {
      const data = await getData();
      return <>{data}</>;
    }
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their connection string in `.env`. Do not proceed if the placeholder value is still present.
2.  Generate the correct TypeScript types for the environment variables. This step is needed to fix the Typescript errors.
    ```bash
    npx wrangler types
    ```
3.  Start the RedwoodSDK development server:
    ```bash
    npm run dev
    ```
4.  Inform the user that the setup is complete. To test the connection, they can visit `http://localhost:5173` in their browser. They should see a page displaying the PostgreSQL version from their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A supported PostgreSQL driver (`@neondatabase/serverless` or `postgres`) is installed as a dependency in `package.json`.
- A `.env` file is present or has been created with a `DATABASE_URL` placeholder.
- The test component correctly imports the `env` object from `cloudflare:workers` to access environment variables.
- The test component correctly imports and uses the chosen database driver.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any `.tsx` or `.ts` source code file. Always use the `env` object.
- **Do not use `process.env`**. RedwoodSDK runs on Cloudflare Workers and requires importing `env` from `"cloudflare:workers"`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined routes or components. Only modify the specified page component (`src/app/pages/Home.tsx`).