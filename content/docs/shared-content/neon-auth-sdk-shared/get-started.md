<FeatureBetaProps feature_name="Neon Auth" />

Neon Auth lets you add authentication to your app in seconds — user data is synced directly to your Neon Postgres database, so you can query and join it just like any other table.

<Steps>

## Add Neon Auth to a project

Go to [pg.new](https://pg.new) to create a new Neon project.

Once your project is ready, open your project's **Auth** page and click **Enable Neon Auth** to get started.

![Neon Auth Console - Ready for users](/docs/neon-auth/enable-neon-auth.png)

## Get your Neon Auth keys

On the **Configuration** tab, select your framework to get the **Environment variables** you need to integrate Neon Auth and connect to your database.

You can use these keys right away to get started, or [skip ahead](#create-users-in-the-console-optional) to try out **user creation** in the Neon Console.

```bash
{envVars}
```

<Admonition type="note" title="Are you a Vercel user?">
If you're using the [Vercel-Managed Integration](https://vercel.com/marketplace/neon), the integration automatically sets these environment variables for you in Vercel when you connect a Vercel project to a Neon database. [Learn more](/docs/guides/vercel-managed-integration#environment-variables-set-by-the-integration).
</Admonition>

## Set up your app

**Clone our template** for the fastest way to see Neon Auth in action.

```bash shouldWrap
git clone https://github.com/neondatabase-labs/{templateRepo}.git
```

Or **add Neon Auth** to an existing project.

{setupSteps}

## Create users in the Console (optional)

You can create test users directly from the Neon Console — no app integration required. This is useful for development or testing.

![Create user in Neon Console](/docs/guides/neon_auth_create_user.png)

Now you can [see your users in the database](#see-your-users-in-the-database).

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

## Next Steps

Want to learn more or go deeper?

- [How Neon Auth works](/docs/guides/neon-auth-how-it-works) — See a before and after showing the benefits of having your user data right in your database
- [Neon Auth tutorial](/docs/guides/neon-auth-demo) — Walk through our demo app for more examples of how Neon Auth can simplify your code
- [Best Practices & FAQ](/docs/guides/neon-auth-best-practices) — Tips, patterns, and troubleshooting
- [Neon Auth API Reference](/docs/guides/neon-auth-api) — Automate and manage Neon Auth via the API
