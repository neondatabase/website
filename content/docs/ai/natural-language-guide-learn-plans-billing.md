---
title: Learn Neon plans and billing
subtitle: Ask your AI assistant about plans, pricing, and billing—answers from our documentation
summary: >-
  Use natural language to learn how Neon plans and billing work. The summaries
  and prompts below are drawn from Neon's Plans, Manage billing, and Monitor
  usage docs so answers stay accurate and deterministic.
enableTableOfContents: true
updatedOn: '2026-02-08T00:00:00.000Z'
---

You can learn how Neon plans and billing work by asking your AI assistant. With the [Neon MCP Server](/docs/ai/neon-mcp-server) connected, the assistant can load Neon documentation and answer from it—important for billing, where details (rates, limits, invoice line items) must match our docs. The summaries below are taken from Neon's [Plans](/docs/introduction/plans), [Manage billing](/docs/introduction/manage-billing), and [Monitor billing and usage](/docs/introduction/monitor-usage) documentation. Use the suggested prompts to go deeper.

If you haven't already, run this in your **terminal** once so your assistant can use the Neon MCP Server:

```bash
npx neonctl@latest init
```

Then open your **AI chat** (Cursor or Claude Code) and try the prompts below. Ask the assistant to use Neon's documentation so answers match our published plans and billing.

## Neon plans (Free, Launch, Scale)

Neon offers three plans. **Free** is $0/month with fixed allowances (e.g. 100 projects, 10 branches per project, 100 CU-hours per project per month, 0.5 GB storage per project, 5 GB public transfer per month). **Launch** and **Scale** are usage-based: you pay only for what you use, with no minimum monthly fee. Launch is aimed at startups and growing teams; Scale is for production-grade workloads and larger companies, with higher limits (e.g. 1,000 projects, 25 branches per project), longer restore windows, and additional features such as compliance, private networking, and uptime SLA. See [Plans](/docs/introduction/plans).

**Ask your assistant:**

```text
Using Neon's documentation, what are the Free, Launch, and Scale plans and who is each plan for?
```

## How compute is billed (CU-hours)

Compute usage is measured in **CU-hours** (Compute Unit hours). One CU is approximately 4 GB RAM plus associated CPU and local SSD. Formula: **compute size × hours running = CU-hours**. Examples: 0.25 CU for 4 hours = 1 CU-hour; 2 CU for 3 hours = 6 CU-hours. **Free**: 100 CU-hours per project per month. **Launch**: $0.106/CU-hour. **Scale**: $0.222/CU-hour. All computes in a project count (including read replicas). With scale to zero, suspended computes do not accrue CU-hours. See [Plans — Compute](/docs/introduction/plans#compute).

**Ask your assistant:**

```text
Using Neon's documentation, how is Neon compute usage measured and billed (CU-hours) on each plan?
```

## How storage is billed (GB-month)

Storage is billed on actual usage in **GB-months**, metered hourly. **Root branches**: billed on actual (logical) data size. **Child branches**: billed on the **minimum** of accumulated changes since creation or logical data size—so you never pay more than your actual data size. **Free**: 0.5 GB per project. **Launch** and **Scale**: $0.35/GB-month; up to 16 TB logical data size per branch (contact Sales for more). See [Plans — Storage](/docs/introduction/plans#storage).

**Ask your assistant:**

```text
Using Neon's documentation, how is storage billed for root branches and child branches?
```

## Extra branches and instant restore storage

**Extra branches:** Free plan does not allow extra branches. On Launch and Scale, branches beyond the included allowance (10 or 25 per project) are billed at **$1.50/branch-month**, prorated hourly (~$0.002/hour). **Instant restore storage:** Neon retains change history (WAL) for point-in-time restore. Only **root branches** contribute to this charge; child branches do not. **Free**: 6-hour limit, up to 1 GB of history, no charge. **Launch**: up to 7 days, **$0.20/GB-month**. **Scale**: up to 30 days, **$0.20/GB-month**. See [Plans — Extra branches](/docs/introduction/plans#extra-branches) and [Plans — Instant restore](/docs/introduction/plans#instant-restore).

**Ask your assistant:**

```text
Using Neon's documentation, how are extra branches and instant restore storage billed?
```

## Public and private network transfer

**Public network transfer** (egress) is data sent from your databases over the public internet. It includes data sent via logical replication. **Free**: 5 GB/month included. **Launch** and **Scale**: 100 GB/month included, then **$0.10/GB**. **Private network transfer** (e.g. AWS PrivateLink) is available only on **Scale**, billed at **$0.01/GB** (bidirectional). See [Plans — Public network transfer](/docs/introduction/plans#public-network-transfer) and [Plans — Private network transfer](/docs/introduction/plans#private-network-transfer).

**Ask your assistant:**

```text
Using Neon's documentation, what are the public and private network transfer allowances and overage rates?
```

## Viewing and managing your bill

Billing is managed from the **Billing** page in the Neon Console: select your organization, then **Billing**. There you can view current charges and plan details, update payment method and billing email, download invoices, change your plan (upgrade or downgrade), and request refunds or credit notes. Invoices under $0.50 are not collected. To stop monthly charges on a paid plan, you must downgrade to the Free plan (removing all projects does not stop invoicing). See [Manage billing](/docs/introduction/manage-billing).

**Ask your assistant:**

```text
Using Neon's documentation, how do I view my bill, download invoices, and change my plan in Neon?
```

## What appears on your invoice (usage metrics)

Neon invoices use these metrics when they apply: **Compute, CU-hour**; **Storage (root branches), GB-month**; **Storage (child branches), GB-month**; **Instant restore storage, GB-month**; **Extra branches, branch-month**; **Public network transfer**; **Private network transfer** (Scale only). The Billing page in the Console shows the same usage metrics. For how Console metrics map to invoice line items, see [Plans — Usage metrics](/docs/introduction/plans#usage-metrics). Usage can also be retrieved via the [Neon API](/docs/introduction/monitor-usage#retrieve-usage-metrics-with-the-neon-api) and [Consumption API](/docs/guides/consumption-metrics). See [Monitor billing and usage](/docs/introduction/monitor-usage).

**Ask your assistant:**

```text
Using Neon's documentation, what usage metrics appear on my Neon invoice and where do I see them in the Console?
```

## Cost optimization (from our docs)

Neon's docs recommend: set a maximum autoscaling limit to cap compute; enable scale to zero for idle databases; delete unused branches to reduce storage; shorten the restore window to reduce instant restore storage. For full strategies, see [Cost optimization](/docs/introduction/cost-optimization).

**Ask your assistant:**

```text
Using Neon's documentation, what does Neon recommend for controlling or optimizing my Neon costs?
```

## Go further

Ask open-ended questions and remind the assistant to use Neon docs, for example:

- "Using Neon's documentation, what happens if I exceed my Free plan limits?"
- "Using Neon's documentation, how do I downgrade or stop being charged on a paid plan?"
- "Using Neon's documentation, what is the difference between root branch and child branch storage billing?"

For the authoritative reference, use the links in each section above.

## See also

- [Plans](/docs/introduction/plans) for the full plan comparison and all rates
- [Manage billing](/docs/introduction/manage-billing) for invoices, payment, and plan changes
- [Monitor billing and usage](/docs/introduction/monitor-usage) for the Billing page and API
- [Cost optimization](/docs/introduction/cost-optimization) for strategies to reduce costs
- [Plans and billing](/docs/introduction/about-billing) for the billing hub

<NeedHelp/>
