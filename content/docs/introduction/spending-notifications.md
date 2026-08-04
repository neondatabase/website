---
title: Spending notifications
subtitle: Get alerts when your organization's Neon spending approaches a threshold you set
summary: >-
  Spending notifications alert organization admins when monthly Neon charges on
  Launch and Scale plans reach 80% and 100% of a configured threshold. Projects
  continue running and charges accumulate until you raise the threshold or the
  billing cycle resets. Organization admins set, edit, or disable notifications
  in the Neon Console or via the Management API.
redirectFrom:
  - /docs/introduction/spending-limit
enableTableOfContents: true
tag: new
tagTheme: green
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>What spending notifications do</p>
<p>Who can set them up</p>
<p>How to enable, edit, and disable notifications in the Console</p>
<p>How to manage notification thresholds with the Neon Management API</p>
<p>What happens when the threshold is reached</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/manage-billing">Manage billing</a>
<a href="/docs/introduction/monitor-usage">Monitor billing and usage</a>
<a href="/docs/introduction/cost-optimization">Cost optimization</a>
<a href="/docs/manage/api-keys#create-an-api-key">Neon API keys</a>
</DocsList>
</InfoBlock>

## About spending notifications

Spending notifications help you keep track of your organization's Neon spending. When charges approach the threshold you set, organization admins receive email alerts so they can take action before the bill grows further.

Spending notifications are available on the Launch and Scale plans. You can manage them from the **Billing** page in the Neon Console or with the [Neon Management API](#manage-spending-notifications-with-the-neon-api).

<Admonition type="comingSoon" title="Automatic project suspension">
Currently, email alerts are the only available action. Automatic project suspension is coming soon: when the threshold is reached, projects' computes will pause until you raise the threshold or the next monthly billing period begins.
</Admonition>

## Who can set up spending notifications

Only organization admins can enable, edit, or disable spending notifications. Other members see the notification threshold in read-only form on the **Billing** page.

## Alert thresholds

When a spending notification is configured, Neon sends email alerts to organization admins at two thresholds:

- When spending reaches 80% of the threshold
- When spending reaches 100% of the threshold

Neon checks your spending every 15 minutes. Once spending crosses a threshold, an alert email goes out, and reminders continue weekly until you raise the threshold or the billing cycle resets.

## Enable spending notifications

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select your organization from the breadcrumb menu at the top-left.
1. Select **Billing** from the menu.
1. On the **Spending Notifications** card, select **Enable**.
1. In the **Enable Spending Notifications** dialog, enter a whole-dollar amount.
1. Select **Enable**.

The **Spending Notifications** card now shows the current spending and a progress bar toward the threshold.

## Edit the threshold

1. Navigate to the **Billing** page.
1. On the **Spending Notifications** card, select **Edit**.
1. Update the amount and select **Save**.

You can also open the edit dialog from the over-threshold banner by selecting **Manage spending notifications**. The banner appears in the Console when spending is approaching the threshold or has reached it.

## Disable spending notifications

1. Navigate to the **Billing** page.
1. On the **Spending Notifications** card, select **Disable**.
1. Confirm in the **Disable Spending Notifications** dialog.

After you disable notifications, no further email alerts are sent and the over-threshold banner no longer appears.

## What happens when the threshold is reached

When your organization's monthly charges reach the threshold:

- Admins receive a final email alert.
- A banner appears in the Neon Console showing **Threshold reached**, with a **Manage spending notifications** link that opens the edit dialog.

Projects continue to run, and charges continue to accumulate, until you raise the threshold or the billing cycle resets at the start of the next month. Automatic project suspension is coming soon and will stop compute charges at the threshold.

<Admonition type="note">
A spending notification threshold applies to the organization's total monthly Neon charges across all projects in that organization. If you belong to multiple organizations, set a separate threshold for each.
</Admonition>

## Manage spending notifications with the Neon API

The Management API exposes spending limits at:

`https://console.neon.tech/api/v2/organizations/{org_id}/billing/spending_limit`

Replace `{org_id}` with your organization ID (see [Finding your org_id](/docs/manage/orgs-api#finding-your-org_id)). Authenticate with a [personal API key](/docs/manage/api-keys#create-an-api-key) or another allowed credential for the Management API.

| Action                      | Method                                                                                                                  | Who can use it                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Read the current threshold  | [Retrieve the organization's monthly spending limit](/docs/reference/api/organizations/get-organization-spending-limit) | Organization members with **read** access (Launch and Scale) |
| Set or change the threshold | [Set the organization's monthly spending limit](/docs/reference/api/organizations/set-organization-spending-limit)      | **Organization admins** only (Launch and Scale)              |
| Remove the threshold        | [Clear the organization's monthly spending limit](/docs/reference/api/organizations/delete-organization-spending-limit) | **Organization admins** only (Launch and Scale)              |

**Request body (`PUT`):** send `spending_limit_cents` as a positive integer (monthly threshold in **cents**; minimum **1**). For example, `$100.00` per month is `10000`. Values **`0`** and **`null`** are rejected; to clear a threshold, call **`DELETE`** on the same path (idempotent when no threshold is configured).

**Response (`GET` / `PUT` 200):** the API returns `spending_limit_cents`, or `null` when no threshold is set. Alerts at 80% and 100% of the threshold behave the same as for Console-managed notifications; computes are not suspended by this feature.

See the linked API reference pages for response codes, schemas, and **Try it** examples.

<NeedHelp/>
