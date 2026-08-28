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

Neon issues two kinds of credentials for managing your Neon resources and governing connection to your backend services:

- **Credentials that manage your Neon setup.** Platform API keys create projects and branches, change settings, read usage, and issue the service credentials your app uses. Use these in your tooling and CI.
- **Credentials your running app uses.** Service credentials do the application's work: an object read or a model call. Use these in your app's runtime environment.

Availability differs by product and by region. See [Product availability](/docs/introduction/regions#product-availability).

## Which credential do you need?

| If you need to...                                                             | Reach for                                                          | What it's for                  | How it's scoped / where it reaches                                                                                                                       | Lives in                                   |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Create or manage projects, branches, and settings, or issue other credentials | Platform API key (personal, organization, or project-scoped)       | Manage your Neon setup         | Personal keys act with your effective access; organization keys cover one organization; project-scoped keys cover one project and can't reach outside it | Your tooling or CI                         |
| Have a workload read files or call models                                     | Service credential (an S3-compatible access key or a bearer token) | Run your app                   | By its scopes, such as `storage:read`, plus a branch anchor that covers the branch and its descendants                                                   | Your app runtime                           |
| Connect to Postgres                                                           | A database connection credential and the branch endpoint           | Run your app                   | IP Allow and Private Networking apply here, and only here                                                                                                | Your backend runtime                       |
| Authorize an end user through the Data API                                    | A JWT from a trusted issuer, plus database roles and RLS           | Authorize your app's end users | Trust is registered on the project, and `GRANT`s and RLS in your database decide what the query can do                                                   | Managed Better Auth or your own JWT issuer |

## Platform API keys

An API key is a bearer token for the [Neon API](/docs/reference/api). There's one API surface for the whole platform rather than one per product, so a single key covers Postgres, Object Storage, the AI Gateway, Functions, and Managed Better Auth alike. Keys create projects and branches, change settings, read usage, and issue the service credentials your app uses.

Keys come in three kinds, in decreasing reach:

- **Personal keys** act as you. On each request, Neon evaluates your effective access to the target project, which is your organization role plus any project-level grant you hold. Belonging to an organization doesn't by itself give you access to every project in it. Any user can create a personal key.
- **Organization keys** cover every project in one organization. Organization Admins only.
- **Project-scoped keys** are limited to one project. They can't create projects and can't act on other projects.

A personal key acts with its owner's current access, so changing that person's organization role or project grants changes what the key can do. Organization and project-scoped keys are fixed when created, at one organization or one project, and don't track anyone's role.

Any API key that can write to a project can also create service credentials for it. A service credential can't do the reverse: it can't call the Neon API or create other credentials. So treat every API key as a management credential and keep it out of your application runtime.

To create, list, or revoke keys, see [Manage API keys](/docs/manage/api-keys).

## Service credentials

Most of what your running app connects to uses service credentials. The Data API is the exception, and it's covered at the end of this section.

Object Storage and the AI Gateway use one shared credential, and the scopes you attach decide what it unlocks:

- `storage:read` and `storage:write` for [Object Storage](/docs/storage/overview)
- `ai_gateway:invoke` for the [AI Gateway](/docs/ai-gateway/overview)

Present a credential to a service it has no matching scope for and the request is refused. Attach the narrowest scopes the workload actually needs, and reach for `storage:read` before `storage:write`.

A credential has two dimensions. Its scopes say what it can do. Its **branch anchor** says where it reaches.

### A branch and its descendants

A credential works on the branch it's created on and on any branch descended from it, including branches created later. It does not work on that branch's ancestors (its parent or above) or on sibling branches elsewhere in the project. That affects which branch you should choose:

- **Anchored on `main`:** works on `main` and on every branch created from it, including preview branches that don't exist yet. There's no need to issue a new one for each branch.
- **Anchored on a child branch:** works on that branch and its own descendants, but not on its parent and not on a sibling. This is the least-privilege choice for one environment.

A credential anchored on your default branch therefore reaches every branch in that lineage, which is convenient for preview workflows and worth being deliberate about in production. Anchor to the narrowest branch that needs the credential, since its descendants inherit it. For how branches relate to each other, see [The object model](/docs/concepts/the-object-model) and [Branching](/docs/introduction/branching).

### S3 keys and bearer tokens

The same credential reaches you in two forms, depending on the service it's for:

- **An S3-compatible access key** for Object Storage. An AWS SDK accepts it unmodified, with no AWS account or IAM setup.
- **A bearer token** for the HTTP services.

There's one grant underneath both forms, so you don't have to track them separately, and revoking or deleting the grant disables both. See [Revoking credentials](/docs/storage/authentication#revoking-credentials). The secret is shown once, when the credential is created, so store it then. Credentials are immutable: you can't add scopes or re-anchor one. To change either, create a new credential and revoke the old.

A credential can carry more than one scope, which is right when a single workload genuinely needs all of them. Prefer separate credentials per service, per environment, or per deployment unit whenever that shrinks what a leaked credential exposes, or makes revoking one thing safe to do without breaking the others.

For the procedures and the environment variables each service expects, see [Object storage authentication](/docs/storage/authentication) and [AI Gateway authentication](/docs/ai-gateway/authentication).

### Functions

A Neon Function receives an injected service credential for the branch it serves, so your handler reaches Object Storage and the AI Gateway on that branch without you shipping a secret. See [Environment variables](/docs/compute/functions/environment-variables).

Inbound requests are yours to authenticate. A function has a public HTTPS URL and no platform gate in front of your handler, so check callers at the top of the function. See [Neon Functions authentication](/docs/compute/functions/authentication).

### The Data API and Managed Better Auth

The [Data API](/docs/data-api/overview) and [Managed Better Auth](/docs/auth/overview) don't use service credentials. They use JWTs, the signed bearer tokens standard in web auth: a request carries a JWT from an issuer the project trusts, the Data API verifies it, selects a Postgres role from it, and runs the query as that role, so your `GRANT`s and RLS decide what it can do. Which branch you touch follows from the endpoint you call, not from anything inside the token.

With an external provider, you register the issuer yourself by adding its JWKS URL to the project. With Managed Better Auth, Neon provides the JWKS URL for you. Either way the trust applies project-wide by default, and can be narrowed to a single branch.

To register providers, see [Manage the Data API](/docs/data-api/manage). For roles, `GRANT`s, and RLS, see [Access control & security](/docs/data-api/access-control).

## Who can access a project

Credentials answer what a token can do. Roles answer what a person can do. Your access on a project is your organization role plus anything granted to you on that project, and a per-project grant only adds access, never removes it. Collaborators are the closed-by-default case: without an explicit grant, a project doesn't appear to them at all.

This is what a personal API key's reach follows, which is why it tracks its owner's current access rather than being fixed at creation. For the roles, the grants, and how they combine, see [User permissions](/docs/manage/user-permissions) and the [Permissions quickstart](/docs/manage/project-permissions-get-started). Both live under **Access & collaboration** in the [Platform](/docs/manage/platform) section, along with organizations and database access.

## Network controls gate the Postgres endpoint

Neon's network controls attach to the Postgres endpoint. They aren't a perimeter around the project as a whole:

- [**IP Allow**](/docs/introduction/ip-allow) restricts which client addresses can connect to your database.
- [**Private Networking**](/docs/guides/neon-private-networking) routes database traffic over AWS PrivateLink instead of the public internet.

Object Storage, the AI Gateway, and Function URLs use service-specific public endpoints of their own. IP Allow and Private Networking for Postgres don't restrict requests to those endpoints.

<Admonition type="important" title="Network controls don't cover every service">
IP Allow and Private Networking gate the Postgres endpoint. They don't restrict requests to Object Storage, the AI Gateway, or Function URLs. For those services the credential is the access control, so scope it and anchor it deliberately instead of relying on a network boundary that isn't in front of them.
</Admonition>

## Compliance controls

[HIPAA](/docs/security/hipaa) is a compliance configuration available to eligible organizations and projects, and it's a separate category from the controls above. Enabling it doesn't change who can reach a service or what a credential can do, so credential scoping, authorization in your database, and network restrictions on the Postgres endpoint all still apply.

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
