---
title: Connecting with the Vercel-Managed Integration
subtitle: Create and manage Neon databases directly from your Vercel dashboard
redirectFrom:
  - /docs/guides/vercel-native-integration
  - /docs/guides/vercel-native-integration-previews
enableTableOfContents: true
updatedOn: '2025-07-14T18:31:00.663Z'
---

<InfoBlock>
<DocsList title="What you will learn:" >
<a href="#about-this-integration">What the Vercel-Managed Integration is</a>
<a href="#installation-walkthrough">How to install it from the Vercel Marketplace</a>
<a href="#enable-automated-preview-branching-recommended">How (and why) to enable automated Preview Branching</a>
<a href="#managing--billing">Where to manage billing and configuration</a>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/guides/neon-managed-vercel-integration">Neon-Managed Integration</a>
<a href="/docs/guides/vercel-manual">Manual Connections</a>
</DocsList>
</InfoBlock>

---

## About this integration

**Vercel-Managed Integration** (also known as _Neon Postgres Native Integration_) lets you add a Neon Postgres database to your Vercel project **with billing handled entirely inside Vercel**. Installing it:

- Creates a Neon account + project for you (if you don't already have one)
- For existing Neon users, adds a new organization named `Vercel: <team-name>` to your account
- Injects the required database environment variables (`DATABASE_URL`, etc.) into your Vercel project
- Optionally creates a dedicated database branch for every Preview Deployment so you can test schema changes safely

<Admonition type="note" title="Who should use this path?">
Choose the Vercel-Managed Integration if you **do not already have a Neon account** *or* you prefer to consolidate payment for Neon inside your Vercel invoice.
</Admonition>

---

## Installation walkthrough

<Steps>

## Open Neon integration

Open the [Neon integration on the Vercel Marketplace](https://vercel.com/marketplace/neon) and click **Install**.

## Add the integration in Vercel

This opens the **Install Neon** modal where you can choose between two options. Select **Create New Neon Account**, then click **Continue**.

![Create a New Neon Account](/docs/guides/vercel_install_neon_modal_new_account.png)

## Complete Vercel's configuration

Accept the terms, pick a region & plan, then name your database. (Remember: a "Database" in Vercel is a **Project** in Neon.)

## View storage settings

After creation you'll land on Vercel's **Storage** tab that includes status, plan, connection string, billing plan, and more.

## Optionally open the project in the Neon Console

From the **Storage** tab, click **Open in Neon** to jump straight to your new Neon project dashboard in the Neon Console. You'll notice it lives in an organization named `Vercel: <your-vercel-team>`.

</Steps>

---

## Connecting the database to a Vercel project

1. In **Storage → `<your database>` → Connect Project** choose the Vercel project and the environments that should receive database variables (Development, Preview, Production).

   ![Connect a Vercel Project](/docs/guides/vercel_native_connect_project.png)

2. (Optional) Under **Advanced Options → Deployments Configuration** enable **Preview** to turn on _Preview Branching_ (see next section).

   ![Vercel deployment configuration](/docs/guides/vercel_native_deployments_configuration.png)

3. Click **Connect**.

<Admonition type="tip" title="Environment variable prefix">You can add a prefix if you have multiple databases in the same project, e.g. `PRIMARY_`.</Admonition>

---

## Enable automated preview branching (recommended)

Preview branching creates an isolated Neon branch (copy-on-write) for every Vercel Preview Deployment so database schema changes can be tested safely.

To enable:

1. While connecting the project (step above) toggle **Required → Preview**.
2. Make sure **Resource must be active before deployment** is also on. This allows Vercel to wait for the branch to be ready.

Once enabled, the flow looks like this:

1. Developer pushes to feature branch → Vercel kicks off Preview Deployment.
2. Vercel sends a webhook to Neon → Neon creates branch `preview/<git-branch>`.
3. Connection string for that branch is injected into the deployment's env vars.
4. (Optional) Run migrations in build step so schema matches code.

   ![Vercel build commands](/docs/guides/vercel_build_command.png)

### Test the setup

To verify preview branching works:

1. Create a local branch: `git checkout -b test-feature`
2. Make any change and commit: `git commit -a -m "Test change"`
3. Push: `git push`
4. Check Vercel deployments and Neon Console branches to confirm the preview branch was created

---

## Managing & billing

Because your database is managed by Vercel, you can only perform these action **in the Vercel dashboard**:

- Change plan, billing tier, or scale settings (compute size, autoscaling, scale-to-zero)
- View or modify database configuration via **Storage → Settings → Change Configuration**
- Monitor usage via **Storage → Usage** (also available in Neon Console)
- Create additional databases (each becomes a new Neon project)
- Rename or delete a database (deleting removes the underlying Neon project permanently)
- Manage members / collaborators (handled through Vercel "Members", not the Neon Console)
- Delete the Neon organization (only happens automatically if you uninstall the integration)
- Update connection-string environment variables (prefix changes, etc.)

Everything else (querying data, branching, monitoring usage) works exactly the same in the Neon Console.

---

## Common operations

### Add another database (project)

1. Go to **Integrations → Neon Postgres → Manage → More Products → Install**
2. Select region, scale settings, and plan
3. Specify a **Database Name** and click **Create**

### Change compute / scale settings

**Storage → Settings → Change Configuration** lets you resize compute, adjust scale-to-zero, or switch Neon plan tiers. Changes apply to _all_ databases in the installation.

<Admonition type="important">
Changing your plan affects **all databases** in this integration, not just the current one.
</Admonition>

### Delete the database

Deleting from Vercel permanently removes the Neon project and all data. This cannot be undone.
To delete:

1. Vercel Dashboard → Storage → Settings
2. Select your database
3. Find Delete Database section and confirm

### Disconnect a project from database

To disconnect a Vercel project without deleting the database:

1. Go to **Storage → `<your database>` → Projects**
2. Select your project and choose **Remove Project Connection**

This removes database environment variables from your Vercel project but keeps the database intact. Previously created preview branches remain but new ones won't be created.

### Manage branches created by the integration

Preview deployments create database branches that accumulate over time. Delete unused branches to avoid hitting storage limits and branch quotas. Delete branches via:

- [Neon Console](/docs/manage/branches#delete-a-branch) - Individual or bulk deletion
- [Neon CLI](/docs/reference/cli-branches#delete) - Command line management
- [Neon API](/docs/manage/branches#delete-a-branch-with-the-api) - Programmatic cleanup

<Admonition type="note" title="Unused branches are archived">
Branches you don't delete are eventually archived, consuming archive storage space. See [Branch archiving](/docs/guides/branch-archiving).
</Admonition>

---

## Environment variables set by the integration

| Variable                                                          | Purpose                                                             |
| :---------------------------------------------------------------- | :------------------------------------------------------------------ |
| `DATABASE_URL`                                                    | Pooled connection string (PgBouncer)                                |
| `DATABASE_URL_UNPOOLED`                                           | Direct connection string                                            |
| `PGHOST`, `PGHOST_UNPOOLED`, `PGUSER`, `PGDATABASE`, `PGPASSWORD` | Raw pieces to build custom strings                                  |
| Legacy `POSTGRES_*` vars                                          | Provided for backwards compatibility with Vercel Postgres templates |
| `NEXT_PUBLIC_STACK_PROJECT_ID`, `STACK_SECRET_SERVER_KEY`, etc.   | **Neon Auth variables** for drop-in authentication                  |

> **Neon Auth variables** automatically sync user profiles to your database in the `neon_auth.users_sync` table, enabling authentication without additional setup. Learn more in the [Neon Auth guide](/docs/guides/neon-auth).

---

## Limitations

- You cannot use this integration with the **Neon-Managed integration** in the same Vercel project
- **Neon CLI access**: Requires API key authentication (the `neon auth` command won't work since the account is Vercel-managed)
- Cannot install if you currently use Vercel Postgres (deprecated) - contact Vercel about transitioning
- Manual branch deletion required (unlike the **Neon-Managed Integration** which offers automatic cleanup)

<NeedHelp/>
