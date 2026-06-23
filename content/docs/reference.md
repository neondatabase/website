---
title: Reference
subtitle: Find the right interface or reference page for building with Neon programmatically.
summary: >-
  Reference hub for Neon's programmatic interfaces, including the REST API, CLI,
  SDKs, MCP server, infrastructure-as-code tools, automation guides, glossary,
  compatibility, metrics, logs, and RSS feeds.
enableTableOfContents: true
---

Use this page to choose the right way to manage Neon from code, terminals, CI/CD, or AI tools. For product concepts and feature guides, start from the main docs navigation instead.

<Admonition type="tip" title="Fastest setup">
Run `npx neonctl@latest init` to authenticate, link your project, and configure supported AI tools for Neon MCP access. See the [Neon CLI overview](/docs/cli) and [`neonctl init` reference](/docs/cli/init).
</Admonition>

## Interfaces

Use these interfaces to manage Neon projects, branches, databases, roles, computes, and other platform resources.

<DetailIconCards>

<a href="/docs/reference/api" description="Use the REST API to manage Neon resources from scripts, services, and automation." icon="code">REST API</a>

<a href="/docs/cli" description="Use neonctl to manage Neon from your terminal, CI/CD jobs, and agent workflows." icon="cli">CLI</a>

<a href="/docs/reference/sdk" description="Choose an official SDK for app development or Neon API automation." icon="neon">SDKs</a>

<a href="/docs/ai/connect-mcp-clients-to-neon" description="Connect Cursor, Claude, VS Code, ChatGPT, and other MCP clients to Neon." icon="sparkle">MCP server</a>

</DetailIconCards>

## Infrastructure and automation

Use these references when you want repeatable setup, provisioning, or CI/CD workflows.

<DetailIconCards>

<a href="/docs/reference/neon-ts" description="Declare Neon services and branch policy in a TypeScript config file." icon="code">neon.ts</a>

<a href="/docs/reference/terraform" description="Manage Neon resources with the community-maintained Terraform provider." icon="setup">Terraform</a>

<a href="/docs/reference/claimable-postgres" description="Provision instant Postgres databases for launchpads, demos, and user onboarding." icon="database">Claimable Postgres</a>

<a href="/docs/guides/branching-github-actions" description="Create and delete Neon branches from GitHub Actions workflows." icon="github">GitHub Actions</a>

</DetailIconCards>

## More references

Use these pages for definitions, compatibility details, monitoring fields, and update feeds.

<DetailIconCards>

<a href="/docs/reference/glossary" description="Look up Neon terminology and platform concepts." icon="research">Glossary</a>

<a href="/docs/reference/compatibility" description="Review Postgres compatibility details and Neon-specific behavior." icon="check">Compatibility</a>

<a href="/docs/reference/metrics-logs" description="Review metrics, logs, and fields available for monitoring." icon="metrics">Metrics and logs</a>

<a href="/docs/reference/feeds" description="Subscribe to Neon changelog, blog, and status feeds." icon="globe">RSS feeds</a>

</DetailIconCards>
