---
title: Get started with Neon AI Gateway
subtitle: Make your first inference request in minutes
summary: >-
  This quickstart walks you through getting a credential, finding your branch
  host, and making your first request to the Neon AI Gateway using the OpenAI
  SDK. No provider API keys required. Authenticate with your Neon credential.
enableTableOfContents: true
updatedOn: '2026-06-08T17:01:35.240Z'
---

<Admonition type="note" title="Private Preview">
Neon AI Gateway is currently in Private Preview. To request access, sign up at [We're building backends](https://neon.com/blog/were-building-backends). Foundation model access requires a paid Neon plan.
</Admonition>

<Steps>

## Get access

Neon AI Gateway is invite-only during Private Preview. Sign up for the waitlist at [We're building backends](https://neon.com/blog/were-building-backends). You'll receive an email and a Discord invite when your account is enabled.

## Create a credential

Use the Neon API to create a credential with the `ai_gateway:invoke` scope:

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"scopes": ["ai_gateway:invoke"], "principal_type": "user"}'
```

The response includes an `api_token` field. That is your credential. Store it as an environment variable:

```bash
export NEON_AI_GATEWAY_KEY=nt_live_...
```

Your project ID and branch ID are available in the Neon Console URL or via `neonctl projects list` and `neonctl branches list`.

## Find your branch host

Your branch's AI Gateway host is available in the Neon Console on the AI Gateway page, or via the Neon API. It follows this format:

```
br-<name>-api.<cell>.<region>.aws.neon.tech
```

For example:

```bash
export NEON_AI_GATEWAY_HOST=br-winter-pond-aptw82ef-api.c2.us-east-2.aws.neon.tech
```

This is different from your database connection string.

## Install dependencies

<CodeTabs labels={["npm", "yarn", "pnpm", "pip"]}>

```bash
npm install openai dotenv
```

```bash
yarn add openai dotenv
```

```bash
pnpm add openai dotenv
```

```bash
pip install openai python-dotenv
```

</CodeTabs>

## Make your first request

The chat completions endpoint is OpenAI-compatible. Set `baseURL` to your branch host and `apiKey` to your credential. No other changes needed.

<CodeTabs labels={["TypeScript", "Python", "cURL"]}>

```typescript shouldWrap
import OpenAI from 'openai';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_KEY,
  baseURL: `https://${process.env.NEON_AI_GATEWAY_HOST}/ai-gateway/mlflow/v1`,
});

const response = await client.chat.completions.create({
  model: 'databricks-claude-sonnet-4-6',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);
```

```python shouldWrap
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_KEY"],
    base_url=f"https://{os.environ['NEON_AI_GATEWAY_HOST']}/ai-gateway/mlflow/v1",
)

response = client.chat.completions.create(
    model="databricks-claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Hello!"}],
)

print(response.choices[0].message.content)
```

```bash shouldWrap
curl -X POST "https://$NEON_AI_GATEWAY_HOST/ai-gateway/mlflow/v1/chat/completions" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "databricks-claude-sonnet-4-6",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

</CodeTabs>

## Stream a response

Add `stream: true` to receive a streamed response. Your existing streaming code works without changes. The gateway forwards `text/event-stream` responses from the upstream provider.

<CodeTabs labels={["TypeScript", "Python", "cURL"]}>

```typescript shouldWrap
import OpenAI from 'openai';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_KEY,
  baseURL: `https://${process.env.NEON_AI_GATEWAY_HOST}/ai-gateway/mlflow/v1`,
});

const stream = await client.chat.completions.create({
  model: 'databricks-claude-sonnet-4-6',
  messages: [{ role: 'user', content: 'Write a haiku about serverless databases.' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}
```

```python shouldWrap
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_KEY"],
    base_url=f"https://{os.environ['NEON_AI_GATEWAY_HOST']}/ai-gateway/mlflow/v1",
)

with client.chat.completions.create(
    model="databricks-claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Write a haiku about serverless databases."}],
    stream=True,
) as stream:
    for chunk in stream:
        print(chunk.choices[0].delta.content or "", end="", flush=True)
```

```bash shouldWrap
curl -X POST "https://$NEON_AI_GATEWAY_HOST/ai-gateway/mlflow/v1/chat/completions" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "databricks-claude-sonnet-4-6",
    "messages": [{"role": "user", "content": "Write a haiku about serverless databases."}],
    "stream": true
  }'
```

</CodeTabs>

## Swap models

Change the `model` field to use a different provider. No other code changes required.

```typescript
// Anthropic
model: 'databricks-claude-sonnet-4-6'

// OpenAI
model: 'databricks-gpt-5-4'

// Google
model: 'databricks-gemini-2-5-flash'
```

See [Models](/docs/ai-gateway/models) for the full list of available model IDs.

</Steps>

## Next steps

- [Models](/docs/ai-gateway/models) — full model catalog and which endpoint to use per provider
- [Chat completions](/docs/ai-gateway/chat-completions) — detailed reference for the unified endpoint
- [Anthropic Messages API](/docs/ai-gateway/anthropic-messages) — native Anthropic features including extended thinking and prompt caching
- [Authentication](/docs/ai-gateway/authentication) — credential scopes, branch binding, and rotation

<NeedHelp/>
