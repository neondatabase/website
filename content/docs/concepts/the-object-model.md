---
title: The Neon object model
subtitle: How the Neon backend is structured
summary: >-
  The Neon backend is structured as an organization, a project, and a branch.
  The branch is where the backend runs: Lakebase Postgres, Managed Better Auth,
  Object Storage, Functions, and the AI Gateway. A child branch is an isolated
  copy of that backend. Organizations hold billing, membership, and projects. A
  project sets the region and groups branches. Postgres and Object Storage use
  copy-on-write; Auth state lives in the database and branches with it; Functions
  and the AI Gateway get per-branch URLs and credentials. The AI Gateway model
  catalog is global. Computes, roles, databases, and the Data API belong to
  Postgres. API keys are scoped to an account, organization, or project, not to
  a branch.
enableTableOfContents: true
redirectFrom:
  - /docs/manage/overview
updatedOn: '2026-08-27T15:07:41.821Z'
---

On Neon, a **branch** is where your backend runs: Lakebase Postgres, plus Managed Better Auth, Object Storage, Functions, and the AI Gateway. Each branch is isolated from every other branch. You can create another branch from a current or past state, change it, and delete it when you are done, without touching the original. That is what makes branching useful for a preview, a pull request, or an experiment: you get a full cloned backend to work against, not a second project to provision.

An **organization** contains projects, and each **project** contains branches.

![Tree diagram of the Neon object model. An organization contains projects (one region per project). A project contains branches. A branch holds five services: Lakebase Postgres, Managed Better Auth, Object Storage, Functions, and the AI Gateway. Lakebase Postgres has four children: computes, roles, databases, and the Data API.](/docs/concepts/the-object-model.png 'no-border')

In the Neon Console, API, and CLI, the hierarchy is `org_id` → `project_id` → `branch_id`. Connection strings, Auth URLs, function URLs, and the AI Gateway endpoint all belong to a branch. An API key is scoped to an account, an organization, or a project, so the same key can reach every branch in that scope. See [What sits outside the hierarchy](#what-sits-outside-the-hierarchy).

## The hierarchy

An **organization** is the top-level container for your Neon projects. Billing, membership, and project ownership live at this level. One Neon account can belong to several organizations, and you can transfer projects between them. See [Organizations](/docs/manage/organizations).

A **project** is the workspace that groups your branches and holds the settings they share. You choose a [region](/docs/introduction/regions) when you create the project, and it's fixed for the life of the project. Other project-level settings, such as the history window for instant restore, IP Allow rules, and project access, apply to every branch inside it. Each project is fully isolated, with separate data and credentials, which makes a project the right boundary for an app or a tenant that must stay separate. See [Projects](/docs/manage/projects) and [Multitenancy](/docs/guides/multitenancy).

A **branch** sits inside a project. Every project starts with a root branch you can't delete (`production` in the Neon Console, `main` via API or CLI). Every other branch is created as a child of an existing branch. Create a new project, rather than a branch, when you need a different region or a tenant that must stay fully separate. See [Manage branches](/docs/manage/branches).

## A full backend per branch

When you create a child branch, it includes the same services enabled on its parent. What gets copied, shared, or re-created depends on the service.

| Service | What lives on the branch | What a child branch gets |
| --- | --- | --- |
| [**Lakebase Postgres**](/docs/postgres/overview) | Serverless Postgres. You connect through a compute on the branch (`ep-...` in the connection string). | A copy-on-write clone of the parent's data at the moment you branch. Writes stay separate. |
| [**Managed Better Auth**](/docs/auth/overview) | Sign-in, users, sessions, and auth config. State lives in the branch's database, so there is nothing extra to provision. Each branch has its own Auth URL. | The database copy, including users and sessions. See [Branching authentication](/docs/auth/branching-authentication). |
| [**Object Storage**](/docs/storage/overview) | S3-compatible buckets and objects. | Buckets and existing objects fork copy-on-write. See [Buckets](/docs/storage/buckets). |
| [**Functions**](/docs/compute/functions/overview) | Your backend code, deployed on the branch, at its own URL. | The same function at a new URL, against this branch's data. |
| [**AI Gateway**](/docs/ai-gateway/overview) | One Neon credential for many LLM providers. Each branch has its own endpoint, credentials, access, and metering. | A new endpoint and credentials, with usage metered on that branch. The [model catalog](/docs/ai-gateway/models) is shared and global: you don't configure models per branch. |

Managed Better Auth, Object Storage, Functions, and the AI Gateway aren't available in every region yet. See [Product availability](/docs/introduction/regions#product-availability).

### What Lakebase Postgres contains

You connect as a [role](/docs/manage/roles) to a [database](/docs/manage/databases) through a [compute](/docs/manage/computes). A branch has one read-write compute and can have multiple [read replicas](/docs/introduction/read-replicas). Autoscaling and scale to zero are settings on the compute. The compute runs Postgres; it does not own the data. Durable database storage sits in a separate layer. That split is what defines Lakebase Postgres. See [The lakebase architecture](/docs/introduction/architecture-overview).

The [Data API](/docs/data-api/overview) is an HTTP interface to the same database, for callers that can't open a Postgres TCP connection, such as browsers and edge runtimes.

## What sits outside the hierarchy

- **Your Neon account.** The account is how you sign in. It isn't a container for resources, and it can belong to several organizations. See [Accounts](/docs/manage/accounts).
- **API keys.** A key is personal (your account), organization-scoped, or project-scoped. None of those scopes is a branch. See [Manage API keys](/docs/manage/api-keys).
- **Region.** The region is set on the project when you create it. Every branch in the project inherits it. See [Regions](/docs/introduction/regions).

## Where to go next

<DetailIconCards>

<a href="/docs/introduction/architecture-overview" description="How compute and durable storage are separated underneath Postgres" icon="database">The lakebase architecture</a>

<a href="/docs/introduction/branching" description="What branches are for and how to work with them" icon="split-branch">Branching</a>

<a href="/docs/get-started/backend-overview" description="One example app built across all five services" icon="setup">How a Neon backend fits together</a>

</DetailIconCards>

<NeedHelp/>
