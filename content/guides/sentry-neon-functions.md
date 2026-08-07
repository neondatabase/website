---
title: 'Monitor Neon Functions with Sentry'
subtitle: 'Learn how to add error tracking, structured logs, and request tracing to your Neon Functions with Sentry.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-08-05T00:00:00.000Z'
updatedOn: '2026-08-07T16:58:52.237Z'
---

[Neon Functions](/docs/compute/functions/overview) make it easy to ship server-side code next to your Postgres. They also come with basic visibility out of the box: every deployed function streams its standard output and error to the [Monitoring page in the Neon Console](/docs/compute/functions/logs), with a platform-emitted `invoke begin` / `invoke end` line around each request. That's great for raw logs and spot checks.

But once that code is live, logs alone leave real questions unanswered: which errors keep firing, how a single failed request got to where it did, and where the latency came from.

That's where [Sentry](https://sentry.io) comes in. It groups errors into issues, keeps structured logs next to traces, and ties everything to a single trace ID, so from one error you can jump straight to the logs and spans of the request that produced it.

Neon Functions make that integration painless. A Neon Function is a long-lived Node.js process running a web-standard request/response handler, so the standard [Sentry Node SDK](https://docs.sentry.io/platforms/javascript/guides/node/) works unchanged. You initialize it once at module load before your handler starts serving requests, and it stays instrumented for the life of the isolate. No separate setup or wrapper is needed.

In this guide, you'll build a simple JSON API on Neon Functions and wire it up to Sentry's three signals:

- **Errors**: unhandled route failures, captured as grouped, alertable issues
- **Logs**: recoverable failures and narrative events, like a failed payment attempt your code retried and recovered from, recorded as structured, searchable log entries
- **Traces**: the full request span tree, from the route down through the work it does

Once the signals are flowing, you'll also tour where each one lands in the Sentry dashboard and how to read it, so you know where to look when a real incident hits.

## Prerequisites

Before starting, ensure you have:

1. **Node.js**: Version 20 or later (v24 recommended). Download from [nodejs.org](https://nodejs.org/).
2. **Neon Account**: Sign up for a free account at [console.neon.tech](https://console.neon.tech/signup).
3. **Neon CLI**: Installed globally (`npm i -g neon`) and authenticated (`neon auth`). Check out the [Neon CLI Quickstart](/docs/cli/quickstart) for details.
4. **Sentry Account**: Sign up for a free account at [sentry.io](https://sentry.io/signup/).

<Steps>

## Create a Sentry project

First, create a Sentry project so you have a DSN (Data Source Name) your function can send telemetry to:

1. Log in to your [Sentry dashboard](https://sentry.io/projects/new/) and click **Create Project**.
2. Select **Node.js** as the platform, give the project a name such as `neon-functions-api`, and create it.
3. Click on the **Copy DSN** button in the project settings. You'll need this DSN to configure your Neon Function to send telemetry to Sentry.

The DSN looks like `https://examplePublicKey@o0.ingest.us.sentry.io/0`. Keep it handy for the environment configuration step later.

## Set up the Neon Functions project

Create a directory for your project and initialize a workspace:

```bash
mkdir neon-sentry-demo && cd neon-sentry-demo
```

Run the Neon CLI initialization command:

```bash
neon init
```

Use the default setup options for all prompts: this includes enabling AI skills, configuring the MCP server, and installing the VS Code extension. These steps ensure AI agents such as Claude Code and Cursor can assist you in building with Neon.

During initialization, the **Neon Postgres** skills are installed automatically. You'll also need the **Neon Functions** and **Neon AI Gateway** skills so AI agents have the context to help you build and deploy your function. Install them with the following command:

```bash
npx skills add neondatabase/agent-skills --skill neon-ai-gateway --skill neon-functions
```

Link your local workspace to a Neon project:

```bash
neon link
```

You’ll be prompted to select your organization. Once chosen, either pick an existing Neon project or create a new one named `neon-sentry-demo`. Next, select a region. Choose **AWS US East 2 (Ohio)** (`aws-us-east-2`), as Neon Functions are currently available only in this region during beta. When asked which Neon services you require, select **Functions**. Finally, confirm that you want to manage your setup as code; this will generate a `neon.ts` file in the root of your project.

```text
$ neon link
✔ Which organization would you like to link? › MyOrg (org-example-12345678)
✔ Which project would you like to link? › ＋ Create new project…
✔ Name for the new project: … neon-sentry-demo
✔ Which region should the new project run in? › AWS US East 2 (Ohio) (aws-us-east-2)
Created project quiet-mist-12345678 ("neon-sentry-demo") in aws-us-east-2.
Linked ~/neon-sentry-demo/.neon:
  orgId:     org-example-12345678
  projectId: quiet-mist-12345678
  branch:    main

INFO: Pulled 3 Neon variables into ~/neon-sentry-demo/.env.local: NEON_BRANCH, DATABASE_URL, DATABASE_URL_UNPOOLED
✔ Manage this project's Neon setup as code? Adds a neon.ts you can edit and apply with `neon config apply`. … yes
✔ Which Neon services should neon.ts declare? (space to toggle, enter to confirm) › Functions
INFO: Created neon.ts declaring functions.
INFO: Created hello.ts - the source of the hello function.
INFO: Installing @neon/config, @neon/env with npm…
```

The `neon link` command also creates a placeholder function `hello.ts` that returns `"Hello from Neon Functions"`.

```ts filename="hello.ts"
export default async function hello(): Promise<Response> {
  return new Response("Hello from Neon Functions");
}
```

A Neon Function is a long-lived Node.js process that runs a web-standard request/response handler: it `export default`s a function that takes a request and returns a `Response`. That's the whole entry-point contract, and it's the same shape the [Hono](https://hono.dev) framework produces with `export default app`. Because Hono apps already satisfy the contract Neon Functions expect, you can deploy one with no extra configuration or build setup.

Since you'll be using Hono in this guide, you can delete the placeholder `hello.ts` file and replace it with your own `src/index.ts` entry point in the next step.

```bash
rm hello.ts
mkdir src
```

A `.env.local` file should also be created automatically in your project root with your Neon project details, including `DATABASE_URL`, `NEON_BRANCH`, and other Neon-specific variables. You'll add the Sentry variables to this file in the next step.

Next, install the dependencies you'll need for the Hono framework and Sentry Node SDK. Run the following commands:

```bash
npm install hono @sentry/node
npm install --save-dev esbuild @types/node typescript
```

- `hono`: A lightweight web framework. Neon Functions run web-standard request/response handlers, and a Hono app satisfies that contract with `export default app`.
- `@sentry/node`: Sentry's standard Node SDK for error tracking, structured logging, and request tracing.

TypeScript needs a `tsconfig.json` for the linter to resolve types correctly. Create it in your project root:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["node"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

This targets ES2022, resolves modules the NodeNext way, includes the Node.js type definitions, and enables strict type checking.

## Configure environment variables

The Sentry SDK reads up to four environment variables. Only the DSN is required:

| Variable                    | Purpose                                                                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SENTRY_DSN`                | Your Sentry project DSN. When unset, the SDK stays fully disabled, which keeps local dev and unconfigured branches silent.                                |
| `SENTRY_RELEASE`            | Optional release identifier, such as a commit SHA (`git rev-parse --short HEAD`). Unlocks regression detection in Sentry.                                 |
| `SENTRY_TRACES_SAMPLE_RATE` | Trace sample rate from 0 to 1, default `1`. A function is low-throughput and every request is interesting, so keep `1`; lower it for high-volume traffic. |
| `PRODUCTION_BRANCH`         | The name of your default branch (usually `main`), so the default branch reports as the `production` environment instead of its branch name.               |

Add them to the end of your `.env.local` file, after the Neon-managed variables:

```bash filename=".env.local"
# ..other Neon environment variables..
SENTRY_DSN="https://examplePublicKey@o0.ingest.us.sentry.io/0"
SENTRY_RELEASE=""
SENTRY_TRACES_SAMPLE_RATE="1"
PRODUCTION_BRANCH="main"
```

> Replace the `SENTRY_DSN` value with the DSN you copied in [Create a Sentry project](#create-a-sentry-project).

## Initialize Sentry

`Sentry.init` must run before any other code in your process loads: your framework, database pool, and handlers. That way, everything that follows is instrumented from the start. The cleanest way to guarantee that order is to put the init in its own module and import that module as the very first import of your entry file.

Create `src/instrument.ts`:

```ts filename="src/instrument.ts"
import * as Sentry from "@sentry/node";
import { parseEnv } from "@neon/env";
import { config } from "../neon";

const env = parseEnv(config, "api");

Sentry.init({
  dsn: env.function.SENTRY_DSN,
  enabled: Boolean(env.function.SENTRY_DSN),
  enableLogs: true,
  tracesSampleRate: Number(env.function.SENTRY_TRACES_SAMPLE_RATE ?? 1),
  integrations: [
    // The request root span comes from the Hono middleware, so skip the SDK's own.
    Sentry.httpIntegration({ disableIncomingRequestSpans: true }),
  ],
  release: env.function.SENTRY_RELEASE,
  environment:
    env.branch && env.branch.name !== env.function.PRODUCTION_BRANCH
      ? env.branch.name
      : "production",
});

process.on("SIGTERM", () => void Sentry.flush(2000));
process.on("SIGINT", () => void Sentry.flush(2000));

export { Sentry };
```

`parseEnv` reads `env.function.*` from the variables you declared on the `api` function in `neon.ts`, and `env.branch` from the `NEON_BRANCH` the runtime injects. It returns a typed object validated against your config, so a small typo like `env.function.SENRY_DSN` fails at build time instead of silently reading an undefined variable. Here's what each piece of the init does:

- **`enabled`** turns the SDK into a no-op when `SENTRY_DSN` is missing. That keeps `neon dev` and any unconfigured branch from sending telemetry to Sentry.
- **`enableLogs`** switches on the `Sentry.logger.*` structured logging API, which is off by default.
- **`tracesSampleRate`** is the sample rate from 0 to 1, default `1`. Your function is low-throughput and every request is worth capturing, so leave it at `1` and only lower it for high-volume traffic.
- **`httpIntegration({ disableIncomingRequestSpans: true })`** handles a small quirk of Functions: your handler is invoked through Neon's own ingress rather than a `node:http` server, so there's no incoming-request span to begin with. You'll build the root span yourself in the Hono middleware in a moment, and this option stops the SDK from adding its own duplicate with a confusing name.
- **`environment`** controls what each event is tagged with. `NEON_BRANCH` is [injected on every branch](/docs/compute/functions/environment-variables) and holds the branch name (`main`, `preview/add-auth`, and so on). Comparing it to `PRODUCTION_BRANCH` means your default branch reports as `production` while preview branches use their own name, so you can filter branch noise out of your production alerts.

## Build a JSON API instrumented with Sentry

You'll build a small JSON API that "charges" an order through two fake payment providers. The first provider fails, so the route falls back to the second and succeeds, which gives you a recoverable failure to log, a terminal failure to report as an issue, and a successful request to trace.

| Route                 | What it does                                                           | Signal you'll see |
| --------------------- | ---------------------------------------------------------------------- | ----------------- |
| `POST /api/orders`    | Charges an order, falling back to a second payment provider on failure | Logs and errors   |
| `GET /api/orders/:id` | Returns a canned order                                                 | Traces            |
| `GET /health`         | Health check                                                           | Traces            |
| `GET /debug-sentry`   | Throws on purpose so you can test the wiring                           | Errors            |

Three Sentry calls cover the three signals: `Sentry.startSpan()` times a piece of work (traces), `Sentry.logger.*()` records a structured log entry (logs), and `Sentry.captureException()` reports an error as a grouped issue (errors).

### Create the app and the request span middleware

Create `src/index.ts` and add the following code:

```ts filename="src/index.ts" shouldWrap
import "./instrument";

import { Sentry } from "./instrument";
import { Hono } from "hono";

const app = new Hono();

app.use("*", (c, next) =>
  Sentry.withIsolationScope(() =>
    Sentry.startSpan(
      {
        op: "http.server",
        name: `${c.req.method} ${c.req.path}`,
        forceTransaction: true,
        attributes: { "http.request.method": c.req.method, "url.path": c.req.path },
      },
      async (span) => {
        await next();
        span.setAttribute("http.response.status_code", c.res.status);
      },
    ).finally(() => Sentry.flush(2000)),
  ),
);
```

The first import, `import "./instrument"`, runs `Sentry.init` before any other module loads, so everything below it is instrumented from the start.

The middleware adds the request root span, and it's the one block you'll copy into every instrumented function:

- **`Sentry.withIsolationScope(...)`** gives each request its own scope, so concurrent requests never mix up trace context.
- **`Sentry.startSpan(...)`** opens the root span for the request, named after the route (`POST /api/orders`, and so on). `await next()` runs the route handler inside it, and every log, error, and child span the handler emits attaches to this root automatically.
- **`.finally(() => Sentry.flush(2000))`** ships buffered telemetry before the request ends, because Neon Functions can suspend an idle process at any moment.

### Add the health check and order lookup routes

Add two simple routes to verify the function is running and to return a canned order:

```ts filename="src/index.ts"
app.get("/health", (c) => c.json({ status: "ok" }));

app.get("/api/orders/:id", (c) => c.json({ orderId: c.req.param("id"), status: "confirmed" }));
```

### Add the orders route with logs and error capture

This route "charges" an order through the two fake payment providers and shows the judgment call at the center of good instrumentation: a failure you recover from deserves a log, while a failure you can't recover from deserves an error.

```ts filename="src/index.ts" shouldWrap
app.post("/api/orders", async (c) => {
  const body = await c.req.json();
  const orderId = crypto.randomUUID();

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return c.json({ error: "orders require a non-empty items array" }, 400);
  }

  Sentry.logger.info("order received", { component: "api", orderId, items: body.items.length });

  try {
    const provider = await Sentry.startSpan(
      { name: "order.charge", attributes: { orderId } },
      () => chargeOrder(orderId, body.force_failure === true),
    );
    Sentry.logger.info("order charged", { component: "api", orderId, provider });
    return c.json({ orderId, status: "confirmed", provider });
  } catch (err) {
    // Terminal: every provider failed, so this one becomes an issue.
    Sentry.captureException(err, {
      tags: { component: "api", phase: "charge" },
      contexts: { order: { orderId, items: body.items.length } },
    });
    return c.json({ error: "charge_failed" }, 502);
  }
});
```

- **The `400` early return never touches Sentry.** A malformed payload is the caller's problem, not an app bug, so there's nothing to report. Reserve the SDK for failures you'd actually want to be woken up for.
- **`Sentry.logger.info(...)`** records the narrative (`order received`, `order charged`) with flat, searchable attributes (`component`, `orderId`, `items`). You'll query these exact fields in **Explore > Logs** later.
- **`Sentry.startSpan({ name: "order.charge" }, ...)`** wraps the charge attempt in a child span, so the waterfall shows how long the charge took under the request root span.
- **The `catch` block runs only when every provider failed.** `Sentry.captureException` turns the error into a grouped issue: `tags` are for fields you filter and group by, `contexts` are for per-event detail like the order contents.

The handler logs its way through the happy path, and only the terminal failure becomes an issue.

### Add the fake payment providers

These two helpers stand in for real payment SDK calls, so you can trigger failures on demand without any external accounts:

```ts filename="src/index.ts" shouldWrap
function chargeOrder(orderId: string, forceFailure: boolean) {
  const providers = ["stripe", "polar"];
  let lastError: unknown;

  for (const provider of providers) {
    try {
      callProvider(provider, orderId, forceFailure);
      return provider;
    } catch (err) {
      lastError = err;
      // Recoverable: the next provider gets a shot, so this is a log, not an issue.
      Sentry.logger.warn("payment provider failed, trying the next one", {
        component: "api",
        phase: "charge-attempt",
        provider,
        error: String(err),
      });
    }
  }

  throw lastError ?? new Error("all payment providers failed");
}

function callProvider(name: string, orderId: string, forceFailure: boolean) {
  if (forceFailure && name === "stripe") {
    throw new Error("provider declined the charge");
  }
  return { transactionId: crypto.randomUUID() };
}
```

`chargeOrder` tries each provider in order. A failed attempt is logged with `Sentry.logger.warn` and the loop moves on, because the order can still succeed. Only when the loop runs out of providers does the function throw, and that throw is what the route's `catch` block captures as an issue. Reporting every recovered retry as an error would bury the failures that matter in noise.

`callProvider` is the stand-in for a real provider SDK; the `forceFailure` flag makes the first provider (`stripe`) throw, which gives you a clean way to rehearse a failure from `curl` in the verification step.

### Add the test route and the global error handler

Add a route that throws on purpose and a global error handler that reports any uncaught exception to Sentry. This is the last piece of the three-signal puzzle.

```ts filename="src/index.ts"
app.get("/debug-sentry", () => {
  throw new Error("sentry test: unhandled route error");
});

app.onError((err, c) => {
  Sentry.captureException(err);
  // Framework middleware such as cors() doesn't run on error responses, so re-add headers.
  c.header("access-control-allow-origin", "*");
  return c.json({ error: "internal_error" }, 500);
});

export default app;
```

- **`GET /debug-sentry`** exists purely to prove the wiring works: it throws an error that the route doesn't catch, so the global error handler runs and reports it to Sentry.
- **`app.onError`** is Hono's global error handler. Any exception a route doesn't catch lands here, gets reported with `Sentry.captureException`, and the client gets a clean `500`.
- **`export default app`** is the contract Neon Functions expect: a web-standard request/response handler.

<details>
<summary>Complete `src/index.ts` file</summary>

You can copy the following complete `src/index.ts` file into your project:

```ts filename="src/index.ts" shouldWrap
import "./instrument";

import { Sentry } from "./instrument";
import { Hono } from "hono";

const app = new Hono();

app.use("*", (c, next) =>
  Sentry.withIsolationScope(() =>
    Sentry.startSpan(
      {
        op: "http.server",
        name: `${c.req.method} ${c.req.path}`,
        forceTransaction: true,
        attributes: { "http.request.method": c.req.method, "url.path": c.req.path },
      },
      async (span) => {
        await next();
        span.setAttribute("http.response.status_code", c.res.status);
      },
    ).finally(() => Sentry.flush(2000)),
  ),
);

app.get("/health", (c) => c.json({ status: "ok" }));

app.get("/api/orders/:id", (c) => c.json({ orderId: c.req.param("id"), status: "confirmed" }));

app.post("/api/orders", async (c) => {
  const body = await c.req.json();
  const orderId = crypto.randomUUID();

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return c.json({ error: "orders require a non-empty items array" }, 400);
  }

  Sentry.logger.info("order received", { component: "api", orderId, items: body.items.length });

  try {
    const provider = await Sentry.startSpan(
      { name: "order.charge", attributes: { orderId } },
      () => chargeOrder(orderId, body.force_failure === true),
    );
    Sentry.logger.info("order charged", { component: "api", orderId, provider });
    return c.json({ orderId, status: "confirmed", provider });
  } catch (err) {
    // Terminal: every provider failed, so this one becomes an issue.
    Sentry.captureException(err, {
      tags: { component: "api", phase: "charge" },
      contexts: { order: { orderId, items: body.items.length } },
    });
    return c.json({ error: "charge_failed" }, 502);
  }
});

function chargeOrder(orderId: string, forceFailure: boolean) {
  const providers = ["stripe", "polar"];
  let lastError: unknown;

  for (const provider of providers) {
    try {
      callProvider(provider, orderId, forceFailure);
      return provider;
    } catch (err) {
      lastError = err;
      // Recoverable: the next provider gets a shot, so this is a log, not an issue.
      Sentry.logger.warn("payment provider failed, trying the next one", {
        component: "api",
        phase: "charge-attempt",
        provider,
        error: String(err),
      });
    }
  }

  throw lastError ?? new Error("all payment providers failed");
}

function callProvider(name: string, orderId: string, forceFailure: boolean) {
  if (forceFailure && name === "stripe") {
    throw new Error("provider declined the charge");
  }
  return { transactionId: crypto.randomUUID() };
}

app.get("/debug-sentry", () => {
  throw new Error("sentry test: unhandled route error");
});

app.onError((err, c) => {
  Sentry.captureException(err);
  // Framework middleware such as cors() doesn't run on error responses, so re-add headers.
  c.header("access-control-allow-origin", "*");
  return c.json({ error: "internal_error" }, 500);
});

export default app;
```

</details>

With three Sentry calls and one piece of middleware, every request now produces a trace with its logs and errors attached. You can deploy the function and verify the signals in Sentry in the next section.

## Configure neon.ts and deploy the function

The `neon link` command created a `neon.ts` file in your project root. Update it to register the function and pass the Sentry variables as [deploy-time environment variables](/docs/compute/functions/environment-variables):

```ts filename="neon.ts" {12-24}
import { defineConfig } from "@neon/config/v1";

export const config = defineConfig({
  branch: (branch) => {
    if (branch.isDefault) { return {}; }
    if (!branch.exists) { return { ttl: "7d" }; }
    return {};
  },
  preview: {
    functions: {
      api: {
        name: "Sentry-Instrumented API",
        source: "./src/index.ts",
        env: {
          SENTRY_DSN: process.env.SENTRY_DSN!,
          SENTRY_RELEASE: process.env.SENTRY_RELEASE ?? "",
          SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE ?? "1",
          PRODUCTION_BRANCH: process.env.PRODUCTION_BRANCH ?? "main",
        },
      }
    },
  },
});

export default config;
```

Here's what each property does:

- **`preview.functions.api`** registers `src/index.ts` as a deployable Neon Function named "Sentry-Instrumented API".
- **`env`** passes the Sentry variables from your `.env.local` file to the function at runtime. The values resolve when `neon deploy` evaluates the config, which keeps secrets out of source control. Neon-injected variables like `NEON_BRANCH` don't need to be declared here; they're injected automatically.
- **`export default config`** exposes the config object so your code can pass it to `parseEnv` for type-safe variable access. Command-line tooling reads the same value from the default export.

Apply the configuration and deploy your function to Neon:

```bash
neon deploy --env .env.local
```

The `--env .env.local` flag loads your `.env.local` file so the `process.env` references in `neon.ts` resolve at deploy time. The CLI bundles your code, configures the runtime environment, and returns your deployment's live HTTPS URL:

```text
Function URLs
  • api: https://br-damp-voice-xxx-api.compute.c-3.us-east-2.aws.neon.tech
```

Copy this function endpoint URL. You'll use it in the verification steps below. If you need the URL again later, run `neon functions get api`.

<details>
<summary>How to run the function locally</summary>

You can run the function with the local dev server:

```bash
set -a && source .env.local && set +a # Read the Sentry variables into the shell environment
neon dev
```

You can then visit the function at `http://localhost:8787` and exercise the same routes as in the verification steps. The local dev server injects the same Neon environment variables, so you can test Sentry integration locally before deploying.

</details>

## Verify the instrumentation

Exercise each route and confirm the matching signal lands in Sentry.

### Errors: trigger the throwing route

```bash shouldWrap
curl "https://<your-function-url>/debug-sentry"
```

> Replace `<your-function-url>` with your deployed Neon Function URL.

The request returns a `500` with `{"error":"internal_error"}`. After a few seconds, a grouped issue appears under **Issues** in your Sentry dashboard, tagged with environment `production` (or your preview branch name if you deployed from a branch).

### Logs: trigger a recoverable failure

```bash shouldWrap
curl -X POST "https://<your-function-url>/api/orders" \
  -H "content-type: application/json" \
  -d '{"items":[{"sku":"PRL-KIT","qty":2}],"force_failure":true}'
```

The `force_failure` flag makes the primary provider (`stripe`) decline the charge, so the route falls back to the second provider, which succeeds. The response is a normal `200` with `"provider":"polar"`. In **Explore > Logs**, you'll find the `payment provider failed` warning record with its `component`, `phase`, `provider`, and `error` attributes, each individually searchable and linked to the request's trace. Notice that nothing appeared in **Issues**: the failure was recovered, so a log is all it earned.

### Traces: run a normal request

```bash shouldWrap
curl -X POST "https://<your-function-url>/api/orders" \
  -H "content-type: application/json" \
  -d '{"items":[{"sku":"PRL-KIT","qty":2}]}'
```

This time the primary provider succeeds on the first attempt, so no warning is logged. In **Explore > Traces**, you'll see the `POST /api/orders` root span with the nested `order.charge` child span.

Once all three signals land, you have the full debugging loop for a production function: an issue fires, you pivot from the issue to the logs of the same trace, and the trace itself shows the waterfall of work that produced the error. You can now see exactly what happened, when, and why.

## Add a streaming AI agent on the AI Gateway

The patterns you've built so far transfer unchanged to AI workloads. You'll add a new route that streams a tool-calling agent and shows off the traces signal on an AI workload. The agent uses the Neon AI Gateway to call a large language model (LLM) and two simple tools: one that returns the current server time and another that rolls dice.

First, install the AI dependencies:

```bash
npm install @neon/ai-sdk-provider ai zod
```

- `@neon/ai-sdk-provider`: Neon's AI SDK Provider, which gives your function access to LLMs through the Neon AI Gateway.
- `ai` and `zod`: The [Vercel AI SDK](https://ai-sdk.dev/docs/introduction) and Zod schema validation, used to run the tool-calling agent.

Next, extend the Sentry initialization in `src/instrument.ts` to include the AI SDK integration and span streaming:

```ts filename="src/instrument.ts" shouldWrap
import * as Sentry from "@sentry/node";
import { parseEnv } from "@neon/env";
import { config } from "../neon";

const env = parseEnv(config, "api");

Sentry.init({
  dsn: env.function.SENTRY_DSN,
  enabled: Boolean(env.function.SENTRY_DSN),
  enableLogs: true,
  tracesSampleRate: Number(env.function.SENTRY_TRACES_SAMPLE_RATE ?? 1),
  traceLifecycle: "stream", // [!code ++]
  integrations: [
    Sentry.vercelAIIntegration({ force: true }), // [!code ++]
    Sentry.httpIntegration({ disableIncomingRequestSpans: true }),
  ],
  release: env.function.SENTRY_RELEASE,
  environment:
    env.branch && env.branch.name !== env.function.PRODUCTION_BRANCH
      ? env.branch.name
      : "production",
});

process.on("SIGTERM", () => void Sentry.flush(2000));
process.on("SIGINT", () => void Sentry.flush(2000));

export { Sentry };
```

The new option `traceLifecycle: "stream"` tells the SDK to stream `gen_ai` spans in batches. The `Sentry.vercelAIIntegration({ force: true })` integration enables the AI SDK to emit spans for model calls and tool executions.

Now add a route to `src/index.ts`. The `POST /chat` route streams a tool-calling agent and shows off the traces signal on an AI workload. Add these imports and the route to your existing file:

```ts filename="src/index.ts" shouldWrap
import { streamText, tool, isStepCount } from "ai";
import { neon } from "@neon/ai-sdk-provider";
import { z } from "zod";
import { parseEnv } from "@neon/env";
import { config } from "../neon";

// ... other imports and app setup ...

const env = parseEnv(config, "api");

const MODEL = env.function.AGENT_MODEL;

app.post("/chat", async (c) => {
  const { messages } = await c.req.json();

  Sentry.setConversationId(c.req.header("x-conversation-id") ?? crypto.randomUUID());

  const result = streamText({
    model: neon(MODEL),
    system: "You are a concise assistant. Use tools when they help.",
    messages,
    tools: {
      getServerTime: tool({
        description: "Get the current server time in ISO format.",
        inputSchema: z.object({}),
        execute: async () => ({ now: new Date().toISOString() }),
      }),
      rollDice: tool({
        description: "Roll N six-sided dice and return the results.",
        inputSchema: z.object({ count: z.number().int().min(1).max(10) }),
        execute: async ({ count }) => ({
          rolls: Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6)),
        }),
      }),
    },
    stopWhen: isStepCount(5),
    telemetry: { isEnabled: true },
    onError: ({ error }) => {
      Sentry.captureException(error, { tags: { component: "agent", phase: "chat-stream" } });
    },
  });

  // gen_ai spans only end with the stream, so flush from the stream's finalizer.
  const stream = result.textStream
    .pipeThrough(
      new TransformStream<string, string>({
        async flush() {
          await new Promise((r) => setTimeout(r, 0));
          await Sentry.flush(2000);
        },
      }),
    )
    .pipeThrough(new TextEncoderStream());

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
});

export default app;
```

Here's what each piece does:

- **`telemetry: { isEnabled: true }`** opts the AI SDK call into emitting `gen_ai` spans. Without it, Sentry sees nothing of the agent.
- **`streamText` never throws**: failures surface as error parts inside the stream and the HTTP response just ends, so without `onError` a dead agent looks like an empty reply. The middleware's flush runs when the `Response` object is created, before the model finishes, and the `gen_ai` spans only end with the stream. The `TransformStream` finalizer flushes them while the request is still alive.
- **`Sentry.setConversationId`** (plus an optional `Sentry.setUser`) groups multi-turn chats into a timeline.

In the trace, the request root span now carries a `gen_ai` hierarchy (agent → `gen_ai.generate_content` for the model call → `gen_ai.execute_tool` for each tool run), including token usage per call.

Finally, enable the AI Gateway and redeploy. Update `neon.ts` to set `aiGateway: true`:

```ts filename="neon.ts"
  preview: {
    functions: {
      api: {
        name: "Sentry-Instrumented API",
        source: "./src/index.ts",
        env: {
          SENTRY_DSN: process.env.SENTRY_DSN!,
          SENTRY_RELEASE: process.env.SENTRY_RELEASE ?? "",
          SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE ?? "1",
          PRODUCTION_BRANCH: process.env.PRODUCTION_BRANCH ?? "main",
          AGENT_MODEL: process.env.AGENT_MODEL ?? "gpt-oss-120b", // [!code ++]
        },
      }
    },
    aiGateway: true // [!code ++]
  },
```

```bash
neon deploy --env .env.local
```

`aiGateway: true` activates the Neon AI Gateway, injecting its credentials at runtime. The function URL stays the same; the CLI bundles your updated code and redeploys it.

## Verify the agent

```bash shouldWrap
curl -X POST "https://<your-function-url>/chat" \
  -H "content-type: application/json" \
  -d '{"messages":[{"role":"user","content":"Roll 3 dice and tell me the total."}]}'
```

The agent calls the `rollDice` tool and streams the answer back. In **Explore > Traces**, you'll see the request root span with the nested `gen_ai` hierarchy including token usage per model call.

With all three signals landing for both the API and the agent, you have the full debugging loop for a production function: an issue fires, you pivot from the issue to the logs of the same trace, and the trace itself shows where the time and tokens went.

## Explore the telemetry in Sentry

You now have three signals flowing into Sentry: errors, logs, and traces. Each has its own dashboard page, and together they give you a complete picture of what happened in a request.

### Issues: your alert surface

Open **Issues** in your Sentry project. The `GET /debug-sentry` curl produced a grouped issue titled `sentry test: unhandled route error`. Sentry fingerprints exceptions by stack trace, so a real bug that fires a thousand times stays one issue with an event count and history instead of a wall of duplicates.

Click the issue to open its detail page. This is the view a real alert drops you into, and it answers the first questions of any incident:

- **What threw**: the stack trace and the exception message
- **Where it ran**: the `environment` tag (`production`, or the preview branch name) and, if you set `SENTRY_RELEASE`, the release, so you can see which deploy introduced the error and get flagged if it regresses.
- **What led up to it**: breadcrumbs recorded before the throw.
- **Which request produced it**: the trace attached to the event, one click away from the full waterfall.
  ![Sentry Issues page for the neon-functions-api project, showing the grouped "sentry test: unhandled route error" issue with its event count and environment tag](/docs/guides/sentry-neon-functions-issues.png)
  ![Issue in detail for the captured error](/docs/guides/sentry-neon-functions-issue-detail.png)

### Logs: the narrative record

Open **Explore > Logs**. Every `Sentry.logger.*` call lands here as a row: the `order received` and `order charged` info records, and the `payment provider failed` warning from the forced-failure curl.

The win over raw stdout is the query bar. The attributes you logged are searchable fields: `component:api` narrows to API records, `phase:charge-attempt` lists every recovered payment attempt, `provider:stripe` isolates one provider. Click a row to expand all its attributes, then follow the trace link to the exact request that produced it. In a real incident, that turns "stripe had trouble this morning" into a precise list of every affected order, without grepping anything.
![Sentry Logs page for the neon-functions-api project](/docs/guides/sentry-neon-functions-explore-logs.png)

### Traces: where the time went

Open **Explore > Traces**. Each request your function served shows up as a trace sample. Click `POST /api/orders` to open the waterfall: the `http.server` root span with the `order.charge` child span beneath it, durations on each.

With real traffic, this page answers "why is it slow". Filter to one route, sort the samples by duration, and open the slowest one: the waterfall shows exactly which span consumed the time, whether that's the model call, a tool execution, or your own charge logic.

![Trace waterfall for a POST /api/orders request, showing the http.server root span](/docs/guides/sentry-neon-functions-explore-traces.png)

### AI agent runs: tools and tokens

You can also see traces for the AI agent. Open **Explore > Traces** and click a `POST /chat` trace. The waterfall shows the `http.server` root span with a nested `gen_ai.generate_content` span for the model call, and beneath that, one or more `gen_ai.execute_tool` spans for each tool the agent called. Each span shows its duration and token usage, so you can see exactly how long each step took and how many tokens it consumed.

![Trace for AI Agent Run](/docs/guides/sentry-neon-functions-ai-agent-run.png)

### Putting it together

You won't browse these pages in isolation once the app is live. The loop is: an alert fires on a new issue, you open the issue and jump to its trace, the waterfall shows which span failed and where the time went, and the logs attached to each span narrate the rest. Because one trace ID ties errors, logs, and spans together, "something is wrong" becomes "this request, this span, this message" without leaving the dashboard.

</Steps>

<Admonition type="note" title="Source map support">
Neon Functions bundling does not currently emit source maps, so stack traces in Sentry show minified bundle positions (for example, `index.mjs:56`) instead of the original `src/` lines. Errors, logs, and traces are still captured correctly, but you won't be able to pinpoint the exact line in your source where an error was thrown.

If you need source-mapped stack traces today, you can bypass the CLI and bundle manually with esbuild's [`--sourcemap`](https://esbuild.github.io/api/#sourcemap) flag, then [upload the source maps to Sentry](https://docs.sentry.io/platforms/javascript/sourcemaps/) and deploy directly via the [Neon Functions API](/docs/compute/functions/deploy#deploy-with-the-api).
</Admonition>

## Best practices

With the Sentry SDK in place, you can now follow a few best practices to keep your telemetry clean and actionable:

- **Releases and regressions**: Set `SENTRY_RELEASE` to your commit SHA on every deploy so Sentry can tell you exactly which release introduced or resurfaced an issue.
- **Alerts**: Add Sentry alert rules on new issues and on log patterns (for example, `phase:charge-attempt`), so failures page you instead of waiting for a user report.
- **Per-branch verification**: Deploy from a preview branch and confirm its events land tagged with the branch name, keeping preview noise out of production dashboards.
- **Sampling at volume**: If you add a high-traffic endpoint, lower `SENTRY_TRACES_SAMPLE_RATE` for it while keeping `1` for interactive routes where every request is interesting.

## Resources

- [Neon Functions Overview](/docs/compute/functions/overview)
- [Neon Functions logs](/docs/compute/functions/logs)
- [Neon Functions environment variables](/docs/compute/functions/environment-variables)
- [Neon AI Gateway](/docs/ai-gateway/overview)
- [Neon AI SDK Provider](https://github.com/neondatabase/neon-pkgs/tree/main/packages/ai-sdk-provider)
- [Sentry Node.js SDK documentation](https://docs.sentry.io/platforms/javascript/guides/node/)
- [Vercel AI SDK Telemetry](https://ai-sdk.dev/docs/ai-sdk-core/telemetry)
- [Neon agent skills: Sentry on Functions reference](https://github.com/neondatabase/agent-skills/blob/main/skills/neon-functions/references/sentry.md)

<NeedHelp/>
