# Docs Guide Eval Harness

Tests whether Neon framework integration guides are effective enough for an AI agent to follow from zero to a working Neon connection. The agent reads the guide, sets up the project in an isolated Docker container with an ephemeral Neon database, and a separate evaluator scores the result.

The harness scores the documentation, not the agent. A low score means the guide needs improvement.

## Setup

1. **Install Docker Desktop** and make sure it's running.

2. **Install dependencies:**
   ```bash
   cd evals/docs-guides
   npm install
   ```

3. **Configure credentials.** Copy the example and add your API key:
   ```bash
   cp .env.example .env
   ```
   Edit `evals/docs-guides/.env` with your credentials. You need one of:
   - `OPENAI_API_KEY` for direct OpenAI access
   - `OPENAI_BASE_URL` + `OPENAI_API_KEY` for any OpenAI-compatible endpoint
   - `DATABRICKS_HOST` + `DATABRICKS_TOKEN` for Databricks Model Serving

   If your network blocks public package registries, add the proxy URLs for npm, pip, Go, Maven, and Cargo. See `.env.example` for all options.

4. **Build the Docker image** (happens automatically on first run, takes a few minutes).

## Usage with Claude Code

The easiest way to use this harness is via the `/eval-guide` slash command in a Claude Code session:

```
/eval-guide express
/eval-guide rust --local ./content/docs/guides/
/eval-guide express,prisma,django
```

Claude runs the harness, reads the results, and summarizes the findings conversationally. Use the output as context for future doc edits. If the evaluator identifies specific issues (unclear driver selection, missing error handling, scope creep), those are direct improvement signals for the guide.

## Manual CLI usage

Test a published guide:
```bash
npm run eval -- --guide express
```

Test a local draft before publishing:
```bash
npm run eval -- --guide express --local ../../content/docs/guides/
```

Test multiple guides:
```bash
npm run eval -- --guide express,prisma,django
```

Run all guides registered in `config/guides.yaml` (intended for scheduled/CI runs):
```bash
npm run eval
```

## How it works

1. Creates an ephemeral Neon Postgres database (via neon.new, no account needed)
2. Starts a Docker container with Node.js, Python, and apt-get access for other runtimes
3. Gives the AI agent the guide content and a task prompt
4. The agent installs packages, writes code, and verifies the connection
5. Deterministic checks confirm: connection works, .env exists, no hardcoded credentials
6. An LLM evaluator scores the session against a rubric (0-10)
7. Saves transcript, file snapshots, and scores to `results/`

## Output

Results go to `results/history/{timestamp}/` with:
- `summary.json` — scores and deterministic check results
- `{guide}/transcript.txt` — readable conversation log
- `{guide}/files/` — every file the agent created

## Configuration

- **`config/guides.yaml`** — Registry of guides available for eval. Running `npm run eval` with no `--guide` flag runs all guides listed here. Add a guide when it's ready for regular testing.
- **`config/rubric.md`** — Evaluation criteria for the LLM scorer. Edit this to adjust what the evaluator cares about.
- **`.env`** — Your API credentials and optional registry proxies (gitignored, never committed).
