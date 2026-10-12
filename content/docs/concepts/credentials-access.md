---
title: Credentials & access
subtitle: How API keys, scoped credentials, permissions, and network controls govern access to your backend
summary: >-
  Neon uses a different credential for each job: API keys manage your projects,
  branches, and settings; scoped credentials do your running app's work in
  Object Storage and the AI Gateway; a database connection credential reaches
  Postgres; and the Data API takes a JWT that runs each query as a Postgres
  role. Scoped credentials are limited by their scopes and anchored to a branch
  and its descendants. Your access to a project is your organization role plus
  any per-project grant. IP Allow and Private Networking gate the Postgres
  endpoint; the other services are gated by their credentials.
enableTableOfContents: true
---

Access to your Neon backend runs on a handful of credentials, one for each kind of job: an **API key** manages your setup, a **scoped credential** does your running app's work, a **database connection credential** reaches Postgres, and a **JWT** authorizes end users through the Data API.

The most important line to draw is between the first two. An API key manages your setup and can mint scoped credentials, so keep API keys out of your app's runtime and give each workload its own scoped credential.

![Diagram of Neon's two credential kinds: API keys that manage your Neon setup, and scoped credentials that your app holds, scoped and anchored to a branch. An arrow shows API keys issuing scoped credentials.](/docs/concepts/credentials-access.png 'no-border')

Availability differs by product and by region. See [Product availability](/docs/introduction/regions#product-availability).

## Which credential do you need?

Match what you're doing to the credential that does it. Each row has its own section below:

| Goal                                                                          | Use                                                                 | Scope and reach                                                                                                                                          |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create or manage projects, branches, and settings, or issue other credentials | [API keys](#api-keys)                                               | Personal keys act with your effective access; organization keys cover one organization; project-scoped keys cover one project and can't reach outside it |
| Have a workload read files or call models                                     | [Scoped credentials](#scoped-credentials)                           | By its scopes, such as `storage:read`, plus a branch anchor that covers the branch and its descendants                                                   |
| Connect to Postgres                                                           | [Postgres connection credentials](#postgres-connection-credentials) | IP Allow and Private Networking apply here, and only here                                                                                                |
| Authorize an end user through the Data API                                    | [End-user JWTs](#end-user-jwts)                                     | Trust is registered on the project, and `GRANT`s and RLS in your database decide what the query can do                                                   |

## API keys

<div className="flex items-center gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

An API key is a bearer token for the [Neon API](/docs/reference/api), and there's one API surface for the whole platform rather than one per product, so a single key covers Postgres, Object Storage, the AI Gateway, Functions, and Managed Better Auth alike. Keys come in three kinds with decreasing reach:

- **Personal keys** act as you.
- **Organization keys** cover one organization.
- **Project-scoped keys** cover one project.

An API key can create a scoped credential, but a scoped credential cannot create or manage anything, so keep API keys out of your application runtime. See [Manage API keys](/docs/manage/api-keys).

You can also sign the CLI in with `neon login`; it then acts with your access, like a personal key. For scripts and CI, give the CLI an API key instead. See [CLI authentication](/docs/cli/login).

  </div>
  <div style={{ flex: '1 1 50%' }}>

![Diagram of the three API key kinds nested by decreasing reach: personal keys, then organization keys, then project-scoped keys.](/docs/concepts/credentials-api-key-kinds.png 'no-border')

  </div>
</div>

## Scoped credentials

<div className="flex items-center gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

Most of what your running app connects to uses scoped credentials. Object Storage and the AI Gateway use one shared credential, and the scopes you attach decide what it unlocks:

- `storage:read` and `storage:write` for Object Storage.
- `ai_gateway:invoke` for the AI Gateway.

A credential has two independent dimensions: its scopes say what it can do, and its branch anchor says where it reaches. See [Object storage authentication](/docs/storage/authentication) and [AI Gateway authentication](/docs/ai-gateway/authentication).

  </div>
  <div style={{ flex: '1 1 50%' }}>

![Diagram of a scoped credential defined by two independent things: the scopes that say what it can do, and the branch anchor that says where it reaches.](/docs/concepts/credentials-scope-branch.png 'no-border')

  </div>
</div>

### A branch and its descendants

<div className="flex items-center gap-6 sm:flex-col">
  <div style={{ flex: '1 1 50%' }}>

A credential is tied to the branch you create it on. It works on that branch and on any branch that comes from it, now or later. So a credential created on your default branch reaches nearly every branch in your project, which is handy for preview branches. For production, create a credential on the specific branch that needs it, so its reach stays narrow. See [The object model](/docs/concepts/the-object-model) and [Branching](/docs/introduction/branching).

  </div>
  <div style={{ flex: '1 1 50%' }}>

![Diagram of a credential anchored on a branch reaching that branch and its descendants but not its ancestors or sibling branches.](/docs/concepts/credentials-branch-anchor.png 'no-border')

  </div>
</div>

### S3 keys and bearer tokens

A scoped credential comes in the form each service expects: an S3-compatible access key for Object Storage, and a bearer token for services you call over HTTP, like the AI Gateway. Both are the same underlying credential, so if you revoke or delete it, both stop working at once. You cannot change a credential's scopes or branch after you create it. To rotate the secret while keeping the same credential, scopes, and branch, use `neon credentials rotate`. To change the scopes or branch, create a new credential and revoke the old one. See [Object storage authentication](/docs/storage/authentication#mapping-to-your-s3-sdk).

### Functions

A Neon Function is given a scoped credential for the branch it runs on, so your code can reach Object Storage and the AI Gateway on that branch without you adding a secret. But the function has a public HTTPS URL, and Neon does not check who is calling it. Authenticating incoming requests is up to you, in your handler. See [Environment variables](/docs/compute/functions/environment-variables) and [Neon Functions authentication](/docs/compute/functions/authentication).

## Postgres connection credentials

Connecting to Postgres uses a database connection credential: a Postgres role and its password, in the connection string your app or client uses. See [Connect to Neon](/docs/connect/connect-intro).

IP Allow and Private Networking gate the Postgres endpoint, and only the Postgres endpoint. Object Storage, the AI Gateway, and Function URLs are protected by their credentials instead. See [IP Allow](/docs/introduction/ip-allow) and [Private Networking](/docs/guides/neon-private-networking).

<Admonition type="important" title="Network controls don't cover every service">
IP Allow and Private Networking gate the Postgres endpoint. They don't restrict requests to Object Storage, the AI Gateway, or Function URLs. For those services the credential is the access control, so scope it and anchor it deliberately.
</Admonition>

## End-user JWTs

The [Data API](/docs/data-api/overview) and [Managed Better Auth](/docs/auth/overview) authenticate end users with JWTs. A request carries a JWT from an issuer the project trusts, Neon selects a Postgres role from it, and the query runs as that role, so your `GRANT`s and RLS decide what it can do. See [Manage the Data API](/docs/data-api/manage) and [Access control & security](/docs/data-api/access-control).

![Diagram of an end user's JWT verified by the Data API and run as a Postgres role whose access is governed by GRANTs and row-level security.](/docs/concepts/credentials-data-api-jwt.png 'no-border')

## Who can access a project

Your access on a project is your organization role plus any per-project grant you hold, and a per-project grant only adds access, never removes it. A personal API key's reach follows this rule, which is why it tracks its owner's current access rather than being fixed at creation. See [User permissions](/docs/manage/user-permissions) and the [Permissions quickstart](/docs/manage/project-permissions-get-started).

## Where to go next

<DetailIconCards>

<a href="/docs/manage/api-keys" description="Create, list, and revoke personal, organization, and project-scoped keys." icon="lock-landscape">Manage API keys</a>

<a href="/docs/storage/authentication" description="Create a credential and use it with an AWS SDK." icon="data">Object storage authentication</a>

<a href="/docs/ai-gateway/authentication" description="Create a bearer credential for model calls." icon="sparkle">AI Gateway authentication</a>

<a href="/docs/manage/user-permissions" description="Organization roles, per-project grants, and how they combine." icon="user">User permissions</a>

<a href="/docs/data-api/access-control" description="How JWT verification, roles, and RLS secure the Data API." icon="privacy">Data API access control</a>

<a href="/docs/introduction/ip-allow" description="Restrict database connections to trusted addresses." icon="network">IP Allow</a>

<a href="/docs/connect/connect-intro" description="Connect your app to Postgres, Object Storage, the AI Gateway, and the Data API, one branch at a time." icon="setup">Connect your app</a>

</DetailIconCards>

<NeedHelp/>
