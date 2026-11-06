---
title: 'Safe AI-powered schema refactoring with OpenAI Codex and Neon'
subtitle: 'Learn how to safely offload complex schema migrations to AI agents using OpenAI Codex and Neon’s database branching.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-03-04T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Refactoring a database schema, like splitting tables or dropping columns, is risky. Handing those operations to an AI coding agent raises the stakes: one wrong `DROP` statement or flawed migration in a shared environment can wipe out staging data and block your whole team.

To hand database refactoring to an agent safely, the agent needs a disposable copy of your database that mirrors production but can't affect it.

This guide combines the [**OpenAI Codex CLI**](https://developers.openai.com/codex/cli/) with the [**Neon MCP Server**](/docs/ai/neon-mcp-server) and Neon's instant [**database branching**](/docs/introduction/branching). Instead of working against a shared database or an assumed schema, Codex gets a private branch where it can write, test, and validate destructive migrations, such as splitting a bloated `users` table into separate `users` and `user_addresses` tables.

## Prerequisites

Before you begin, ensure you have the following:

- **OpenAI Codex CLI:** Installed on your system. Follow the instructions on the [Codex CLI install page](https://developers.openai.com/codex/cli/).
- **Neon account and project:** A Neon account with at least one active project. Sign up for a Free plan account at [console.neon.tech](https://console.neon.tech/signup).
- **Neon CLI:** Neon CLI installed and configured. Follow the [Neon CLI setup guide](/docs/cli/install).
- **Example application with Git repository:** Any application with a Git repository. This guide uses a Node.js app with Drizzle ORM (a simple ecommerce app) as an example, but you can follow along with your own codebase. The focus is the workflow for safe AI-driven migrations, not the specifics of the application.

<Steps>

## Step 1: Generate a Neon API key and set project context

To allow Codex to interact with your Neon database, you'll need to generate a Neon API key and configure your project context.

1. In the Neon Console, go to your organization's **Settings** > **API keys**.
2. Click **Create new** and give the key a name (for example, "Codex Integration").
   ![Create Neon API Key](/docs/manage/org_api_keys.png)
   > Select **Project-scoped** to restrict Codex's access to this specific project. Only organization admins can create project-scoped keys.
3. Copy the generated API key to your clipboard. You'll need this to authenticate the MCP server.
4. Set up your project context by running the following command in your terminal:
   ```bash
   neon link --org-id <your-org-id> --project-id <your-project-id> -y
   ```
   You can find your Neon project ID and organization ID in the [Neon Console](https://console.neon.tech/). This step writes a `.neon` file (and, by default, pulls the default branch's `DATABASE_URL` into a local `.env` file; add `--no-env-pull` to skip that) in your project directory, which OpenAI Codex uses to access details about your Neon project when making API calls to the MCP server.

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

Create a separate Neon branch dedicated to the development of this feature. Update the codebase accordingly to reflect the new schema design, and make sure all existing records are migrated into the new `user_addresses` table.

See .neon for project details.
```

## Step 4: Observe Codex executing the workflow

After receiving the prompt, Codex uses its connected tools to complete the request:

1. **Branch creation:** Codex uses the Neon MCP server to create a dedicated branch. Because Neon branches are copy-on-write, the branch is created instantly, and Codex can run destructive operations on it without touching production data or other developers' work.
   ![Codex creates a Neon branch](/docs/guides/codex-creates-neon-branch.png)

2. **Drizzle migrations:** Codex analyzes your current schema, updates the codebase, and generates the necessary Drizzle migration files to create `user_addresses`, migrate the data, and drop the old columns from `users`.
   ![Codex generates and applies Drizzle migrations](/docs/guides/codex-generates-drizzle-migrations.png)

3. **Applying changes & verification:** Codex automatically runs the migrations against the newly created Neon branch and modifies any Drizzle models or queries that relied on the old schema.
   ![Codex updates queries and verifies the new schema](/docs/guides/codex-updates-queries-verifies-schema.png)

If the SQL has a syntax error or a constraint violation during execution, it will fail harmlessly on the isolated branch. Codex can read the error, fix the migrations, and try again.

## Step 5: Test locally and create a PR

After Codex has finished development on its isolated database branch, the schema changes, backfilled data, and corresponding code changes are all confined to your new branch. You can now test the app locally using the database URL of this new branch.

If Codex indicated it created a branch with a specific ID (e.g., `br-nameless-cloud-123456`), you can retrieve its connection string using the [Neon CLI](/docs/cli):

```bash
neon connection-string <branch-id-or-name>
```

Set this connection string in your local environment variables to thoroughly test the application against the new schema.

When you're ready to bring those changes back into your codebase, use your standard Git flow to commit the Drizzle migrations and codebase updates, and open a pull request to your main branch.

When your CI/CD pipeline runs this migration against `main`, it has already run successfully against a branch that started as a copy of your production data.

</Steps>

## Clean up

Once your PR is merged and the migration is applied to production, the experimental database branch is no longer needed. You can locate and delete this branch directly in the Neon Console, or ask Codex to clean up after itself:

```text shouldWrap
We've merged the changes. Please delete the Neon branch you created for this task.
```

Codex will then use the MCP server to delete the branch it created.

## Conclusion

You gave Codex an isolated Neon branch, through the Neon MCP Server, where it generated, ran, and fixed Drizzle migrations before any of them reached production. You review the result in a pull request and merge only when you're confident. As a next step, add [Neon branching to your CI pipeline](/docs/guides/branching-github-actions) so every pull request gets its own branch.

## Resources

- [Neon database branching](/branching)
- [Neon MCP Server documentation](/docs/ai/neon-mcp-server)
- [OpenAI Codex CLI documentation](https://developers.openai.com/codex/cli/)
- [Testing queries with Neon branching](/docs/guides/branching-test-queries)

<NeedHelp />
