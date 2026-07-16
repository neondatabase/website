/**
 * Snapshot-based promotion workflow from:
 * https://neon.com/blog/promoting-postgres-changes-safely-production
 *
 * Usage (from `scripts/` after `npm run build`):
 *   npm run promote-safe -- <subcommand>
 *   node dist/scripts/promote-safe-production.js <subcommand>
 */
import "dotenv/config";
import { getProductionBranchId, neonClient } from "./utils.js";

const apiKey = process.env.NEON_API_KEY?.trim();
const projectIdEnv = process.env.NEON_PROJECT_ID;
const [, , sub] = process.argv;

function usage(): void {
  console.error(`Usage: npm run promote-safe -- <bootstrap-dev|promote|refresh-dev|rollback-prod>

See https://neon.com/blog/promoting-postgres-changes-safely-production
`);
}

if (!apiKey || !projectIdEnv) {
  console.error("Set NEON_API_KEY and NEON_PROJECT_ID.");
  usage();
  process.exit(1);
}

const projectId: string = projectIdEnv;

if (!sub) {
  usage();
  process.exit(1);
}

const neon = neonClient(apiKey);

async function prodBranchId(): Promise<string> {
  const id = process.env.NEON_PROD_BRANCH_ID?.trim();
  if (id) return id;
  return getProductionBranchId(neon, projectId);
}

const runId = Date.now();

if (sub === "bootstrap-dev") {
  const newName = process.env.NEON_BOOTSTRAP_DEV_BRANCH_NAME?.trim() || "dev";
  const pre = await prodBranchId();
  console.error(
    `[bootstrap-dev] Snapshot production branch, restore as new branch "${newName}"...`,
  );
  const snapshot = await neon.snapshots.create(projectId, pre, {
    name:
      process.env.NEON_SNAPSHOT_BOOTSTRAP_NAME?.trim() ??
      `bootstrap-from-prod-${runId}`,
  });
  // No `targetBranchId` → restore as a new branch.
  const branch = await neon.snapshots.restore(projectId, snapshot.id, {
    name: newName,
  });
  console.log(
    JSON.stringify(
      {
        phase: "bootstrap-dev",
        prodBranchId: pre,
        snapshotFromProdId: snapshot.id,
        newDevBranchId: branch.id,
        newDevBranchName: newName,
        note: "Point dev workloads at newDevBranchId; cleanup orphaned branches in Console if needed.",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

if (sub === "promote") {
  const devBranchId = process.env.NEON_DEV_BRANCH_ID?.trim();
  if (!devBranchId) {
    console.error(
      "Set NEON_DEV_BRANCH_ID (branch whose state you promote to production).",
    );
    process.exit(1);
  }
  const prodId = await prodBranchId();
  const preName =
    process.env.NEON_SNAPSHOT_PRE_PROMOTION_NAME?.trim() ??
    `prod_snap_${runId}_pre_promotion`;
  const candName =
    process.env.NEON_SNAPSHOT_DEV_CANDIDATE_NAME?.trim() ??
    `dev_snap_${runId}_candidate`;

  console.error("[promote] 1/3 Snapshot prod (rollback point)...");
  const rollback = await neon.snapshots.create(projectId, prodId, {
    name: preName,
  });

  console.error("[promote] 2/3 Snapshot dev (candidate to publish)...");
  const candidate = await neon.snapshots.create(projectId, devBranchId, {
    name: candName,
  });

  console.error(
    "[promote] 3/3 Restore dev snapshot onto prod (finalize); brief connection drop on prod...",
  );
  await neon.snapshots.restore(projectId, candidate.id, {
    targetBranchId: prodId,
    finalize: true,
    name:
      process.env.NEON_RESTORE_BACKUP_BRANCH_NAME ?? `before_promote_${runId}`,
  });

  console.error(
    "[promote] Done. Re-fetch prod branch id after finalize if you store it (Neon may rotate branch id).",
  );
  console.log(
    JSON.stringify(
      {
        phase: "promote",
        prodBranchIdBeforeNote: prodId,
        rollbackSnapshotId: rollback.id,
        promotedSnapshotId: candidate.id,
        warning:
          "Production writes after rollbackSnapId was taken are not included. Delete orphaned backup branches when ready.",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

if (sub === "refresh-dev") {
  const devBranchId = process.env.NEON_DEV_BRANCH_ID?.trim();
  if (!devBranchId) {
    console.error(
      "Set NEON_DEV_BRANCH_ID (branch to refresh from current prod).",
    );
    process.exit(1);
  }
  const prodId = await prodBranchId();
  const snapName =
    process.env.NEON_SNAPSHOT_REFRESH_NAME?.trim() ??
    `prod_snap_${runId}_refresh_dev`;

  console.error("[refresh-dev] 1/2 Snapshot prod...");
  const prodSnap = await neon.snapshots.create(projectId, prodId, {
    name: snapName,
  });

  console.error("[refresh-dev] 2/2 Restore prod snapshot onto dev...");
  await neon.snapshots.restore(projectId, prodSnap.id, {
    targetBranchId: devBranchId,
    finalize: true,
    name:
      process.env.NEON_RESTORE_BACKUP_BRANCH_NAME ??
      `before_refresh_dev_${runId}`,
  });

  console.log(
    JSON.stringify(
      {
        phase: "refresh-dev",
        prodBranchId: prodId,
        devBranchId,
        prodSnapshotId: prodSnap.id,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

if (sub === "rollback-prod") {
  const snap = process.env.NEON_SNAPSHOT_ID?.trim();
  if (!snap) {
    console.error(
      "Set NEON_SNAPSHOT_ID (e.g. pre-promotion rollback snapshot id).",
    );
    process.exit(1);
  }
  const prodId = await prodBranchId();

  console.error("[rollback-prod] Restore snapshot onto prod...");
  await neon.snapshots.restore(projectId, snap, {
    targetBranchId: prodId,
    finalize: true,
    name:
      process.env.NEON_RESTORE_BACKUP_BRANCH_NAME ?? `before_rollback_${runId}`,
  });

  console.log(
    JSON.stringify(
      {
        phase: "rollback-prod",
        prodBranchId: prodId,
        restoredFromSnapshotId: snap,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

console.error(`Unknown subcommand: ${sub}`);
usage();
process.exit(1);
