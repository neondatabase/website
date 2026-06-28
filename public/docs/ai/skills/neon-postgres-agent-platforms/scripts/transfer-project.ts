/**
 * Transfer one or more projects from a source org to a destination org (e.g. free / sponsored → paid).
 * Personal API key with access to both orgs; see Neon docs on org project transfer.
 *
 * Projects with GitHub or Vercel integrations cannot be transferred; the API returns **422** in that case.
 * @see https://neon.com/docs/manage/orgs-project-transfer
 */
import "dotenv/config";
import { createApiClient } from "@neondatabase/api-client";

const apiKey = process.env.NEON_API_KEY?.trim();
const sourceOrgId = process.env.NEON_SOURCE_ORG_ID;
const destinationOrgId = process.env.NEON_DESTINATION_ORG_ID;
const rawIds =
  process.env.NEON_PROJECT_IDS || process.env.NEON_PROJECT_ID || "";

if (!apiKey || !sourceOrgId || !destinationOrgId || !rawIds.trim()) {
  console.error(
    "Set NEON_API_KEY, NEON_SOURCE_ORG_ID, NEON_DESTINATION_ORG_ID, and NEON_PROJECT_IDS (comma-separated) or NEON_PROJECT_ID.",
  );
  process.exit(1);
}

const projectIds = rawIds
  .split(",")
  .map((s: string) => s.trim())
  .filter(Boolean);

const api = createApiClient({ apiKey });
await api.transferProjectsFromOrgToOrg(sourceOrgId, {
  destination_org_id: destinationOrgId,
  project_ids: projectIds,
});
console.log(
  JSON.stringify(
    {
      ok: true,
      transferred: projectIds,
      sourceOrgId,
      destinationOrgId,
    },
    null,
    2,
  ),
);
