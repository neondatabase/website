# Neon REST API

Essentials for making direct HTTP requests to the Neon Platform API.

See the [official API reference](https://neon.com/docs/reference/api-reference.md) for complete details.

## OpenAPI Specification

The full [OpenAPI spec](https://neon.com/api_spec/release/v2.json) is available for programmatic lookup of exact endpoints, request/response schemas, and required fields.

## Base URL

```
https://console.neon.tech/api/v2/
```

## Authentication

Include a Neon API key in every request:

```
Authorization: Bearer $NEON_API_KEY
```

### API Key Types

| Type           | Scope                           | Best For                      |
| -------------- | ------------------------------- | ----------------------------- |
| Personal       | All projects user has access to | Individual use, scripting     |
| Organization   | Entire organization             | CI/CD, org-wide automation    |
| Project-scoped | Single project only             | Project-specific integrations |

## Rate Limits

- 700 requests/minute (~11/second)
- Bursts up to 40 requests/second per route
- Handle `429 Too Many Requests` with retry + backoff

## Common Endpoints

| Operation          | Method   | Path                                                     |
| ------------------ | -------- | -------------------------------------------------------- |
| List projects      | `GET`    | `/projects?org_id={org_id}`                              |
| List user orgs     | `GET`    | `/users/me/organizations`                                |
| Create project     | `POST`   | `/projects` (include `org_id` in body)                   |
| Get connection URI | `GET`    | `/projects/{project_id}/connection_uri`                  |
| Create branch      | `POST`   | `/projects/{project_id}/branches`                        |
| List branches      | `GET`    | `/projects/{project_id}/branches`                        |
| Delete branch      | `DELETE` | `/projects/{project_id}/branches/{branch_id}`            |
| Start endpoint     | `POST`   | `/projects/{project_id}/endpoints/{endpoint_id}/start`   |
| Suspend endpoint   | `POST`   | `/projects/{project_id}/endpoints/{endpoint_id}/suspend` |
| List databases     | `GET`    | `/projects/{project_id}/branches/{branch_id}/databases`  |
| Create database    | `POST`   | `/projects/{project_id}/branches/{branch_id}/databases`  |
| List roles         | `GET`    | `/projects/{project_id}/branches/{branch_id}/roles`      |
| List API keys      | `GET`    | `/api_keys`                                              |
| List operations    | `GET`    | `/projects/{project_id}/operations`                      |

## Important Constraints

- You **cannot delete** a project's root or default branch
- You **cannot delete** a branch that has child branches — delete all children first
- Creating a new role may **drop existing connections** to the active compute endpoint
- A branch can have only one `read_write` endpoint but multiple `read_only` endpoints
- Operations are async — poll operation status before starting dependent operations
- Operations older than 6 months may be deleted from Neon's systems
- The first API key must be created from the [Neon Console](https://console.neon.tech/app/settings/api-keys); subsequent keys can be created via the API

## Error Codes

| Status | Meaning      | Action                   |
| ------ | ------------ | ------------------------ |
| 401    | Unauthorized | Check API key            |
| 404    | Not Found    | Verify resource ID       |
| 429    | Rate Limited | Retry with backoff       |
| 500    | Server Error | Retry or contact support |

For TypeScript SDK usage, see `neon-typescript-sdk.md`. For Python SDK, see `neon-python-sdk.md`.
