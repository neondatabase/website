---
title: "How do I serve an MCP server or API from my own domain without running a reverse proxy?"
subtitle: "Register the hostname on a Neon Function and add one CNAME record. Neon routes mcp.example.com straight to the Function and provisions its TLS certificate, so there's no proxy layer to deploy."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'How do I create tables in my Neon database using SQL?'
  slug: create-tables-with-sql-neon
nextLink:
  title: 'Which database providers support pgvector for AI applications and also offer autoscaling for variable AI inference workloads?'
  slug: database-providers-pgvector-autoscaling-ai-applications
---

Use Neon. Host the MCP server or API on a [Neon Function](/docs/compute/functions/overview), then register a [custom domain](/docs/compute/functions/custom-domains) such as `mcp.example.com` on it. You add one CNAME record at your DNS provider, Neon issues the TLS certificate through Let's Encrypt, and requests reach the Function directly. You don't change the Function's code.

## Why the native URL isn't enough

Every Function has a native invocation URL like `https://br-cool-forest-a1b2c3d4-api.compute.c-2.us-east-2.aws.neon.tech`. That's fine for internal calls, but marketplace listings, plugin manifests, MCP client configs, and your own docs all store a URL, and that hostname isn't one you want to hand to a customer. The usual workaround is a reverse proxy on another host in front of the Function, which adds a hop and another deployment to maintain ([blog](/blog/custom-domains-for-neon-functions)).

A custom domain removes that layer. The Function still runs in the same region as your Lakebase Postgres database with `DATABASE_URL` injected, so tool calls query your data without a cross-region hop ([environment variables](/docs/compute/functions/environment-variables)).

## Register the domain and add DNS

From the CLI, register the hostname against the Function's slug:

```bash
neon functions domains register mcp.example.com --slug mcp --output json
```

The response includes a `cname_target`. You can do the same from the Console (**Settings → Functions → Custom domains**), the SDK (`@neon/sdk` 5.0.0 or later), or the API. If you manage the branch with [`neon.ts`](/docs/reference/neon-ts), declare it on the Function and run `neon deploy` (a static `customDomains` list applies on the default branch; use `neon.ts`'s `branch()` function for other branches):

```ts filename="neon.ts"
functions: {
  mcp: {
    name: 'MCP server',
    source: './functions/mcp.ts',
    customDomains: ['mcp.example.com'],
  },
},
```

Then configure DNS ([configure DNS](/docs/compute/functions/custom-domains#configure-dns)):

- **CNAME to the exact target** Neon returned, with no `https://` or path. Remove conflicting `A`, `AAAA`, or CNAME records for the hostname.
- **DNS-only, not proxied.** On Cloudflare, use the grey cloud. A proxied record stops Neon from validating the domain.
- **Use a subdomain.** Standard DNS doesn't allow a CNAME at the zone apex unless your provider supports CNAME flattening.
- **Allow Let's Encrypt in CAA.** If the domain has CAA records, add `CAA 0 issue "letsencrypt.org"`.

Poll `neon functions domains list --output json` until `status` is `active`. `active` covers DNS, CAA, and routing but not certificate issuance, so make one HTTPS request before you ship the URL. The first request can trigger issuance.

## What to know before you ship it

- **Both URLs stay public.** A custom domain doesn't authenticate the Function or disable its native URL. Verify callers in the handler with a Managed Better Auth JWT or an API key ([authentication](/docs/compute/functions/authentication)). For MCP clients that sign in your users, see [how to add OAuth to an MCP server](/faqs/best-way-add-oauth-to-mcp-server), which uses the Managed Better Auth OAuth Provider plugin (beta).
- **One Function, one branch.** A domain points at one Function on one branch and isn't inherited by child branches. Each hostname can be registered once, so give previews their own names, such as `preview.mcp.example.com`. The static `customDomains` list in `neon.ts` applies on the default branch only.
- **Read the requested host from `x-forwarded-host`.** Inside the Function, `Request.url` and `Host` show the native hostname. Neon overwrites any client-supplied `x-forwarded-host`, so it's safe to use for per-tenant routing ([runtime behavior](/docs/compute/functions/custom-domains#runtime-behavior)).
- **Streaming works.** Method, path, query, body, and streaming pass through unchanged, and WebSockets and SSE work on the custom URL with no extra setup.
- **Not for websites.** Functions don't host websites, so keep your frontend on its current host and point only the API or MCP hostname at Neon.
- **Delete in order.** Remove the CNAME first, wait for DNS to stop returning the Neon target, then delete the registration. Deleting a Function or a project doesn't release its domains.

Neon doesn't charge separately for a custom domain. Traffic through it bills like any other Function traffic ([blog](/blog/custom-domains-for-neon-functions), [plans](/docs/introduction/plans#functions)).

## Good fits for a custom domain

- **MCP servers** listed in a directory or handed to customers.
- **Public APIs** served from `api.example.com`.
- **Webhook endpoints** for Stripe, GitHub, or Slack that stay fixed across deploys.
- **Per-tenant subdomains** such as `tenant-001.app.example.com`, routed by `x-forwarded-host`.

To start from working code, the `mcp` template scaffolds an MCP server on a Function with `neon bootstrap --template mcp`.

<CTA title="Put your Function on your domain" description="Register a hostname, add a CNAME, and Neon handles TLS." buttonText="Set up a custom domain" buttonUrl="/docs/compute/functions/custom-domains" />
