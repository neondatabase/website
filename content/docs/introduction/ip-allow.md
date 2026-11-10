---
title: IP Allow
subtitle: Limit database access to trusted IP addresses
summary: >-
  IP Allow is a Neon Scale plan feature that blocks connections from any IP
  address not on an explicit allowlist. It supports individual addresses,
  ranges, and CIDR notation. Use it to enforce network-level access control
  beyond database credentials alone. Restrictions can be scoped to protected
  branches only, leaving other branches unrestricted, and are configured in
  project settings.
enableTableOfContents: true
redirectFrom:
  - /docs/manage/ip-allow
updatedOn: '2026-10-09T10:01:16.476Z'
---

Neon's IP Allow feature, available with the Neon [Scale](/docs/introduction/plans) plan, ensures that only trusted IP addresses can connect to the project where your database resides, preventing unauthorized access and helping maintain overall data security. You can limit access to individual IP addresses, IP ranges, or IP addresses and ranges defined with [CIDR notation](/docs/reference/glossary#cidr-notation).

You can configure **IP Allow** in your Neon project's settings. To get started, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

<Admonition type="warning" title="IP Allow doesn't protect every Neon service">
IP Allow restricts Postgres connections only. The Data API, Object Storage, the AI Gateway, and Function URLs still accept requests from any IP address, and Realtime, Managed Better Auth, and database connections from Neon Functions stop working while IP Allow is enabled. Check [IP Allow and other Neon services](#ip-allow-and-other-neon-services) before you rely on it.
</Admonition>

## IP Allow and other Neon services

IP Allow restricts connections to Postgres only. Before you enable it, check which Neon services your project uses. Some services aren't restricted by your allowlist, so requests from any IP address still reach them. Others stop working while IP Allow is enabled.

| Service                                                                                              | With IP Allow enabled                                                                                                        |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Postgres connections, including the [serverless driver](/docs/serverless/serverless-driver)          | Restricted to your allowlist                                                                                                 |
| [Data API](/docs/data-api/get-started)                                                               | **Not restricted.** Requests from any IP address are still served. The Data API isn't supported with IP Allow.               |
| [Realtime](/docs/realtime/overview)                                                                  | **Stops working.** Subscriptions fail to connect.                                                                            |
| [Managed Better Auth](/docs/auth/about)                                                              | **Stops working.** Sign-in and other auth requests fail.                                                                     |
| [Neon Functions](/docs/compute/functions/overview)                                                   | **Database connections fail.** A function can't connect to Postgres through `DATABASE_URL`. Function URLs aren't restricted. |
| [Object Storage](/docs/storage/authentication) and the [AI Gateway](/docs/ai-gateway/authentication) | **Not restricted.** Access is controlled by credentials only.                                                                |

If you apply the allowlist to [protected branches only](#ip-allow-together-with-protected-branches), these limits apply only to protected branches.

## Neon services to allowlist

If IP Allow is enabled on your project, add the following IP addresses to allow connections from Neon hosted services:

| Service                                     | IP addresses                     |
| ------------------------------------------- | -------------------------------- |
| [Neon MCP Server](/docs/ai/neon-mcp-server) | `34.192.103.46`, `23.22.233.166` |

## IP Allow together with Protected Branches

You can apply IP restrictions more precisely by designating specific branches in your Neon project as protected and selecting **Protected branches only** under **Restricted branches** in your project's **Settings** > **Networking**. This will apply your IP allowlist to protected branches only with no IP restrictions on other branches in your project. Typically, the protected branches feature is used with branches that contain production or sensitive data. For step-by-step instructions, refer to our [Protected Branches guide](/docs/guides/protected-branches).

<Admonition type="tip">
If you are an AWS user, Neon also supports a **Private Networking** feature, which enables connections to your Neon databases via AWS PrivateLink, bypassing the open internet entirely. See [Private Networking](/docs/guides/neon-private-networking).
</Admonition>
