---
title: Monitor Your Neon Usage Via Slack Alerts
description: 'Get notified when you reach max. storage, compute hours, or data transfer'
excerpt: >-
  We’ve shipped a Slack app to make it easier to monitor your Neon consumption
  metrics. By adding the app to your Slack, you’ll receive automatic
  notifications when you reach your plan limits for compute hours, storage, or
  data transfer. To install the app, follow the instructions...
date: '2025-01-31T18:55:03'
updatedOn: '2025-11-19T19:53:48'
category: product
categories:
  - product
  - workflows
authors:
  - russ-dias
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/monitor-your-neon-usage-via-slack-alerts/screenshot-2025-01-31-at-104751percente2percent80percentafam-1024x525-412d68b7.png
  alt: null
isFeatured: false
seo:
  title: Monitor Your Neon Usage Via Slack Alerts - Neon
  description: >-
    Install this Slack app and receive notifications when you reach max.
    storage, compute hours, or data transfer in your Neon projects.
  keywords: []
  noindex: false
  ogTitle: Monitor Your Neon Usage Via Slack Alerts - Neon
  ogDescription: >-
    Install this Slack app and receive notifications when you reach max.
    storage, compute hours, or data transfer in your Neon projects.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/monitor-your-neon-usage-via-slack-alerts/screenshot-2025-01-31-at-104751percente2percent80percentafam-1024x525-412d68b7.png
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/monitor-your-neon-usage-via-slack-alerts/screenshot-2025-01-31-at-104751percente2percent80percentafam-1024x525-412d68b7.png)

<Admonition type="warning" title="Update (November 2025)">
This version of the Slack App is now deprecated. If you're looking for something similar, [tell us on Discord](https://discord.gg/92vNTzKDGp).
</Admonition>

We’ve shipped a Slack app to make it easier to monitor your Neon consumption metrics. By adding the app to your Slack, **you’ll receive automatic notifications when you reach your plan limits for compute hours, storage, or data transfer.** To install the app, follow the instructions [here](https://neon.tech/docs/manage/slack-app#setup).

<video autoPlay muted loop width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/monitor-your-neon-usage-via-slack-alerts/slack-app-ffd470ab.mp4" />
</video>

## How can I get notified via Slack when I reach a limit in my Neon plan?

**If you install the Neon Slack app, this will happen automatically.** When you reach a limit, you’ll see a notification like this:

![Image](https://cdn.neonapi.io/public/images/pages/blog/monitor-your-neon-usage-via-slack-alerts/ad4nxdvq1dlojpfhbwsa2ecjyjynati0ewi6w4mvsrdijuj415d3jfn2egwrvgs1d-qal5d82xkek499ehl5as7lb07s1jjqcokdc4caphynov5jfblkd0wfrx7recvwahavbr2d1y-13198715.png)

You can also check at any moment how your consumption is doing. To do so, run this command in a Slack DM:

```bash
/neon usage
```

And you’ll see a summary of the main usage metrics:

![Neon Slack App showing authentication and usage commands in action](https://cdn.neonapi.io/public/images/pages/blog/monitor-your-neon-usage-via-slack-alerts/ad4nxd2nsh1ohhevwgf7k13c5uphgy1k02sljwpbihbhhleokwadecjepjde14jeglcrmhuv3naxfbtzeb-8r7qqg0xdkt89fkt3nutwakfwxhp74tjmdj1ccyauconmwphkd1a2t-58401ae5.png)

## Install it and tell us what you think

[Follow the instructions in the docs](https://neon.tech/docs/manage/slack-app#setup) to install the app and view the full list of available commands. If there are other notifications you’d like to see in Slack, let us know by running `/neon feedback` in a Slack DM!
