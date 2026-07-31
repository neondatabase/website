/**
 * Create a Neon project (REST API). Optional org + autoscaling match multi-tenant / Agent Program flows.
 *
 * `createAndConnect` creates the project, waits for provisioning to finish, and
 * returns a ready-to-use pooled connection string in one call.
 */
import "dotenv/config";
import { neonClient } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const orgId = process.env.NEON_ORG_ID?.trim();
const name = process.env.NEON_PROJECT_NAME?.trim() || `tenant-${Date.now()}`;

if (!apiKey) {
  console.error("NEON_API_KEY is required.");
  process.exit(1);
}

const neon = neonClient(apiKey);

const { project, connectionString } = await neon.projects.createAndConnect({
  name,
  ...(orgId ? { org_id: orgId } : {}),
  default_endpoint_settings: {
    autoscaling_limit_min_cu: 0.25,
    autoscaling_limit_max_cu: 2,
    suspend_timeout_seconds: 300,
  },
});

console.log(
  JSON.stringify(
    { projectId: project.id, databaseUrl: connectionString, name },
    null,
    2,
  ),
);
