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
  // Registry identity, mirrored from the upstream server.json that the official
  // MCP Registry publishes (github.com/neondatabase/mcp-server-neon). The live
  // verifier compares the built document against that file, so keep these in step.
  registry: {
    schema: 'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json',
    name: 'com.neon/mcp',
    title: 'Neon',
    description:
      'Official Neon MCP server for managing Neon projects and Lakebase Postgres databases.',
    version: '1.0.0',
    websiteUrl: 'https://neon.com/docs/ai/neon-mcp-server',
    repositoryUrl: 'https://github.com/neondatabase/mcp-server-neon',
    icons: [
      {
        src: 'https://neon.com/brand/neon-logo-light-color.svg',
        mimeType: 'image/svg+xml',
        sizes: ['any'],
        theme: 'light',
      },
      {
        src: 'https://neon.com/brand/neon-logo-dark-color.svg',
        mimeType: 'image/svg+xml',
        sizes: ['any'],
        theme: 'dark',
      },
    ],
    headers: [
      {
        name: 'Authorization',
        description: 'Optional Bearer token with a Neon API key.',
        isSecret: true,
      },
      {
        name: 'x-read-only',
        description: 'Optional header to enable read-only mode for tool filtering.',
        format: 'boolean',
        default: 'false',
      },
    ],
  },
};

// Neon REST management API and its published OpenAPI document. `openApiSpecUrl`
// is also aliased to /openapi.json via next.config.js so agents probing the
// conventional OpenAPI path resolve it.
const NEON_API = {
  baseUrl: 'https://console.neon.tech/api/v2',
  openApiSpecUrl: 'https://neon.com/api_spec/release/v2.json',
  docsUrl: 'https://neon.com/docs/reference/api',
};

// A path issuer avoids publishing Claimable metadata at neon.com's apex.
const CLAIMABLE = {
  issuer: 'https://neon.com/claimable',
  skillUrl: 'https://neon.com/auth.md',
  resource: 'https://claimable.neon.tech/',
  tokenEndpoint: 'https://claimable.neon.tech/v1/oauth2/token',
  revocationEndpoint: 'https://claimable.neon.tech/v1/oauth2/revoke',
  jwksUri: 'https://claimable.neon.tech/.well-known/jwks.json',
  identityEndpoint: 'https://claimable.neon.tech/v1/agent/identity',
  claimEndpoint: 'https://claimable.neon.tech/v1/agent/identity/claim',
  authMarkdownPath: 'public/auth.md',
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

// /.well-known/mcp: MCP Registry server.json shape, so agents probing the bare
// well-known path find the Streamable HTTP endpoint. Mirrors the upstream
// registry entry; the connect URL and transport come from the fields above.
function buildMcpWellKnown() {
  const { registry } = MCP_SERVER;
  return {
    $schema: registry.schema,
    name: registry.name,
    title: registry.title,
    description: registry.description,
    repository: { url: registry.repositoryUrl, source: 'github' },
    version: registry.version,
    websiteUrl: registry.websiteUrl,
    icons: registry.icons,
    remotes: [
      { type: MCP_SERVER.transport, url: MCP_SERVER.connectUrl, headers: registry.headers },
    ],
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

function buildClaimableAuthorizationServer() {
  return {
    issuer: CLAIMABLE.issuer,
    token_endpoint: CLAIMABLE.tokenEndpoint,
    revocation_endpoint: CLAIMABLE.revocationEndpoint,
    jwks_uri: CLAIMABLE.jwksUri,
    grant_types_supported: ['urn:ietf:params:oauth:grant-type:jwt-bearer'],
    token_endpoint_auth_methods_supported: ['none'],
    response_types_supported: [],
    agent_auth: {
      skill: CLAIMABLE.skillUrl,
      identity_endpoint: CLAIMABLE.identityEndpoint,
      claim_endpoint: CLAIMABLE.claimEndpoint,
      identity_types_supported: ['anonymous'],
    },
  };
}

module.exports = {
  MCP_SERVER,
  NEON_API,
  CLAIMABLE,
  buildMcpServerCard,
  buildMcpWellKnown,
  buildApiCatalog,
  buildClaimableAuthorizationServer,
};
