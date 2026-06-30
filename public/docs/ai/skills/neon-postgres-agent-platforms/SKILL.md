---

name: neon-postgres-agent-platforms
description: >-
  Build and operate multi-tenant AI agent platforms on Neon. Use this skill
  whenever the user is designing an agent/app builder, provisioning a Neon
  project or database per user/app/agent run, managing thousands of tenant
  projects, separating sponsored free users from paid customers, moving projects
  between orgs, choosing personal vs organization vs project-scoped API keys,
  tracking fleet consumption or Agent Plan costs, creating compound checkpoints
  that combine DB snapshots with source revisions/secrets/deploy metadata, or
  orchestrating snapshot/restore flows for generated apps. Also use it for Neon
  Agent Program, Agent Plan, org/project limits, HIPAA, co-marketing, support, or
  neondatabase/neon-for-agent-platforms examples.
license: Apache-2.0
---

# Neon AI Agent Program

Companion to `**neon-postgres**` (install that first). This skill covers
fleet-scale control plane for the Neon Agent Program: dual-org layout, project
transfer, per-tenant provisioning, compound checkpoints, consumption, and
commercial terms.

For connection strings, drivers, ORMs, branching tutorials, Auth in apps, Data
API, and MCP, use `**neon-postgres**` and [Neon docs](https://neon.com/docs).

## Scope

Use `**neon-postgres**` for general Neon usage. Use **this skill** when the
question involves:

- Dual-org economics and API keys (personal, organization, project-scoped)
- Project-per-tenant provisioning and transfer
- Fleet-wide snapshot/restore orchestration and housekeeping
- Compound checkpoints
- Consumption polling for metered fleets
- Agent Plan commercial terms (with links, not invented numbers)
- Partner support paths

## Install Skills

```bash
npx skills add neondatabase/agent-skills -s neon-postgres
```

## Assistants: what you can do after install

With `**neon-postgres**` and **this skill** loaded, you have enough context for
platform-level Neon work: dual-org layout, provisioning a project for a new
tenant, compound checkpoints, org-wide consumption polling, and
transfer/upgrade flows—without the user pasting long documentation.

**Where runnable examples live:** TypeScript samples run from this skill’s [`scripts/`](https://github.com/neondatabase/neon-for-agent-platforms/tree/main/skills/neon-postgres-agent-platforms/scripts)
directory (`package.json`, `npm run …`). The `**references/**` directory
keeps markdown guides beside the runnable examples;
[MANAGEMENT_API_SAMPLES.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/skills/neon-postgres-agent-platforms/references/MANAGEMENT_API_SAMPLES.md)
is the script catalog and env map. The human **Quick start** is the root
[README](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/README.md#quick-start).

## Gotchas

Non-obvious facts agents often get wrong:

- **Checkpoints are compound records.** A tenant checkpoint includes source
revision + Neon snapshot/branch + secrets/env version + deploy URL + agent
metadata. Do not equate "checkpoint" with "Neon branch" alone. See the
[compound checkpoints doc](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/skills/neon-postgres-agent-platforms/references/COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md).
- **Cross-org transfer** needs a **personal** API key (org keys only work
inside one org). Projects with **GitHub or Vercel** integrations in Neon **cannot
be transferred**; the API returns **422** ([Transfer projects](https://neon.com/docs/manage/orgs-project-transfer.md)).
- **After a finalized snapshot restore**, the active branch ID changes. Poll
operations to completion before reconnecting. Delete orphaned `(old)` branches
to avoid storage cost.
- **Billing-aligned usage:** prefer
`GET /api/v2/consumption_history/v2/projects` over legacy consumption
endpoints. **`GET /api/v2/consumption_history/account`** is deprecated with a
planned sunset of **2026-06-01**; migrate to the v2 **per-project** endpoint
([legacy consumption guide](https://neon.com/docs/guides/consumption-metrics-legacy.md)).
- **V2 `metrics` parameter values** (for implementers): `compute_unit_seconds`,
`root_branch_bytes_month`, `child_branch_bytes_month`,
`instant_restore_bytes_month`, `snapshot_storage_bytes_month`,
`public_network_transfer_bytes`, `private_network_transfer_bytes`,
`extra_branches_month` ([consumption metrics](https://neon.com/docs/guides/consumption-metrics.md#required-parameters)).
- **Snapshot schedules** are not provided on Agent Plan. Partners implement via
snapshot API + their own scheduler.
- **Rates and caps:** never invent dollar amounts or limits. Confirm on live
neon.com docs.

## Agent Plan and two organizations

Partners run **two Neon organizations**:


| Org                    | Role                                       |
| ---------------------- | ------------------------------------------ |
| **Sponsored free org** | Free-tier end users (within program rules) |
| **Paid org**           | Paying customers (metered per Agent Plan)  |


Key points:

- Dollar rates, credits, and project caps come only from the live
[Agent Plan](https://neon.com/docs/introduction/agent-plan.md) and
[neon.com/agents](https://neon.com/agents). Do not invent numbers.
- **Organization API key:** automation inside one org (create project, set
quotas).
- **Personal API key:** required to transfer a project between orgs when a
customer changes tier, then PATCH quotas to match the new tier.
- **Project-scoped API key:** [member-level access](https://neon.com/docs/manage/api-keys.md#create-project-scoped-organization-api-keys) to **one** project only—narrower than an org key and useful for per-tenant runtime or automation that must not touch the rest of the org. Cannot create new projects org-wide; invalid if the project is transferred out of the org.

Links:
[Agent Plan](https://neon.com/docs/introduction/agent-plan.md) ·
[AI Agents](https://neon.com/use-cases/ai-agents) ·
[Project transfer](https://neon.com/docs/manage/orgs-project-transfer.md) ·
[AI Agent integration](https://neon.com/docs/guides/ai-agent-integration.md)

## HIPAA

- **Agent Plan includes HIPAA** with no extra fee. Partners must still follow
Neon's published HIPAA program (workflows, agreements, configuration).
- To get access or start the process, reach out to your **primary Neon
contact**.
- This skill is not legal advice.

Link: [HIPAA on Neon](https://neon.com/docs/security/hipaa.md)

## Fleet shape: project-per-tenant

- **Project-per-tenant** is Neon's documented fleet pattern: each **tenant** you
provision for (an end **user**, a customer **app**, or an **agent** workload)
gets its own **dedicated Neon project**. That project is the isolation boundary
for **branches**, **databases**, **roles**, and **computes**—not a shared
Postgres cluster where you only partition by schema.
- **Isolation and billing:** Separate projects give **complete data and resource
isolation** between tenants, keep **consumption limits and billing**
straightforward at project scale (aligned with Agent Plan metering elsewhere in
this skill), and match **how the Neon Management API and Console are structured**
(project-scoped create, quota, and lifecycle calls).

### Staging and production

- For **each** tenant project, treat **staging versus production** (and ephemeral
**previews**) as **branch- and snapshot-driven** lifecycle inside that
project—use **Snapshots and database versioning** and **Sandbox and preview
databases** below for fleet orchestration, not a second project by default.
- **Agent and app builders:** separate **your platform's** environments (for
example how you host the builder or control plane) from **each tenant's** staging
and production **branches**—avoid conflating "our production service" with "the
tenant's production branch" in ledgers and automation.
- Some **embedded** products also split an end customer's **production and
development** Neon assets across **separate orgs** for trust, keys, and billing
boundaries; when that applies, read **Isolation beyond branches (project and org
edge cases)** next.

Link:
[AI Agent integration guide](https://neon.com/docs/guides/ai-agent-integration.md)

## Isolation beyond branches (project and org edge cases)

Use **project-** or **org-level** splits when tenant scope or trust needs go
beyond **branch- and snapshot-first** staging and production in **Fleet shape**.
**Embedded** products may isolate an end customer's **production versus
development** databases across **separate Neon orgs**, not only branches—tighter
billing, org API keys, and console boundaries while you still manage branches
**within** each org.

**Project-level isolation (multiple projects per tenant or workload):**

- Stronger **blast radius** if a connection string or role is compromised—one
leak should not span unrelated workloads.
- **Separate operational lifecycles** (for example a disposable analytics or
migration sandbox versus production data) when automation or ownership would
otherwise collide in one Postgres.
- **Different teams or automation** with conflicting migration or admin rights.
- **Harder compliance or data-mixing rules** where a single database must not
host combined workloads.

Each extra project adds fleet surface area: more API keys, more consumption
rows, more housekeeping, and higher operational cost—keep **project-per-tenant**
as the default unless a boundary above clearly applies.

**Org-level isolation (beyond sponsored free versus paid):**

- The **two-organization** layout in **Agent Plan and two organizations** is
the commercial split (free-tier users versus paying customers). That pattern
can **stack** with an embedded product split: for example **prod org versus dev
org per end customer** so playground databases never share org scope with shipped
production. Keep a clear internal map of which org owns which environment and
tier.
- Separately, partners sometimes need **additional Neon orgs or accounts** for
contracting (enterprise “their org only”), reseller or MSP models, or
geographic or legal separation—product defaults and limits belong on live docs;
do not invent caps.
- **Organization API keys are scoped to one org.** Cross-org moves use a
**personal** API key and project transfer, as in **Gotchas**—do not assume an
org key can operate across orgs. **Project-scoped** keys are further limited to a
single project ([API keys](https://neon.com/docs/manage/api-keys.md)).

**Embedding hygiene:**

- Map each platform service (control plane, tenant runtime, billing or
consumption jobs) to **least-privilege** keys; do not reuse production keys in
sandboxes at the wrong layer.
- When prod and dev for an end customer live in **different Neon orgs**, scope
automation per org (typically **one organization API key per org**) and persist
`org_id` with `project_id` / `branch_id` so jobs and restores target the correct
side.
- Keep your ledger (`project_id`, `branch_id`, org, checkpoint metadata)
aligned with the isolation layer you chose so restores, transfers, and audits
stay consistent.

## Snapshots and database versioning

For snapshot semantics, active-branch patterns, and restore tutorials, defer to
`**neon-postgres`** and
[AI database versioning](https://neon.com/docs/ai/ai-database-versioning.md).
Here, emphasize tenant fleets:

- Persist snapshot and branch IDs per tenant in your ledger. Tie each to
non-Neon state via
[compound checkpoints](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/skills/neon-postgres-agent-platforms/references/COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md).
- After finalized restores, branch IDs change and orphaned `(old)` branches
accumulate. Automate cleanup and update stored IDs.
- Poll operations to completion before reconnecting tenant apps.
- Product semantics (snapshot counts per tier, Beta pricing dates) change.
Confirm on [Agent Plan](https://neon.com/docs/introduction/agent-plan.md) docs.

Typical platform-level checkpoint triggers:

- Before promoting generated schema changes for a tenant
- Start or end of an agent run that mutates a tenant's database
- Before destructive migrations or customer-visible restore actions

Links:
[AI database versioning](https://neon.com/docs/ai/ai-database-versioning.md) ·
[Backup and restore](https://neon.com/docs/guides/backup-restore.md) ·
[Snapshots-as-checkpoints demo](https://github.com/neondatabase-labs/snapshots-as-checkpoints-demo)

## Sandbox and preview databases

Use this when a partner needs per-tenant preview or sandbox databases for
generated apps. ("How do I create a branch?" for a single app goes to
`**neon-postgres**`.)

- Track `project_id` / `branch_id` per customer / agent run when spinning
previews via the Management API.
- Branch and storage counts scale with fleet size. Monitor caps and
garbage-collect idle previews.
- Short `suspend_timeout_seconds` on preview computes reduces cost.
- Pair branch/snapshot lifecycle with secrets rotation and deploy URLs via
compound checkpoints.

Link:
[AI Agent integration guide](https://neon.com/docs/guides/ai-agent-integration.md)

## Cost, consumption, and entitlements

- **Never invent** pricing, quotas, or limits. Confirm on
[Agent Plan](https://neon.com/docs/introduction/agent-plan.md) and
[consumption metrics](https://neon.com/docs/guides/consumption-metrics.md).
- Use `GET /api/v2/consumption_history/v2/projects` for billing-aligned fields.
Legacy endpoints differ. **`GET /api/v2/consumption_history/account`** is
deprecated (sunset **2026-06-01**); use v2 per-project metrics instead
([legacy guide](https://neon.com/docs/guides/consumption-metrics-legacy.md)).
- V2 `metrics` query strings are exactly: `compute_unit_seconds`,
`root_branch_bytes_month`, `child_branch_bytes_month`,
`instant_restore_bytes_month`, `snapshot_storage_bytes_month`,
`public_network_transfer_bytes`, `private_network_transfer_bytes`,
`extra_branches_month`.
- Poll consumption roughly every 15 minutes. Polling does not wake suspended
computes.
- Run `auth-users.ts meta` from
[scripts/](https://github.com/neondatabase/neon-for-agent-platforms/tree/main/skills/neon-postgres-agent-platforms/scripts)
for a routing map (Neon Auth REST vs Postgres roles vs consumption APIs).

Links:
[Agent Plan](https://neon.com/docs/introduction/agent-plan.md) ·
[Consumption metrics](https://neon.com/docs/guides/consumption-metrics.md) ·
[Consumption limits](https://neon.com/docs/guides/consumption-limits.md) ·
[Cost optimization](https://neon.com/docs/introduction/cost-optimization.md) ·
[Plans](https://neon.com/docs/introduction/plans.md)

## Organization and project limit increases

- Current defaults and ceilings are on
[Agent Plan](https://neon.com/docs/introduction/agent-plan.md) and
[AI Agent integration](https://neon.com/docs/guides/ai-agent-integration.md).
Do not invent limits.
- For project increase requests, email
[agents@neon.tech](mailto:agents@neon.tech) with org ID(s), growth context,
and timeline. Also flag in shared Slack if available.

## Co-marketing

- Co-marketing is an included Agent Plan benefit.
- Available: joint blog posts, social promotion, hackathon sponsorship, case
studies, landing page features.
- Reach out via shared Slack or your Neon representative with context on what
you're building.

Link: [Agent Plan](https://neon.com/docs/introduction/agent-plan.md)

## Support

- **Shared Slack channel:** fastest path for technical questions and urgent
issues.
- **Neon representative:** account-level requests, custom configuration,
escalations.
- **Limit increases:** email
[agents@neon.tech](mailto:agents@neon.tech) with org ID(s), growth context,
and timeline.
- **Billing:** raise via Slack or your Neon representative. Credit balances and
invoices are in the Neon Console under Billing.
- **Community:** [Neon Discord](https://discord.gg/92vNTzKDGp) ·
[Docs](https://neon.com/docs) ·
[API reference](https://api-docs.neon.tech)

## Repository samples

Runnable Management API automation from
[neondatabase/neon-for-agent-platforms](https://github.com/neondatabase/neon-for-agent-platforms).

- **Quick start:**
[README](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/README.md#quick-start)
- **Script catalog:**
[MANAGEMENT_API_SAMPLES.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/skills/neon-postgres-agent-platforms/references/MANAGEMENT_API_SAMPLES.md)
- **Compound checkpoints:**
[COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/skills/neon-postgres-agent-platforms/references/COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md)
- **Checkpoint orchestration:**
[CHECKPOINT_ORCHESTRATION_PATTERN.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/skills/neon-postgres-agent-platforms/references/CHECKPOINT_ORCHESTRATION_PATTERN.md)
- **Doc index:**
[SCRIPT-OVERVIEW.md](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/skills/neon-postgres-agent-platforms/references/SCRIPT-OVERVIEW.md)

All scripts use `@neondatabase/api-client` only. Shared
[utils.ts](https://github.com/neondatabase/neon-for-agent-platforms/blob/main/skills/neon-postgres-agent-platforms/scripts/utils.ts)
polls async operations. For SQL access from app code (drivers, pooling, ORMs),
use `**neon-postgres`**.