---
title: How to use NPM packages outside of Node
description: >-
  Learn how you can run NPM packages in other places — such as Vercel Edge
  Functions, or even web browsers — using a couple of simple techniques.
excerpt: >-
  npm is bursting with useful libraries. But many of them assume they’re running
  in Node.js, and throw errors elsewhere. Based on his experience developing
  Neon’s serverless driver, George shows how you can run NPM packages in other
  places — such as Vercel Edge Functions, or even w...
date: '2023-11-06T14:27:53'
updatedOn: '2024-03-01T14:26:09'
category: community
categories:
  - community
authors:
  - george-mackerron
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/using-npm-packages-outside-node/cover.jpg
  alt: 'Package with the NPM , and Node logos on it'
isFeatured: false
seo:
  title: How to use NPM packages outside of Node - Neon
  description: >-
    Learn how to run NPM packages in other places — such as Vercel Edge
    Functions, or even web browsers — using a couple of simple techniques.
  keywords: []
  noindex: false
  ogTitle: How to use NPM packages outside of Node - Neon
  ogDescription: >-
    Learn how to run NPM packages in other places — such as Vercel Edge
    Functions, or even web browsers — using a couple of simple techniques.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/using-npm-packages-outside-node/social.jpg
source:
  wpId: 3697
  wpSlug: using-npm-packages-outside-node
  exportedAt: '2026-03-20T13:31:00.745Z'
---

_npm is bursting with useful libraries. But many of them assume they’re running in Node.js, and throw errors elsewhere. Based on his experience developing Neon’s serverless driver, George shows how you can run NPM packages in other places — such as Vercel Edge Functions, or even web browsers — using a couple of simple techniques._

![Image](https://cdn.neonapi.io/public/images/pages/blog/using-npm-packages-outside-node/neon-npm-1-1-1024x576-3c29ceab.jpg)

npm has lots of useful JS packages. Many of them can be used both within Node.js and on other platforms, like Vercel Edge Functions, Cloudflare Workers, or (with the help of a bundler like esbuild or webpack) web browsers.

But some packages assume the presence of Node-specific features like `Buffer`, or built-in libraries such as `fs`, `path` or `net`. These packages can’t so easily be run elsewhere. This shouldn’t be a big surprise: npm is the _Node_ Package Manager, after all. But it can be an annoying roadblock.

This is a problem we faced at Neon: we wanted to make Postgres usable from serverless platforms like Vercel Edge Functions and Cloudflare Workers, but the existing Postgres driver packages all made use of Node-specific features.

> Some platforms make an effort to help you with this. For example, on Cloudflare Workers you can add a setting `node_compat = true` to `wrangler.toml`, which makes some effort to provide Node-specific functionality. But this can’t fix every issue, and it’s not available everywhere.

In this post, I describe some ways you can fix this problem for yourself, using examples from the development of our [serverless driver](https://github.com/neondatabase/serverless), `@neondatabase/serverless` on npm, which is adapted from the [node-postgres](https://node-postgres.com/) `pg` package.

All the solutions we’ll cover today have one thing in common: they all use the awesome [esbuild](https://esbuild.github.io/) to combine your JS files and dependencies into a single, runnable bundle.

## Third-party shims: imported objects

The simplest case is probably where a package uses Node-specific features that have to be specifically imported, and an equivalent third-party shim library is available. In our serverless driver, `events` (which provides `EventEmitter`) falls into this category.

In this case, all we have to do is `npm install events`. This [third-party package](https://www.npmjs.com/package/events) then gets used, instead of the built-in Node package that was originally intended, any time the events package is referenced via a `require` or `import`.

We bundle the code with:

```bash
npx esbuild src/index.ts --bundle
```

And this third-party events support gets included in the bundle.

## Third-party shims: global objects

Almost as simple is the situation where a package relies on a Node global object, such as `Buffer`, for which (again) there’s [a third-party shim library](https://www.npmjs.com/package/buffer).

In that case we do an `npm install` again — this time `npm install buffer` — but we also have to make sure the shimmed object is always available in the global scope. It turns out that esbuild has a special [`--inject`](https://esbuild.github.io/api/#inject) option to support this.

We create a new file, `shims.js`, with the following content:

```javascript
export const Buffer =
  typeof globalThis.Buffer === 'function' && typeof globalThis.Buffer.allocUnsafe === 'function' ?
    globalThis.Buffer :
    require('buffer/').Buffer;
```

Here, we’re checking whether there’s already a global `Buffer` constructor function and, if so, whether it has a static `allocUnsafe` function attached. The second test is necessary because some platforms offer a booby-trapped `Buffer` function that exists only to throw a ‘helpful’ error when you try to use it.

If both tests succeed (probably because we’re running in Node), we just export the built-in `Buffer` object. But if either test fails, we require and export the third-party shim `Buffer` object instead.

Finally, to make sure this object is present in the global scope for all the code we’re bundling, we add the `--inject` switch to our esbuild command:

```bash
npx esbuild src/index.ts --bundle --inject:shims.js
```

## Roll your own shims: global objects

We use this same trick to provide our own shims for some other Node built-ins. For example, `shims.js` in `@neondatabase/serverless` also contains the following implementation for `process.nextTick`:

```javascript
export let process = globalThis.process ?? {};
try { process.nextTick(() => void 0); }
catch (err) {
  // if we got here, nextTick is either not defined or booby-trapped to throw, so ...
  const resolve = Promise.resolve();
  process.nextTick = resolve.then.bind(resolve);
}
```

## Roll-your-own shims: stub packages

Another common issue is that a package imports a Node.js built-in library that isn’t critical to the package’s operation.

For example, the `pg` package depends on the `pgpass` package to read a password from `~/.pgpass`. Most of the time, you won’t need that functionality. But the `pgpass` package tries to import `fs` to read the file, and this causes bundling to fail if no `fs` package is available, whether or not you’ll ever use the feature.

Ordinarily, you might think of using esbuild’s [`--external`](https://esbuild.github.io/api/#external) option in this situation. That tells esbuild not to try to bundle a particular package, and instead to leave a `require` or `import` in the bundled code. This might work here. On the other hand, depending on how these `require` or `import` statements appear in the bundled source, cloud platforms may throw errors at upload time when packages referenced this way are not available.

For maximum portability, you can instead create a stub `fs` package. This could be fully empty, or it could implement some stub functions that throw informative errors if ever they’re called.

A stub package consists of a folder containing a `package.json` file and a JS (or TS) file. For example, in our `@neondatabase/serverless` package, there’s a stub `fs` package in `shims/fs`.

Our `shims/fs/package.json` looks like this:

```javascript
{
  "name": "fs",
  "version": "0.1.0",
  "description": "Filesystem shim package",
  "type": "module",
  "main": "index.ts",
  "author": "George MacKerron",
  "license": "ISC"
}
```

And `shims/fs/index.ts` goes like this:

```javascript
// this gets used in trying to read ~/.pgpass
export function stat(file: string, cb: (err: Error, stat?: any) => void) {
  cb(new Error('No filesystem'));
}
```

Finally, to ensure that this stub package is picked up, we add it as a [local-path `file:` package](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#local-paths) to the overall `package.json` dependencies, like so:

```javascript
{
  …
  "dependencies": {
    "fs": "file:shims/fs",
    …
  }
}
```

This will now be picked up and bundled by esbuild.

## Roll-your-own shims: simple packages

Of course, sometimes a Node built-in object or package really is critical to the package you’re trying to import. Happily, it’s then often quite straightforward to reimplement or translate the functionality for use elsewhere.

A couple of examples here, again from bundling pg as `@neondatabase/serverless`, are `StringDecoder` and `url.parse`.

[`StringDecoder`](https://nodejs.org/api/string_decoder.html) can be [reimplemented in 12 lines of code](https://github.com/neondatabase/serverless/blob/main/shims/string_decoder/index.ts) using [`TextDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder).

And a sufficient approximation of [`url.parse()`](https://nodejs.org/api/url.html#urlparseurlstring-parsequerystring-slashesdenotehost) can be [reimplemented in 10 lines of code](https://github.com/neondatabase/serverless/blob/main/shims/url/index.ts) using [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL).

Again, these simple package implementations are added as local-path `file:` packages in your overall `package.json` dependencies.

## Roll-your-own shims: complex packages

At other times, shimming a native Node feature might not be dead simple, but it might be crucial to your package’s existence. For instance, our `@neondatabase/serverless` package exists to let you communicate with Postgres even where TCP connections via `net.Socket` are not available.

We achieve this by re-implementing key parts of `net.Socket` (and `tls`) using WebSockets as the underlying transport. The principle is exactly the same as for `StringDecoder` or `url.parse()` above, only [the implementation](https://github.com/neondatabase/serverless/blob/main/shims/net/index.ts) is a little bit more involved.

## Package masquerading

Lastly, here’s a trick you can use if you want to substitute one package for another in a third-party package’s dependencies.

I’ve used this to make my [Zapatos](https://jawj.github.io/zapatos/) package, which normally depends on `pg`, depend on `@neondatabase/serverless` instead.

To make this work, we create a local-path `file:` package, as in previous examples. We name this local-path package after the package we’re masquerading as, and in it we simply export the alternative package.

So we have a `shims/pg` folder with a single-line `index.js` file:

```bash
module.exports = require('@neondatabase/serverless');
```

A single-line `index.mjs` file:

```bash
export * from '@neondatabase/serverless';
```

And a `package.json` file that declares this to be a package called `pg`:

```bash
{
  "name": "pg",
  "version": "8.8.0",
  "description": "Provides @neondatabase/serverless in place of pg",
  "exports": {
    "require": "./index.js",
    "import": "./index.mjs"
  },
  "author": "George MacKerron",
  "license": "ISC"
}
```

As before, to ensure that this package is picked up, we add it as a [local-path `file:` package](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#local-paths) to the overall `package.json` dependencies:

```bash
{
  …
  "dependencies": {
    "pg": "file:shims/pg",
    …
  }
}
```

You can see all this in action in [an example repo](https://github.com/neondatabase/neon-vercel-zapatos).

That about wraps it up. I hope these techniques are useful to you, and I wish you luck in running JavaScript packages anywhere and everywhere: not just in Node, but in browsers, serverless platforms, and beyond.
