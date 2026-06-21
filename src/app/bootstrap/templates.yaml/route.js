// Serves the Neon project bootstrap manifest at
// https://neon.com/bootstrap/templates.yaml. neonctl and neon-init fetch this
// CDN-backed URL first to populate the `neon bootstrap` / `neon init` template
// picker, so discovery never depends on GitHub's rate-limited hosts.
//
// The manifest's source of truth is neondatabase/examples/bootstrap.yaml. This
// route reads it through, cached for an hour, so edits to the examples repo go
// live within ~1h with no website redeploy. A bundled fallback keeps the
// endpoint serving a valid manifest even if the upstream fetch fails.

const SOURCE_URL = 'https://raw.githubusercontent.com/neondatabase/examples/main/bootstrap.yaml';
const CACHE_SECONDS = 3600;

// Re-generate (and re-fetch the upstream) at most once an hour.
export const revalidate = 3600;

// Last-resort copy, kept in sync with neondatabase/examples/bootstrap.yaml, so
// the endpoint never serves an error when GitHub is unreachable.
const FALLBACK_MANIFEST = `templates:
  - id: hono
    title: "Hono API (Drizzle, Neon Postgres) on Neon Functions"
    description: "A Hono API using Drizzle ORM and Neon Postgres, ready to deploy as a Neon Function."
    services:
      - Postgres
      - Functions
    source:
      owner: neondatabase
      repo: examples
      ref: main
      subdir: with-hono
  - id: ai-sdk
    title: "AI SDK agent (AI Gateway, object storage, Drizzle) on Neon Functions"
    description: "A Vercel AI SDK agent on Neon Functions: streams chat through the Neon AI Gateway, generates an image with OpenAI image generation, and stores it in Neon object storage indexed in Postgres via Drizzle."
    services:
      - Postgres
      - Functions
      - Object Storage
      - AI Gateway
    source:
      owner: neondatabase
      repo: examples
      ref: main
      subdir: with-ai-sdk
  - id: mastra
    title: "Mastra personal agent (AI Gateway, Mastra Memory) on Neon Functions"
    description: "A Mastra personal-assistant agent on Neon Functions: streams chat through the Neon AI Gateway and uses Mastra Memory — backed by Neon Postgres — to remember the user across conversation threads via resource-scoped working memory."
    services:
      - Postgres
      - Functions
      - AI Gateway
    source:
      owner: neondatabase
      repo: examples
      ref: main
      subdir: with-mastra
  - id: mcp
    title: "MCP server (Model Context Protocol SDK, Hono, Drizzle) on Neon Functions"
    description: "An MCP server on Neon Functions exposing CRUD tools (create, update, delete, search) over a contact-management database. Built with the Anthropic MCP TypeScript SDK and Hono's streamable HTTP transport, backed by Neon Postgres via Drizzle."
    services:
      - Postgres
      - Functions
    source:
      owner: neondatabase
      repo: examples
      ref: main
      subdir: with-mcp
  - id: realtime-chat
    title: "Realtime chat (Next.js, Neon Auth, WebSockets) on Neon Functions"
    description: "A full-stack realtime chat: a Next.js app with Neon Auth talking over WebSockets to a Hono server on Neon Functions. Messages are stored in Neon Postgres via Drizzle and fanned out to all clients across isolates with Postgres LISTEN/NOTIFY."
    services:
      - Postgres
      - Functions
      - Neon Auth
    source:
      owner: neondatabase
      repo: examples
      ref: main
      subdir: with-realtime-chat
  - id: realtime-sse
    title: "Realtime counter (TanStack Router, SSE) on Neon Functions"
    description: "A realtime shared counter: a client-only TanStack Router SPA talking over server-sent events to a Hono server on Neon Functions. The count is stored in Neon Postgres via Drizzle and pushed to all clients across isolates with Postgres LISTEN/NOTIFY."
    services:
      - Postgres
      - Functions
    source:
      owner: neondatabase
      repo: examples
      ref: main
      subdir: with-realtime-sse
`;

// Cheap structural guard so a 200 that returns an error page / truncated body
// never gets served as the manifest.
const looksLikeManifest = (text) => typeof text === 'string' && /(^|\n)templates\s*:/.test(text);

async function loadManifest() {
  try {
    const response = await fetch(SOURCE_URL, {
      headers: { 'User-Agent': 'neon-website-bootstrap-templates' },
      next: { revalidate: CACHE_SECONDS },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const text = await response.text();
    if (!looksLikeManifest(text)) {
      throw new Error('upstream response did not look like a manifest');
    }
    return text;
  } catch {
    return FALLBACK_MANIFEST;
  }
}

export async function GET() {
  const manifest = await loadManifest();
  return new Response(manifest, {
    headers: {
      'Content-Type': 'text/yaml; charset=utf-8',
      'Cache-Control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
    },
  });
}
