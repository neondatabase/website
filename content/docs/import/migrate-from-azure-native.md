---
title: Migrate from Neon Azure Native Integration
subtitle: Learn how to transfer projects and transition from Azure-managed to Neon-managed organizations.
enableTableOfContents: true
updatedOn: '2025-10-16T00:00:00.000Z'
---

<Admonition type="important">
The Neon Azure Native Integration is deprecated and reaches end of life on **January 31, 2026**. 
</Admonition>

This guide describes how to migrate your projects to a Neon-managed organization to continue using Neon.

## Getting started

Before you begin your migration, be aware of the following:

- A new Neon-managed organization has already been created for you in the Neon Console.
- You can find it in the organization dropdown named `neon-managed-[org-name]` where `[org-name]` is the original organization name.
- You can [rename this organization](/docs/manage/orgs-manage#rename-an-organization) at any time.
- Only admins are migrated to the new organization. Members and project collaborators must be re-added manually after migration.
- If you are on a paid Azure plan, your new Neon-managed organization has been created on the Free plan. You must upgrade to a paid plan (Scale recommended for Azure Scale and Business customers) to maintain your current features and avoid service limitations.
- Application connection strings remain the same after transfer because the project structure does not change.

To migrate your projects to a Neon-managed organization:

<Steps>

## Locate your new Neon-managed organization

1. Sign in to the [Neon Console](https://console.neon.tech).
2. Open the organization dropdown and confirm that a new organization named `neon-managed-[org-name]` is listed.
3. Optionally [rename this organization](/docs/manage/orgs-manage#rename-an-organization) to a custom name.

## Upgrade your plan (paid users only)

If you are on a paid Azure plan, upgrade your new Neon-managed organization before transferring projects:

1. Switch to your `neon-managed-[org-name]` organization.
2. Go to **Billing** and select **Change plan**.
3. Select **Scale** (recommended for Azure Scale and Business customers) or **Launch**.
4. Complete the upgrade process.

This ensures your projects retain all paid features after transfer.

## Transfer your projects

You can transfer all projects at once or individually. From your Azure-managed organization in the Neon Console:

1. Go to **Organization** -> **Settings** -> **Transfer projects**.
2. Click **Select all**, then click **Next**.
3. Choose your new Neon-managed organization as the destination.
4. Confirm the transfer.

Projects appear in your new organization immediately after the transfer completes. For more details about project transfers, see [Transfer projects](/docs/manage/orgs-project-transfer).

## Update your organization configuration

After the transfer:

- Re-add any members or project collaborators who need access. See [Manage organization members](/docs/manage/orgs-manage#add-a-user-to-an-organization) for instructions.
- Verify that all projects appear in your new Neon-managed organization.
- If you use [API keys](/docs/manage/api-keys), note that existing keys are tied to your Azure-managed organization. Create new keys in your Neon-managed organization and update them in your applications, scripts, and integrations.

## Delete your Azure-managed resource

<Admonition type="important">
Only delete your Azure resource after confirming all projects have been transferred. Deleting the Azure resource before transferring projects will permanently delete all projects and data in your Azure-managed organization.
</Admonition>

1. Sign in to the [Azure Portal](https://portal.azure.com).
2. Select your Neon resource created through the Azure Marketplace.
3. Confirm that no projects remain in your Azure-managed organization.
4. On the **Overview** page, select **Delete**.
5. Confirm the deletion by entering the resource's name.
6. Choose the reason for deleting the resource.
7. Select **Delete** to finalize.

Deleting the resource stops all Azure Marketplace billing and completes your transition to a Neon-managed organization.

</Steps>

## After you migrate

Your projects are now managed directly in the Neon Console. All connection strings and project configurations remain the same. You can now manage billing, upgrades, and support directly through Neon.

If you need help, contact Neon Support through the Neon Console or visit the [support documentation](/docs/introduction/support).
