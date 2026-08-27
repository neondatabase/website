Functions are serverless compute you deploy onto a branch, so your backend code runs next to your database. A function doesn't configure the services it uses: enable a service on the branch and its connection strings and credentials are injected into `process.env` at runtime. A function has 15 minutes to start responding and can keep streaming while data flows, which suits agents and WebSocket or SSE servers. Each branch runs its own functions at their own URLs.

The slug is assigned at first deploy and can't be changed; `name` is a display label only.

Renaming acts only on a function the branch owns. A slug that's only inherited from an ancestor returns `404`, so rename it on the owning branch.

You can also manage functions from the CLI with [`neon functions`](/docs/cli/functions).

Functions are in beta and available only in AWS US East (Ohio) (`aws-us-east-2`). See [Neon Functions](/docs/compute/functions/overview) for the deployment workflow, [Environment variables](/docs/compute/functions/environment-variables) for what gets injected, and [Runtime limits](/docs/compute/functions/reference/runtime-limits) for timeouts and concurrency.
