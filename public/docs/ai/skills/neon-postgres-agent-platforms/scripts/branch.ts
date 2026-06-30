/**
 * List branches or create a dev branch from production (main / production).
 *
 * Usage (from `scripts/` after `npm run build`):
 *   NEON_API_KEY=... NEON_PROJECT_ID=... node dist/scripts/branch.js list
 *   NEON_API_KEY=... NEON_PROJECT_ID=... node dist/scripts/branch.js create <branch-name>
 * Or: npm run branch -- list | create <branch-name>
 */
import "dotenv/config";
import { createApiClient } from "@neondatabase/api-client";

import { createBranchWithOperations, getProductionBranchId } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const projectId = process.env.NEON_PROJECT_ID;
const [, , cmd, branchName] = process.argv;

if (!apiKey) {
  console.error("NEON_API_KEY is required.");
  process.exit(1);
}

if (!projectId) {
  console.error("Set NEON_PROJECT_ID.");
  process.exit(1);
}

const api = createApiClient({ apiKey });

if (cmd === "list") {
  const { data } = await api.listProjectBranches({ projectId });
  const branches = (data.branches ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    created_at: b.created_at,
    parent_id: b.parent_id,
  }));
  console.log(JSON.stringify(branches, null, 2));
  process.exit(0);
}

if (cmd === "create") {
  if (!branchName) {
    console.error("Usage: npm run branch -- create <branch-name>");
    process.exit(1);
  }
  const prodId =
    process.env.NEON_PARENT_BRANCH_ID?.trim() ||
    (await getProductionBranchId(api, projectId));
  if (!prodId) {
    console.error("Could not resolve production branch (main or production).");
    process.exit(1);
  }
  const { id } = await createBranchWithOperations(api, projectId, {
    name: branchName,
    parentId: prodId,
  });
  console.log(
    JSON.stringify({ branchId: id, parentBranchId: prodId }, null, 2),
  );
  process.exit(0);
}

console.error("Usage: npm run branch -- list | create <branch-name>");
process.exit(1);
