---
description: 'Test a framework integration guide by having an AI agent follow it from zero to working Neon connection'
---

Run the docs guide eval harness against one or more guides. The harness creates an ephemeral Neon database, spins up a Docker container, and lets an AI agent follow the guide autonomously. A separate evaluator scores the result.

**Prerequisites:** Docker Desktop must be running. The harness must be set up (`cd evals/docs-guides && npm install` and `.env` configured). See `evals/docs-guides/README.md`.

**Arguments:** Pass the guide name(s) and optionally a local path. Examples:
- `/eval-guide express` — test the published Express guide
- `/eval-guide rust --local ./content/docs/guides/` — test a local draft
- `/eval-guide express,prisma,django` — test multiple guides

**Steps:**

1. Parse the guide name(s) from the user's input. If `--local` is specified, use that path. Otherwise default to `--local ./content/docs/guides/` if the file exists there, falling back to the published URL.

2. Run the harness:
```bash
cd evals/docs-guides && npm run eval -- --guide {names} {--local path if applicable} --timeout 15
```

3. Wait for the harness to complete. It will take 1-5 minutes per guide.

4. Read `evals/docs-guides/results/latest.json` for the scores.

5. Summarize the results for the user:
   - Overall score (0-10) and what it means
   - Which deterministic checks passed/failed
   - Key findings from the evaluator's reasoning
   - Any specific documentation improvements suggested
   - Whether infrastructure issues (network, DNS, proxy) affected the score

6. If the score is below 8, offer to read the full transcript at `evals/docs-guides/results/history/{latest}/` to diagnose specific issues.

7. If the user asks about a specific failure, read the relevant transcript or file snapshots to provide detailed analysis.
