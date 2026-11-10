---
title: Row-Level Security with Neon
subtitle: How Neon features use Postgres Row-Level Security
summary: >-
  Row-Level Security (RLS) in Neon restricts table access to individual rows
  based on the authenticated user. Enable RLS on every table exposed through
  the Neon Data API. Use this page when adding RLS policies to a Data API
  project or using Drizzle ORM's crudPolicy helper to simplify per-user access
  control in a Postgres database.
enableTableOfContents: true
redirectFrom:
  - /docs/guides/neon-rls
updatedOn: '2026-06-05T17:20:32.620Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How the Data API uses Row-Level Security</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/data-api/get-started">Data API</a>
  <a href="/docs/guides/rls-drizzle">Simplify RLS with Drizzle</a>
  <a href="/postgresql/administration/row-level-security">Postgres RLS Tutorial</a>
</DocsList>

</InfoBlock>

Row-Level Security (RLS) is a Postgres feature that controls access to individual rows in a table based on the current user. Here's a simple example that limits the `notes` a user can see by matching rows where their `user_id` matches the session's `auth.user_id()`.

The `auth.user_id()` function is available after you [enable the Data API](/docs/data-api/get-started) on a branch. The example also needs a `notes` table. Create one, and grant the `authenticated` role access to it. RLS filters the rows, but the role still needs table privileges first:

```sql
CREATE TABLE notes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id text NOT NULL,
  body text
);

GRANT SELECT, INSERT, UPDATE, DELETE ON notes TO authenticated;
```

Then enable RLS and add the policy:

```sql
-- Enable RLS on a table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that only allows users to access their own notes
CREATE POLICY "users_can_only_access_own_notes" ON notes
  FOR ALL USING (auth.user_id() = user_id);
```

The policy has no `WITH CHECK` clause, so Postgres applies the same condition to new and changed rows. A user can't insert a row for another user, or change a row's `user_id` to another user's ID.

When using the Data API for client-side querying, RLS policies are required to secure your data.

## Data API with RLS

The **Data API** turns your database tables on a given branch into a REST API. Enable RLS on every table you expose through it. Without RLS, authenticated users can read every row in a table.

### How it works

- The Data API handles JWT validation and provides the `auth.user_id()` function.
- Your RLS policies use `auth.user_id()` to control access.
- Grant the `authenticated` role the table privileges it needs. The Data API doesn't add its own permission layer, so grants and policies together decide what each request can access.

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

<a href="/postgresql/administration/row-level-security" description="A complete guide to Postgres Row-Level Security concepts and implementation" icon="database">Postgres RLS Tutorial</a>

</DetailIconCards>
