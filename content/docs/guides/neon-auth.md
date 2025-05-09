---
title: Neon Auth
subtitle: Add authentication to your project. Access user data directly in your Postgres database.
enableTableOfContents: true
redirectFrom:
  - /docs/guides/neon-identity
tag: beta
updatedOn: '2025-04-17T13:11:55.870Z'
---

Neon Auth lets you add authentication to your app in seconds — user data is synced directly to your Neon Postgres database, so you can query and join it just like any other table.

<FeatureBetaProps feature_name="Neon Auth" />

<Steps>

## Add Neon Auth to a project

Go to [pg.new](https://pg.new) to create a new Neon project.

Once your project is ready, open your project's **Auth** page. Neon Auth is ready for you to get started.

Click **Setup instructions** to continue.

![Neon Auth Console - Ready for users](/docs/guides/enable-neon-auth.png)

## Set up your app

You have two easy options to get started with Neon Auth in your app: use our template (built with Next.js), or add Neon Auth to your existing project. Neon Auth works with any framework that supports JWT-based authentication.

**Clone our template**

```bash
git clone https://github.com/neondatabase-labs/neon-auth-nextjs-template.git
```

**Add Neon Auth to your existing project**

If you're using Next.js, you can run (this uses Stack Auth tooling under the hood):

```bash
npx @stackframe/init-stack@latest
```

Not ready to integrate yet? You can skip ahead to set up auth in the Neon Console and try it out first.

## Set up authentication in Neon

In the **Setup instructions** tab, click **Set up Auth**.

Neon handles all the setup and gives you the keys you need to add authentication to your app.

You can use these keys right away to integrate auth, or skip ahead to try out user creation in the Console.

```bash shouldWrap
# Neon Auth environment variables (these keys are provided by Neon Auth)
NEXT_PUBLIC_STACK_PROJECT_ID='<neon_provided_stack_project_id>'
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY='<neon_provided_stack_publishable_client_key>'
STACK_SECRET_SERVER_KEY='<neon_provided_stack_secret_server_key>'

# Your Neon connection string
DATABASE_URL='<your_neon_connection_string>'
```

> **Already using Stack Auth in an existing project?**  
> Click **Connect your project** instead. This will open a modal where you can link your Neon project to your existing Stack Auth project.

## Create users in the Console (optional)

You can create test users directly from the Neon Console — no app integration required.

Useful during development or testing, this mimics a real user signing up or logging in; their profile is synced to your Neon database in the `neon_auth.users_sync` table.

![Create user in Neon Console](/docs/guides/neon_auth_create_user.png)

## See your users in the database

As users sign up or log in — through your app or by creating test users in the Console — their profiles are synced to your Neon database in the `neon_auth.users_sync` table.

Query your users table in the SQL Editor to see your new user:

```sql
SELECT * FROM neon_auth.users_sync;
```

| id          | name      | email           | created_at          | updated_at          | deleted_at | raw_json                     |
| ----------- | --------- | --------------- | ------------------- | ------------------- | ---------- | ---------------------------- |
| 51e491df... | Sam Patel | sam@startup.dev | 2025-02-12 19:43... | 2025-02-12 19:46... | null       | `{"id": "51e491df...", ...}` |

</Steps>

## Next steps

Want to learn more or go deeper?

- [How Neon Auth works](/docs/guides/neon-auth-how-it-works) — See the architecture, sync details, and benefits.
- [Best Practices & FAQ](/docs/guides/neon-auth-best-practices) — Tips, patterns, and troubleshooting.
- [Neon Auth API Reference](/docs/guides/neon-auth-api) — Automate and manage Neon Auth via the API.
- [Neon Auth tutorial](/docs/guides/neon-auth-tutorial) — See a real-world scenario and walkthrough.

For most users, this page is all you need to get started. If you want to dive deeper, the links above will guide you!
