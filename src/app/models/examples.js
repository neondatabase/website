// Runnable code examples per model and use case.
//
// Support on the AI Gateway is not uniform per model, and the differences are not derivable
// from the model id. Three independent facts decide which examples are correct:
//
//   1. whether /v1/chat/completions returns a spec-conforming body,
//   2. whether the model has a provider-native dialect,
//   3. whether /openai/v1/responses is served for it (image generation and web search).
//
// Every branch below keys off a measured value in ./capabilities.json, never off a family name.

const ENV = ['NEON_AI_GATEWAY_BASE_URL', 'NEON_AI_GATEWAY_TOKEN'];
const AI_SDK_DEPS = ['ai', '@neon/ai-sdk-provider'];
// experimental_decide needs ai 7.0.133 or later, so pin the major.
const DECISION_AI_SDK_DEPS = ['ai@7', '@neon/ai-sdk-provider'];

const CHAT_PROMPT = 'Explain Serverless Postgres.';
const SEARCH_PROMPT = 'What is the latest stable Postgres release?';
const IMAGE_PROMPT = 'A red apple on a wooden table.';
const EMBEDDING_INPUT = 'Explain Serverless Postgres.';
const DECISION_STATE = 'I was charged twice this month.';
const DECISION_QUESTION = 'Is the user asking about billing?';

export const USE_CASES = ['chat', 'image-generation', 'web-search', 'embeddings', 'systemone'];

const example = ({
  id,
  title,
  language,
  dependencies,
  endpoint,
  path,
  content,
  variantReason,
}) => ({
  id,
  title,
  language,
  dependencies,
  envVars: ENV,
  endpoint,
  ...(variantReason ? { variantReason } : {}),
  files: [{ path, content }],
});

const tsExample = (props) => example({ ...props, language: 'typescript', path: 'index.ts' });
const pyExample = (props) =>
  example({ ...props, language: 'python', dependencies: ['openai'], path: 'main.py' });
const shExample = (props) =>
  example({ ...props, language: 'bash', dependencies: [], path: 'run.sh' });

/* ------------------------------------------------------------------ chat */

const aiSdkChat = (model, responsesOnly) =>
  tsExample({
    id: 'ai-sdk',
    title: 'AI SDK',
    dependencies: AI_SDK_DEPS,
    endpoint: responsesOnly ? '/openai/v1 (via provider)' : '/v1/chat/completions (via provider)',
    content: `import { generateText } from "ai";
import { neon } from "@neon/ai-sdk-provider";

const { text } = await generateText({
  model: neon("${model}"),
  prompt: "${CHAT_PROMPT}",
});

console.log(text);
`,
  });

const mastraChat = (model, needsProvider, responsesOnly) =>
  tsExample({
    id: 'mastra',
    title: 'Mastra',
    dependencies: needsProvider ? ['@mastra/core', ...AI_SDK_DEPS] : ['@mastra/core'],
    endpoint: responsesOnly ? '/openai/v1 (via provider)' : '/v1/chat/completions',
    variantReason: needsProvider
      ? "The neon/<model> string resolves through Mastra's own registry, which cannot parse this model's response."
      : undefined,
    content: needsProvider
      ? `import { Agent } from "@mastra/core/agent";
import { neon } from "@neon/ai-sdk-provider";

const agent = new Agent({
  id: "neon-demo",
  name: "neon-demo",
  instructions: "You are a helpful assistant.",
  model: neon("${model}"),
});

const { text } = await agent.generate("${CHAT_PROMPT}");
console.log(text);
`
      : `import { Agent } from "@mastra/core/agent";

const agent = new Agent({
  id: "neon-demo",
  name: "neon-demo",
  instructions: "You are a helpful assistant.",
  model: "neon/${model}",
});

const { text } = await agent.generate("${CHAT_PROMPT}");
console.log(text);
`,
  });

const openaiTsChat = (model, responsesOnly) =>
  tsExample({
    id: 'typescript',
    title: 'TypeScript',
    dependencies: ['openai'],
    endpoint: responsesOnly ? '/openai/v1/responses' : '/v1/chat/completions',
    variantReason: responsesOnly ? 'This model is not served on /v1/chat/completions.' : undefined,
    content: responsesOnly
      ? `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: \`\${process.env.NEON_AI_GATEWAY_BASE_URL}/openai/v1\`,
});

const response = await client.responses.create({
  model: "${model}",
  input: "${CHAT_PROMPT}",
});
console.log(response.output_text);
`
      : `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: \`\${process.env.NEON_AI_GATEWAY_BASE_URL}/v1\`,
});

const resp = await client.chat.completions.create({
  model: "${model}",
  messages: [{ role: "user", content: "${CHAT_PROMPT}" }],
});
console.log(resp.choices[0].message.content);
`,
  });

const openaiPyChat = (model, responsesOnly) =>
  pyExample({
    id: 'python',
    title: 'Python',
    endpoint: responsesOnly ? '/openai/v1/responses' : '/v1/chat/completions',
    variantReason: responsesOnly ? 'This model is not served on /v1/chat/completions.' : undefined,
    content: responsesOnly
      ? `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/openai/v1",
)

response = client.responses.create(
    model="${model}",
    input="${CHAT_PROMPT}",
)
print(response.output_text)
`
      : `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/v1",
)

resp = client.chat.completions.create(
    model="${model}",
    messages=[{"role": "user", "content": "${CHAT_PROMPT}"}],
)
print(resp.choices[0].message.content)
`,
  });

// cURL swaps to a provider-native dialect only when the unified route is the broken one.
// A native dialect on its own is not a reason to leave `/v1/chat/completions` — the eight
// conforming Claude models are served at /anthropic/v1/messages too, and showing that
// instead would trade a portable snippet for a vendor-specific one to fix nothing.
const curlChat = (model, nativeDialect, responsesOnly, arrayContent) => {
  if (arrayContent && nativeDialect === 'gemini') {
    return shExample({
      id: 'curl',
      title: 'cURL',
      endpoint: `/gemini/v1beta/models/${model}:generateContent`,
      variantReason:
        'The native Gemini dialect returns a conforming body; /v1/chat/completions does not.',
      content: `curl "\${NEON_AI_GATEWAY_BASE_URL}/gemini/v1beta/models/${model}:generateContent" \\
  -H "Authorization: Bearer \${NEON_AI_GATEWAY_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "${CHAT_PROMPT}"}]}
    ]
  }'
`,
    });
  }

  if (arrayContent && nativeDialect === 'anthropic') {
    return shExample({
      id: 'curl',
      title: 'cURL',
      endpoint: '/anthropic/v1/messages',
      variantReason:
        'The native Anthropic Messages dialect returns a conforming body; /v1/chat/completions returns array content once this model reasons.',
      content: `curl "\${NEON_AI_GATEWAY_BASE_URL}/anthropic/v1/messages" \\
  -H "Authorization: Bearer \${NEON_AI_GATEWAY_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "${CHAT_PROMPT}"}]
  }'
`,
    });
  }

  if (responsesOnly) {
    return shExample({
      id: 'curl',
      title: 'cURL',
      endpoint: '/openai/v1/responses',
      variantReason: 'This model is not served on /v1/chat/completions.',
      content: `curl "\${NEON_AI_GATEWAY_BASE_URL}/openai/v1/responses" \\
  -H "Authorization: Bearer \${NEON_AI_GATEWAY_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "input": "${CHAT_PROMPT}"
  }'
`,
    });
  }

  return shExample({
    id: 'curl',
    title: 'cURL',
    endpoint: '/v1/chat/completions',
    content: `curl "\${NEON_AI_GATEWAY_BASE_URL}/v1/chat/completions" \\
  -H "Authorization: Bearer \${NEON_AI_GATEWAY_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "messages": [{"role": "user", "content": "${CHAT_PROMPT}"}]
  }'
`,
  });
};

const chatExamples = (model, caps) => {
  const arrayContent = caps.chat === 'array-content';
  const responsesOnly = caps.chat === 'not-served' && caps.nativeDialect === 'openai-responses';

  const examples = [
    // The AI SDK provider absorbs every difference — array content, Responses-only routing —
    // so this is the one surface that never needs a variant.
    aiSdkChat(model, responsesOnly),
    mastraChat(model, arrayContent || responsesOnly, responsesOnly),
  ];

  // The OpenAI SDKs declare `content` as a string. When the gateway returns an array they hand
  // back a value that type-checks and then misbehaves — string methods throw and `.length`
  // silently returns the part count — so these are omitted rather than shown with a caveat.
  if (!arrayContent) {
    examples.push(openaiTsChat(model, responsesOnly), openaiPyChat(model, responsesOnly));
  }

  examples.push(curlChat(model, caps.nativeDialect, responsesOnly, arrayContent));
  return examples;
};

/* ------------------------------------------------------------ web search */

const webSearchExamples = (model) => [
  tsExample({
    id: 'ai-sdk',
    title: 'AI SDK',
    dependencies: AI_SDK_DEPS,
    endpoint: '/openai/v1 (via provider)',
    content: `import { generateText } from "ai";
import { neon } from "@neon/ai-sdk-provider";

const { text, sources } = await generateText({
  model: neon("${model}"),
  prompt: "${SEARCH_PROMPT}",
  tools: { web_search: neon.tools.webSearch({}) },
});

console.log(text);
console.log(sources.filter((source) => source.sourceType === "url").map((source) => source.url));
`,
  }),
  tsExample({
    id: 'mastra',
    title: 'Mastra',
    dependencies: ['@mastra/core', ...AI_SDK_DEPS],
    endpoint: '/openai/v1 (via provider)',
    // Mastra has no search API of its own. It passes the provider-executed tool through, and its
    // own webSearchTool cannot be used here: that one infers the provider from the model id prefix
    // and rejects neon/… with WEB_SEARCH_UNSUPPORTED_PROVIDER.
    content: `import { Agent } from "@mastra/core/agent";
import { neon } from "@neon/ai-sdk-provider";

const agent = new Agent({
  id: "neon-demo",
  name: "neon-demo",
  instructions: "Use web search when you need current information.",
  model: "neon/${model}",
  tools: { web_search: neon.tools.webSearch({}) },
});

const { text } = await agent.generate("${SEARCH_PROMPT}");
console.log(text);
`,
  }),
  tsExample({
    id: 'typescript',
    title: 'TypeScript',
    dependencies: ['openai'],
    endpoint: '/openai/v1/responses',
    content: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: \`\${process.env.NEON_AI_GATEWAY_BASE_URL}/openai/v1\`,
});

const response = await client.responses.create({
  model: "${model}",
  input: "${SEARCH_PROMPT}",
  tools: [{ type: "web_search" }],
});
console.log(response.output_text);
`,
  }),
  pyExample({
    id: 'python',
    title: 'Python',
    endpoint: '/openai/v1/responses',
    content: `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/openai/v1",
)

response = client.responses.create(
    model="${model}",
    input="${SEARCH_PROMPT}",
    tools=[{"type": "web_search"}],
)
print(response.output_text)
`,
  }),
  shExample({
    id: 'curl',
    title: 'cURL',
    endpoint: '/openai/v1/responses',
    content: `curl "\${NEON_AI_GATEWAY_BASE_URL}/openai/v1/responses" \\
  -H "Authorization: Bearer \${NEON_AI_GATEWAY_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "input": "${SEARCH_PROMPT}",
    "tools": [{"type": "web_search"}]
  }'
`,
  }),
];

/* ---------------------------------------------------------------- embeddings */

// No AI SDK or Mastra variant: neither has an EmbeddingModelV2 implementation for the Neon
// provider yet. `encoding_format: "float"` is not a style choice — the gateway always returns a
// float array regardless of what is requested, and the OpenAI SDKs default that field to
// "base64" and decode accordingly, silently producing a corrupt vector if it is left out.
const embeddingExamples = (model) => [
  tsExample({
    id: 'typescript',
    title: 'TypeScript',
    dependencies: ['openai'],
    endpoint: '/v1/embeddings',
    content: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: \`\${process.env.NEON_AI_GATEWAY_BASE_URL}/v1\`,
});

const resp = await client.embeddings.create({
  model: "${model}",
  input: ["${EMBEDDING_INPUT}"],
  encoding_format: "float",
});
console.log(resp.data[0].embedding.length, resp.usage);
`,
  }),
  pyExample({
    id: 'python',
    title: 'Python',
    endpoint: '/v1/embeddings',
    content: `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/v1",
)

resp = client.embeddings.create(
    model="${model}",
    input=["${EMBEDDING_INPUT}"],
    encoding_format="float",
)
print(len(resp.data[0].embedding), resp.usage)
`,
  }),
  shExample({
    id: 'curl',
    title: 'cURL',
    endpoint: '/v1/embeddings',
    content: `curl "\${NEON_AI_GATEWAY_BASE_URL}/v1/embeddings" \\
  -H "Authorization: Bearer \${NEON_AI_GATEWAY_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "input": ["${EMBEDDING_INPUT}"],
    "encoding_format": "float"
  }'
`,
  }),
];

/* ------------------------------------------------------ image generation */

// Always set the image tool's model to gpt-image-2. The OpenAI default (gpt-image-1) is not
// available on the gateway.
// A generated image is ~3 MB of base64 and the gateway rejects buffered responses over 655,360
// bytes, which is why the SDK variants stream and why there is no cURL variant. Mastra is the
// exception: its agent call returns once, with the base64 whole.
const imageExamples = (model) => [
  tsExample({
    id: 'ai-sdk',
    title: 'AI SDK',
    dependencies: AI_SDK_DEPS,
    endpoint: '/openai/v1 (via provider)',
    content: `import { streamText } from "ai";
import { neon } from "@neon/ai-sdk-provider";

const result = streamText({
  model: neon("${model}"),
  prompt: "${IMAGE_PROMPT}",
  tools: {
    image_generation: neon.tools.imageGeneration({
      model: "gpt-image-2",
      outputFormat: "jpeg",
    }),
  },
});

for await (const _ of result.textStream) {}

const images = (await result.toolResults).filter((r) => r.toolName === "image_generation");
console.log(images.length);
`,
  }),
  tsExample({
    id: 'mastra',
    title: 'Mastra',
    dependencies: ['@mastra/core', ...AI_SDK_DEPS],
    endpoint: '/openai/v1 (via provider)',
    // Mastra returns once with the base64 whole, so it is the one variant that does not iterate a
    // stream. Its tool results carry an envelope the AI SDK does not have, hence payload.*.
    content: `import { Agent } from "@mastra/core/agent";
import { neon } from "@neon/ai-sdk-provider";

const agent = new Agent({
  id: "neon-demo",
  name: "neon-demo",
  instructions: "Generate the image the user asks for.",
  model: "neon/${model}",
  tools: {
    image_generation: neon.tools.imageGeneration({
      model: "gpt-image-2",
      outputFormat: "jpeg",
    }),
  },
});

const { toolResults } = await agent.generate("${IMAGE_PROMPT}");
const images = toolResults.filter((r) => r.payload.toolName === "image_generation");
console.log(images.map((r) => r.payload.result.result.length));
`,
  }),
  tsExample({
    id: 'typescript',
    title: 'TypeScript',
    dependencies: ['openai'],
    endpoint: '/openai/v1/responses',
    content: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: \`\${process.env.NEON_AI_GATEWAY_BASE_URL}/openai/v1\`,
});

const stream = client.responses.stream({
  model: "${model}",
  input: "${IMAGE_PROMPT}",
  tools: [{ type: "image_generation", model: "gpt-image-2" }],
});

const response = await stream.finalResponse();
const sizes = response.output.flatMap((item) => {
  if (item.type !== "image_generation_call") return [];
  if (!("result" in item) || typeof item.result !== "string") return [];
  return [item.result.length];
});
console.log(sizes);
`,
  }),
  pyExample({
    id: 'python',
    title: 'Python',
    endpoint: '/openai/v1/responses',
    content: `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/openai/v1",
)

with client.responses.stream(
    model="${model}",
    input="${IMAGE_PROMPT}",
    tools=[{"type": "image_generation", "model": "gpt-image-2"}],
) as stream:
    for _ in stream:
        pass
    response = stream.get_final_response()

sizes = [
    len(item.result)
    for item in response.output
    if item.type == "image_generation_call" and getattr(item, "result", None)
]
print(sizes)
`,
  }),
];

/* ------------------------------------------------------------ systemone */

// System One decision models are served only on /typesafe/v1/systemone. The TypeSafe SDKs take
// `${NEON_AI_GATEWAY_BASE_URL}/typesafe` and append /v1/systemone themselves.
const decisionExamples = (model) => [
  tsExample({
    id: 'ai-sdk',
    title: 'AI SDK',
    dependencies: DECISION_AI_SDK_DEPS,
    endpoint: '/typesafe/v1/systemone (via provider)',
    content: `import { experimental_decide as decide } from "ai";
import { neon } from "@neon/ai-sdk-provider";

const { answers, usage } = await decide({
  model: neon.decisionModel("${model}"),
  state: "${DECISION_STATE}",
  questions: {
    billing: {
      type: "boolean",
      instructions: "${DECISION_QUESTION}",
      criteria: { true: "Billing related", false: "Not billing" },
    },
  },
});
console.log(answers, usage);
`,
  }),
  tsExample({
    id: 'typescript',
    title: 'TypeScript',
    dependencies: ['@typesafe-ai/sdk'],
    endpoint: '/typesafe/v1/systemone',
    content: `import { noul, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: \`\${process.env.NEON_AI_GATEWAY_BASE_URL}/typesafe\`,
  defaultModel: "${model}",
});

const { answers, usage } = await client.systemOne({
  state: "${DECISION_STATE}",
  questions: {
    billing: noul("${DECISION_QUESTION}", {
      true: "Billing related",
      false: "Not billing",
    }),
  },
});
console.log(answers, usage);
`,
  }),
  example({
    id: 'python',
    title: 'Python',
    language: 'python',
    dependencies: ['typesafe-sdk'],
    endpoint: '/typesafe/v1/systemone',
    path: 'main.py',
    content: `import os
from typesafe_sdk import Noul, TypeSafeClient

with TypeSafeClient(
    api_key=os.environ["NEON_AI_GATEWAY_TOKEN"],
    base_url=f"{os.environ['NEON_AI_GATEWAY_BASE_URL']}/typesafe",
    model="${model}",
) as client:
    response = client.system_one(
        state="${DECISION_STATE}",
        questions={
            "billing": Noul(
                instructions="${DECISION_QUESTION}",
                criteria={"true": "Billing related", "false": "Not billing"},
            ),
        },
    )
print(response.answers, response.usage)
`,
  }),
  shExample({
    id: 'curl',
    title: 'cURL',
    endpoint: '/typesafe/v1/systemone',
    content: `curl "\${NEON_AI_GATEWAY_BASE_URL}/typesafe/v1/systemone" \\
  -H "Authorization: Bearer \${NEON_AI_GATEWAY_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "state": "${DECISION_STATE}",
    "questions": {
      "billing": {
        "type": "noul",
        "instructions": "${DECISION_QUESTION}",
        "criteria": {"true": "Billing related", "false": "Not billing"}
      }
    }
  }'
`,
  }),
];

const RESPONSES_ONLY_NOTE =
  'The gateway serves /openai/v1/responses for OpenAI gpt-5 models only, so this tool is unavailable.';

/**
 * @returns {{ examples: Array, unsupported?: string }} Examples for the use case, or an
 *   `unsupported` reason and an empty list when the model cannot do it. Never both.
 */
export function buildExamples(modelId, useCase, caps) {
  if (caps.chat === 'not-entitled') {
    return {
      examples: [],
      unsupported: `${modelId} requires a verified account. It is listed in /v1/models with enabled: false, which is an entitlement gap rather than a defect.`,
    };
  }

  if (useCase === 'web-search') {
    return caps.webSearch
      ? { examples: webSearchExamples(modelId) }
      : {
          examples: [],
          unsupported: `${modelId} cannot use the web_search tool. ${RESPONSES_ONLY_NOTE}`,
        };
  }

  if (useCase === 'image-generation') {
    return caps.imageGeneration
      ? { examples: imageExamples(modelId) }
      : {
          examples: [],
          unsupported: `${modelId} cannot use the image_generation tool. ${RESPONSES_ONLY_NOTE}`,
        };
  }

  if (useCase === 'embeddings') {
    return caps.embeddings
      ? { examples: embeddingExamples(modelId) }
      : { examples: [], unsupported: `${modelId} is not an embedding model.` };
  }

  if (useCase === 'systemone') {
    return caps.decision
      ? { examples: decisionExamples(modelId) }
      : { examples: [], unsupported: `${modelId} is not a System One decision model.` };
  }

  if (caps.decision) {
    return {
      examples: [],
      unsupported: `${modelId} is a System One decision model served only on /typesafe/v1/systemone — see the systemone use case.`,
    };
  }

  // An embedding model has no chat shape to fall back to — POST /v1/embeddings is its only
  // route — so the generic "not reachable on any route" message below would be wrong for it.
  if (caps.embeddings) {
    return {
      examples: [],
      unsupported: `${modelId} does not serve chat completions. It is an embedding model — see the embeddings use case.`,
    };
  }

  if (caps.chat === 'not-served' && caps.nativeDialect === 'none') {
    return { examples: [], unsupported: `${modelId} is not reachable on any route.` };
  }

  return { examples: chatExamples(modelId, caps) };
}
