---
title: 'Why is my Postgres egress so high, and how do I reduce it?'
subtitle: 'Most Postgres egress comes from queries that return more rows or columns than the app uses, the same data fetched on every request, pg_dump backups, and logical replication. Find the heavy queries with pg_stat_statements, then trim them. On Neon, an agent skill can do the search and the fixes for you.'
createdAt: '2026-11-20T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'Where do I find a copy-pasteable Postgres connection string in Neon?'
  slug: where-find-database-connection-string
nextLink:
  title: ''
  slug: ''
updatedOn: '2026-11-20T14:29:56.440Z'
---

Egress is the data your database sends out to clients. Every row and column a query returns counts, so high egress usually means your app fetches more data than it shows, or fetches the same data again and again. Backups and replication streams count too. The fixes below work on any Postgres, and the Neon-specific ones are marked.

## The usual causes

- **Large result sets.** `SELECT *`, missing `LIMIT` or pagination, and joins that multiply rows send data the app throws away. ORM defaults can pull more rows or columns than you need.
- **Repeated queries.** Querying on every page render or API call without caching sends the same rows over and over. It's common in serverless functions, where each invocation starts fresh.
- **`pg_dump` backups.** A full dump sends the whole database over the network every time it runs. Compression flags like `-Fc` don't help, because the client compresses after the data has arrived.
- **Logical replication.** Replicating to another system is a continuous outbound stream, and each initial table sync is a one-time spike.
- **Log export.** Sending logs to Datadog, Grafana, or an OpenTelemetry collector counts too, though logs are usually small next to row data.

Source: [what causes high network transfer](/docs/introduction/network-transfer#what-causes-high-network-transfer). On Supabase, the same patterns apply, and traffic from Auth, Storage, Edge Functions, Realtime, and the Supavisor pooler counts toward the same quota ([Supabase egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress)).

## Find the queries that send the most data

Enable [`pg_stat_statements`](/docs/extensions/pg_stat_statements) and look for the queries that return the most rows. Row counts aren't bytes, but queries that return many rows, or wide rows with `TEXT`, `JSONB`, or `BYTEA` columns, are the likely culprits:

```sql
SELECT
  query,
  calls,
  rows AS total_rows,
  rows / calls AS avg_rows_per_call
FROM pg_stat_statements
WHERE calls > 0
ORDER BY rows DESC
LIMIT 10;
```

Sort by `avg_rows_per_call` to find queries that are missing pagination, and by `calls` to find queries that should be cached. To see when the egress happened on Neon's paid plans, the [Consumption API](/docs/guides/consumption-metrics) reports network transfer by the hour, so you can match a spike to a deploy, a backup job, or a replication sync. On Free, compare the `data_transfer_bytes` total across branches to find the branch responsible ([diagnosing a spike](/docs/introduction/network-transfer#diagnosing-a-spike)).

## Reduce it

- **Select only the columns you use**, and paginate instead of fetching whole tables.
- **Aggregate in the database.** `COUNT`, `SUM`, and `GROUP BY` send one row instead of thousands.
- **Cache data that rarely changes** instead of reading it on every request.
- **Back up without `pg_dump` (Neon).** [Snapshots](/docs/guides/backup-restore) and [scheduled backups](/docs/guides/backup-restore#create-backup-schedules) keep the copy inside Neon instead of sending the whole database over the network. When you do need a dump, use `-t`, `--exclude-table`, or `--schema-only` to send less.
- **Replicate only what you need.** Use row filters and column lists in `CREATE PUBLICATION` (Postgres 15 and later), and avoid dropping replication slots, which forces a new full sync.
- **Route internal traffic privately (Neon Scale).** If your app runs in AWS, [Private Networking](/docs/guides/neon-private-networking) carries traffic over PrivateLink at $0.01/GB instead of $0.10/GB for public transfer beyond the allowance.

Source: [how to reduce network transfer](/docs/introduction/network-transfer#how-to-reduce-network-transfer).

## Let an agent find and fix it (Neon)

The `neon-postgres` [agent skill](/docs/ai/agent-skills) includes an egress workflow for AI coding assistants. Ask about a high bill or an egress spike, and the agent finds the heaviest queries with `pg_stat_statements`, traces them back to your code, fixes patterns like `SELECT *`, missing pagination, and repeated reads, then checks that your tests still pass and that transfer drops. Install it with the [Neon CLI](/docs/cli):

```bash
neon skills -s neon-postgres
```

Without the Neon CLI, run `npx skills add neondatabase/agent-skills -s neon-postgres` ([agent skill for egress](/docs/introduction/network-transfer#use-an-agent-skill-to-find-egress-anti-patterns)).

## How much egress you get before you pay

On Neon, egress is counted per project: 5 GB a month on Free, and 500 GB a month on Launch and Scale, then $0.10/GB, shared by Postgres, Object Storage, and Functions in the project ([plans](/docs/introduction/plans#public-network-transfer)). If a legitimate app runs into the limit, [reach out to Neon](/contact-sales) about credits: the limits are there to prevent abuse, not to push you onto a bigger plan.

On Supabase, Pro includes 250 GB of uncached egress for the whole organization, then $0.09/GB ([Supabase egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress)). For a full comparison, see [Is egress cheaper on Neon than on Supabase?](/faqs/is-egress-cheaper-neon-than-supabase), and for what happens at the limit, see [What happens when I go over my egress quota on Supabase, and how does Neon handle it?](/faqs/exceed-egress-quota-supabase-vs-neon)

Vendor details verified on 2026-11-20 against the linked pages.

<CTA title="500 GB of egress per project" description="Find heavy queries with an agent skill, and back up with snapshots that stay inside Neon." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
