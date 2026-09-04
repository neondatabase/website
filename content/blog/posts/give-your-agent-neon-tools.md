---
title: Give your agent Neon tools
description: >-
  @neon/tools now publishes the Neon SDK as typed agent tools. Plus, the Neon
  MCP Server now exposes far more of the API
excerpt: >-
  Today we're launching @neon/tools, a package that turns the @neon/sdk
  ergonomic client into typed agent tools with adapters for MCP, Mastra, and
  Eve. We're also using it to expand the hosted Neon MCP Server.
date: '2026-09-03T12:00:00'
updatedOn: '2026-09-03T15:00:00'
category: product
categories:
  - product
authors:
  - andre-landgraf
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: Give your agent Neon tools - Neon
  description: >-
    @neon/tools now publishes the Neon SDK as typed agent tools. Plus, the Neon
    MCP Server now exposes far more of the API
  keywords: []
  noindex: false
  ogTitle: Give your agent Neon tools - Neon
  ogDescription: >-
    @neon/tools now publishes the Neon SDK as typed agent tools. Plus, the Neon
    MCP Server now exposes far more of the API
  image: null
---

**Today we're launching** `@neon/tools`**, a package that turns the** `@neon/sdk` **ergonomic client into typed agent tools with adapters for MCP, Mastra, and Eve. We're also using it to expand the hosted** [Neon MCP Server](https://neon.com/docs/ai/neon-mcp-server)**, which now exposes 82 Management API tools (68/82 are new) alongside its 19 hand-written tools for SQL, migrations, diagnostics, docs, and search.**

If you build agent platforms or your own agents, you can now select the Neon operations you need and hand them to a model as tools, without writing the schemas, retries, and workflows by hand:

```
npm install @neon/tools
```

<iframe loading="lazy" title="Give your agent Neon tools" width="500" height="375" src="https://www.youtube.com/embed/BqRhBq-_kgE?feature=oembed" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen=""></iframe>

## Rethinking generated agent tools, one year later

About a year ago, we wrote that [turning an OpenAPI spec directly into an MCP server](https://neon.com/blog/autogenerating-mcp-servers-openai-schemas) was a shaky default. What has changed?

Back then, we identified two problems:

1. First, tool definitions took up context. A large API could put hundreds of schemas into the prompt before the model read the user's request. Similar names and descriptions also made it harder for the model to select the right tool.
2. Second, a raw REST operation is not automatically a good agent tool. REST APIs describe resources and requests. Agents are trying to finish tasks. A 1:1 mapping gives you coverage, but not the waiting, workflows, or names that make a tool usable.

MCP hosts and model providers have since moved toward progressive tool discovery. The host searches a catalog first, then loads the full tool schema only when the model needs it. The [MCP client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices) describe the flow as search, inspect, execute. That makes larger tool catalogs practical, and it solves the first problem.

The second problem remains. Neon is an infrastructure provider, and our REST API is not as straightforward as a CRM API where you create, update, and delete a contact in one call. You provision infrastructure, poll operations until resources are ready, and often chain several requests before you have something usable. Creating a project might look like: create project → `operationId` → poll operations → project ready → fetch connection string.

A generated schema can describe a request body, but it does not decide:

- whether a create call should wait until the resource is ready
- whether the result should include a connection string
- whether a list call should follow every page
- which low-level operations should stay hidden
- when several API calls should become one workflow
- which tool names and descriptions help a model choose correctly

Those are product decisions. A spec cannot make them for you.

Traditional deterministic code generation gets you raw methods, but that only gets you so far. Not the best developer experience, and not the best agent experience either. So we layered on top of the spec instead.

The [Neon OpenAPI spec](https://neon.com/api_spec/release/v2.json) code-generates typed fetch functions and Zod request schemas. [`@neon/sdk`](/blog/neon-sdk) exposes those as a raw layer you can use directly, and adds `createNeonClient()`: a higher-level ergonomic client written with AI assistance, then reviewed and checked in. `@neon/tools` builds on that same ergonomic layer to publish agent tools.

Two pipelines run in parallel from the same spec:

1. OpenAPI spec → code generation → `@neon/sdk` raw methods → coding-agent-authored layer → `createNeonClient()`
2. OpenAPI spec → code generation → `@neon/tools` Zod request schemas → ergonomic client → agent tools

The mechanical layers regenerate on every spec pull. The DX and AX layers do not. A spec refresh does not add `projects.createAndConnect` or an MCP tool. Someone has to decide that wrap.

`@neon/tools` is the agent-facing end of that pipeline.

<EmbedTweet url="https://x.com/rhyssullivan/status/2093466930078536130?s=46" />

## Building @neon/tools

`@neon/tools` sits on top of that layered pipeline. Each step adds a contract the layer below does not have. The mechanical layers regenerate. The DX and AX layers do not.

### OpenAPI gives us complete coverage

The [Neon OpenAPI spec](https://neon.com/api_spec/release/v2.json) is the source for the raw SDK. This is the true codegen layer: it turns 169 operations into typed fetch functions and Zod request schemas.

This layer stays close to HTTP. It gives us complete API coverage and catches drift, but it does not decide what makes a good method for developers or agents.

### Adding an ergonomic client

[`@neon/sdk`](/blog/neon-sdk) is our zero-dependencies, fetch-based API client SDK. [`createNeonClient()`](https://neon.com/docs/reference/typescript-sdk) lives in that package and groups common operations into namespaces such as `projects`, `branches`, `postgres`, `snapshots`, `storage`, `functions`, and `auth`. It also adds behavior that the OpenAPI operation does not carry on its own:

- automatic pagination for list methods
- retries and typed errors
- readiness polling for asynchronous operations
- composed methods such as `projects.createAndConnect`, `branches.resetFromParent`, and `branches.compareSchema`

The raw layer still covers every API endpoint. The ergonomic client is not regenerated from the spec. It wraps the methods and workflows we want to support as a deliberate interface, written with AI assistance, then reviewed and checked into the repo.

### Turning SDK methods into agent tools

`@neon/tools` takes the generated Zod request schemas from the same OpenAPI spec, binds them to the ergonomic client, and publishes the result as agent tools. You select tools by SDK path:

```
import { createNeonTools } from "@neon/tools";
```

```
const apiKey = process.env.NEON_API_KEY;
if (!apiKey) throw new Error("NEON_API_KEY is required");
```

```
const tools = createNeonTools({
  apiKey,
  tools: [
    "projects.list",
    "projects.createAndConnect",
    "branches.createAndConnect",
    "branches.resetFromParent",
    "branches.compareSchema",
  ],
});
```

```
const listed = await tools["projects.list"].execute({ limit: 10 });
```

```
const created = await tools["projects.createAndConnect"].execute({
  name: "agent-project",
  region_id: "aws-us-east-1",
});
```

The record stays keyed by SDK path, which makes it clear which client method the tool calls. Each tool also gets a model-facing snake-case ID. For example:

- `projects.list` becomes `list_projects`
- `projects.createAndConnect` becomes `create_and_connect_projects`
- `postgres.roles.resetPassword` becomes `reset_password_postgres_roles`

Inputs are flat and use snake case at the tool boundary. List tools follow pagination and return the item array. Write tools set `waitForReadiness: true`, so a project or branch create call waits for its operations to finish before the tool resolves.

The distinction between create methods is explicit:

- `projects.create` and `branches.create` return the created resource without a connection string
- `projects.createAndConnect` and `branches.createAndConnect` wait for readiness and return a connection string
- `branches.create` attaches a read-write compute by default; `no_compute: true` skips it

Some SDK methods stay out of the tool catalog on purpose. Waiting is already part of write tools, raw role-password retrieval should not be a model-facing operation, and downloading an object as binary data is not a useful JSON tool response.

## The same catalog now powers Neon MCP

We built `@neon/tools` in part to expand the hosted [Neon MCP Server](https://neon.com/docs/ai/neon-mcp-server). The expanded surface includes:

- project updates, recovery, members, permissions, regions, and operations
- branch, Postgres role, and database management
- compute endpoint lifecycle operations
- snapshot creation, schedules, and restore
- Managed Better Auth providers, trusted domains, and users
- Data API configuration
- Functions deployment and management
- Object Storage buckets, objects, and presigned URLs

The server still keeps 19 hand-written host tools. These cover jobs that do not map cleanly to one Management API method: running SQL, inspecting a database, preparing and completing safe migrations, tuning queries, searching resources, fetching docs, listing organizations, and getting a connection string.

This is still the hybrid model [we argued for in 2025](https://neon.com/blog/autogenerating-mcp-servers-openai-schemas):

- Use generated schemas and shared runtime behavior for broad Management API coverage.
- Keep opinionated tools for tasks where the agent needs a workflow, not an HTTP operation.

The hosted server does not register the package catalog unchanged. It selects the tools, keeps familiar MCP names such as `describe_project` and `create_branch`, applies OAuth grants and category scopes, injects project context, overrides descriptions, and sanitizes results.

That host layer matters. The same `projects.get` SDK method publishes as `get_projects` by default in `@neon/tools`, but the Neon MCP Server keeps the existing `describe_project` name. A project-scoped MCP session can remove `project_id` from a schema and inject the granted project at execution time. Read-only mode removes write tools before the model can call them.

The server covers 12 categories: projects, branches, endpoints, snapshots, schema, querying, Managed Better Auth, Data API, observability, docs, Functions, and Object Storage. An unfiltered connection exposes every category. Clients that need a narrower surface can select categories in the URL:

```
https://mcp.neon.tech/mcp?category=projects&category=branches&category=endpoints&category=querying&category=schema
```

You can also scope the connection to one project or make it read-only:

```
https://mcp.neon.tech/mcp?projectId=<project-id>&readonly=true
```

## Safety stays with the host

Every non-read operation in `@neon/tools` is conservatively marked as requiring approval. Reads that return connection credentials also require approval. The MCP adapter publishes standard annotations plus `neon/requiresApproval` metadata; Mastra and Eve receive their native approval fields.

Those annotations are advice to the host. The protocol does not enforce approval by itself.

The hosted Neon MCP Server adds its own controls:

- OAuth or API-key authentication
- read-only mode
- project-scoped grants
- category filtering
- project and branch ID injection
- result sanitization
- fixed model-facing names and descriptions

## With native adapters for MCP, Mastra, and Eve

`@neon/tools` publishes the same descriptors through three adapters:

### MCP

`@neon/tools/mcp` registers a selected tool catalog with an MCP 2.x server. An MCP 1.x entry point is available at `@neon/tools/mcp-v1`.

```
import { McpServer } from "@modelcontextprotocol/server";
import { createNeonTools } from "@neon/tools";
import { registerNeonTools } from "@neon/tools/mcp";
```

```
const server = new McpServer({ name: "neon", version: "1.0.0" });
const tools = createNeonTools({
  apiKey: process.env.NEON_API_KEY!,
  tools: ["projects.list", "projects.createAndConnect"],
});
```

```
registerNeonTools(server, tools);
```

The hosted Neon MCP Server uses `createNeonTools()` directly and adds its own registration and access-control layer. `registerNeonTools()` is for teams building their own MCP server.

### Mastra

[Mastra](https://mastra.ai/) is a TypeScript framework for building agents, tools, workflows, memory, and observability. The adapter maps Neon approval requirements into Mastra's `requireApproval` field and forwards its abort signal.

```
import { createTool } from "@mastra/core/tools";
import { createNeonTools } from "@neon/tools";
import { toMastraTools } from "@neon/tools/mastra";
```

```
const neonTools = createNeonTools({
  apiKey: process.env.NEON_API_KEY!,
  tools: ["projects.list", "projects.createAndConnect"],
});
const configs = toMastraTools(neonTools);
```

```
const listProjects = createTool(configs.list_projects);
const createProject = createTool(configs.create_and_connect_projects);
```

### Eve

[Eve](https://eve.dev/) is Vercel's durable agent framework. Its tools live as files under `agent/tools/`, and the filename becomes the model-facing name. The adapter maps approval requirements to Eve's `approval` hook and forwards its abort signal.

```
// agent/tools/create_and_connect_projects.ts
import { defineTool } from "eve/tools";
import { createNeonTool } from "@neon/tools";
import { toEveTool } from "@neon/tools/eve";
```

```
export default defineTool(
  toEveTool(
    createNeonTool("projects.createAndConnect", {
      apiKey: process.env.NEON_API_KEY!,
    }),
  ),
);
```

## Getting started

We've treated agents as a first interface to Neon since we [shipped our MCP server](https://neon.com/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here) in December 2024. `@neon/tools` is the latest layer of that work.

Start building:

- **Use the hosted Neon MCP Server** when you want a coding agent or MCP client to operate your Neon project. It includes OAuth, scopes, SQL and migration workflows, documentation search, and the expanded Management API catalog. The [Neon MCP Server reference](https://neon.com/docs/ai/neon-mcp-server) covers categories, access controls, and setup.

```
npx neon@latest mcp
```

- **Use** `@neon/tools` when you are building an agent platform or embedding Neon tools inside your own agent runtime. Select only the SDK methods the agent needs, then use the descriptors directly or convert them to MCP, Mastra, or Eve. The `@neon/tools` [README](https://github.com/neondatabase/neon-pkgs/tree/main/packages/tools) has the full selector list and current examples.

```
npm install @neon/tools
```

```
npx neon skills -s neon-postgres-agent-platforms
```
