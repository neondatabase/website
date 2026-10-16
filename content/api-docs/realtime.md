Neon Realtime streams live query results to your application: a client subscribes to a SQL query and receives the current rows, then each transaction's changes. Each branch gets its own endpoint, returned as `invocation_url`, and a new branch inherits its parent's Realtime settings.

Neon Realtime is coming soon and isn't available yet. These endpoints are documented ahead of launch.

Changes return `202` and finish in the background, so poll the state endpoint until `pending` is `false`. `allowed_origins` limits which browser origins can connect, not server clients. An empty list or `*` allows any origin, omitting it keeps the current value, and a new list can take about a minute to apply.

Your backend issues Realtime tokens with the branch's shared secret, so keep it server-side. After a rotation, the previous secret keeps working until `pending` is `false`.

You can also manage Realtime with [`neon realtime`](/docs/cli/realtime), stream a query with [`neon realtime subscribe`](/docs/cli/realtime#subscribe), or declare it in `neon.ts` with [`preview.realtime`](/docs/reference/neon-ts#realtime).
