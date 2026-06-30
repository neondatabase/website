/**
 * Create a Neon project (REST API). Optional org + autoscaling match multi-tenant / Agent Program flows.
 */
import "dotenv/config";
import { createApiClient } from "@neondatabase/api-client";

import { createProjectWithOperations } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const orgId = process.env.NEON_ORG_ID;
const name = process.env.NEON_PROJECT_NAME?.trim() || `tenant-${Date.now()}`;

if (!apiKey) {
  console.error("NEON_API_KEY is required.");
  process.exit(1);
}

const api = createApiClient({ apiKey });

const { projectId, databaseUrl } = await createProjectWithOperations(api, {
  name,
  orgId: orgId || undefined,
  endpointSettings: {
    autoscaling_limit_min_cu: 0.25,
    autoscaling_limit_max_cu: 2,
    suspend_timeout_seconds: 300,
  },
});

console.log(JSON.stringify({ projectId, databaseUrl, name }, null, 2));
