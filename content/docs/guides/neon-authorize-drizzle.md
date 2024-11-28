---
title: Using Drizzle with Neon Authorize
subtitle: Best practices for authentication and Row-Level Security with Drizzle
enableTableOfContents: true
---

<InfoBlock>
<DocsList title="Sample project" theme="repo">
  <a href="https://github.com/neondatabase-labs/social-wall-drizzle-neon-authorize/blob/main/schema.ts">Social wall example</a>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/neon-authorize">About Neon Authorize</a>
  <a href="/docs/guides/drizzle">Connect from Drizzle to Neon</a>
<a href="https://orm.drizzle.team/docs/rls">RLS in Drizzle</a>
</DocsList>
</InfoBlock>

Drizzle works very well with Neon Authorize. This guide shows you some best practices we recommend when using Drizzle as ORM for your authentication and Row-level Security policies.

## Example Application

Check out our [social wall sample application](https://github.com/neondatabase-labs/social-wall-drizzle-neon-authorize) to see RLS patterns in action. It demonstrates how to use `crudPolicy` to implement common access patterns:

- Public read access for posts
- User-specific write permissions
- Admin-only tables

This example shows how to implement these security patterns in a real application.

<NeedHelp/>