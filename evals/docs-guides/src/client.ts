import OpenAI from 'openai';

function createDatabricksClient(model: string): OpenAI {
  const host = process.env.DATABRICKS_HOST!;
  const token = process.env.DATABRICKS_TOKEN!;

  return new OpenAI({
    apiKey: token,
    baseURL: `${host.replace(/\/+$/, '')}/serving-endpoints/${model}`,
    fetch: async (url: RequestInfo | URL, init?: RequestInit) => {
      const rewritten = url.toString().replace(/\/chat\/completions$/, '/invocations');
      return globalThis.fetch(rewritten, init);
    },
  });
}

function createGenericClient(baseURL?: string): OpenAI {
  return new OpenAI({
    ...(baseURL ? { baseURL } : {}),
  });
}

export function getClient(model?: string): OpenAI {
  // Databricks Model Serving (uses per-model URL routing)
  if (process.env.DATABRICKS_HOST && process.env.DATABRICKS_TOKEN) {
    if (!model) throw new Error('Databricks client requires a model name');
    return createDatabricksClient(model);
  }

  // Generic OpenAI-compatible endpoint (custom base URL)
  if (process.env.OPENAI_BASE_URL) {
    return createGenericClient(process.env.OPENAI_BASE_URL);
  }

  // Direct OpenAI (OPENAI_API_KEY picked up automatically by the SDK)
  if (process.env.OPENAI_API_KEY) {
    return createGenericClient();
  }

  throw new Error(
    'No API credentials found. See .env.example for options.',
  );
}
