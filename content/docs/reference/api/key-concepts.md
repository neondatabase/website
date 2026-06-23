---
title: Neon API key concepts
summary: >-
  Understand asynchronous operations, rate limits, pagination, and important
  constraints before building automation with the Neon API.
enableTableOfContents: true
---

Review these API behavior notes before you build scripts, CI/CD workflows, or control-plane integrations on top of Neon.

## Asynchronous operations

Many Neon API operations, including creating branches and starting computes, are asynchronous. The API response includes an `operations` array with status information:

```json
"operations": [
  {
    "id": "22acbb37-209b-4b90-a39c-8460090e1329",
    "action": "create_branch",
    "status": "running"
  }
]
```

Status values include `scheduling`, `running`, `finished`, `failed`, `cancelling`, `cancelled`, and `skipped`.

When building automation, poll the operation status before proceeding with dependent requests:

```bash
curl 'https://console.neon.tech/api/v2/projects/{project_id}/operations/{operation_id}' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

For details, see [Poll operation status](/docs/manage/operations#poll-operation-status).

## Rate limiting

The Neon API has these rate limits:

- 700 requests per minute, or approximately 11 per second
- 40 requests per second burst limit per route
- 10 requests per second for organization API key creation (`POST /organizations/{org_id}/api_keys`)

Exceeding these limits returns `HTTP 429 Too Many Requests`. Use retry logic with exponential backoff in your applications.

## Pagination

Some list endpoints support cursor-based pagination. Include `limit` and `cursor` parameters:

```bash
# First request with limit
curl 'https://console.neon.tech/api/v2/projects?limit=10' \
  -H "Authorization: Bearer $NEON_API_KEY"

# Subsequent request with cursor from the previous response
curl 'https://console.neon.tech/api/v2/projects?limit=10&cursor=...' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

## Important constraints

Keep these constraints in mind when building automation with the Neon API:

- You can't delete a project's root or default branch.
- You can't delete a branch that has child branches. Delete all children first.
- Creating a new role may drop existing connections to the active compute endpoint.
- A branch can have only one `read_write` endpoint but multiple `read_only` endpoints.
- Neon limits overlapping operations on a project. Requests that try to schedule new work while conflicting operations are still running return `423 Locked`. Retry with exponential backoff, or poll for completion first. See [Handle concurrent operation errors](/docs/manage/operations#handle-concurrent-operation-errors).
- Operations older than 6 months may be removed from Neon's systems.
