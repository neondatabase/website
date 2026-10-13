---
title: Effect bindings for the Neon SDK
subtitle: Use the Neon Management SDK with Effect v4 — every call an Effect, every paginated list a Stream, with tagged errors and interruption.
summary: >-
  @neon/effect wraps the @neon/sdk ergonomic client in Effect v4. Every API
  method returns an Effect, paginated lists return a Stream, and SDK errors are
  tagged for Effect.catchTag. Interrupting a fiber cancels the in-flight request
  and readiness polling, so retries, timeouts, and cancellation compose with the
  rest of your Effect program. Provide the client with layer(config) or
  layerConfig, or create one directly with make(config).
enableTableOfContents: true
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to provide and configure the Effect client</p>
<p>Which methods return an Effect and which return a Stream</p>
<p>How tagged errors, cancellation, and deadlines work</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
<a href="/docs/reference/typescript-sdk">Neon Management SDK (@neon/sdk)</a>
<a href="/docs/reference/api">Neon API Reference</a>
</DocsList>

<DocsList title="Source code" theme="repo">
<a href="https://www.npmjs.com/package/@neon/effect">@neon/effect on npm</a>
<a href="https://github.com/neondatabase/neon-pkgs/tree/main/packages/effect">@neon/effect on GitHub</a>
</DocsList>
</InfoBlock>

`@neon/effect` provides [Effect](https://effect.website) v4 bindings for the [`@neon/sdk`](/docs/reference/typescript-sdk) ergonomic client (`createNeonClient`). Every API method returns an `Effect`, paginated lists return a `Stream`, and SDK errors are tagged so you can handle them with `Effect.catchTag`. Interrupting a fiber cancels its in-flight HTTP request and any readiness polling.

Use it when you already build with Effect and want retries, timeouts, and cancellation to compose with the rest of your program. If your code doesn't use Effect, use [`@neon/sdk`](/docs/reference/typescript-sdk) directly.

<Admonition type="note" title="Requires Effect v4">
Install `effect` v4 alongside `@neon/effect`. The package declares `effect` as a peer dependency and bundles `@neon/sdk` as a dependency.
</Admonition>

```bash
npm install @neon/effect effect
```

## Quick start

Set `NEON_API_KEY` (and optionally `NEON_ORG_ID`), then provide the client with `layerConfig`:

```ts
import { Neon, layerConfig } from '@neon/effect';
import { Effect, Stream } from 'effect';

const program = Effect.gen(function* () {
  const neon = yield* Neon;

  const projects = yield* neon.projects.list().pipe(Stream.take(10), Stream.runCollect);

  const project = yield* neon.projects
    .get({ projectId: 'my-project-id' })
    .pipe(Effect.catchTag('NeonNotFoundError', () => Effect.succeed(undefined)));

  return { projects, project };
});

Effect.runPromise(program.pipe(Effect.provide(layerConfig)));
```

## Configuration

`Neon` is a `Context.Service` whose value is a `NeonEffectClient`. Provide it one of three ways:

| Export          | Behavior                                                                                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layer(config)` | Provides `Neon` from explicit configuration. Reads no environment variables. Fails with `NeonClientError` on invalid configuration.                                                         |
| `layerConfig`   | Provides `Neon` through Effect `Config`. Reads required `NEON_API_KEY` with `Config.Redacted` and optional `NEON_ORG_ID` as the default org. Fails with `NeonClientError` or `ConfigError`. |
| `make(config)`  | Returns a `NeonEffectClient` directly, without a network request. Throws `NeonClientError` on invalid configuration.                                                                        |

`NeonEffectConfig` accepts the SDK's [client configuration](/docs/reference/typescript-sdk), excluding `throwOnError`: `apiKey` (string or sync/async function), `orgId`, `baseUrl`, `fetch`, `retries`, `requestTimeoutMs`, `waitForReadiness`, and `wait`.

```ts
import { Neon, layer, make } from '@neon/effect';
import { Effect } from 'effect';

const apiKey = process.env.NEON_API_KEY;
if (!apiKey) throw new Error('NEON_API_KEY is required');

const config = { apiKey, requestTimeoutMs: 10_000 };

// Provide the service to a program:
Effect.runPromise(program.pipe(Effect.provide(layer(config))));

// Or build a client directly:
const neon = make(config);
await Effect.runPromise(neon.projects.get({ projectId: 'my-project-id' }));
```

An empty `apiKey` or an invalid `retries` or `requestTimeoutMs` fails configuration validation.

## Methods and pagination

Method names and named parameters follow the [SDK API reference](/docs/reference/typescript-sdk). Each method takes its SDK per-call options as the last argument, excluding `signal` and `throwOnError`.

```ts
neon.projects.list(undefined, { requestTimeoutMs: 5_000 });
neon.user.me({ requestTimeoutMs: 5_000 });
neon.branches.create({ projectId, name: 'preview' }, { waitForReadiness: true });
neon.operations.waitFor({ operations }, { timeoutMs: 30_000, pollIntervalMs: 250 });
```

Paginated methods return `Stream<Item, NeonEffectError>`:

- `projects.list`, `projects.members.list`
- `branches.list`, `operations.list`
- `functions.list`, `functions.customDomains.list`
- `logs.query`
- `consumption.perProject`, `consumption.perProjectV2`, `consumption.perBranchV2`

Every other method returns `Effect<T, NeonEffectError>`, including array results such as `regions.list` and `postgres.roles.list`. Successful Effects yield the SDK resource directly.

Retries for `423`, `429`, and `503` (including `Retry-After` handling), readiness polling, `createAndConnect`, and connection-string resolution all run through the SDK unchanged.

## Errors

`NeonEffectError` is the union of the tagged error classes below. Each class's `_tag` matches its name, and every error carries `message` and `cause` (the original `@neon/sdk` error), so you can branch on them with `Effect.catchTag`.

| Class / `_tag`            | Fields                                            |
| ------------------------- | ------------------------------------------------- |
| `NeonApiError`            | `status`, `code`, `requestId`, `response`, `body` |
| `NeonNotFoundError`       | Same HTTP fields; 404                             |
| `NeonAuthError`           | Same HTTP fields; 401/403                         |
| `NeonRateLimitError`      | Same HTTP fields; 429 after retries               |
| `NeonOperationError`      | `operationId`, `status`                           |
| `NeonRequestTimeoutError` | `timeoutMs`                                       |
| `NeonWaitTimeoutError`    | `timeoutMs`, `operations`                         |
| `NeonNetworkError`        | `reason`                                          |
| `NeonClientError`         | `message`, `cause`                                |

A wait timeout means the mutation was accepted. Continue waiting on its outstanding operations:

```ts
import { Neon, layerConfig } from '@neon/effect';
import { Effect } from 'effect';

const createBranch = Effect.gen(function* () {
  const neon = yield* Neon;
  return yield* neon.branches
    .create({ projectId: 'my-project-id', name: 'preview' }, { wait: { timeoutMs: 30_000 } })
    .pipe(
      Effect.catchTag('NeonWaitTimeoutError', (error) =>
        neon.operations.waitFor({ operations: error.operations }),
      ),
    );
});

Effect.runPromise(createBranch.pipe(Effect.provide(layerConfig)));
```

Exceptions outside the SDK error hierarchy become Effect defects. Cancellation interrupts the fiber; the SDK's `aborted` error kind has no tagged counterpart.

## Cancellation and deadlines

Interruption through `Effect.timeout`, `Fiber.interrupt`, `Effect.race`, or scope closure aborts the in-flight request and stops readiness polling. Each `Stream` page uses the signal of the Effect that pulls it.

`requestTimeoutMs` bounds each HTTP request and its retries. For a `Stream`, that budget applies to each page. To bound consumption of a whole Stream, apply `Effect.timeout`:

```ts
import { Neon, layerConfig } from '@neon/effect';
import { Effect, Stream } from 'effect';

const projects = Effect.gen(function* () {
  const neon = yield* Neon;
  return yield* neon.projects
    .list(undefined, { requestTimeoutMs: 5_000 })
    .pipe(Stream.runCollect, Effect.timeout('30 seconds'));
});

Effect.runPromise(projects.pipe(Effect.provide(layerConfig)));
```

<NeedHelp/>
