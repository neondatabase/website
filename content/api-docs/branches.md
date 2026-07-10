Neon branches are copy-on-write clones of your database, created from any point in time. A new branch shares storage with its parent until it diverges. Common uses include per-PR preview environments, testing schema changes before promoting them, and point-in-time recovery.

You cannot delete a project's root branch. You also cannot delete a branch that has children; delete all children first.

See [Branching with the Neon API](/docs/guides/branching-neon-api) for end-to-end examples, and [Automate branching with GitHub Actions](/docs/guides/branching-github-actions) for CI/CD workflows using Neon's create, delete, reset, and schema diff actions.
