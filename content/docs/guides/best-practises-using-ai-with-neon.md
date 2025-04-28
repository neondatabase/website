---
title: Best Practices for using AI tools with Neon
subtitle: A comprehensive guide to using AI tools with Neon and how to make the most of them
enableTableOfContents: true
updatedOn: '2025-04-28T00:00:00.000Z'
---

Generating code with AI using natural language, often called "vibe coding," provides significant speed advantages for development, especially during prototyping. You describe what you need, and the AI generates the code.

However, the reliability needed for production applications, particularly when managing databases, user data, and authentication, requires more than just speed. AI code generation, while powerful, can sometimes overlook critical details, security considerations, or database best practices. Incorrect SQL, inefficient queries, or insecure patterns can arise if the AI lacks sufficient context or guidance.

Consider this guide a set of best practices for using AI tools with Neon. These practices are designed to help you leverage the power of AI while ensuring that your code is maintainable, secure, and efficient.


## Treat your AI like a teammate: Not a mind reader

You wouldn't onboard a new developer to your team by just giving them vague instructions and expecting perfect code. You would provide documentation, explain the project's architecture, point out existing patterns, and guide them towards the right libraries and tools.

Similarly, when you work with AI, you need to provide context. The AI is a powerful tool, but it doesn't have the same understanding of your project as you do. It doesn't know your database schema, your business logic, or your specific requirements unless you tell it. This is where the "mind reader" illusion can lead to problems. You might expect the AI to generate code that fits perfectly into your existing structure, but without context, it often produces generic or incorrect code.

But by shifting your approach, you can achieve far better results. The first step is providing context. Just as you would brief a new teammate, you need to give the AI the necessary background. Informing the AI about your specific stack, existing patterns, and constraints is crucial for it to generate relevant and useful code.

For instance, simply telling the AI you are using Drizzle ORM fundamentally changes how it should approach schema generation or query building. Instead of the vague "Create a table for users," a contextual prompt looks more like: "Using Drizzle ORM, define a schema for a users table with fields for `id` (auto-incrementing primary key), `name` (text, not null), and `email` (text, unique, not null)."

**The Vibe Coding Best Practice**: Treat your AI as a teammate, not a mind reader. Provide it with the context it needs to generate relevant and useful code. This includes your database schema, existing patterns, and specific requirements. The more context you provide, the better the AI can assist you.

## Give your AI Neon-specific rules

While large language models possess vast knowledge drawn from diverse sources, their default suggestions for database interactions might lean towards common, generic patterns. When working with a platform like Neon, relying solely on this general knowledge can lead to code that, while functional, isn't optimally leveraging Neon's features or adhering to its specific best practices (like using the Neon serverless driver in edge environments). The output can be less predictable and may require refinement.

This is where providing targeted guidance becomes invaluable. [Neon AI Rules](https://github.com/neondatabase-labs/ai-rules) serve as this specific direction. They are concise `.mdc` (markdown context) files that encapsulate best practices, patterns, and optimizations tailored for Neon. They don't necessarily introduce entirely new concepts to the AI, but rather ensure it prioritizes and correctly applies Neon-specific libraries, patterns, and optimizations that are crucial for efficient and maintainable code.

Think of it like providing a developer with the project's specific style guide. They likely know many ways to solve a problem, but the guide ensures they use the preferred, optimized way. By including Neon AI Rules, you significantly increase the likelihood that the AI consistently generates code aligned with Neon's architecture and best practices from the start.

Here are examples of how Neon AI Rules help steer the AI:

*   **Authentication (`neon-auth.mdc`):** Provides the AI with rules for effectively utilizing [Neon Auth](/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks), and integrating authentication via Stack Auth.
    - [AI Rules: Neon Auth (`neon-auth.mdc`)](/docs/ai/ai-rules-neon-auth)
*   **Serverless driver usage (`neon-serverless.mdc`):** Offers the AI instructions and contextual examples for employing the Neon Serverless Driver.
    - [AI Rules: Neon Serverless Driver (`neon-serverless.mdc`)](/docs/ai/ai-rules-neon-serverless)
*   **Drizzle ORM Integration (`neon-drizzle.mdc`):** Directs the AI's approach to implementing Drizzle ORM with Neon databases.
    - [AI Rules: Neon with Drizzle (`neon-drizzle.mdc`)](/docs/ai/ai-rules-neon-drizzle)

**The Vibe Coding Best Practice**: Use Neon AI Rules to provide the AI with specific guidance on how to work with Neon. These rules guide the AI towards producing functional, predictable, maintainable, and optimized code, substantially increasing the likelihood that the generated code will work as intended and streamline your development efforts.

## Create sandboxes on demand: Isolate AI experiments with Neon Branching

One of the biggest anxieties when moving fast – especially with code you didn't write yourself – is breaking something important. Imagine your AI suggests a significant refactor or a new feature that touches multiple parts of your database schema. How do you test it safely without jeopardizing your main development environment or, worse, production data? In traditional workflows, this often means laboriously setting up separate staging databases, and copying data – a process that grinds the rapid iteration promised by vibe coding to a halt.

This is where **[Neon Branching](/branching)** becomes a superpower for responsible AI-assisted development. Forget slow, cumbersome staging environments. Neon leverages its unique copy-on-write architecture to let you create fully independent, isolated copies of your *entire* database, including all its data, in literally seconds.

**How Branching Transforms Vibe Coding testing:**

Let's say your AI suggests a complex change, like adding a feature that requires altering tables and backfilling data:

1.  **Before applying:** Instead of running the AI's code against your main database branch, you instantly [create a dedicated branch](/docs/manage/branches#create-a-branch) (e.g., `ai_feature_test`) for this experiment.
2.  **Isolate the experiment:** Point your application to the new `ai_feature_test` branch's connection string.
3.  **Run the AI code:** Now, let the AI apply its generated migrations and run its proposed code against this isolated branch.
4.  **Test rigorously:** Thoroughly test the feature on the `ai_feature_test` branch. Does it work? Did it introduce any data inconsistencies? Did the migration apply correctly?
5.  **Iterate or merge:**
    *   **If it breaks:** No problem! The mess is contained within the `ai_feature_test` branch. You can simply [delete the branch](/docs/manage/branches#delete-a-branch) and try a different approach with the AI.
    *   **If it works:** Fantastic! You now have much higher confidence. You can plan to apply the *tested* migration scripts to your main branch and merge the corresponding application code.

**The Vibe Coding Best Practice:** Make branching an integral part of your AI-assisted workflow. **Never** let AI apply untested database modifications directly to your production branches. Always create a dedicated Neon branch for testing AI-generated schema changes, data migrations, or complex features. This provides the isolation needed to experiment safely, validate thoroughly, and easily discard unsuccessful attempts, keeping your core database stable while you harness the speed of AI.

## Automate migration safety checks with the Neon MCP Server

While AI assistants excel at generating code, including database migration scripts, applying these directly requires careful validation. Neon's instant branching makes it easy to manually create isolated environments for testing these AI-generated migrations, a crucial best practice we've already discussed. However, the **[Neon MCP Server](/docs/ai/mcp-server)** takes this a step further by **automating this test-on-a-branch workflow directly within your AI tool** (like Cursor, Claude, etc.), making it a seamless part of your development process.

The Neon MCP Server acts as an intelligent bridge, allowing AI tools (like [Claude Desktop](/guides/neon-mcp-server), [Cursor](/guides/cursor-mcp-neon), etc.) that support the Model Context Protocol to interact with Neon using natural language *and* specialized, safety-oriented "tools". For database migrations, the key tools are `prepare_database_migration` and `complete_database_migration`.

Here's how it enhances the process when you ask the AI to perform a schema change (e.g., "Add an `updated_at` column to the `orders` table"):

1.  **Automated branch creation (`prepare_database_migration`):** Instead of you manually creating a branch, the AI uses the `prepare_database_migration` tool. This triggers the Neon MCP server to automatically **leverage Neon's branching capability to create a fresh, temporary branch**.
2.  **Targeted execution & verification:** The Neon MCP server then directs the execution of the AI-generated migration SQL **specifically against this newly created temporary branch**. The AI can then follow up (or be prompted to) by running descriptive commands or test queries *against the same temporary branch* to verify the schema change and ensure its correctness, all without affecting your main database.
3.  **Controlled commit (`complete_database_migration`):** Once the AI (and you, reviewing its output) confirms the migration was successful in the isolated branch, you can approve the final step. The AI uses the `complete_database_migration` tool. The Neon MCP server then manages the process of applying the confirmed changes to your actual target branch and cleans up the temporary branch used for testing.

This automated workflow harnesses the power and safety of Neon's branching but makes it a seamless, integrated part of the AI-driven development process. The AI effectively uses a dedicated, temporary Neon branch as its sandboxed testing ground for every migration, orchestrated via the Neon MCP server.

**The Vibe Coding Best Practice:** For AI-driven database migrations, utilize tools connected via the Neon MCP server. This setup ensures that the best practice of testing migrations on an isolated branch is **automatically applied**, integrating safety checks directly into the conversational workflow and reducing the chance of applying unverified schema changes generated by the AI.

## Neon RLS: Database-level security for AI-generated applications

So, you're leveraging AI to accelerate development, building features and fetching data efficiently. But a critical challenge remains: ensuring users only see the data they're supposed to. How do you implement authorization reliably, especially when AI is generating significant portions of your application logic?

The common approach, and often the default an AI might suggest, involves embedding authorization checks directly into your application's data-fetching code. You end up with logic sprinkled throughout your backend:

```javascript
// Inside an API endpoint or server function...
const userId = getCurrentUserIdFromSession(); // App logic to get user ID
const query = `SELECT * FROM projects WHERE id = $1 AND owner_user_id = $2`; // <-- Auth check mixed with query
const { rows } = await db.query(query, [projectId, userId]);
// ... application logic to handle results or lack thereof
```

Now, consider scaling this with AI assistance. Can you be certain the AI will consistently remember to add the correct `AND owner_user_id = $2` clause (or more complex permission logic) every single time it generates code that accesses sensitive data? What happens when requirements change? Relying on just application-level checks, especially when generated or modified by AI, creates a significant risk surface. One missed `WHERE` clause can lead to critical data leaks.

Instead of scattering authorization logic across your application, a more robust approach is to define access rules directly within the database. Postgres Row-Level Security (RLS) provides precisely this mechanism. RLS allows you to create policies on your database tables that dictate which rows are visible or modifiable based on the context of the user making the query.

**Making RLS practical: Neon RLS and JWT integration**

While standard Postgres RLS is powerful, integrating it smoothly into modern web applications (which typically rely on JWTs for authentication) can involve managing complex session states or database roles. [Neon RLS](/blog/introducing-neon-authorize) simplifies this through built-in integration with popular authentication providers (like Clerk, Auth0, Stack Auth, and any asymmetric JWKS provider), automatically handling JWT verification.

**How it works:** When Neon RLS is enabled and configured with your provider, Neon can automatically validate the JWT sent with each database connection request. It extracts relevant user information (like `sub` for user ID, or custom claims for roles/permissions) and makes it available within the database session for your RLS policies to use.

**Why Neon RLS is a Vibe Coding Best Practice:**

*   **Less room for error:** Security is enforced by the database itself *before* any data is returned to the application. Even if your AI generates application code with flawed logic, RLS acts as a fundamental backstop, preventing unauthorized data access.
*   **Centralized authorization logic:** All your authorization rules are defined in one place (the database migrations), making them easier to manage and update. This is especially important when working with AI, as it reduces the risk of inconsistent or incomplete authorization checks in your application code.

## Sequence your moves: Coordinating migrations and deployments

When developing rapidly, especially with AI generating migration scripts or application code, it's easy to apply changes haphazardly. However, deploying database schema modifications, data migrations, and application code updates requires careful coordination. Simply asking your AI to "Add a `last_login` timestamp to the `users` table and update the profile page to show it" can lead to deployment chaos if the steps aren't executed in the correct order. The common pitfall is deploying application code that relies on a database change *before* that change is live, or applying a restrictive schema change (like making a column `NOT NULL`) before the application consistently provides data for it, resulting in runtime errors and frantic rollbacks.

Instead, treat database migrations and related application deployments like a carefully orchestrated multi-stage process. Each stage must complete successfully before the next begins. A robust sequence often starts with applying **backward-compatible schema changes**, such as adding a new `NULLABLE` column. This ensures existing application code continues functioning. Next, you deploy the **application code that is aware** of the new schema but doesn't require it yet, handling both old and new states gracefully and, importantly, starting to write to the new column.

Following this, you might perform any necessary **data backfills**, ensuring existing records conform to the new structure. Only then do you deploy application code that **relies** on the new schema element being present. Finally, if needed, you can apply **forward-incompatible schema changes**, like making the new column `NOT NULL` or removing old schema elements, now that the application no longer uses the previous state.

**The Vibe Coding Best Practice:** Adopt a phased rollout strategy for database and application changes. Guide your AI through backward-compatible schema updates, code deployments aware of (but not reliant on) changes, backfills, code reliance deployments, and finally, forward-incompatible schema cleanup. This structured approach minimizes deployment risk and ensures that your application remains stable throughout the process.

## Rewind time: Safe rollbacks with Neon PITR

Despite careful sequencing and testing, sometimes a problematic change—perhaps a subtly flawed migration script suggested by AI or a complex manual error—slips into production, causing application errors or data corruption. In these high-pressure moments, you need a fast, reliable way to revert *both* the application code and the database state. Traditional approaches like complex rollback migrations or restoring from slow, potentially outdated `pg_dump` backups often mean extended downtime and unacceptable data loss.

Neon's unique architecture, retaining a history of all database changes (the WAL), provides a powerful safety net: **[Point-in-Time Restore (PITR)](/blog/announcing-point-in-time-restore)**. Instead of complex manual reversals, you can treat the database's recent history as a timeline you can instantly rewind. If a bad migration impacts your production database, first identify the issue and determine the precise time *just before* the faulty migration was applied, perhaps using deployment logs or Neon's [Time Travel](/docs/guides/time-travel-assist) feature to query past states directly in the console. Then, execute the PITR operation from the Neon Console's **Restore** section, selecting the target timestamp. Neon completes the restore in **just a couple of seconds**, bringing the database state cleanly back to the desired point before the error occurred.

Crucially, this database rollback must be paired with **rolling back your application code** to the previous working version that corresponds to the restored database schema. Once both are reverted, verify the application's functionality and data integrity thoroughly. This streamlined process, facilitated by Neon's instantaneous PITR, transforms rollbacks from a high-risk, slow procedure into a fast, predictable recovery mechanism.

**The Vibe Coding Best Practice:** Leverage Neon's Point-in-Time Restore as your primary database rollback strategy. When a deployment goes wrong, use PITR to quickly revert the database state to a point just before the error, coordinated with deploying the corresponding application code version. This provides a critical safety net, giving you the confidence to iterate quickly with AI tools, knowing you have a robust and fast fallback for unforeseen issues without resorting to risky manual rollbacks or slow backup restores.

## Conclusion

Using AI tools to generate code can significantly speed up development, but it requires careful consideration of best practices to ensure reliability, security, and maintainability. By treating AI as a teammate, providing context, using Neon AI Rules, leveraging Neon Branching for safe testing, automating migration safety checks with the Neon MCP server, implementing database-level security with Neon RLS, coordinating migrations and deployments, and utilizing Point-in-Time Restore for rollbacks, you can utilize the power of AI while maintaining a robust and secure development process.

## Resources

- [Neon Auth is Here: Get Authentication in a Couple of Clicks](https://neon.tech/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks)
- [Instant Branching for Postgres](https://neon.tech/branching)
- [Neon's MCP Server is Here](https://neon.tech/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here)
- [Announcing Point-in-Time Restore](https://neon.tech/blog/announcing-point-in-time-restore)
- [Neon RLS](https://neon.tech/blog/introducing-neon-authorize)
