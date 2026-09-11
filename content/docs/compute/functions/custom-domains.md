---
title: Custom domains for Neon Functions
subtitle: Serve a Neon Function from a domain you own.
summary: >-
  Register a custom domain for a Neon Function, configure its DNS CNAME record,
  verify TLS and routing, troubleshoot domain status, and remove it safely.
enableTableOfContents: true
---

<FeatureBetaProps feature_name="Neon Functions" />

Each Neon Function has a native invocation URL. You can also serve it from a
domain you own, such as `api.example.com`. Neon routes the custom domain to one
function on one branch and provisions its TLS certificate automatically. You
don't need to change your function code.

For example, one function is reachable at both URLs:

```text
Native:  https://br-cool-forest-a1b2c3d4-api.compute.c-2.us-east-2.aws.neon.tech
Custom:  https://api.example.com
```

Custom domains are branch-scoped: a domain registered on one branch isn't
inherited by its child branches, and each hostname can be registered only once.
Use a distinct hostname for each preview or development branch.

<Admonition type="warning" title="Secure both function URLs">
Adding a custom domain doesn't authenticate the function or disable its native Neon URL. Both URLs remain publicly reachable, so protect the function with [application-level authentication](/docs/compute/functions/authentication).
</Admonition>

## Before you start

You need:

- A deployed Neon Function.
- A domain you control, and access to its DNS settings.
- Optional: The latest [Neon CLI](/docs/cli), if you want to manage the domain from the command line.
- Optional: `@neon/sdk` 3.1.0 or later, if you want to manage the domain with the SDK.

## Register a custom domain

<Tabs labels={["Console", "CLI", "SDK", "API"]}>
<TabItem>

1. In the Neon Console, select your project and branch.
2. Select **Custom Domains** in the branch sidebar.
3. Enter the domain you own.
4. Select **Function**, then select the function to serve from the domain.
5. Select **Add custom domain**.

The Console displays the CNAME target to add at your DNS provider.

</TabItem>
<TabItem>

```bash filename="Neon CLI"
neon functions domains register api.example.com --slug api --output json
```

The CLI resolves the project and branch from your Neon CLI context, so you don't pass them explicitly. See the [`neon functions domains register`](/docs/cli/functions#domains-register) reference for all options.

The command returns the registered domain and its `cname_target`:

```json filename="Output"
{
  "domain": "api.example.com",
  "entity_type": "function",
  "entity_id": "api",
  "cname_target": "fn-custom-domains.us-east-2.aws.neon.tech",
  "status": "pending",
  "dns_status": "pending",
  "binding_status": "pending",
  "status_reason": ""
}
```

</TabItem>
<TabItem>

```ts
import { createNeonClient } from '@neon/sdk';

const neon = createNeonClient({
  apiKey: process.env.NEON_API_KEY!,
});
const projectId = process.env.NEON_PROJECT_ID!;
const branchId = process.env.NEON_BRANCH_ID!;

const { data: domain, error } =
  await neon.functions.customDomains.register(projectId, branchId, {
    domain: 'api.example.com',
    entity_type: 'function',
    entity_id: 'api',
  });

if (error) throw error;
console.log(domain.cname_target);
```

</TabItem>
<TabItem>

```bash shouldWrap
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/custom-domains" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "api.example.com",
    "entity_type": "function",
    "entity_id": "api"
  }'
```

See the [register custom domain API reference](/docs/reference/api/functions/register-project-branch-custom-domain) for request, response, and error schemas.

</TabItem>
</Tabs>

`entity_type` is `function`, the only supported value today. The function is
identified by its slug: the CLI `--slug` flag and the API `entity_id` field
carry the same value. Re-registering the same domain for the same function
returns the same result. Registering a
domain already assigned to another target returns a conflict without revealing
the existing owner.

## Configure DNS

At your DNS provider, create a CNAME record using the target returned during
registration:

<Admonition type="note" title="Use a subdomain">
Standard DNS doesn't allow a CNAME record at the zone apex. Use a subdomain such as `api.example.com` unless your DNS provider supports CNAME flattening.
</Admonition>

- **Type:** `CNAME`
- **Name:** Your custom domain, such as `api.example.com`. Some providers expect
  only the host label, such as `api`.
- **Value:** Copy the exact `cname_target` hostname returned by Neon, such as `fn-custom-domains.us-east-2.aws.neon.tech`. Don't include `https://` or a URL path.
- **TTL:** Your provider's default.

Configure the record as DNS-only. If your provider proxies the record, Neon
can't validate the domain. On Cloudflare, set the record to "DNS only" (grey
cloud), not "Proxied" (orange cloud).

Remove conflicting `A`, `AAAA`, or CNAME records for the same hostname. DNS
changes can take time to propagate according to the record's TTL.

<Admonition type="important" title="Allow Let's Encrypt in CAA records">
If your domain uses CAA records, authorize Let's Encrypt:

```text
CAA 0 issue "letsencrypt.org"
```

Neon can't provision a certificate when an applicable CAA record blocks Let's
Encrypt.
</Admonition>

## List domains and check status

<Tabs labels={["Console", "CLI", "SDK", "API"]}>
<TabItem>

In the Neon Console, select the project and branch, then select **Custom
Domains**. The table lists each domain, its target function, and its CNAME
target.

</TabItem>
<TabItem>

Use JSON output to include the status fields:

```bash filename="Neon CLI"
neon functions domains list --output json
```

See the [`neon functions domains list`](/docs/cli/functions#domains-list) reference for all options.

```json filename="Output"
[
  {
    "domain": "api.example.com",
    "entity_type": "function",
    "entity_id": "api",
    "cname_target": "fn-custom-domains.us-east-2.aws.neon.tech",
    "status": "active",
    "dns_status": "ok",
    "binding_status": "present",
    "status_reason": ""
  }
]
```

</TabItem>
<TabItem>

```ts
import { createNeonClient } from '@neon/sdk';

const neon = createNeonClient({
  apiKey: process.env.NEON_API_KEY!,
});
const projectId = process.env.NEON_PROJECT_ID!;
const branchId = process.env.NEON_BRANCH_ID!;

const { data: domains, error } =
  await neon.functions.customDomains.list(projectId, branchId).all();

if (error) throw error;
console.log(domains);
```

</TabItem>
<TabItem>

```bash shouldWrap
curl \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/custom-domains" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

See the [list custom domains API reference](/docs/reference/api/functions/list-project-branch-custom-domains) for response and pagination schemas.

When a response includes `pagination.next`, pass that value unchanged as the
next request's `cursor`. Don't construct or modify cursor values.

</TabItem>
</Tabs>

Each domain reports a top-level `status`, plus the `dns_status` and
`binding_status` that feed it.

`status` is:

- `pending`: Neon is still checking DNS or completing internal routing setup.
- `active`: DNS points to the Neon edge, CAA permits Let's Encrypt, and internal
  routing is in place.
- `error`: DNS, CAA, or internal routing needs attention. Check `status_reason`.

`dns_status` is `pending`, `ok`, `misconfigured` (resolves somewhere other than
the Neon edge), or `caa_blocked` (a CAA record forbids Let's Encrypt).
`binding_status` is `pending`, `present`, or `missing`, where `missing` is an
internal fault.

When `status` is `error`, `status_reason` names the cause and its fix:

| `status_reason`              | Meaning                                                   | Fix                                                                                    |
| ---------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `cname-not-pointing-at-edge` | The hostname resolves somewhere other than the Neon edge. | Check the CNAME and remove conflicting or proxied records.                             |
| `caa-blocks-lets-encrypt`    | An applicable CAA record doesn't authorize Let's Encrypt. | Add `CAA 0 issue "letsencrypt.org"`, including any CAA inherited from a parent domain. |
| `binding-missing`            | Neon's internal routing is unavailable.                   | Contact Neon Support if it persists.                                                   |

Status checks run asynchronously. Poll the domain every few seconds until it
becomes `active` or reports an actionable error.

<Admonition type="important" title="Verify HTTPS separately">
`active` verifies DNS, CAA, and routing. It doesn't report certificate issuance
state. Make an HTTPS request before using the custom domain in production:

```bash
curl -i https://api.example.com/health
```

The first HTTPS request can trigger certificate issuance. If DNS is correct and
the API reports `active`, wait a minute and retry. Contact Neon Support if HTTPS
continues to fail.
</Admonition>

## Runtime behavior

A request through a custom domain preserves its method, path, query, body,
normal application headers, and streaming behavior. WebSockets and SSE work
through the custom URL without additional configuration.

Inside the function, `Request.url` and the `Host` header use the function's
native Neon hostname, not the custom hostname. To read the hostname the client
requested, use the `x-forwarded-host` header; Neon overwrites any client-supplied
value, so it's safe to trust for tenant routing.

When your `neon.ts` declares the function, `neon env pull` writes its native URL
as `NEON_FUNCTION_<SLUG>_BASE_URL`. Store the custom URL separately in your
application configuration.

If a browser calls the custom domain directly, configure
[CORS and authentication](/docs/compute/functions/authentication) for that
origin.

## Delete a custom domain

Remove the DNS record before releasing the domain registration. This prevents a
dangling CNAME from continuing to point at Neon's custom-domain edge.

1. Remove the CNAME record at your DNS provider.
2. Wait for public DNS to stop returning the Neon target. Check with `dig +short api.example.com`.
3. Delete the registration using one of the following methods.

<Tabs labels={["Console", "CLI", "SDK", "API"]}>
<TabItem>

On the **Custom Domains** page in the Neon Console, open the actions menu (⋮) for the domain, select **Delete**, then select **Remove domain** to confirm.

</TabItem>
<TabItem>

```bash filename="Neon CLI"
neon functions domains delete api.example.com
```

See the [`neon functions domains delete`](/docs/cli/functions#domains-delete) reference for all options.

</TabItem>
<TabItem>

```ts
import { createNeonClient } from '@neon/sdk';

const neon = createNeonClient({
  apiKey: process.env.NEON_API_KEY!,
});
const projectId = process.env.NEON_PROJECT_ID!;
const branchId = process.env.NEON_BRANCH_ID!;

const { error } = await neon.functions.customDomains.delete(
  projectId,
  branchId,
  'api.example.com',
);

if (error) throw error;
```

</TabItem>
<TabItem>

```bash shouldWrap
curl -X DELETE \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/custom-domains/api.example.com" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

See the [delete custom domain API reference](/docs/reference/api/functions/delete-project-branch-custom-domain) for response and error schemas.

</TabItem>
</Tabs>

Routing changes take a short time to apply everywhere. Requests can continue
reaching the old function briefly after deletion, so verify that the custom URL
no longer serves it before reassigning the hostname.

Deleting a function doesn't remove its custom-domain registration. Remove the
domain explicitly when deleting a function.

<NeedHelp/>
