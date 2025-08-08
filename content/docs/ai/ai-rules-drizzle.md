---
title: AI Rules: Neon with Drizzle
subtitle: Context rules for AI tools to help implement Drizzle ORM with Neon databases
enableTableOfContents: true
updatedOn: '2025-08-05T10:02:15.486Z'
---

Boost your productivity with AI context rules for Neon. These rules help AI tools like [Cursor](https://www.cursor.so/) understand Neon's features, leading to more accurate code suggestions and fewer common mistakes.

## Available rules

<DetailIconCards>

<a href="/docs/ai/ai-rules-neon-auth" description="Stack Auth integration, database syncing, and authentication patterns" icon="lock-landscape">Neon Auth</a>

<a href="/docs/ai/ai-rules-neon-serverless" description="Efficient queries, connection pooling, and serverless best practices" icon="network">Neon Serverless Driver</a>

<a href="/docs/ai/ai-rules-neon-drizzle" description="ORM setup, schema management, and usage patterns with Drizzle" icon="drizzle">Neon + Drizzle</a>

</DetailIconCards>

## How it works

AI rules are `.mdc` files that specify which types of files they apply to (such as `*.tsx` or `schema.sql`). When you're working with a matching file, your AI tool automatically applies the relevant rules to provide better suggestions.

### Add to your project

Add these files to your project's `.cursor/rules` folder:

```text
.cursor/
  rules/
    neon-auth.mdc
    neon-serverless.mdc
    neon-drizzle.mdc
```
