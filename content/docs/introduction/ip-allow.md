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
updatedOn: '2026-06-05T17:20:32.620Z'
---

Neon's IP Allow feature, available with the Neon [Scale](/docs/introduction/plans) plan, ensures that only trusted IP addresses can connect to the project where your database resides, preventing unauthorized access and helping maintain overall data security. You can limit access to individual IP addresses, IP ranges, or IP addresses and ranges defined with [CIDR notation](/docs/reference/glossary#cidr-notation).

You can configure **IP Allow** in your Neon project's settings. To get started, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

![IP Allow configuration](/docs/manage/ip_allow.png)

## IP Allow together with Protected Branches

You can apply IP restrictions more precisely by designating specific branches in your Neon project as protected and enabling the **Restrict IP access to protected branches only** option. This will apply your IP allowlist to protected branches only with no IP restrictions on other branches in your project. Typically, the protected branches feature is used with branches that contain production or sensitive data. For step-by-step instructions, refer to our [Protected Branches guide](/docs/guides/protected-branches).

<Admonition type="tip">
If you are an AWS user, Neon also supports a **Private Networking** feature, which enables connections to your Neon databases via AWS PrivateLink, bypassing the open internet entirely. See [Private Networking](/docs/guides/neon-private-networking).
</Admonition>
