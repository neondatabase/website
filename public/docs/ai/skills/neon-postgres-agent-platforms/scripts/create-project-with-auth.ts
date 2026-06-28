/**
 * Create a Neon project, then enable Neon Auth on the default branch (Better Auth).
 *
 * Prints Neon Auth keys once; store pub_client_key / secret_server_key securely.
 */
import "dotenv/config";
import {
  createApiClient,
  NeonAuthSupportedAuthProvider,
} from "@neondatabase/api-client";

import { createProjectWithOperations, getProductionBranchId } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const orgId = process.env.NEON_ORG_ID;
const name =
  process.env.NEON_PROJECT_NAME?.trim() || `tenant-auth-${Date.now()}`;
const authDb = process.env.NEON_AUTH_DATABASE_NAME?.trim();

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

const prodBranchId = await getProductionBranchId(api, projectId);
if (!prodBranchId) {
  console.error(
    JSON.stringify(
      { error: "No production branch after create", projectId },
      null,
      2,
    ),
  );
  process.exit(1);
}

const { data: neonAuth } = await api.createNeonAuth(projectId, prodBranchId, {
  auth_provider: NeonAuthSupportedAuthProvider.BetterAuth,
  ...(authDb ? { database_name: authDb } : {}),
});

console.error(
  "[neon-auth] Keys below are shown once by Neon; save pub_client_key and secret_server_key.",
);

console.log(
  JSON.stringify(
    {
      projectId,
      branchId: prodBranchId,
      databaseUrl,
      name,
      neonAuth,
    },
    null,
    2,
  ),
);
