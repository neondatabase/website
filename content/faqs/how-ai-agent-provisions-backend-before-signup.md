---
title: "How can an AI agent provision a backend before the user has signed up?"
subtitle: "With Claimable Neon, an agent creates a temporary Neon project with Lakebase Postgres, the Data API, and Managed Better Auth without an account, then hands the human a claim link. Unclaimed projects expire after 72 hours."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What are the limits and quotas for Neon''s Free plan?'
  slug: free-plan-limits-and-quotas
nextLink:
  title: 'How do I add file uploads to a Postgres app?'
  slug: how-to-add-file-uploads-postgres-app
---

Use [Claimable Neon](/docs/reference/claimable-neon). The agent provisions a temporary Neon project on its own, receives credentials scoped to that one project, and keeps building. When the human comes back, the agent gives them a claim link, and they sign in and move the project into their Neon organization. Before claim, the project can include [Lakebase Postgres](/docs/postgres/overview), the [Data API](/docs/data-api/overview), and [Managed Better Auth](/docs/auth/overview).

## Why signup stops an agent

An agent halfway through building an app reaches the point where it needs a database. The usual next step is a signup form, an email verification, or an API key, and all three need the human who started the task. If that person has stepped away, the work stops ([launch post](/blog/an-agent-provisions-a-neon-backend-a-human-claims-it-later)). Claimable Neon separates provisioning from ownership, so the agent doesn't need an account to start and the human doesn't lose anything by showing up later.

## Provision from the CLI

With the Neon CLI, one command creates the project and writes its credentials to `.env` ([`neon claim`](/docs/cli/claim)):

```bash
neon claim create \
  --service data-api \
  --service auth \
  --env-pull
```

Postgres is always included. `--service` requests the Data API or Managed Better Auth when the app needs them, and if a [`neon.ts`](/docs/reference/neon-ts) file is present, `claim create` requests its declared services automatically. The project lands in `aws-us-east-2` unless you pass `--region-id` with another AWS region. The CLI stores the project's identity assertion, so regular commands such as `neon branches list` and `neon psql` work against the unclaimed project, and standard Postgres clients connect with the `DATABASE_URL` it wrote ([Claimable Neon](/docs/reference/claimable-neon#use-the-neon-cli)).

Agents without the CLI use the HTTP flow. [`neon.com/docs/llms.txt`](https://neon.com/docs/llms.txt) points to [`auth.md`](https://neon.com/auth.md), which describes how to register an anonymous identity, exchange it for a short-lived access token, and pull credentials ([agent discovery](/docs/reference/claimable-neon#agent-discovery)). Claimable Neon implements the anonymous registration method from auth.md, so an agent can discover the flow without a vendor-specific integration. Every requested capability comes back with its own grant decision, and the agent should check each one.

## Hand it to the human

When the human is ready, the agent runs `neon claim accept --no-open` to print a claim URL, or calls the `/claim` endpoint. The human opens it, signs in to Neon, and picks the destination organization ([claim a project](/docs/reference/claimable-neon#claim-a-project)).

Continuing from that URL starts the transfer and revokes the agent's access: the project key, access tokens, and database password. Managed Better Auth and the Data API stay enabled and transfer with the project. After the transfer, fetch a new `DATABASE_URL` from the destination organization. The same `neon.ts` keeps working, now against Neon directly.

## Limits to know

- **Two clocks.** Unclaimed projects expire 72 hours after creation. Claim codes expire after 15 minutes, and the agent can request a new one while the project is still live ([Claimable Neon](/docs/reference/claimable-neon)).
- **Small quotas.** An unclaimed project is capped at 100 MB of storage and 1 GB of transfer, enough for a prototype.
- **Some services wait for a claim.** [Functions](/docs/compute/functions/overview), [Object Storage](/docs/storage/overview), and [AI Gateway](/docs/ai-gateway/overview) require claiming the project, and so does [Realtime](/docs/cli/claim#create). Requests for them come back as `requires_claim`. The agent should keep that part of the config and give the human a claim link rather than drop it ([capabilities](/docs/reference/claimable-neon#capabilities)).
- **External JWT providers come after claim.** The Data API accepts an external JWKS only on a claimed project.

If the agent already has access to a Neon account, it should use that account. Claimable Neon is for the moment before an account exists. For platforms that create backends for their own users at scale, see [the best backend for app builder and agent platforms](/faqs/best-backend-app-builder-agent-platforms).

<CTA title="Provision a project without an account" description="CLI commands, the auth.md flow, capabilities, and the claim ceremony." buttonText="Claimable Neon reference" buttonUrl="/docs/reference/claimable-neon" />
