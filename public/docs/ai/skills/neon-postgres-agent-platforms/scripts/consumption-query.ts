/**
 * GET /consumption_history/v2/projects: usage-based metrics aligned with billing.
 *
 * `metrics` query parameter: comma-separated or repeated; each value must be one of:
 * `compute_unit_seconds`, `root_branch_bytes_month`, `child_branch_bytes_month`,
 * `instant_restore_bytes_month`, `snapshot_storage_bytes_month`,
 * `public_network_transfer_bytes`, `private_network_transfer_bytes`, `extra_branches_month`.
 *
 * Do not use legacy `GET /consumption_history/account` for new work; it is deprecated with a planned
 * sunset of **2026-06-01** — use this v2 project endpoint (or legacy per-project metrics only if you
 * still need legacy fields). See Neon’s consumption docs.
 * @see https://neon.com/docs/guides/consumption-metrics
 * @see https://neon.com/docs/guides/consumption-metrics-legacy
 */
import "dotenv/config";
import {
  ConsumptionHistoryGranularity,
  createApiClient,
} from "@neondatabase/api-client";

const apiKey = process.env.NEON_API_KEY?.trim();
const orgId = process.env.NEON_ORG_ID;
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
      .map((s: string) => s.trim())
      .filter(Boolean)
  : DEFAULT_METRICS;

const projectIdsRaw = process.env.CONSUMPTION_PROJECT_IDS;
const projectIds = projectIdsRaw
  ? projectIdsRaw
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean)
  : undefined;

const GRANULARITY_BY_ENV: Record<string, ConsumptionHistoryGranularity> = {
  hourly: ConsumptionHistoryGranularity.Hourly,
  daily: ConsumptionHistoryGranularity.Daily,
  monthly: ConsumptionHistoryGranularity.Monthly,
};

if (!apiKey || !orgId || !from || !to) {
  console.error(
    "Set NEON_API_KEY, NEON_ORG_ID, CONSUMPTION_FROM, CONSUMPTION_TO (RFC 3339). Optional: CONSUMPTION_GRANULARITY, CONSUMPTION_METRICS (comma list), CONSUMPTION_PROJECT_IDS.",
  );
  process.exit(1);
}

const granularity = GRANULARITY_BY_ENV[granularityRaw];
if (granularity === undefined) {
  console.error("CONSUMPTION_GRANULARITY must be hourly, daily, or monthly.");
  process.exit(1);
}

const api = createApiClient({ apiKey });
const { data } = await api.getConsumptionHistoryPerProjectV2({
  org_id: orgId,
  from,
  to,
  granularity,
  metrics,
  project_ids: projectIds,
  limit: process.env.CONSUMPTION_LIMIT
    ? Number(process.env.CONSUMPTION_LIMIT)
    : undefined,
  cursor: process.env.CONSUMPTION_CURSOR || undefined,
});

console.log(JSON.stringify(data, null, 2));
