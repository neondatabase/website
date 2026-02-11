---
title: 'AI Rules: Neon API'
subtitle: Context rules for AI tools to use the Neon API to programmatically manage Neon
  projects, branches, databases, and other resources.
summary: >-
  Covers the setup of AI rules for using the Neon API to manage projects,
  branches, databases, and resources programmatically, with options for copying
  rules or cloning from a repository.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.722Z'
---

<Admonition type="note" title="AI Rules are in Beta">
AI Rules are currently in beta. We're actively improving them and would love to hear your feedback. Join us on [Discord](https://discord.gg/92vNTzKDGp) to share your experience and suggestions.
</Admonition>

<InfoBlock>
<DocsList title="Related docs" theme="docs">
  <a href="/docs/reference/api-reference">Neon API</a>
</DocsList>

<DocsList title="Repository" theme="repo">
  <a href="https://api-docs.neon.tech/reference/getting-started-with-neon-api">Neon API Reference Docs</a>
  <a href="https://github.com/neondatabase-labs/ai-rules/blob/main/neon-api-guidelines.mdc">neon-api-guidelines.mdc</a>
</DocsList>
</InfoBlock>

<AIRule file="neon-api-guidelines.mdc" name="Neon API" />

## How to use

You can use the following Neon API rules in two ways:

<Steps>
## Option 1: Copy from this page

With Cursor, save the [rules](https://docs.cursor.com/context/rules-for-ai#project-rules-recommended) to `.cursor/rules/file_name.mdc` and they'll be automatically applied when working with matching files.

For other AI tools, you can include these rules as context when chatting with your AI assistant - check your tool's documentation for the specific method (like using "Include file" or context commands).

## Option 2: Clone from repository

If you prefer, you can clone or download the rules directly from our [AI Rules repository](https://github.com/neondatabase-labs/ai-rules).

Once added to your project, AI tools will automatically use these rules when working with Neon API. You can also reference them explicitly in prompts.
</Steps>

## Neon API rules: General guidelines

Save the following content to a file named `neon-api-guidelines.mdc` in your AI tool's rules directory.

<ExternalCode
  url="https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-api-guidelines.mdc"
  language="md"
/>

## Neon API rules: Manage API keys

Save the following content to a file named `neon-api-keys.mdc` in your AI tool's rules directory.

<ExternalCode
  url="https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-api-keys.mdc"
  language="md"
/>

## Neon API rules: Manage operations

Save the following content to a file named `neon-api-operations.mdc` in your AI tool's rules directory.

<ExternalCode
  url="https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-api-operations.mdc"
  language="md"
/>

## Neon API rules: Manage projects

Save the following content to a file named `neon-api-projects.mdc` in your AI tool's rules directory.

<ExternalCode
  url="https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-api-projects.mdc"
  language="md"
/>

## Neon API Rules: Manage Branches

Save the following content to a file named `neon-api-branches.mdc` in your AI tool's rules directory.

<ExternalCode
  url="https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-api-branches.mdc"
  language="md"
/>

## Neon API Rules: Manage Compute Endpoints

Save the following content to a file named `neon-api-endpoints.mdc` in your AI tool's rules directory.

<ExternalCode
  url="https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-api-endpoints.mdc"
  language="md"
/>

## Neon API Rules: Manage Organizations

Save the following content to a file named `neon-api-organizations.mdc` in your AI tool's rules directory.

<ExternalCode
  url="https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-api-organizations.mdc"
  language="md"
/>
