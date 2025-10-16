---
title: Migrate from Neon Azure Native Integration
subtitle: Learn how to transfer projects and transition from Azure-managed to Neon-managed organizations.
enableTableOfContents: true
updatedOn: '2025-10-16T00:00:00.000Z'
---

The Neon Azure Native Integration is being deprecated and will reach end of life on **January 31, 2026**. To continue using Neon, you must move your projects from your Azure-managed organization to your new Neon-managed organization.

## Before you begin

- A new Neon-managed organization has already been created for you in the Neon Console.
- You can find it in the organization dropdown named `neon-managed-[org-name]` where `[org-name]` is the original organization name.
- You can [rename this organization](/docs/manage/orgs-manage#rename-an-organization) at any time.
- Admins from your existing organization have been added to the new one.
- Members and project collaborators need to be re-added after migration.
- Application connection strings remain the same after transfer because the project structure does not change.

<Steps>

## Locate your new Neon-managed organization

1. Sign in to the Neon Console at https://console.neon.tech
2. Open the organization dropdown and confirm that a new organization named `neon-managed-[org-name]` is listed
3. If desired, [rename this organization](/docs/manage/orgs-manage#rename-an-organization) to a custom name

## Transfer your projects

You can transfer all projects at once or individually. From your Azure-managed organization in the Neon Console:

1. Go to **Organization** -> **Settings** -> **Transfer projects**
2. Click **Select all** and click **Next**
3. Choose your new Neon-managed organization as the destination
4. Confirm the transfer

Projects will appear in your new organization once the transfer is complete. For more details about project transfers, see [Transfer projects](/docs/manage/orgs-project-transfer).

## Update your organization configuration

After the transfer:

- Re-add any members or project collaborators who need access.
- Update any organization [API keys](/docs/manage/api-keys) if you were using them.
- Verify that all projects appear in your new Neon-managed organization.

## Delete your Azure-managed resource

1. Sign in to the Azure Portal
2. Open your Neon resource created through the Azure Marketplace
3. Confirm that no projects remain in your Azure-managed organization
4. Select **Delete** to remove the Neon resource and cancel your Azure subscription

Deleting the resource completes the transition from the Azure-managed integration to a Neon-managed organization.

</Steps>

## After you migrate

Your projects are now managed directly in the Neon Console. All connection strings and project configurations remain the same. You can now manage billing, upgrades, and support directly through Neon.

If you need help, contact Neon Support through the Neon Console or visit the [support documentation](/docs/introduction/support).