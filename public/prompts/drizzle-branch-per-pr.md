Create a Neon branch for this pull request, run my Drizzle migrations against it, and tear it down when the PR closes.

1. Create a branch off the parent with the Neon CLI, and set an expiry so it cleans itself up:
   ```bash
   neon branches create --name pr-<number> --parent main --expires-at <timestamp>
   ```
2. Get the branch's connection string:
   ```bash
   neon connection-string pr-<number>
   ```
3. Point Drizzle Kit at that branch (use its direct, unpooled connection string) and run `npx drizzle-kit migrate` so the migration is tested in isolation, against a copy of real data, without touching the main branch.
4. Delete the branch when the PR merges or closes:
   ```bash
   neon branches delete pr-<number>
   ```

To automate this in CI, use Neon's GitHub Actions (branch on PR open, delete on close): https://neon.com/docs/guides/branching-github-actions.md. Follow the branching guidance in the neon-postgres skill. Do not print the connection string.
