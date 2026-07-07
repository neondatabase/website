---
title: Get started with Neon AI Gateway
subtitle: Make your first inference request in minutes
summary: >-
  This quickstart walks you through getting a credential, finding your branch
  host, and making your first request to the Neon AI Gateway using the OpenAI
  SDK. No provider API keys required. Authenticate with your Neon credential.
enableTableOfContents: true
updatedOn: '2026-07-07T20:11:36.426Z'
---

<PrivatePreviewEnquire/>

<Steps>

## Get access

You need a new project in the AWS us-east-2 region, and foundation model access requires a paid Neon plan. When your account is enabled, you'll receive an email and a Discord invite.

## Create a credential

In the Neon Console, select your branch, click **Credentials** under **APP BACKEND**, then click **Create credential** and check **ai_gateway:invoke**. Copy the credential before closing — it's shown only once.

Or use the API:

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"scopes": ["ai_gateway:invoke"], "principal_type": "user"}'
```

<Callout title="Using neon.ts?">
If your project has a `neon.ts` file, declare `preview: { aiGateway: true }` and run `neon deploy`. Credentials are provisioned and pulled into your local `.env` automatically — no manual creation needed. See [Authentication](/docs/ai-gateway/authentication) for details.
</Callout>

Store the credential as an environment variable:

```bash
export NEON_AI_GATEWAY_TOKEN=nt_live_...
```

## Find your branch host

Your branch's AI Gateway host is available in the Neon Console on the AI Gateway page, or via the Neon API. It follows this format:

```
br-<name>-api.ai.<cell>.<region>.aws.neon.tech
```

For example:

```bash
export NEON_AI_GATEWAY_BASE_URL=https://br-winter-pond-aptw82ef-api.ai.c-2.us-east-2.aws.neon.tech
```

This is different from your database connection string.

## Install dependencies

The quickstart uses the OpenAI SDK because the chat completions endpoint is OpenAI-compatible. It works with any model in the catalog, including Claude and Gemini.

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
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/ai-gateway/mlflow/v1`,
});

const response = await client.chat.completions.create({
  model: 'claude-sonnet-4-6',
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
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/ai-gateway/mlflow/v1",
)

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Hello!"}],
)

print(response.choices[0].message.content)
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/mlflow/v1/chat/completions" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-6",
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
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/ai-gateway/mlflow/v1`,
});

const stream = await client.chat.completions.create({
  model: 'claude-sonnet-4-6',
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
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/ai-gateway/mlflow/v1",
)

with client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Write a haiku about serverless databases."}],
    stream=True,
) as stream:
    for chunk in stream:
        print(chunk.choices[0].delta.content or "", end="", flush=True)
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/ai-gateway/mlflow/v1/chat/completions" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-6",
    "messages": [{"role": "user", "content": "Write a haiku about serverless databases."}],
    "stream": true
  }'
```

</CodeTabs>

## Swap models

Change the `model` field to use a different provider. No other code changes required.

```typescript
// Anthropic
model: 'claude-sonnet-4-6'

// OpenAI
model: 'gpt-5-4'

// Google
model: 'gemini-2-5-flash'
```

See [Models](/docs/ai-gateway/models) for the full list of available model IDs.

</Steps>

## Next steps

- [Models](/docs/ai-gateway/models): full model catalog and which endpoint to use per provider
- [Chat completions](/docs/ai-gateway/chat-completions): detailed reference for the unified endpoint
- [Anthropic Messages API](/docs/ai-gateway/anthropic-messages): native Anthropic features including extended thinking and prompt caching
- [Authentication](/docs/ai-gateway/authentication): credential scopes, branch binding, and rotation

<NeedHelp/>
