/**
 * Create a logical snapshot on the default branch (same pattern as many agent hosts).
 */
import "dotenv/config";
import { createApiClient } from "@neondatabase/api-client";

import { createLogicalSnapshot } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const projectId = process.env.NEON_PROJECT_ID;
const snapshotName = process.env.NEON_SNAPSHOT_NAME;
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

const api = createApiClient({ apiKey });
const snapshotId = await createLogicalSnapshot(api, projectId, {
  name: snapshotName || undefined,
  ...(expiresAt ? { expiresAt } : {}),
  ...(lsn ? { lsn } : {}),
});
console.log(JSON.stringify({ snapshotId, projectId }, null, 2));
