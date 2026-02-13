---
title: Connecting with the Vercel-Managed Integration
subtitle: Create and manage Neon databases directly from your Vercel dashboard
summary: >-
  Covers the setup of the Vercel-Managed Integration for adding and managing
  Neon Postgres databases within the Vercel dashboard, including installation,
  billing management, and enabling automated Preview Branching.
redirectFrom:
  - /docs/guides/vercel-native-integration
  - /docs/guides/vercel-native-integration-previews
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.063Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
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

<Admonition type="tip" title="Neon Auth support for preview deployments">
If you've enabled [Neon Auth](/docs/auth/overview) on your production branch, it's automatically provisioned on preview branches too. Preview deployments receive `NEON_AUTH_BASE_URL` and `VITE_NEON_AUTH_URL` environment variables, letting you test authentication in isolated environments. Auth data branches with your database, so each preview has its own independent user profiles and sessions.
</Admonition>

To enable:

1. While connecting the project (step above) toggle **Required → Preview**.
2. Make sure **Resource must be active before deployment** is also on. This allows Vercel to wait for the branch to be ready.

Once enabled, the flow looks like this:

1.  Developer pushes to feature branch → Vercel kicks off Preview Deployment.
2.  Vercel sends a webhook to Neon → Neon creates branch `preview/<git-branch>`.
3.  Environment variables for the branch connection are injected via webhook at deployment time, overriding preview environment variables for this deployment only (cannot be accessed or viewed in your Vercel project's environment variable settings).
4.  (Optional) Run migrations in build step so schema matches code.

    ![Vercel build commands](/docs/guides/vercel_build_command.png)

        To apply schema changes automatically, add migration commands to your Vercel build configuration:

        1. Go to **Vercel Dashboard → Settings → Build and Deployment Settings**
        1. Enable **Override** and add your build commands, including migrations, for example:

           ```bash
           npx prisma migrate deploy && npm run build
           ```

    This ensures schema changes in your commits are applied to each preview deployment's database branch.

### Test the setup

To verify preview branching works:

1. Create a local branch: `git checkout -b test-feature`
2. Make any change and commit: `git commit -a -m "Test change"`
3. Push: `git push`
4. Check Vercel deployments and Neon Console branches to confirm the preview branch was created

---

## Automatic branch cleanup

Preview branches are automatically deleted when their corresponding Vercel deployments are deleted. This keeps your Neon project organized and reduces storage usage.

**How it works:**

- Each Git branch can have multiple Vercel deployments, all using the same Neon branch.
- When the last deployment for a Git branch is deleted (manually or via Vercel's deployment retention policy), Neon automatically deletes the corresponding database branch.
- Cleanup happens when deployments are deleted, which you can configure using [Vercel's retention policy settings](https://vercel.com/docs/deployment-retention). By default, Pre-Production Deployments (preview environments) are retained for 180 days:

  ![Vercel retention policy defaults](/docs/guides/vercel_retention_policy_defaults.png)

<Admonition type="note">
This deployment-based cleanup differs from the [Neon-Managed Integration](/docs/guides/neon-managed-vercel-integration), which deletes branches when Git branches are deleted.
</Admonition>

---

## Managing & billing

Because your database is managed by Vercel, you can only perform these actions **in the Vercel dashboard**:

- Change plan, billing tier, or scale settings (compute size, autoscaling, scale-to-zero)
- View or modify database configuration via **Storage → Settings → Change Configuration**
- Monitor usage via **Storage → Usage** (also available in Neon Console)
- Create additional databases (each becomes a new Neon project)
- Rename or delete a database (deleting removes the underlying Neon project permanently)
- Manage members / collaborators (handled through Vercel "Members", not the Neon Console) - (see [FAQ](#frequently-asked-questions-faq) for details)
- Delete the Neon organization (only happens automatically if you uninstall the integration)
- Update connection-string environment variables (prefix changes, etc.)

Everything else (querying data, branching, monitoring usage) works exactly the same in the Neon Console.

### Team member synchronization

Team membership changes in Vercel automatically sync to your Neon organization:

- **Initial access**: Team members must click **Open in Neon** from the Vercel integration page and complete authentication before they appear in the Neon organization. This one-time step links their Vercel identity to Neon.
- **Role changes**: When a team member's role changes in Vercel, their Neon role updates based on Vercel's JWT token mapping (see [FAQ](#why-do-vercel-team-members-with-member-role-have-the-admin-role-in-neon) for details). Most Vercel roles (Owner, Admin, Member) map to 'Admin' in Neon, while read-only roles (Viewer, Billing) map to 'Member' in Neon.
- **Removals**: When a user is removed from your Vercel team, they're automatically removed from the associated Neon organization.

This ensures both platforms stay aligned for security and access control.

### Project transfers between teams

When you transfer a Vercel project to another team, the linked Neon project automatically moves to the new team's Neon organization:

- The linked Neon project moves from the old organization to the new one.
- Environment variables and settings transfer with it.
- If the destination's plan doesn't support the project's requirements (autoscaling limits, point-in-time [restore window](/docs/introduction/restore-window), etc.), you'll be prompted to upgrade.

This eliminates the need to manually reconfigure integrations when reorganizing projects.

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

Preview branches are automatically deleted when their deployments expire, but you can also manually delete branches via:

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
| `POSTGRES_*` (legacy)                                             | Provided for backwards compatibility with Vercel Postgres templates |
| `NEON_AUTH_BASE_URL`, `VITE_NEON_AUTH_URL`                        | Neon Auth endpoints (when enabled on production branch)             |

---

## Limitations

- You cannot use this integration with the **Neon-Managed integration** in the same Vercel project
- **Neon CLI access**: Requires API key authentication (the `neon auth` command won't work since the account is Vercel-managed)
- Cannot install if you currently use Vercel Postgres (deprecated) - contact Vercel about transitioning
- **Preview deployment environment variables**: Branch-specific connection variables cannot be accessed or viewed in your Vercel project's environment variable settings (they're injected at deployment time only and not stored to avoid manual cleanup when branches are deleted)

## Frequently Asked Questions (FAQ)

### Why can't I see Vercel team members in the Neon Console?

Users added to your Vercel team aren't automatically visible in the Neon organization. Team members only appear in Neon when they:

1. Click the **Open in Neon** button from the Vercel integration page
2. Complete the authentication flow

### Why do Vercel team members with 'Member' role have the 'Admin' role in Neon?

This occurs due to how Vercel's JWT tokens map roles to the integration. According to [Vercel's documentation](https://vercel.com/docs/integrations/create-integration/marketplace-api#user-authentication), the JWT token's `user_role` claim doesn't directly map Vercel team roles:

- **ADMIN role in JWT**: Granted to users capable of installing integrations (includes Vercel Owner, Admin, and Member roles) → maps to Admin in Neon.
- **USER role in JWT**: Only granted to users with read-only Vercel roles (includes Billing and Viewer roles) → maps to Member in Neon.

As a result, most active Vercel team members receive Admin access in the Neon organization. This is expected behavior and ensures team members can fully manage database resources.

<NeedHelp/>
