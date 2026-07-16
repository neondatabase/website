/**
 * List all logical snapshots for a project (IDs, names, timestamps; see Neon API).
 * @see https://neon.com/docs/ai/ai-database-versioning#list-available-snapshots
 */
import "dotenv/config";
import { neonClient } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const projectId = process.env.NEON_PROJECT_ID;

if (!apiKey || !projectId) {
  console.error("Set NEON_API_KEY and NEON_PROJECT_ID.");
  process.exit(1);
}

const neon = neonClient(apiKey);
const snapshots = await neon.snapshots.list(projectId);
console.log(JSON.stringify({ projectId, snapshots }, null, 2));
