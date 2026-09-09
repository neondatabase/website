---
title: 'Claimable Neon: Backends provisioned by agents & claimed by humans'
description: >-
  Who'll come through the door?
excerpt: >-
  We're launching Claimable Neon to give the agent another path. This flow
  implements the anonymous registration method in auth.md, the open agent
  registration protocol authored by WorkOS, to give agents a way to provision a
  temporary Neon project without creating an account or collecting payment
  details.
date: '2026-09-10T12:00:00'
updatedOn: '2026-09-08T21:47:00'
category: product
categories:
  - product
  - community
authors:
  - andre-landgraf
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: 'Claimable Neon: Backends provisioned by agents & claimed by humans - Neon'
  description: >-
    We're launching Claimable Neon to give the agent another path. This flow
    implements the anonymous registration method in auth.md, the open agent
    registration protocol authored by WorkOS, to give agents a way to provision a
    temporary Neon project without creating an account or collecting payment
    details.
  keywords: []
  noindex: false
  ogTitle: 'Claimable Neon: Backends provisioned by agents & claimed by humans - Neon'
  ogDescription: >-
    We're launching Claimable Neon to give the agent another path. This flow
    implements the anonymous registration method in auth.md, the open agent
    registration protocol authored by WorkOS, to give agents a way to provision a
    temporary Neon project without creating an account or collecting payment
    details.
  image: null
---

While building with agents, you've probably run into a situation where an agent needs a database, but by then you've stepped away from the keyboard. The next step is something like a signup form, an email verification, or an API key the agent doesn't have. It needs you to complete that step manually, and until then it can't proceed with the implementation.

We're launching **[Claimable Neon](https://neon.com/claimable-neon)** to give the agent another path. This flow implements the anonymous registration method in [auth.md](https://workos.com/auth-md), the open agent registration protocol authored by WorkOS, to give agents a way to provision a temporary Neon project without creating an account or collecting payment details. The agent gets credentials scoped to that project and keeps building. If you like the result, you can sign in later and claim the project into a Neon organization.

Today, agents can deploy Neon databases ([Lakebase Postgres](https://neon.com/docs/postgres/overview)), the [Data API](https://neon.com/docs/data-api/overview), and [Managed Better Auth](https://neon.com/docs/auth/overview) via Claimable Neon, with the rest of the Neon backend services ([Object Storage](https://neon.com/docs/storage/overview), [Functions](https://neon.com/docs/compute/functions/overview), and [AI Gateway](https://neon.com/docs/ai-gateway/overview)) coming soon.

## How Claimable Neon works

Claimable Neon separates provisioning from ownership:

1. **The agent discovers the path:** It starts with `llms.txt`, then reads `neon.com/auth.md` to learn how Claimable Neon works.
2. **The agent provisions a project:** `neon claim create` registers anonymously, creates one temporary project, and returns credentials scoped to that project.
3. **The agent builds:** It can connect with standard Postgres clients, run SQL, create branches, and configure the Data API or Managed Better Auth if the app needs them.
4. **A human claims it:** The agent generates a short-lived claim link. The human signs in to Neon, selects an organization, and accepts the transfer.

An unclaimed project will expire after 72 hours, and it is capped at 100 MB of storage and 1 GB of transfer. Those limits keep the anonymous path useful for prototypes while keeping resource usage contained. As soon as a claim begins, Neon revokes the pre-claim access tokens and rotates the database credentials. Managed Better Auth and the Data API also transfer with the project if the agent enabled them.

## auth.md is the sign on the door

To build something like Claimable Neon, you need to guide agents beyond the API docs. They need to know how to register, which flows a service accepts, which capabilities they can request, and how to obtain credentials without pretending to be a human. [auth.md](https://workos.com/auth-md) provides that guide.

WorkOS authored auth.md, but the protocol is not tied to WorkOS infrastructure - any service can publish it, and any agent can read it. It composes existing OAuth standards with a registration layer designed for agents.

How it works:

- A service publishes a Markdown file, usually at `https://service.example.com/auth.md`, with instructions for agents to follow.
- The file points the agent to structured OAuth metadata that defines the actual endpoints and supported flows.
- The agent uses that metadata to register, receives a service-signed identity assertion, and exchanges the assertion for a short-lived, scoped access token. It can exchange the same assertion again when the access token expires, with no long-lived API key required.

The protocol supports three registration methods:

- **Agent verified:** an agent provider vouches for a signed-in user.
- **User claimed:** the agent waits while a human signs in and confirms a code.
- **Anonymous:** the agent starts with limited access, then offers a claim flow if the human wants to keep the result.

Claimable Neon uses the **Anonymous** method.

## Why we chose anonymous registration

An allowlist of known agent products would have been the more predictable launch: we could recognize requests from a handful of providers and reject everything else. But we actually want to see what happens when the instructions are public and the first interaction does not require a human identity. Which agents discover the file? What do they request? How far do they get? Do they ask for a database, Auth, or the Data API? Which projects do humans decide to keep?

And anonymous registration does not mean unrestricted access. The agent receives credentials for one temporary project, capabilities have explicit grant decisions, access tokens are short-lived and revocable. As we've mentioned, we've also set things up so the project has a fixed lifetime and small quotas before claim. The project-scoped Neon API key stays inside Claimable Neon and is never returned to the agent.

## From neon.new to Claimable Neon

If you've been following Neon for a while, you might recognize the predecessors of Claimable Neon: we've been experimenting with this claimable workflows for a while, with projects like [neon.new](https://neon.new) or Instagres. This was built for developers: for example, they used it in workshops and demos to create an ephemeral Postgres database without stopping for signup.

Claimable Neon keeps that useful split between creation and ownership, but changes who the first user is. If neon.new was an unauthenticated endpoint for developers, claimable Neon is a service for agents. It is also more closely integrated with Neon than its predecessors - it is built on the Neon Open API and `@neon/sdk`.

Since agents are the main access point now, Claimable Neon will eventually replace neon.new.

## Ask your agent to try it

To try it, point your agent at `neon.com/docs/llms.txt` or ask it to create a Neon project for an app when you do not yet have a Neon account.

Under the hood, the CLI path looks like this:

```
npm i -g neon@latest
neon skills -s neon -s neon-postgres
neon claim create --service data-api --service auth --env-pull
```

The agent can then use existing Neon commands:

```
neon branches list
neon claim accept --no-open
```

If the agent already has access to a Neon account, it should use that account. Claimable Neon is the path for the moment before an account exists and the human is not around to create one.

---

We loved collaborating with WorkOS to build Claimable Neon. If you're building something similar, make sure to check out [auth.md](https://workos.com/auth-md).
