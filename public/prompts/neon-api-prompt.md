# AI Prompt: Getting Started with the Neon API

**Role:** You are an expert software agent helping the user get started with the Neon API to programmatically manage Neon Postgres projects, branches, databases, and other resources.

**Purpose:** To guide the user through getting an API key and making their first successful API call.

**When to use this prompt:** Copy and paste this into your AI assistant when you want to:
- Get set up with a Neon API key for the first time
- Make your first API call to verify everything works
- Understand the basics of Neon API authentication

---

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
| **Personal API Key** | All projects you own or have access to | Getting started, personal scripts |
| **Organization API Key** | All projects in an organization | Team automation, CI/CD |
| **Project-scoped API Key** | Single project only | Limited-access integrations |

For getting started, a **Personal API Key** is what you need.

---

## Step 2: Make Your First API Call

First, set your API key as an environment variable:

```bash
export NEON_API_KEY="neon_api_key_your_key_here"
```

Then choose your preferred method:

### Option A: Using curl

```bash
curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

### Option B: Using the TypeScript SDK

```bash
npm install @neondatabase/api-client
```

```typescript
import { createApiClient } from '@neondatabase/api-client';

const apiClient = createApiClient({
  apiKey: process.env.NEON_API_KEY!,
});

const response = await apiClient.listProjects({});
console.log(response.data.projects);
```

### Option C: Using the Python SDK

```bash
pip install neon-api
```

```python
import os
from neon_api import NeonAPI

neon = NeonAPI(api_key=os.environ["NEON_API_KEY"])

projects = neon.projects()
print(projects)
```

### Expected Result

All three options return your projects:

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
- `Connection error` (SDK) — Verify the package is installed and your API key environment variable is set

---

## Next Steps

Once your first API call works, here are common operations:

### Create a Branch

Use the `project_id` from the list projects response:

**curl:**
```bash
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/branches' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"branch": {"name": "dev-branch"}}'
```

**TypeScript SDK:**
```typescript
const response = await apiClient.createProjectBranch('project-id-here', {
  branch: { name: 'dev-branch' },
});
console.log(response.data.branch);
```

**Python SDK:**
```python
branch = neon.branch_create(
    project_id="project-id-here",
    branch={"name": "dev-branch"}
)
print(branch)
```

---

## Key Resources

- **Interactive API Reference:** https://api-docs.neon.tech/reference/getting-started-with-neon-api (try endpoints directly)
- **Full API Documentation:** https://neon.tech/docs/reference/api-reference
- **SDKs:** https://neon.tech/docs/reference/sdk
- **Comprehensive AI Rules:** https://neon.tech/docs/ai/ai-rules-neon-api (for deeper AI integration)

---

## Validation Rules for AI

When helping with Neon API requests:

- Always include the `Authorization: Bearer` header
- Use environment variables for API keys — never hardcode them
- Replace `{project_id}`, `{branch_id}`, etc. with actual IDs from previous responses
- If a request returns 401, check the API key format and value
- If a request returns 429, the user has hit rate limits (700 req/min) — suggest waiting
