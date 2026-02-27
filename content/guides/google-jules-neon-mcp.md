---
title: 'From Prompt to PR: Giving AI agents their own database with Google Jules and Neon'
subtitle: 'Learn how to use Google Jules and the Neon MCP server to spin up isolated database branches, enabling AI agents to safely build and test full-stack features'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-02-26T00:00:00.000Z'
updatedOn: '2026-02-26T00:00:00.000Z'
---

AI coding agents are increasingly capable of implementing multi-step changes across an application. However, full-stack features often require updates to stateful infrastructure such as databases.

Database schema changes introduce additional complexity. Without an isolated environment, agents may rely on assumptions about the schema, require manual local setup, or apply migrations directly to shared environments. These approaches slow development and increase risk.

A safer approach is to provide an isolated, reproducible database environment where the agent can apply schema changes, run migrations, and validate behavior without affecting staging or production systems.

This guide demonstrates how to create this workflow using [Google Jules](https://jules.google) (Google’s asynchronous coding agent) and the [Neon MCP Server](/docs/ai/neon-mcp-server). The result is an isolated sandbox for each feature, enabling safe, end-to-end implementation and testing.

With Neon’s instant [Database Branching](/branching), Jules can quickly spin up isolated, production-like environments on demand. It can branch databases, run migrations, adjust RLS policies all safely, without ever touching your production data. This means you can hand Jules a feature request, and it will autonomously build, test, and open a PR with zero risk to your live environment.

To demonstrate, we’ll walk through a real example: asking Jules to implement a feature request in an example app that requires updating the database schema. You’ll see how Jules leverages the Neon MCP server to create a new database branch and seamlessly execute the necessary migrations.

## Prerequisites

Before you begin, ensure you have the following:

- **Google Jules account:** An active Google Jules account linked to your GitHub workspace. You can create one at [jules.google](https://jules.google).
- **Neon account and project:** A Neon account with at least one active project. Sign up for a free account at [neon.new](https://neon.new).
- **Application repository using Neon:** A GitHub repository containing an application that uses your Neon project as its database. This is required because Google Jules integrates with your codebase through GitHub and needs access to your code to implement changes. Jules analyzes the repository and opens Pull requests directly. In this guide, we’ll use an example app called **SnippetHub**, but you can follow along with any of your own Neon-backed projects.
- **Vercel account (optional):** Required for [automatic preview deployments](#optional-enable-automatic-preview-deployments). This allows you to instantly verify changes end-to-end in a live, production-like environment, providing zero-risk verification of Jules' work before merging.

Use the following example repository if you want to follow along with the SnippetHub app.

<DetailIconCards>
    <a href="https://github.com/dhanushreddy291/code-snippet" description="Example app repository used in this guide. It’s a simple snippet management tool built with Next.js, Drizzle ORM, and Neon Auth. Jules will add a new feature to this app as part of the demo." icon="github">Example repository (SnippetHub)</a>
</DetailIconCards>

<Steps>

## Get your Neon API Key

To allow Google Jules to interact with your Neon database, you'll need to generate a Neon API Key.

1. Navigate to your Neon organization settings and click on the **API Keys** tab.
2. Click **Create new API Key** and give it a name (e.g., "Google Jules Integration").
   ![Create Neon API Key](/docs/manage/org_api_keys.png)
   > Choose org-wide API keys to ensure Jules can access all projects and branches.
3. Copy the generated API key to your clipboard. You'll need this in the next step to connect Jules to the Neon MCP server.

## Connect Jules to your GitHub repository

Before Jules can make changes to your codebase, you’ll need to connect it to your GitHub repository.

1. Go to [jules.google](https://jules.google).
2. If you haven’t connected your GitHub account yet, you’ll see a prompt to do so.
3. Follow the on-screen instructions to authorize Jules to access your GitHub repositories.

## Connect Jules to the Neon MCP server

Google Jules operates autonomously in the cloud. To give it the ability to interact with Neon, you need to connect it to the Neon MCP server using the API key you just generated.

1. Navigate to **Settings -> MCP** in the Jules dashboard.
2. Locate **Neon** in the list of available MCP integrations and click **Connect**.
   ![Jules MCP Integrations](/docs/guides/jules-mcp-integrations.png)
3. Paste your Neon API Key into the configuration field and click **Connect**.

Jules is now connected to the Neon MCP server. This means that whenever you ask Jules to perform database operations, it can use the MCP server to create branches, run migrations, and manage database state without any manual setup on your part.

## (Optional) Enable automatic preview deployments

For a complete end-to-end experience, you can configure Vercel to automatically deploy the changes Jules commits. By combining Vercel with the [Neon Vercel Integration](/docs/guides/vercel-managed-integration), every PR opened by Jules will get a live preview URL backed by its own isolated database branch.

This allows you to verify Jules' work in a real browser environment testing the full stack from UI to database without touching production data or setting up a local environment.

1. **Deploy to Vercel:** Connect your GitHub repository to a new Vercel project.
2. **Install the Neon Integration:** Go to the [Neon Vercel Integration](https://vercel.com/integrations/neon) page and click **Add Integration**.
3. **Enable Preview Branching:** During setup, ensure you select **Create a branch for every preview deployment**.

   Follow [Neon Vercel Integration](/docs/guides/vercel-managed-integration) for detailed instructions on configuring the integration.
   ![Vercel deployment configuration](/docs/guides/vercel_native_deployments_configuration.png)

### Entire workflow in action

After setup is complete, the workflow for implementing a feature with an isolated database branch is as follows:

1. **Request a feature**  
   You describe a new feature to Jules in natural language. For example: “Add a share button that generates a public link.”

2. **Create a dedicated database branch**  
   Jules creates a new Neon branch using the MCP server. The branch is isolated from production and can safely include schema updates, migrations, or RLS changes.

3. **Implement and validate changes**  
   Code changes and database migrations are applied to the isolated branch and verified.

4. **Open a Pull request**  
   Jules opens a PR in the GitHub repository with the updated code.

5. **Deploy a preview**  
   Vercel automatically creates a preview deployment for the PR.

6. **Connect the preview to a database branch**  
   The Neon Vercel integration creates a preview database branch and configures the required environment variables so the Vercel preview deployment uses it.

## Describe your feature to Jules

Navigate to the Jules dashboard and select your connected repository. In the chat interface, you can now describe the feature you want to implement.

The demo app **SnippetHub** is a simple tool for saving and organizing code snippets. Each snippet includes a title, description, code content, and is tied to a user. Currently, users can create, edit, and delete snippets, but all snippets remain private visible only to their creator.

We now want to add a **"Share Snippet"** feature. This will let users make a snippet public, generating a shareable link that anyone can view without authentication.

In the Jules chat interface, provide the following prompt:

```text shouldWrap
Add a "Share Snippet" feature to the app. Each snippet should have a share button that generates a unique public link. The link must be accessible without authentication, while non-shared snippets remain private.

Use the Neon project named `code-snippets`. Create and use a separate database branch specifically for this feature.
```

![Jules Feature Prompt](/docs/guides/jules-feature-prompt.png)

Click on the Send icon to assign the task to Jules.

Notice that no implementation details were given in the request. The feature was described at a product level, along with the instruction to use a separate database branch. The project name was provided so Jules knows which Neon project to interact with.

Based on this input, Jules determines the required application and database changes, creates a new Neon branch using the MCP server, and implements the feature end-to-end within an isolated environment.

## Watch Jules work autonomously

Once dispatched, Jules operates in the background. If you open the Jules execution logs, you can see the tool calls and actions it takes in real-time. Here’s a breakdown of the key steps Jules takes to implement the feature:

![Google Jules execution logs](/docs/guides/jules-execution-logs.png)

1. **Branch creation**  
   Jules creates a new branch in the Neon database for the `code-snippets` project using the MCP server. This branch is an exact copy of production but is completely isolated, allowing Jules to make any changes without risk.

2. **Code analysis**
   Jules analyzes the existing codebase to understand how snippets are currently stored, accessed, and rendered. It identifies the relevant database tables, API routes, and frontend components that will need to be modified.

3. **Update database schema**  
   Jules generates and applies the necessary database migrations to support the new "Share Snippet" feature.

4. **Implement feature**
   Jules updates the backend API routes to handle sharing logic, creates new frontend components for the share button and public snippet view, and ensures that the feature is fully functional within the isolated branch.

5. **Testing**
   Jules runs tests if any and verifies that the feature works as expected against the branched database.

6. **Open PR**
   Once implementation and testing are complete, Jules commits the changes and opens a Pull Request in the GitHub repository with a description of the changes made.

   ![PR opened by Jules](/docs/guides/jules-opened-pr.png)

7. **Preview deployment**
   If you have Vercel configured, a preview deployment is automatically created for the PR. The Neon Vercel integration creates a new database branch for the preview and sets the environment variables so the deployment uses it.

   ![Preview deployment in Vercel](/docs/guides/jules-vercel-preview.png)

## Review the PR and preview the changes

If Vercel preview deployments are enabled, the Pull request includes a preview URL. Open this URL to view the changes in a production-like environment. The preview deployment is connected to an isolated database branch, allowing full end-to-end testing without affecting production data.

You can also review the code changes in the PR.

### Request updates

If you find any issues or want to request changes, you can simply comment on the PR. Jules will receive the feedback and can make the necessary adjustments autonomously.

Example:

```text shouldWrap
@jules Please add a confirmation modal before generating the public link.
```

Jules will then update the code, run any necessary migrations on the branched database, and update the PR with the new changes. The preview deployment will also automatically update to reflect the latest code.

</Steps>

## Conclusion

As AI agents transition into fully autonomous software engineers, they require infrastructure that matches their speed and agility.

By combining **Google Jules** with **Neon's branchable database**, you eliminate the friction of stateful AI development. Every feature requested gets a clean, production-like database. Every PR acts as a safe sandbox for testing and iteration. This means you can confidently leverage AI agents to build complex, data-driven features without worrying about breaking production or managing local environments.

## Resources

- [Neon Database Branching](/branching)
- [Google Jules Documentation](https://jules.google/docs/)
- [Branching Authentication with Neon Auth](/docs/auth/branching-authentication)
- [Neon MCP Server](/docs/ai/neon-mcp-server)
- [Integrating Neon with Vercel](/docs/guides/vercel-overview)

<NeedHelp />
