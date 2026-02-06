---
title: Manage billing
subtitle: Invoices, payment methods, changing your plan, and other actions around
  managing your bill
summary: >-
  Covers the management of billing in Neon, including accessing the Billing
  page, updating payment methods, downloading invoices, changing plans, and
  account deletion.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.091Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to access the Billing page</p>
<p>How to update your billing information</p>
<p>How to download invoices</p>
<p>How to change plans</p>
<p>How to prevent further monthly charges</p>
<p>How to delete your account</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/plans">Neon plans</a>
<a href="/docs/introduction/monitor-usage">Monitoring billing and usage</a>
</DocsList>
</InfoBlock>

## View the Billing page

You can view and manage billing from the **Billing** page in the Neon Console.

To access your **Billing** page:

1. Navigate to the Neon Console.
1. Select your organization from the breadcrumb menu at the top-left of the console.
1. Select **Billing** from the menu to view the charges to date.

On the **Billing** page, you will find a summary outlining current charges and the details of your plan, your payment information, and your monthly invoices.

## Update your payment method

To update your payment method:

1. Navigate to the Neon Console.
1. Select your organization from the breadcrumb menu at the top-left of the console.
1. Select **Billing** from the menu.
1. Navigate to the **Payment info** section of the page.
1. Locate **Payment method** and click **Edit**.

If you are unable to update your payment method, please [contact support](/docs/introduction/support).

## Payment issues

### Missed payments

If an auto-debit payment transaction fails, Neon sends a request to update your payment method. Late fees and payment policies are described in the [Neon Platform Services Product Specific Schedule](/terms-of-service).

### Failing payments for Indian customers

Neon’s billing system uses **Stripe Checkout**, which does not currently support **e-Mandates** — a requirement from the Reserve Bank of India (RBI) for automatic recurring payments. Because of this, customers in India cannot set up automatic monthly payments. In the event of a payment failure, please [contact support](/docs/introduction/support) to request a link to your invoice to complete the payment manually.

## Update your billing email

To update your billing email:

1. Navigate to the Neon Console.
1. Select your organization from the breadcrumb menu at the top-left of the console.
1. Select **Billing** from the menu.
1. Navigate to the **Payment info** section of the page.
1. Locate **Billing email** and click **Edit**.

If you are unable to update your billing email, please [contact support](/docs/introduction/support).

## Invoices

A Neon invoice includes the charges and the amount due for the billing period. For an explanation of what you've been billed for, see [Usage metrics](/docs/introduction/plans#usage-metrics).

### Download invoices

To download an invoice:

1. Navigate to the Neon Console.
1. Select your organization from the breadcrumb menu at the top-left of the console.
1. Select **Billing** from the menu.
1. Navigate to the **Invoices** section of the page.
1. Find the invoice you want to download and select **Download** from the menu.

<Admonition type="note">
When an invoice is paid, Neon's billing system sends a payment confirmation email to the address associated with the Neon account.
</Admonition>

### Request a refund

If you find an issue with your invoice, you can request a refund. The request will be reviewed by the Neon billing team.

1. Navigate to the Neon Console.
1. Select your organization from the breadcrumb menu at the top-left of the console.
1. Select **Billing** from the menu.
1. Click the "View past invoices" button.
1. Find the invoice you want to request a refund for, and select **Request credit note** from the menu. Enter a problem description explaining the reason for the request.

## Change your plan

<Admonition type="note" title="Restart required for new limits">
If you're upgrading your plan, your compute will only pick up the new plan limits (such as max compute size and project storage) after the compute restarts. See [Restart a compute](/docs/manage/computes#restart-a-compute).
</Admonition>

To upgrade or downgrade your plan:

1. Navigate to the Neon Console.
1. Select your organization from the breadcrumb menu at the top-left of the console.
1. Select **Billing** from the menu.
1. Select **Change plan**.

Changing your plan to one with lower usage allowances may affect the performance of your applications. To compare plan allowances, see [Neon plans](/docs/introduction/plans#neon-plans).

If you are downgrading your plan, you will be required to remove any projects, branches, or data that exceed your new plan allowances.

To downgrade from a **legacy Enterprise plan**, please contact [Sales](/contact-sales). Cancellation of a legacy Enterprise plan is handled according to the Master Subscription Agreement (MSA) outlined in the Customer Agreement.

## How to prevent further monthly charges to your account

If you're on a Neon paid plan, you need to downgrade to the Free plan to avoid further monthly charges. You can do so from the [Billing](https://console.neon.tech/app/billing#change_plan) page in the Neon Console. Simply removing all Neon projects will **not** stop the monthly fee associated with your plan. You will continue to be invoiced until you downgrade to Free.

## Delete your account

If you would like to delete your Neon account entirely, please refer to the steps described here: [Deleting your account](/docs/manage/accounts#delete-account).

<NeedHelp/>
