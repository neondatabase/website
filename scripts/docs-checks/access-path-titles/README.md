# access-path-titles

Fails when a `content/docs` page's subtitle says the reader works "on Neon"
but its title names bare "Lakebase Postgres". Docs search hits, including the
Neon MCP Server's `search_docs` results, carry the title but not the subtitle,
so the title has to carry the access path itself. Fix a failure by writing "Lakebase
Postgres on Neon" in the title; don't remove "on Neon" from the subtitle.

The check covers only titles that contradict their own subtitle. Pages whose
subtitle doesn't say "on Neon" still need the access-path judgment described
in `.claude/neon-terminology.md`.

## Run

```bash
npm run check:docs:access-path-titles
```
