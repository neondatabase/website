---
title: Spending limit
subtitle: Manage your organization's spending with better visibility and control
enableTableOfContents: true
tag: new
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>What a spending limit does</p>
<p>Who can set one</p>
<p>How to enable, edit, and disable a limit</p>
<p>What happens when the limit is reached</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/manage-billing">Manage billing</a>
<a href="/docs/introduction/monitor-usage">Monitor billing and usage</a>
<a href="/docs/introduction/cost-optimization">Cost optimization</a>
</DocsList>
</InfoBlock>

## About spending limits

A spending limit helps you control your organization's Neon spending. When charges approach the limit, organization admins receive email alerts so they can take action before the bill grows further.

Spending limits are available on the Launch and Scale plans. You manage them from the **Billing** page in the Neon Console.

<Admonition type="comingSoon" title="Automatic project suspension">
Currently, email alerts are the only available action. Automatic project suspension is coming soon: When the limit is reached, projects' computes will pause until you raise the limit or the next monthly billing period begins.
</Admonition>

## Who can set a spending limit

Only organization admins can enable, edit, or disable a spending limit. Other members see the limit in read-only form on the **Billing** page.

## Alert thresholds

When a spending limit is set, Neon sends email alerts to organization admins at two thresholds:

- When spending reaches 80% of the limit
- When spending reaches 100% of the limit

Neon checks your spending every 15 minutes. Once spending crosses a threshold, an alert email goes out, and reminders continue weekly until you raise the limit or the billing cycle resets.

## Enable a spending limit

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select your organization from the breadcrumb menu at the top-left.
1. Select **Billing** from the menu.
1. On the **Spending limit** card, select **Enable**.
1. In the **Enable spending limit** dialog, enter a whole-dollar amount.
1. Select **Enable**.

The **Spending limit** card now shows the current spending and a progress bar toward the limit.

## Edit the limit

1. Navigate to the **Billing** page.
1. On the **Spending limit** card, select **Edit**.
1. Update the amount and select **Save**.

You can also open the edit dialog from the over-limit banner by selecting **Manage spending limit**. The banner appears in the Console when spending is approaching the limit or has reached it.

## Disable the limit

1. Navigate to the **Billing** page.
1. On the **Spending limit** card, select **Disable**.
1. Confirm in the **Disable spending limit** dialog.

After you disable the limit, no further email alerts are sent and the over-limit banner no longer appears.

## What happens when the limit is reached

When your organization's monthly charges reach the limit:

- Admins receive a final email alert.
- A banner appears in the Neon Console showing **Limit reached**, with a **Manage spending limit** link that opens the edit dialog.

Projects continue to run, and charges continue to accumulate, until you raise the limit or the billing cycle resets at the start of the next month. Automatic project suspension is coming soon and will stop compute charges at the limit.

<Admonition type="note">
A spending limit applies to the organization's total monthly Neon charges across all projects in that organization. If you belong to multiple organizations, set a separate limit for each.
</Admonition>

<NeedHelp/>
