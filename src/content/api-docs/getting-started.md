Make your first Neon API request in under two minutes.

## 1. Get an API key

Open the [Neon Console](https://console.neon.tech), go to **Account settings > API keys**, and create a key.

> [!WARNING]
> Neon shows the key once. Copy it now; you cannot retrieve it later.

Neon supports three key scopes. Pick the narrowest one that fits:

| Scope | Access | Best for |
| --- | --- | --- |
| Personal | All projects you own or have access to | Personal scripts and development |
| Organization | All projects in an organization | Team automation and CI/CD |
| Project-scoped | A single project | Limited-access integrations |

See [Manage API keys](https://neon.com/docs/manage/api-keys) for the full rules.

```bash
export NEON_API_KEY="neon_api_..."
```

## 2. Authenticate

Send your key as a Bearer token in the `Authorization` header on every request:

```
Authorization: Bearer <your-api-key>
```

## 3. Make your first request

List the projects on your account to confirm the key works:

```bash
curl https://console.neon.tech/api/v2/projects \
  --header "Authorization: Bearer $NEON_API_KEY"
```

The response lists your projects:

```json
{
  "projects": [
    {
      "id": "spring-example-302709",
      "name": "my-project",
      "region_id": "aws-us-east-2",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

Use a `project_id` from the response in any follow-up request.

## Rate limits

Neon enforces:

- 700 requests per minute across your account
- 40 requests per second burst per route
- 10 requests per second on `POST /organizations/{org_id}/api_keys`

Exceeding a limit returns `429 Too Many Requests`. Retry with exponential backoff.

## Pagination

List endpoints support cursor pagination via `limit` and `cursor`:

```bash
# First page
curl 'https://console.neon.tech/api/v2/projects?limit=10' \
  --header "Authorization: Bearer $NEON_API_KEY"

# Next page: pass the cursor from the previous response
curl 'https://console.neon.tech/api/v2/projects?limit=10&cursor=...' \
  --header "Authorization: Bearer $NEON_API_KEY"
```

## Asynchronous operations

Many endpoints (create branch, start compute, restore snapshot) return immediately while work continues in the background. The response includes an `operations` array:

```json
"operations": [
  {
    "id": "22acbb37-209b-4b90-a39c-8460090e1329",
    "action": "create_branch",
    "status": "running"
  }
]
```

Status values: `scheduling`, `running`, `finished`, `failed`, `cancelling`, `cancelled`, `skipped`.

Poll the [Operation](#tag/operation) endpoint until `status` is `finished` before issuing follow-up requests that depend on the result.

## SDKs and tools

- [TypeScript SDK](https://neon.com/docs/reference/typescript-sdk). Typed Node.js and browser client.
- [Python SDK](https://neon.com/docs/reference/python-sdk). Pythonic wrapper for the Neon API.
- [@neondatabase/toolkit](https://neon.com/docs/reference/neondatabase-toolkit). API client plus serverless driver, tuned for AI agents.
- [Neon CLI](https://neon.com/docs/reference/neon-cli). Terminal access to the same API.
- [Neon MCP Server](https://neon.com/docs/ai/neon-mcp-server). Natural-language control of the Neon API from AI assistants like Cursor and Claude.
