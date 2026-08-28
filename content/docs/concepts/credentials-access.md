---
title: Credentials & access
subtitle: Which credential reaches what, and what gates each service endpoint
summary: >-
  Neon issues two kinds of credentials: platform API keys that manage your Neon
  setup and live in your tooling, and scoped credentials that your running app
  uses. A scoped credential is one Neon-managed grant, exposed as
  service-specific credential material, limited by its scopes and anchored to a
  branch and its descendants. The Data API is the exception, trusting an
  end-user JWT from an issuer you register. Access for people is two additive
  layers: an organization role plus per-project grants. IP Allow and Private
  Networking gate the Postgres endpoint, while the other services are gated by
  credentials.
enableTableOfContents: true
---

Neon issues two kinds of credentials, and they aren't interchangeable. One kind manages your Neon setup: your projects, branches, and settings. The other kind is what a running application uses to read a file, call a model, or ship telemetry. Mixing them up gets you either a broken deploy or a secret with far more reach than it needs.

This page explains the two kinds, what "scoped" actually means, how access for people is layered on top, and which service endpoints network controls do and don't cover. Creating, listing, and revoking credentials are procedures, and each section links to them.

Availability differs by product and by region. See [Product availability](/docs/introduction/regions#product-availability).

## Which credential do you need?

| If you need to...                                                            | Reach for                                                           | What it's for          | How it's scoped / where it reaches                                                                                                                       | Lives in                    |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Create or manage projects, branches, and settings, or mint other credentials | Platform API key (personal, organization, or project-scoped)        | Manage your Neon setup | Personal keys act with your effective access; organization keys cover one organization; project-scoped keys cover one project and can't reach outside it | Your tooling or CI          |
| Have a workload read files, call models, or ship telemetry                   | Scoped credential (one grant, exposed as service-specific material) | Run your app           | By its scopes, such as `storage:read`, plus a branch anchor that covers the branch and its descendants                                                   | Your app runtime            |
| Connect to Postgres                                                          | A database connection credential and the branch endpoint            | Run your app           | IP Allow and Private Networking apply here, and only here                                                                                                | Your backend runtime        |
| Authorize an end user through the Data API                                   | An end-user JWT from a trusted issuer, plus database roles and RLS  | The exception          | Trust is registered on the project, not carried by a scoped credential                                                                                   | Your identity provider flow |

The rest of this page explains why the rows differ.

## Two kinds of credentials

The split is about what a credential is allowed to do, and it decides where the credential belongs.

- **Credentials that manage your Neon setup.** Platform API keys create projects and branches, change settings, read usage, and mint the credentials your app uses. They belong in your own tooling and CI, not in shipped application code.
- **Credentials your running app uses.** Scoped credentials do the application's work: an object read, a model call, a telemetry export. They belong in your app's runtime environment.

The two are deliberately asymmetric. An API key manages your Neon resources and can mint app credentials. An app credential can't manage anything and can't mint anything: it does its one job and nothing more. That asymmetry is the whole reason the API key stays in your tooling and the app credential ships with your app.

### Platform API keys

An API key is a bearer token for the [Neon API](/docs/reference/api). There's one API surface for the whole platform rather than one per product, so a single key covers Postgres, Object Storage, the AI Gateway, Functions, and Managed Better Auth alike.

Keys come in three kinds, in decreasing reach:

- **Personal keys** act as you. On each request, Neon evaluates your effective access to the target project, which is your organization role plus any project-level grant you hold. Belonging to an organization doesn't by itself give you access to every project in it. Any user can create a personal key.
- **Organization keys** cover every project in one organization. Organization Admins only.
- **Project-scoped keys** are limited to one project. They can't create projects and can't act on other projects.

Two consequences worth holding on to. First, because a key's reach is evaluated per request against its owner's access, changing someone's role changes what their existing keys can do. Second, because a personal or organization key is what mints app credentials, it sits above everything else you issue. Treat it as a management credential.

To create, list, or revoke keys, see [Manage API keys](/docs/manage/api-keys).

### Scoped credentials

Object Storage, the AI Gateway, and telemetry ingest don't have three unrelated token systems. They share one kind of credential, and what differs is the **scopes** you attach to it:

- `storage:read` and `storage:write` for [Object Storage](/docs/storage/overview)
- `ai_gateway:invoke` for the [AI Gateway](/docs/ai-gateway/overview)
- `telemetry:write` for telemetry ingest

Present a credential to a service it has no matching scope for and the request is refused.

#### One grant, service-specific material

It helps to separate two things that are easy to conflate:

- **The credential** is one grant that Neon manages for you. It's the thing you create, list, and revoke.
- **The credential material** is what you actually put in a client, and it differs by target service. Object Storage exposes S3-compatible access-key material that an AWS SDK accepts unmodified, with no AWS account or IAM setup. The HTTP services take a bearer token.

Different material, one grant underneath. That's why revoking or deleting the grant disables every piece of material issued for it, and why you don't have to track the pieces separately. Material is shown once, when the grant is created, so store it then.

For the procedures and the environment variables each service expects, see [Object storage authentication](/docs/storage/authentication) and [AI Gateway authentication](/docs/ai-gateway/authentication).

#### One credential or several?

A credential can carry more than one scope, which is right when a single workload genuinely needs all of them. But reaching for one credential everywhere isn't the safer default. Prefer separate credentials per service, per environment, or per deployment unit whenever that shrinks what a leaked credential exposes, or makes revoking one thing safe to do without breaking the others.

### Where Functions fit

A Neon Function sits on both sides of this. It's a **consumer** of scoped credentials: Neon injects a credential for the branch the function serves, so your handler can reach Object Storage and the AI Gateway on that branch without you shipping any secret. See [Environment variables](/docs/compute/functions/environment-variables).

Inbound is a separate question. A function has a public HTTPS URL and no platform gate in front of your handler, so you authenticate callers yourself, at the top of the function. See [Neon Functions authentication](/docs/compute/functions/authentication).

## What a scoped credential reaches

A scoped credential has two dimensions. Its scopes say what it can do. Its **branch anchor** says where.

A credential is anchored to one branch, and it's valid on that branch and on every branch descended from it. This is lineage, not an exact-branch match, and the distinction changes how you provision:

- **Anchored on `main`:** works on `main` and on every branch created from it, including preview branches that don't exist yet. Nothing to re-mint per branch.
- **Anchored on a child branch:** works on that branch and its own descendants, but not on its parent and not on a sibling. This is the least-privilege choice for one environment.

So read "branch-scoped" as _this branch and its descendants_. A credential minted on your default branch is effectively a project-wide credential for that service, which is convenient for preview workflows and worth being deliberate about in production. For how branches relate to each other, see [The object model](/docs/concepts/the-object-model) and [Branching](/docs/introduction/branching).

<Admonition type="note" title="The Data API and Managed Better Auth work differently">
Don't reason about these two in branch-lineage terms. They don't use scoped credentials at all, so the rest of this section doesn't apply to them. See [A different trust model](#a-different-trust-model-the-data-api-and-managed-better-auth).
</Admonition>

### A different trust model: the Data API and Managed Better Auth

The [Data API](/docs/data-api/overview) and [Managed Better Auth](/docs/auth/overview) don't authenticate with a scoped credential. Their trust comes from an issuer you register on the project plus the endpoint the request arrives on:

- **You register a trusted issuer** on the project by adding its JWKS URL. It applies project-wide by default, and can be narrowed to a single branch.
- **Requests carry a JWT** from that issuer. The Data API verifies the token, selects a Postgres role from it, and runs the query as that role, so authorization is `GRANT`s and Row-Level Security in your database rather than a scope on a token.
- **Which branch you touch** follows from the endpoint you call, not from anything inside the token.

The practical difference: for Object Storage and the AI Gateway, reach is a property of the credential. For the Data API, reach is a property of the endpoint you call and of the permissions in the database itself. To register providers, see [Manage the Data API](/docs/data-api/manage); for roles, `GRANT`s, and RLS, see [Access control & security](/docs/data-api/access-control).

## Access for people: two additive layers

Credentials answer "what can this token do." Roles answer "what can this person do." Neon splits that into two layers:

- **An organization role** sets a baseline across every project in the organization.
- **Per-project permissions** grant additional access on individual projects.

The layers are **additive**: your effective access on a project is the higher of the two, so a per-project grant can only raise access, never lower it. Collaborators are the closed-by-default case: without an explicit grant, a project doesn't appear to them at all.

This is the layer a personal API key inherits from, which is why its reach follows its owner's current access rather than being fixed at creation. For the roles, the grants, and how they combine, see [User permissions](/docs/manage/user-permissions) and the [Permissions quickstart](/docs/manage/project-permissions-get-started). Both live under **Access & collaboration** in the [Platform](/docs/manage/platform) section, along with organizations and database access.

## Network controls gate the Postgres endpoint

Neon's network controls attach to the Postgres endpoint. They aren't a perimeter around the project as a whole:

- **[IP Allow](/docs/introduction/ip-allow)** restricts which client addresses can connect to your database.
- **[Private Networking](/docs/guides/neon-private-networking)** routes database traffic over AWS PrivateLink instead of the public internet.

Object Storage, the AI Gateway, telemetry ingest, and Function URLs use service-specific public endpoints of their own. IP Allow and Private Networking for Postgres don't restrict requests to those endpoints.

<Admonition type="important" title="Network controls don't cover every service">
IP Allow and Private Networking gate the Postgres endpoint. They don't restrict requests to Object Storage, the AI Gateway, Function URLs, or telemetry ingest. For those services the credential is the access control, so scope it and anchor it deliberately instead of relying on a network boundary that isn't in front of them.
</Admonition>

## Compliance controls

[HIPAA](/docs/security/hipaa) is a compliance configuration available to eligible organizations and projects, and it belongs in a different category from everything above. It isn't an access-control or network mechanism: enabling it doesn't restrict who can reach a service or narrow what a credential can do. It also doesn't replace credential scoping, authorization in your database, or network restrictions on the Postgres endpoint. You still need those.

## Secure defaults

- **Attach the narrowest scopes** the workload actually needs. Reach for `storage:read` before `storage:write`.
- **Anchor to the narrowest branch** that needs the credential, remembering that descendants inherit it.
- **Keep API keys out of deployed application code.** Ship app credentials, and mint them from a key held by your tooling.
- **Don't assume Postgres network controls protect your other services.** They don't.
- **Revoke a credential when you no longer need it.** See [Revoking credentials](/docs/storage/authentication#revoking-credentials).

## Where to go next

<DetailIconCards>

<a href="/docs/manage/api-keys" description="Create, list, and revoke personal, organization, and project-scoped keys" icon="lock-landscape">Manage API keys</a>

<a href="/docs/storage/authentication" description="Create a credential and use it with an AWS SDK" icon="data">Object storage authentication</a>

<a href="/docs/ai-gateway/authentication" description="Create a bearer credential for model calls" icon="sparkle">AI Gateway authentication</a>

<a href="/docs/manage/user-permissions" description="Organization roles, per-project grants, and how they combine" icon="user">User permissions</a>

<a href="/docs/data-api/access-control" description="How JWT verification, roles, and RLS secure the Data API" icon="privacy">Data API access control</a>

<a href="/docs/introduction/ip-allow" description="Restrict database connections to trusted addresses" icon="network">IP Allow</a>

</DetailIconCards>

<NeedHelp/>
