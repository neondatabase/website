---
title: Neon Auth best practices & FAQ
enableTableOfContents: true
tag: beta
---

<FeatureBetaProps feature_name="Neon Auth" />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/guides/neon-auth">Get started</a>
    <a href="/docs/guides/neon-auth-demo">Tutorial</a>
    <a href="/docs/guides/neon-auth-how-it-works">How it works</a>
  </DocsList>

  <DocsList title="Sample project" theme="repo">
    <a href="https://github.com/neondatabase-labs/neon-auth-demo-app">Neon Auth Demo App</a>
  </DocsList>
</InfoBlock>

## Foreign keys and the users_sync table

Since the `neon_auth.users_sync` table is updated asynchronously, there may be a brief delay (usually less than 1 second) before a user's data appears in the table. Consider this possible delay when deciding whether to use foreign keys in your schema.

If you do choose to use foreign keys, make sure to specify an `ON DELETE` behavior that matches your needs: for example, `CASCADE` for personal data like todos or user preferences, and `SET NULL` for content like blog posts or comments that should persist after user deletion.

```sql
-- For personal data that should be removed with the user (e.g., todos)
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- For content that should persist after user deletion (e.g., blog posts)
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES neon_auth.users_sync(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

## Querying user data

When querying data that relates to users:

- Use LEFT JOINs instead of INNER JOINs with the `users_sync` table in case of any sync delays. This ensures that all records from the main table (e.g., posts) are returned even if there's no matching user in the `users_sync` table yet.
- Filter out deleted users since the table uses soft deletes (users are marked with a `deleted_at` timestamp when deleted).

Here's an example of how to handle both in your queries:

```sql
SELECT posts.*, neon_auth.users_sync.name as author_name
FROM posts
LEFT JOIN neon_auth.users_sync ON posts.author_id = neon_auth.users_sync.id
WHERE neon_auth.users_sync.deleted_at IS NULL;
```

## Limitations

<Admonition type="important">
Neon Auth is not compatible with Private Link (Neon Private Networking). If you have Private Link enabled for your Neon project, Neon Auth will not work. This is because Neon Auth requires internet access to connect to third-party authentication providers, while Private Link restricts connections to private AWS networks.
</Admonition>
