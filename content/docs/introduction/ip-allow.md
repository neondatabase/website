---
title: IP Allow
subtitle: Limit database access to trusted IP addresses
enableTableOfContents: true
updatedOn: '2024-12-04T13:30:28.567Z'
---

Neon's IP Allow feature, available with the Neon [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plans, ensures that only trusted IP addresses can connect to the project where your database resides, preventing unauthorized access and helping maintain overall data security. You can limit access to individual IP addresses, IP ranges, or IP addresses and ranges defined with [CIDR notation](/docs/reference/glossary#cidr-notation).

You can configure **IP Allow** in your Neon project's settings. To get started, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

![IP Allow configuration](/docs/manage/ip_allow.png)

## IP Allow together with Protected Branches

You can apply IP restrictions more precisely by designating specific branches in your Neon project as protected and enabling the **Restrict IP access to protected branches only** option. This will apply your IP allowlist to protected branches only with no IP restrictions on other branches in your project. Typically, the protected branches feature is used with branches that contain production or sensitive data. For step-by-step instructions, refer to our [Protected Branches guide](/docs/guides/protected-branches).

<Admonition type="tip">
If you are an AWS user, Neon also supports a **Private Networking** feature, which enables connections to your Neon databases via AWS PrivateLink, bypassing the open internet entirely. See [Private Networking](/docs/guides/neon-private-networking).
</Admonition>
