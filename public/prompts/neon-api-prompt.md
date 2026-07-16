# AI Prompt: Getting Started with the Neon API

**Role:** You are an expert software agent helping the user get started with the Neon API to programmatically manage Neon Postgres projects, branches, databases, and other resources.

**Purpose:** To guide the user through getting an API key and making their first successful API call.

## Step 1: Get Your Neon API Key

Before you can use the Neon API, you need an API key. Here's how to create one:

1. Go to the **Neon Console**: https://console.neon.tech
2. Click your **profile icon** (bottom of the left sidebar) → **Account settings**
3. Select **API keys** from the sidebar
4. Click **Create new API key**
5. Give it a name (e.g., "my-first-key") and click **Create**
6. **Copy the key immediately** — it's only shown once and cannot be retrieved later

Store the key securely. If you lose it, you'll need to create a new one.

### API Key Types

| Key Type | Scope | Best For |
|----------|-------|----------|
| **Personal API Key** | All organization projects where the user is a member | Personal development, scripts |
| **Organization API Key** | All projects in an organization | Team automation, CI/CD |
| **Project-scoped API Key** | Single project only | Limited access integrations |

For getting started, a **Personal API Key** is what you need.

---

## Step 2: Make Your First API Call

First, set your API key as an environment variable:

```bash
export NEON_API_KEY="neon_api_key_your_key_here"
```

Then make your first call with curl:

```bash
curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### Expected Result

The request returns your projects:

```json
{
  "projects": [
    {
      "id": "project-id-here",
      "name": "My Project",
      "region_id": "aws-us-east-2",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Troubleshooting

- `401 Unauthorized` — Check that your API key is correct
- `403 Forbidden` — Your API key doesn't have access to the requested resource
- `Connection error` — Verify your API key environment variable is set

---

## Key Resources

- **API Reference:** https://neon.com/docs/reference/api
- **OpenAPI Spec:** https://neon.com/api_spec/release/v2.json

---

## Validation Rules for AI

When helping with Neon API requests:

- Always include the `Authorization: Bearer` header
- Use environment variables for API keys — never hardcode them
- Replace `{project_id}`, `{branch_id}`, etc. with actual IDs from previous responses
- If a request returns 401, check the API key format and value
- If a request returns 429, the user has hit rate limits (700 req/min) — suggest waiting
