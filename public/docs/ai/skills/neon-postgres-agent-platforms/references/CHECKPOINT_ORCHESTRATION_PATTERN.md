# Full-stack checkpoint orchestration (pattern)

**Read [COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md](COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md) first** for the **“what to record”** dimension table. **This doc** is about **how** meta DB, workflows, Neon API usage, and restore steps usually layer.

Agent platforms usually implement **checkpoints as orchestration**, not a single Management API script. A useful mental model: pair **source revision** (Git commit, template hash, artifact digest, or codegen bundle id) with **Neon database state** (snapshot id, branch id, project id) and store both in **your** meta-database or ledger, alongside secrets, deployment URLs, and agent run metadata. The compound record itself is defined in **COMPOUND_CHECKPOINTS** (link above).

This skill’s **`scripts/*.ts`** files stay **API-sized**: they cover the Neon control-plane slice only. Your product adds workflows, HTTP routes, durable jobs, and schema.

---

## Typical layers (abstract)

| Layer | Responsibility |
| ----- | ---------------- |
| **Neon integration** | Wrap `@neondatabase/api-client`: projects, branches, logical snapshots, restore, connection URIs, operation polling (patterns align with [`utils.ts`](../scripts/utils.ts) and the sample scripts). |
| **Meta database** | Version rows that bind `neon_snapshot_id` (and related Neon ids) to `git_commit_hash` / artifact id / timestamps / optional assistant or run ids. Often separate tables for tenant secrets or env snapshots. |
| **Checkpoint workflow** | When the user or agent creates a checkpoint: resolve **latest source revision** and **create a Neon snapshot** (often in parallel), then insert one **version** row so code and DB state stay aligned. |
| **HTTP or queue entry** | User-facing `POST …/checkpoint` or internal job that starts the workflow (workflow engine is product-specific). |
| **Restore** | Load version row → restore matching secrets/env → align source control or deployment to the recorded revision → **apply Neon snapshot** to the correct branch in a defined order. |

---

## Mapping Neon operations to samples here

| Neon-shaped concern | Sample in this skill (`scripts/`) |
| ------------------- | ----------------------------------------------- |
| Create logical snapshot | [`snapshot.ts`](../scripts/snapshot.ts) |
| Restore snapshot onto a branch | [`restore-snapshot.ts`](../scripts/restore-snapshot.ts) |
| Snapshot → branch → restore demo | [`versioning-flow.ts`](../scripts/versioning-flow.ts) |
| Provision project + enable branch Auth (admin) | [`create-project-with-auth.ts`](../scripts/create-project-with-auth.ts) |

---

## Auth providers

Products differ on **Neon Auth** setup (`better_auth`, other providers, or separate IdPs). The Management API samples use **`create-project-with-auth.ts`** for the **`better_auth`** path; Neon Auth APIs and Console flows are documented on **[neon.com/docs](https://neon.com/docs)**.

---

## Further reading

- **[MANAGEMENT_API_SAMPLES.md](MANAGEMENT_API_SAMPLES.md)** — env vars and npm commands for the scripts above.
- **[COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md](COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md)** — dimensions to persist beyond Neon ids.
- **[AI database versioning](https://neon.com/docs/ai/ai-database-versioning.md)** — Neon semantics for snapshots and restore.
