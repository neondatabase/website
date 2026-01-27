---
title: Agent Skills
subtitle: Enhance your AI development experience with Neon-specific context and guidance
enableTableOfContents: true
updatedOn: '2026-01-27T00:00:00.000Z'
redirectFrom:
  - /docs/ai/ai-rules
  - /docs/ai/ai-rules-neon-toolkit
---

Boost your productivity with Agent Skills for Neon. These skills help AI assistants understand Neon's features, leading to more accurate code suggestions and fewer common mistakes.

Install the Neon agent skill to get started:

```bash
npx add-skill neondatabase/agent-skills
```

This works with **Cursor**, **Claude Code**, and other AI tools that support the [Agent Skills](https://agentskills.io) format.

<Admonition type="note" title="Agent Skills">
Agent Skills are new and actively being improved. We'd love your feedback! Join us on [Discord](https://discord.gg/92vNTzKDGp) to share suggestions.
</Admonition>

## What's covered

The Neon agent skill provides guidance across the full Neon development workflow:

- **Getting started** — Project setup, Neon features (branching, autoscaling, scale-to-zero)
- **Connections** — Serverless driver, connection methods, Drizzle ORM
- **Authentication & Data** — Neon Auth, neon-js Data API
- **Platform APIs & SDKs** — REST API, TypeScript SDK, Python SDK
- **Developer tools** — CLI, VS Code extension, MCP server

The skill automatically loads relevant context based on your task. For the complete reference, see the [Agent Skills repository](https://github.com/neondatabase/agent-skills).

## How it works

Agent Skills use a progressive disclosure model. When you install a skill:

1. **Entry point**: The agent reads the SKILL.md file to understand what guidance is available
2. **On-demand loading**: Detailed reference files are only loaded when needed for specific tasks
3. **Context efficiency**: Agents don't waste tokens on information they don't need

### Example: Agent Skills in action

Here's a practical example using [Cursor](https://www.cursor.so). A developer wants to set up Neon Auth in their Next.js app:

**Developer prompt**: _"Set up Neon Auth for my Next.js app"_

The AI assistant automatically uses the installed Neon skill to provide accurate, up-to-date guidance for authentication setup, including proper imports, configuration, and best practices.

### Alternative: Browse individual references

If you prefer to work with individual reference files, you can browse and download them directly from the [Agent Skills repository](https://github.com/neondatabase/agent-skills).
