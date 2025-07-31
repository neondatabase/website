---
title: Row-Level Security with Neon
subtitle: How Neon features use Postgres Row-Level Security
enableTableOfContents: true
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How the Data API and Neon RLS use Row-Level Security</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/data-api/get-started">Data API</a>
  <a href="/docs/guides/neon-rls">Neon RLS (JWT/JWKS Integration)</a>
  <a href="/docs/guides/neon-rls-drizzle">Simplify RLS with Drizzle</a>
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

Neon provides two ways to apply RLS for client-side querying:

- [Data API](#data-api-with-rls) (recommended)
- [Neon RLS (JWT/JWKS Integration)](#neon-rls-jwtjwks-integration)

> Note, the Data API and Neon RLS **are not compatible**. If you are using the Data API on a given branch, make sure Neon RLS is disabled for your project.

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

## Neon RLS (JWT/JWKS Integration)

**Neon RLS** provides JWT/JWKS integration at the database level, exposing a single endpoint that accepts direct SQL queries over HTTP.

### How it works

- The `pg_session_jwt` extension provides the `auth.user_id()` function.
- Your RLS policies use `auth.user_id()` to control access.
- It works with the Neon HTTP driver for direct database queries.

<DetailIconCards>

<a href="/docs/guides/neon-rls" description="Learn how Neon RLS works and when to use it" icon="privacy">About Neon RLS</a>

<a href="/docs/guides/neon-rls-tutorial" description="A step-by-step guide to setting up Neon RLS" icon="github">Tutorial</a>

</DetailIconCards>

## RLS with Drizzle ORM

Drizzle makes it simple to write RLS policies that work with both the Data API and Neon RLS. We highly recommend using its `crudPolicy` helper to simplify common RLS patterns.

<DetailIconCards>

<a href="/docs/guides/neon-rls-drizzle" description="Learn how to use Drizzle's crudPolicy function to simplify RLS policies" icon="drizzle">Simplify RLS with Drizzle</a>

</DetailIconCards>

## Postgres RLS Tutorial

To learn the fundamentals of Row-Level Security in Postgres, including detailed concepts and examples, see the Postgres tutorial:

<DetailIconCards>

<a href="/postgresql/postgresql-administration/postgresql-row-level-security" description="A complete guide to Postgres Row-Level Security concepts and implementation" icon="database">Postgres RLS Tutorial</a>

</DetailIconCards>
