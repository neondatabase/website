---
title: Wrapping My Mind Around Node.js Runtimes
description: A look at Deno and Bun and how they work differently from Node.js
excerpt: >-
  There’s been a lot of innovation in the last few years in Node.js runtimes.
  Node.js used to be the only viable option, but now there’s other contenders
  such as Bun and Deno. But are they ready for prime time? When should they be
  used, and by whom? Wait, what even is a JavaScript...
date: '2024-09-18T16:20:41'
updatedOn: '2024-09-20T14:58:43'
category: community
categories:
  - community
authors:
  - david-gomes
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/wrapping-my-mind-around-node-js-runtimes/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Wrapping My Mind Around Node.js Runtimes - Neon
  description: >-
    Node.js has new contenders: Bun and Deno. Are these runtimes ready for prime
    time? When should they be used, and by whom?
  keywords: []
  noindex: false
  ogTitle: Wrapping My Mind Around Node.js Runtimes - Neon
  ogDescription: >-
    Node.js has new contenders: Bun and Deno. Are these runtimes ready for prime
    time? When should they be used, and by whom?
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/wrapping-my-mind-around-node-js-runtimes/social.jpg
source:
  wpId: 7059
  wpSlug: wrapping-my-mind-around-node-js-runtimes
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/wrapping-my-mind-around-node-js-runtimes/neon-nodejs-1-1024x576-dc213882.jpg)

There’s been a lot of innovation in the last few years in Node.js runtimes. Node.js used to be the only viable option, but now there’s other contenders such as Bun and Deno. But are they ready for prime time? When should they be used, and by whom?

## Wait, what even is a JavaScript runtime?

Good question. JavaScript wasn’t really built for the server. In fact, JavaScript wasn’t really “built” at all. What we think of as JS is just a specification.

A runtime is what brings that specification to life. It’s the environment that executes JavaScript code. When you’re working in a browser, the browser provides the runtime. But on a server, you need something else. That’s where Node.js came in and where these new runtimes are shaking things up.

A JavaScript runtime typically consists of several key components:

- **JavaScript Engine**. This is the core that interprets and executes JavaScript code. V8 (used by Node.js and Chrome) is a famous example.
- **Event loop**. Manages asynchronous operations, allowing non-blocking I/O operations.
- **APIs**. Provides interfaces for system-level operations like file I/O, networking, and timers.
- **Standard library**. A set of built-in modules and functions that developers can use out of the box.

Node’s ability to handle thousands of concurrent connections with its non-blocking I/O model has made it particularly popular for real-time applications, APIs, and microservices architectures. And it is still the most popular “web technology” according to the [2024 Stack Overflow survey](https://survey.stackoverflow.co/2024):

![Image](https://cdn.neonapi.io/public/images/pages/blog/wrapping-my-mind-around-node-js-runtimes/ad4nxd5mt9bnjpefkqlqtiywmsyt2evzqbdaal7lsp-4grtkptpzananel5bl8avpvqx1w7nr0dioeus4xtnt7icfigfthvtwzod6usfdtfqpn8dr9jonu5bdiwfiepndnyqn6kxwzpacudbxb-jhyziuvz-ea5fcd7e.png)

## <br />The problems with Node.js

But Node is not without its detractors—including the person who initially built Node, [Ryan Dahl.](https://x.com/rough__sea) In a 2019 jsconf talk titled [10 Things I Regret About Node.js](https://www.youtube.com/watch?v=M3BM9TB-8yA), Dahl lists the problems he now sees in Node, such as…

- **Security.** By default, the module system in Node.js allows any package to access the file system, network, and environment variables. This poses significant security risks, especially when using third-party modules.
- **Package management**. The package.json file, npm, and the Node modules system have become overly complex. There’s also various security issues around npm (like [the postinstall scripts](https://stacklok.com/blog/how-npm-install-scripts-can-be-weaponized-a-real-life-example-of-a-harmful-npm-package)).
- **Build system complexity**. Node’s build system, particularly for native modules, has become unnecessarily complicated over time. Basically, supporting both CommonJS and ES modules made Node.js much more complex.

So, all this together has led a few people to think they can do better.

## The new runtimes in town

### Deno: Security-oriented, modern JavaScript

Ryan Dahl chose to take the learnings from Node and built [Deno](https://deno.com/). Deno addresses many of the concerns he had with Node.js:

- **Focus on security**. Deno runs code in a sandbox by default. Accessing the file system, network, or environment variables requires explicit permissions. This approach significantly reduces the risk of malicious code execution.
- **Built-in TypeScript support**. Unlike Node.js, which requires additional setup for TypeScript, Deno supports TypeScript out of the box. This integration streamlines development and improves code quality.
- **Standard modules**. Deno provides a standard library of high-quality, audited modules. This reduces dependency on third-party packages for common functionalities.
- **Browser compatibility**. Deno aims to be as close as possible to browser JavaScript. It uses web standard APIs where possible, making it easier for developers to write code that works both in the browser and on the server.
- **Import URLs**. Instead of using a package manager like npm, Deno allows modules to be imported directly via URLs.
  - This will somewhat change with Deno v2, more on this later.
- **Single executable**. Deno ships as a single executable with no external dependencies, making it easy to install and use across different environments.

Deno is gaining traction, especially among developers who appreciate its modern features and security-first approach. It’s particularly attractive for projects that can benefit from its TypeScript integration and don’t rely heavily on Node-specific libraries.

Deno also provides infrastructure beyond the runtime. Tests, linters, and formatters are also included. You can also deploy your applications using Deno’s serverless environment, Deno Deploy (learn [how to use Neon with Deno Deploy](https://neon.tech/docs/guides/deno)), and build entire applications using Deno’s framework, [Fresh](https://fresh.deno.dev/).

Here’s a simple setup with Deno to use Neon. The Deno-specific things are the import (@neon/serverless is called @neondatabase/serverless in NPM) and the `Deno.env.get` bits. Also, this is a Deno v2 example (which is currently in “canary”).

```javascript
import { neon } from "@neon/serverless";

// Get the connection string from the environment variable "DATABASE_URL"
const databaseUrl = Deno.env.get("DATABASE_URL")!;

if (!databaseUrl) {
  throw new Error(`Please add a DATABASE_URL environment variable.`);
}

const sql = neon(databaseUrl);

const rows = await sql`SELECT version()`;

console.log(rows[0].version);
```

To run this, call:

```javascript
DATABASE_URL=$DATABASE_URL deno test.ts
```

(And notice how Deno will ask for permission to read environment variables and make network requests [at runtime](https://docs.deno.com/runtime/fundamentals/security/).)

To show the speed of progress with Deno, up until a few months ago, the above code would have used an import URL, such as:

```javascript
import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
```

Deno just released version [1.46](https://deno.com/blog/v1.46), which will be the last 1.X version. Deno 2 is changing in response to feedback from the community and a greater understanding of the initial strict choices of the runtime.

Take imports. Originally the idea was to have simple URLs like [https://deno.land/x/postgres@v0.17.0/mod.ts](https://deno.land/x/postgres@v0.17.0/mod.ts). As Deno put it:

> _Designing Deno’s module system around HTTP imports was ambitious. It aimed to replace npm with a distributed system over HTTP, aligning with how ES Modules work in browsers. This eliminated the need for package.json files and node_modules folders, simplifying project structures._<br />

But the reality wasn’t as clean. Deno found that dependency management, clutter, and reliability were all a problem with this approach. So, they’ve launched [JSR](https://jsr.io/), the JavaScript Registry. This is akin to npm in node, but TypeScript and ECMAScript-native. All you have to do is:

```javascript
deno add @neon/serverless
```

Then you’re ready to roll.

Like Node.js, Deno is built on the V8 engine. Originally, Deno wasn’t supposed to be compatible with Node.js. But, as with import URLs, pragmatism beat out idealism. The Deno team realized that compatibility with the vast Node.js ecosystem would significantly increase Deno’s adoption and usefulness. As a result, they’ve been working on Node.js compatibility layers, allowing developers to use many Node.js packages and APIs within Deno projects, thereby bridging the gap between the two runtimes.

If you want to learn more, I highly recommend [the recent participation of Ryan Dahl on the “Syntax” podcast](https://www.youtube.com/watch?v=tZBCq8Ijkgw) to learn more about Deno v2.

### Bun: A performance-focused Node replacement

[Bun](https://bun.sh/) is a little different. It was Node-compatible out of the gate and not looking to right-the-wrongs of Node.js. But, as it grew, it started to evolve towards a slightly different direction.

![Image](https://cdn.neonapi.io/public/images/pages/blog/wrapping-my-mind-around-node-js-runtimes/ad4nxcngdop4xjremr7l2v6oa2bzqtr2oxueugzzsfx4i8bqr0facu-mayawawxd7edw3wuf0oyy5e3uvp8ze4zamsygnxsbcr4edi41gqet3ziqks7hb8eyo2tawh4gn4aqslhqf5mnc3avgftrevkeqx0-e15dce3f.png)

Benchmarking is hard. We at Neon are definitely very well aware of that, but my anecdotal experience is that Bun is indeed really fast. How fast exactly is very hard to measure, of course.

Like Deno, Bun is looking to rely on JavaScript primitives and code simplicity. Here’s [Neon running with Bun](https://github.com/neondatabase/examples/tree/main/with-bun):

```javascript
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(`Please add a DATABASE_URL environment variable.`);
}

const sql = neon(databaseUrl);

const rows = await sql`SELECT version()`;

console.log(rows[0].version);
```

To call this, run:

```javascript
DATABASE_URL=$DATABASE_URL bun test.ts
```

Bun’s approach to improving the JavaScript runtime environment focuses on several key areas:

- **Performance**. Built on the JavaScriptCore engine (used by Safari), Bun is designed for speed from the ground up. Its fast startup times and efficient execution make it particularly suitable for serverless environments and microservices.
- **TypeScript support**. Similar to Deno, Bun offers out-of-the-box TypeScript support. However, Bun takes it a step further by transpiling TypeScript at runtime, eliminating the need for separate build steps in many cases.
- **Enhanced APIs**. Bun provides additional APIs that aren’t available in Node.js, such as the Bun.file API for efficient file operations and the SQLite API for built-in database functionality.
- **Streamlined configuration**. Bun aims to reduce configuration overhead. For instance, it automatically loads environment variables from .env files, simplifying local development and deployment processes.
- **All-in-one toolkit**. Bun isn’t just a runtime; it’s a complete toolkit. It includes a package manager, test runner (which [Node.js now has as well](https://nodejs.org/api/test.html)), and bundler, all optimized for performance. This integrated approach simplifies the development workflow and reduces the need for additional tools.

The Bun team is rapidly iterating and adding some interesting features. For example, they introduced “[hot module reloading](https://bun.sh/guides/http/hot)” for server-side code, a feature that’s been long desired in the Node.js ecosystem. Also, more recently, they added support for [C code using TinyCC](https://x.com/jarredsumner/status/1825113318539006402) 🤯And I believe they led the way with [SQLite embedding](https://bun.sh/docs/api/sqlite) (but [Node.js has now caught up](https://node.js/)).

While Bun is still young compared to Node.js and even Deno, its focus on performance and developer experience is attracting attention. It is particularly appealing for projects where raw speed is a priority, such as high-traffic web servers or compute-intensive apps.

Furthermore, it’s also extremely appealing to use Bun not as your production runtime, but just as your package manager. We’re currently doing that with [neonctl](https://github.com/neondatabase/neonctl), purely because of Bun’s performance (we also want to migrate the CLI runtime to Bun at some point, due to its [single-file executable feature](https://bun.sh/docs/bundler/executables) and overall performance).

## Final thoughts

First of all, I have to mention that there are a few other runtimes that are probably worth mentioning. Although, perhaps it’d be better to refer to some of them as “neo-runtimes” since they’re not necessarily full blown runtimes:

- [https://github.com/saghul/txiki.js/](https://github.com/saghul/txiki.js/)
- [https://github.com/cloudflare/workerd](https://github.com/cloudflare/workerd)

Then, there’s the aspect of picking a runtime. This is a very hard decision and obviously migrating existing projects is even harder. But this is my very personal current thought process:

- Use Node.js for anything that needs to live for really long, or doesn’t need Deno’s [security model](https://docs.deno.com/runtime/fundamentals/security/)
- Use Deno if you want extra security, or if you specifically want to use [Deno Deploy](https://deno.com/deploy).
  - Don’t use Deno if all you care about is not transpiling TypeScript. Node.js will support TypeScript soon enough.
- Use Bun if performance is the most important thing to you. Or, if you want to use some of Bun’s more “fun” features (Macros, embedded SQLite, etc.) and you don’t have a super critical requirement that your project outlives your time on Earth (Bun is afterall backed by a very early stage company).

That’s basically it, but I know this is all very subjective — do your own research! I really love Bun’s performance and I try to use Bun for all package management on my local machine. However, I would only use Bun as a production runtime under certain circumstances for now.

If you’re looking for a more pessimistic take on new runtimes, I can recommend [this blog post](https://dev.to/thejaredwilcurt/bun-hype-how-we-learned-nothing-from-yarn-2n3j). But I tend to have a more positive outlook on new companies building cool new dev tooling.
