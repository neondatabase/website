---
title: Best practices for using AI tools with Neon
subtitle: A comprehensive guide to using AI tools with Neon and how to make the most of them
enableTableOfContents: true
updatedOn: '2025-04-28T00:00:00.000Z'
---

Generating code with AI using natural language, often called "vibe coding," provides significant speed advantages for development, especially during prototyping. You describe what you need, and the AI generates the code.

However, the reliability needed for production applications, particularly when managing databases, user data, and authentication, requires more than just speed. AI code generation, while powerful, can sometimes overlook critical details, security considerations, or database best practices. Incorrect SQL, inefficient queries, or insecure patterns can arise if the AI lacks sufficient context or guidance.

Consider this guide a set of best practices for using AI tools with Neon. These practices are designed to help you leverage the power of AI while ensuring that your code is maintainable, secure, and efficient.


## Provide clear context: Treat AI as a teammate

AI tools require specific context to generate useful code. Without context, the AI may produce generic or incorrect code that doesn't fit your project's needs.

### Problem: Vague prompts lead to generic code

**Example scenario:** You want to create a `users` table in your Neon Postgres database using Drizzle ORM.

If you ask an AI to perform a task without sufficient background:
*   **Your prompt (lacking context):**
    ```
    Create a table for users.
    ```
*   **Potential AI output (Generic SQL - may not suit your project):**
    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255)
    );
    ```
    The AI doesn't know you're using Postgres, MySQL, or Drizzle ORM, Prisma. It also lacks specific requirements like what columns you need, constraints, or data types.

### Solution: Provide specific project context in your prompts

Guide the AI by including details about your stack, libraries, existing schema, and specific requirements.

*   **Your prompt:**
    ```
    Using Drizzle ORM with Postgres, define a schema for a 'users' table.
    It needs:
    - 'id': an auto-incrementing integer, serving as the primary key.
    - 'name': text, not null.
    - 'email': text, unique, and not null.
    - 'createdAt': a timestamp with time zone, defaulting to the current timestamp.
    ```
*   **Expected AI output:**
    ```typescript
    import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

    export const users = pgTable('users', {
      id: serial('id').primaryKey(),
      name: text('name').notNull(),
      email: text('email').notNull().unique(),
      createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    });
    ```

### Key context points to provide your AI

*   **Libraries/ORMs:** e.g., "using Drizzle ORM," "node-postgres", "Prisma." etc.
*   **Business logic/constraints:** e.g., "Ensure email addresses are stored in lowercase," "Usernames must be at least 3 characters."

By treating your AI as a knowledgeable teammate who needs a clear brief, you'll get more accurate, relevant, and immediately usable code.

## Leverage Neon AI rules for optimized code

While large language models possess vast knowledge drawn from diverse sources, their default suggestions for database interactions might lean towards common, generic patterns. When working with a platform like Neon, relying solely on this general knowledge can lead to code that, while functional, isn't optimally leveraging Neon's features.

To ensure the AI generates code that is optimized, predictable, and leverages Neon's unique features, provide it with **[Neon AI Rules](https://github.com/neondatabase-labs/ai-rules)**. These rules are concise `.mdc` (markdown context) files that act like a specialized "style guide" for your AI, ensuring it understands how to best interact with Neon.

### Optimizing library usage with AI Rules

Consider setting up Drizzle ORM to interact with your Neon database.

*   **Scenario:** You're initializing Drizzle ORM in a Next.js project to connect to Neon.
*   **Your prompt to the AI:**
    ```
    Set up Drizzle ORM in my Next.js project to connect to my Neon Postgres database.
    ```

*   **No AI rules provided:**
    The AI might suggest using Drizzle with a standard `node-postgres` client, which may not work in serverless environments like Vercel edge functions or AWS Lambda:
    ```typescript
    import { drizzle } from 'drizzle-orm/node-postgres';
    export const db = drizzle(process.env.DATABASE_URL);
    ```

*   **With AI rules: `neon-drizzle.mdc` rule provided to AI:**
    
    By including the [AI Rule for Neon with Drizzle (`neon-drizzle.mdc`)](/docs/ai/ai-rules-neon-drizzle) in your AI tool's context, the AI is guided to use Neon's serverless driver with Drizzle ORM:

    ```typescript
    import { drizzle } from 'drizzle-orm/neon-http';
    import { neon } from '@neondatabase/serverless';

    const sql = neon(process.env.DATABASE_URL);
    export const db = drizzle(sql);
    ```

### How to use Neon AI rules?

1.  **Identify the Neon features** you're implementing (e.g., Drizzle ORM, serverless functions, authentication).
2.  **Add the corresponding `.mdc` rule files** to your AI tool's context.
    *   **Cursor:** Place files like `neon-drizzle.mdc` into your project's `.cursor/rules/` folder.
    *   **Other AI Tools (e.g., Claude, ChatGPT with context):** Copy the content of the rule file (from the [Neon AI Rules GitHub repo](https://github.com/neondatabase-labs/ai-rules)) and provide it as part of your prompt or as an included context file.
3.  **Prompt as usual:** Your AI will now be better equipped to generate Neon-optimized code.


### Available Neon AI rules

*   **Authentication (`neon-auth.mdc`):** Provides the AI with rules for effectively utilizing [Neon Auth](/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks), and integrating authentication via Stack Auth. Learn more: [AI Rules: Neon Auth](/docs/ai/ai-rules-neon-auth)
*   **Serverless driver usage (`neon-serverless.mdc`):** Provides the AI instructions and contextual examples for employing the Neon Serverless Driver. Learn more: [AI Rules: Neon Serverless Driver](/docs/ai/ai-rules-neon-serverless)
*   **Drizzle ORM Integration (`neon-drizzle.mdc`):** Provides the AI instructions and contextual examples for effectively using the Neon serverless driver with Drizzle ORM. Learn more: [AI Rules: Neon with Drizzle](/docs/ai/ai-rules-neon-drizzle)

By using Neon AI Rules, you significantly increase the likelihood that the AI consistently generates code aligned with Neon's architecture and best practices from the start of your project. This reduces the need for manual adjustments and ensures that the generated code is optimized for performance, security, and maintainability.

## Isolate AI experiments with Instant Neon branching

When AI suggests database schema changes or complex data migrations, testing them directly on your main development or production branch is risky. Neon's instant, copy-on-write **[branching](/branching)** allows you to create isolated database sandboxes in seconds, perfect for safely testing AI-generated code.

### Problem: Testing AI-generated schema changes directly is unsafe

Applying AI-suggested `ALTER TABLE` statements or migration scripts without thorough testing can lead to:
*   Data corruption in your production database.
*   Unexpected side effects on other parts of your application.
*  Rollbacks if issues arise.

### Solution: Use a dedicated Neon branch for each AI experiment

Before letting an AI apply database modifications, create a new branch. Test the changes in isolation, then discard or continue as needed.

**Workflow for safely testing AI-generated database changes:**

Let's say your AI suggests adding an `is_verified` column to your `users` table:

1.  **AI suggests a migration:**
    ```sql
    ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false;
    ```

2.  **Create a test branch (e.g., `feature/is_verified`):**
    You can create a branch using the Neon Console, CLI, or API.
    *   **Using Neon CLI:**
        ```bash
        neon branches create --project-id <your-project-id> --name feature/is_verified --parent production
        neon connection-string --project-id <your-project-id> feature/is_verified
        ```
        > This creates `feature/is_verified` from your `production` branch and outputs the connection string.

    *   **Using Neon console:** Navigate to your project > Branches > "Create Branch".

3.  **Apply AI's migration to the test branch:**
    Connect to the `feature/is_verified` branch (e.g., using `psql` or your ORM's migration tool by changing your environment variables) and apply the AI-generated SQL:
    ```sql
    ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false;
    ```

4.  **Test thoroughly on the isolated branch:**
    *   Run application tests that interact with the `is_verified` column.
    *   Check for any unintended data changes or performance issues.

5.  **Decide and act:**
    *   **If issues arise:** The `feature/is_verified` branch contains the problematic changes. Your `production` branch is unaffected.
        *   **Discard the branch:**
            ```bash
            neon branches delete --project-id <your-project-id> feature/is_verified
            ```
        *   Iterate with your AI on a new approach, creating a new test branch.
    *   **If Successful:** You have high confidence in the change.
        *   Apply the *same validated migration script* to your `production` (or staging) branch during a planned deployment.
        *   You can delete the temporary test branch.

### Benefits of using Neon branching for AI experiments

*   **Safety:** Your primary database remains untouched during experimentation.
*   **Isolation:** Each experiment runs in its own complete database copy.
*   **Confidence:** Thoroughly test AI suggestions before committing them.

Always create a dedicated Neon branch for testing AI-generated schema changes, data migrations, or complex features. This provides the isolation needed to experiment safely, validate thoroughly, and easily discard unsuccessful attempts, keeping your core database stable while you harness the speed of AI.

## Automate migration safety with Neon MCP server & Cursor

Instead of manually creating branches to test AI-generated migrations, the **[Neon MCP Server](/docs/ai/neon-mcp-server)**, when used with an MCP-compatible AI tool like **[Cursor](https://cursor.com/)**, automates this safety check directly within your chat workflow. Cursor, powered by the Neon MCP Server, will use a temporary Neon branch to test migrations and ask for your approval before applying them to your main branch.

**Example: Adding a column to `customers` via Cursor Composer with Neon MCP Server**

Let's walk through how Cursor and the Neon MCP Server handle a schema change request for an e-commerce application.

*   **Scenario:** In your `'ecom-prod'` Neon project, you want to add a nullable `last_ordered_at` timestamp column to your `customers` table to track when a customer last placed an order.

*   **Your interaction in Cursor Composer (with Neon MCP Server connected):**

    1.  **You (User):**
        ```
        In my Neon project 'ecom-prod', I need to add a new column to the 'customers' table.
        The column should be named 'last_ordered_at', it should be a timestamp with time zone, and it should allow NULL values for now.
        ```

    2.  **Cursor Composer (with Neon MCP server):**
        ```
        Cursor: Understood. I'll help you add a nullable 'last_ordered_at' timestamp column to your 'customers' table in the 'ecom-prod' project.

        > Called MCP Tool (prepare_database_migration)
        > I will now run the SQL to add the column on the temporary branch.
        > Now, let me verify the column was added correctly to the 'customers' table schema on the temporary branch.
        > Called MCP Tool (describe_table_schema using table 'customers' on temporary branch)
        > The 'last_ordered_at' column (TIMESTAMP WITH TIME ZONE, NULLABLE) has been successfully added to the 'customers' table in a temporary branch.
        > Temporary Branch Name: br-temp-migration-[some_hash]
        > Would you like to commit this migration to your main 'customers' table in the 'ecom-prod' project and then clean up the temporary branch?
        ```

    3.  **You (User):**
        ```
        Wait, let me run some tests on the temporary branch first. Please provide me with the connection string for the temporary branch.
        ```
    
    4.  **Cursor Composer:**
        ```
        Cursor: Sure! You can run your tests on the temporary branch. Here's the connection string:
        > Called MCP Tool (get_connection_string)
        > Connection String: neon://[your-connection-string-for-temporary-branch]
        > Here's the connection string for the temporary branch. You can use it to connect and run your tests.
        ```

    5. Once you run your tests, you can return to Cursor and let it know the results.

    6.  **You (User):**
        ```
        I ran my tests, and everything looks good. Please apply the migration to the main branch.
        ```

    7.  **Cursor Composer:**
        ```
        Cursor: Great. I will now apply the migration to your main branch in 'ecom-prod' and then clean up the temporary resources.
        > Called MCP Tool (complete_database_migration)
        > The migration has been successfully completed! The 'last_ordered_at' column has been added to your 'customers' table in the 'ecom-prod' project, and the temporary branch has been cleaned up.
        ```

### Getting started with Neon MCP Server

Follow the instructions in the [Neon MCP Server documentation](/docs/ai/neon-mcp-server) to set up the Neon MCP Server for your AI client. 

### Benefits of Using Neon MCP Server within your AI Tool

*   **Integrated safety:** The "test on a branch" best practice is built into the AI interaction, preventing accidental changes to your database.
*   **Transparency:** Tools like Cursor typically show the MCP tool calls, so you see what operations the AI is performing on your Neon project.
*   **User control:** You provide the final "go-ahead" before any changes are made to your main production (or development) branches.
*   **Reduced risk:** Minimizes the chance of applying AI-generated migrations that are flawed or have unintended consequences on critical tables.

## Database-level security for AI-generated applications

AI tools can accelerate feature development, but ensuring correct data authorization within AI-generated code is challenging. Relying on application-level checks for every query increases the risk of errors and data leaks.

### Problem: Application-level authorization is error-prone with AI

AI might generate code that forgets or incorrectly implements authorization checks:

*   **Typical application-level check:**
    ```typescript
    // Inside an API endpoint...
    async function getProject(projectId: string) {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("Unauthorized");

      // AI needs to remember to add this owner_user_id check every time and one mistake can expose data
      const query = `SELECT * FROM projects WHERE id = $1 AND owner_user_id = $2`;
      const { rows } = await db.query(query, [projectId, userId]);

      return rows;
    }
    ```
    Forgetting the `AND owner_user_id = $2` check exposes data.

### Solution: Define authorization policies directly in the database using Neon RLS

[Neon RLS](/docs/manage/neon-rls) leverages Postgres Row-Level Security (RLS) and integrates with JWT authentication providers (like Clerk, Auth0, etc.). Neon automatically validates the JWT and makes the user's ID available within SQL via the `auth.user_id()` function. You define policies that use this function to control row access centrally.

*   **Define RLS policy (example using drizzle):**
    Place RLS definitions alongside your schema (e.g., in `schema.ts`). Drizzle's `authUid` helper simplifies using `auth.user_id()`. (See [Simplify RLS with Drizzle](/docs/guides/neon-rls-drizzle)).
    ```typescript
    import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
    import { crudPolicy, authenticatedRole, authUid } from 'drizzle-orm/neon';

    export const projects = pgTable('projects', {
      id: uuid('id').primaryKey().defaultRandom(),
      name: text('name').notNull(),
      owner_user_id: uuid('owner_user_id').notNull(),
    },
    (table) => [
      // Apply RLS policy using Drizzle's crudPolicy and authUid helper
      crudPolicy({
        role: authenticatedRole,
        // Allow SELECT only if table's owner_user_id matches the JWT's user ID
        read: authUid(table.owner_user_id),
        // Allow INSERT/UPDATE/DELETE only if owner_user_id matches JWT user ID
        modify: authUid(table.owner_user_id),
      })
    ]);
    ```
    This policy ensures *any* query against `projects` automatically filters by the authenticated user's ID at the database level.

*   **Querying with RLS:**
    With the RLS policy handling authorization, your application code becomes simpler and safer. You can be rest assured that the database will only return rows the user is authorized to see.
    ```typescript
    async function getProject(projectId: string) {
      const authToken = await getAuthTokenFromProvider(); // Get JWT via your auth provider helper
      const db = drizzle(process.env.DATABASE_AUTHENTICATED_URL!);

      const result = await db
        .$withAuth(authToken) // Pass JWT to Neon via Drizzle helper
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.id, projectId)); // optional, even if not provided, RLS will filter by user ID

      return result;
    }
    ```

### Getting started with Neon RLS

1.  **Choose Auth provider:** Select a JWT provider (Clerk, Auth0, etc.) that uses asymmetric keys (JWKS). See [Supported providers](/docs/guides/neon-rls#supported-providers).
2.  Follow the [Neon RLS tutorial](/docs/guides/neon-rls-tutorial) to set up your database and define RLS policies.

By enforcing authorization at the database level with Neon RLS, you create a strong security backstop. Even if AI generates imperfect application code, RLS helps prevent unauthorized data access, making your AI-assisted development process significantly safer.

## Sequence deployments: Coordinate database and app changes

Applying AI-generated database migrations and application code changes requires careful ordering to avoid downtime or errors. Deploying code that expects a database change before it's live, or making a schema change restrictive before the app is ready, will break your application.

### Problem: Uncoordinated deployments cause runtime errors

*   **Example Failure:** Deploying application code that reads a new `users.last_login` column *before* the `ALTER TABLE ... ADD COLUMN last_login` migration has run will result in application errors.

### Solution: Use a multi-stage deployment strategy

Guide your AI (and your deployment process) through these distinct stages, especially when making potentially breaking changes like adding required columns.

**Example Workflow: Adding a Required `user_role` Column**

Assume you want to add a `user_role` (e.g., 'admin', 'member') to your `users` table and make it `NOT NULL`.

*   **Stage 1: Add Nullable Column (Backward-Compatible Schema Change)**
    Apply a migration that adds the new column but allows `NULL` values. This doesn't break existing code.
    *   **Migration SQL (Generated by AI or manually):**
        ```sql
        ALTER TABLE "users"
        ADD COLUMN "user_role" VARCHAR(50) NULL;
        ```
    *   **Deploy:** Apply this migration to your database. Existing application versions continue working.

*   **Stage 2: Deploy App v1 (Writes to New Column, Handles Nulls)**
    Deploy application code that:
    1.  Starts writing the `user_role` for new or updated users.
    2.  Can read users where `user_role` might be `NULL` (treats `NULL` as a default role, e.g., 'member').
    *   **Application Code Snippet (Conceptual):**
        ```typescript
        // Function to update user profile
        async function updateUser(userId, data) {
          const updateData = { ...data };
          // Start writing the new role if provided
          if (data.role) {
            updateData.user_role = data.role;
          }
          await db.update(users).set(updateData).where(eq(users.id, userId));
        }

        // Function to read user role
        function getUserDisplayRole(user) {
          // Handle cases where the role might still be NULL
          return user.user_role ?? 'member';
        }
        ```
    *   **Deploy:** Deploy this application code.

*   **Stage 3: Backfill Data (Optional but often needed for `NOT NULL`)**
    Run a script to populate the `user_role` for existing users who have `NULL`.
    *   **Backfill SQL:**
        ```sql
        UPDATE "users"
        SET "user_role" = 'member' -- Or determine role based on other data
        WHERE "user_role" IS NULL;
        ```
    *   **Deploy:** Run this SQL against your database.

*   **Stage 4: Deploy App v2:**
    Deploy application code that now assumes `user_role` is always present.
    *   **Application code snippet:**
        ```typescript
        // Function to read user role (simplified)
        function getUserDisplayRole(user) {
          // Assumes user_role is now always populated
          return user.user_role;
        }
        // Code creating users MUST now provide a user_role
        ```
    *   **Deploy:** Deploy this application code update.

*   **Stage 5: Make column `NOT NULL` (Forward-incompatible schema change)**
    Apply a final migration to enforce the `NOT NULL` constraint, now that all data is populated and the application expects it.
    *   **Migration SQL:**
        ```sql
        ALTER TABLE "users"
        ALTER COLUMN "user_role" SET NOT NULL;
        ```
    *   **Deploy:** Apply this migration to your database.

### Guiding your AI for phased rollouts

When using AI to generate migrations or application code, guide it through the phased rollout process. This ensures that each step is backward-compatible and that the application can handle changes gracefully. Guide your AI with prompts like:
*   First, generate the SQL to add a *nullable* `user_role` column to `users`.
*   Now, modify the user update function to write to `user_role` if provided, and update the display function to show 'member' if `user_role` is null.
*   Generate the SQL to set `user_role` to 'member' for all users where it's currently null.
*   Update the application code to assume `user_role` is never null.
*   Finally, generate the SQL to make the `user_role` column `NOT NULL`.

Adopting this phased rollout strategy minimizes deployment risks. Explicitly guide your AI through backward-compatible schema updates, application code adjustments, data backfills (if needed), and final schema enforcement to ensure your application remains stable and available throughout the update process.

## Use Point-in-time restore (PITR) for fast rollbacks

Even with careful sequencing, deployments can go wrong. An AI-generated application code might interact unexpectedly with the database, and introduce a bug corrupting data. In such cases, you need a reliable rollback strategy to revert to a known good state quickly.

### Problem: Traditional database rollbacks are slow and complex

Reverting a database to a previous state often involves restoring from `pg_dump` backups, which can take time and may not be granular enough. This can lead to extended downtime and potential data loss.

### Solution: Use Neon's instant PITR + application code revert
Neon's **[Point-in-Time Restore (PITR)](/blog/announcing-point-in-time-restore)** leverages the database's history (WAL) to instantly rewind a branch to *any second* within your retention period. Combine this with reverting your application code for a fast, safe rollback.

**Workflow for rolling back a failed deployment:**

Imagine an AI suggested an application code change that caused a bug in production.

1.  **Identify the issue & rollback point:**
    *   Confirm the deployment failure.
    *   Determine the time just *before* the bad deployment, e.g., **14:29:59 UTC**.

2.  **Verify pre-deployment State:**
    Use Neon's [Time Travel Assist](/docs/guides/time-travel-assist) to query the database state *as it was* at your chosen rollback time (14:29:59 UTC) *before* performing the actual restore.
    *   In Neon Console > Restore Tab:
        *   Select your `production` branch.
        *   Enter the timestamp (e.g., `YYYY-MM-DD 14:29:59 UTC`).
        *   Write a query: `SELECT COUNT(*) FROM orders;`
        *   Click **Run**.
        *   Verify the result matches your expectations (e.g., `1000` orders before the bad deployment).

3.  **Initiate database PITR:** Once confident in the timestamp, initiate the restore by clicking the **Proceed** button in the Neon Console.

4.  **Revert application code:**
    Simultaneously, roll back your application code to the version deployed *before* 14:30 UTC.
    *   **Example Git command:**
        ```bash
        # Find the commit hash before the bad deployment
        git log --before="YYYY-MM-DD 14:30:00 UTC" -n 1
        # Revert to the previous working state (or use your deployment system's rollback)
        git checkout <commit_hash_before_bad_deploy>
        # Re-deploy this application version
        ```

5.  **Verify system health:**
    *   Check application logs for errors.
    *   Run tests to ensure the application is functioning correctly.

### Why Neon PITR is ideal for AI-assisted development

*   **Speed:** Restores complete in seconds, minimizing downtime.
*   **Granularity:** Restore to any second within your history retention window.
*   **Confidence:** Enables faster iteration with AI tools knowing a reliable, fast recovery option exists.

Leverage Neon's Point-in-Time Restore as your primary database rollback strategy. When a deployment involving AI-generated changes goes wrong, use PITR to quickly revert the database state, coordinate it with deploying the corresponding application code version, and recover rapidly without significant data loss or complex manual interventions.

## Conclusion

Using AI tools to generate code can significantly speed up development, but it requires careful consideration of best practices to ensure reliability, security, and maintainability. By treating AI as a teammate, providing context, using Neon AI Rules, leveraging Neon Branching for safe testing, automating migration safety checks with the Neon MCP server, implementing database-level security with Neon RLS, coordinating migrations and deployments, and utilizing Point-in-Time Restore for rollbacks, you can utilize the power of AI while maintaining a robust and secure development process.

## Resources

- [Neon Auth is Here: Get Authentication in a Couple of Clicks](https://neon.tech/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks)
- [Instant Branching for Postgres](https://neon.tech/branching)
- [Neon's MCP Server is Here](https://neon.tech/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here)
- [Announcing Point-in-Time Restore](https://neon.tech/blog/announcing-point-in-time-restore)
- [Neon RLS](https://neon.tech/blog/introducing-neon-authorize)
