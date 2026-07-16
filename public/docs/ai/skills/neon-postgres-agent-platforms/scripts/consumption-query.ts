/**
 * GET /consumption_history/v2/projects: usage-based metrics aligned with billing.
 *
 * `metrics` must each be one of: `compute_unit_seconds`, `root_branch_bytes_month`,
 * `child_branch_bytes_month`, `instant_restore_bytes_month`, `snapshot_storage_bytes_month`,
 * `public_network_transfer_bytes`, `private_network_transfer_bytes`, `extra_branches_month`.
 *
 * The SDK's `consumption.perProjectV2` is cursor-paginated; `.all()` streams every page
 * for you (pass CONSUMPTION_LIMIT to tune the page size).
 * @see https://neon.com/docs/guides/consumption-metrics
 */
import "dotenv/config";
import { neonClient } from "./utils.js";

const GRANULARITIES = ["hourly", "daily", "monthly"] as const;
type Granularity = (typeof GRANULARITIES)[number];

function isGranularity(value: string): value is Granularity {
  return (GRANULARITIES as readonly string[]).includes(value);
}

const apiKey = process.env.NEON_API_KEY?.trim();
const orgId = process.env.NEON_ORG_ID?.trim();
const from = process.env.CONSUMPTION_FROM;
const to = process.env.CONSUMPTION_TO;
const granularityRaw = process.env.CONSUMPTION_GRANULARITY || "daily";

const DEFAULT_METRICS = [
  "compute_unit_seconds",
  "root_branch_bytes_month",
  "child_branch_bytes_month",
  "instant_restore_bytes_month",
  "snapshot_storage_bytes_month",
  "public_network_transfer_bytes",
  "private_network_transfer_bytes",
  "extra_branches_month",
];

const metricsRaw = process.env.CONSUMPTION_METRICS;
const metrics = metricsRaw
  ? metricsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : DEFAULT_METRICS;

const projectIdsRaw = process.env.CONSUMPTION_PROJECT_IDS;
const projectIds = projectIdsRaw
  ? projectIdsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : undefined;

if (!apiKey || !orgId || !from || !to) {
  console.error(
    "Set NEON_API_KEY, NEON_ORG_ID, CONSUMPTION_FROM, CONSUMPTION_TO (RFC 3339). Optional: CONSUMPTION_GRANULARITY, CONSUMPTION_METRICS (comma list), CONSUMPTION_PROJECT_IDS, CONSUMPTION_LIMIT.",
  );
  process.exit(1);
}

if (!isGranularity(granularityRaw)) {
  console.error("CONSUMPTION_GRANULARITY must be hourly, daily, or monthly.");
  process.exit(1);
}

const neon = neonClient(apiKey);
const { data: projects, error } = await neon.consumption
  .perProjectV2({
    org_id: orgId,
    from,
    to,
    granularity: granularityRaw,
    metrics,
    ...(projectIds ? { project_ids: projectIds } : {}),
    ...(process.env.CONSUMPTION_LIMIT
      ? { limit: Number(process.env.CONSUMPTION_LIMIT) }
      : {}),
  })
  .all();
if (error) throw error;

console.log(
  JSON.stringify({ from, to, granularity: granularityRaw, projects }, null, 2),
);
