# 💡 AI Prompt: Connect a Node.js Project to Neon with TypeORM

**Role:** You are an expert software agent responsible for configuring the current Node.js project to connect to a Neon Postgres database using TypeORM.

**Purpose:** To correctly initialize a TypeORM project if one does not exist, install dependencies, manage environment variables, and update the TypeORM `DataSource` configuration to securely connect to a Neon serverless Postgres database.

**Scope:**
- Assumes the user is working within a Node.js or TypeScript project directory.
- Assumes the user has a Neon database and its connection string.
- All commands must use the project's detected package manager (`npm`, `pnpm`, or `yarn`).

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open project as follows:

### 1. Detect or Initialize TypeORM Project

- **Detect:** First, check if a TypeORM project structure already exists. Look for the `typeorm` package in `package.json` and a configuration file like `src/data-source.ts`.
- **Initialize (if not detected):** If no TypeORM setup is found, bootstrap a new project structure by running the TypeORM CLI. This command adds the necessary dependencies and creates a default project layout.
  ```bash
  npx typeorm init --database postgres
  ```
- After this step, a `src/data-source.ts` file and other required files will be present.

### 2. Ensure Required Packages are Installed

- Verify that all necessary packages are installed. The `init` command handles most, but `dotenv` is essential for managing the connection string. Run the installation command to ensure all dependencies are present.
  ```bash
  npm install typeorm pg reflect-metadata dotenv
  ```
- `typeorm`: The Object-Relational Mapper.
- `pg`: The PostgreSQL database driver that TypeORM uses.
- `reflect-metadata`: Required by TypeORM for its decorator-based metadata.
- `dotenv`: To load environment variables from a `.env` file.

### 3. Configure TypeScript (`tsconfig.json`)

- This is a mandatory prerequisite for TypeORM.
- Locate the `tsconfig.json` file in the project root. The `typeorm init` command creates this file if it doesn't exist.
- Verify that the following options are present and set to `true` under `compilerOptions`. If they are missing or `false`, add or update them.
  ```json
  {
    "compilerOptions": {
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true
      // ... other options
    }
  }
  ```

### 4. Set Up Environment File (`.env`)

- Check for a `.env` file in the project root. If it does not exist, create one.
- Add or update the `DATABASE_URL` variable in the `.env` file. Provide the following format and instruct the user to replace the placeholder with their connection string from the Neon Console.

  ```
  # Get your connection string from the Neon Console
  # Project -> Dashboard -> Connect
  DATABASE_URL="postgresql://<user>:<password>@<hostname>.neon.tech/<dbname>?sslmode=require"
  ```

### 5. Update TypeORM `DataSource` Configuration

- Locate the TypeORM `DataSource` file (this will be `src/data-source.ts` for a newly initialized project).
- Modify the `DataSource` configuration to use the `DATABASE_URL` environment variable. This involves replacing individual `host`, `port`, `username`, `password`, and `database` properties with a single `url` property.
- **Preserve all other existing `DataSource` options**, such as `entities`, `migrations`, `logging`, and `synchronize`.

**Example Transformation:**

*The default `init` command generates a configuration like this:*
```typescript
// src/data-source.ts (Before)
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "your_username",
    password: "your_password",
    database: "your_database",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
```

*Update it to securely connect to Neon:*
```typescript
// src/data-source.ts (After)
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import "dotenv/config"; // Ensure .env variables are loaded

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL, // Use the Neon connection string
    ssl: true, // Enable SSL for secure connection to Neon
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
```

### 6. Ensure Global Shims are Loaded

- The `reflect-metadata` shim is required by TypeORM and must be imported once at the top of the application's entry point.
- The `typeorm init` command correctly places this in `src/index.ts`. If you are modifying a custom project, check the main entry file (e.g., `index.ts`, `main.ts`) and add the following import at the very top if it is not already present:

  ```typescript
  import "reflect-metadata";
  ```

---

## 🚀 Next Steps

Once setup is complete, verify the connection:

1.  **Create a verification script:** Create a file named `verify-connection.ts` with the following content to test the database connection.
    ```typescript title="verify-connection.ts"
    import "reflect-metadata";
    import { AppDataSource } from "./src/data-source"; // Adjust path if necessary

    async function verify() {
      try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized successfully.");

        const result = await AppDataSource.query("SELECT version()");
        console.log("Successfully connected to Neon!");
        console.log("PostgreSQL version:", result[0].version);

        await AppDataSource.destroy();
        console.log("Data Source has been destroyed successfully.");
      } catch (err) {
        console.error("Error during Data Source initialization:", err);
      }
    }

    verify();
    ```

2.  **Run the script:**
    ```bash
    npx ts-node verify-connection.ts
    ```
3.  A successful run will print the PostgreSQL version from their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A TypeORM project is either detected or initialized with `npx typeorm init`.
- The `pg`, `typeorm`, `reflect-metadata`, and `dotenv` packages are listed as dependencies.
- `tsconfig.json` includes `"emitDecoratorMetadata": true` and `"experimentalDecorators": true`.
- The `DataSource` configuration uses `type: 'postgres'`, `url: process.env.DATABASE_URL`, and `ssl: true`.
- The connection string is loaded from a `.env` file via the `DATABASE_URL` variable.
- All other `DataSource` options (`entities`, `migrations`, etc.) are preserved.
- The `reflect-metadata` shim is imported at the top of the main application entry point.

---

## ❌ Do Not

- Do not hardcode the connection string or any credentials in the source code.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- Do not remove existing entity or migration paths from the `DataSource` configuration.