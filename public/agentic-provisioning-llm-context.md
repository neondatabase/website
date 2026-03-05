# Agentic provisioning – LLM context

> Context for LLMs and agents: agentic provisioning with Neon. Full documentation index: [neon.com/docs/llms.txt](https://neon.com/docs/llms.txt)

## Purpose

This page explains how to use the **API key** returned from the Agentic Provisioning Protocol (APP) account request to interact with Neon: create and manage projects, create branches for existing projects, get connection strings, and work with your Neon database via the Neon API.

---

## Where the API key comes from

In the APP flow, the **orchestrator** (e.g. Stripe) calls the provider (Neon) to create or link an account for the developer:

- **Endpoint:** `POST <provider_base_url>/provisioning/account_requests`
- **Response (success):** `type: "credentials"` with:
  - **`credentials.access_token`** — This is the **user-scoped API key** (Bearer token). Use it for all Neon API and provisioning calls for this user.
  - **`credentials.account.id`** — The account (user) identifier.

Use this key for **all user operations**: creating and managing projects, branches, databases, and getting connection strings.

---

## How to use the API key

1. **Send it on every request**  
   Use HTTP Bearer authentication with the Neon API:

   ```http
   Authorization: Bearer <access_token>
   ```

   Use the same header when calling APP provisioning endpoints that act on the developer’s account (e.g. `POST .../provisioning/resources`).

2. **Neon API base URL**  
   All Neon API requests use:

   ```text
   https://console.neon.tech/api/v2/
   ```

   Example: list the user's projects:

   ```bash
   curl 'https://console.neon.tech/api/v2/projects' \
     -H 'Accept: application/json' \
     -H "Authorization: Bearer $NEON_API_KEY"
   ```

   (Replace `$NEON_API_KEY` with the `access_token` from the account request.)

---

## Creating branches for existing projects

Use the user-scoped API key to create branches under any project the user has access to.

- **Create a branch:**  
  `POST /projects/{project_id}/branches`

  Optional body: `branch.parent_id` (branch ID to branch from; omit to use the project’s default branch), `endpoints` (e.g. `[{ "type": "read_write" }]` to get a compute for the branch). Without a body, a branch is created from the default branch and no compute is created.

  Example:

  ```bash
  curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/branches' \
    -H 'Accept: application/json' \
    -H "Authorization: Bearer $NEON_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{"endpoints":[{"type":"read_write"}],"branch":{}}'
  ```

- **List branches:**  
  `GET /projects/{project_id}/branches`  
  Returns all branches for the project; use branch `id` (e.g. `br-...`) when getting connection URIs or creating child branches.

- **Get connection string for a branch:**  
  `GET /projects/{project_id}/connection_uri`  
  Query params (optional): `branch_id`, `database_name`, `role_name`, `pooled`.  
  Returns a Postgres connection string for that branch (and optionally database/role). Each branch has its own connection string.

---

## Other useful operations with the API key

| Action | Method and path |
|--------|------------------|
| List user's projects | `GET /projects` |
| Create a project | `POST /projects` (body: e.g. `name`, `region_id`, `pg_version`) |
| Get connection URI (default branch) | `GET /projects/{project_id}/connection_uri` |
| Get connection URI for a branch | `GET /projects/{project_id}/connection_uri?branch_id={branch_id}` |
| Create branch | `POST /projects/{project_id}/branches` |
| List branches | `GET /projects/{project_id}/branches` |
| Delete branch | `DELETE /projects/{project_id}/branches/{branch_id}` |
| List databases on a branch | `GET /projects/{project_id}/branches/{branch_id}/databases` |
| Create database on a branch | `POST /projects/{project_id}/branches/{branch_id}/databases` |
| List roles on a branch | `GET /projects/{project_id}/branches/{branch_id}/roles` |

The API key is **user-scoped** and is used for all user operations. Use the same `Authorization: Bearer <access_token>` for all of these calls.

---

## Provisioning resources (APP)

When the orchestrator provisions a **resource** (`POST .../provisioning/resources`), it sends the same Bearer token so the provider knows which user account to create the resource for. The response may include `access_configuration` with e.g. `connection_string`, `project_id`, `branch_id`, or (in an org-as-resource model) `api_key` and `api_base_url`. Use the returned details together with the same API key to create additional branches or projects as needed.

---

## References

- **Neon API reference:** [api-docs.neon.tech](https://api-docs.neon.tech/) — full endpoint list, request/response shapes, and parameters.
- **Docs index (Markdown):** [neon.com/docs/llms.txt](https://neon.com/docs/llms.txt) — browsable list of Neon documentation URLs.
- **Neon:** [neon.tech](https://neon.tech) — serverless Postgres.
