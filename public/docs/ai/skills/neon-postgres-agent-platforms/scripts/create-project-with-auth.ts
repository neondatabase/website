/**
 * Create a Neon project, then enable Neon Auth on the default branch (Better Auth).
 *
 * Prints Neon Auth keys once; store pub_client_key / secret_server_key securely.
 */
import "dotenv/config";
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

const neonAuth = await neon.auth.create({
  projectId: project.id,
  branchId: prodBranchId,
  auth_provider: "better_auth",
  ...(authDb ? { database_name: authDb } : {}),
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
