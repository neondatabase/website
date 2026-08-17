/**
 * Create a logical snapshot on the default branch (same pattern as many agent hosts).
 */
import "dotenv/config";
import { getProductionBranchId, neonClient } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const projectId = process.env.NEON_PROJECT_ID;
const snapshotName = process.env.NEON_SNAPSHOT_NAME?.trim();
const expiresAt = process.env.NEON_SNAPSHOT_EXPIRES_AT?.trim();
const lsn = process.env.NEON_SNAPSHOT_LSN?.trim();

if (!apiKey) {
  console.error("NEON_API_KEY is required.");
  process.exit(1);
}

if (!projectId) {
  console.error("Set NEON_PROJECT_ID.");
  process.exit(1);
}

const neon = neonClient(apiKey);
const branchId = await getProductionBranchId(neon, projectId);

const snapshot = await neon.snapshots.create(projectId, branchId, {
  ...(snapshotName ? { name: snapshotName } : {}),
  ...(expiresAt ? { expiresAt } : {}),
  // A snapshot is taken at an `lsn` or a `timestamp`; default to "now".
  ...(lsn ? { lsn } : { timestamp: new Date().toISOString() }),
});

console.log(JSON.stringify({ snapshotId: snapshot.id, projectId }, null, 2));
