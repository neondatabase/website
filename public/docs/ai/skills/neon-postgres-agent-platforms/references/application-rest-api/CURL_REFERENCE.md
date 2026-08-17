# Application REST API: curl reference

These `**curl**` examples are for an **application’s own HTTP API** (your product server), **not** Neon’s Management API. Route shapes mirror a common **Next.js App Router** layout (`src/app/api/.../route.ts`) so you can map URLs to handlers in your codebase. See **[COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md](../COMPOUND_CHECKPOINTS_FOR_AGENT_PLATFORMS.md)** for what a platform-owned checkpoint should bind together beyond a Neon branch id.

Use **`APP_BASE_URL=http://localhost:3000`** (or your dev URL). Do **not** point these at Neon **`console.neon.tech`**; control-plane scripts are documented in **[README.md](../../../../README.md)** and **[MANAGEMENT_API_SAMPLES.md](../MANAGEMENT_API_SAMPLES.md)**.

## Auth

Authenticated routes typically expect a **browser session cookie** (or bearer token), not `NEON_API_KEY`. For `curl`, paste a `Cookie` or `Authorization` header from DevTools after signing in (keep it out of git), or expect `**401 Unauthorized`** when omitting it, still useful to verify the route exists.

## Example handler paths (adjust for your app)


| Method | Path                                      | Example source file                                       |
| ------ | ----------------------------------------- | --------------------------------------------------------- |
| `GET`  | `/api/v1/models`                          | `src/app/api/v1/models/route.ts`                          |
| `POST` | `/api/v1/projects`                        | `src/app/api/v1/projects/route.ts`                        |
| `GET`  | `/api/v1/projects/{projectId}/versions`   | `src/app/api/v1/projects/[projectId]/versions/route.ts`   |
| `POST` | `/api/v1/projects/{projectId}/checkpoint` | `src/app/api/v1/projects/[projectId]/checkpoint/route.ts` |
| `POST` | `/api/v1/projects/{projectId}/versions`   | Same `versions/route.ts` (`POST` restores a version)      |


There is **no** dedicated `/health` route in this illustration; add one in your app if you need probes, or treat `**GET /api/v1/models`** as an authenticated liveness check against your stack.

## Run

From the **repository root**:

```bash
cd skills/neon-postgres-agent-platforms/references/application-rest-api
chmod +x curl-examples.sh   # once
./curl-examples.sh
```

Optional env (see `[.env.example](.env.example)` in this folder or `[../../../scripts/.env.example](../../../scripts/.env.example)` for Neon keys): `APP_BASE_URL`, `APP_PROJECT_ID`, `APP_VERSION_ID`, `STACK_SESSION_COOKIE`.