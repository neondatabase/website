---
title: Credentials & access
subtitle: How API keys, service credentials, permissions, and network controls govern access to your backend
summary: >-
  Neon issues two kinds of credentials: platform API keys that manage your
  projects, branches, and settings, and service credentials that a running app
  uses. A service credential is limited by its scopes and anchored to a branch
  and its descendants, and it appears as an S3-compatible access key or a bearer
  token. The Data API instead takes a JWT from a trusted issuer and runs each
  query as a Postgres role. Your access to a project is your organization role
  plus any per-project grant. IP Allow and Private Networking gate the Postgres
  endpoint, and the other services are gated by credentials.
enableTableOfContents: true
---

Neon issues two kinds of credentials, and they do different jobs:

- **Platform API keys** manage your Neon setup: create projects and branches, change settings, read usage, and issue the service credentials your app uses. Use these in your tooling and CI.
- **Service credentials** do your running app's work, like an object read or a model call. Use these in your app's runtime environment.

![Diagram of Neon's two credential kinds: platform API keys that manage your Neon setup, and service credentials your running app uses, with a platform API key issuing service credentials in one direction only.](/docs/concepts/credentials-access.png 'no-border')

Availability differs by product and by region. See [Product availability](/docs/introduction/regions#product-availability).

## Which credential do you need?

| Goal                                                                          | Use                                                           | Scope and reach                                                                                                                                          |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create or manage projects, branches, and settings, or issue other credentials | [Platform API key](/docs/manage/api-keys)                     | Personal keys act with your effective access; organization keys cover one organization; project-scoped keys cover one project and can't reach outside it |
| Have a workload read files or call models                                     | [Service credential](/docs/storage/authentication)           | By its scopes, such as `storage:read`, plus a branch anchor that covers the branch and its descendants                                                   |
| Connect to Postgres                                                           | [Database connection credential](/docs/connect/connect-intro) | IP Allow and Private Networking apply here, and only here                                                                                                |
| Authorize an end user through the Data API                                    | [JWT from a trusted issuer](/docs/data-api/access-control)    | Trust is registered on the project, and `GRANT`s and RLS in your database decide what the query can do                                                   |

## Platform API keys

<div className="flex items-center gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

An API key is a bearer token for the [Neon API](/docs/reference/api), and there's one API surface for the whole platform rather than one per product, so a single key covers Postgres, Object Storage, the AI Gateway, Functions, and Managed Better Auth alike. Keys come in three kinds with decreasing reach:

- **Personal keys** act as you.
- **Organization keys** cover one organization.
- **Project-scoped keys** cover one project.

An API key can create a service credential, but a service credential cannot create or manage anything, so keep API keys out of your application runtime. See [Manage API keys](/docs/manage/api-keys).

  </div>
  <div style={{ flex: '1 1 50%' }}>

![Diagram of the three platform API key kinds nested by decreasing reach: personal keys, then organization keys, then project-scoped keys.](/docs/concepts/credentials-api-key-kinds.png 'no-border')

  </div>
</div>

## Service credentials

<div className="flex items-center gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

Most of what your running app connects to uses service credentials. Object Storage and the AI Gateway use one shared credential, and the scopes you attach decide what it unlocks:

- `storage:read` and `storage:write` for Object Storage.
- `ai_gateway:invoke` for the AI Gateway.

A credential has two independent dimensions: its scopes say what it can do, and its branch anchor says where it reaches. See [Object storage authentication](/docs/storage/authentication) and [AI Gateway authentication](/docs/ai-gateway/authentication).

  </div>
  <div style={{ flex: '1 1 50%' }}>

![Diagram of a service credential defined by two independent things: the scopes that say what it can do, and the branch anchor that says where it reaches.](/docs/concepts/credentials-scope-branch.png 'no-border')

  </div>
</div>

### A branch and its descendants

<div className="flex items-center gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

A credential works on the branch it's created on and on any branch descended from it, including branches created later. It does not work on that branch's ancestors or on sibling branches elsewhere in the project. A credential anchored on your default branch therefore reaches every branch in that lineage, which is convenient for preview workflows and worth being deliberate about in production. See [The object model](/docs/concepts/the-object-model) and [Branching](/docs/introduction/branching).

  </div>
  <div style={{ flex: '1 1 50%' }}>

![Diagram of a credential anchored on a branch reaching that branch and its descendants but not its ancestors or sibling branches.](/docs/concepts/credentials-branch-anchor.png 'no-border')

  </div>
</div>

### S3 keys and bearer tokens

The same credential reaches you in two forms: an S3-compatible access key for Object Storage, or a bearer token for the HTTP services. One grant sits underneath both forms, so revoking or deleting the grant disables both. Credentials are immutable: you can't add scopes or re-anchor one. See [Object storage authentication](/docs/storage/authentication#mapping-to-your-s3-sdk).

### Functions

A Neon Function receives an injected service credential for the branch it serves, so your handler reaches Object Storage and the AI Gateway on that branch without you shipping a secret. Inbound requests are yours to authenticate: a function has a public HTTPS URL with no platform gate in front of your handler. See [Environment variables](/docs/compute/functions/environment-variables) and [Neon Functions authentication](/docs/compute/functions/authentication).

### The Data API and Managed Better Auth

The [Data API](/docs/data-api/overview) and [Managed Better Auth](/docs/auth/overview) don't use service credentials. They use JWTs: a request carries a JWT from an issuer the project trusts, a Postgres role is selected from it and the query runs as that role, so your `GRANT`s and RLS decide what it can do. See [Manage the Data API](/docs/data-api/manage) and [Access control & security](/docs/data-api/access-control).

![Diagram of an end user's JWT verified by the Data API and run as a Postgres role whose access is governed by GRANTs and row-level security.](/docs/concepts/credentials-data-api-jwt.png 'no-border')

## Who can access a project

Your access on a project is your organization role plus any per-project grant you hold, and a per-project grant only adds access, never removes it. A personal API key's reach follows this rule, which is why it tracks its owner's current access rather than being fixed at creation. See [User permissions](/docs/manage/user-permissions) and the [Permissions quickstart](/docs/manage/project-permissions-get-started).

## Network controls gate the Postgres endpoint

IP Allow and Private Networking only protect the Postgres connection. Object Storage, the AI Gateway, and Function URLs are protected by their credentials instead. See [IP Allow](/docs/introduction/ip-allow) and [Private Networking](/docs/guides/neon-private-networking).

<Admonition type="important" title="Network controls don't cover every service">
IP Allow and Private Networking gate the Postgres endpoint. They don't restrict requests to Object Storage, the AI Gateway, or Function URLs. For those services the credential is the access control, so scope it and anchor it deliberately instead of relying on a network boundary that isn't in front of them.
</Admonition>

## Compliance controls

HIPAA is a compliance configuration available to eligible organizations and projects. Enabling it doesn't change who can reach a service or what a credential can do, so credential scoping, authorization in your database, and network restrictions on the Postgres endpoint all still apply. See [HIPAA](/docs/security/hipaa).

## Where to go next

<DetailIconCards>

<a href="/docs/manage/api-keys" description="Create, list, and revoke personal, organization, and project-scoped keys." icon="lock-landscape">Manage API keys</a>

<a href="/docs/storage/authentication" description="Create a credential and use it with an AWS SDK." icon="data">Object storage authentication</a>

<a href="/docs/ai-gateway/authentication" description="Create a bearer credential for model calls." icon="sparkle">AI Gateway authentication</a>

<a href="/docs/manage/user-permissions" description="Organization roles, per-project grants, and how they combine." icon="user">User permissions</a>

<a href="/docs/data-api/access-control" description="How JWT verification, roles, and RLS secure the Data API." icon="privacy">Data API access control</a>

<a href="/docs/introduction/ip-allow" description="Restrict database connections to trusted addresses." icon="network">IP Allow</a>

</DetailIconCards>

<NeedHelp/>
