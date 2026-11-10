# 💡 AI Prompt: Connect RedwoodSDK to Neon Postgres

**Role:** You are an expert software agent specializing in TypeScript and modern web frameworks built for edge environments like Cloudflare Workers. Your task is to configure the current RedwoodSDK project to connect to a Neon Postgres database.

**Purpose:** To connect the current RedwoodSDK project to Neon Postgres by installing the Neon serverless driver, configuring environment variables, and creating a test page to validate the connection.

**Scope:**
- Must be run inside an existing RedwoodSDK project directory.
- Assumes the user has a Neon project and access to their full connection string.
- All modifications must follow RedwoodSDK and Cloudflare Workers conventions.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing RedwoodSDK project directory. Do not proceed if no RedwoodSDK project is detected. You can identify a RedwoodSDK project by the presence of `rwsdk` in the `dependencies` or `devDependencies` section of `package.json`.
- **Setup for New Projects:** If the user does not have a project yet, instruct them to run the following command manually in their terminal:

  ```bash
  npx create-rwsdk@latest my-redwood-app
  ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open RedwoodSDK project as follows:

### 1. Install Dependencies

Install the Neon serverless driver. It connects over HTTP or WebSockets, so it works in Cloudflare Workers.

```bash
npm install @neondatabase/serverless
```

---

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their complete connection string from their Neon project.

    ```dotenv
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Dashboard → Connect**.

---

### 3. Create an Example to Test the Connection

To provide a clear way to verify the setup, modify the starter home page to query the database and display the PostgreSQL version.

1.  **Locate the home page file** at `src/app/pages/home.tsx`. The RedwoodSDK starter creates this file.
2.  **Replace the contents of this file** with the following code:

    ```typescript
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
- `@neondatabase/serverless` is installed as a dependency in `package.json`.
- A `.env` file is present or has been created with a `DATABASE_URL` placeholder.
- The home page correctly imports the `env` object from `cloudflare:workers` to access environment variables.
- The home page correctly imports and uses `neon` from `@neondatabase/serverless`.

---

## ❌ Do Not

- **Do not hardcode credentials** or sensitive information in any `.tsx` or `.ts` source code file. Always use the `env` object.
- **Do not use `process.env`**. RedwoodSDK runs on Cloudflare Workers and requires importing `env` from `"cloudflare:workers"`.
- **Do not output the user's connection string** in any response or log.
- Do not delete or modify other user-defined routes or components. Only modify the home page (`src/app/pages/home.tsx`).
