---
title: Credentials & access
subtitle: Which credential reaches what, and what gates each service endpoint
summary: >-
  Neon has two credential tiers. Platform API keys authenticate control-plane
  operations across every product and mint the credentials your application
  uses. Scoped credentials are a single data-plane credential type shared by
  Object Storage, the AI Gateway, Functions, and telemetry ingest, told apart by
  their scopes and anchored to a branch and its descendants. Access for people is
  two additive layers: an organization role plus per-project grants. Network
  controls such as IP Allow and Private Networking gate the Postgres endpoint,
  while the other service endpoints are gated by credentials.
enableTableOfContents: true
---

Neon issues two kinds of credentials, and they aren't interchangeable. One manages your account and your resources. The other lets a running application read an object, call a model, or ship telemetry. Mixing them up gets you either a broken deploy or a secret with far more reach than it needs.

This page explains the two tiers, what "scoped" actually means, how human access is layered on top, and which service endpoints network controls do and don't cover. Creating, listing, and revoking credentials are procedures, and each section links to them.

Availability differs by product and by region. See [Product availability](/docs/introduction/regions#product-availability).

## Two credential tiers

Every Neon credential talks to one of two planes.

- **The control plane** is the Neon API and the Console: creating projects and branches, changing settings, reading usage, and issuing credentials. Platform API keys authenticate it.
- **The data plane** is where your application does its work: an S3 request, a model call, an OTLP export. Scoped credentials authenticate it.

The tiers are deliberately asymmetric. An API key can mint a scoped credential. A scoped credential can't mint anything, and it can't reach the control plane at all. That asymmetry is the reason an API key belongs in your own tooling and a scoped credential belongs in your application.

### Platform API keys

An API key is a bearer token for the [Neon API](/docs/reference/api). There is one control-plane surface for the whole platform, not one per product, so a single key covers Postgres, Object Storage, the AI Gateway, Functions, and Managed Better Auth alike.

Keys come in three rungs, in decreasing reach:

- **Personal keys** carry your own access: every project in every organization where you're a member. Any user can create one.
- **Organization keys** cover every project in one organization. Organization Admins only.
- **Project-scoped keys** are pinned to a single project and act at member level inside it. This rung is genuinely narrower, not just labeled that way: a project-scoped key can't act on other projects and can't create projects.

Two consequences worth holding on to. First, a key never exceeds the access of the identity behind it, and that access is evaluated per request, so changing someone's role changes what their existing keys can do. Second, because a personal or organization key is what mints data-plane credentials, it sits above everything else you issue. Treat it as a management credential and keep it out of deployed application code.

To create, list, or revoke keys, see [Manage API keys](/docs/manage/api-keys).

### Scoped credentials

Object Storage, the AI Gateway, telemetry ingest, and Functions don't have four unrelated token systems. They share one credential type, and what differs is the **scopes** you attach to it:

- `storage:read` and `storage:write` for [Object Storage](/docs/storage/overview)
- `ai_gateway:invoke` for the [AI Gateway](/docs/ai-gateway/overview)
- `telemetry:write` for OTLP ingest

One credential can carry several scopes, so a single credential can serve an application that both stores files and calls models. Present a credential to a service it has no matching scope for and the request is refused.

That one credential also speaks two wire protocols, because the services expect different shapes:

- **S3 SigV4:** Object Storage hands you an access key ID and a secret access key that an AWS SDK accepts unmodified, with no AWS account or IAM setup.
- **Bearer token:** the AI Gateway and the other HTTP surfaces take an `Authorization: Bearer` header.

Those aren't two credentials. They're two representations of one, issued together and revoked together. Secrets are returned once, at creation time, so store them then.

For the procedures and the environment variables each service expects, see [Object storage authentication](/docs/storage/authentication) and [AI Gateway authentication](/docs/ai-gateway/authentication).

### Where Functions fit

A Neon Function sits on both sides of this. It's a **consumer** of scoped credentials: Neon injects a credential for the branch the function serves, so your handler can reach Object Storage and the AI Gateway on that branch without you shipping any secret. See [Environment variables](/docs/compute/functions/environment-variables).

Inbound is a separate question. A function has a public HTTPS URL and no platform gate in front of your handler, so you authenticate callers yourself, at the top of the function. See [Neon Functions authentication](/docs/compute/functions/authentication).

## What a scoped credential reaches

A scoped credential has two dimensions. The scope says what it can do. Its **branch anchor** says where.

A credential is anchored to one branch, and it's valid on that branch and on every branch descended from it. This is lineage, not an exact-branch match, and the distinction changes how you provision:

- **Anchored on `main`:** works on `main` and on every branch created from it, including preview branches that don't exist yet. Nothing to re-mint per branch.
- **Anchored on a child branch:** works on that branch and its own descendants, but not on its parent and not on a sibling. This is the least-privilege choice for one environment.

So read "branch-scoped" as _this branch and its descendants_. A credential minted on your default branch is effectively a project-wide credential for that service, which is convenient for preview workflows and worth being deliberate about in production. For how branches relate to each other, see [The object model](/docs/concepts/the-object-model) and [Branching](/docs/introduction/branching).

<Admonition type="note" title="The Data API and Managed Better Auth work differently">
Don't reason about these two in branch-lineage terms. They don't use scoped credentials at all, so the rest of this section doesn't apply to them. See [A different trust model](#a-different-trust-model-the-data-api-and-managed-better-auth).
</Admonition>

### A different trust model: the Data API and Managed Better Auth

The [Data API](/docs/data-api/overview) and [Managed Better Auth](/docs/auth/overview) don't authenticate with a scoped credential. Their trust comes from a JWKS URL you register plus the endpoint the request arrives on:

- **You register a trusted issuer** on the project by adding its JWKS URL. It applies project-wide by default, and can be narrowed to a single branch.
- **Requests carry a JWT** from that issuer. The Data API verifies the token, selects a Postgres role from it, and runs the query as that role, so authorization is `GRANT`s and Row-Level Security in your database rather than a scope on a token.
- **Which branch you touch** follows from the endpoint you call, not from anything inside the token.

The practical difference: for Object Storage and the AI Gateway, reach is a property of the credential. For the Data API, reach is a property of the endpoint you call and of the permissions in the database itself. To register providers, see [Manage the Data API](/docs/data-api/manage); for roles, `GRANT`s, and RLS, see [Access control & security](/docs/data-api/access-control).

## Access for people: two additive layers

Credentials answer "what can this token do." Roles answer "what can this person do." Neon splits that into two layers:

- **An organization role** sets a baseline across every project in the organization.
- **Per-project permissions** grant additional access on individual projects.

The layers are **additive**: your effective access on a project is the higher of the two, so a per-project grant can only raise access, never lower it. Collaborators are the closed-by-default case: without an explicit grant, a project doesn't appear to them at all.

This is the layer API keys inherit from, which is why a personal key's reach follows its owner's roles rather than being fixed at creation. For the roles, the grants, and how they combine, see [User permissions](/docs/manage/user-permissions) and the [Permissions quickstart](/docs/manage/project-permissions-get-started).

## Network controls gate the Postgres endpoint

Neon's network and compliance controls attach to the Postgres endpoint. They aren't a perimeter around the project as a whole:

- **[IP Allow](/docs/introduction/ip-allow)** restricts which client addresses can connect to your database.
- **[Private Networking](/docs/guides/neon-private-networking)** routes database traffic over AWS PrivateLink instead of the public internet.
- **[HIPAA](/docs/security/hipaa)** is a compliance configuration on the organization and the project. Its technical effect lands on the Postgres compute, chiefly as an audit logging floor.

The other services reach the internet on their own endpoints: Object Storage, the AI Gateway, telemetry ingest, and Function URLs. Those endpoints are public, and the credential is what gates them.

<Admonition type="important" title="Network controls don't cover every service">
IP Allow and Private Networking gate the Postgres endpoint. They don't restrict Object Storage, the AI Gateway, Function URLs, or telemetry ingest. For those services, the credential is the access control, so scope it and anchor it deliberately instead of relying on a network boundary that isn't in front of them.
</Admonition>

That leads to a short set of habits:

- **Attach the narrowest scopes** that the workload actually needs. Reach for `storage:read` before `storage:write`.
- **Anchor to the narrowest branch** that needs the credential, remembering that descendants inherit it.
- **Keep API keys out of applications.** Ship scoped credentials, and mint them from a key held by your deployment tooling.
- **Revoke credentials you no longer need.** Revocation is the reliable way to end access. See [Revoking credentials](/docs/storage/authentication#revoking-credentials).

## Where to go next

<DetailIconCards>

<a href="/docs/manage/api-keys" description="Create, list, and revoke personal, organization, and project-scoped keys" icon="lock-landscape">Manage API keys</a>

<a href="/docs/storage/authentication" description="Mint an S3 keypair and use it with an AWS SDK" icon="data">Object storage authentication</a>

<a href="/docs/ai-gateway/authentication" description="Mint a bearer credential for model calls" icon="sparkle">AI Gateway authentication</a>

<a href="/docs/manage/user-permissions" description="Organization roles, per-project grants, and how they combine" icon="user">User permissions</a>

<a href="/docs/data-api/access-control" description="How JWT verification, roles, and RLS secure the Data API" icon="privacy">Data API access control</a>

<a href="/docs/introduction/ip-allow" description="Restrict database connections to trusted addresses" icon="network">IP Allow</a>

</DetailIconCards>

<NeedHelp/>
