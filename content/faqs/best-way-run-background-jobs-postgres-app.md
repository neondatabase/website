---
title: "What is the best way to run background jobs for a Postgres app?"
subtitle: "On Neon, run scheduled and upload-driven jobs with Function Triggers and short follow-up work with waitUntil. For queued, retryable, multi-step workflows, pair a Neon Function with Inngest or Upstash Workflow."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the best way to do hybrid search (BM25 plus vector) in Postgres?'
  slug: best-way-hybrid-search-bm25-vector-postgres
nextLink:
  title: 'What is the best way to run cron jobs and scheduled syncs on a Postgres database that scales to zero?'
  slug: best-way-run-cron-jobs-postgres-scale-to-zero
---

Use Neon, and pick the tool by the shape of the job. "Background job" covers three different things: work on a schedule, work in reaction to an event, and queued work with its own lifecycle. [Neon Functions](/docs/compute/functions/overview) cover the first two directly, plus short work after a response. They aren't a job queue, so for the third you pair a function with a workflow engine that calls it over HTTP ([request/response, not background jobs](/docs/compute/functions/overview#requestresponse-not-background-jobs)).

## Scheduled jobs

Nightly reports, cleanup, syncs from Stripe or GitHub: a schedule [Function Trigger](/docs/compute/functions/triggers/schedule) calls your function on a five-field UTC cron. The timer runs outside the Postgres compute, so jobs fire even while the database is scaled to zero, and the function wakes the compute only when it queries ([Function Triggers](/docs/compute/functions/triggers/overview)). `pg_cron`, by contrast, runs only while the compute is active ([pg_cron](/docs/extensions/pg_cron)). See [cron jobs on a database that scales to zero](/faqs/best-way-run-cron-jobs-postgres-scale-to-zero).

## Jobs that react to an upload

Thumbnails, document parsing, moderation: a `storage_object_created` trigger invokes the function with the bucket and object key when a file lands in [Object Storage](/docs/storage/overview), optionally filtered by key prefix ([upload triggers](/docs/compute/functions/triggers/object-storage)). Nothing polls the bucket. See [run code when a file is uploaded](/faqs/run-code-when-file-uploaded).

Both trigger types deliver at least once, can arrive out of order, and retry failed deliveries for up to 72 hours. Each delivery carries a stable `invocation_id`, so record it with the job's database changes to make repeats harmless ([delivery and retries](/docs/compute/functions/triggers/overview#delivery-and-retries)).

## Work after the response

Analytics writes, audit logs, webhook fan-outs, and agent callbacks don't need a queue. Register them with `waitUntil` and they keep running after the response is sent, up to 15 minutes ([runtime limits](/docs/compute/functions/reference/runtime-limits)):

```ts
import { waitUntil } from '@neon/functions';

app.post('/signup', async (c) => {
  const user = await createUser(c);
  waitUntil(recordSignupEvent(user)); // continues after the response
  return c.json(user);
});
```

`waitUntil` is for short follow-up calls, not a job runner. The platform can evict and restart a function for operational reasons, so anything that needs its own lifecycle, retries, or cancellation belongs in one of the options below.

## Queued, multi-step workflows

Work that needs its own retries, delays, cancellation, or step-by-step progress, such as an onboarding sequence or a multi-step AI enrichment pipeline, belongs in a workflow engine. Inngest and Upstash Workflow own the queue and retries and invoke your Neon Function over HTTP, so the steps still run next to your database with `DATABASE_URL` and AI Gateway credentials injected:

- [Durable workflows with Inngest and Neon Functions](/guides/durable-workflow-on-neon-functions) builds a lead enrichment pipeline with checkpointed steps and a durable delay.
- [Upstash Workflow on Neon Functions](/guides/upstash-workflow-neon-functions) covers the same pattern with Upstash.
- To start a workflow from a database change, Inngest's integration turns Neon changes into events ([trigger serverless functions](/docs/guides/trigger-serverless-functions)).

## Branches keep test runs separate

Functions and their triggers branch with your project. A preview branch runs its own copy of each function against its own data, and inherited triggers arrive disabled, so testing a job on a branch doesn't run it twice against production ([triggers and branching](/docs/compute/functions/triggers/overview#triggers-and-branching)). See [testing cron jobs without double runs](/faqs/test-scheduled-jobs-preview-branch-without-double-running).

## Cost

Function compute bills only while a request is being processed, including `waitUntil` work, and not between runs. The Free plan includes 10 active and 400 waiting Capacity-Hours and 1 million invocations per project per month; trigger retries bill as normal invocations ([plans](/docs/introduction/plans#functions)). Postgres compute bills while a job keeps it awake, and storage bills continuously.

<CTA title="Run your first scheduled job" description="Deploy a function and call it on a cron schedule with a Function Trigger." buttonText="Function Triggers" buttonUrl="/docs/compute/functions/triggers/overview" />
