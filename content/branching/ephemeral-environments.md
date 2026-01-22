---
title: 'Ephemeral environments'
subtitle: 'Create disposable, serverless database environments that spin up instantly and clean up automatically'
updatedOn: '2025-07-08T12:47:21.296Z'
---

In serverless workflows, everything is meant to be disposable. With Neon, you can create short-lived Postgres environments as branches that spin up instantly and shut down automatically. Using tools like [Neon Local](/docs/local/neon-local), branches are provisioned on container start and cleaned up on exit.

Each environment is fully isolated, mirrors your schema and test data, and requires zero manual setup. You get fast and reproducible environments that feel like production but disappear when you’re done.
