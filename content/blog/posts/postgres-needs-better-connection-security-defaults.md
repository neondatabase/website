---
title: Why Postgres needs better connection security defaults
description: 'sslmode=require: ubiquitous, reassuring, and almost useless'
excerpt: >-
  In this post: why are Postgres connections with sslmode=require insecure? How
  does Neon ensure secure connections? And what needs to happen to make secure
  Postgres connections the norm? It’s common to see sslmode=require on the end
  of a Postgres connection string. Maybe your own...
date: '2025-06-25T14:44:21'
updatedOn: '2025-07-22T01:55:38'
category: postgres
categories:
  - postgres
authors:
  - george-mackerron
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-needs-better-connection-security-defaults/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Why Postgres needs better connection security defaults - Neon
  description: >-
    In this post: why are Postgres connections with sslmode=require insecure?
    How does Neon ensure secure connections? And what needs to happen to make
    secure Postgres connections the norm?
  keywords: []
  noindex: false
  ogTitle: Why Postgres needs better connection security defaults - Neon
  ogDescription: >-
    In this post: why are Postgres connections with sslmode=require insecure?
    How does Neon ensure secure connections? And what needs to happen to make
    secure Postgres connections the norm?
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-needs-better-connection-security-defaults/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-needs-better-connection-security-defaults/neon-postgress-1-1024x576-2bbf84a6.jpg)

**In this post: why are Postgres connections with `sslmode=require` insecure? How does Neon ensure secure connections? And what needs to happen to make secure Postgres connections the norm?**

It’s common to see `sslmode=require` on the end of a Postgres connection string. Maybe your own shell history contains a line like this:

```bash
psql 'postgresql://me:mypassword@myhost.com/mydb?sslmode=require'
```

`sslmode=require` looks pretty solid and reassuring. You might reasonably imagine it to provide a level of security at least on par, say, with the https connection your browser used to fetch this blog post. I know I once did.

It’s unfortunate that `sslmode=require` is so widely used, and sounds so much like the real deal. Because, in fact, `sslmode=require` offers barely any security at all. It’s a bit like ‘securing’ your house by drawing the curtains but leaving the door on the latch. I mean, sure: now nobody can casually see your stuff as they walk by. On the other hand: anyone with an active interest can still wander in, steal your belongings, or even burn the place down.

The problem is this: `sslmode=require` _encrypts_, but it doesn’t _authenticate_. It does all the hard work to make sure your communication channel is secured, while doing nothing at all to check who’s on the other end of it. This slightly odd behaviour makes it vulnerable to the most trivially straightforward [MITM attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).

[I’ve blogged about this before, back in 2023](https://neon.tech/blog/avoid-mitm-attacks-with-psql-postgres-16). That time I managed to MITM my own `sslmode=require` connection in the space of a few hours. From a standing start, those few hours included the time taken to (1) write a simple, password-stealing Postgres proxy; (2) give it a self-signed certificate for any random domain; and (3) find out how to poison a DNS cache.

As I also mentioned back then, the traditional way to _properly_ secure a Postgres connection is to use `sslmode=verify-full`, not `sslmode=require`. This requires you to also supply the client with one or more root certificates to verify the server’s certificate against. The extra friction involved here may seem small, but it’s enough to ensure that this option has not been so commonly used.

## Is sslrootcert=system the answer?

Back in 2023, there was good news: a brand-new connection parameter for Postgres 16, `sslrootcert=system`, which was meant to do the right thing in one easy shot. It encrypts, and it also authenticates the server on the other end using the Public Key Infrastructure (PKI), represented by the trusted root certificates already installed on your system.

In other words, `sslrootcert=system` is supposed to tell your Postgres client to do the exact same two things your web browser has been doing for years. This would be perfect for connecting to Neon databases, which are secured using standard PKI certificates courtesy of [Let’s Encrypt](https://letsencrypt.org/). So I was hopeful that Neon would soon be able to improve security by adding `sslrootcert=system` to our connection strings.

However, back in 2023 I noted that `sslrootcert=system` didn’t yet work with the _de facto_ official Windows psql binary — the one provided by the EDB Postgres 16 installer. I sent a few emails to EDB about this, and looked forward to the issue being resolved. It didn’t seem like a big deal: after all, it was going to take a little while for most people to update their Postgres clients to versions that understood `sslrootcert=system` anyway.

Fast-forward to early 2025, and I thought it was probably time to revisit the `sslrootcert=system` situation. Could more or less everyone use this now? I started by checking `sslrootcert=system` using EDB’s psql 17 on Windows. And — huh. I got just the same error I’d seen before.

I proceeded to do what, in retrospect, I should have done the first time, and checked a bunch of other Postgres installations. I was a bit dismayed to find that almost all of them failed. I got errors even on the official Docker Postgres images.

So, aiming to get `sslrootcert=system` working as widely as possible, I embarked on a minor ticket-filing spree. I had some success:

- On Mac, the psql bundled into Postgres.app [now works](https://github.com/PostgresApp/PostgresApp/issues/801), and psql installed by EDB on macOS [now works](https://github.com/EnterpriseDB/edb-installers/issues/264) too. These two just needed to point their OpenSSL to the root CA certificates provided by macOS at /private/etc/ssl.
- The MacPorts package now [also works](https://trac.macports.org/ticket/72080), by specifying a dependency on MacPorts’ own curl-ca-bundle or certsync. (And for completeness on the Mac side, a shout-out to Homebrew’s psql: this worked already, because its openssl dependency already [declares ca-certificates](https://formulae.brew.sh/api/formula/openssl@3.json) as a dependency of its own).
- The Docker Postgres maintainers [have so far declined](https://github.com/docker-library/postgres/issues/1331) to include the Debian ca-certificates package in their Debian installation. I find that a bit surprising. But my suggestion that ca-certificates be added as a _recommends_ dependency for psql (via libpq) on Debian [has been taken up](https://salsa.debian.org/postgresql/postgresql/-/commit/96077ad61c36386646cdd9b5ce0e423a357ce73b), so the Docker images will hopefully still end up working sooner or later.

On Windows, however, the problem runs a little deeper.

## A winstore, but not for the win

libpq delegates root certificate handling for `sslrootcert=system` to OpenSSL [by calling](https://github.com/postgres/postgres/blob/e65d8be042f743a7a839ec8df5c9005b8811d06f/src/interfaces/libpq/fe-secure-openssl.c#L1047) the function `SSL_CTX_set_default_verify_paths`. [According to the OpenSSL docs](https://docs.openssl.org/master/man3/SSL_CTX_load_verify_locations/#description), this function “specifies that the default locations from which CA certificates are loaded should be used. There is one default directory, one default file and one default store”.

OpenSSL supports the Windows native certificate store since version 3.2.0: you can specify it directly via the function `SSL_CTX_load_verify_store(ctx, "org.openssl.winstore:")`. So you might imagine that on Windows this winstore would be the “one default store” mentioned above, and everything would be plain sailing.

Unfortunately, that’s not currently the case, although [a bit of GitHub archaeology](https://github.com/openssl/openssl/issues/21068) suggests that the winstore was once intended for this role, and could perhaps end up there again.

I’ve suggested [a patch to make libpq use the winstore](https://github.com/postgres/postgres/compare/master...jawj:postgres:jawj-sslrootcert-system-windows#diff-ec0d8fba2a139a0ee1827f9b8dd0466d4a20f150a5072ea3bd3cd1d41448f36c) if none of the relevant OpenSSL environment variables are set and there are no certificates in the default locations. This is admittedly a little bit kludgy, and [nobody has been in any hurry](https://www.postgresql.org/message-id/42C5B93F-F2BF-431C-926F-E317A132993D%40mackerron.co.uk) to merge it. So probably the best hope for `sslrootcert=system` on Windows is that a future release of OpenSSL will make the winstore the default store there, and then everything will Just Work™.

In the meantime, the Postgres docs [have been tweaked](https://www.postgresql.org/message-id/B3CBBAA3-6EA3-4AB7-8619-4BBFAB93DDB4%40yesql.se) to say that `sslrootcert=system` loads “the trusted CA roots from the SSL implementation”, instead of “the system’s trusted CA roots”. A pretty big clue that this is not the ideal final outcome is that the word ‘system’ has thereby disappeared from the explanation of what `sslrootcert=system` does!

For now, we’re essentially back where we started on this. Neon still can’t append `sslrootcert=system` to our default connection strings, because Windows still can’t deal with it, and it therefore won’t work for a good chunk of our users.

## Plan B: channel binding

Since `sslrootcert=system` may not work on Windows for some time, we need a Plan B. Happily, we have a really good one. Thanks to my colleague Conrad we have some new defences against MITM attacks, because the Neon proxy [now supports](https://github.com/neondatabase/neon/pull/5683) Postgres’s [SCRAM-SHA-256-PLUS](https://www.postgresql.org/docs/current/sasl-authentication.html) auth mechanism.

Like ordinary SCRAM-SHA-256, this is a mechanism in which each side of the exchange proves they know the user’s password without revealing that password to each other. This prevents an MITM attacker from stealing a user’s credentials, which is a good start.

More significantly, the -PLUS in SCRAM-SHA-256 _–_ PLUS represents the use of _channel binding_. Channel binding means that the client sends the server a hash of the certificate it thinks is being used to secure the connection, and then it effectively signs that hash using its knowledge of the user’s password.

This foils MITM attacks (and not only the trivial ones: it ought to work even against attacks by three-letter agencies that can issue their own PKI-trusted certificates). It doesn’t actually change psql’s `sslmode=require` behaviour of accepting any old certificate, self-signed by anyone. Instead, it makes the server that presents the TLS certificate prove that it also knows your connection password. This turns out to be at least as good.

Rather than let me spend more words trying to explain how this works, you can see channel binding in action, [byte by byte, on a live Postgres connection](https://bytebybyte.dev/?postgres). Scroll about three-quarters of the way through the output to get past the TLS handshake, or search in-page for “SCRAM-SHA-256-PLUS”. I built this tool as a way to get to grips with how channel binding works (I’ve since used the knowledge to add channel binding [support in node-postgres](https://github.com/brianc/node-postgres/pull/3356), and I’m working on Bun.sql and postgres.js).

Channel binding is how we’ve now made Neon connections from psql fully secure in a way that works across platforms, and even on older versions of psql. We’ve now added channel_binding=require (on top of sslmode=require) to the connection strings we show in our console.

This parameter should properly secure your connections from psql, and also from the [many libpq-based Postgres drivers](https://wiki.postgresql.org/wiki/List_of_drivers). My testing indicates that most non-libpq drivers currently ignore it. In these cases it doesn’t help, but it also doesn’t hurt (the one exception I’ve found is Go’s [pgdriver](https://pkg.go.dev/github.com/uptrace/bun/driver/pgdriver), which causes an error by attempting to `SET channel_binding TO ‘require’` after it connects).

We’ve also added channel binding to the connection snippets we provide for drivers that use other connection data formats, including Npgsql for .NET and the Postgres JDBC driver. For the JDBC driver, we’ve reported a [related security issue](https://github.com/pgjdbc/pgjdbc/security/advisories/GHSA-hq9p-pm7w-8p54).

## When does security trump backwards-compatibility?

From a broader perspective, it’s still pretty bad that sslmode=require is so widely used and yet so insecure. And, of course, the _default_ connection security in Postgres is even worse.

If you don’t specify an sslmode, you get sslmode=prefer. This is the same as sslmode=require when the server offers encryption, or entirely unsecured when it doesn’t. sslmode=prefer is the default purely for backward-compatibility reasons: the Postgres docs themselves [admit](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-PROTECTION) that it makes little other sense.

A basic improvement for future versions of psql and libpq might be to rename sslmode=require to something like sslmode=insecure (or even sslmode=please-mitm-me?). I’d also argue for a new mode name, sslmode=secure, which would imply sslmode=verify-full + sslrootcert=system, and could be the new default.

This would, of course, require some Postgres users to change their connection strings. For some of these users, this would be a small inconvenience with no upside. For others, the upside would be much improved connection security. The Postgres committers are understandably committed to backward-compatibility, but people have been broadly sympathetic when I’ve [made this kind of suggestion](https://www.postgresql.org/message-id/39F97E23-CC5C-4A3E-8323-065F6D2F4154%40mackerron.co.uk) on the mailing list.

There has also been some discussion of potentially deeper changes, such as a secure connection URL scheme (maybe postgresqls://, by analogy with https://). I think we can be optimistic that Postgres is going to be more secure by default and for everybody in the medium- to long-term.
