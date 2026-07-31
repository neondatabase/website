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
---

<img
  src="https://cdn.neonapi.io/public/images/pages/blog/elephantshark-monitor-postgres-network-traffic/neon-elephantshark-1024x576-5e51a5b6.jpg"
  alt="Post image"
  width="1024"
  height="576"
/>

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

<div className="blog-svg-scroll">
<svg width="1282" height="1668" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1282 1668">
  <rect width="1282" height="1668" fill="#002050" />
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="31px">% elephantshark</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="52px">listening …</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="73px">connected at t0 = 2025-09-18 09:19:05 +0100</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="94px"><tspan fill="#ff44ff">client -&gt; script:</tspan> "\x00\x00\x00\x08\x04\xd2\x16\x2f"<tspan fill="#ffee00"> = SSLRequest</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="115px"><tspan fill="#00dddd">script -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = SSL supported</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="136px">TLSv1.3/TLS_AES_256_GCM_SHA384 connection established with client</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="157px">  server name via SNI: ep-aged-night-a80vx88s.eastus2.azure.neon.tech.local.neon.build</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="178px"><tspan fill="#ff44ff">client -&gt; script:</tspan> "\x00\x00\x00\x56"<tspan fill="#ffee00"> = 86 bytes of startup message</tspan> "\x00\x03\x00\x00"<tspan fill="#ffee00"> = protocol version</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="199px">  "user\x00"<tspan fill="#ffee00"> = key</tspan> "neondb_owner\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="220px">  "database\x00"<tspan fill="#ffee00"> = key</tspan> "neondb\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="241px">  "application_name\x00"<tspan fill="#ffee00"> = key</tspan> "psql\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="262px">  "client_encoding\x00"<tspan fill="#ffee00"> = key</tspan> "UTF8\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="283px">  "\x00"<tspan fill="#ffee00"> = end</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="304px">connecting to Postgres server: ep-aged-night-a80vx88s.eastus2.azure.neon.tech</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="325px"><tspan fill="#ff44ff">script -&gt; server:</tspan> "\x00\x00\x00\x08\x04\xd2\x16\x2f"<tspan fill="#ffee00"> = SSLRequest</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="346px"><tspan fill="#00dddd">server -&gt; script:</tspan> "S"<tspan fill="#ffee00"> = SSL supported</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="367px">TLSv1.3/TLS_AES_256_GCM_SHA384 connection established with server</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="388px">forwarding client startup message to server</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="409px"><tspan fill="#ff44ff">script -&gt; server:</tspan> "\x00\x00\x00\x56"<tspan fill="#ffee00"> = 86 bytes of startup message</tspan> "\x00\x03\x00\x00"<tspan fill="#ffee00"> = protocol version</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="430px">  "user\x00"<tspan fill="#ffee00"> = key</tspan> "neondb_owner\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="451px">  "database\x00"<tspan fill="#ffee00"> = key</tspan> "neondb\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="472px">  "application_name\x00"<tspan fill="#ffee00"> = key</tspan> "psql\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="493px">  "client_encoding\x00"<tspan fill="#ffee00"> = key</tspan> "UTF8\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="514px">  "\x00"<tspan fill="#ffee00"> = end</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="535px">forwarding all later traffic</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="556px"><tspan fill="#00dddd">server -&gt; client:</tspan> "R"<tspan fill="#ffee00"> = Authentication</tspan> "\x00\x00\x00\x2a"<tspan fill="#ffee00"> = 42 bytes</tspan> "\x00\x00\x00\x0a"<tspan fill="#ffee00"> = AuthenticationSASL</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="577px">  "SCRAM-SHA-256-PLUS\x00"<tspan fill="#ffee00"> = SASL mechanism</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="598px">  "SCRAM-SHA-256\x00"<tspan fill="#ffee00"> = SASL mechanism</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="619px">  "\x00"<tspan fill="#ffee00"> = end</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="640px">^^ 43 bytes forwarded at +0.55s, 0 bytes left in buffer</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="661px"><tspan fill="#ff44ff">client -&gt; server:</tspan> "p"<tspan fill="#ffee00"> = SASLInitialResponse</tspan> "\x00\x00\x00\x36"<tspan fill="#ffee00"> = 54 bytes</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="682px">  "SCRAM-SHA-256\x00"<tspan fill="#ffee00"> = selected mechanism</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="703px">  "\x00\x00\x00\x20"<tspan fill="#ffee00"> = 32 bytes follow</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="724px">  "n,,n=,r=oyCbUH3BAFTR5K7ky/6sT6sl"<tspan fill="#ffee00"> = SCRAM client-first-message</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="745px">^^ 55 bytes forwarded at +0.55s, 0 bytes left in buffer</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="766px"><tspan fill="#00dddd">server -&gt; client:</tspan> "R"<tspan fill="#ffee00"> = Authentication</tspan> "\x00\x00\x00\x5c"<tspan fill="#ffee00"> = 92 bytes</tspan> "\x00\x00\x00\x0b"<tspan fill="#ffee00"> = AuthenticationSASLContinue</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="787px">  "r=oyCbUH3BAFTR5K7ky/6sT6slO/L2RQWlqi8k5hbEe9Ch4TW1,s=sua0GGw9khvJmqzfirvr4w==,i=4096"<tspan fill="#ffee00"> = SCRAM server-first-message</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="808px">^^ 93 bytes forwarded at +0.65s, 0 bytes left in buffer</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="829px"><tspan fill="#ff44ff">client -&gt; server:</tspan> "p"<tspan fill="#ffee00"> = SASLResponse</tspan> "\x00\x00\x00\x6c"<tspan fill="#ffee00"> = 108 bytes</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="850px">  "c=biws,r=oyCbUH3BAFTR5K7ky/6sT6slO/L2RQWlqi8k5hbEe9Ch4TW1,p=F4I92rJgKR987t7tf93xdumCRuktShWrNvh6MY/rj8M="<tspan fill="#ffee00"> = SCRAM client-final-message</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="871px">^^ 109 bytes forwarded at +0.65s, 0 bytes left in buffer</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="892px"><tspan fill="#00dddd">server -&gt; client:</tspan> "R"<tspan fill="#ffee00"> = Authentication</tspan> "\x00\x00\x00\x36"<tspan fill="#ffee00"> = 54 bytes</tspan> "\x00\x00\x00\x0c"<tspan fill="#ffee00"> = AuthenticationSASLFinal</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="913px">  "v=ZKr8JIlFdYKw/3GVRnZ1epdKZIfMjXW2Ep3I5JsvNbQ="<tspan fill="#ffee00"> = SCRAM server-final-message</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="934px"><tspan fill="#00dddd">server -&gt; client:</tspan> "R"<tspan fill="#ffee00"> = Authentication</tspan> "\x00\x00\x00\x08"<tspan fill="#ffee00"> = 8 bytes</tspan> "\x00\x00\x00\x00"<tspan fill="#ffee00"> = AuthenticationOk</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="955px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x17"<tspan fill="#ffee00"> = 23 bytes</tspan> "in_hot_standby\x00"<tspan fill="#ffee00"> = key</tspan> "off\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="976px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x19"<tspan fill="#ffee00"> = 25 bytes</tspan> "integer_datetimes\x00"<tspan fill="#ffee00"> = key</tspan> "on\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="997px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x11"<tspan fill="#ffee00"> = 17 bytes</tspan> "TimeZone\x00"<tspan fill="#ffee00"> = key</tspan> "GMT\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1018px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x1b"<tspan fill="#ffee00"> = 27 bytes</tspan> "IntervalStyle\x00"<tspan fill="#ffee00"> = key</tspan> "postgres\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1039px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x20"<tspan fill="#ffee00"> = 32 bytes</tspan> "search_path\x00"<tspan fill="#ffee00"> = key</tspan> "\\\"$user\\\", public\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1060px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x15"<tspan fill="#ffee00"> = 21 bytes</tspan> "is_superuser\x00"<tspan fill="#ffee00"> = key</tspan> "off\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1081px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x1a"<tspan fill="#ffee00"> = 26 bytes</tspan> "application_name\x00"<tspan fill="#ffee00"> = key</tspan> "psql\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1102px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x26"<tspan fill="#ffee00"> = 38 bytes</tspan> "default_transaction_read_only\x00"<tspan fill="#ffee00"> = key</tspan> "off\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1123px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x1a"<tspan fill="#ffee00"> = 26 bytes</tspan> "scram_iterations\x00"<tspan fill="#ffee00"> = key</tspan> "4096\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1144px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x17"<tspan fill="#ffee00"> = 23 bytes</tspan> "DateStyle\x00"<tspan fill="#ffee00"> = key</tspan> "ISO, MDY\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1165px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x23"<tspan fill="#ffee00"> = 35 bytes</tspan> "standard_conforming_strings\x00"<tspan fill="#ffee00"> = key</tspan> "on\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1186px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x27"<tspan fill="#ffee00"> = 39 bytes</tspan> "session_authorization\x00"<tspan fill="#ffee00"> = key</tspan> "neondb_owner\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1207px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x19"<tspan fill="#ffee00"> = 25 bytes</tspan> "client_encoding\x00"<tspan fill="#ffee00"> = key</tspan> "UTF8\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1228px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x22"<tspan fill="#ffee00"> = 34 bytes</tspan> "server_version\x00"<tspan fill="#ffee00"> = key</tspan> "17.5 (a42a079)\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1249px"><tspan fill="#00dddd">server -&gt; client:</tspan> "S"<tspan fill="#ffee00"> = ParameterStatus</tspan> "\x00\x00\x00\x19"<tspan fill="#ffee00"> = 25 bytes</tspan> "server_encoding\x00"<tspan fill="#ffee00"> = key</tspan> "UTF8\x00"<tspan fill="#ffee00"> = value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1270px"><tspan fill="#00dddd">server -&gt; client:</tspan> "K"<tspan fill="#ffee00"> = BackendKeyData</tspan> "\x00\x00\x00\x0c"<tspan fill="#ffee00"> = 12 bytes</tspan> "\x16\xee\x00\x6a"<tspan fill="#ffee00"> = process ID</tspan> "\xa0\x00\x89\x24"<tspan fill="#ffee00"> = secret key</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1291px"><tspan fill="#00dddd">server -&gt; client:</tspan> "Z"<tspan fill="#ffee00"> = ReadyForQuery</tspan> "\x00\x00\x00\x05"<tspan fill="#ffee00"> = 5 bytes</tspan> "I"<tspan fill="#ffee00"> = idle</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1312px">^^ 514 bytes forwarded at +0.76s, 0 bytes left in buffer</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1333px"><tspan fill="#ff44ff">client -&gt; server:</tspan> "Q"<tspan fill="#ffee00"> = Query</tspan> "\x00\x00\x00\x12"<tspan fill="#ffee00"> = 18 bytes</tspan> "SELECT now();\x00"<tspan fill="#ffee00"> = query</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1354px">^^ 19 bytes forwarded at +2.17s, 0 bytes left in buffer</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1375px"><tspan fill="#00dddd">server -&gt; client:</tspan> "T"<tspan fill="#ffee00"> = RowDescription</tspan> "\x00\x00\x00\x1c"<tspan fill="#ffee00"> = 28 bytes</tspan> "\x00\x01"<tspan fill="#ffee00"> = 1 columns follow</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1396px">  "now\x00"<tspan fill="#ffee00"> = column name</tspan> "\x00\x00\x00\x00"<tspan fill="#ffee00"> = table OID: 0</tspan> "\x00\x00"<tspan fill="#ffee00"> = table attrib no: 0</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1417px">  "\x00\x00\x04\xa0"<tspan fill="#ffee00"> = type OID: 1184</tspan> "\x00\x08"<tspan fill="#ffee00"> = type length: 8</tspan> "\xff\xff\xff\xff"<tspan fill="#ffee00"> = type modifier: -1</tspan> "\x00\x00"<tspan fill="#ffee00"> = format: text</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1438px"><tspan fill="#00dddd">server -&gt; client:</tspan> "D"<tspan fill="#ffee00"> = DataRow</tspan> "\x00\x00\x00\x27"<tspan fill="#ffee00"> = 39 bytes</tspan> "\x00\x01"<tspan fill="#ffee00"> = 1 columns follow</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1459px">  "\x00\x00\x00\x1d"<tspan fill="#ffee00"> = 29 bytes</tspan> "2025-09-18 08:19:08.270142+00"<tspan fill="#ffee00"> = column value</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1480px"><tspan fill="#00dddd">server -&gt; client:</tspan> "C"<tspan fill="#ffee00"> = CommandComplete</tspan> "\x00\x00\x00\x0d"<tspan fill="#ffee00"> = 13 bytes</tspan> "SELECT 1\x00"<tspan fill="#ffee00"> = command tag</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1501px"><tspan fill="#00dddd">server -&gt; client:</tspan> "Z"<tspan fill="#ffee00"> = ReadyForQuery</tspan> "\x00\x00\x00\x05"<tspan fill="#ffee00"> = 5 bytes</tspan> "I"<tspan fill="#ffee00"> = idle</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1522px">^^ 89 bytes forwarded at +2.3s, 0 bytes left in buffer</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1543px"><tspan fill="#ff44ff">client -&gt; server:</tspan> "X"<tspan fill="#ffee00"> = Terminate</tspan> "\x00\x00\x00\x04"<tspan fill="#ffee00"> = 4 bytes</tspan></text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1564px">^^ 5 bytes forwarded at +3.7s, 0 bytes left in buffer</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1585px">client hung up</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1606px">connection end</text>
  <text fontFamily="IBM Plex Mono, monospace" fontSize="15px" fill="#eee" xmlSpace="preserve" x="20px" y="1648px">listening …</text>
</svg>
</div>

## Get started with Elephantshark

To find out more and/or to install Elephantshark, [check out the README](https://github.com/neondatabase-labs/elephantshark) on GitHub. You can also [find out more about Neon](https://neon.com/), or [sign up today](https://console.neon.tech/) for free.
