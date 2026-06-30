/**
 * Rename a snapshot (PATCH metadata only).
 * @see https://neon.com/docs/ai/ai-database-versioning#update-snapshot-name
 */
import "dotenv/config";
import { createApiClient } from "@neondatabase/api-client";

const apiKey = process.env.NEON_API_KEY?.trim();
const projectId = process.env.NEON_PROJECT_ID;
const snapshotId = process.env.NEON_SNAPSHOT_ID;
const name = process.env.NEON_SNAPSHOT_NEW_NAME?.trim();

if (!apiKey || !projectId || !snapshotId || !name) {
  console.error(
    "Set NEON_API_KEY, NEON_PROJECT_ID, NEON_SNAPSHOT_ID, and NEON_SNAPSHOT_NEW_NAME.",
  );
  process.exit(1);
}

const api = createApiClient({ apiKey });
await api.updateSnapshot(projectId, snapshotId, {
  snapshot: { name },
});
console.log(JSON.stringify({ ok: true, projectId, snapshotId, name }, null, 2));
