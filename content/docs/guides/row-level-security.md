---
title: Row-Level Security with Neon
subtitle: How Neon features use Postgres Row-Level Security
summary: >-
  Covers the implementation of Row-Level Security (RLS) in Neon, detailing how
  to secure data access through RLS policies when using the Data API and Drizzle
  ORM.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.048Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How the Data API uses Row-Level Security</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/data-api/get-started">Data API</a>
  <a href="/docs/guides/rls-drizzle">Simplify RLS with Drizzle</a>
  <a href="/postgresql/postgresql-administration/postgresql-row-level-security">Postgres RLS Tutorial</a>
</DocsList>

</InfoBlock>

Row-Level Security (RLS) is a Postgres feature that controls access to individual rows in a table based on the current user. Here's a simple example that limits the `notes` a user can see by matching rows where their `user_id` matches the session's `auth.user_id()`:

```sql
-- Enable RLS on a table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that only allows users to access their own notes
CREATE POLICY "users_can_only_access_own_notes" ON notes
  FOR ALL USING (auth.user_id() = user_id);
```

When using the Data API for client-side querying, RLS policies are required to secure your data.

## Data API with RLS

The **Data API** turns your database tables on a given branch into a REST API, and it requires RLS policies on all tables to ensure your data is secure.

### How it works

- The Data API handles JWT validation and provides the `auth.user_id()` function.
- Your RLS policies use `auth.user_id()` to control access.
- All tables accessed via the Data API must have RLS enabled.

<DetailIconCards>

<a href="/docs/data-api/get-started" description="Learn how to enable and use the Data API with RLS policies" icon="database">Get started</a>

<a href="/docs/data-api/demo" description="See a complete example of the Data API with RLS in action" icon="github">Building a note-taking app</a>

</DetailIconCards>

## RLS with Drizzle ORM

Drizzle makes it simple to write RLS policies that work with the Data API. We highly recommend using its `crudPolicy` helper to simplify common RLS patterns.

<DetailIconCards>

<a href="/docs/guides/rls-drizzle" description="Learn how to use Drizzle's crudPolicy function to simplify RLS policies" icon="drizzle">Simplify RLS with Drizzle</a>

</DetailIconCards>

## Postgres RLS Tutorial

To learn the fundamentals of Row-Level Security in Postgres, including detailed concepts and examples, see the Postgres tutorial:

<DetailIconCards>

<a href="/postgresql/postgresql-administration/postgresql-row-level-security" description="A complete guide to Postgres Row-Level Security concepts and implementation" icon="database">Postgres RLS Tutorial</a>

</DetailIconCards>
