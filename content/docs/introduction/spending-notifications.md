---
title: Spending limits
subtitle: Get alerts when your organization's Neon spending approaches a limit you set, and optionally suspend services when it's reached
summary: >-
  Organization admins on the Launch and Scale plans can set a spending limit for
  the current invoice period. Neon emails admins at 80% and 100% of the limit.
  With service suspension turned on, Neon also suspends Postgres computes,
  Functions, and Object Storage access once it detects the limit is reached.
  Spend data is delayed by 1-2 hours, so a spending limit isn't a hard cap.
  Manage limits in the Neon Console, with the Neon CLI, or with the Management
  API.
redirectFrom:
  - /docs/introduction/spending-limit
enableTableOfContents: true
updatedOn: '2026-11-24T11:14:19.985Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How spending limits and notifications work</p>
<p>How to set a limit and turn on service suspension</p>
<p>What Neon suspends when the limit is reached, and what keeps running</p>
<p>How to restore suspended services</p>
<p>How to manage spending limits with the Neon CLI or Management API</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/manage-billing">Manage billing</a>
<a href="/docs/introduction/monitor-usage">Monitor billing and usage</a>
<a href="/docs/introduction/cost-optimization">Cost optimization</a>
<a href="/docs/ai-gateway/prepaid-credits">AI Gateway prepaid credits</a>
</DocsList>
</InfoBlock>

## About spending limits

A spending limit is a dollar amount you set for your organization's Neon charges in the current invoice period. It works in one of two ways:

- **Notifications only** (default): Neon emails your organization admins at 80% and 100% of the limit. Your projects keep running, and charges keep accruing.
- **Notifications and service suspension**: Neon sends the same emails, and when it detects that spending has reached the limit, it suspends services that add charges, such as Postgres computes and Functions. See [What happens when the limit is reached](#what-happens-when-the-limit-is-reached).

Spending limits are available on the Launch and Scale plans. You can manage them from the **Billing** page in the Neon Console, with the [Neon CLI](#manage-spending-limits-with-the-neon-cli), or with the [Neon Management API](#manage-spending-limits-with-the-neon-api).

<Admonition type="warning" title="A spending limit isn't a hard cap">
Neon doesn't track spending in real time. Spend data can take 1-2 hours to arrive, so your actual spending can go past the limit before Neon detects it. Notification emails and service suspension can both arrive after you've already gone over. If you rely on a spending limit to control costs, set it below the most you're willing to spend.
</Admonition>

## Who can manage spending limits

Only organization admins can set, edit, or remove a spending limit, and turn service suspension on or off. Other members see the limit in read-only form on the **Billing** page.

## How Neon measures spending against the limit

The limit applies to your organization's total Neon charges across all projects in the **current invoice period**. It's the same amount shown in the spending sections of the **Billing** page.

- The amount counted toward the limit resets when a new invoice period starts.
- A plan change, such as upgrading from Launch to Scale, starts a new invoice period. The amount counted toward the limit starts again from zero, so your combined spending for the month can be higher than the limit.
- If your organization moves to a plan that doesn't support spending limits, such as the Free plan, Neon removes the limit.
- If you belong to multiple organizations, set a separate limit for each.

[AI Gateway](/docs/ai-gateway/prepaid-credits) usage isn't governed by the spending limit. Its prepaid credit balance acts as its own limit.

## Alert thresholds

When a spending limit is set, Neon sends email alerts to organization admins at two thresholds:

- When spending reaches 80% of the limit
- When spending reaches 100% of the limit

Neon checks your spending every 15 minutes against the latest spend data it has. Because that data can be 1-2 hours behind, an alert can arrive after spending has already passed the threshold. Once spending crosses a threshold, an alert email goes out, and reminders continue weekly until you raise the limit or a new invoice period starts.

## Set a spending limit

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select your organization from the profile menu in the top-right of the console.
1. Select **Billing** from the menu.
1. On the **Spending Notifications** card, select **Enable**.
1. Enter a dollar amount.
1. To suspend services when the limit is reached, select **Suspend services when this limit is reached**. Leave it cleared to get email alerts only.
1. Select **Enable**.

The card now shows your current spending and a progress bar toward the limit. When service suspension is on, the card says so, and reminds you that cost data can be delayed by 1-2 hours and that stored data continues to incur charges.

You can set a limit below what you've already spent in the current invoice period. If service suspension is on, Neon can suspend services soon after you save.

## Edit the limit or service suspension

1. Navigate to the **Billing** page.
1. On the **Spending Notifications** card, select **Edit**.
1. Update the amount, or select or clear **Suspend services when this limit is reached**.
1. Select **Save**.

You can also open the edit dialog from the Console banner that appears when spending is approaching or has reached the limit. With service suspension on, the banner action is **Manage spending limit**.

## Remove a spending limit

1. Navigate to the **Billing** page.
1. On the **Spending Notifications** card, select **Disable**.
1. Confirm in the dialog.

After you remove the limit, Neon stops sending alerts, the banner no longer appears, and any services suspended by the limit are restored.

## What happens when the limit is reached

When Neon detects that your organization's spending has reached the limit:

- Admins receive a final email alert.
- A banner appears in the Neon Console.

If service suspension is off, that's all. Projects continue to run, and charges continue to accrue until a new invoice period starts.

If service suspension is on, Neon also blocks services that add charges, across every project in the organization:

| Service           | Behavior while the limit is reached                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| Postgres computes | Running computes are suspended. Computes can't start, and you can't create new ones.                                 |
| Database data     | You can't read, write, or delete data, because those operations need a running compute.                              |
| Snapshots         | You can't create or restore snapshots.                                                                               |
| Functions         | Running Functions are shut down, and you can't deploy new ones.                                                      |
| Object Storage    | You can't read, write, or delete objects.                                                                            |
| OTel exports      | Exports keep running. Export traffic isn't metered, so stopping it wouldn't reduce your bill.                        |
| AI Gateway        | Not affected by the spending limit. Its [prepaid credit balance](/docs/ai-gateway/prepaid-credits) is its own limit. |

Stored resources aren't deleted. Your data, branches, snapshots, and objects stay in your organization, and storage charges keep accruing while services are suspended. Because you can't delete data while the limit is reached, you can't reduce storage costs until you restore access.

### Errors you might see

- **Postgres connections** fail with SQLSTATE `57P03` (`cannot_connect_now`) and this message: `This organization's spending limit has been reached. Increase or disable the limit in the Neon Console to reconnect.` Don't retry these connections automatically. They keep failing until you restore access.
- **Management API requests** that would start or create a compute fail with the reason `SPEND_CAP_EXCEEDED`. Creating a compute returns `403 Forbidden`.

## Restore suspended services

To restore services, do one of the following on the **Billing** page or with the API:

- Raise the limit above your current spending.
- Turn off **Suspend services when this limit is reached**.
- Remove the limit.

Neon restores access on its next spending check, which runs every 15 minutes. Suspended Postgres computes start again on the next connection. Services are also restored automatically when a new invoice period starts.

## Manage spending limits with the Neon CLI

The [`neon orgs spending-limit`](/docs/cli/orgs#spending-limit) commands read, set, and remove the limit in US dollars. The CLI converts the amount to cents for you:

```bash
neon orgs spending-limit get --org-id <org_id>
neon orgs spending-limit set 500 --org-id <org_id>
neon orgs spending-limit delete --org-id <org_id>
```

Setting the amount with the CLI keeps your current service suspension setting. To turn service suspension on or off, use the Console or the API.

## Manage spending limits with the Neon API

You can manage spending limits through the Management API at:

`https://console.neon.tech/api/v2/organizations/{org_id}/billing/spending_limit`

Replace `{org_id}` with your organization ID (see [Finding your org_id](/docs/manage/orgs-api#finding-your-org_id)). Authenticate with a [personal API key](/docs/manage/api-keys#create-an-api-key) or another allowed credential for the Management API.

| Action                  | Method                                                                                                     | Who can use it                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Read the current limit  | [Retrieve organization spending limit](/docs/reference/api/organizations/get-organization-spending-limit)  | Organization members with **read** access (Launch and Scale) |
| Set or change the limit | [Set organization spending limit](/docs/reference/api/organizations/set-organization-spending-limit)       | **Organization admins** only (Launch and Scale)              |
| Remove the limit        | [Remove organization spending limit](/docs/reference/api/organizations/delete-organization-spending-limit) | **Organization admins** only (Launch and Scale)              |

**Request body (`PUT`):**

- `spending_limit_cents`: the limit for the current invoice period in cents, as a positive integer. For example, `$100.00` is `10000`. Values `0` and `null` are rejected. To remove a limit, call `DELETE` on the same path. `DELETE` succeeds even when no limit is set.
- `suspend_services_on_limit` (optional): set to `true` to suspend services when the limit is reached, or `false` for email alerts only. Omit it to keep the current setting. It defaults to `false`.

This example sets a $100 limit and turns on service suspension:

```bash
curl -X PUT "https://console.neon.tech/api/v2/organizations/$ORG_ID/billing/spending_limit" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"spending_limit_cents": 10000, "suspend_services_on_limit": true}'
```

**Response (`GET` / `PUT` 200):** the API returns `spending_limit_cents` (or `null` when no limit is set) and `suspend_services_on_limit`.

See the linked API reference pages for response codes, schemas, and **Try it** examples.

## Spending limits and consumption limits

A spending limit works on your organization's total dollar spend. If you'd rather cap specific metrics on individual projects, you can set per-project consumption quotas with the Neon API. These work per project and per consumption metric (compute, storage, and data transfer). See [Configure consumption limits](/docs/guides/consumption-limits).

<NeedHelp/>
