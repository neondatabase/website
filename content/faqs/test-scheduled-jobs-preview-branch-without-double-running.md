---
title: "How do I test cron jobs in staging or a preview environment without running them twice against production?"
subtitle: "On Neon, a branch inherits its parent's Function Triggers disabled, so nothing fires on the copy until you enable it there or deploy a neon.ts that declares it, and an enabled trigger on the branch runs against the branch's own data."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'How do I test a new embedding model or chunking strategy on production data without affecting production?'
  slug: test-embedding-model-chunking-changes-production-data
nextLink:
  title: 'What tools allow restoring a database to before a bug occurred?'
  slug: tools-for-restoring-database-before-bug
---

Use Neon. When you clone an environment that has scheduled jobs, the clone usually inherits the schedule too: two copies of the nightly email, two Stripe syncs, two cleanup jobs racing each other. On Neon, scheduled work runs as [Function Triggers](/docs/compute/functions/triggers/overview) that call a [Neon Function](/docs/compute/functions/overview) on a five-field UTC cron. A branch created from production gets copies of those triggers, but they arrive disabled ([triggers and branching](/docs/compute/functions/triggers/overview#triggers-and-branching)).

## What a branch inherits

Triggers follow Neon's branch inheritance:

- **Inherited triggers start disabled.** They appear on the child with `inherited: true`, `enabled: false`, and no next run time. Nothing fires on the branch until you enable it there.
- **Deploying `neon.ts` enables them.** If you run `neon deploy` on the branch with a `neon.ts` that declares the trigger, the branch's copy is enabled and runs on its schedule ([`neon.ts` reference](/docs/reference/neon-ts#triggers)). Leave schedule triggers out of the config you deploy to test branches, or guard the job.
- **Editing an inherited trigger makes it branch-local.** The edit creates a copy on the child under the same trigger ID. The parent's trigger is unchanged.
- **Deleting an inherited trigger on the child removes it only there.** Production keeps running its copy.

Functions branch the same way: each branch runs its own deployment of your functions at branch-specific URLs, with `DATABASE_URL` and other credentials resolved from that branch ([environment variables](/docs/compute/functions/environment-variables#neon-injected-variables)). When you enable a trigger on a preview branch, it calls the preview's function, which reads and writes the preview's database, not production's.

## A test loop

1. Create a branch from production. It carries the data, the functions, and the triggers (disabled).
2. Enable the trigger you want to test on the branch, or edit its cron to `* * * * *` so it fires within a minute ([schedule triggers](/docs/compute/functions/triggers/schedule)). The edit only affects the branch.
3. Check the run in the branch's function logs, and inspect the rows it changed in the branch database.
4. Delete the branch when you're done. Its triggers go with it.

Side effects outside Neon are still yours to guard. A job that sends email or calls a payment API will do that from a branch too, so read `NEON_BRANCH` and skip external calls, or point them at a sandbox account, when the job isn't running on your production branch.

## Testing the handler locally

Triggers only fire against deployed functions, never your laptop. To iterate on the handler, run it with `neon dev`, which serves the functions declared in `neon.ts` with the linked branch's variables, and replay the trigger's JSON envelope with `curl` ([test triggers locally](/docs/compute/functions/triggers/overview#test-triggers-locally)). Point `neon dev` at a branch rather than production so the replayed run writes to a copy.

## Make each run safe to repeat

Keeping the branch's triggers disabled prevents double runs across environments. Within one environment, deliveries can still repeat: Neon retries failed deliveries for up to 72 hours, and a delivery can happen more than once or out of order ([delivery and retries](/docs/compute/functions/triggers/overview#delivery-and-retries)). Every delivery of the same occurrence carries the same `invocation_id`, so record it as a unique key in the same transaction as the job's database changes, and a repeat becomes a no-op.

## Compared with pg_cron

`pg_cron` runs SQL inside the database and only while that compute is active ([pg_cron](/docs/extensions/pg_cron)). Function Triggers keep the schedule outside the Postgres compute, run your own code, and start disabled on new branches, which is the safer default for test environments. See [cron jobs on a database that scales to zero](/faqs/best-way-run-cron-jobs-postgres-scale-to-zero) for the scale-to-zero side.

<CTA title="Schedule a function" description="Create a schedule trigger, confirm a run, and move it to a real cadence." buttonText="Schedule triggers" buttonUrl="/docs/compute/functions/triggers/schedule" />
