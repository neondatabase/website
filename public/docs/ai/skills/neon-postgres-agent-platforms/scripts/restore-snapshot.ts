/**
 * Restore an existing snapshot onto a branch (single REST step after versioning-flow or Console).
 *
 * @see https://neon.com/docs/ai/ai-database-versioning
 */
import "dotenv/config";
import { neonClient } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const projectId = process.env.NEON_PROJECT_ID;
const snapshotId = process.env.NEON_SNAPSHOT_ID;
const targetBranchId = process.env.NEON_TARGET_BRANCH_ID;

if (!apiKey || !projectId || !snapshotId || !targetBranchId) {
  console.error(
    "Set NEON_API_KEY, NEON_PROJECT_ID, NEON_SNAPSHOT_ID, NEON_TARGET_BRANCH_ID.",
  );
  process.exit(1);
}

const neon = neonClient(apiKey);

// Restore onto an existing branch and finalize immediately (swap computes onto
// the restored data). Pass a `preview` callback instead of `finalize` to inspect
// the restored branch before committing.
await neon.snapshots.restore(projectId, snapshotId, {
  targetBranchId,
  finalize: true,
  name: `before_restore_${Date.now()}`,
});

console.log(
  JSON.stringify(
    {
      ok: true,
      projectId,
      snapshotId,
      targetBranchId,
    },
    null,
    2,
  ),
);
