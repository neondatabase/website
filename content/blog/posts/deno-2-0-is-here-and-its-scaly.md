---
title: 'Deno 2.0 Is Here, and It’s Scaly'
description: Offering backward compatibility with Node.js and npm
excerpt: >-
  Deno is now six years old. Built by Node.js creator Ryan Dahl to address what
  he saw as the mistakes of Node, the motivation behind Deno was simple. Node.js
  was too complex, too insecure, and had drifted away from JavaScript in how it
  worked. Deno would align with ECMAScript and...
date: '2024-10-15T16:00:19'
updatedOn: '2024-10-15T16:00:22'
category: community
categories:
  - community
authors:
  - andrew-tate
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/deno-2-0-is-here-and-its-scaly/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Deno 2.0 Is Here, and It’s Scaly - Neon'
  description: >-
    Deno 2.0 brings Node.js and npm compatibility directly into Deno: developers
    can keep using their favorites libraries and frameworks.
  keywords: []
  noindex: false
  ogTitle: 'Deno 2.0 Is Here, and It’s Scaly - Neon'
  ogDescription: >-
    Deno 2.0 brings Node.js and npm compatibility directly into Deno: developers
    can keep using their favorites libraries and frameworks.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/deno-2-0-is-here-and-its-scaly/cover.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/deno-2-0-is-here-and-its-scaly/neon-deno-1-1024x576-71147cfe.jpg)

Deno is now six years old. Built by Node.js creator Ryan Dahl to address what he saw as the mistakes of Node, the motivation behind Deno was simple. Node.js was too complex, too insecure, and had drifted away from JavaScript in how it worked. Deno would align with ECMAScript and be secure and simple by default.

By this definition, Deno has been an enormous success. But, it has struggled to gain widespread adoption in the JavaScript ecosystem. Despite its improvements over Node.js in terms of security and simplicity, developers and companies have remained hesitant to switch from the well-established Node.js environment where their entire code lives, especially without any compatibility between the two ecosystems.

That is changing with [Deno 2.0](https://deno.com/blog/v2.0-release-candidate). Deno 2.0 brings Node.js and npm compatibility directly into Deno, meaning developers can take advantage of the advances Deno has made within JS while still using the libraries and frameworks they’ve used for the past 15 years.

## Deno 1: Simple & Modern

If you’re using Node.js to connect to Neon, you might write something like this:

```javascript
const { Client } = require("pg");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
 console.error("DATABASE_URL environment variable is not set");
 process.exit(1);
}

const client = new Client({
 connectionString: databaseUrl,
});

async function main() {
 try {
   await client.connect();

   const result = await client.query(
     "SELECT name, value FROM playing_with_neon LIMIT 5"
   );

   console.log("result:", result.rows);
 } catch (error) {
   console.error("An error occurred:", error);
 } finally {
   await client.end();
 }
}

main();
```

You then run it with:

```bash
node index.js
```

Node.js relies on npm and package.json for dependency management, which means as soon as you npm install a package, you get all this in your directory:

![Image](https://cdn.neonapi.io/public/images/pages/blog/deno-2-0-is-here-and-its-scaly/ad4nxc3vkobzcymlgtmlt2gsfs29hi1d9z42scw73bl1ovhzbf8s36kotyam19bc6weybvemmqlv34u2yq084a-o5cbanjrxu1m2qnbd4xv14-2u618llcwz3ujrccchawervmfldpuwb9vtonntvfteiemq-32175ead.png)

Bear in mind we only installed the pg package–that’s it. A core difference between Node and Deno was these imports. In Deno 1.x, the code would have been similar because it is still JavaScript/TypeScript, but the import totally different:

```javascript
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const databaseUrl = Deno.env.get("DATABASE_URL");
if (!databaseUrl) {
 console.error("DATABASE_URL environment variable is not set");
 Deno.exit(1);
}

const client = new Client(databaseUrl);

async function main() {
 try {
   await client.connect();

   const result = await client.queryObject<{ id: number; name: string }>(
     "SELECT name, value FROM playing_with_neon LIMIT 5"
   );

   console.log("result:", result.rows);
 } catch (error) {
   console.error("An error occurred:", error);
 } finally {
   await client.end();
 }
}

main();
```

Deno 1.x uses direct URL imports, eliminating the need for a package manager. All that is in your directory is your code. This approach to dependency management significantly simplifies the process. No installs, no package.json, no node_modules folder. Dependencies are fetched and cached on the first run, ensuring that your project remains lightweight and portable.

This streamlined approach offers several advantages:

1. **Reduced project complexity**: Without the need for a package.json file or a node_modules folder, project structure remains clean and straightforward.
2. **Improved portability**: Since dependencies are specified directly in the code, sharing projects becomes easier. Anyone can run your code without first installing dependencies.
3. **Version locking**: URL imports can include specific versions (e.g. the code above is locked to version 0.17), ensuring consistency across different environments.
4. **Better security**: Deno downloads and caches dependencies on the first run, then checks integrity on subsequent runs, reducing the risk of supply chain attacks.
5. **Faster startup**: With no installation step, projects can be run immediately, speeding up development and deployment processes.
6. **Explicit dependencies**: Each file lists its own dependencies, making it clear what’s being used where.

How you run the file looks different as well:

```bash
deno run --allow-net --allow-env index.ts
```

This is a factor of Deno’s security model. Node.js grants full system access by default. This means that every file you run has complete access to the file system and complete access to the network. Mostly OK, until a file you run contains malicious code or a vulnerability is exploited.

By default, Deno scripts have no system access. You must explicitly grant permissions when running the script to perform operations like network requests or file system access. This is what the –allow-net and –allow-env flags do in the example command. We need to access Neon over the network and access the DATABASE_URL environment variable, so we set those two flags. But if we wanted to write the output to a CSV, we couldn’t do that with the above command–we’d also need –allow-write.

This granular permission system offers several benefits:

1. **Enhanced security**: It limits the potential damage from malicious code or compromised dependencies.
2. **Transparency**: Developers and users can easily see what permissions a script requires.
3. **Least privilege principle**: Scripts only get the permissions they need to function.
4. **Easier auditing**: The required permissions can serve as a quick indicator of a script’s behavior.

These are only a couple of the Deno differences. Deno also provides a different set of APIs (e.g., Deno.env.get(), Deno.exit()), more closely aligned with browser APIs, and supports TypeScript out of the box (e.g. queryObject&lt;\{ id: number; name: string \}&gt;). Deno also provides built-in tooling for testing, formatting, and bundling, reducing the need for external tools and configuration.

All of these are excellent choices to move the JS/TS/ECMAS ecosystem forward. But as well-designed, performant, and simple as Deno is, developers continue to use Node.js–that’s where their code is, and the libraries frameworks they use are. Node.js has had twice as long to build up a robust ecosystem, and for all its faults developers want to use it. So when the mountain won’t come to you, you must go to the mountain.

## Deno 2: Scale & Stability

This is what it says in the [Deno 1.x to 2.x migration guide](https://docs.deno.com/runtime/reference/migration_guide/):

<blockquote>
<p><em>While we’ve accomplished a ton in Deno 1.x, the next major version is focused on using Deno </em><strong><em>at scale</em></strong><em>. This means seamless interoperability with Node.js and npm JavaScript infrastructure and supporting a wider range of projects and development teams, all without sacrificing the simplicity, security, and “batteries included” nature that developers love.</em></p>
</blockquote>

<br />This is the crux of Deno 2.0–keep what works while allowing developers to use Deno better to scale. At its core, that means two things.

### Node.js and npm compatibility

Deno stabilized npm support with the npm: specifier in [Deno 1.28](https://deno.com/blog/v1.28). Since then, they have gradually improved Node.js and npm support throughout the runtime. Deno 2.0 provides backward [compatibility with Node.js and npm](https://docs.deno.com/runtime/fundamentals/node/):

1. **Node.js Built-in Modules**: Deno now supports most Node.js built-in modules, which can be imported using the `node: prefix`. For example, `import * as os from "node:os";`.
2. **CommonJS Support**: Deno 2.0 improves CommonJS support, allowing developers to execute CommonJS files directly with the `.cjs` extension. Developers can import CommonJS modules in ES modules using `import` statements or use `require()` to import ES modules (as long as they don’t use top-level await).
3. **npm Packages**: Developers can use npm packages directly in Deno using the `npm: specifier`, making leveraging the vast npm ecosystem easier.
4. **package.json and node_modules**: Deno 2.0 understands `package.json` files and can work with `node_modules` directories, facilitating easier migration of existing Node.js projects.
5. **Global Variables**: Deno 2.0 introduces the process global variable widely used in Node.js applications and frameworks.

If we revisit our examples from above, we can port our Node.js example to Deno. In fact, all we have to do for that is:

1. Run `deno install` in the directory to read the package.json
2. Change the file extension to `.cjs` as the code includes a CommonJS module
3. Run `deno run  --allow-net --allow-env --allow-read node_index.cjs` with the additional `--allow-read` flag so Deno can read the `node_modules`

Alternatively, we can change the Deno code to use the npm version of the Postgres library. We change our import to:

```javascript
import pg from "npm:pg";
const { Client } = pg;
```

Then, we also have to change the query call itself as the pg library doesn’t support `queryObject`:

```javascript
const result = await client.query(
     "SELECT name, value FROM playing_with_neon LIMIT 5"
   );
```

With these trivial examples, you can already see the compatibility between Deno and Node. But this is really all about a better developer experience for serious developers who need to scale their projects. With these Node.js compatibility improvements, Deno 2.0 starts to support the Node.js frameworks almost all developers now use, like Next.js, SvelteKit, Remix, and Nuxt. You should be able to run deno task dev instead of npm run dev for the same result.

This all allows the gradual migration of existing Node.js projects to Deno while allowing developers to use familiar Node.js tools and libraries within Deno projects. Importantly, the flip is also true–Node developers can leverage Deno’s security features, tooling, DX, and modern JavaScript support while maintaining access to the npm ecosystem.

### Deno LTS

Another critical part of Deno 2.0 that matters in terms of making Deno a viable solution for large builds is [long-term support](https://docs.deno.com/runtime/fundamentals/stability_and_releases/). Starting with v2.1.0, Deno will provide an LTS channel with six months of support for bug fixes and critical performance improvements.

![Image](https://cdn.neonapi.io/public/images/pages/blog/deno-2-0-is-here-and-its-scaly/ad4nxecnvpx-qizdhrjzo2pgs37xr-iqqkzkspeflbccuge20nzsocmwfken2ea0wsokhh3hdue3pwmtgcfha9xv-nkwkxl2rwbl58u5c9rdj4ly-2lyl1-kvg99vww0kc4601klnefvi-5y3-ugr3r0k1s-487891e5.png)

LTS channels are important because they provide stability and predictability for large-scale projects and enterprises. Organizations can rely on these versions to remain consistent over an extended period, reducing the risk of unexpected behavior changes that could break their applications. Organizations can plan their upgrade cycles more effectively with a defined support period. This is especially important for large projects where upgrades must be carefully scheduled and tested.

Due to internal policies or compliance requirements, many enterprises require LTS versions for their production environments. Offering LTS makes Deno a more viable option for these organizations.

For the Deno ecosystem, this means:

1. Increased adoption in production environments
2. More confidence for businesses to invest in Deno-based projects
3. A clearer path for organizations transitioning from Node.js to Deno
4. Potential for more third-party tools and services to support Deno officially

Overall, the introduction of LTS in Deno 2.0 is a significant step towards making Deno a mature, scalable JavaScript runtime. It addresses one of the key concerns that larger organizations and projects might have had about adopting Deno, potentially accelerating its adoption in production environments alongside or as an alternative to Node.js.

## Scaly Denos

Did dinosaurs have scales? I’m not sure whether feathers or scales are the current thinking, but Deno definitely has scal..ability now.

This all might look like capitulation to the Node universe, and the arrival of the package.json and node_modules in an ostensibly Deno project might bring a [dinosaur tear](<https://equatorialminnesota.blogspot.com/p/blog-page_14.html#:~:text=Lacrimals%20(also%20lachrymals)%3A%20Known,of%20the%20orbits%20in%20dinosaurs.>) to Deno enthusiasts. But this is just about reality and, more importantly, building what developers want or need.

The Deno team has listened to the community and heard that while they love the simplclity, security, and performance of Deno, they still live and breathe Node, so need the crossover. Deno 2 gives them just that, allowing any developer to keep building in Node and start taking full advantage of the Deno world and slowly transitioning over.
