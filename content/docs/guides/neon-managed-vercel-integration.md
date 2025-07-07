---
title: Connecting with the Neon-Managed Integration
subtitle: Link an existing Neon project to Vercel and keep billing in Neon
redirectFrom:
  - /docs/guides/vercel-previews-integration
enableTableOfContents: true
updatedOn: '2025-07-02T00:00:00.000Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<a href="#about-this-integration">The purpose of the Neon-Managed Integration</a>
<a href="#installation-steps">How to install it from Connectable Accounts</a>
<a href="#how-preview-branching-works">How automated Preview Branching works</a>
<a href="#managing-the-integration">How to manage environment variables and branch cleanup</a>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/guides/vercel-managed-integration">Vercel-Managed Integration</a>
<a href="/docs/guides/vercel-manual">Manual Connections</a>
</DocsList>
</InfoBlock>

---

## About this integration

The **Neon-Managed Integration** links your existing Neon project to a Vercel project while keeping billing in Neon. Instead of sharing a single database across all preview deployments, this integration creates an isolated database branch for each preview deployment.

**Key features:**

- One-click connection from Vercel Marketplace
- Automatic database branches for each preview deployment
- Environment variable injection (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `PG*` variables)
- Automatic cleanup when branches are deleted

<Admonition type="note" title="Who should use this integration?">
Choose the Neon-Managed Integration if you already have a Neon account/project or prefer to manage billing directly with Neon.
</Admonition>

---

## Prerequisites

Before you begin, ensure you have:

- A Neon account with at least one project and database role
- A Vercel account with a project linked to GitHub, GitLab, or Bitbucket

---

## Installation steps

<Steps>

## Connect from Neon Console

In the [Neon Console](https://console.neon.tech), navigate to **Integrations** and click **Add** under Vercel.

Click **Install from Vercel Marketplace** to open the integration in Vercel.

## Add the integration in Vercel

Click the "..." menu in your Vercel project and choose "Connect Account."

![Add Neon from Connectable Accounts](/docs/guides/vercel_connect_neon_account.png)

<Admonition type="tip">
Alternatively, if you're accessing this directly from the Vercel Marketplace, locate the **Connectable Accounts** section, find **Neon**, and click **Add**.

![Add Neon from Connectable Accounts](/docs/guides/vercel_add_connected_neon_account.png)
</Admonition>

## Configure the connection

Choose which Vercel account and projects can use this integration. Each Neon project connects to exactly one Vercel project. Selecting **All projects** makes the integration available to other Vercel projects.

![Connect Neon Account Projects](/docs/guides/vercel_connect_neon_account_projects.png)

## Set up project integration

In the **Integrate Neon** dialog:

1. **Select your Vercel project**

   ![Select a Vercel project](/docs/guides/vercel_select_project.png)

2. **Choose your Neon project, database, and role**

   ![Connect to Neon](/docs/guides/vercel_connect_neon.png)

3. **Configure optional settings:**
   - Enable **Create a branch for your development environment** to create a persistent `vercel-dev` branch
     and set Vercel development environment variables for it. The `vercel-dev` branch is a clone of your project's default branch (`main`) that you can modify without affecting data on your default branch.
   - Enable **Automatically delete obsolete Neon branches** (recommended) to clean up branches when git branches are deleted.

4. Click **Connect**, then **Done**

![Confirm integration settings](/docs/guides/vercel_confirm_settings.png)

![Vercel integration success](/docs/guides/vercel_success.png)

</Steps>

### What happens after installation

Once connected successfully, you'll see:

**In Neon Console:**

- A `vercel-dev` branch (if enabled) under **Branches**
- Future preview branches will appear here automatically

![Neon branches](/docs/guides/vercel_neon_branches.png)

**In Vercel:**

- `DATABASE_URL` and other environment variables under **Settings → Environment Variables**

![Vercel environment variables](/docs/guides/vercel_env_variables.png)

---

## How Preview Branching works

The integration automatically creates isolated database environments for each preview deployment:

<Steps>

## Developer pushes to feature branch

When you push commits to a feature branch, Vercel triggers a preview deployment.

## Integration creates Neon branch

The integration receives a webhook from Vercel and creates a new Neon branch named `preview/<git-branch>` using the Neon API.

## Environment variables injected

Vercel receives the new connection string and injects it as environment variables for that specific deployment only.

</Steps>

This isolation allows you to test data and schema changes safely in each pull request. To apply schema changes automatically, add migration commands to your Vercel build configuration:

1. Go to **Vercel Dashboard → Settings → Build and Deployment Settings**
2. Enable **Override** and add your build commands, including migrations, for example:
   ```bash
   npx prisma migrate deploy && npm run build
   ```

This ensures schema changes in your commits are applied to each preview deployment's database branch.

![Vercel build commands](/docs/guides/vercel_build_command.png)

![Neon preview deployment branch](/docs/guides/vercel_deployments.png)

![Neon preview deployment branch](/docs/guides/vercel_neon_app_update.png)

![Vercel preview settings](/docs/guides/vercel_preview_settings.png)

---

## Managing the integration

### Environment variables

The integration sets both modern (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`) and legacy PostgreSQL variables (`POSTGRES_URL`, `PGHOST`, etc.) for Production and Development environments. Preview variables are injected dynamically per deployment.

- `DATABASE_URL`: Pooled connection (recommended for most applications)
- `DATABASE_URL_UNPOOLED`: Direct connection (for tools requiring direct database access)

**To customize which variables are used:**

1. Go to **Neon Console → Integrations → Manage → Settings**
2. Select the variables you want (e.g., `PGHOST`, `PGUSER`, etc.)
3. Click **Save changes**

![Select Vercel variables](/docs/guides/vercel_select_variables.png)

### Branch cleanup

**Automatic cleanup (recommended):**
Enable **Automatically delete obsolete Neon branches** during setup to remove preview branches automatically when the corresponding git branch is deleted.

**Manual cleanup:**
If needed, you can delete branches manually:

- **Individual branches:** Neon Console → Integrations → Manage → Branches → trash icon
- **Bulk delete:** Use **Delete all** in the same interface
- **API/CLI:** Use Neon CLI or API for programmatic cleanup

<Admonition type="warning" title="Important cleanup considerations">
- **Don't rename branches:** Renaming either the Git branch or Neon branch breaks name-matching logic and may cause unintended deletions
- **Avoid child branches:** Creating child branches on preview branches prevents automatic deletion
- **Role dependency:** The integration depends on the selected role - removing it will break the integration
</Admonition>

### Disconnect integration

To disconnect the integration: **Neon Console → Integrations → Manage → Disconnect**. This stops creating new preview branches but doesn't remove existing branches or the integration from Vercel.

---

## Limitations

- **One-to-one relationship:** Each Neon project connects to exactly one Vercel project
- **Integration exclusivity:** Cannot coexist with the Vercel-Managed Integration in the same Vercel project
- **Role dependency:** Integration requires the selected PostgreSQL role to remain active

---

## Next steps

<CheckList title="After Installation">

<CheckItem title="Test preview branching" href="#how-preview-branching-works">
Create a feature branch and push changes to verify preview deployments work correctly
</CheckItem>

<CheckItem title="Configure build commands" href="#how-preview-branching-works">
Add migration commands to Vercel's build settings if using an ORM like Prisma
</CheckItem>

<CheckItem title="Set up branch cleanup" href="#branch-cleanup">
Enable automatic cleanup or establish a manual cleanup process
</CheckItem>

<CheckItem title="Customize environment variables" href="#environment-variables">
Review and adjust which database variables are injected into your deployments
</CheckItem>

</CheckList>

---

## Troubleshooting

### Environment variable conflicts

If you see "Failed to set environment variables" during setup, remove conflicting variables in Vercel first:

1. Go to **Vercel → Settings → Environment Variables**
2. Remove or rename existing `DATABASE_URL`, `PGHOST`, `PGUSER`, `PGDATABASE`, or `PGPASSWORD` variables
3. Retry the integration setup

### Integration stops working

**Issue:** Preview branches no longer created
**Cause:** The PostgreSQL role selected during setup was deleted
**Solution:** Reinstall the integration with a valid role, or change the role in **Neon Console → Integrations → Manage → Settings**

<NeedHelp/>
