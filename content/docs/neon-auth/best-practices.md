---
title: Neon Auth best practices & FAQ
enableTableOfContents: true
tag: beta
updatedOn: '2025-05-16T19:06:06.839Z'
redirectFrom:
  - /docs/guides/neon-auth-best-practices
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

## Restricting redirect domains

<Admonition type="warning">
<strong>Important:</strong> Before going to production, you should restrict authentication redirect URIs to trusted domains only. This prevents malicious actors from hijacking authentication flows and protects your users.
</Admonition>

For production deployments, you should explicitly whitelist the domains your app will use for authentication redirects (for example, your main website, admin panel).

Go to the **Domains** section in the Neon Auth **Configuration** tab for your project and
add each trusted domain needed for your app. You can add as many as you need.

Only the domains on this list will be allowed for authentication redirects. All others will be blocked.

![Screenshot showing the Domains section in Neon Auth](/docs/relnotes/neon-auth-domains.png)

## Enabling row-level security (RLS)

Row-Level Security (RLS) lets you enforce access control directly in your database, providing an extra layer of security for your app's data.

To get started adding RLS to your Neon Auth project:

1. Go to the **Configuration** tab in your Neon Auth project.
2. Copy the **JWKS URL** shown in the **Claim project** section.

   ![jwks in claim project section](/docs/relnotes/neon_auth_jwks.png)

   _This JWKS URL allows Neon RLS to validate authentication tokens issued by Neon Auth._

3. In your Neon project, open **Settings > RLS** and paste the JWKS URL.
4. Continue with the standard RLS setup:
   - Install the `pg_session_jwt` extension in your database.
   - Set up the `authenticated` and `anonymous` roles.
   - Add RLS policies to your tables.

   For these steps, you can follow the [Stack Auth + Neon RLS guide](/docs/guides/neon-rls-stack-auth) starting from [step 3](/docs/guides/neon-rls-stack-auth#3-install-the-pgsessionjwt-extension-in-your-database). Neon Auth uses Stack Auth under the hood, so the RLS integration process is the same from this point onward.

For a full walkthrough, see [About Neon RLS](/docs/guides/neon-rls) and the [Neon RLS Tutorial](/docs/guides/neon-rls-tutorial).

## Limitations

<Admonition type="important">
Neon Auth is not compatible with Private Link (Neon Private Networking). If you have Private Link enabled for your Neon project, Neon Auth will not work. This is because Neon Auth requires internet access to connect to third-party authentication providers, while Private Link restricts connections to private AWS networks.
</Admonition>
