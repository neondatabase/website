---
title: Ctrl-C in psql gives me the heebie-jeebies
description: Postgres has been YOLOing query cancellation for 30 years
excerpt: >-
  There are a few different reasons to hit the brakes on a Postgres query. Maybe
  it’s taking too long to finish. Maybe you realised you forgot to create an
  index that will make it orders of magnitude quicker. Maybe there’s some reason
  the results are no longer needed. Or maybe you,...
date: '2026-03-05T16:32:34'
updatedOn: '2026-03-05T16:59:50'
category: postgres
categories:
  - postgres
authors:
  - george-mackerron
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/ctrl-c-in-psql-gives-me-the-heebie-jeebies/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Ctrl-C in psql gives me the heebie-jeebies - Neon
  description: Postgres has been YOLOing query cancellation for 30 years
  keywords: []
  noindex: false
  ogTitle: Ctrl-C in psql gives me the heebie-jeebies - Neon
  ogDescription: >-
    There are a few different reasons to hit the brakes on a Postgres query.
    Maybe it’s taking too long to finish. Maybe you realised you forgot to
    create an index that will make it orders of magnitude quicker. Maybe there’s
    some reason the results are no longer needed. Or maybe you, or your LLM
    buddy, […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/ctrl-c-in-psql-gives-me-the-heebie-jeebies/cover.jpg
source:
  wpId: 12729
  wpSlug: ctrl-c-in-psql-gives-me-the-heebie-jeebies
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/ctrl-c-in-psql-gives-me-the-heebie-jeebies/neon-ctrl-c-1024x538-a995d0bc.jpg)

There are a few different reasons to hit the brakes on a Postgres query. Maybe it’s taking too long to finish. Maybe you realised you forgot to create an index that will make it orders of magnitude quicker. Maybe there’s some reason the results are no longer needed.

Or maybe you, or your LLM buddy, made a mistake in the SQL, and you only noticed it while you were waiting for it to return. Maybe it’s even a mistake [scary chords play] that could have valuable production data as collateral damage. But let’s hope it isn’t (or, if it is, that you’re using a system that does time-travel, like Neon).

Whatever the reason, if you’re a psql command-line user, Ctrl-C is in your muscle memory. So now you’re looking at the words `Cancel request sent`, followed shortly after by the not-really-an-error message `ERROR: cancelling statement due to user request`. But what’s going on behind the scenes?

## How CancelRequest works

To cancel a Postgres query, the Postgres client makes a new and additional connection to the server, in the form of a [CancelRequest](https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-CANCELING-REQUESTS). The server distinguishes this from an ordinary client connection via a magic protocol version number at the beginning of the startup message: the latest Postgres protocol is v3.2 (or `0x00030002`), but a CancelRequest claims to be v1234.5678 (or `0x04d2162e`).

A CancelRequest targets a connection rather than a specific query. The target connection is identified to the server by two numbers that the server originally provided to the client at the end of their connection handshake (via the [BackendKeyData](https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-START-UP) message).

The numbers are a 4-byte process ID and a secret random key value, traditionally also 4 bytes long. Aside from an initial length-of-message value, that’s everything the client sends. No credentials are required except that 4-byte secret key.

![Image](https://cdn.neonapi.io/public/images/pages/blog/ctrl-c-in-psql-gives-me-the-heebie-jeebies/image-4-1024x724-65e3d548.png)

It’s perhaps slightly surprising that Postgres cancels by connection rather than by query. It leads to a race condition: we risk cancelling a different query to the one that was running at the moment we asked to cancel it (this isn’t great, but the heebie-jeebies are pretty mild so far: maybe a 2 or 3 out of 10).

But here’s a bigger surprise: **psql always sends this CancelRequest unencrypted.** Even if the connection carrying the query to be cancelled has the strictest possible TLS settings (`sslmode=verify-full`, `channel_binding=require`, and so on), psql always goes right ahead and cancels in plaintext.

The Postgres server on the other end of the exchange has _accepted_ CancelRequest messages over TLS ever since it got TLS support. But until Postgres 17 — that is, less than 18 months ago — there was simply no support for encrypting a CancelRequest in libpq, the client-side Postgres C library on which psql is built.

Since Postgres 17, libpq [does have functions](https://www.postgresql.org/message-id/E1rk5BP-003RWD-U4@gemulon.postgresql.org) to send CancelRequest messages over TLS. And many drivers that are based on libpq, [such as ruby-pg](https://github.com/ged/ruby-pg/blob/master/ext/pg_cancel_connection.c), now use these new, encrypting functions.

But psql itself _still doesn’t use them_. As of today, hit Ctrl-C in psql and your CancelRequest goes over the wire naked as the day it was born, in unencrypted plaintext.

## Hello, Denial-of-Service?

As [someone who cares](https://neon.com/blog/postgres-needs-better-connection-security-defaults) about Postgres security, this makes me a bit uneasy (heebie-jeebies level: a solid 6 at least). There’s a potential Denial of Service attack lurking here.

It’s not that the Postgres developers aren’t well aware of the problem. There are [architectural reasons](https://www.postgresql.org/message-id/E1rmHjd-004U0Q-3A@gemulon.postgresql.org) why psql doesn’t yet use libpq’s encrypted cancellation functions (it “would need a much larger refactor to be able to call them due to the new functions not being signal-safe”) – but a patch to do the necessary refactoring [is in the works](https://commitfest.postgresql.org/patch/6314/) for some future release.

And Neon’s own Heikki described the risk that [4-byte secret keys get brute-forced](https://www.postgresql.org/message-id/508d0505-8b7a-4864-a681-e7e5edfe32aa@iki.fi) two years back, resulting in the [first Postgres protocol update](https://neon.com/postgresql/postgresql-18/security-improvements) in over twenty years. Protocol v3.2 differs from v3.0 only in that the secret key for cancellation can be up to 256 bytes long. But libpq and psql [still don’t use this new version](https://www.postgresql.org/docs/current/protocol-overview.html#PROTOCOL-VERSIONS) unless you explicitly specify `min_protocol_version=3.2` on the end of your connection string.

So, what if you do use the latest psql, and you also specify protocol 3.2 so as to get a secret key that’s too big to brute-force? Even then, as soon as you cancel a query, anyone who can see your network traffic (e.g. anyone on the same open WiFi network) [can mount a Denial of Service attack](https://www.postgresql.org/message-id/489C969D.8020800@enterprisedb.com). Specifically, they can cancel any and all future queries on the same connection, just by repeatedly replaying the intercepted cancellation request.

## No TLS = SNI is MIA

The fact that CancelRequest connections commonly travel unencrypted has some slightly subtler impacts that Postgres-adjacent developers need to deal with. In fact, these are what led me to dive deeper into this little backwater of the Postgres protocol.

I created and maintain [Elephantshark](https://github.com/neondatabase/elephantshark), an open-source Postgres network traffic monitor. It’s like Wireshark, but specialised for Postgres and implemented as a proxy.

Elephantshark’s first release could only proxy one Postgres connection at a time. That had been fine for my own use-cases, but first contact with the real world demonstrated it was a pretty dumb limitation.

As one example, you now know that when you press Ctrl-C in psql, the [CancelRequest](https://www.postgresql.org/docs/current/protocol-flow.html#PROTOCOL-FLOW-CANCELING-REQUESTS) message that’s sent to the Postgres back-end travels over a new and separate connection. As another example: did you also know that [Bun.SQL](https://bun.com/docs/runtime/sql) defaults to connecting a pool of 10 clients, eagerly and in parallel, even if you only send one query?

It’s safe to say that neither of those things plays nicely with one-at-a-time connection support. So Elephantshark got support for concurrent connections in v0.2. That fixed its Bun.SQL issue.

But Ctrl-C in psql still wasn’t working. And, after a little digging, **t** he non-encryption of CancelRequest messages turned out to be the culprit.

That’s because, when you connect to Postgres via Elephantshark over TLS, Elephantshark typically works out your target server using the SNI (Server Name Indication) extension to TLS, plus a customisable suffix.

For instance, to monitor a connection to `ep-adj-noun-abc1234.region.aws.neon.tech`, you run elephantshark and then connect to `ep-adj-noun-abc1234.region.aws.neon.tech.local.neon.build` instead. Any subdomain of .local.neon.build resolves to 127.0.0.1, where Elephantshark is running. And Elephantshark knows that, if the hostname it gets via SNI ends in .local.neon.build, it should strip that off before it makes the onward connection.

Marvellous. Until, that is, you hit the brakes on a query. Because your CancelRequest travels unencrypted, there is no SNI, and that means no record of the intended destination host. Luckily, Elephantshark recognises when it’s being asked to forward both from and to localhost, and would politely bail in preference to sending your message in an infinite loop. Unluckily, until Elephantshark v0.3, this would bring you no closer to cancelling your query.

The fix for this turns out to be old news in the Postgres proxy world. It’s [in Neon’s proxy](https://github.com/neondatabase/neon/blob/main/proxy/src/cancellation.rs), for one. On receiving an ordinary client connection, you update a data structure that maps (process ID, secret key) values to destination hostnames. On subsequently receiving a CancelRequest connection without SNI, you look up the destination hostname using the (process ID, secret key) it specifies. Elephantshark v0.3 keeps a Ruby Hash for this purpose, so now you can both cancel and monitor your cancelling.

## Wrapping up

Let’s hope encrypted CancelRequest messages land in psql soon. In the meantime, if you care a lot about security, do some or all of the following: use Postgres 18 and `min_protocol_version=3.2`; use a VPN; don’t use Ctrl-C in psql; and check any other Postgres clients or drivers you use to see if they’re encrypting their CancelRequests.

On that last point, [Elephantshark](https://github.com/neondatabase/elephantshark) can help. And watch this space — I have an idea to make this kind of check even easier in the near future.

_Appendix: what happens when you press Ctrl-C in psql, using Postgres protocol v3.2, courtesy of Elephantshark_
