---
title: Set hard usage limits to cap your spend
subtitle: Use the Neon API to set enforced consumption limits that suspend a project's compute when usage reaches a cap you choose
enableTableOfContents: true
---

[Spending notifications](/docs/introduction/spending-notifications) email you when your bill approaches a dollar amount, but they don't stop usage. If you want Neon to actually _stop_ a project when it reaches a cap, you can set **consumption limits** (quotas) with the Neon API. When a project hits a quota, Neon suspends its computes for the rest of the billing period. This is the closest thing Neon has to a hard spending cap.

This guide gets you from zero to an enforced limit in about five minutes: set a limit, confirm it, watch your usage against it, and adjust it later.

<Admonition type="warning" title="A hard limit really does stop your database">
When a project reaches a consumption limit, **all of its computes are suspended and stay suspended until the next monthly billing period begins**. This is not scale to zero: the compute does not wake on the next connection. Your application loses its database until you raise the limit or the month resets. Set limits with enough headroom that a normal traffic spike doesn't take you offline, and pair them with [spending notifications](/docs/introduction/spending-notifications) so you get a warning first.
</Admonition>

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to set an enforced usage limit on a project</p>
<p>How to monitor usage against that limit</p>
<p>How to change or remove a limit</p>
<p>How to size limits to a dollar budget</p>
<p>How limits work alongside spending notifications</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/spending-notifications">Spending notifications</a>
<a href="/docs/guides/consumption-limits">Configure consumption limits (reference)</a>
<a href="/docs/introduction/usage-calculations">Usage and cost calculations</a>
<a href="/docs/manage/api-keys#create-an-api-key">Neon API keys</a>
</DocsList>
</InfoBlock>

## How consumption limits differ from spending notifications

The two features solve related problems in different units. You'll usually want both.

|                  | Spending notifications         | Consumption limits (this guide)             |
| ---------------- | ------------------------------ | ------------------------------------------- |
| Unit             | Dollars (whole org)            | Usage metrics, per project                  |
| Action           | Email alert only               | Suspends the project's computes             |
| Scope            | Your organization's total bill | One project at a time                       |
| Where you set it | Console or Management API      | Neon API (`quota` object)                   |
| Reset            | Billing cycle                  | Billing cycle (except `logical_size_bytes`) |

A good pattern: set an org-wide **spending notification** as your early warning in dollars, and set a per-project **consumption limit** as the backstop that actually stops runaway usage. The notification fires first; the limit catches anything that gets past it.

## Before you start

You need:

- A [Neon API key](/docs/manage/api-keys#create-an-api-key). Export it so the examples below work as written:

  ```bash
  export NEON_API_KEY="your_api_key"
  ```

- The **project ID** of the project you want to protect. Find it in the Console under **Settings → General**, or list your projects with `GET /projects`.

The examples use `curl` and [`jq`](https://jqlang.github.io/jq/) to keep the output readable.

## Which metric should you limit?

You can set a quota on any of these per-project metrics. Compute is the one that maps most directly to dollars and is the best default for a spending cap.

| Metric                 | Caps                                           | Use it to                                                                      |
| ---------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| `compute_time_seconds` | CPU time weighted by compute size (CU-seconds) | **Cap spend.** This is the metric that maps cleanly to a dollar budget.        |
| `active_time_seconds`  | Wall-clock time any compute is active          | Cap active hours regardless of compute size                                    |
| `written_data_bytes`   | Data written across the project this month     | Guard against a runaway write workload (not a storage-cost cap)                |
| `data_transfer_bytes`  | Egress out of Neon this month                  | Guard against runaway egress (mind the free allowance below)                   |
| `logical_size_bytes`   | Size of a **single branch**                    | Stop one branch from growing past a fixed size (hard limit, not reset monthly) |

<Admonition type="note">
`compute_time_seconds` is measured in **CU-seconds**: one second at 0.25 CU costs 0.25 compute-seconds, while one second at 4 CU costs 4. Because Neon bills compute by the CU-hour, this metric is the one you can translate directly into dollars (see [Size a limit to a dollar budget](#size-a-limit-to-a-dollar-budget)).

`written_data_bytes` and `data_transfer_bytes` are usage guardrails, not cost proxies: storage is billed on how much data you _store_ (GB-months), not how much you write, and egress includes a monthly free allowance. Use them to catch abnormal workloads, not to hit a precise dollar figure.
</Admonition>

## Set a hard limit

<Steps>

## Set the limit

This `PATCH` caps `compute_time_seconds` at 340,000 CU-seconds (about $10 of compute on the Launch plan). Replace `$PROJECT_ID` with your project ID.

```bash
curl --request PATCH \
     --url "https://console.neon.tech/api/v2/projects/$PROJECT_ID" \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project": {
    "settings": {
      "quota": {
        "compute_time_seconds": 340000
      }
    }
  }
}' | jq '.project.settings.quota'
```

The response echoes the quota you set:

```json
{
  "compute_time_seconds": 340000
}
```

## Confirm it's active

Read the project back and check that the quota is stored:

```bash
curl --silent \
     --url "https://console.neon.tech/api/v2/projects/$PROJECT_ID" \
     --header "Authorization: Bearer $NEON_API_KEY" | jq '.project.settings.quota'
```

That's it. The limit is now enforced. If you'd rather set the quota when you first create a project (for example, in an automation that provisions projects), pass the same `quota` object to the [Create project](/docs/reference/api/projects/create-project) endpoint instead. See [Configure consumption limits](/docs/guides/consumption-limits#set-quotas-when-you-create-the-project) for that variant.

</Steps>

## Monitor your usage against the limit

The same [Get project](/docs/reference/api/projects/get-project) response that stores your quota also reports current usage for the billing period, using the **same metric names**. That makes tracking exact: compare the live metric to the quota you set.

```bash
curl --silent \
     --url "https://console.neon.tech/api/v2/projects/$PROJECT_ID" \
     --header "Authorization: Bearer $NEON_API_KEY" \
| jq '{
    used_compute_seconds: .project.compute_time_seconds,
    limit_compute_seconds: .project.settings.quota.compute_time_seconds,
    used_active_seconds: .project.active_time_seconds,
    written_data_bytes: .project.written_data_bytes,
    data_transfer_bytes: .project.data_transfer_bytes,
    period_start: .project.consumption_period_start,
    period_end: .project.consumption_period_end
  }'
```

Example response:

```json
{
  "used_compute_seconds": 128400,
  "limit_compute_seconds": 340000,
  "used_active_seconds": 210000,
  "written_data_bytes": 4200000000,
  "data_transfer_bytes": 180000000,
  "period_start": "2026-08-01T00:00:00Z",
  "period_end": "2026-09-01T00:00:00Z"
}
```

Here the project has used 128,400 of its 340,000 compute-seconds (about 38%) this period, and the counters reset at `period_end`. Poll this endpoint on a schedule to graph usage or fire your own alerts.

A few things to know:

- Metrics update every 15 minutes and can take up to an hour to be fully reportable, so treat the numbers as near-real-time, not instantaneous.
- The per-project **Get project** call works on every plan. The granular [consumption history endpoint](/docs/guides/consumption-metrics) offers per-hour and per-day breakdowns but is available only on Scale and above; for tracking toward a limit, the Get project fields are what you want.
- `GET /projects` (the list endpoint) does **not** include these usage fields. Request a single project by ID to see them.

## Change or remove a limit

Raising, lowering, or clearing a limit is the same `PATCH` you used to set it.

**Raise the limit** (for example, a user upgraded their plan) by sending a larger value:

```bash
curl --request PATCH \
     --url "https://console.neon.tech/api/v2/projects/$PROJECT_ID" \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{"project":{"settings":{"quota":{"compute_time_seconds":850000}}}}' \
| jq '.project.settings.quota'
```

**Remove a limit** by setting that metric to `0`. Zero means "no limit," so this both removes the cap and, if the project was suspended because it hit that limit, lets its computes start again:

```bash
curl --request PATCH \
     --url "https://console.neon.tech/api/v2/projects/$PROJECT_ID" \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{"project":{"settings":{"quota":{"compute_time_seconds":0}}}}' \
| jq '.project.settings.quota'
```

<Admonition type="important">
Setting a metric to `0` removes that limit permanently until you set it again. If you raise a limit only to recover a suspended project, remember to set a new limit afterward, or the project will run uncapped for the rest of the period.
</Admonition>

## What happens when a project hits the limit

When any configured metric reaches its quota:

- All of the project's computes are **suspended**.
- The suspension is **persistent**: unlike scale to zero, the compute does not wake on the next query or connection.
- Computes stay suspended until the **next billing period** starts (`consumption_period_end`), unless you [raise or remove the limit](#change-or-remove-a-limit).

Because a limit takes the database offline, give your users warning before they get there. Set a [spending notification](/docs/introduction/spending-notifications) at a dollar amount below your limit, and consider polling the [monitoring call](#monitor-your-usage-against-the-limit) to alert users as they approach the cap.

## Size a limit to a dollar budget

Compute is billed per **CU-hour**, and `compute_time_seconds` is measured in **CU-seconds**, so:

```text
compute_time_seconds = (budget ÷ compute_rate_per_CU_hour) × 3600
```

Compute rates ([Plans](/docs/introduction/plans#compute)): **Launch $0.106/CU-hour**, **Scale $0.222/CU-hour**. Using those rates:

| Monthly compute budget | `compute_time_seconds` (Launch) | `compute_time_seconds` (Scale) |
| ---------------------- | ------------------------------- | ------------------------------ |
| $5                     | 170,000                         | 81,000                         |
| $10                    | 340,000                         | 162,000                        |
| $25                    | 849,000                         | 405,000                        |
| $50                    | 1,698,000                       | 811,000                        |
| $100                   | 3,396,000                       | 1,622,000                      |

These figures cover **compute only**, which is the largest cost for most projects. Storage, instant restore, and egress bill separately, so your total bill can exceed a compute-only cap. If storage or egress is significant for you, add `written_data_bytes` or `data_transfer_bytes` quotas as guardrails too.

<Admonition type="note">
`data_transfer_bytes` includes a monthly free allowance (500 GB per project on Launch and Scale) before egress is billed, so a small egress quota can stop usage well before you've spent anything on transfer. Set it as a runaway-traffic guardrail, not as a dollar cap.
</Admonition>

### Example setups

**Trial or hobby project, ~$5/month compute (Launch):** stop the project before it costs more than a few dollars.

```bash
curl --request PATCH \
     --url "https://console.neon.tech/api/v2/projects/$PROJECT_ID" \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{"project":{"settings":{"quota":{"compute_time_seconds":170000}}}}'
```

**Small production project with headroom, ~$50/month compute (Launch), plus a 50 GB write guardrail:**

```bash
curl --request PATCH \
     --url "https://console.neon.tech/api/v2/projects/$PROJECT_ID" \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project": {
    "settings": {
      "quota": {
        "compute_time_seconds": 1698000,
        "written_data_bytes": 50000000000
      }
    }
  }
}'
```

**Cap a single branch's size at 10 GB** (a hard limit that is _not_ reset monthly, useful for a per-tenant branch):

```bash
curl --request PATCH \
     --url "https://console.neon.tech/api/v2/projects/$PROJECT_ID" \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{"project":{"settings":{"quota":{"logical_size_bytes":10000000000}}}}'
```

## Next steps

- Pair this with dollar-based [spending notifications](/docs/introduction/spending-notifications) so you get a warning before a project is suspended.
- For the full quota reference, multi-tenant billing patterns, and per-endpoint sizing settings, see [Configure consumption limits](/docs/guides/consumption-limits).
- To turn raw metrics into billing units and dollars, see [Usage and cost calculations](/docs/introduction/usage-calculations).

<NeedHelp/>
