---
title: Get started with the Neon API
summary: >-
  Create a Neon API key, authenticate with the REST API, and make your first
  request to list projects using curl.
enableTableOfContents: true
redirectFrom:
  - /docs/reference/api/getting-started
---

<CopyPrompt src="/prompts/neon-api-prompt.md" title="AI prompt: Get started with the Neon API" description="Copy into your AI assistant to get an API key and make your first API call."/>

The Neon API uses API keys and Bearer authentication. This page shows the shortest REST API path: create a key, set it as an environment variable, and call the `/projects` endpoint.

## Get an API key

Create an API key in the Neon Console under **Account settings** > **API keys**. For detailed instructions and security best practices, see [Manage API keys](/docs/manage/api-keys).

Neon supports three API key types:

| Key type                   | Scope                                                | Best for                      |
| -------------------------- | ---------------------------------------------------- | ----------------------------- |
| **Personal API key**       | All organization projects where the user is a member | Personal development, scripts |
| **Organization API key**   | All projects within an organization                  | Team automation, CI/CD        |
| **Project-scoped API key** | Single project only                                  | Limited access integrations   |

<Admonition type="important">
API key tokens are shown only once at creation. Store them securely because you can't retrieve them later.
</Admonition>

## Base URL and authentication

All API requests use this base URL:

```text
https://console.neon.tech/api/v2/
```

Include your API key in the `Authorization` header using Bearer authentication:

```bash
-H "Authorization: Bearer $NEON_API_KEY"
```

## Make your first request

Set your API key as an environment variable, then list your projects:

```bash
export NEON_API_KEY="your-api-key-here"

curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" | jq
```

The response includes your projects with their IDs, regions, and other details:

```json
{
  "projects": [
    {
      "id": "spring-example-302709",
      "name": "my-project",
      "region_id": "aws-us-east-2",
      "pg_version": 17,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { "cursor": "eyJsaW1pdCI6MX0" }
}
```

## Next steps

- Use the [endpoint index](/docs/reference/api/reference) to search all generated API operation pages.
- Review [key concepts](/docs/reference/api/key-concepts) before building automation.
- Download the [OpenAPI specification](https://neon.com/api_spec/release/v2.json) for code generation or API tooling.
