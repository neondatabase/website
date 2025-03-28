---
title: AI Rules and Prompts
subtitle: Enhance your AI development experience with Neon-specific context rules
enableTableOfContents: true
---

Boost your productivity with AI context rules for Neon. These rules help AI tools like [Cursor](https://www.cursor.so/) understand Neon's features, leading to more accurate code suggestions and fewer common mistakes.

## Available rules

<DetailIconCards>

<a href="/docs/ai/ai-rules-neon-auth" description="Stack Auth integration, database syncing, and authentication patterns" icon="lock-landscape">Neon Auth</a>

<a href="/docs/ai/ai-rules-neon-serverless" description="Efficient queries, connection pooling, and serverless best practices" icon="network">Neon Serverless</a>

<a href="/docs/ai/ai-rules-neon-drizzle" description="ORM setup, schema management, and usage patterns with Drizzle" icon="drizzle">Neon + Drizzle</a>

</DetailIconCards>

## How it works

AI rules are `.mdc` files that specify which types of files they apply to (such as `*.tsx` or `schema.sql`). When you're working with a matching file, your AI tool automatically applies the relevant rules to provide better suggestions.

### Example: AI rules in action

Here's a practical example using [Cursor](https://www.cursor.so). A developer has implemented authentication in their server-rendered page and wants to confirm best practices:

**Developer query**: _"Using the neon-auth.mdc rule, how do I secure a server-rendered page?"_

![Screenshot of Cursor applying the neon-auth.mdc rule](/docs/ai/ai-rules.png)

The AI confirms that using `stackServerApp.getUser({ or: "redirect" })` is the correct approach for server-side authentication, providing additional context and explanation.

## Add rules to your project

Add these files to your project's `.cursor/rules` folder:

```text
.cursor/
  rules/
    neon-auth.mdc
    neon-serverless.mdc
    neon-drizzle.mdc
```

Most AI tools will automatically apply these rules when you're working with Neon-related code. You can also reference them explicitly in prompts for more targeted assistance.
