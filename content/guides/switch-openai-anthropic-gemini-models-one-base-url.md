---
title: 'Switch between OpenAI, Anthropic, and Gemini models with one base URL change'
subtitle: 'Point the OpenAI SDK at Neon AI Gateway once, then call GPT, Claude, and Gemini by changing the model string, in TypeScript or Python.'
author: neon-team
enableTableOfContents: true
createdAt: '2026-11-13T00:00:00.000Z'
updatedOn: '2026-11-13T23:04:02.928Z'
---

To call OpenAI, Anthropic, and Google Gemini models from the same code, set the OpenAI SDK's base URL to your [Neon AI Gateway](/docs/ai-gateway/overview) endpoint and its API key to your Neon credential. After that one change, switching providers means changing the `model` string: `gpt-5-mini`, `claude-sonnet-4-6`, or `gemini-3-flash`. You don't need an Anthropic or Google SDK, and you don't need provider API keys.

This works because the gateway's [chat completions endpoint](/docs/ai-gateway/chat-completions) is compatible with the OpenAI Chat Completions API and accepts every chat model in the catalog.

## Call all three providers with one client

The same request goes to GPT, Claude, and Gemini. Only the `model` value changes:

<CodeTabs labels={["TypeScript", "Python", "cURL"]}>

```typescript shouldWrap
import OpenAI from 'openai';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});

for (const model of ['gpt-5-mini', 'claude-sonnet-4-6', 'gemini-3-flash']) {
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: 'Explain database branching in one sentence.' }],
  });

  console.log(`${model}: ${response.choices[0].message.content}`);
}
```

```python shouldWrap
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/v1",
)

for model in ["gpt-5-mini", "claude-sonnet-4-6", "gemini-3-flash"]:
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": "Explain database branching in one sentence."}],
    )

    print(f"{model}: {response.choices[0].message.content}")
```

```bash shouldWrap
for model in gpt-5-mini claude-sonnet-4-6 gemini-3-flash; do
  curl -s -X POST "$NEON_AI_GATEWAY_BASE_URL/v1/chat/completions" \
    -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"model\": \"$model\", \"messages\": [{\"role\": \"user\", \"content\": \"Explain database branching in one sentence.\"}]}"
  echo
done
```

</CodeTabs>

Install the dependencies with `npm install openai dotenv` or `pip install openai python-dotenv`.

## What changes in existing OpenAI code

If your app already calls OpenAI directly, the move is two lines in the client constructor. Your requests, streaming loops, and response handling stay the same:

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // [!code --]
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN, // [!code ++]
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`, // [!code ++]
});
```

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"], # [!code --]
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"], # [!code ++]
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/v1", # [!code ++]
)
```

</CodeTabs>

Neon uses short model IDs, such as `gpt-5-mini` and `claude-sonnet-4-6`. The [model catalog](https://neon.com/ai-gateway#models) lists every ID, and [`neon.com/models.json`](https://neon.com/models.json) is the machine-readable version.

## Get your credential and base URL

The code reads two environment variables: `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL`.

<Steps>

## Create a project in a supported region

AI Gateway is available in AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), and AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). Support is expanding toward [all regions](/docs/introduction/regions).

## Buy prepaid credits

AI Gateway draws down [prepaid credits](/docs/ai-gateway/prepaid-credits), which you can buy on any Neon plan, including Free. The minimum purchase is $5. Open the **Billing** page in the Neon Console, find the **AI gateway credits** card, and select **Add credits**.

## Copy the credential

In the Neon Console, click **Connect** at the top of the sidebar and open the **AI Gateway** tab. Click **Copy snippet** to copy `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL` together, and paste them into your `.env` file.

With the [Neon CLI](/docs/cli), `neon env pull --file .env` writes both variables for the current branch, next to your database connection string ([authentication](/docs/ai-gateway/authentication)).

</Steps>

`NEON_AI_GATEWAY_BASE_URL` is the bare branch host, so the code appends `/v1` for chat completions. It's a different value from your database connection string.

## Choose the model at runtime

Because the provider is just a string, you can move it out of the code and switch models without a deploy. Read it from an environment variable:

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap
const response = await client.chat.completions.create({
  model: process.env.MODEL ?? 'gpt-5-mini',
  messages: [{ role: 'user', content: 'Explain database branching in one sentence.' }],
});
```

```python shouldWrap
response = client.chat.completions.create(
    model=os.environ.get("MODEL", "gpt-5-mini"),
    messages=[{"role": "user", "content": "Explain database branching in one sentence."}],
)
```

</CodeTabs>

Run `MODEL=claude-sonnet-4-6 npx tsx app.ts` or `MODEL=gemini-3-flash python app.py` to compare answers from different providers on the same prompt.

## Stream responses from any provider

Add `stream: true`. The gateway forwards the provider's `text/event-stream` response, so the same loop prints tokens from GPT, Claude, or Gemini ([streaming](/docs/ai-gateway/chat-completions#streaming)):

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap
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
with client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Write a haiku about serverless databases."}],
    stream=True,
) as stream:
    for chunk in stream:
        print(chunk.choices[0].delta.content or "", end="", flush=True)
```

</CodeTabs>

## Use the Vercel AI SDK instead

In TypeScript apps built on the [Vercel AI SDK](https://ai-sdk.dev), [`@neon/ai-sdk-provider`](https://www.npmjs.com/package/@neon/ai-sdk-provider) reads the same two environment variables and routes each catalog model to the best gateway endpoint for its provider. Switching providers is still a change to the model ID:

```typescript shouldWrap
import { neon } from '@neon/ai-sdk-provider';
import { generateText } from 'ai';

const { text } = await generateText({
  model: neon('claude-sonnet-4-6'),
  prompt: 'Explain database branching in one sentence.',
});
```

## When to use the Anthropic or Gemini SDK

Chat completions covers standard requests for every provider. Use a provider's own SDK when you need a feature that only its API shape exposes ([which endpoint to use](/docs/ai-gateway/models#which-endpoint-to-use)). It's still a base URL change, with the same Neon credential.

**Anthropic SDK**, for extended thinking and prompt caching. Set the base URL to `/anthropic`, without `/v1`, because the SDK appends `/v1/messages` itself ([Anthropic Messages API](/docs/ai-gateway/anthropic-messages)):

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  authToken: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/anthropic`,
});

const message = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is Neon?' }],
});
```

```python shouldWrap
import anthropic
import os

client = anthropic.Anthropic(
    auth_token=os.environ['NEON_AI_GATEWAY_TOKEN'],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/anthropic",
)

message = client.messages.create(
    model='claude-sonnet-4-6',
    max_tokens=1024,
    messages=[{'role': 'user', 'content': 'What is Neon?'}],
)
```

</CodeTabs>

**google-genai SDK**, when you want to keep existing Gemini code. Set the base URL to `/gemini` and send the credential as an `Authorization` header. The SDK still requires an `apiKey` value, but the gateway ignores it ([Gemini API](/docs/ai-gateway/gemini)):

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap
import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({
  apiKey: 'placeholder',
  httpOptions: {
    baseUrl: `${process.env.NEON_AI_GATEWAY_BASE_URL}/gemini`,
    headers: {
      Authorization: `Bearer ${process.env.NEON_AI_GATEWAY_TOKEN}`,
    },
  },
});

const response = await client.models.generateContent({
  model: 'gemini-3-flash',
  contents: [{ role: 'user', parts: [{ text: 'What is Neon?' }] }],
});
```

```python shouldWrap
from google import genai
from google.genai import types
import os

client = genai.Client(
    api_key='placeholder',
    http_options=types.HttpOptions(
        base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/gemini",
        headers={'Authorization': f"Bearer {os.environ['NEON_AI_GATEWAY_TOKEN']}"},
    ),
)

response = client.models.generate_content(
    model='gemini-3-flash',
    contents='What is Neon?',
)
```

</CodeTabs>

The provider endpoints accept only their own models. Sending a GPT model to `/anthropic` returns a `400`, so keep chat completions for code that switches providers.

## Differences to handle when you switch

The request format is shared, but a few models behave differently ([switching models](/docs/ai-gateway/chat-completions#switching-models)):

- **Content shape**: for most models, `message.content` is a string. `claude-opus-5-5` returns an array of content blocks once it reasons, and `gemini-4-argon` always returns an array of `text` blocks. If you switch to either, read the `text` block from the array ([content shape varies by model](/docs/ai-gateway/models#which-endpoint-to-use)).
- **Parallel tool calls**: Gemini models reject `parallel_tool_calls: false` with a `400`. Leave the field out, and handle more than one tool call per turn.
- **Unsupported parameters**: `gemini-4-argon` doesn't accept `temperature` or `reasoning_effort` on chat completions. Leave them out, or call it through the Gemini endpoint.
- **Responses-only models**: `gpt-5-3-codex` and `gpt-5-5-pro` work only with the [OpenAI Responses API](/docs/ai-gateway/openai-responses) at `/openai/v1/responses`.

## Pricing and limits

Every model is billed at the provider's published per-token rate, with no markup, and usage for all three providers draws down the same credit balance ([pricing](/docs/ai-gateway/models#pricing)). By default, each account has soft limits of 200,000 input and 200,000 output tokens per minute, counted separately, and a $20 per day spend cap. Both may vary by account ([rate limits](/docs/ai-gateway/models#rate-limits)).

## Related resources

- [Get started with Neon AI Gateway](/docs/ai-gateway/get-started)
- [Chat completions reference](/docs/ai-gateway/chat-completions)
- [What is the best way to call models from multiple LLM providers with one API key?](/faqs/best-way-call-multiple-llm-providers-one-api-key)

<NeedHelp/>
