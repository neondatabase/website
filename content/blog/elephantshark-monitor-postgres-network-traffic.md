---
title: 'Introducing Elephantshark, a tool to monitor Postgres network traffic'
description: An open-source Ruby script published by Neon
excerpt: >-
  Elephantshark helps you monitor, understand and troubleshoot Postgres network
  traffic: that’s Postgres servers, clients, drivers and ORMs talking to
  Postgres servers, proxies and poolers. Elephantshark sits between the two
  parties in a Postgres-protocol exchange, forwarding messa...
date: '2025-09-24T16:33:15'
updatedOn: '2025-09-24T16:33:17'
category: postgres
categories:
  - postgres
authors:
  - george-mackerron
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/elephantshark-monitor-postgres-network-traffic/cover.jpg
  alt: null
isFeatured: true
seo:
  title: 'Introducing Elephantshark, a tool to monitor Postgres network traffic - Neon'
  description: >-
    Elephantshark helps you monitor, understand and troubleshoot Postgres
    servers, clients, drivers and ORMs talking to Postgres.
  keywords: []
  noindex: false
  ogTitle: 'Introducing Elephantshark, a tool to monitor Postgres network traffic - Neon'
  ogDescription: >-
    Elephantshark helps you monitor, understand and troubleshoot Postgres
    servers, clients, drivers and ORMs talking to Postgres.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/elephantshark-monitor-postgres-network-traffic/social.jpg
source:
  wpId: 10936
  wpSlug: elephantshark-monitor-postgres-network-traffic
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/elephantshark-monitor-postgres-network-traffic/neon-elephantshark-1024x576-5e51a5b6.jpg)

[Elephantshark](https://github.com/neondatabase-labs/elephantshark) **helps you monitor, understand and troubleshoot Postgres network traffic: that’s Postgres servers, clients, drivers and ORMs talking to Postgres servers, proxies and poolers.**

Elephantshark sits between the two parties in a Postgres-protocol exchange, forwarding messages in both directions while parsing and logging them. It is an open-source Ruby script published by Neon and works with any and all Postgres-protocol network traffic. That includes, but isn’t limited to, traffic to and from Neon databases.

[https://github.com/neondatabase-labs/elephantshark](https://github.com/neondatabase-labs/elephantshark)

## Why not just use Wireshark?

Ordinarily [Wireshark](https://www.wireshark.org/) is great for this kind of thing, but using Wireshark is difficult if a connection is SSL/TLS-encrypted. [`SSLKEYLOGFILE`](https://wiki.wireshark.org/TLS#tls-decryption) support was [recently merged into libpq](https://www.postgresql.org/message-id/flat/CAOYmi%2B%3D5GyBKpu7bU4D_xkAnYJTj%3DrMzGaUvHO99-DpNG_YKcw%40mail.gmail.com#afc7fbd9fb2d13959cd97acae8ac8532), but it won’t be available in a release version for some time. Plus, not all Postgres connections are made with `libpq`.

To get round this problem, Elephantshark decrypts and re-encrypts a Postgres connection. It then logs and annotates the messages passing through. Or if you prefer to use Wireshark, Elephantshark can enable that too by writing keys to an `SSLKEYLOGFILE`.

## Elephantshark in action

Run elephantshark in one terminal:

```bash
% elephantshark
listening ...
```

In a second terminal, connect to and query a Neon Postgres database via Elephantshark by (1) appending `.local.neon.build` to the host name and (2) changing `channel_binding=require` to `channel_binding=disable`:

```bash
% psql 'postgresql://neondb_owner:fake_password@ep-crimson-sound-a8nnh11s.eastus2.azure.neon.tech.local.neon.build/neondb?sslmode=require&channel_binding=disable'
psql (17.5 (Homebrew))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off, ALPN: postgresql)
Type "help" for help.

neondb=> SELECT now();
              now
-------------------------------
 2025-07-02 11:51:01.721628+00
(1 row)

neondb=> \q
```

Back in the first terminal, see what bytes got exchanged:

## Get started with Elephantshark

To find out more and/or to install Elephantshark, [check out the README](https://github.com/neondatabase-labs/elephantshark) on GitHub. You can also [find out more about Neon](https://neon.com/), or [sign up today](https://console.neon.tech/) for free.
