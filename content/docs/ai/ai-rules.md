---
title: AI rules and prompts
subtitle: Enhance your AI development experience with Neon-specific context rules
summary: >-
  Covers the setup of AI context rules for Neon, including installation
  instructions for the Claude Code plugin and individual context rule files for
  other AI tools, enhancing code suggestions and reducing errors.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.726Z'
---

Boost your productivity with AI context rules for Neon. These rules help AI assistants understand Neon's features, leading to more accurate code suggestions and fewer common mistakes.

If you're using **Claude Code**, install the comprehensive Neon plugin that bundles Skills, MCP integration, and all context rules in one package. For other AI tools like **Cursor**, use the individual `.mdc` context rule files.

<Admonition type="note" title="AI Rules are in Beta">
AI Rules are currently in beta. We're actively improving them and would love to hear your feedback. Join us on [Discord](https://discord.gg/92vNTzKDGp) to share your experience and suggestions.
</Admonition>

## For Claude Code

If you're using Claude Code, install the Neon plugin to get Skills, MCP integration, and all the context rules in one package:

<DetailIconCards>

<a href="/docs/ai/ai-claude-code-plugin" description="Install the Neon Claude Code plugin to give Claude access to Neon's APIs, Postgres workflows, and built-in Skills" icon="github">Claude Code plugin for Neon</a>

</DetailIconCards>

## Individual AI rules

For other AI tools like Cursor, you can use these individual `.mdc` context rule files. Copy them to your AI tool's custom rules directory — the format is tool-agnostic and works with any AI assistant that supports context rules.

<DetailIconCards>

<a href="/docs/ai/ai-rules-neon-auth" description="AI rules for implementing authentication with Neon" icon="lock-landscape">Neon Auth</a>

<a href="/docs/ai/ai-rules-neon-serverless" description="AI rules for serverless database connections" icon="network">Neon Serverless Driver</a>

<a href="/docs/ai/ai-rules-neon-drizzle" description="AI rules for using Drizzle ORM with Neon" icon="drizzle">Neon Drizzle</a>

<a href="/docs/ai/ai-rules-neon-typescript-sdk" description="AI rules for using the Neon API TypeScript SDK" icon="code">Neon API TypeScript SDK</a>

<a href="/docs/ai/ai-rules-neon-python-sdk" description="AI rules for using the Neon Python SDK" icon="code">Neon Python SDK</a>

<a href="/docs/ai/ai-rules-neon-api" description="AI rules for using the Neon API" icon="code">Neon API</a>

<a href="/docs/ai/ai-rules-neon-toolkit" description="AI rules for using the Neon Toolkit" icon="database">Neon Toolkit</a>

</DetailIconCards>

## How it works

AI rules are `.mdc` files that specify which types of files they apply to (such as `*.tsx` or `schema.sql`). When you're working with a matching file, your AI tool automatically applies the relevant rules to provide better suggestions.

### Example: AI rules in action

Here's a practical example using [Cursor](https://www.cursor.so). A developer has implemented authentication in their server-rendered page and wants to confirm best practices:

**Developer query**: _"Using the neon-auth.mdc rule, how do I secure a server-rendered page?"_

![Screenshot of Cursor applying the neon-auth.mdc rule](/docs/ai/ai-rules.png)

The AI confirms that using `stackServerApp.getUser({ or: "redirect" })` is the correct approach for server-side authentication, providing additional context and explanation.

## Add rules to your project

All `.mdc` files are available in the [Neon AI Rules toolkit repository](https://github.com/neondatabase-labs/ai-rules). Copy the files you need to your project's `.cursor/rules` folder (or your AI tool's equivalent):

```text
.cursor/
  rules/
    neon-auth.mdc
    neon-serverless.mdc
    neon-drizzle.mdc
    neon-toolkit.mdc
    neon-typescript-sdk.mdc
    neon-python-sdk.mdc
    neon-api-guidelines.mdc
    neon-api-projects.mdc
    neon-api-branches.mdc
    neon-api-endpoints.mdc
    neon-api-organizations.mdc
    neon-api-keys.mdc
    neon-api-operations.mdc
```

Most AI tools will automatically apply these rules when you're working with Neon-related code. You can also reference them explicitly in prompts for more targeted assistance.
