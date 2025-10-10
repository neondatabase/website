---
title: AI rules and prompts
subtitle: Enhance your AI development experience with Neon-specific context rules
enableTableOfContents: true
updatedOn: '2025-10-10T13:19:39.264Z'
---

Boost your productivity with AI context rules for Neon. These rules help AI tools like [Cursor](https://www.cursor.so/) understand Neon's features, leading to more accurate code suggestions and fewer common mistakes.

<Admonition type="note" title="AI Rules are in Beta">
AI Rules are currently in beta. We're actively improving them and would love to hear your feedback. Join us on [Discord](https://discord.gg/92vNTzKDGp) to share your experience and suggestions.
</Admonition>

<DetailIconCards>

<a href="/docs/ai/ai-rules-neon-auth" description="AI rules for implementing authentication with Neon" icon="lock-landscape">Neon Auth</a>

<a href="/docs/ai/ai-rules-neon-serverless" description="AI rules for serverless database connections" icon="network">Neon Serverless Driver</a>

<a href="/docs/ai/ai-rules-neon-drizzle" description="AI rules for using Drizzle ORM with Neon" icon="drizzle">Neon Drizzle</a>

<a href="/docs/ai/ai-rules-neon-typescript-sdk" description="AI rules for using the Neon TypeScript SDK" icon="code">Neon TypeScript SDK</a>

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

Add these files to your project's `.cursor/rules` folder:

```text
.cursor/
  rules/
    neon-auth.mdc
    neon-serverless.mdc
    neon-drizzle.mdc
```

Most AI tools will automatically apply these rules when you're working with Neon-related code. You can also reference them explicitly in prompts for more targeted assistance.
