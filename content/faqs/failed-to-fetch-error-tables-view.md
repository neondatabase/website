---
title: "Why am I getting 'Error connecting to database: Failed to fetch' in the Neon Console Tables view?"
subtitle: 'Usually a cold-start, an ad-blocker, or an IP Allow misconfiguration. Walk through these in order.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-22T12:41:06.646Z'
isDraft: false
redirectFrom: []
---

## Quick answer

`Failed to fetch` on the **Tables** page means the Console's request to your compute didn't complete. The most common causes, in order, are: the compute is starting up after scale to zero, a browser extension is blocking the request, IP Allow is excluding the Console origin, or a transient backend error. Refresh, then work through the checks below.

## Walk through the common causes

### 1. The compute is starting up

If your compute is suspended after scale to zero, the Console wakes it up before it can list tables. Activation usually takes a few hundred milliseconds, but the **Tables** view sometimes times out on the first request. Wait a second or two and click **Refresh**. The second request typically succeeds.

You can confirm the compute state on the **Branches** page. A suspended compute shows as **Idle**.

See [Couldn't connect to compute node](/docs/connect/connection-errors#couldnt-connect-to-compute-node) for more on cold-start timing.

### 2. A browser extension is blocking the request

Ad-blockers, privacy extensions, and corporate browser security tools sometimes block requests to `*.neon.tech`. To rule this out:

- Open the Console in an incognito window with extensions disabled.
- Or temporarily disable extensions like uBlock Origin, Privacy Badger, or DuckDuckGo Privacy Essentials on `console.neon.tech` and reload.
- Check the browser's developer console (**F12 → Network**) for blocked requests to your compute hostname.

### 3. IP Allow is excluding the Console

If you've configured an **IP Allow** list (Scale plan) and didn't add the IP ranges Neon's Console uses to reach your compute, queries from the Tables view get rejected. Check **Project Settings → Network security**.

- If you only need IP Allow on protected branches, enable **Restrict IP Access to protected branches only** so Console queries against development branches still work.
- If you need to restrict the production branch too, add Neon's documented Console IP ranges to your allowlist.

See [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### 4. A DNS resolution issue

Some networks (especially restrictive corporate or ISP DNS) fail to resolve compute hostnames. Test with:

```bash shouldWrap
nslookup ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech 8.8.8.8
```

If lookups against Google DNS succeed but your default resolver fails, switch the network or device to a public resolver. See [DNS resolution issues](/docs/connect/connection-errors#dns-resolution-issues).

### 5. A transient backend error

If none of the above explain it, check the [Neon status page](https://neonstatus.com/) for ongoing incidents.

<Admonition type="tip" title="Grab the error ID before contacting Support">
The full error message on the Tables view includes an error ID after the colon. Copy it before refreshing. Support uses that ID to look up the exact request in our logs, which is much faster than reproducing the issue.
</Admonition>
