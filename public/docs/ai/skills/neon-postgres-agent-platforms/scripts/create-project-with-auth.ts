/**
 * Create a Neon project, then enable Neon Auth on the default branch (Better Auth).
 *
 * Enabling Neon Auth isn't wrapped by an ergonomic namespace yet, so this drops
 * to the raw layer (`raw.createNeonAuth`) and reuses the client's auth via
 * `neon.client`.
 *
 * Prints Neon Auth keys once; store pub_client_key / secret_server_key securely.
 */
import "dotenv/config";
import { raw } from "@neon/sdk";
import { getProductionBranchId, neonClient } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const orgId = process.env.NEON_ORG_ID?.trim();
const name =
  process.env.NEON_PROJECT_NAME?.trim() || `tenant-auth-${Date.now()}`;
const authDb = process.env.NEON_AUTH_DATABASE_NAME?.trim();

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

const prodBranchId = await getProductionBranchId(neon, project.id);

const { data: neonAuth } = await raw.createNeonAuth({
  client: neon.client,
  path: { project_id: project.id, branch_id: prodBranchId },
  body: {
    auth_provider: "better_auth",
    ...(authDb ? { database_name: authDb } : {}),
  },
  throwOnError: true,
});

console.error(
  "[neon-auth] Keys below are shown once by Neon; save pub_client_key and secret_server_key.",
);

console.log(
  JSON.stringify(
    {
      projectId: project.id,
      branchId: prodBranchId,
      databaseUrl: connectionString,
      name,
      neonAuth,
    },
    null,
    2,
  ),
);
