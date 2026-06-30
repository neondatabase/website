/**
 * Delete one snapshot by id (async operations are polled to completion).
 * @see https://neon.com/docs/ai/ai-database-versioning#delete-snapshot
 */
import "dotenv/config";
import { createApiClient } from "@neondatabase/api-client";

import { deleteSnapshotWithWait } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const projectId = process.env.NEON_PROJECT_ID;
const snapshotId = process.env.NEON_SNAPSHOT_ID;

if (!apiKey || !projectId || !snapshotId) {
  console.error("Set NEON_API_KEY, NEON_PROJECT_ID, and NEON_SNAPSHOT_ID.");
  process.exit(1);
}

const api = createApiClient({ apiKey });
await deleteSnapshotWithWait(api, projectId, snapshotId);
console.log(JSON.stringify({ ok: true, projectId, snapshotId }, null, 2));
