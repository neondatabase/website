/**
 * List branches or create a dev branch from production (the default branch).
 *
 * Usage (from `scripts/` after `npm run build`):
 *   NEON_API_KEY=... NEON_PROJECT_ID=... node dist/scripts/branch.js list
 *   NEON_API_KEY=... NEON_PROJECT_ID=... node dist/scripts/branch.js create <branch-name>
 * Or: npm run branch -- list | create <branch-name>
 */
import "dotenv/config";
import { getProductionBranchId, neonClient } from "./utils.js";

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

const neon = neonClient(apiKey);

if (cmd === "list") {
  // `list()` is cursor-paginated; `.all()` concatenates every page.
  const { data: branches, error } = await neon.branches.list(projectId).all();
  if (error) throw error;
  console.log(
    JSON.stringify(
      branches.map((b) => ({
        id: b.id,
        name: b.name,
        created_at: b.created_at,
        parent_id: b.parent_id,
      })),
      null,
      2,
    ),
  );
  process.exit(0);
}

if (cmd === "create") {
  if (!branchName) {
    console.error("Usage: npm run branch -- create <branch-name>");
    process.exit(1);
  }
  const parentId =
    process.env.NEON_PARENT_BRANCH_ID?.trim() ||
    (await getProductionBranchId(neon, projectId));
  const branch = await neon.branches.create(projectId, {
    name: branchName,
    parent_id: parentId,
  });
  console.log(
    JSON.stringify({ branchId: branch.id, parentBranchId: parentId }, null, 2),
  );
  process.exit(0);
}

console.error("Usage: npm run branch -- list | create <branch-name>");
process.exit(1);
