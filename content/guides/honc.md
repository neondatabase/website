---
title: Getting started with the HONC stack
subtitle: Building a serverless Task API with Hono, Drizzle, Neon, and Cloudflare
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-05-14T00:00:00.000Z'
updatedOn: '2025-05-14T00:00:00.000Z'
---

The [HONC stack](https://honc.dev/) - an acronym for **H**ono, **O**RM (Drizzle), **N**eon, and **C**loudflare - is a modern toolkit for building lightweight, type-safe, and edge-enabled data APIs. It's designed for developers seeking to build fast, serverless applications with a strong emphasis on scalability and a great developer experience.

This guide will walk you through building a simple Task management API using the HONC stack. You'll learn how to:

- Initialize a HONC project using `create-honc-app`.
- Define your database schema with Drizzle ORM.
- Use Neon as your serverless Postgres database.
- Create API endpoints using the Hono framework.
- Run your application locally and deploy it to Cloudflare Workers.
- Utilize the built-in Fiberplane API playground for easy testing.

By the end, you'll have a functional serverless API and a solid understanding of how the HONC components work together.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js:** Version `22.15` or later installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
- **Neon account:** A free Neon account. If you don't have one, sign up at [Neon](https://console.neon.tech/signup).
- **Cloudflare account:** A free Cloudflare account, which you'll need for deployment. Sign up at [Cloudflare](https://dash.cloudflare.com/sign-up).

<Steps>

## Initialize your HONC project

The easiest way to start a HONC project is by using the [`create-honc-app`](https://github.com/fiberplane/create-honc-app) CLI tool.

1.  Open your terminal and run the following command:

    ```bash
    npm create honc-app@latest
    ```

      <Admonition type="note" title="Node.js version">
      Use Node.js version `22.15` or later. Older versions may cause project initialization issues. Check your version with:
      ```bash
      node -v
      ```
      </Admonition>

2.  The CLI will guide you through the setup process. Here's an example interaction:

    ```text shouldWrap
    npm create honc-app@latest

    > npx
    > create-honc-app

     __  __     ______     __   __     ______
    /\ \_\ \   /\  __ \   /\ "-.\ \   /\  ___\
    \ \  __ \  \ \ \/\ \  \ \ \-.  \  \ \ \____
     \ \_\ \_\  \ \_____\  \ \_\\"\_\  \ \_____\
      \/_/\/_/   \/_____/   \/_/ \/_/   \/_____/


    ┌  🪿 create-honc-app
    │
    ◇  Where should we create your project? (./relative-path)
    │  ./honc-task-api
    │
    ◇  Which template do you want to use?
    │  Neon template
    │
    ◇  Do you need an OpenAPI spec?
    │  Yes
    │
    ◇  The selected template uses Neon, do you want the create-honc-app to set up the connection string for you?
    │  Yes
    │
    ◇  Do you want to install dependencies?
    │  Yes
    │
    ◇  Do you want to initialize a git repository and stage all the files?
    │  Yes
    |
    ◆  Template set up successfully
    │
    ◇  Setting up Neon:
    │
    │  In order to connect to your database project and retrieve the connection key, you'll need to authenticate with Neon.
    │
    │  The connection URI will be written to your .dev.vars file as DATABASE_URL. The token itself will *NOT* be stored anywhere after this session is complete.
    │
    ◇  Awaiting authentication in web browser. Auth URL:
    │
    │  https://oauth2.neon.tech/oauth2/auth?response_type=code&client_id=create-honc-app&state=[...]&scope=[...]&redirect_uri=[...]&code_challenge=[...]&code_challenge_method=S256
    │
    ◆  Neon authentication successful
    │
    ◇  Select a Neon project to use:
    │  Create a new project
    │
    ◇  What is the name of the project?
    │  honc-task-api
    │
    ◆  Project created successfully: honc-task-api on branch: main
    │
    ◇  Select a project branch to use:
    │  main
    │
    ◇  Select a database you want to connect to:
    │  neondb
    │
    ◇  Select which role to use to connect to the database:
    │  neondb_owner
    │
    ◇  Writing connection string to .dev.vars file
    │
    ◆  Neon connection string written to .dev.vars file
    │
    ◆  Dependencies installed successfully
    │
    ◆  Git repository initialized and files staged successfully
    │
    └  🪿 HONC app created successfully in ./honc-task-api!
    ```

    Here's a breakdown of the options:
    - **Where to create your project:** Specify the directory for your new project. Here, we used `./honc-task-api`.
    - **Template:** Choose the Neon template for this guide.
    - **OpenAPI spec:** Opt-in to generate an OpenAPI spec for your API.
    - **Neon connection string:** Allow the CLI to set up the connection string for you.
    - **Install dependencies:** Yes, to install the required packages.
    - **Git repository:** Yes, to initialize a git repository and stage all files.
    - **Neon authentication:** Follow the link to authenticate with Neon. This will allow the CLI to set up your database connection.
      ![Neon authentication prompt](/docs/guides/honc-neon-auth.png)
    - **Create a new project:** Choose to create a new Neon project or use an existing one. Here, we created a new one.
    - **Project name:** Provide a name for your Neon project (e.g., `honc-task-api`) if creating a new one.
    - **Project branch:** Select the main branch for your Neon project.
    - **Database:** Choose the default database (e.g., `neondb`).
    - **Role:** Select the `neondb_owner` role for database access.
    - **Connection string:** The CLI will write the connection string to a `.dev.vars` file in your project directory.
    - **Setup**: The CLI will set up the project, install dependencies, and initialize a git repository.

3.  Navigate into your new project directory.

    ```bash
    cd honc-task-api
    ```

4.  Open the project in your favorite code editor.

## Confirm Neon connection

If you chose to let `create-honc-app` set up the connection string, your Neon `DATABASE_URL` should already be in the `.dev.vars` file in your project root. This file is used by [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (Cloudflare's CLI) for local development and is gitignored by default.

Verify its content:

```ini
// .dev.vars
DATABASE_URL="postgresql://neondb_owner:..."
```

If you didn't use the CLI for setup, copy `.dev.vars.example` to `.dev.vars`. Then, manually add your Neon project's `DATABASE_URL` to the `.dev.vars` file. You can find your connection string in the Neon console. Learn more: [Connect from any application](/docs/connect/connect-from-any-app)

## Define database schema with Drizzle

The `create-honc-app` template comes with an example schema (for `users`) in `src/db/schema.ts`. You need to modify this to define a `tasks` table.

1.  Open `src/db/schema.ts`. Remove the existing `users` schema definition. Add the following schema definition for `tasks`:

    ```typescript
    import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

    export type NewUser = typeof users.$inferInsert; // [!code --]
    export const users = pgTable('users', {
      // [!code --]
      id: uuid('id').defaultRandom().primaryKey(), // [!code --]
      name: text('name').notNull(), // [!code --]
      email: text('email').notNull(), // [!code --]
      settings: jsonb('settings'), // [!code --]
      createdAt: timestamp('created_at').defaultNow().notNull(), // [!code --]
      updatedAt: timestamp('updated_at').defaultNow().notNull(), // [!code --]
    }); // [!code --]

    export const tasks = pgTable('tasks', {
      // [!code ++]
      id: serial('id').primaryKey(), // [!code ++]
      title: text('title').notNull(), // [!code ++]
      description: text('description'), // [!code ++]
      completed: boolean('completed').default(false).notNull(), // [!code ++]
      createdAt: timestamp('created_at').defaultNow().notNull(), // [!code ++]
      updatedAt: timestamp('updated_at').defaultNow().notNull(), // [!code ++]
    }); // [!code ++]

    export type Task = typeof tasks.$inferSelect; // [!code ++]
    export type NewTask = typeof tasks.$inferInsert; // [!code ++]
    ```

    The tasks table schema defines the structure for storing tasks. It includes:
    - A unique, auto-incrementing integer `id`.
    - `title` and `description` fields.
    - A `completed` status.
    - `createdAt` and `updatedAt` timestamps to track creation and modification times.

    For type safety when interacting with tasks (e.g., selecting or inserting), `Task` and `NewTask` types are exported. These types are inferred from the schema and can be used throughout the application.

## Generate and apply database migrations

With the schema updated, generate and apply database migrations.

1.  **Generate migrations:**

    ```bash
    npm run db:generate
    ```

    This creates SQL migration files in the `drizzle` folder.

2.  **Apply migrations:**
    ```bash
    npm run db:migrate
    ```
    This applies the migrations to your Neon database. Your `tasks` table should now exist. You can verify this in the **Tables** section of your Neon project console.
    ![Neon console - Tasks table](/docs/guides/honc-neon-tasks-table.png)

## Adapt API endpoints for tasks

The `src/index.ts` file generated by `create-honc-app` will contain Hono routes and Zod schemas for a sample `users` API. You need to adapt this foundation to create a RESTful API for managing our `tasks`. This involves defining how clients can interact with our tasks data through standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).

1.  Open `src/index.ts`. You'll see code with `UserSchema`, an `apiRouter` instance for `/api/users`, Zod validators, and `describeRoute` for OpenAPI documentation.

2.  **Modify Zod schemas:**
    First, define the expected structure of task data for API requests and responses using Zod. This ensures type safety and provides a clear contract. Find the existing `UserSchema` and related definitions and replace them with schemas for `Task` (how a task looks when retrieved) and `NewTask` (how a new task looks when being created).

    ```typescript
    // ... import statements and middleware for database connection

    const UserSchema = z // [!code --]
      .object({
        // [!code --]
        id: z.number().openapi({
          // [!code --]
          example: 1, // [!code --]
        }), // [!code --]
        name: z.string().openapi({
          // [!code --]
          example: 'Nikita', // [!code --]
        }), // [!code --]
        email: z.string().email().openapi({
          // [!code --]
          example: 'nikita@neon.tech', // [!code --]
        }), // [!code --]
      }) // [!code --]
      .openapi({ ref: 'User' }); // [!code --]

    const TaskSchema = z // [!code ++]
      .object({
        // [!code ++]
        id: z.string().openapi({
          // [!code ++]
          description: 'The unique identifier for the task.', // [!code ++]
          example: '1', // [!code ++]
        }), // [!code ++]
        title: z.string().openapi({
          // [!code ++]
          description: 'The title of the task.', // [!code ++]
          example: 'Learn HONC', // [!code ++]
        }), // [!code ++]
        description: z.string().nullable().optional().openapi({
          // [!code ++]
          description: 'A detailed description of the task.', // [!code ++]
          example: 'Build a complete task API with the HONC Stack', // [!code ++]
        }), // [!code ++]
        completed: z.boolean().openapi({
          // [!code ++]
          description: 'Indicates if the task is completed.', // [!code ++]
          example: false, // [!code ++]
        }), // [!code ++]
        createdAt: z.string().datetime().openapi({
          // [!code ++]
          description: 'The date and time when the task was created.', // [!code ++]
          example: new Date().toISOString(), // [!code ++]
        }), // [!code ++]
        updatedAt: z.string().datetime().openapi({
          // [!code ++]
          description: 'The date and time when the task was last updated.', // [!code ++]
          example: new Date().toISOString(), // [!code ++]
        }), // [!code ++]
      }) // [!code ++]
      .openapi({ ref: 'Task' }); // [!code ++]

    const NewTaskSchema = z // [!code ++]
      .object({
        // [!code ++]
        title: z.string().min(1, 'Title cannot be empty').openapi({
          // [!code ++]
          example: 'Deploy to Cloudflare', // [!code ++]
        }), // [!code ++]
        description: z.string().nullable().optional().openapi({
          // [!code ++]
          example: 'Finalize deployment steps for the task API.', // [!code ++]
        }), // [!code ++]
      }) // [!code ++]
      .openapi({ ref: 'NewTask' }); // [!code ++]
    ```

    Here's a breakdown of the Zod schemas:
    - `TaskSchema` defines the full structure of a task for API responses.
    - `NewTaskSchema` defines the structure for creating a new task.
    - The `.openapi({ ref: "..." })` annotations are used to generate OpenAPI documentation.

3.  **Adapt API router:**
    The `apiRouter` groups related routes. We'll modify the one for `/api/users` to handle `/api/tasks`.
    - Locate where `app.route` is defined for `/api/users` and change it to `/api/tasks`:

      ```typescript
        app
        .get(
          "/",
          describeRoute({...})
        )
        .route("/api/users", apiRouter); // [!code --]
        .route("/api/tasks", apiRouter); // [!code ++]
      ```

    - Inside `apiRouter`, modify the CRUD operations. For each route:
      - `describeRoute` adds OpenAPI documentation.
      - `zValidator` validates request parameters or JSON bodies.
      - The `async` handler interacts with the database via Drizzle.

    Here's the adapted `apiRouter` code for tasks with CRUD operations:

    ```typescript shouldWrap
    // In src/index.ts, adapt the apiRouter for tasks

    const apiRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

    apiRouter // [!code --]
      .get( // [!code --]
        "/", // [!code --]
        describeRoute({...}) // [!code --]
      ) // [!code --]
      .post( // [!code --]
        "/", // [!code --]
        describeRoute({...}), // [!code --]
        zValidator( // [!code --]
          "json", // [!code --]
          // ... Zod schema for POST (users) ... // [!code --]
        ) // [!code --]
      ) // [!code --]
      .get( // [!code --]
        "/:id", // [!code --]
        describeRoute({...}), // [!code --]
        zValidator( // [!code --]
          "param", // [!code --]
          // ... Zod schema for GET by ID (users) ... // [!code --]
        ) // [!code --]
      ); // [!code --]

    apiRouter // [!code ++]
      .get( // [!code ++]
        "/", // [!code ++]
        describeRoute({ // [!code ++]
          summary: "List all tasks", // [!code ++]
          description: "Retrieves a list of all tasks, ordered by creation date.", // [!code ++]
          responses: { // [!code ++]
            200: { // [!code ++]
              content: { // [!code ++]
                "application/json": { schema: resolver(z.array(TaskSchema)) }, // [!code ++]
              }, // [!code ++]
              description: "Tasks fetched successfully", // [!code ++]
            }, // [!code ++]
          }, // [!code ++]
        }), // [!code ++]
        async (c) => { // [!code ++]
          const db = c.get("db"); // [!code ++]
          const tasks = await db // [!code ++]
            .select() // [!code ++]
            .from(schema.tasks) // [!code ++]
            .orderBy(desc(schema.tasks.createdAt)); // [!code ++]
          return c.json(tasks, 200); // [!code ++]
        }, // [!code ++]
      ) // [!code ++]
      .post( // [!code ++]
        "/", // [!code ++]
        describeRoute({ // [!code ++]
          summary: "Create a new task", // [!code ++]
          description: "Adds a new task to the list.", // [!code ++]
          responses: { // [!code ++]
            201: { // [!code ++]
              content: { // [!code ++]
                "application/json": { // [!code ++]
                  schema: resolver(TaskSchema), // [!code ++]
                }, // [!code ++]
              }, // [!code ++]
              description: "Task created successfully", // [!code ++]
            }, // [!code ++]
            400: { // [!code ++]
              description: "Invalid input for task creation", // [!code ++]
            }, // [!code ++]
          }, // [!code ++]
        }), // [!code ++]
        zValidator("json", NewTaskSchema), // [!code ++]
        async (c) => { // [!code ++]
          const db = c.get("db"); // [!code ++]
          const { title, description } = c.req.valid("json"); // [!code ++]
          const newTaskPayload: schema.NewTask = { // [!code ++]
            title, // [!code ++]
            description: description || null, // [!code ++]
            completed: false, // [!code ++]
          }; // [!code ++]
          const [insertedTask] = await db // [!code ++]
            .insert(schema.tasks) // [!code ++]
            .values(newTaskPayload) // [!code ++]
            .returning(); // [!code ++]
          return c.json(insertedTask, 201); // [!code ++]
        }, // [!code ++]
      ) // [!code ++]
      .get( // [!code ++]
        "/:id", // [!code ++]
        describeRoute({ // [!code ++]
          summary: "Get a single task by ID", // [!code ++]
          responses: { // [!code ++]
            200: { // [!code ++]
              content: { "application/json": { schema: resolver(TaskSchema) } }, // [!code ++]
              description: "Task fetched successfully", // [!code ++]
            }, // [!code ++]
            404: { description: "Task not found" }, // [!code ++]
            400: { description: "Invalid ID format" }, // [!code ++]
          }, // [!code ++]
        }), // [!code ++]
        zValidator( // [!code ++]
          "param", // [!code ++]
          z.object({ // [!code ++]
            id: z.string().openapi({ // [!code ++]
              param: { name: "id", in: "path" }, // [!code ++]
              example: "1", // [!code ++]
              description: "The ID of the task to retrieve", // [!code ++]
            }), // [!code ++]
          }), // [!code ++]
        ), // [!code ++]
        async (c) => { // [!code ++]
          const db = c.get("db"); // [!code ++]
          const { id } = c.req.valid("param"); // [!code ++]
          const [task] = await db // [!code ++]
            .select() // [!code ++]
            .from(schema.tasks) // [!code ++]
            .where(eq(schema.tasks.id, Number(id))); // [!code ++]
          if (!task) { // [!code ++]
            return c.json({ error: "Task not found" }, 404); // [!code ++]
          } // [!code ++]
          return c.json(task, 200); // [!code ++]
        }, // [!code ++]
      ) // [!code ++]
      .put( // [!code ++]
        "/:id", // [!code ++]
        describeRoute({ // [!code ++]
          summary: "Update a task's completion status", // [!code ++]
          description: "Toggles or sets the completion status of a specific task.", // [!code ++]
          responses: { // [!code ++]
            200: { // [!code ++]
              content: { "application/json": { schema: resolver(TaskSchema) } }, // [!code ++]
              description: "Task updated successfully", // [!code ++]
            }, // [!code ++]
            404: { description: "Task not found" }, // [!code ++]
            400: { description: "Invalid input or ID format" }, // [!code ++]
          }, // [!code ++]
        }), // [!code ++]
        zValidator( // [!code ++]
          "param", // [!code ++]
          z.object({ // [!code ++]
            id: z.string().openapi({ // [!code ++]
              param: { name: "id", in: "path" }, // [!code ++]
              example: "1", // [!code ++]
              description: "The ID of the task to update.", // [!code ++]
            }), // [!code ++]
          }), // [!code ++]
        ), // [!code ++]
        zValidator( // [!code ++]
          "json", // [!code ++]
          z // [!code ++]
            .object({ // [!code ++]
              completed: z.boolean().openapi({ // [!code ++]
                example: true, // [!code ++]
                description: "The new completion status of the task.", // [!code ++]
              }), // [!code ++]
            }) // [!code ++]
        ), // [!code ++]
        async (c) => { // [!code ++]
          const db = c.get("db"); // [!code ++]
          const { id } = c.req.valid("param"); // [!code ++]
          const { completed } = c.req.valid("json"); // [!code ++]
          const [updatedTask] = await db // [!code ++]
            .update(schema.tasks) // [!code ++]
            .set({ updatedAt: sql`NOW()`, completed }) // [!code ++]
            .where(eq(schema.tasks.id, Number(id))) // [!code ++]
            .returning(); // [!code ++]
          if (!updatedTask) { // [!code ++]
            return c.json({ error: "Task not found" }, 404); // [!code ++]
          } // [!code ++]
          return c.json(updatedTask, 200); // [!code ++]
        }, // [!code ++]
      ) // [!code ++]
      .delete( // [!code ++]
        "/:id", // [!code ++]
        describeRoute({ // [!code ++]
          summary: "Delete a task", // [!code ++]
          description: "Removes a specific task from the list.", // [!code ++]
          responses: { // [!code ++]
            200: { // [!code ++]
              content: { // [!code ++]
                "application/json": { // [!code ++]
                  schema: resolver( // [!code ++]
                    z.object({ message: z.string(), id: z.string() }), // [!code ++]
                  ), // [!code ++]
                }, // [!code ++]
              }, // [!code ++]
              description: "Task deleted successfully", // [!code ++]
            }, // [!code ++]
            404: { description: "Task not found" }, // [!code ++]
            400: { description: "Invalid ID format" }, // [!code ++]
          }, // [!code ++]
        }), // [!code ++]
        zValidator( // [!code ++]
          "param", // [!code ++]
          z.object({ // [!code ++]
            id: z.string().openapi({ // [!code ++]
              param: { name: "id", in: "path" }, // [!code ++]
              example: "1", // [!code ++]
              description: "The ID of the task to delete.", // [!code ++]
            }), // [!code ++]
          }), // [!code ++]
        ), // [!code ++]
        async (c) => { // [!code ++]
          const db = c.get("db"); // [!code ++]
          const { id } = c.req.valid("param"); // [!code ++]
          const [deletedTask] = await db // [!code ++]
            .delete(schema.tasks) // [!code ++]
            .where(eq(schema.tasks.id, Number(id))) // [!code ++]
            .returning({ id: schema.tasks.id }); // [!code ++]
          if (!deletedTask) { // [!code ++]
            return c.json({ error: "Task not found" }, 404); // [!code ++]
          } // [!code ++]
          return c.json( // [!code ++]
            { message: "Task deleted successfully", id: deletedTask.id }, // [!code ++]
            200, // [!code ++]
          ); // [!code ++]
        }, // [!code ++]
      ); // [!code ++]
    ```

    **Breakdown of the API endpoints:**
    - **`GET /` (List tasks):** Fetches all tasks from the `schema.tasks` table using `db.select()`. It orders them by `createdAt` in descending order so newer tasks appear first. The response is a JSON array of `TaskSchema` objects.
    - **`POST /` (Create task):**
      - Validates the incoming JSON request body against `NewTaskSchema` (requires `title`, `description` is optional).
      - If valid, it constructs a `newTaskPayload` (setting `completed` to `false` by default).
      - Inserts the new task into `schema.tasks` using `db.insert().values().returning()` to get the newly created task (including its auto-generated ID and timestamps).
      - Returns the created task (matching `TaskSchema`) with a `201 Created` status.
    - **`GET /:id` (Get task by ID):**
      - Fetches a single task from `schema.tasks` where the `id` matches.
      - Returns the task if found, or a `404 Not Found` error.
    - **`PUT /:id` (Update task):**
      - Validates the `id` path parameter.
      - Validates the incoming JSON request body against `z.object({ completed: z.boolean() })`.
      - Updates the task's `completed` status and `updatedAt` timestamp in `schema.tasks`.
    - **`DELETE /:id` (Delete task):**
      - Validates the `id` path parameter.
      - Deletes the task with the matching `id` from `schema.tasks`.
      - Returns a success message with the ID of the deleted task, or a `404 Not Found`.

## Run and test locally

Run your HONC application locally using Wrangler:

1.  In your terminal, at the root of your project:

    ```bash
    npm run dev
    ```

    This starts a local server, typically at `http://localhost:8787`.

2.  **Test your API endpoints:**
    You can use tools like cURL, Postman, or the Fiberplane API Playground (see next section).
    - **Create a task:**

      ```bash
      curl -X POST -H "Content-Type: application/json" -d '{"title":"Learn HONC","description":"Build a task API"}' http://localhost:8787/api/tasks
      ```

      A successful response should return the created task with a unique ID.

      ```json
      {
        "id": 1,
        "title": "Learn HONC",
        "description": "Build a task API",
        "completed": false,
        "createdAt": "2025-05-14T09:17:25.392Z",
        "updatedAt": "2025-05-14T09:17:25.392Z"
      }
      ```

      You can also verify if the task was added to your database by checking your project in the Neon console. The task should appear in the `tasks` table.
      ![Neon console - Tasks table with new task](/docs/guides/honc-neon-tasks-table-new-task.png)

    - **List all tasks:**

      ```bash
      curl http://localhost:8787/api/tasks
      ```

      A successful response should return an array of tasks.

      ```json
      [
        {
          "id": 1,
          "title": "Learn HONC",
          "description": "Build a task API",
          "completed": false,
          "createdAt": "2025-05-14T09:17:25.392Z",
          "updatedAt": "2025-05-14T09:17:25.392Z"
        }
      ]
      ```

    - **Get a specific task (replace `TASK_ID` with an actual ID from the list):**

      ```bash
      curl http://localhost:8787/api/tasks/TASK_ID
      ```

      For example, if the ID is `1`:

      ```bash
      curl http://localhost:8787/api/tasks/1
      ```

      A successful response should return the task with ID `1`.

      ```json
      {
        "id": 1,
        "title": "Learn HONC",
        "description": "Build a task API",
        "completed": false,
        "createdAt": "2025-05-14T09:17:25.392Z",
        "updatedAt": "2025-05-14T09:17:25.392Z"
      }
      ```

    - **Update a task (replace `TASK_ID`):**

      ```bash
      curl -X PUT -H "Content-Type: application/json" -d '{"completed":true}' http://localhost:8787/api/tasks/TASK_ID
      ```

      For example, if the ID is `1`:

      ```bash
      curl -X PUT -H "Content-Type: application/json" -d '{"completed":true}' http://localhost:8787/api/tasks/1
      ```

      A successful response should return the updated task.

      ```json
      {
        "id": 1,
        "title": "Learn HONC Stack",
        "description": "Build a task API",
        "completed": true,
        "createdAt": "2025-05-14T09:17:25.392Z",
        "updatedAt": "2025-05-14T09:17:25.392Z"
      }
      ```

    - **Delete a task (replace `TASK_ID`):**

      ```bash
      curl -X DELETE http://localhost:8787/api/tasks/TASK_ID
      ```

      For example, if the ID is `1`:

      ```bash
      curl -X DELETE http://localhost:8787/api/tasks/1
      ```

      A successful response should return a message confirming deletion.

      ```json
      { "message": "Task deleted successfully", "id": 1 }
      ```

<Admonition type="info" title="Interactive Testing with Fiberplane API Playground">

The `create-honc-app` boilerplate includes integration with the [**Fiberplane API Playground**](https://fiberplane.com/blog/hono-native-playground/), an in-browser tool designed for interacting with your HONC API during development.

To access it, simply ensure your local development server is running via `npm run dev`. Once the server is active, open your web browser and navigate to [`localhost:8787/fp`](http://localhost:8787/fp).

Within the playground, you'll find a visual exploration of your API. It reads your `/openapi.json` spec (generated by `hono-openapi` if enabled) to display all your defined API endpoints, such as `/api/tasks` or `/api/tasks/{id}`, within a user-friendly interface. This allows for easy request crafting; you can select an endpoint and fill in necessary parameters, path variables, and request bodies directly within the UI.

This is incredibly useful for quick testing and debugging cycles during development, reducing the frequent need for external tools like Postman or cURL.

![Fiberplane API Playground showing API endpoints for the HONC Task API](/docs/guides/honc-fiberplane-api-playground.png)

</Admonition>

## Deploy to Cloudflare Workers

Deploy your application globally via Cloudflare's edge network.

1.  **Set `DATABASE_URL` secret in Cloudflare:**
    Your deployed Worker needs the Neon database connection string.

    ```bash
    npx wrangler secret put DATABASE_URL
    ```

    Paste your Neon connection string when prompted.

    ```bash
    npx wrangler secret put DATABASE_URL
    ⛅️ wrangler 4.14.4
    -------------------
    ✔ Enter a secret value: … ************************************************************************************************************************
    🌀 Creating the secret for the Worker "honc-task-api"
    ✔ There doesn't seem to be a Worker called "honc-task-api". Do you want to create a new Worker with that name and add secrets to it? … yes
    🌀 Creating new Worker "honc-task-api"...
    ✨ Success! Uploaded secret DATABASE_URL
    ```

    > Steps may vary based on your Cloudflare account and login status. Ensure you are logged in if prompted.

2.  **Deploy:**

    ```bash
    npm run deploy
    ```

    Wrangler will deploy your application to Cloudflare Workers. The output will show the deployment status and the URL of your deployed Worker.

        ```bash
        npm run deploy
        > deploy
        > wrangler deploy --minify src/index.ts
        ⛅️ wrangler 4.14.4
        -------------------
        Total Upload: 505.17 KiB / gzip: 147.10 KiB
        Worker Startup Time: 32 ms
        No bindings found.
        Uploaded honc-task-api (13.49 sec)
        Deployed honc-task-api triggers (3.50 sec)
          https://honc-task-api.[xxx].workers.dev
        Current Version ID: b0c90b17-f10a-4807-xxxx
        ```

</Steps>

## Summary

Congratulations! You've successfully adapted the `create-honc-app` boilerplate to build a serverless Task API using the HONC stack. You've defined a schema with Drizzle, created Hono endpoints with Zod validation, tested locally using tools like cURL and the integrated Fiberplane API Playground, and learned how to deploy to Cloudflare Workers.

The HONC stack offers a streamlined, type-safe, and performant approach to building modern edge APIs.

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
    <a href="https://github.com/neondatabase-labs/honc-example" description="HONC Stack" icon="github">
      HONC Task API
    </a>
</DetailIconCards>

## Resources

- **HONC:** [honc.dev](https://honc.dev), [create-honc-app GitHub](https://github.com/fiberplane/create-honc-app)
- **Fiberplane API Playground:** [Hono-native API Playground, powered by OpenAPI](https://fiberplane.com/blog/hono-native-playground/), [Features](https://fiberplane.com/docs/features/playground/)
- **Hono:** [hono.dev](https://hono.dev)
- **Drizzle ORM:** [orm.drizzle.team](https://orm.drizzle.team)
- **Neon:** [neon.tech/docs](/docs)
- **Cloudflare Workers:** [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers/)

<NeedHelp/>
