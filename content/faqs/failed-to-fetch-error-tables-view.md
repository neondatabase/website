---
title: "Why am I getting 'Error connecting to database: Failed to fetch' in the Neon Console Tables view?"
subtitle: 'Usually a cold-start, an ad-blocker, or an IP Allow misconfiguration. Walk through these in order.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-08-14T02:59:16.781Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I export or download my Neon database as a SQL file?'
  slug: export-database-sql-file
nextLink:
  title: 'Where can I find my database connection details in the Neon Console?'
  slug: find-connection-details-neon-console
---

## Quick answer

`Failed to fetch` on the **Tables** page means the Console's request to your compute didn't complete. The most common causes, in order, are: the compute is starting up after scale to zero, a browser extension is blocking the request, IP Allow is excluding your current IP, or a transient backend error. Refresh, then work through the checks below. See [Error connecting to database: Failed to fetch](/docs/connect/connection-errors#error-connecting-to-database-failed-to-fetch).

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

### 3. IP Allow is excluding your browser IP

If you've configured an **IP Allow** list (Scale plan) and your current public IP isn't on it, queries from the Tables view get rejected. The Tables page connects from the IP address you're browsing from, not from a Neon server IP. Check **Project Settings → Network security** and add your current IP.

- If you only need IP Allow on protected branches, enable **Restrict IP Access to protected branches only** so Console queries against development branches still work.

See [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### 4. A DNS resolution issue

Some networks (especially restrictive corporate or ISP DNS) fail to resolve compute hostnames. Test with:

```bash shouldWrap
nslookup ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech 8.8.8.8
```

If lookups against Google DNS succeed but your default resolver fails, switch the network or device to a public resolver. See [DNS resolution issues](/docs/connect/connection-errors#dns-resolution-issues).

### 5. A transient backend error

If none of the above explain it, check the [Neon status page](https://neonstatus.com/) for ongoing incidents.

<Admonition type="tip" title="Grab the error ID">
The full error message on the Tables view includes an error ID after the colon. Copy it before refreshing. If you open a support ticket (paid plans) or ask in the [Neon Discord](https://neon.com/discord) (Free plan), that ID helps look up the exact request in the logs.
</Admonition>
