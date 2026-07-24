---
title: Edge-compatible Serverless Driver for Postgres
description: Postgres driver over WebSocket
excerpt: >-
  Serverless computing has a range of benefits. It means quick and simple
  deployments with no servers to manage or maintain. It means true scalability,
  serving a large demand without breaking a sweat if and when you get it. (On
  the other hand, it also means pay-per-use, so you don’...
date: '2022-12-08T14:27:10'
updatedOn: '2025-09-03T12:43:22'
category: engineering
categories:
  - engineering
authors:
  - george-mackerron
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/serverless-driver-for-postgres/cover.jpg
  alt: Post image
isFeatured: false
seo:
  title: Edge-compatible Serverless Driver for Postgres - Neon
  description: Postgres driver over WebSocket
  keywords: []
  noindex: false
  ogTitle: Edge-compatible Serverless Driver for Postgres - Neon
  ogDescription: >-
    Serverless computing has a range of benefits. It means quick and simple
    deployments with no servers to manage or maintain. It means true
    scalability, serving a large demand without breaking a sweat if and when you
    get it. (On the other hand, it also means pay-per-use, so you don’t end up
    out of pocket on […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/serverless-driver-for-postgres/social.png
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/serverless-driver-for-postgres/cover.jpg)

Serverless computing has a range of benefits. It means quick and simple deployments with no servers to manage or maintain. It means true scalability, serving a large demand without breaking a sweat if and when you get it. (On the other hand, it also means pay-per-use, so you don’t end up out of pocket on hosting costs if a very large demand never comes). Serverless typically also means low latency because your code runs near users.

At Neon, we offer serverless PostgreSQL, extending these benefits to the database. And it’s only natural that our users want to connect to their serverless Neon databases from serverless computing platforms.

But there’s a problem. PostgreSQL connections are made over TCP. And modern serverless platforms like Cloudflare Workers or Vercel Edge Functions — based on V8 isolates — generally don’t talk TCP. So until now, you had an unfortunate choice. _Serverless database or serverless compute: pick any one._

We’re happy to announce that we’re solving this problem and eliminating this unfortunate choice for our users. Now launched in beta, our serverless PostgreSQL driver, [@neondatabase/serverless](https://www.npmjs.com/package/@neondatabase/serverless), connects to Neon databases from Cloudflare Workers and other environments supporting WebSockets, such as web browsers.

We plan to extend and improve this driver in the coming weeks. In particular, we have a roadmap to reduce latency and support additional serverless platforms, including [Vercel’s Edge functions](https://vercel.com/docs/concepts/functions/edge-functions).

## How to use it

As [we’ve explained elsewhere](https://blog.cloudflare.com/neon-postgres-database-from-workers/), the `@neondatabase/serverless` driver is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular npm `pg` package you may already know. After going through our [getting started](https://neon.tech/docs/get-started-with-neon/signing-up/) process to set up a Neon database, you could create a minimal Cloudflare Worker to ask Postgres for the current time like so:<br />

1. **Create a new Worker** — Run `npx wrangler init neon-cf-demo` and accept all the defaults. Enter the new folder with `cd neon-cf-demo`.<br />
2. **Install our driver package** — Run `npm install @neondatabase/serverless`.<br />
3. **Set Postgres credentials** — For deployment, run `npx wrangler secret put DATABASE_URL` and paste in your connection string when prompted (you’ll find this in your Neon dashboard: something like `postgres://user:password@project-name-1234.region.aws.neon.tech/main`). For development, create a new file `.dev.vars` inside `neon-cf-demo` with the contents `DATABASE_URL=` and that same connection string.<br />
4. **Write the code** — Lastly, replace the generated `src/index.ts` with the following code:

```javascript
import { Client } from '@neondatabase/serverless';
interface Env { DATABASE_URL: string; }

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const client = new Client(env.DATABASE_URL);
    await client.connect();
    const { rows: [{ now }] } = await client.query('select now();');
    ctx.waitUntil(client.end());  // this doesn’t hold up the response

    return new Response(now);
  }
}
```

To try this locally, type `npm start`. To deploy it around the globe, type `npx wrangler publish`.

Go to the worker URL, and you should see a text response similar to `Wed Nov 23 2022 10:34:06 GMT+0000 (Coordinated Universal Time)`.

If the Worker hasn’t been run in a while, you may experience a few seconds of latency, as both Cloudflare and Neon will perform cold starts behind the scenes. Subsequent refreshes will be much quicker.

### Demo app

For an example with a bit more bite, [check out the source](https://github.com/neondatabase/serverless-cfworker-demo) for our [nearest UNESCO World Heritage sites app](https://places-neon-demo.pages.dev/). This uses IP geolocation in Cloudflare Workers and nearest-neighbor sorting in PostGIS.

![Demo app](https://cdn.neonapi.io/public/images/pages/blog/serverless-driver-for-postgres/demo-app-1024x822-faca4b3e.png)

How does this work? We take the coordinates supplied to our Cloudflare Worker in `request.cf.longitude` and `request.cf.latitude`. We then feed these coordinates to a SQL query that uses the [PostGIS distance operator `&lt;-&gt;`](https://postgis.net/docs/geometry_distance_knn.html) to order our results:

```javascript
const { rows } = await client.query(`
  select 
    id_no, name_en, category,
    st_makepoint($1, $2) <-> location as distance
  from whc_sites_2021
  order by distance limit 10`,
  [longitude, latitude]
);
```

Since we created a [spatial index](https://postgis.net/workshops/postgis-intro/indexing.html) on the location column, the query is blazing fast. The result (`rows`) looks like this:

```json
[{
  "id_no": 308,
  "name_en": "Yosemite National Park",
  "category": "Natural",
  "distance": 252970.14782223428
},
{
  "id_no": 134,
  "name_en": "Redwood National and State Parks",
  "category": "Natural",
  "distance": 416334.3926827573
},
/* … */
]
```

Finally, we get Cloudflare to cache these results at a slightly reduced geographical resolution — rounding to one-hundredth of a degree of longitude and latitude, or roughly 1km — so that repeat requests from nearby locations don’t even have to go to the database.

[Sign up to Neon](https://console.neon.tech/?invite=serverless) and try the `@neondatabase/serverless` driver from Cloudflare Workers.

## How it works

The basic premise is simple: our driver redirects the PostgreSQL wire protocol via a special proxy. Our driver connects from the edge function to the proxy over a WebSocket, telling the proxy which database host and port it wants to reach. The proxy opens a TCP connection to that host and port and relays traffic in both directions.

![How it works](https://cdn.neonapi.io/public/images/pages/blog/serverless-driver-for-postgres/how-it-works-1024x538-cc42e3d5.png)

This solution has a key advantage over some others, such as HTTP fetch-based drivers: you get a real, ordinary Postgres connection via a familiar, ordinary Postgres driver. That means you can have database [sessions](https://twitter.com/tobias_petry/status/1594652676666847232?s=20&t=RmJEG1qKA8wpvsHghNUmdA), including transactions spanning multiple queries with client-side logic in-between. It also means any existing code that assumes an ordinary Postgres connection should require little or no change.

### The proxy

Our [WebSocket-to-TCP proxy](https://github.com/neondatabase/wsproxy) is open-source and written in Go. It’s a simple traffic relay that can sit on any network and has no security requirements. It can, however, limit itself to particular TCP target domain names (in our case, database hosts), so as not to become an [open proxy](https://en.wikipedia.org/wiki/Open_proxy).

### The driver

Our driver library is based on [node-postgres](https://node-postgres.com/). We, therefore, have to provide [shims](https://github.com/neondatabase/serverless/tree/main/shims) for Node.js-specific libraries that V8 Isolates don’t have. These shims are listed as [local path `file:` packages](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#local-paths) in the `dependencies` section of npm’s `package.json` to ensure node-postgres can find them.

Crucially, we replace Node’s `net.Socket` with code that directs all network reads and writes via the WebSocket connection. But there are various smaller things to shim, too — for example, we replicate Node’s `[StringDecoder](https://nodejs.org/api/string_decoder.html)` using `[TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)`, and Node’s `[url.parse](https://nodejs.org/api/url.html#urlparseurlstring-parsequerystring-slashesdenotehost)` using the `[URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)` API.

Finally, we use [esbuild](https://esbuild.github.io/) to bundle everything into one easy-to-use npm package.

But what about security? The database driver would normally also call `tls.connect` to establish a secure TLS connection to PostgreSQL, but this is not available in V8 isolates.

There are several possible solutions here. For now, we’ve written a small [WolfSSL](https://www.wolfssl.com/)-linked C program that can set up a TLS connection and send and receive encrypted data and compiled it to WebAssembly with [emscripten](https://emscripten.org/) and [Asyncify](https://emscripten.org/docs/porting/asyncify.html). We then call into that WebAssembly code from our driver shims. For improved performance, we’ve also used WolfSSL’s [crypto callbacks](https://www.wolfssl.com/wolfcrypt-support-cryptographic-callbacks/) mechanism to outsource hashing and encryption to the implementations provided natively by the JavaScript [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) API.

This setup has the advantage of keeping things very simple on a conceptual (and deployment) level: we maintain a single end-to-end TLS-encrypted connection from the client to the database server via a very simple proxy.

On the other hand, different platforms have rather, unfortunately, incompatible ideas about how to load WebAssembly, and doing TLS in user space in WebAssembly is a relatively heavy and slow approach. We’re therefore likely to move in the near future to either a pure-JS [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)-based TLS solution and/or to a secure (wss://) WebSocket connection from the edge function to the proxy, plus some other means of securing the onward connection from the proxy to the database.

## Performance

An updated approach to TLS is one way we’re looking at improving performance — and a good reason to keep your `@neondatabase/serverless` driver up to date. What else have we done, and what more can we do? Both CPU time and latency are worth considering here.

### CPU time

Neon’s PostgreSQL servers use [SCRAM-SHA-256](https://www.postgresql.org/docs/current/auth-password.html) for user authentication when possible. This is a modern and secure authentication method. Part of its security comes from making brute-force password attacks relatively slow and expensive in CPU time (much the same as [Argon2, scrypt or PKBDF2](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)), by requiring repeated rounds of hash calculations.

The SCRAM-SHA-256 [RFC](https://www.rfc-editor.org/rfc/rfc7677#section-4) recommends that the number of hashing rounds be chosen such that a modern computer spends 100ms on them. In 2015, this was thought to be around 15,000 rounds, but because mobile devices are generally slower, PostgreSQL defaults to 4,096 and we stick with that.

You may already see a problem here. Edge functions establish a new database connection on each run, and we want that to be as quick as possible. Even worse, serverless providers typically limit the CPU time allocated to each run. For example, a Cloudflare Worker currently gets 10ms on the free plan or 50ms on the paid plan. 100ms of SCRAM calculations would use that up (and then some) before we even got started on making a query.

In the medium term, we may look at reducing the number of SCRAM rounds our servers demand. Since we generate all database passwords on our platform, we can in principle, do that without compromising security by increasing password length (and, therefore the size of the brute-force search space) simultaneously. For now, we instead fall back to cleartext authentication by automatically using our [Workaround D](https://neon.tech/docs/connect/connectivity-issues#d-specify-the-endpoint-id-in-the-password-field). This is OK since mandatory TLS secures our database connections and authenticates that the database server is really who it says it is.

(On a related note, earlier work by [Arthur](https://neon.tech/about-us/) on a driver based on deno-postgres uncovered SCRAM-related bugs [in both deno-postgres](https://github.com/denodrivers/postgres/pull/411) [and Deno itself](https://github.com/denodrivers/postgres/pull/411)).

### Latency

CPU requirements aside, latency in communicating with your database is principally a function of how many network round-trips have to be made, how many hops those round-trips have to traverse, and how long each of those hops takes.

As we noted up front, edge functions typically offer low latencies by running near end users. However, when edge functions are communicating with a single database instance, it’s generally more important for them to be run close to the database instance. That’s because we’d generally expect more network round trips made between the edge function and the database (via our proxy) than between the edge function and the end user.

Using a WebSocket proxy introduces an additional network hop here. Our proxy currently has a single instance deployed in the EU (Frankfurt). In the short- to medium term, we may deploy proxies in all regions.

<Admonition type="note">
The websocket proxy is now available in all regions as part of the main Neon connection proxy.
</Admonition>

In the longer term, we may also offer read replicas across regions.

We’ve already done some work to reduce the number of network round-trips required. For instance, early in the development of the serverless driver, we switched from [BearSSL](https://bearssl.org/) to WolfSSL to take advantage of WolfSSL’s support for TLS 1.3, which [requires fewer handshake messages](https://blog.cloudflare.com/tls-1-3-overview-and-q-and-a/) to be exchanged.

There are other enhancements we can make. For example, node-postgres begins a TLS connection by making an opening request and then waiting on the server to reply with an ‘S’ or an ‘N’ indicating that it respectively will or won’t support TLS. Since Neon’s servers all support TLS, we should be able to short-circuit that process.

## Please _do_ try this at home

Both our [serverless driver](https://github.com/neondatabase/serverless) and our [WebSocket proxy](https://github.com/neondatabase/wsproxy) are open source, and you can use them to make _any_ PostgreSQL database accessible over WebSockets. This has two steps.

First, you need to set up and run the proxy. You’ll need to configure the forwarding destinations to include your own database hosts using the environment variable `ALLOW_ADDR_REGEX` (see `main.go` in the repo). If you’re running it on your own machine for development purposes, you can leave this empty to allow all destinations, in which case the run command will look something like this: `LISTEN_PORT=:9876 ALLOW_ADDR_REGEX='' go run main.go`

Second, you’ll want to configure the driver to use your new proxy, and — if you don’t secure access to it via Let’s Encrypt, whose ISRG X1 root certificate is built-in — you’ll also need to provide it with an appropriate root certificate. That configuration process looks like this:

```javascript
import { Client, neonConfig } from '@neon/serverless';

// EITHER: single proxy
neonConfig.wsProxy = 'my-wsproxy.example.com';

// OR: e.g. to configure different proxies by region
neonConfig.wsProxy = (host) =>
host.match(/[.]eu [.]db [.]example [.]com$/)?
'my-wsproxy.eu.example.com':
'my-wsproxy.us.example.com';

neonConfig.rootCerts = /*in PEM format*/ `
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
...
-----END CERTIFICATE-----
`;
```

Please note that the library currently only supports TLS 1.3 connections to PostgreSQL.
