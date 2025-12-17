---
title: 'How to Use Neon MCP Server with GitHub Copilot in VS Code'
subtitle: 'Learn how to make GitHub Copilot your full-stack teammate'
author: boburmirzo
enableTableOfContents: true
createdAt: '2025-05-10T00:00:00.000Z'
updatedOn: '2025-05-10T00:00:00.000Z'
---

GitHub Copilot has changed how developers write code, but when combined with an [MCP](https://modelcontextprotocol.io/) (Model Copilot Protocol) server, it also connects your services. With MCP, Copilot can create database tables, understand your database schema and generate relevant code for your API, data models, or business logic.

In this guide, you'll learn how to use the [**Neon Serverless Postgres MCP server**](https://github.com/neondatabase-labs/mcp-server-neon) with **GitHub Copilot in VS Code** to build a sample REST API quickly. We'll walk through how to create an **Azure Function** that fetches data from a **Neon database**, all without writing a single line of code manually.

![GitHub Copilot with Neon MCP Server in VS Code demo](/docs/guides/github-copilot-neon-mcp-server/github-copilot-with-neon-mcp-server-demo.gif)

## From Code Generation to Database Management with GitHub Copilot

AI agents are no longer just helping write code—they’re creating and managing databases. When a chatbot logs a customer conversation, or a new region spins up in the Azure cloud, or a new user signs up, an AI agent can automatically create a database in seconds. No need to open a dashboard or call an API. This is the next evolution of software development: **infrastructure as intent**. With tools like database MCP servers, agents can now generate real backend services as easily as they generate code.

GitHub Copilot becomes your full-stack teammate. It can answer database-related questions, fetch your database connection string, update environment variables in your Azure Function, generate SQL queries to populate tables with mock data, and even help you create new databases or tables on the fly. All directly from your editor, with natural language prompts. Neon has a dedicated [MCP server](https://github.com/neondatabase-labs/mcp-server-neon) that makes it possible for Copilot to directly understand the structure of your Postgres database.

Let's get started with using the Neon MCP server and GitHub Copilot.

<Admonition type="important" title="Neon MCP Server Security Considerations">
The Neon MCP Server grants powerful database management capabilities through natural language requests. **Always review and authorize actions requested by the LLM before execution.** Ensure that only authorized users and applications have access to the Neon MCP Server.

The Neon MCP Server is intended for local development and IDE integrations only. **We do not recommend using the Neon MCP Server in production environments.** It can execute powerful operations that may lead to accidental or unauthorized changes.

For more information, see [MCP security guidance →](/docs/ai/neon-mcp-server#mcp-security-guidance).
</Admonition>

## What You'll Need

- Node.js (>= v18.0.0) and npm: Download from [nodejs.org](https://nodejs.org/).
- An Azure subscription ([create one](https://azure.microsoft.com/free/cognitive-services) for free)
- Install either the stable or Insiders release of VS Code:
  - [Stable release](https://code.visualstudio.com/download)
  - [Insiders release](https://code.visualstudio.com/insiders)
- Install the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot), [GitHub Copilot for Azure](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot), and [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions for VS Code
- [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=macos%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp)  (for local testing)

## Connect GitHub Copilot to the Neon MCP Server

### Create Neon Database

Visit the [Neon on Azure Marketplace](https://portal.azure.com/#view/Azure_Marketplace_Neon/NeonCreateResource.ReactView) page and follow the [Create a Neon resource](/docs/azure/azure-deploy#create-a-neon-resource) guide to deploy Neon on Azure for your subscription. Neon offers a [Free plan](/pricing) that provides more than enough resources to build a proof of concept or kick off a new startup project.

### Install the Neon MCP Server for VS Code

Neon MCP Server offers multiple options for connecting your VS Code MCP client to Neon.

#### Quick Setup (Recommended)

The fastest way to get started is with the [`neonctl init`](/docs/reference/cli-init) command, which automates OAuth authentication, API key creation, and VS Code configuration:

```bash
npx neonctl@latest init
```

This command authenticates via OAuth, creates an API key, and configures VS Code to connect to Neon's remote MCP server. Once complete, ask your AI assistant **"Get started with Neon"**.

#### Manual Remote Setup (OAuth)

Alternatively, you can manually configure the [Remote Hosted MCP Server option](https://github.com/neondatabase-labs/mcp-server-neon?tab=readme-ov-file#option-1-remote-hosted-mcp-server-preview). This setup requires no local installation or API key management.

In your project directory, create a new file named `.vscode/mcp.json` and add the following configuration:

```json
{
  "servers": {
    "Neon": {
      "url": "https://mcp.neon.tech/mcp",
      "type": "http"
    }
  },
  "inputs": []
}
```

<Admonition type="note">
By default, the Remote MCP Server connects to your personal Neon account. To connect to an organization's account, you must authenticate with an API key. For more information, see [API key-based authentication](/docs/ai/neon-mcp-server#api-key-based-authentication).
</Admonition>

Click on `Start` on the MCP server. A browser window will open with an OAuth prompt. Just follow the steps to give your VS Code MCP client access to your Neon account.

![Start Neon MCP Server in GitHub Copilot](/docs/guides/github-copilot-neon-mcp-server/github-copilot-start-neon-mcp-server.png)

## Generate an Azure Function REST API using GitHub Copilot

**Step 1:** Create an empty folder (ex: *mcp-server-vs-code*) and open it in VS Code.

**Step 2:** Open GitHub Copilot Chat in VS Code and [switch to Agent mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode). You should see the available tools.

![List Neon MCP Server tools in GitHub Copilot](/docs/guides/github-copilot-neon-mcp-server/github-copilot-neon-mcp-server-tools.png)

**Step 3:** Ask Copilot something like "_Create an Azure function with an HTTP trigger_”:

![Create an Azure function in GitHub Copilot](/docs/guides/github-copilot-neon-mcp-server/github-copilot-create-azure-functions.png)

Copilot will generate a REST API using Azure Functions in JavaScript with a basic setup to run the functions locally.

**Step 4:** Next, you can ask to list existing Neon projects:

![list existing Neon projects in GitHub Copilot](/docs/guides/github-copilot-neon-mcp-server/github-copilot-list-neon-mcp-server-tools.png)

**Step 5:** Try out different prompts to fetch the connection string for the chosen database and set it to the Azure Functions settings. Then ask to create a sample Customer table and so on. Or you can even prompt to create a new [database branch](/docs/introduction/branching) on Neon.

![Fetch data from Neon in GitHub Copilot](/docs/guides/github-copilot-neon-mcp-server/github-copilot-fetch-neon-connection-string.png)

**Step 6:** Finally, you can prompt Copilot to update the Azure functions code to fetch data from the table:

![Update Azure Functions in GitHub Copilot](/docs/guides/github-copilot-neon-mcp-server/github-copilot-update-azure-functions.png)

## Combine the Azure MCP Server

Neon MCP gives GitHub Copilot full access to your database schema, so it can help you write SQL queries, connect to the database, and build API endpoints. But when you add **[Azure MCP](https://github.com/Azure/azure-mcp?tab=readme-ov-file)** into the mix, Copilot can also understand your Azure services—like Blob Storage, Queues, and Azure AI.

You can run both **Neon MCP** and **Azure MCP** at the same time to create a full cloud-native developer experience. For example:

- Use **Neon MCP** for serverless Postgres with branching and instant scale.
- Use **Azure MCP** to connect to other Azure services from the same Copilot chat.

Even better: **Azure MCP is evolving**. In newer versions, you can spin up **Azure Functions and other services directly from Copilot chat**, without ever leaving your editor.

Copilot pulls context from both MCP servers, which means smarter code suggestions and faster development. You can mix and match based on your stack and let Copilot help you build real, working apps in minutes.

## Final Thoughts

With GitHub Copilot, Neon MCP server, and Azure Functions, you're no longer writing backend code line by line. It is so fast to build APIs. You're _orchestrating_ services with intent. This is not the future—it’s something you can use today.

## Resources

- [Neon on Azure](/docs/manage/azure)
- [Neon MCP Server](/docs/ai/neon-mcp-server)

<NeedHelp />
