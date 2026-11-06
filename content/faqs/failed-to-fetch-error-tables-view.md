---
title: "Why am I getting 'Error connecting to database: Failed to fetch' in the Neon Console Tables view?"
subtitle: 'Usually a cold-start, an ad-blocker, or an IP Allow misconfiguration. Walk through these in order.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I export or download my Neon database as a SQL file?'
  slug: export-database-sql-file
nextLink:
  title: 'Where can I find my database connection details in the Neon Console?'
  slug: find-connection-details-neon-console
---

`Failed to fetch` on the **Tables** page means the Console's request to your compute didn't complete. The most common causes, in order, are a compute that's still waking up from scale to zero, a browser extension blocking the request, an IP Allow list that doesn't include your current IP address, a DNS problem, and a transient backend error. Refresh the page first, then work through the checks below. See [Error connecting to database: Failed to fetch](/docs/connect/connection-errors#error-connecting-to-database-failed-to-fetch).

## Common causes

### 1. The compute is starting up

If your compute was suspended by [scale to zero](/docs/introduction/scale-to-zero), the Console has to wake it before it can list tables. Waking takes a few hundred milliseconds, but the first request can fail before the compute is ready. Wait a second or two and click **Refresh**. The second request usually succeeds.

You can confirm the compute state on the **Branches** page. A suspended compute shows as **Idle**.

See [Couldn't connect to compute node](/docs/connect/connection-errors#couldnt-connect-to-compute-node) for more on cold-start timing.

### 2. A browser extension is blocking the request

Ad-blockers, privacy extensions, and corporate browser security tools sometimes block requests to `*.neon.tech`. To rule this out:

- Open the Console in an incognito window with extensions disabled.
- Or temporarily disable extensions like uBlock Origin or Privacy Badger on `console.neon.tech` and reload.
- Check the browser's developer console (**F12 → Network**) for blocked requests to your compute hostname.

### 3. IP Allow is rejecting your IP address

If you've configured an **IP Allow** list (Scale plan), the Tables view connects from the IP address you're browsing from, not from a Neon server. When that address isn't on the list, the request is rejected. Add your current IP address under your project's **Settings** > **Networking**.

If you only need IP Allow on protected branches, enable **Restrict IP Access to protected branches only** so Console queries against development branches still work.

See [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### 4. A DNS resolution issue

Some networks, often corporate networks or ISP resolvers, fail to resolve compute hostnames. Test your hostname against Google's public DNS resolver:

```bash shouldWrap
nslookup ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech 8.8.8.8
```

If the lookup succeeds against `8.8.8.8` but fails with your default resolver, switch your network or device to a public resolver. See [DNS resolution issues](/docs/connect/connection-errors#dns-resolution-issues).

### 5. A transient backend error

If none of the above explain it, check the [Neon status page](https://neonstatus.com/) for ongoing incidents.

<Admonition type="tip" title="Grab the error ID">
The full error message on the Tables view includes an error ID after the colon. Copy it before you refresh. If you ask for help in the [Neon Discord](https://neon.com/discord) or open a support ticket on the Scale plan, include the ID so the request can be found in the logs.
</Admonition>
