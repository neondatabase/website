Neon branches are copy-on-write clones of your database, created from any point in time. A new branch shares storage with its parent until it diverges, so creating one is cheap and fast.

Common uses:

- Development and preview environments per pull request or per developer
- Testing schema changes before promoting them
- Point-in-time recovery by branching from a past timestamp

## When to use this API

Use these endpoints to create, list, or delete branches from CI/CD and platform automation. For interactive work, the [Neon Console](https://console.neon.tech) and [Neon CLI](https://neon.com/docs/reference/cli-branches) cover the same operations.

## Key constraints

- You cannot delete a project's root branch.
- You cannot delete a branch that has child branches. Delete or reparent the children first.

See the [Branching with the Neon API guide](https://neon.com/docs/guides/branching-neon-api) for end-to-end examples.
