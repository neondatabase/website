import catalog from './catalog.json';

export const dynamic = 'force-static';

// AI Catalog (https://ai-catalog.io/) — a typed, discoverable index of Neon's
// AI artifacts (MCP server and agent skills). The catalog is a thin discovery +
// trust layer that points at each artifact's native metadata; it does not
// redefine those formats. Served at /.well-known/ai-catalog.json per the spec.
//
// The catalog content is generated from the published SKILL.md files by
// `npm run generate:skills` (src/scripts/generate-skills-index.js) and written
// to ./catalog.json, so the skill entries stay in sync with the agent-skills
// index. The handler exists (rather than a static public/ file) so it can set
// the spec-mandated application/ai-catalog+json media type.
export function GET() {
  return new Response(JSON.stringify(catalog), {
    headers: { 'Content-Type': 'application/ai-catalog+json' },
  });
}
