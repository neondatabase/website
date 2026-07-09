/**
 * Full snapshot → branch → restore flow for AI database versioning (Management API only; no SQL driver).
 *
 * 1. Snapshot the production branch (baseline).
 * 2. Create a child branch from production (sandbox).
 * 3. SQL mutation step omitted; this package uses only @neon/sdk (no DB query client).
 * 4. Logical snapshots are **root-branch only** in the Neon API for non-root branches.
 * 5. Restore the baseline snapshot onto the child branch (undo / rewind).
 *
 * @see https://neon.com/docs/ai/ai-database-versioning
 */
import "dotenv/config";
import { getProductionBranchId, neonClient } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const projectId = process.env.NEON_PROJECT_ID;

if (!apiKey || !projectId) {
  console.error("Set NEON_API_KEY and NEON_PROJECT_ID.");
  process.exit(1);
}

const neon = neonClient(apiKey);

const prodBranchId = await getProductionBranchId(neon, projectId);

const runId = Date.now();
const baselineName =
  process.env.VERSION_BASELINE_NAME ?? `flow-baseline-${runId}`;
const demoBranchName =
  process.env.VERSION_DEMO_BRANCH_NAME ?? `versioning-demo-${runId}`;

console.error("[versioning-flow] 1/5 Snapshot production branch (baseline)...");
const baseline = await neon.snapshots.create(projectId, prodBranchId, {
  name: baselineName,
});

console.error("[versioning-flow] 2/5 Create child branch from production...");
const demoBranch = await neon.branches.create(projectId, {
  name: demoBranchName,
  parent_id: prodBranchId,
});

const sqlNote =
  "skipped: no SQL/query client in this package (Neon API SDK only). Previous DEMO_MUTATE + pg demo removed.";
console.error("[versioning-flow] 3/5", sqlNote);

console.error(
  "[versioning-flow] 4/5 Skip snapshot of demo branch: Neon allows logical snapshots on the root branch only.",
);

console.error(
  "[versioning-flow] 5/5 Restore baseline snapshot onto demo branch (rewind)...",
);
await neon.snapshots.restore(projectId, baseline.id, {
  targetBranchId: demoBranch.id,
  finalize: true,
  name: `before_restore_${runId}`,
});

console.log(
  JSON.stringify(
    {
      projectId,
      productionBranchId: prodBranchId,
      baselineSnapshotId: baseline.id,
      demoBranchId: demoBranch.id,
      demoBranchName,
      afterSnapshotId: null,
      afterSnapshotNote:
        "Logical snapshots are root-branch only; see versioning-flow.ts header.",
      demoMutation: sqlNote,
      restoredBaselineToDemoBranch: true,
    },
    null,
    2,
  ),
);
