---
title: Connect Vercel and Neon manually
subtitle: Learn how to connect a Vercel project to a Neon database manually
summary: >-
  Manual Vercel-Neon connection wires a Lakebase Postgres database to a Vercel
  project by setting DATABASE_URL (or granular PGUSER, PGHOST, PGDATABASE,
  PGPASSWORD, PGPORT vars) directly in Vercel's environment variable settings,
  without a Marketplace integration. Choose this path over the Vercel-Managed or
  Neon-Managed integrations when deploying through a custom CI pipeline, a
  monorepo, or any setup requiring direct control over branch naming, seeding, and
  migrations.
enableTableOfContents: true
updatedOn: '2026-11-20T12:32:58.582Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<a href="#when-to-choose-this-path">When to use manual connections over integrations</a>
<a href="#connection-steps">How to connect using environment variables</a>
<a href="#connect-with-the-neon-and-vercel-clis">How to connect from a terminal with the Neon and Vercel CLIs</a>
<a href="#cicd-based-preview-branching-github-actions">Advanced CI/CD automation options</a>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/guides/vercel-managed-integration">Vercel-Managed Integration</a>
<a href="/docs/guides/neon-managed-vercel-integration">Neon-Managed Integration</a>
<a href="/docs/guides/branching-github-actions">Automate branching with GitHub Actions</a>
</DocsList>
</InfoBlock>

---

## When to choose this path

Choose manual connection if you prefer not to install a Marketplace integration. This approach is ideal when you:

- Deploy via a custom pipeline (self-hosted CI, monorepo, etc.)
- Need non-Vercel hosting (for example Cloudflare Workers + Vercel Functions hybrid)
- Want full control over branch naming, seeding, migration, or teardown

If you simply want Neon and Vercel with minimal setup, stick to the managed integrations. They're simpler and include UI support.

---

## Prerequisites

- Neon project with database (get a connection string via **Connect** in the Console, or with [`neon connection-string`](/docs/cli/connection-string))
- Vercel project. To use the [CLI steps](#connect-with-the-neon-and-vercel-clis), link your project directory to it with `vercel link`.

---

## Connection steps

1. Copy the connection string from the [Neon Console](https://console.neon.tech). Click **Connect** in the Console nav, select the branch, role, and database you want, then copy the _Connection string_.

   ![Neon connection details modal](/docs/connect/connect_to_branch_modal.png)

   For example:

   ```text
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
                ^              ^                                               ^
                |- <role>      |- <hostname>                                   |- <database>
   ```

2. In the Vercel dashboard, open your project and navigate to **Settings → Environment Variables**.

3. Add either:

   ```text
   Key: DATABASE_URL
   Value: <your connection string>
   ```

   _or_ the granular `PG*` variables:

   ```text
   PGUSER=alex
   PGHOST=ep-cool-darkness-123456.us-east-2.aws.neon.tech
   PGDATABASE=dbname
   PGPASSWORD=AbC123dEf
   PGPORT=5432
   PGSSLMODE=verify-full
   ```

   <Admonition type="note">
   Neon uses the default Postgres port, `5432`. Neon requires SSL, and the `PG*` variables don't carry the `sslmode` setting from a connection string, so set `PGSSLMODE` yourself. Without it, the connection fails with a `connection is insecure` error.
   </Admonition>

4. Select which environments need database access (Production, Preview, Development) and click **Save**. To use the Development value on your machine, run `vercel env pull .env.local` in your project directory.

5. Redeploy your application (or wait for your next deployment) for the variables to take effect.

That's it. Your Vercel app now connects to Neon just like any other Postgres database.

---

## Connect with the Neon and Vercel CLIs

You can set the same variables from a terminal, which also works for coding agents. Run these commands in a project directory that's linked to Neon (with `neon link` or `neon init`) and to Vercel (with `vercel link`). Outside a directory linked to Neon, pass `--project-id` to `neon connection-string`.

```bash
POOLED_URL="$(neon connection-string main --pooled)"
DIRECT_URL="$(neon connection-string main)"
printf '%s' "$POOLED_URL" | vercel env add DATABASE_URL --environment production --sensitive --yes
printf '%s' "$DIRECT_URL" | vercel env add DATABASE_URL_UNPOOLED --environment production --sensitive --yes
```

Your app connects with the pooled `DATABASE_URL`. Run migrations over the direct `DATABASE_URL_UNPOOLED` instead, as [Connection pooling](/docs/connect/connection-pooling) explains. Reading each connection string into a shell variable first keeps it out of your shell history.

Replace `main` with the branch that holds your production data. To replace a variable that's already set, add `--force`. Then redeploy so the variables take effect.

### Add a database for preview deployments

`vercel deploy` without `--prod` creates a preview deployment, and preview deployments read the Preview variables. If those aren't set and your build reads `DATABASE_URL`, for example to run migrations, the build fails. Create a branch for previews and add its connection strings to Preview:

```bash
neon branches create --name preview
POOLED_URL="$(neon connection-string preview --pooled)"
DIRECT_URL="$(neon connection-string preview)"
printf '%s' "$POOLED_URL" | vercel env add DATABASE_URL --environment preview --sensitive --yes
printf '%s' "$DIRECT_URL" | vercel env add DATABASE_URL_UNPOOLED --environment preview --sensitive --yes
```

Every preview deployment shares this one branch. To give each preview deployment its own branch, use one of the [managed integrations](/docs/guides/vercel-overview) or [GitHub Actions](/docs/guides/branching-github-actions).

---

## CI/CD-based Preview Branching (GitHub Actions)

Looking for a full CI/CD recipe? See **[Automate branching with GitHub Actions](/docs/guides/branching-github-actions)**.

<NeedHelp/>
