export const dynamic = 'force-static';

// AI Catalog (https://ai-catalog.io/) — a typed, discoverable index of Neon's
// AI artifacts (MCP server and agent skills). The catalog is a thin discovery +
// trust layer that points at each artifact's native metadata; it does not
// redefine those formats. Served at /.well-known/ai-catalog.json per the spec.
const catalog = {
  specVersion: '1.0',
  host: {
    displayName: 'Neon',
    identifier: 'neon.com',
    documentationUrl: 'https://neon.com/docs',
    logoUrl: 'https://neon.com/brand/neon-logomark-dark-color.svg',
  },
  entries: [
    {
      identifier: 'urn:air:neon.com:mcp:neon',
      type: 'application/mcp-server-card+json',
      url: 'https://neon.com/.well-known/mcp/server-card.json',
      description:
        'Neon MCP server for managing Neon Postgres projects, branches, databases, and running SQL from AI agents and MCP clients.',
      tags: ['postgres', 'database', 'mcp', 'neon'],
    },
    {
      identifier: 'urn:air:neon.com:skill:neon',
      type: 'application/agent-skills+md',
      url: 'https://neon.com/.well-known/agent-skills/neon/SKILL.md',
      description:
        'Overview of the Neon platform for apps and agents, spanning Postgres, Auth, Data API, Object Storage, Compute Functions, and AI Gateway.',
      tags: ['neon', 'postgres', 'overview', 'agent-skill'],
    },
    {
      identifier: 'urn:air:neon.com:skill:neon-postgres',
      type: 'application/agent-skills+md',
      url: 'https://neon.com/.well-known/agent-skills/neon-postgres/SKILL.md',
      description:
        'Guides and best practices for working with Neon Serverless Postgres: setup, connections, branching, autoscaling, scale-to-zero, read replicas, pooling, Neon Auth, CLI, MCP, REST API, and SDKs.',
      tags: ['neon', 'postgres', 'serverless', 'agent-skill'],
    },
    {
      identifier: 'urn:air:neon.com:skill:neon-postgres-agent-platforms',
      type: 'application/agent-skills+md',
      url: 'https://neon.com/.well-known/agent-skills/neon-postgres-agent-platforms/SKILL.md',
      description:
        'Build and operate multi-tenant AI agent platforms on Neon: project-per-tenant provisioning, the Neon Agent Plan, fleet consumption tracking, and snapshot/restore workflows for generated apps.',
      tags: ['neon', 'postgres', 'agent-platforms', 'agent-plan', 'agent-skill'],
    },
    {
      identifier: 'urn:air:neon.com:skill:neon-postgres-branches',
      type: 'application/agent-skills+md',
      url: 'https://neon.com/.well-known/agent-skills/neon-postgres-branches/SKILL.md',
      description:
        'Choose and create the right Neon branch type for testing and development, including migration testing with real data and schema-only branches for sensitive data.',
      tags: ['neon', 'postgres', 'branching', 'agent-skill'],
    },
    {
      identifier: 'urn:air:neon.com:skill:claimable-postgres',
      type: 'application/agent-skills+md',
      url: 'https://neon.com/.well-known/agent-skills/claimable-postgres/SKILL.md',
      description:
        'Provision instant temporary Postgres databases via Claimable Postgres by Neon (neon.new) with no login, signup, or credit card. Supports REST API, CLI, and SDK.',
      tags: ['neon', 'postgres', 'instant', 'agent-skill'],
    },
    {
      identifier: 'urn:air:neon.com:skill:neon-postgres-egress-optimizer',
      type: 'application/agent-skills+md',
      url: 'https://neon.com/.well-known/agent-skills/neon-postgres-egress-optimizer/SKILL.md',
      description:
        'Diagnose and fix excessive Postgres egress (network data transfer) in a codebase to reduce data transfer costs and optimize query patterns.',
      tags: ['neon', 'postgres', 'cost-optimization', 'agent-skill'],
    },
    {
      identifier: 'urn:air:neon.com:skill:neon-object-storage',
      type: 'application/agent-skills+md',
      url: 'https://neon.com/.well-known/agent-skills/neon-object-storage/SKILL.md',
      description:
        'S3-compatible object storage that branches with your Neon project, so files and database rows stay in sync across dev, preview, and production environments.',
      tags: ['neon', 'object-storage', 's3', 'agent-skill'],
    },
    {
      identifier: 'urn:air:neon.com:skill:neon-ai-gateway',
      type: 'application/agent-skills+md',
      url: 'https://neon.com/.well-known/agent-skills/neon-ai-gateway/SKILL.md',
      description:
        'One API and one Neon credential for frontier and open-source LLMs from multiple providers, compatible with the OpenAI, Anthropic, and Vercel AI SDKs.',
      tags: ['neon', 'ai-gateway', 'llm', 'agent-skill'],
    },
    {
      identifier: 'urn:air:neon.com:skill:neon-functions',
      type: 'application/agent-skills+md',
      url: 'https://neon.com/.well-known/agent-skills/neon-functions/SKILL.md',
      description:
        'Long-running, serverless Node.js HTTP functions deployed onto your Neon branch, with DATABASE_URL injected automatically and compute that runs next to your data.',
      tags: ['neon', 'functions', 'serverless', 'agent-skill'],
    },
  ],
};

export function GET() {
  return new Response(JSON.stringify(catalog), {
    headers: { 'Content-Type': 'application/ai-catalog+json' },
  });
}
