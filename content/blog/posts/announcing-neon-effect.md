---
title: "Announcing @neon/effect"
description: >-
  Effect 4 bindings for the Neon SDK, with typed errors, cancellable requests
  and Streams for paginated lists.
excerpt: >-
  @neon/effect brings the Neon SDK to Effect. Provision projects and branches,
  handle tagged errors and compose infrastructure workflows with retries,
  cancellation and timeouts.
date: '2026-10-01T12:00:00'
updatedOn: '2026-10-01T12:00:00'
category: product
categories:
  - product
authors:
  - andre-landgraf
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/announcing-neon-effect/cover.png'
  alt: >-
    Blog cover on a dark charcoal-to-navy dotted background with the Neon logo,
    the headline "Announcing @neon/effect for Effect 4" on white bars and a
    wireframe illustration of three stacked plates labeled "Effect.gen".
isFeatured: false
seo:
  title: "Announcing @neon/effect - Neon"
  description: >-
    Effect 4 bindings for the Neon SDK, with typed errors, cancellable requests
    and Streams for paginated lists.
  keywords: []
  noindex: false
  ogTitle: "Announcing @neon/effect - Neon"
  ogDescription: >-
    Effect 4 bindings for the Neon SDK, with typed errors, cancellable requests
    and Streams for paginated lists.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/announcing-neon-effect/cover.png'
---

On Wednesday, I joined the Effect team's meetup in San Francisco, where the Effect team launched Effect 4.0 live on stage ([post on X](https://x.com/andrelandgraf/status/2105474023287341382)). It's a big milestone for the team and community.

![Attendees sit on couches watching a presenter's terminal on a TV during the Effect 4.0 launch talk in San Francisco.](https://cdn.neonapi.io/public/images/pages/blog/announcing-neon-effect/effect-4-meetup.jpg)

The launch prompted us to finally create Effect bindings for `@neon/sdk`. On the ride home, I asked my agent to create a draft PR for `@neon/effect`.

<EmbedTweet url="https://twitter.com/andrelandgraf/status/2105514776290119718?ref_src=twsrc%5Etfw" />

[Effect](https://effect.website) has been getting more attention among TypeScript developers as agents write more of our code. The pitch makes sense: give agents type-safe tools for retries, cancellation and timeouts that are otherwise easy to miss or get wrong.

With [Effect 4.0](https://effect.website/blog/releases/effect/40), the team brought the core package to zero runtime dependencies and laid the foundation for more libraries to build on it. Today we're adding [`@neon/effect`](https://www.npmjs.com/package/@neon/effect).

## Why Effect for agents

I've looked at Effect many times over the years and always postponed learning it. The syntax looks intimidating. Effects, Layers and the other concepts are a lot to pick up when you're used to regular TypeScript.

With agents writing the code, that syntax is less of a barrier. Effect's promise to humans holds for agents too: make error cases explicit and provide tools for the production logic that otherwise gets scattered across an application. That pitch is very appealing to me.

## Neon with Effect

Our [`@neon/sdk`](https://neon.com/blog/neon-sdk) manages Neon from scripts, automations and CI/CD. It's also built for platforms that offer Postgres to their customers, the way Replit, v0, the Vercel Marketplace, Laravel Cloud and Netlify DB do.

Those platforms run distributed systems with several providers and Neon downstream. Provisioning infrastructure, waiting for operations and recovering from failures are a good fit for Effect.

[`@neon/effect`](https://github.com/neondatabase/neon-pkgs/tree/main/packages/effect) wraps the SDK's ergonomic client with the same method names and parameters. API calls return Effects and paginated lists return Streams. It requires Effect 4:

```bash
npm install @neon/effect effect
```

Create a project and a preview branch, then get its connection string:

```ts
import { Effect, Schedule, Stream } from "effect";
import { Neon, layerConfig } from "@neon/effect";

const createPreview = Effect.gen(function* () {
  const neon = yield* Neon;

  const { project } = yield* neon.projects.createAndConnect({ name: "my-app" });

  const preview = yield* neon.branches.createAndConnect({
    projectId: project.id,
    name: "preview",
  });

  return preview.connectionString;
});

// Reads NEON_API_KEY (and optionally NEON_ORG_ID) through Effect Config
Effect.runPromise(createPreview.pipe(Effect.provide(layerConfig)));
```

SDK errors become tagged errors you can handle with `Effect.catchTag`. Here we handle a missing project and retry network failures:

```ts
const findProject = (projectId: string) =>
  Effect.gen(function* () {
    const neon = yield* Neon;
    return yield* neon.projects.get({ projectId }).pipe(
      Effect.catchTag("NeonNotFoundError", () => Effect.succeed(undefined)),
      Effect.retry({
        while: (error) => error._tag === "NeonNetworkError",
        schedule: Schedule.exponential("200 millis"),
        times: 3,
      }),
    );
  });
```

The SDK's own retries and readiness polling still run underneath. If a readiness deadline expires, the error carries the outstanding operations so you can resume waiting:

```ts
const createBranch = (projectId: string) =>
  Effect.gen(function* () {
    const neon = yield* Neon;
    return yield* neon.branches
      .create({ projectId, name: "feature" }, { wait: { timeoutMs: 30_000 } })
      .pipe(
        Effect.catchTag("NeonWaitTimeoutError", (error) =>
          neon.operations.waitFor({ operations: error.operations }),
        ),
      );
  });
```

Paginated lists are Streams. This takes up to 20 projects with a ten-second deadline:

```ts
const firstProjects = Effect.gen(function* () {
  const neon = yield* Neon;
  return yield* neon.projects.list().pipe(
    Stream.take(20),
    Stream.runCollect,
    Effect.timeout("10 seconds"),
  );
});
```

Interruption through `Effect.timeout` or `Fiber.interrupt` aborts the in-flight HTTP request and stops readiness polling.

The [README](https://github.com/neondatabase/neon-pkgs/tree/main/packages/effect) covers configuration, errors and the API. Alongside `layerConfig`, you can use `layer(config)` for explicit configuration or `make(config)` without a Layer.

Building an agent platform on Neon? Take a look at the [Agent Plan](/docs/introduction/agent-plan).

Have feedback on `@neon/effect`? Join the conversation in our [Discord](https://neon.com/discord).

Happy coding!
