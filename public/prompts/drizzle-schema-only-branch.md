Create a schema-only Neon branch so I can test a migration against the real table structure without copying any row data. This is the right choice when the data is sensitive and must not be duplicated. Schema-only branching is in beta and subject to change.

1. Create a schema-only branch from the parent branch. It copies the schema only, leaving all rows behind. Follow the current steps in https://neon.com/docs/guides/branching-schema-only.md and the branching guidance in the neon-postgres skill, and use whichever path that documents (Neon Console, API, or CLI) for your Neon version.
2. Point Drizzle Kit at the schema-only branch's direct (unpooled) connection string and run `npx drizzle-kit migrate` to verify the migration applies cleanly against the structure.
3. Populate the branch with anonymized or synthetic data if you need rows to test against, since the branch starts empty.
4. Report whether the migration succeeded. Note that schema-only branches are independent root branches, so reset-from-parent does not apply to them. Do not print the connection string.
