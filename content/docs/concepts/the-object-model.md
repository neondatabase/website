---
title: The Neon object model
subtitle: How an organization, a project, and a branch hold your whole backend
summary: >-
  Neon nests resources in three containers: an organization holds projects, and
  a project holds branches. A branch is not just a Postgres database. It is your
  whole backend, holding Lakebase Postgres alongside Better Auth, Object
  Storage, Functions, and the AI Gateway as peers. Postgres has its own children
  (computes, roles, databases, and the Data API) but it does not define the
  branch. Branching is copy-on-write across the backend, though the semantics
  differ by product: Postgres forks its data, Better Auth rides the database
  branch, Functions and the AI Gateway are branch-aware for their endpoints and
  credentials, and the AI Gateway model catalog stays global.
enableTableOfContents: true
redirectFrom:
  - /docs/manage/overview
updatedOn: '2026-08-27T15:07:41.821Z'
---

Neon nests your resources in three containers: an **organization** holds **projects**, and a project holds **branches**. What sits inside a branch is the part worth reading carefully, because a branch is not just a Postgres database. It's your whole backend. Lakebase Postgres, Better Auth, Object Storage, Functions, and the AI Gateway all live inside a branch as peers.

This page explains how those pieces relate, so you can reason about scope: what a given resource belongs to, what you get a copy of when you branch, and where the details of each product live.

![Placeholder diagram of the Neon object model. An organization contains a project, which is pinned to one region, which contains a branch. The branch is labeled as your whole backend and holds five peer products: Lakebase Postgres, Better Auth, Object Storage, Functions, and the AI Gateway. Lakebase Postgres has four children of its own: computes, roles, databases, and the Data API. The AI Gateway is branch-aware for endpoint, credentials, access, and metering, with a shared global model catalog and no per-branch model config](/docs/concepts/the-object-model.svg 'no-border')

<Admonition type="note" title="Placeholder diagram">
The diagram above is a hand-drawn placeholder that shows the correct structure. Our design team will replace it with a final illustration.
</Admonition>

## The three containers

Organizations, projects, and branches nest, and each one answers a different question.

**Organization:** the top-level container. Billing, membership, and project ownership are all organization-level concerns. One Neon account can belong to several organizations, and projects can be transferred between them. See [Organizations](/docs/manage/organizations).

**Project:** the unit of isolation, and the level where you pick a region. Two projects share nothing: separate storage, separate credentials, separate billing lines. That makes a project the natural boundary for an application, an environment, or a tenant that needs hard isolation. See [Projects](/docs/manage/projects) and [Regions](/docs/introduction/regions).

**Branch:** the unit of copy. A branch holds the backend itself, and creating one gives you an isolated copy to work in. Branches form a tree: every project starts with a root branch that can't be deleted, and every other branch descends from another branch.

## A branch is the whole backend

The older way to describe a branch was "computes, roles, and databases," which is really a description of Postgres. That's too narrow. A branch holds five products as peers, and Postgres is one of them rather than the definition of the branch.

| Product               | What it is                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Lakebase Postgres** | Serverless Postgres, and for most applications the system of record for relational data. See [Lakebase Postgres](/docs/postgres/overview). |
| **Better Auth**       | Managed authentication: sign-in, users, sessions, and auth configuration. See [Managed Better Auth](/docs/auth/overview).                  |
| **Object Storage**    | S3-compatible buckets and objects, for files too large to sit in a row. See [Object Storage](/docs/storage/overview).                      |
| **Functions**         | Long-running serverless compute deployed onto the branch, next to your data. See [Functions](/docs/compute/functions/overview).            |
| **AI Gateway**        | One Neon credential for reaching many LLM providers, with no provider keys to manage. See [AI Gateway](/docs/ai-gateway/overview).         |

Availability differs by product and by region. This page describes the model, not the rollout, so check each product's overview page for its current availability before you plan around it.

For a worked example that builds one app across all five, see [How a Neon backend fits together](/docs/get-started/backend-overview).

### What Lakebase Postgres contains

Postgres is the one product with a set of child objects you manage directly:

- **Computes:** the Postgres processes that serve your queries. A branch has one read-write compute and can have additional [read replicas](/docs/introduction/read-replicas). Compute size, autoscaling, and scale to zero are compute settings. See [Computes](/docs/manage/computes).
- **Roles:** Postgres roles, which belong to a branch. A role is what you connect as, and what owns database objects. See [Roles](/docs/manage/roles).
- **Databases:** standard Postgres databases, each a container for schemas, tables, views, functions, and indexes. A database belongs to a branch. See [Databases](/docs/manage/databases).
- **Data API:** a PostgREST-compatible HTTP interface to a database on the branch, for callers that can't hold a TCP connection, such as browsers and edge runtimes. See [Data API](/docs/data-api/overview).

Those four are the object model's view of Postgres. The layer underneath, where compute is separated from durable storage and branching becomes a metadata operation, is a different subject. For that, read [The lakebase architecture](/docs/introduction/architecture-overview).

## What a branch gives you a copy of

Branching is copy-on-write across the backend, but it isn't one mechanism, and the products don't behave identically. It's worth knowing which row applies to you before you rely on it.

| Product           | What a new branch gets                                                                                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lakebase Postgres | A real copy-on-write copy of the parent's data at the moment of branching. Nothing is duplicated up front, and writes on either side stay separate.                                                                                                    |
| Better Auth       | Nothing separate to provision. Its state (users, sessions, and configuration) lives in the branch's database, so it rides the database branch. Each branch gets its own Auth URL. See [Branching authentication](/docs/auth/branching-authentication). |
| Object Storage    | Buckets and the objects already in them fork copy-on-write, so nothing is duplicated up front. Availability is limited, so check the [Object Storage](/docs/storage/overview) overview first. See [Buckets](/docs/storage/buckets).                    |
| Functions         | Branch-aware. Each branch runs its own function at its own URL, against that branch's data, with no redeploy needed.                                                                                                                                   |
| Data API          | Nothing provisioned per branch. It rides the branch's compute endpoint, so once it's enabled on a database it's reachable on that branch's own endpoint hostname.                                                                                      |
| AI Gateway        | Branch-aware for endpoint, credentials, access, and metering. The [model catalog](/docs/ai-gateway/models) is shared and global: there is no per-branch model configuration.                                                                           |

That's as far as this page goes on branching. For what branches are for and how to work with them, see [Branching](/docs/introduction/branching) and [Manage branches](/docs/manage/branches).

## What sits outside the hierarchy

Three things are worth naming because they don't live in a branch:

- **Your Neon account.** Your account is your identity for signing in, not a container for resources. It can belong to several organizations. See [Accounts](/docs/manage/accounts).
- **API keys.** A key is personal (scoped to your account), organization-scoped, or project-scoped. No key is scoped to a branch. See [Manage API keys](/docs/manage/api-keys).
- **Region.** A region is fixed on the project when you create it, and every branch in the project inherits it. See [Regions](/docs/introduction/regions).

## Where to go next

<DetailIconCards>

<a href="/docs/introduction/architecture-overview" description="How compute and durable storage are separated underneath Postgres" icon="database">The lakebase architecture</a>

<a href="/docs/introduction/branching" description="What branches are for and how to work with them" icon="split-branch">Branching</a>

<a href="/docs/get-started/backend-overview" description="One example app built across all five products" icon="setup">How a Neon backend fits together</a>

<a href="/docs/manage/projects" description="Create, configure, and delete projects" icon="cards">Manage projects</a>

<a href="/docs/manage/branches" description="Create, reset, and delete branches" icon="branching">Manage branches</a>

<a href="/docs/manage/computes" description="Compute size, autoscaling, and scale to zero" icon="autoscaling">Manage computes</a>

</DetailIconCards>

<NeedHelp/>
