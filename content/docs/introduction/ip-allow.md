---
title: IP Allow and protected branches
subtitle: Limit database access to only trusted IP addresses
enableTableOfContents: true
updatedOn: '2023-12-22T16:01:34.806Z'
---

Neon's IP Allow feature, available with the Neon [Scale](/docs/introduction/plans#scale) plan, ensures that only trusted IP addresses can connect to the project where your database resides, preventing unauthorized access and helping maintain overall data security. You can limit access to individual IP addresses, IP ranges, or IP addresses and ranges defined with [CIDR notation](/docs/reference/glossary#cidr-notation). 

You can configure **IP Allow** in your Neon project's settings. To get started, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

![IP Allow configuration](/docs/manage/ip_allow.png)

## Protected branches

For more granular control over how IP restrictions are applied within your Neon project, you can designate specific branches as protected and restrict access to those branches only by selecting the **Restrict IP access to protected branches only** option. Typically, the protected branch status is given to a branch or branches that hold production data or sensitive data. For information about how to configure a protected branch, see [Set a branch as protected](#set-a-branch-as-protected).
