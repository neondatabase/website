// Source of truth (spec-agnostic) for Neon's machine-readable agent-discovery
// surfaces — the raw facts (endpoint URLs, auth servers, spec locations) plus
// small builder functions that assemble the served payloads from those facts.
//
// This module intentionally knows NOTHING about the discovery specs themselves
// (RFC 9727, MCP, agentskills.io, …). The inventory of endpoints, their spec
// links, and the per-spec validators live in config/agent-endpoints.yaml and
// scripts/verify-agent-endpoints.mjs. That verifier imports the builders below
// and checks their output against each spec AND against these constants, so the
// files can never drift from the source of truth.
//
// CommonJS (like constants/content.js) so it is consumable three ways:
//   - ESM named imports from Next route handlers  (import { buildApiCatalog } …)
//   - require() from next.config.js
//   - require() from the Node verifier script
//
// When a surface changes (new MCP endpoint, moved spec, new auth server), edit
// it HERE — never hand-edit the individual route/JSON files.

// Neon MCP server. OAuth metadata mirrors what the resource server advertises at
// https://mcp.neon.tech/.well-known/oauth-authorization-server (self-onboarding
// via RFC 7591 dynamic client registration).
const MCP_SERVER = {
  connectUrl: 'https://mcp.neon.tech/mcp',
  transport: 'streamable-http',
  authorizationServer: 'https://mcp.neon.tech',
  cardUrl: 'https://neon.com/.well-known/mcp/server-card.json',
  serverInfo: { name: 'Neon MCP', version: '1.0.0' },
};

// Neon REST management API and its published OpenAPI document. `openApiSpecUrl`
// is also aliased to /openapi.json via next.config.js so agents probing the
// conventional OpenAPI path resolve it.
const NEON_API = {
  baseUrl: 'https://console.neon.tech/api/v2',
  openApiSpecUrl: 'https://neon.com/api_spec/release/v2.json',
  docsUrl: 'https://neon.com/docs/reference/api',
};

// ── Payload builders ───────────────────────────────────────────────────────
// Each builder returns the exact JSON body served at the corresponding path.
// The route handlers are thin wrappers around these so the verifier can assert
// the served payload straight from the source of truth.

// /.well-known/mcp/server-card.json — `url` is the required connect endpoint per
// the discovery convention; `authentication` advertises OAuth self-onboarding.
// `endpoint` is kept for backward compatibility.
function buildMcpServerCard() {
  return {
    serverInfo: MCP_SERVER.serverInfo,
    url: MCP_SERVER.connectUrl,
    endpoint: MCP_SERVER.connectUrl,
    authentication: {
      type: 'oauth2',
      authorization_server: MCP_SERVER.authorizationServer,
    },
    capabilities: { tools: {}, resources: {} },
  };
}

// /.well-known/api-catalog — RFC 9727 linkset pointing at the API base, its
// OpenAPI document, and the human docs.
function buildApiCatalog() {
  return {
    linkset: [
      {
        anchor: NEON_API.baseUrl,
        'service-desc': [{ href: NEON_API.openApiSpecUrl, type: 'application/json' }],
        'service-doc': [{ href: NEON_API.docsUrl }],
      },
    ],
  };
}

module.exports = {
  MCP_SERVER,
  NEON_API,
  buildMcpServerCard,
  buildApiCatalog,
};
