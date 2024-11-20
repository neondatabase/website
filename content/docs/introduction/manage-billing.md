---
title: Manage billing
subtitle: Invoices, payment methods, changing your plan, and other actions around
  managing your bill
enableTableOfContents: true
updatedOn: '2024-10-14T11:46:51.929Z'
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
<a href="/docs/introduction/extra-usage">How extra usage works</a>
<a href="/docs/introduction/monitor-usage">Monitoring billing and usage</a>
<a href="/docs/introduction/usage-metrics">Neon's usage metrics</a>
</DocsList>
</InfoBlock>

## View the Billing page

A Neon account can view and manage billing from the **Billing** page in the Neon Console.

To access your **Billing** page:

1. Navigate to the Neon Console.
1. Select your Profile.
1. Select **Billing** from the menu.

On the **Billing** page, you will find a summary outlining current charges and the details of your plan, information about your current usage, upgrade and downgrade options, your payment information, and your monthly invoices.

## Update your payment method

To update your payment method:

1. Navigate to the Neon Console.
1. Select your Profile.
1. Select **Billing** from the menu.
1. Navigate to the **Payment info** section of the page.
1. Locate **Payment method** and click **Edit**.

If you are unable to update your payment method, please [contact support](/docs/introduction/support).

## Payment issues

### Missed payments

If an auto-debit payment transaction fails, Neon sends a request to update your payment method. Late fees and payment policies are described in [Neon’s Terms of Service](https://neon.tech/terms-of-service).

### Failing payments for Indian customers

Neon’s billing system, powered by Stripe, currently lacks support for e-Mandates, a requirement for automatic payments in India as per Reserve Bank of India (RBI) regulations. As a result, Indian customers are unable to complete automatic monthly payments through Neon's billing system. Instead, we recommend that Indian customers pay for their subscription via AWS Marketplace. Please refer to our [AWS Marketplace instructions](/docs/introduction/billing-aws-marketplace) for details.

## Update your billing email

To update your billing email:

1. Navigate to the Neon Console.
1. Select your Profile.
1. Select **Billing** from the menu.
1. Navigate to the **Payment info** section of the page.
1. Locate **Billing email** and click **Edit**.

If you are unable to update your billing email, please [contact support](/docs/introduction/support).

## Invoices

A Neon invoice includes the amount due for the billing period.

### Download invoices

To download an invoice:

1. Navigate to the Neon Console.
1. Select your Profile.
1. Select **Billing** from the menu.
1. Navigate to the **Invoices** section of the page.
1. Find the invoice you want to download and select **Download** from the menu.

<Admonition type="note">
When an invoice is paid, Neon's billing system sends a payment confirmation email to the address associated with the Neon account.
</Admonition>

### Request a refund

If you find an issue with your invoice, you can request a refund. The request will be reviewed by the Neon billing team.

1. Navigate to the Neon Console.
1. Select your Profile.
1. Select **Billing** from the menu.
1. Navigate to the **Invoices** section of the page.
1. Find the invoice you want to request a refund for, and select **Request refund** from the menu. Enter a problem description explaining the reason for the request.

## Change your plan

To upgrade or downgrade your plan:

1. Navigate to the Neon Console.
1. Select your Profile.
1. Select **Billing** from the menu.
1. Navigate to the **Change plan** section of the page and select the desired plan.

Changing your plan to one with lower usage allowances may affect the performance of your applications. To compare plan allowances, see [Neon plans](/docs/introduction/plans#neon-plans).

If you are downgrading your plan, you will be required to remove any projects, branches, or data that exceed your new plan allowances.

To downgrade from an [Enterprise](/docs/introduction/plans#enterprise) plan, please contact [Sales](https://neon.tech/contact-sales). Cancellation of an Enterprise plan is handled according to the Master Subscription Agreement (MSA) outlined in the customer agreement.

## How to prevent further monthly charges to your account

If you are on any of Neon's paid plans, you need to downgrade to the Free plan to avoid further monthly charges. You can do so from the [Billing](https://console.neon.tech/app/billing#change_plan) page in the Neon Console. Simply removing all Neon projects from your account will not stop the monthly fee associated with your plan. You will continue to be invoiced until you downgrade to Free. For example, if you are on the [Launch](/docs/introduction/plans#launch) plan, which has a base monthly fee of $19 per month, you will continue to be charged $19 per month until you downgrade to the Free plan.

## Delete your account

If you would like to delete your Neon account entirely, please refer to the steps described here: [Deleting your account](/docs/manage/accounts#deleting-your-account).
