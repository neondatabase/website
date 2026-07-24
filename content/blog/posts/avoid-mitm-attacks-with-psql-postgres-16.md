---
title: MITM attacks are easier to avoid with psql (Postgres) 16
description: >-
  Learn how the psql client in Postgres 16 makes it simpler than ever to connect
  a secure interactive session to your Neon database
excerpt: >-
  The psql client accepts a new connection string option in Postgres 16:
  ?sslrootcert=system. This new option makes it simpler than ever to connect a
  secure interactive session to your Neon database: You can use psql version 16
  with this new option even if your Neon database is sti...
date: '2023-10-05T15:45:41'
updatedOn: '2024-03-01T16:01:34'
category: community
categories:
  - community
authors:
  - george-mackerron
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/avoid-mitm-attacks-with-psql-postgres-16/cover.jpg
  alt: null
isFeatured: false
seo:
  title: MITM attacks are easier to avoid with psql (Postgres) 16 - Neon
  description: >-
    Learn how the psql client in Postgres 16 makes it simpler than ever to
    connect a secure interactive session to your Neon database
  keywords: []
  noindex: false
  ogTitle: MITM attacks are easier to avoid with psql (Postgres) 16 - Neon
  ogDescription: >-
    Learn how the psql client in Postgres 16 makes it simpler than ever to
    connect a secure interactive session to your Neon database
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/avoid-mitm-attacks-with-psql-postgres-16/cover.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/avoid-mitm-attacks-with-psql-postgres-16/neon-mitm-attacks-2-1024x576-a502e26b.jpg)

The psql client accepts a new connection string option in Postgres 16: `?sslrootcert=system`. This new option makes it simpler than ever to connect a secure interactive session to your Neon database:

```bash
psql "postgres://user:pass@endpoint.neon.tech/main?sslrootcert=system"
```

You can use psql version 16 with this new option even if your Neon database is still on Postgres 14 or 15.

Read on to discover why this is important, especially if you’ve previously connected to Postgres using `?sslmode=require`, which isn’t secure.

## Securing connections in general

What does it mean for a connection to a server to be secure? Two things are required:

1. Encryption, which makes your connection safe from eavesdropping and potential takeover.
2. Authentication, which ensures the server you connect to is the one you meant to connect to.

When you access a website over https — which mostly, these days, [you do](https://letsencrypt.org/stats/#percent-pageloads) — you get both of these things.

For example, when you loaded this blog post from [https://neon.tech](https://neon.tech), your browser encrypted the request with TLS. It checked that the certificate presented by the server was current; that it said ‘neon.tech’ on it; and that it was signed by a certificate authority (CA) it trusts.

Your browser trusts the CA because the CA has promised only to provide a signed certificate that says ‘neon.tech’ on it to someone who can prove that they control ‘neon.tech’.

<blockquote>
<p>I know this because I made a page where you can <a href="https://bytebybyte.dev/">see it all happen all in real-time</a>.</p>
</blockquote>

This security model — public key infrastructure with a large set of widely trusted CAs — [isn’t perfect](https://www.redhat.com/sysadmin/pki-protection). But we might regard it as the bare minimum level of security we’d want for the data in our databases, much of which will be more valuable and more sensitive than a blog post.

## Securing connections to Postgres

Unfortunately, even this minimum level of security is not what you get by default when you use psql to connect to Postgres.

psql, reflecting the libpq library it’s built on, provides [six different sslmode options](https://www.postgresql.org/docs/16/libpq-ssl.html#LIBPQ-SSL-PROTECTION). These are: `disable`, `allow`, `prefer`, `require`, `verify-ca` and `verify-full`. The default is `sslmode=prefer`, which doesn’t guarantee either encryption or authentication.

<blockquote>
<p>To quote the Postgres docs, <code>sslmode=prefer</code> means: “I don’t care about encryption, but I wish to pay the overhead of encryption if the server supports it”. To quote the same docs again: “this makes no sense from a security point of view”.</p>
</blockquote>

Commonly specified in preference to `sslmode=prefer` is `sslmode=require`. It is, for example, [what Heroku has been recommending](https://devcenter.heroku.com/articles/connecting-to-heroku-postgres-databases-from-outside-of-heroku#enable-ssl) for years. And if you’re not an expert in Postgres security, it certainly sounds plausible that `sslmode=require` might do the right thing.

When you use `sslmode=require` you do, technically, get encryption: psql encrypts your connection to the server with TLS. And as part of this process, the server presents psql with a certificate.

But this certificate does not get you authentication. Because, perhaps a little surprisingly, `sslmode=require` instructs psql not to care _either_ whether the certificate has the server’s name on it _or_ whether it was signed by any particular CA. Just about any certificate, self-signed by anyone, with any server’s name on it, will do.

This is a bad problem, because a connection that’s not authenticated is vulnerable to a pretty straightforward meddler-in-the-middle (MITM) attack that gives full access to your database.

<blockquote>
<p>Some years ago I was involved in a startup whose main API and database were hosted with a well-known platform-as-a-service (PaaS). The security issues with <code>sslmode=require</code> are nasty enough that they caused me to migrate us off this PaaS very shortly after confirming, a little incredulously, that <code>sslmode=require</code> <em>was</em> <em>the best security this PaaS could provide</em>.</p>
</blockquote>

### What’s all the fuss about authentication?

The problem is this. When you connect to your database, psql issues a DNS query to turn the server’s domain name into the server’s IP address. But a bad actor can use [DNS spoofing or cache poisoning](https://www.cloudflare.com/en-gb/learning/dns/dns-cache-poisoning/) to have some other IP address returned by the DNS query. This other IP address, of course, belongs to a machine running the bad actor’s software.

On receiving a spoofed DNS response containing the bad actor’s IP address, psql goes ahead and connects to the bad actor’s machine. Next, it negotiates TLS encryption, but without checking the certificate the bad actor’s server presents (as discussed, `sslmode=require` means the client doesn’t authenticate the server). Then it sends a startup message, and waits for the bad actor’s server to ask it to authenticate as a client.

Postgres has [several methods](https://www.postgresql.org/docs/current/auth-password.html) for authenticating a client using a password. But you can be pretty sure the bad actor’s machine will simply ask psql to hand over its password in cleartext, and psql will cheerfully oblige.

The bad actor now has free access to your database. They might begin by running, say, `pg_dumpall`, or `DROP DATABASE main`.

<blockquote>
<p>If the bad actor did run <code>DROP DATABASE main</code>, you might be happy to hear about Neon’s <a href="https://neon.tech/docs/guides/branching-pitr">point-in-time restore</a> functionality, but that’s not really the point here.</p>
</blockquote>

Perhaps you’re now saying: “But _a-ha_! _My_ Postgres server uses [SCRAM-SHA-256](https://www.postgresql.org/docs/current/auth-password.html#AUTH-PASSWORD) to authenticate me as a user. This is a challenge-response scheme, so my password never gets sent over the network. Therefore the worst that can happen is that the bad actor gets to forward on and observe this particular Postgres session”.

Well, it’s bad news, I’m afraid. Neon uses SCRAM-SHA-256 too, but SCRAM-SHA-256 will only help you if you remembered to specify `require_auth=scram-sha-256` for your connection. Since the `require_auth` option is also new as of Postgres 16, and not yet widely trailed, that seems pretty unlikely.

If you didn’t specify a `require_auth` method, then psql lets the server call the shots. So it doesn’t matter that _your_ database wouldn’t have asked for a cleartext password. If the bad actor’s machine asks for a cleartext password, that’s what psql will give it, and BOOM: game over.

Given the right circumstances, DNS-spoofing MITM attacks of this sort really aren’t very difficult. They’re easily [within reach](<https://owasp.org/www-pdf-archive/DNS_Cache_Poisoning(OWASP_GHANA).pdf>) of a competent command-line user on the same local network.

> To check that this claim stands up, I tried mounting a DNS spoofing attack on myself. I’m not a networking or security expert, and it took me less than an hour — including the necessary research into network tools like [bettercap](https://www.bettercap.org/) — to make a domain of my choice resolve to an IP address of my choice on a PC elsewhere on my home network.
>
> Spurred on by this success, I decided to try the actual MITM attack too. I spent about an hour writing a short Ruby script using the `openssl` gem. This poses as a TLS-enabled Postgres server in order to request the client’s cleartext password. I spent roughly a further hour making the script then connect to the real server and proxy all subsequent communication, so that the MITM victim sees nothing out of the ordinary. The final script is under 100 lines of code.
>
> I generated a self-signed certificate, ran the script, and arranged for the target machine to resolve `*.eu-central-1.aws.neon.tech` to the IP address of the machine the script was running on.
>
> On the spoofing target machine, connecting to and querying my database with `sslmode=require` appeared to work perfectly normally. But, over on the attacker machine, bettercap had logged the following:
>
> ```bash
> george@attacker postgres-dns-spoof % ./pg-poser.rb
> listening ...
> got SSLRequest message
> TLS connection established with client
>   name via SNI: ep-long-grass-595339.eu-central-1.aws.neon.tech
> got startup message
>   user: george
>   database: main
>   application_name: psql
>   client_encoding: WIN1252
> requested cleartext password authentication
> authentication message received
>   password: MQZIQzlnIe11
> sending SSLRequest to server
> [...]
> ```
>
> The log continues by displaying every byte transmitted between client and server. All in all, this was worryingly straightforward, and only a short morning’s work.

### Doing it right

The solution to all this nastiness, as you probably guessed, is to ensure that your psql connection uses both encryption **and** authentication.

_Before version 16,_ that meant (a) providing psql with one or more trusted CA certificates for it to verify against using the `sslrootcert` option (or a file at `~/.postgresql/root.crt`), and (b) telling it to actually check it, using `sslmode=verify-full`.

To make that work with Neon from a Mac looks something like this:

```bash
psql "postgres://user:pass@endpoint.neon.tech/main?sslmode=verify-full&sslrootcert=/etc/ssl/cert.pem"
```

On Linux distributions, you alter the sslrootcert location: [see our docs](https://neon.tech/docs/connect/connect-securely). On Windows, you download [a root cert bundle](https://curl.se/docs/caextract.html) and point `sslrootcert` to that.

If you’re using a psql version below 16, that’s how you should connect. It’s fine, but it’s pretty verbose and not so easy to remember (where are those SSL certs again?).

The new `sslrootcert=system` option in psql 16 provides a nice, easy shortcut for this behavior. Rather than you having to provide psql with trusted CA certificates, `sslrootcert=system` instructs psql _both_ to use the trusted CA certificates built into your OS as root certs _and_ to do proper authentication via `sslmode=verify-full`.

As a reminder, on all platforms, it looks like this:

```bash
psql "postgres://user:pass@endpoint.neon.tech/main?sslrootcert=system"
```

As expected, this breaks my proof-of-concept MITM attack. Using psql with `sslmode=verify-full` from my DNS-spoofing target machine gets me:

`psql: error: connection to server at "ep-long-grass-595339.eu-central-1.aws.neon.tech" (192.168.1.119), port 5432 failed: SSL error: certificate verify failed`

<blockquote>
<p>Note: at the time of writing there appears to be a problem with the EnterpriseDB Postgres 16 builds for Windows, such that using <code>sslrootcert=system</code> always results in the message <code>SSL error: unregistered scheme</code>. I’ve reported this: let’s hope it’s fixed soon.</p>
</blockquote>

To insure yourself against errors or omissions, it’s probably also a good idea to change the insecure libpq defaults by setting the following values in `.bash_profile`, `.zprofile`, or wherever you define your environment variables:

```bash
export PGSSLROOTCERT=system   # or a root cert file for psql <16
export PGSSLMODE=verify-full  # in case psql <16 is used
export PGREQUIREAUTH=scram-sha-256
```

Then the only way you’ll get a connection that’s vulnerable to MITM attacks is if you specifically ask for one.

Lastly, if you’re connecting to Postgres using other clients or libraries — e.g. from a web server or API — make sure you know how to specify at least an equivalent level of security to `sslrootcert=system`. For example, in JavaScript, I’m pleased to report that the [node-postgres TLS implementation](https://node-postgres.com/features/ssl) defaults to `sslrootcert=system` behavior unless you explicitly specify the option `rejectUnauthorized=false`.
