/**
 * Neon Auth: application users (REST) and how they show up in Postgres.
 *
 * Subcommands:
 *   meta     print [meta] map: REST vs Postgres, doc links
 *   create   POST .../auth/users (needs USER_EMAIL, optional USER_NAME)
 *   delete   DELETE .../auth/users/{id} (needs AUTH_USER_ID)
 */
import "dotenv/config";
import { createApiClient } from "@neondatabase/api-client";

const apiKey = process.env.NEON_API_KEY?.trim();
const projectId = process.env.NEON_PROJECT_ID;
const branchId = process.env.NEON_BRANCH_ID;
const [, , cmd] = process.argv;

function printMeta(): void {
  console.log(
    JSON.stringify(
      {
        title:
          "[meta] Application users (Neon Auth) vs Postgres database roles",
        rest: {
          createUser:
            "POST /api/v2/projects/{project_id}/branches/{branch_id}/auth/users",
          deleteUser:
            "DELETE /api/v2/projects/{project_id}/branches/{branch_id}/auth/users/{auth_user_id}",
          updateRole:
            "PUT /api/v2/projects/{project_id}/branches/{branch_id}/auth/users/{auth_user_id}/role",
          enableAuth:
            "POST /api/v2/projects/{project_id}/branches/{branch_id}/auth",
        },
        postgres: {
          note: "Neon Auth syncs user data into the branch database (default schema `neon_auth`, e.g. table `users_sync`).",
          listUsersExampleSql: "SELECT * FROM neon_auth.users_sync LIMIT 50;",
          rolesNote:
            "Database roles (connection users, privileges) are separate; use SQL or Console (Manage roles), not this REST API.",
        },
        docs: [
          "https://neon.com/docs/neon-auth/api",
          "https://neon.com/docs/auth/guides/user-management",
          "https://neon.com/docs/manage/users",
          "https://api-docs.neon.tech/reference/createbranchneonauthnewuser",
        ],
        envForThisScript: {
          create: [
            "NEON_API_KEY",
            "NEON_PROJECT_ID",
            "NEON_BRANCH_ID",
            "USER_EMAIL",
            "USER_NAME (optional)",
          ],
          delete: [
            "NEON_API_KEY",
            "NEON_PROJECT_ID",
            "NEON_BRANCH_ID",
            "AUTH_USER_ID",
          ],
        },
      },
      null,
      2,
    ),
  );
}

if (cmd === "meta") {
  printMeta();
  process.exit(0);
}

if (!["create", "delete"].includes(cmd ?? "")) {
  console.error(
    "Usage: npm run auth-users -- meta | create | delete\n" +
      "  meta   [meta] REST vs Postgres, links\n" +
      "  create requires USER_EMAIL (and project/branch)\n" +
      "  delete requires AUTH_USER_ID",
  );
  process.exit(1);
}

if (!apiKey) {
  console.error("NEON_API_KEY is required.");
  process.exit(1);
}

if (!projectId || !branchId) {
  console.error("Set NEON_PROJECT_ID and NEON_BRANCH_ID.");
  process.exit(1);
}

const api = createApiClient({ apiKey });

if (cmd === "create") {
  const email = process.env.USER_EMAIL;
  const name = process.env.USER_NAME;
  if (!email) {
    console.error("Set USER_EMAIL for create.");
    process.exit(1);
  }
  const { data } = await api.createBranchNeonAuthNewUser(projectId, branchId, {
    email,
    ...(name ? { name } : {}),
  });
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}

if (cmd === "delete") {
  const authUserId = process.env.AUTH_USER_ID;
  if (!authUserId) {
    console.error("Set AUTH_USER_ID for delete.");
    process.exit(1);
  }
  await api.deleteBranchNeonAuthUser(projectId, branchId, authUserId);
  console.log(JSON.stringify({ ok: true, deleted: authUserId }, null, 2));
  process.exit(0);
}
