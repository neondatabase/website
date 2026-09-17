# @neon/sdk

`@neon/sdk` is the official TypeScript client for the [Neon API](https://neon.com/docs/reference/api-reference.md): **Fetch-based, zero-dependency, ESM-only**, generated from Neon's [OpenAPI spec](https://neon.com/api_spec/release/v2.json) with an ergonomic layer on top. It is the successor to [`@neondatabase/api-client`](https://www.npmjs.com/package/@neondatabase/api-client) (axios-based, generated-only). The old client is **not deprecated** and is safe to keep using, but new code should prefer `@neon/sdk`.

Use it to manage Neon resources programmatically: creating projects, branches, and snapshots for dev scripts, CI/CD automations, and platforms building on top of Neon.

Log query pagination lives in [logs-loki.md](https://neon.com/docs/ai/skills/neon/references/logs-loki.md).
