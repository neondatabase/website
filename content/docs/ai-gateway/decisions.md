---
title: Decisions
tag: new
tagTheme: green
subtitle: Answer questions about text, JSON, or images with System One decision models
summary: >-
  Neon AI Gateway serves TypeSafe's System One decision models, Jev 1.14 and
  OpenJev, on the /typesafe/v1/systemone endpoint. Ask yes/no, choice, and score
  questions about text, JSON, or images and get back probabilities instead of
  generated text, with the same Neon credential you use for chat completions.
enableTableOfContents: true
---

Decision models don't generate text. You send a piece of text or JSON, called the state, and a set of named questions about it. The model answers each one with numbers: the probability of a yes, the option it picked and how sure it is, or where the input falls on a scale you define. Use them to classify, route, or score input without prompting a chat model and parsing its reply. You can also [ask about an image](#ask-about-an-image).

The Neon AI Gateway serves TypeSafe's [System One](https://docs.typesafe.ai/) decision models, using the same Neon credential as the other AI Gateway endpoints. You can call them with the TypeSafe SDKs, the [Vercel AI SDK](#use-with-the-vercel-ai-sdk), or plain HTTP.

**Endpoint:** `POST https://<branch-host>/typesafe/v1/systemone`

Decision models aren't available on any other endpoint, and this one doesn't serve chat models.

## Models

| Model ID                | Name                  | Context window | Notes                         |
| ----------------------- | --------------------- | -------------- | ----------------------------- |
| `typesafeai-jev-1-14-0` | Jev 1.14              | 65,536 tokens  | TypeSafe's proprietary model. |
| `openjev-qwen35-4b`     | OpenJev (Qwen 3.5 4B) | 131,072 tokens | Open weights.                 |

Both are billed on **input tokens only**. See the [model catalog](/docs/ai-gateway/overview#available-models) for rates.

## Setup

The examples use two environment variables:

```bash
NEON_AI_GATEWAY_TOKEN=nt_live_...
NEON_AI_GATEWAY_BASE_URL=https://br-...
```

Run `neon env pull --file .env` to write both to your `.env` for the current branch. You can also copy them from the Neon Console's **Connect** panel, on the **AI Gateway** tab. Inside Neon Functions they're injected automatically. See [Authentication](/docs/ai-gateway/authentication) for details.

Install the TypeSafe SDK with `npm install @typesafe-ai/sdk` or `pip install typesafe-sdk`. The SDKs take `${NEON_AI_GATEWAY_BASE_URL}/typesafe` as their base URL and add `/v1/systemone` themselves.

The TypeSafe SDKs are built for TypeSafe's own API, where the default model is `jev-latest`. The gateway uses its own model IDs, so set one when you create the client (`defaultModel` in TypeScript, `model` in Python), as the examples below do.

## Basic request

This request asks three questions about a support message, one of each type:

<CodeTabs labels={["TypeScript (TypeSafe SDK)", "Python (TypeSafe SDK)", "cURL"]}>

```typescript shouldWrap
import { choice, noul, score, TypeSafeClient } from '@typesafe-ai/sdk';

const client = new TypeSafeClient({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/typesafe`,
  defaultModel: 'typesafeai-jev-1-14-0',
});

const { answers } = await client.systemOne({
  state: 'I was charged twice this month and need the extra charge refunded.',
  questions: {
    department: choice('Which team should handle this?', {
      billing: 'Payments and refunds',
      support: 'Other requests',
    }),
    severity: score('How severe is the issue?', [
      'Cosmetic',
      'Workaround exists',
      'Blocking; no workaround',
    ]),
    refund: noul('Is the customer asking for money back?'),
  },
});

console.log(answers.department.choice); // billing
console.log(answers.refund.noul); // 0.98
```

```python shouldWrap
import os
from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

with TypeSafeClient(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/typesafe",
    model="typesafeai-jev-1-14-0",
) as client:
    response = client.system_one(
        state="I was charged twice this month and need the extra charge refunded.",
        questions={
            "department": Choice(
                instructions="Which team should handle this?",
                criteria={"billing": "Payments and refunds", "support": "Other requests"},
            ),
            "severity": Score(
                instructions="How severe is the issue?",
                criteria=["Cosmetic", "Workaround exists", "Blocking; no workaround"],
            ),
            "refund": Noul(instructions="Is the customer asking for money back?"),
        },
    )

print(response.answers["department"].choice)  # billing
print(response.answers["refund"].noul)  # 0.98
```

```bash shouldWrap
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/typesafe/v1/systemone" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafeai-jev-1-14-0",
    "state": "I was charged twice this month and need the extra charge refunded.",
    "questions": {
      "department": {
        "type": "choice",
        "instructions": "Which team should handle this?",
        "criteria": {"billing": "Payments and refunds", "support": "Other requests"}
      },
      "severity": {
        "type": "score",
        "instructions": "How severe is the issue?",
        "criteria": ["Cosmetic", "Workaround exists", "Blocking; no workaround"]
      },
      "refund": {
        "type": "noul",
        "instructions": "Is the customer asking for money back?"
      }
    }
  }'
```

</CodeTabs>

The model answers each question on its own, so you can ask several in one request. The state can be a string, as here, or a JSON object such as `{ "message": "...", "plan": "Launch" }`.

## Question types

| Type            | Criteria                                                                                 | Answer                                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `noul` (yes/no) | Optional `true` and `false` descriptions                                                 | `noul`: the probability of a yes, from 0 to 1                                                                                |
| `choice`        | A map of option names to descriptions                                                    | `choice`: the option picked, plus a `confidence` and per-option `probabilities`                                              |
| `score`         | Level descriptions, indexed from 0. Use at least two: with one, the answer is always `0` | `score`: the expected level, which can fall between levels, plus `confidence`, `probabilities`, and a `legend` of the levels |

A `score` of `1.02` with the rubric above means "about `Workaround exists`"; read `probabilities` when you need the full distribution.

## Response shape

A response for the request above. Values can vary slightly from run to run:

```json
{
  "model": "jev-1.14.0",
  "answers": {
    "department": {
      "type": "choice",
      "choice": "billing",
      "confidence": 1.0,
      "probabilities": { "billing": 1.0, "support": 0.0 }
    },
    "severity": {
      "type": "score",
      "score": 1.02,
      "confidence": 0.52,
      "legend": { "0": "Cosmetic", "1": "Workaround exists", "2": "Blocking; no workaround" },
      "probabilities": { "0": 0.15, "1": 0.68, "2": 0.17 }
    },
    "refund": { "type": "noul", "noul": 0.98 }
  },
  "usage": { "input_tokens": 383, "output_tokens": 61 }
}
```

`model` reports the name that served the request (`jev-1.14.0` here, `databricks-openjev-qwen35-4b` for OpenJev). Keep sending the model IDs from [Models](#models).

## Ask about an image

Add a top-level `assets` field and link it to the question:

1. `assets` holds the image under a reference you choose (`img-7d2f`).
2. A `state` field holds that reference (`"photo": "img-7d2f"`).
3. The question names that field in backticks (`` `photo` ``).

Jev 1.14 also needs the `TypeSafe-Danger-Zone-Images: true` header, TypeSafe's opt-in for its experimental image input, and returns `400` without it. OpenJev doesn't need the header.

<CodeTabs labels={["cURL", "Python (TypeSafe SDK)", "JavaScript (fetch)"]}>

```bash shouldWrap
IMAGE_B64=$(base64 < package.png | tr -d '\n')
curl -X POST "$NEON_AI_GATEWAY_BASE_URL/typesafe/v1/systemone" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -H "TypeSafe-Danger-Zone-Images: true" \
  -d @- <<EOF
{
  "model": "typesafeai-jev-1-14-0",
  "state": { "photo": "img-7d2f" },
  "assets": {
    "img-7d2f": { "type": "image", "format": "png", "data_base64": "$IMAGE_B64" }
  },
  "questions": {
    "damaged": { "type": "noul", "instructions": "Does the package in \`photo\` look damaged?" }
  }
}
EOF
```

```python shouldWrap
import base64
import os
from typesafe_sdk import Noul, TypeSafeClient

with TypeSafeClient(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/typesafe",
    model="typesafeai-jev-1-14-0",
    headers={"TypeSafe-Danger-Zone-Images": "true"},
) as client:
    with open("package.png", "rb") as f:
        image_b64 = base64.b64encode(f.read()).decode()
    response = client.system_one(
        state={"photo": "img-7d2f"},
        questions={"damaged": Noul(instructions="Does the package in `photo` look damaged?")},
        # Send the image as JSON. The SDK's Image helper sends multipart, which the gateway doesn't accept.
        extra_body={"assets": {"img-7d2f": {"type": "image", "format": "png", "data_base64": image_b64}}},
    )

print(response.answers["damaged"].noul)
```

```javascript shouldWrap
import { readFile } from 'node:fs/promises';

const res = await fetch(`${process.env.NEON_AI_GATEWAY_BASE_URL}/typesafe/v1/systemone`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.NEON_AI_GATEWAY_TOKEN}`,
    'Content-Type': 'application/json',
    'TypeSafe-Danger-Zone-Images': 'true',
  },
  body: JSON.stringify({
    model: 'typesafeai-jev-1-14-0',
    state: { photo: 'img-7d2f' },
    assets: {
      'img-7d2f': {
        type: 'image',
        format: 'png',
        data_base64: (await readFile('package.png')).toString('base64'),
      },
    },
    questions: {
      damaged: { type: 'noul', instructions: 'Does the package in `photo` look damaged?' },
    },
  }),
});

const { answers } = await res.json();
console.log(answers.damaged.noul);
```

</CodeTabs>

The answer has the same shape as for text. Image requests have a few rules:

- Send PNG or JPEG files as plain base64 in `data_base64`, with no `data:` prefix, and set `format` to `png` or `jpeg`.
- Jev 1.14 returns `400` for an image smaller than 280 × 280 pixels. OpenJev accepts smaller images.
- Images count as input tokens, and the count depends on resolution, not file size. With a short question, a 448 × 448 image is about 800 tokens on Jev 1.14 and 250 on OpenJev; a 1024 × 1024 image is about 3,000 and 1,100.
- Send images only in `assets`. An OpenAI-style `image_url` part in `state` returns `200`, but the model reads it as text and doesn't see the image.
- When Jev 1.14 rejects an image request, the error is `400` with the message `ai gateway upstream model rejected the request as invalid` and no reason.

## Use with the Vercel AI SDK

[`@neon/ai-sdk-provider`](https://www.npmjs.com/package/@neon/ai-sdk-provider) exposes the decision models to the AI SDK's `experimental_decide`. The AI SDK marks this API as experimental, so it may change in patch releases. It reads `NEON_AI_GATEWAY_BASE_URL` and `NEON_AI_GATEWAY_TOKEN` from [Setup](#setup) and needs `ai@7.0.133` or later. Install it with `npm install @neon/ai-sdk-provider ai@7`.

```typescript shouldWrap
import { neon } from '@neon/ai-sdk-provider';
import { experimental_decide as decide } from 'ai';

const { answers } = await decide({
  model: neon.decisionModel('typesafeai-jev-1-14-0'),
  state: 'I was charged twice this month and need the extra charge refunded.',
  questions: {
    department: {
      type: 'choice',
      instructions: 'Which team should handle this?',
      criteria: { billing: 'Payments and refunds', support: 'Other requests' },
    },
    refund: {
      type: 'boolean',
      instructions: 'Is the customer asking for money back?',
    },
  },
});

console.log(answers.department.choice); // billing
console.log(answers.refund.probability); // 0.98
```

The AI SDK calls the yes/no type `boolean` and returns its answer as `probability`; the provider sends it as `noul`. `choice` and `score` answers leave out `confidence`, which is in `providerMetadata.neon.confidence` instead. The provider accepts text and JSON state and throws `UnsupportedFunctionalityError` for file parts. To ask about an image, use HTTP or the Python SDK, as in [Ask about an image](#ask-about-an-image).

You can also use TypeSafe's [`@ai-sdk/typesafe-ai`](https://www.npmjs.com/package/@ai-sdk/typesafe-ai) provider. Point it at the gateway's `/typesafe/v1` path, since it appends `/systemone` itself, and pass your Neon credential as `apiKey`:

```typescript shouldWrap
import { createTypeSafeAi } from '@ai-sdk/typesafe-ai';
import { experimental_decide as decide } from 'ai';

const typesafe = createTypeSafeAi({
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/typesafe/v1`,
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
});

const { answers } = await decide({
  model: typesafe.decisionModel('typesafeai-jev-1-14-0'),
  state: 'I was charged twice this month.',
  questions: {
    billing: { type: 'boolean', instructions: 'Is the user asking about billing?' },
  },
});

console.log(answers.billing.probability); // 0.94
```

## List the models

`GET /typesafe/v1/models` lists the decision models your branch can call:

```bash
curl "$NEON_AI_GATEWAY_BASE_URL/typesafe/v1/models" \
  -H "Authorization: Bearer $NEON_AI_GATEWAY_TOKEN"
```

They also appear in `GET /v1/models` with `"dialects": ["systemone"]`.

## Not supported

- **Streaming.** A request with `stream: true` returns `400 systemone does not support streaming`.
- **Image helpers and file parts.** The TypeSafe SDKs' `image()` (TypeScript) and `Image` (Python) helpers, and file parts in `@ai-sdk/typesafe-ai`, send images as `multipart/form-data`, which the gateway doesn't accept: it returns `400 missing or invalid model`. Send images as JSON, as in [Ask about an image](#ask-about-an-image); with the Python SDK, pass them in `extra_body`.
- **`box` questions.** The TypeSafe SDKs document `box` for the `jev-preview` model, which the gateway doesn't serve. A `box` question returns `400`.
- **Other endpoints.** A decision model on `/v1/chat/completions`, or a chat model on this endpoint, returns `400` with `is not available on the ... endpoint`.

## Error handling

| Status                         | Meaning               | Common cause                                                                                                                                                   |
| ------------------------------ | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400 Bad Request`              | Invalid request       | Missing or unknown model (including `jev-latest`), no questions, `stream: true`, a `box` question, or an [image request](#ask-about-an-image) Jev 1.14 rejects |
| `401 Unauthorized`             | Authentication failed | Missing or invalid `NEON_AI_GATEWAY_TOKEN`                                                                                                                     |
| `403 Forbidden`                | Access denied         | Credential lacks `ai_gateway:invoke` scope, or branch not in credential lineage                                                                                |
| `413 Request Entity Too Large` | Body too large        | Request body exceeds 32 MiB, before or after decompression                                                                                                     |
| `415 Unsupported Media Type`   | Unsupported encoding  | `Content-Encoding` is something other than a single `gzip`, `x-gzip`, or `zstd` layer                                                                          |
| `429 Too Many Requests`        | Quota or rate limited | Account quota or per-minute token limit. See [Rate limits](/docs/ai-gateway/models#rate-limits).                                                               |
| `503 Service Unavailable`      | Gateway busy          | Too many compressed requests are being decoded at once. Retry after the `Retry-After` interval.                                                                |

For exact error messages and fixes, see [Troubleshooting](/docs/ai-gateway/troubleshooting).

## Next steps

- [Models](/docs/ai-gateway/models): full model catalog, rate limits, and pricing
- [Chat completions](/docs/ai-gateway/chat-completions): the OpenAI-compatible chat endpoint
- [TypeSafe docs](https://docs.typesafe.ai/): System One concepts and the full SDK reference

<NeedHelp/>
