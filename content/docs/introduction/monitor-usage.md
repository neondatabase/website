---
title: Monitor billing and usage
subtitle: Where to see usage and costs in the Console and via the API
summary: >-
  Learn where to monitor usage and costs for your Neon account: the Billing and
  Projects pages in the Console, and the consumption metrics API for
  usage-based plans.
enableTableOfContents: true
redirectFrom:
  - /docs/introduction/billing
updatedOn: '2026-02-06T22:07:33.094Z'
---

You can monitor usage and costs in the Neon Console or programmatically with the Neon API. For what each metric means and how it maps to your invoice, see [Usage metrics](/docs/introduction/plans#usage-metrics) and [Invoice metrics](/docs/introduction/plans#invoice-metrics) on the Plans page.

## View usage in the Neon Console

Neon exposes usage in two places: the **Billing** page (charges and plan summary) and the **Projects** page (org-level usage metrics).

### Billing page

From the **Billing** page (Organization → **Billing** in the Neon Console) you see this month's summary: current plan, included features, usage-based pricing, and **charges to date**. Invoice line items appear only when there is a charge for that metric.

To open the Billing page:

1. Navigate to the Neon Console.
1. Select your organization from the breadcrumb menu at the top-left.
1. Select **Billing**.

### Projects page

From the **Projects** page (Organization → **Projects**) you see an org-level summary of four metrics: **Compute**, **Storage**, **History**, and **Network transfer**.

- **History** is instant restore storage (the same as on your invoice).
- **Network transfer** combines public and private transfer; private network transfer only applies if you use [Private Networking](/docs/guides/neon-private-networking).

Usage is shown since the start of the current billing period. Metrics may be delayed by about an hour and are not updated for inactive projects.

<Admonition type="note" title="Billing metrics for pre-2025 custom contract customers">
If you signed a contract with Neon prior to 01/01/2025, different billing metrics apply:
- **Storage** is measured in GiBs instead of [GB-month](/docs/reference/glossary#gb-month), and if you exceed your contract's monthly storage allowance, extra storage units are automatically allocated and billed. Extra storage charges are applied based on the number of additional storage units needed to cover peak storage usage during the current billing period, prorated from the date the extra storage was allocated. Peak usage resets at the beginning of the next billing period.
- **Written data** is the total volume of data written from compute to storage during the monthly billing period, measured in gibibytes (GiB).

If you have questions or want to change the billing metrics defined in your contract, contact your Neon sales representative.
</Admonition>

## Retrieve usage with the API

On **usage-based plans** (Launch, Scale, Agent, and Enterprise), use the **project consumption metrics** API. It returns metrics that align with usage-based billing and match your invoice.

See [Querying consumption metrics](/docs/guides/consumption-metrics) for the endpoint, required and optional parameters, example requests and responses, pagination, polling behavior, and building usage dashboards.

<Admonition type="tip" title="Optimize your costs">
For strategies to reduce your Neon costs across compute, storage, branches, and data transfer, see [Cost optimization](/docs/introduction/cost-optimization).
</Admonition>
