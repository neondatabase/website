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
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/ctrl-c-in-psql-gives-me-the-heebie-jeebies/neon-ctrl-c-1024x538-a995d0bc.jpg)

There are a few different reasons to hit the brakes on a Postgres query. Maybe it’s taking too long to finish. Maybe you realised you forgot to create an index that will make it orders of magnitude quicker. Maybe there’s some reason the results are no longer needed.

Or maybe you, or your LLM buddy, made a mistake in the SQL, and you only noticed it while you were waiting for it to return. Maybe it’s even a mistake [scary chords play] that could have valuable production data as collateral damage. But let’s hope it isn’t (or, if it is, that you’re using a system that does time-travel, like Neon).

Whatever the reason, if you’re a psql command-line user, Ctrl-C is in your muscle memory. So now you’re looking at the words `Cancel request sent`, followed shortly after by the not-really-an-error message `ERROR: cancelling statement due to user request`. But what’s going on behind the scenes?

## How CancelRequest works

To cancel a Postgres query, the Postgres client makes a new and additional connection to the server, in the form of a [CancelRequest](https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-CANCELING-REQUESTS). The server distinguishes this from an ordinary client connection via a magic protocol version number at the beginning of the startup message: the latest Postgres protocol is v3.2 (or `0x00030002`), but a CancelRequest claims to be v1234.5678 (or `0x04d2162e`).

A CancelRequest targets a connection rather than a specific query. The target connection is identified to the server by two numbers that the server originally provided to the client at the end of their connection handshake (via the [BackendKeyData](https://www.postgresql.org/docs/18/protocol-flow.html#PROTOCOL-FLOW-START-UP) message).

The numbers are a 4-byte process ID and a secret random key value, traditionally also 4 bytes long. Aside from an initial length-of-message value, that’s everything the client sends. No credentials are required except that 4-byte secret key.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/ctrl-c-in-psql-gives-me-the-heebie-jeebies/image-4-1024x724-65e3d548.png)

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

But Ctrl-C in psql still wasn’t working. And, after a little digging, the non-encryption of CancelRequest messages turned out to be the culprit.

That’s because, when you connect to Postgres via Elephantshark over TLS, Elephantshark typically works out your target server using the SNI (Server Name Indication) extension to TLS, plus a customisable suffix.

For instance, to monitor a connection to `ep-adj-noun-abc1234.region.aws.neon.tech`, you run elephantshark and then connect to `ep-adj-noun-abc1234.region.aws.neon.tech.local.neon.build` instead. Any subdomain of .local.neon.build resolves to 127.0.0.1, where Elephantshark is running. And Elephantshark knows that, if the hostname it gets via SNI ends in .local.neon.build, it should strip that off before it makes the onward connection.

Marvellous. Until, that is, you hit the brakes on a query. Because your CancelRequest travels unencrypted, there is no SNI, and that means no record of the intended destination host. Luckily, Elephantshark recognises when it’s being asked to forward both from and to localhost, and would politely bail in preference to sending your message in an infinite loop. Unluckily, until Elephantshark v0.3, this would bring you no closer to cancelling your query.

The fix for this turns out to be old news in the Postgres proxy world. It’s [in Neon’s proxy](https://github.com/neondatabase/neon/blob/main/proxy/src/cancellation.rs), for one. On receiving an ordinary client connection, you update a data structure that maps (process ID, secret key) values to destination hostnames. On subsequently receiving a CancelRequest connection without SNI, you look up the destination hostname using the (process ID, secret key) it specifies. Elephantshark v0.3 keeps a Ruby Hash for this purpose, so now you can both cancel and monitor your cancelling.

## Wrapping up

Let’s hope encrypted CancelRequest messages land in psql soon. In the meantime, if you care a lot about security, do some or all of the following: use Postgres 18 and `min_protocol_version=3.2`; use a VPN; don’t use Ctrl-C in psql; and check any other Postgres clients or drivers you use to see if they’re encrypting their CancelRequests.

On that last point, [Elephantshark](https://github.com/neondatabase/elephantshark) can help. And watch this space — I have an idea to make this kind of check even easier in the near future.

_Appendix: what happens when you press Ctrl-C in psql, using Postgres protocol v3.2, courtesy of Elephantshark_

<div className="blog-svg-scroll">
<svg id="rawlogs" width="1359" height="2151" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1359 2151">
  <rect width="100%" height="100%" fill="#002050" />
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="31px"><tspan>#1  </tspan>listening on 127.0.0.1 port 5432 …</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="52px"><tspan>#2  </tspan>listening on 127.0.0.1 port 5432 …</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="73px"><tspan>#1  </tspan>connected at t0 = 2026-03-04 17:42:07 +0000</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="94px"><tspan>#1  </tspan><tspan fill="#ff44ff">client -&gt; script:</tspan> &quot;\x00\x00\x00\x08\x04\xd2\x16\x2f&quot;<tspan fill="#ffee00"> = SSLRequest</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="115px"><tspan>#1  </tspan><tspan fill="#00dddd">script -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = SSL supported</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="136px"><tspan>#1  </tspan>TLSv1.3/TLS_AES_256_GCM_SHA384 connection established with client</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="157px"><tspan>#1  </tspan>  server name via SNI: ep-winter-morning-abv2sxkp.eu-west-2.aws.neon.tech.local.neon.build</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="178px"><tspan>#1  </tspan><tspan fill="#ff44ff">client -&gt; script:</tspan> &quot;\x00\x00\x00\x56&quot;<tspan fill="#ffee00"> = 86 bytes of startup message</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="199px"><tspan>#1  </tspan>  &quot;\x00\x03&quot;<tspan fill="#ffee00"> = protocol major version 3</tspan> &quot;\x00\x02&quot;<tspan fill="#ffee00"> = protocol minor version 2</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="220px"><tspan>#1  </tspan>  &quot;user\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;neondb_owner\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="241px"><tspan>#1  </tspan>  &quot;database\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;neondb\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="262px"><tspan>#1  </tspan>  &quot;application_name\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;psql\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="283px"><tspan>#1  </tspan>  &quot;client_encoding\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;UTF8\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="304px"><tspan>#1  </tspan>  &quot;\x00&quot;<tspan fill="#ffee00"> = end</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="325px"><tspan>#1  </tspan>connecting to Postgres server: ep-winter-morning-abv2sxkp.eu-west-2.aws.neon.tech</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="346px"><tspan>#1  </tspan><tspan fill="#ff44ff">script -&gt; server:</tspan> &quot;\x00\x00\x00\x08\x04\xd2\x16\x2f&quot;<tspan fill="#ffee00"> = SSLRequest</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="367px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; script:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = SSL supported</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="388px"><tspan>#1  </tspan>TLSv1.3/TLS_AES_256_GCM_SHA384 connection established with server</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="409px"><tspan>#1  </tspan>forwarding client startup message to server</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="430px"><tspan>#1  </tspan><tspan fill="#ff44ff">script -&gt; server:</tspan> &quot;\x00\x00\x00\x56&quot;<tspan fill="#ffee00"> = 86 bytes of startup message</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="451px"><tspan>#1  </tspan>  &quot;\x00\x03&quot;<tspan fill="#ffee00"> = protocol major version 3</tspan> &quot;\x00\x02&quot;<tspan fill="#ffee00"> = protocol minor version 2</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="472px"><tspan>#1  </tspan>  &quot;user\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;neondb_owner\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="493px"><tspan>#1  </tspan>  &quot;database\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;neondb\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="514px"><tspan>#1  </tspan>  &quot;application_name\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;psql\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="535px"><tspan>#1  </tspan>  &quot;client_encoding\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;UTF8\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="556px"><tspan>#1  </tspan>  &quot;\x00&quot;<tspan fill="#ffee00"> = end</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="577px"><tspan>#1  </tspan>forwarding all later traffic</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="598px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;R&quot;<tspan fill="#ffee00"> = Authentication</tspan> &quot;\x00\x00\x00\x2a&quot;<tspan fill="#ffee00"> = 42 bytes</tspan> &quot;\x00\x00\x00\x0a&quot;<tspan fill="#ffee00"> = AuthenticationSASL</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="619px"><tspan>#1  </tspan>  &quot;SCRAM-SHA-256-PLUS\x00&quot;<tspan fill="#ffee00"> = SASL mechanism</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="640px"><tspan>#1  </tspan>  &quot;SCRAM-SHA-256\x00&quot;<tspan fill="#ffee00"> = SASL mechanism</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="661px"><tspan>#1  </tspan>  &quot;\x00&quot;<tspan fill="#ffee00"> = end</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="682px"><tspan>#1  </tspan><tspan>^^ 43 bytes forwarded at +0.17s</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="703px"><tspan>#1  </tspan><tspan fill="#ff44ff">client -&gt; server:</tspan> &quot;p&quot;<tspan fill="#ffee00"> = SASLInitialResponse</tspan> &quot;\x00\x00\x00\x36&quot;<tspan fill="#ffee00"> = 54 bytes</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="724px"><tspan>#1  </tspan>  &quot;SCRAM-SHA-256\x00&quot;<tspan fill="#ffee00"> = selected mechanism</tspan> &quot;\x00\x00\x00\x20&quot;<tspan fill="#ffee00"> = 32 bytes follow</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="745px"><tspan>#1  </tspan>  &quot;n,,n=,r=6Dv+CvxsNyKjNgqj9ICgfr0A&quot;<tspan fill="#ffee00"> = SCRAM client-first-message</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="766px"><tspan>#1  </tspan><tspan>^^ 55 bytes forwarded at +0.17s</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="787px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;R&quot;<tspan fill="#ffee00"> = Authentication</tspan> &quot;\x00\x00\x00\x5c&quot;<tspan fill="#ffee00"> = 92 bytes</tspan> &quot;\x00\x00\x00\x0b&quot;<tspan fill="#ffee00"> = AuthenticationSASLContinue</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="808px"><tspan>#1  </tspan>  &quot;r=6Dv+CvxsNyKjNgqj9ICgfr0AmTrd19svrM64paqVlEwutk7d,s=wJpvuPu9tcsKybvQsHxu+w==,i=4096&quot;<tspan fill="#ffee00"> = SCRAM server-first-message</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="829px"><tspan>#1  </tspan><tspan>^^ 93 bytes forwarded at +0.18s</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="850px"><tspan>#1  </tspan><tspan fill="#ff44ff">client -&gt; server:</tspan> &quot;p&quot;<tspan fill="#ffee00"> = SASLResponse</tspan> &quot;\x00\x00\x00\x6c&quot;<tspan fill="#ffee00"> = 108 bytes</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="871px"><tspan>#1  </tspan>  &quot;c=biws,r=6Dv+CvxsNyKjNgqj9ICgfr0AmTrd19svrM64paqVlEwutk7d,p=iFJwCSajkRUUpTF5J9Sb7mqumKK3JyEZtW1DrGTWil0=&quot;<tspan fill="#ffee00"> = SCRAM client-final-message</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="892px"><tspan>#1  </tspan><tspan>^^ 109 bytes forwarded at +0.19s</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="913px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;R&quot;<tspan fill="#ffee00"> = Authentication</tspan> &quot;\x00\x00\x00\x36&quot;<tspan fill="#ffee00"> = 54 bytes</tspan> &quot;\x00\x00\x00\x0c&quot;<tspan fill="#ffee00"> = AuthenticationSASLFinal</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="934px"><tspan>#1  </tspan>  &quot;v=U52Ytx3KNXJPcOgMs0UdGwJBjHUdw91OTUawbAB0EK0=&quot;<tspan fill="#ffee00"> = SCRAM server-final-message</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="955px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;R&quot;<tspan fill="#ffee00"> = Authentication</tspan> &quot;\x00\x00\x00\x08&quot;<tspan fill="#ffee00"> = 8 bytes</tspan> &quot;\x00\x00\x00\x00&quot;<tspan fill="#ffee00"> = AuthenticationOk</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="976px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x17&quot;<tspan fill="#ffee00"> = 23 bytes</tspan> &quot;in_hot_standby\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;off\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="997px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x19&quot;<tspan fill="#ffee00"> = 25 bytes</tspan> &quot;integer_datetimes\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;on\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1018px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x11&quot;<tspan fill="#ffee00"> = 17 bytes</tspan> &quot;TimeZone\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;GMT\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1039px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x1b&quot;<tspan fill="#ffee00"> = 27 bytes</tspan> &quot;IntervalStyle\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;postgres\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1060px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x20&quot;<tspan fill="#ffee00"> = 32 bytes</tspan> &quot;search_path\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;\&quot;$user\&quot;, public\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1081px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x15&quot;<tspan fill="#ffee00"> = 21 bytes</tspan> &quot;is_superuser\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;off\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1102px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x1a&quot;<tspan fill="#ffee00"> = 26 bytes</tspan> &quot;application_name\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;psql\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1123px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x26&quot;<tspan fill="#ffee00"> = 38 bytes</tspan> &quot;default_transaction_read_only\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;off\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1144px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x1a&quot;<tspan fill="#ffee00"> = 26 bytes</tspan> &quot;scram_iterations\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;4096\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1165px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x17&quot;<tspan fill="#ffee00"> = 23 bytes</tspan> &quot;DateStyle\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;ISO, MDY\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1186px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x23&quot;<tspan fill="#ffee00"> = 35 bytes</tspan> &quot;standard_conforming_strings\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;on\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1207px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x27&quot;<tspan fill="#ffee00"> = 39 bytes</tspan> &quot;session_authorization\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;neondb_owner\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1228px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x19&quot;<tspan fill="#ffee00"> = 25 bytes</tspan> &quot;client_encoding\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;UTF8\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1249px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x22&quot;<tspan fill="#ffee00"> = 34 bytes</tspan> &quot;server_version\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;17.8 (6108b59)\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1270px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = ParameterStatus</tspan> &quot;\x00\x00\x00\x19&quot;<tspan fill="#ffee00"> = 25 bytes</tspan> &quot;server_encoding\x00&quot;<tspan fill="#ffee00"> = key</tspan> &quot;UTF8\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1291px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;K&quot;<tspan fill="#ffee00"> = BackendKeyData</tspan> &quot;\x00\x00\x00\x14&quot;<tspan fill="#ffee00"> = 20 bytes</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1312px"><tspan>#1  </tspan>  &quot;\x00\x00\x03\x6d&quot;<tspan fill="#ffee00"> = process ID: 877</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1333px"><tspan>#1  </tspan>  &quot;\x6b\x32\xfb\x77\x81\x02\x50\xee\x49\xe2\x92\x73&quot;<tspan fill="#ffee00"> = secret key</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1354px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;Z&quot;<tspan fill="#ffee00"> = ReadyForQuery</tspan> &quot;\x00\x00\x00\x05&quot;<tspan fill="#ffee00"> = 5 bytes</tspan> &quot;I&quot;<tspan fill="#ffee00"> = idle</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1375px"><tspan>#1  </tspan><tspan>^^ 522 bytes forwarded at +0.22s</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1396px"><tspan>#1  </tspan><tspan fill="#ff44ff">client -&gt; server:</tspan> &quot;Q&quot;<tspan fill="#ffee00"> = Query</tspan> &quot;\x00\x00\x00\x19&quot;<tspan fill="#ffee00"> = 25 bytes</tspan> &quot;SELECT pg_sleep(10);\x00&quot;<tspan fill="#ffee00"> = query</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1417px"><tspan>#1  </tspan><tspan>^^ 26 bytes forwarded at +1.41s</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1438px"><tspan>#3  </tspan>listening on 127.0.0.1 port 5432 …</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1459px"><tspan>#2  </tspan>connected at t0 = 2026-03-04 17:42:10 +0000</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1480px"><tspan>#2  </tspan>no SSLRequest: continuing in plaintext</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1501px"><tspan>#2  </tspan><tspan fill="#ff44ff">client -&gt; script:</tspan> &quot;\x00\x00\x00\x18&quot;<tspan fill="#ffee00"> = 24 bytes of CancelRequest message</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1522px"><tspan>#2  </tspan>  &quot;\x04\xd2&quot;<tspan fill="#ffee00"> = cancel code: 1234</tspan> &quot;\x16\x2e&quot;<tspan fill="#ffee00"> = cancel code: 5678</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1543px"><tspan>#2  </tspan>  &quot;\x00\x00\x03\x6d&quot;<tspan fill="#ffee00"> = target backend process ID: 877</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1564px"><tspan>#2  </tspan>  &quot;\x6b\x32\xfb\x77\x81\x02\x50\xee\x49\xe2\x92\x73&quot;<tspan fill="#ffee00"> = target backend secret key</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1585px"><tspan>#2  </tspan>using remembered host for CancelRequest connection</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1606px"><tspan>#2  </tspan>connecting to Postgres server: ep-winter-morning-abv2sxkp.eu-west-2.aws.neon.tech</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1627px"><tspan>#2  </tspan><tspan fill="#ff44ff">script -&gt; server:</tspan> &quot;\x00\x00\x00\x08\x04\xd2\x16\x2f&quot;<tspan fill="#ffee00"> = SSLRequest</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1648px"><tspan>#2  </tspan><tspan fill="#00dddd">server -&gt; script:</tspan> &quot;S&quot;<tspan fill="#ffee00"> = SSL supported</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1669px"><tspan>#2  </tspan>TLSv1.3/TLS_AES_256_GCM_SHA384 connection established with server</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1690px"><tspan>#2  </tspan>forwarding client startup message to server</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1711px"><tspan>#2  </tspan><tspan fill="#ff44ff">script -&gt; server:</tspan> &quot;\x00\x00\x00\x18&quot;<tspan fill="#ffee00"> = 24 bytes of CancelRequest message</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1732px"><tspan>#2  </tspan>  &quot;\x04\xd2&quot;<tspan fill="#ffee00"> = cancel code: 1234</tspan> &quot;\x16\x2e&quot;<tspan fill="#ffee00"> = cancel code: 5678</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1753px"><tspan>#2  </tspan>  &quot;\x00\x00\x03\x6d&quot;<tspan fill="#ffee00"> = target backend process ID: 877</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1774px"><tspan>#2  </tspan>  &quot;\x6b\x32\xfb\x77\x81\x02\x50\xee\x49\xe2\x92\x73&quot;<tspan fill="#ffee00"> = target backend secret key</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1795px"><tspan>#2  </tspan>forwarding all later traffic</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1816px"><tspan>#2  </tspan>server hung up</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1837px"><tspan>#2  </tspan>connection end</text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1858px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;T&quot;<tspan fill="#ffee00"> = RowDescription</tspan> &quot;\x00\x00\x00\x21&quot;<tspan fill="#ffee00"> = 33 bytes</tspan> &quot;\x00\x01&quot;<tspan fill="#ffee00"> = 1 columns follow</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1879px"><tspan>#1  </tspan>  &quot;pg_sleep\x00&quot;<tspan fill="#ffee00"> = column name</tspan> &quot;\x00\x00\x00\x00&quot;<tspan fill="#ffee00"> = table OID: 0</tspan> &quot;\x00\x00&quot;<tspan fill="#ffee00"> = table attrib no: 0</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1900px"><tspan>#1  </tspan>  &quot;\x00\x00\x08\xe6&quot;<tspan fill="#ffee00"> = type OID: 2278</tspan> &quot;\x00\x04&quot;<tspan fill="#ffee00"> = type length: 4</tspan> &quot;\xff\xff\xff\xff&quot;<tspan fill="#ffee00"> = type modifier: -1</tspan> &quot;\x00\x00&quot;<tspan fill="#ffee00"> = format: text</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1921px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;E&quot;<tspan fill="#ffee00"> = ErrorResponse</tspan> &quot;\x00\x00\x00\x68&quot;<tspan fill="#ffee00"> = 104 bytes</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1942px"><tspan>#1  </tspan>  &quot;S&quot;<tspan fill="#ffee00"> = severity</tspan> &quot;ERROR\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1963px"><tspan>#1  </tspan>  &quot;V&quot;<tspan fill="#ffee00"> = unlocalized severity</tspan> &quot;ERROR\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="1984px"><tspan>#1  </tspan>  &quot;C&quot;<tspan fill="#ffee00"> = SQLSTATE code</tspan> &quot;57014\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="2005px"><tspan>#1  </tspan>  &quot;M&quot;<tspan fill="#ffee00"> = message</tspan> &quot;canceling statement due to user request\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="2026px"><tspan>#1  </tspan>  &quot;F&quot;<tspan fill="#ffee00"> = file</tspan> &quot;postgres.c\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="2047px"><tspan>#1  </tspan>  &quot;L&quot;<tspan fill="#ffee00"> = line</tspan> &quot;3428\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="2068px"><tspan>#1  </tspan>  &quot;R&quot;<tspan fill="#ffee00"> = routine</tspan> &quot;ProcessInterrupts\x00&quot;<tspan fill="#ffee00"> = value</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="2089px"><tspan>#1  </tspan>  &quot;\x00&quot;<tspan fill="#ffee00"> = end</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="2110px"><tspan>#1  </tspan><tspan fill="#00dddd">server -&gt; client:</tspan> &quot;Z&quot;<tspan fill="#ffee00"> = ReadyForQuery</tspan> &quot;\x00\x00\x00\x05&quot;<tspan fill="#ffee00"> = 5 bytes</tspan> &quot;I&quot;<tspan fill="#ffee00"> = idle</tspan></text>
  <text xmlSpace="preserve" fill="#eee" fontFamily="IBM Plex Mono, monospace" fontSize="15px" x="20px" y="2131px"><tspan>#1  </tspan><tspan>^^ 145 bytes forwarded at +3.13s</tspan></text>
</svg>
</div>
