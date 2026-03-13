---
title: 'Safe AI-powered schema refactoring with OpenAI Codex and Neon'
subtitle: 'Learn how to safely offload complex schema migrations to AI agents using OpenAI Codex and Neon’s database branching.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-03-04T00:00:00.000Z'
updatedOn: '2026-03-04T00:00:00.000Z'
---

Refactoring a database schema like splitting tables or dropping columns is inherently risky. When you introduce an AI coding assistant to handle these complex operations autonomously, the stakes get even higher. One wrong `DROP` statement or flawed migration in a shared environment can easily wipe out critical staging data and block your entire team's workflow.

To safely offload database refactoring to AI, the agent needs a completely disposable playground that mirrors reality but affects nothing.

This guide walks through how to achieve this workflow by combining the [**OpenAI Codex CLI**](https://developers.openai.com/codex/cli/) alongside the [**Neon MCP Server**](/docs/ai/neon-mcp-server). Rather than risking shared databases or relying on assumed schemas, you will combine Codex with Neon's instant [**Database Branching**](/docs/introduction/branching).

By bridging your local development environment with isolated database branches, Codex gets a private sandbox to write, test, and validate destructive migrations such as taking a bloated `users` table and successfully normalizing it into separate `users` and `user_addresses` tables.

## Prerequisites

Before you begin, ensure you have the following:

- **OpenAI Codex CLI:** Installed on your system. Follow the instructions on the [Codex CLI install page](https://developers.openai.com/codex/cli/).
- **Neon account and project:** A Neon account with at least one active project. Sign up for a free account at [console.neon.tech](https://console.neon.tech/signup).
- **Neon CLI:** Neon CLI installed and configured. Follow the [Neon CLI setup guide](/docs/reference/neon-cli#install).
- **Example application with Git repository:** Any application with a Git repository. This guide uses a Node.js app with Drizzle ORM (a simple ecommerce app) as an example, but you can follow along with your own codebase. The emphasis here is on demonstrating the workflow for safe AI-driven migrations rather than the specifics of the application.

<Steps>

## Step 1: Generate a Neon API Key and set project context

To allow Codex to interact with your Neon database, you'll need to generate a Neon API Key and configure your project context.

1. Navigate to your Neon organization settings and click on the **API Keys** tab.
2. Click **Create new API Key** and give it a name (e.g., "Codex Integration").
   ![Create Neon API Key](/docs/manage/org_api_keys.png)
   > Choose a **project-scoped** API key to restrict Codex's access to this specific project.
3. Copy the generated API key to your clipboard. You'll need this to authenticate the MCP server.
4. Set up your project context by running the following command in your terminal:
   ```bash
   neon set-context --project-id <your-project-id> --org-id <your-org-id>
   ```
   You can find your Neon Project ID and Organization ID in the [Neon Console](https://console.neon.tech/). This step generates a `.neon` file in your project directory, which OpenAI Codex uses to access details about your Neon project when making API calls to the MCP server.

## Step 2: Configure the Neon MCP server

Codex natively supports the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/), allowing it to interact with external tools. By connecting Codex to the Neon MCP server, you give it the ability to create database branches, run SQL, and analyze schemas using natural language.

To add Neon's MCP server, add the following to your project's root folder in a file named `.codex/config.toml`:

```toml
[mcp_servers.neon]
url = "https://mcp.neon.tech/mcp"
bearer_token_env_var = "NEON_API_KEY"
```

For the MCP server to authenticate with Neon, you need to set your Neon API key as an environment variable before running Codex:

```bash
export NEON_API_KEY=<your_neon_api_key>
```

Then, run Codex by entering the following command in your terminal:

```bash
codex
```

If you are prompted that the folder is trusted, say yes.

## Step 3: Prompt Codex for schema refactoring

For this example, you will ask Codex to take a denormalized `users` table and refactor it into a normalized design by creating a new `user_addresses` table. This involves generating Drizzle migrations to create the new table, backfill data, and drop the old address columns from `users`. You do not want Codex to perform these operations directly on your production database, so you will ask it to create a separate Neon branch for this work.

Within the Codex CLI, enter the following prompt:

```text shouldWrap
We need to normalize our database schema. Currently, the `users` table includes address related fields (`street`, `city`, `state`, `zip`). These should be extracted into a new `user_addresses` table to improve structure and maintainability.

All schema changes including migrations, backfilling of data, and dropping of columns must be implemented using Drizzle to ensure reproducibility and consistency.

Create a separate Neon Branch dedicated to the development of this feature. Update the codebase accordingly to reflect the new schema design, and ensure that all existing records are migrated seamlessly into the new `user_addresses` table.

See .neon for project details.
```

## Step 4: Observe Codex executing the workflow

After receiving the prompt, Codex will autonomously use its connected tools to complete the request:

1. **Branch creation:** Codex uses the Neon MCP server to create a dedicated branch. Because Neon uses a copy-on-write architecture, this branch is created instantly and provides a complete sandbox for Codex to execute potentially destructive operations without any risk to production data or other developers.
   ![Codex creates a Neon branch](/docs/guides/codex-creates-neon-branch.png)

2. **Drizzle migrations:** Codex analyzes your current schema, updates the codebase, and generates the necessary Drizzle migration files to create `user_addresses`, migrate the data, and drop the old columns from `users`.
   ![Codex generates and applies Drizzle migrations](/docs/guides/codex-generates-drizzle-migrations.png)

3. **Applying changes & verification:** Codex automatically runs the migrations against the newly created Neon branch and modifies any Drizzle models or queries that relied on the old schema.
   ![Codex updates queries and verifies the new schema](/docs/guides/codex-updates-queries-verifies-schema.png)

If the SQL has a syntax error or a constraint violation during execution, it will fail harmlessly on the isolated branch. Codex can autonomously analyze the error, fix the migrations, and try again.

## Step 5: Test locally and create a PR

After Codex has finished development on its isolated database branch, the new schema drift, backfilled data, and corresponding code changes are all confined to your new branch. You are now free to test the app locally using the database URL of this new branch.

If Codex indicated it created a branch with a specific ID (e.g., `br-nameless-cloud-123456`), you can easily retrieve its connection string using the [Neon CLI](/docs/reference/neon-cli):

```bash
neon connection-string --branch-id <branch-id>
```

Set this connection string in your local environment variables to thoroughly test the application against the new schema.

When you're ready to bring those changes back into your codebase, use your standard Git flow to commit the Drizzle migrations and codebase updates, and create a Pull Request to your main branch.

When your CI/CD pipeline runs this migration against `main`, you know it will succeed because it has already been validated in a perfectly mirrored prodction-like environment.

</Steps>

## Clean up

Once your PR is merged and the migration is applied to production, the experimental database branch is no longer needed. You can locate and delete this branch directly in the Neon Console, or ask Codex to clean up after itself:

```text shouldWrap
We've merged the changes. Please delete the Neon branch you created for this task.
```

Codex will then use the MCP server to delete the branch it created.

## Conclusion

AI agents can speed up development, but database schema changes often carry risks that make teams cautious. Using the **OpenAI Codex** together with **Neon’s database branching** provides a safe, isolated environment for AI to autonomously generate and test complex schema migrations.

With Neon, you can give the AI a production like sandbox to develop and validate its changes, allowing you to review the results safely, and promote changes only when you’re confident. This approach makes schema refactoring a manageable, routine task rather than a stressful operation.

## Resources

- [Neon Database Branching](/branching)
- [Neon MCP Server Documentation](/docs/ai/neon-mcp-server)
- [OpenAI Codex CLI Documentation](https://developers.openai.com/codex/cli/)
- [Testing queries with Neon Branching](/docs/guides/branching-test-queries)

<NeedHelp />
