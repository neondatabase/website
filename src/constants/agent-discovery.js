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
  // Server card schema (SEP-2127). Versioned by its /vN/ segment, not by date.
  // Spec: https://github.com/modelcontextprotocol/experimental-ext-server-card
  cardSchema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
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

// Neon docs MCP server: the same mcp.neon.tech server scoped by ?category=docs
// to its documentation tools (docs search, page fetch, and feedback), no OAuth.
// The description names no tools: they change, and tools/list is authoritative.
// Agents connect to connectUrl (neon.com/docs/mcp), which proxies POSTs to
// upstreamUrl. Shares the product server's repository and icons.
const DOCS_MCP_SERVER = {
  connectUrl: 'https://neon.com/docs/mcp',
  upstreamUrl: 'https://mcp.neon.tech/mcp?category=docs',
  transport: 'streamable-http',
  cardUrl: 'https://neon.com/.well-known/mcp/docs-server-card.json',
  name: 'com.neon/docs-mcp',
  title: 'Neon Docs',
  description: 'Search and read Neon documentation over MCP. No authentication required.',
  version: '1.0.0',
  websiteUrl: 'https://neon.com/docs/ai/neon-mcp-server',
  repositorySubfolder: 'landing',
};

// Neon REST management API and its published OpenAPI document. `openApiSpecUrl`
// is also aliased to /openapi.json via next.config.js so agents probing the
// conventional OpenAPI path resolve it.
const NEON_API = {
  baseUrl: 'https://console.neon.tech/api/v2',
  openApiSpecUrl: 'https://neon.com/api_spec/release/v2.json',
  docsUrl: 'https://neon.com/docs/reference/api',
  apiKeysUrl: 'https://console.neon.tech/app/settings/api-keys',
  apiKeysDocsUrl: 'https://neon.com/docs/manage/api-keys',
  catalogUrl: 'https://neon.com/.well-known/api-catalog',
};

// Neon CLI, installed from npm as `neon`.
const NEON_CLI = {
  command: 'neon',
  npmPackage: 'neon',
  loginCommand: 'neon login',
  apiKeyEnv: 'NEON_API_KEY',
  docsUrl: 'https://neon.com/docs/cli',
};

// integrations.sh owner declaration (v3). Spec: https://integrations.sh/publishing/
const INTEGRATIONS = {
  url: 'https://neon.com/.well-known/integrations.json',
  version: 3,
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

// /.well-known/mcp/server-card.json. One card read by several discovery
// conventions, so it carries each one's fields:
//   - `url` + `authentication` object: integrations.sh (reads authentication.type)
//   - `name`, `version`, `description`, `transport`: Mintlify's server card
//   - `$schema`, reverse-DNS `name`, `title`, `websiteUrl`, `repository`, `icons`,
//     `remotes[].url`: the MCP server-card extension (SEP-2127; read by Ora)
// The extension schema allows extra properties, so the other conventions' fields
// coexist with it. `endpoint` and `serverInfo` are kept for backward
// compatibility. No `tools[]`: agents read the live tools/list, and a copy here
// would drift.
function buildMcpServerCard() {
  const { registry } = MCP_SERVER;
  return {
    $schema: MCP_SERVER.cardSchema,
    name: registry.name,
    version: registry.version,
    description: registry.description,
    title: registry.title,
    websiteUrl: registry.websiteUrl,
    repository: { url: registry.repositoryUrl, source: 'github' },
    icons: registry.icons,
    url: MCP_SERVER.connectUrl,
    // Mintlify's field; always "http" per its spec. remotes[].type carries the MCP transport.
    transport: 'http',
    remotes: [{ type: MCP_SERVER.transport, url: MCP_SERVER.connectUrl }],
    serverInfo: MCP_SERVER.serverInfo,
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
// Top-level `url` and `transport` follow Mintlify's /.well-known/mcp document,
// so readers expecting that shape find the endpoint too.
function buildMcpWellKnown() {
  const { registry } = MCP_SERVER;
  return {
    $schema: registry.schema,
    url: MCP_SERVER.connectUrl,
    // Mintlify's field; always "http" per its spec. remotes[].type carries the MCP transport.
    transport: 'http',
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

// /.well-known/mcp/docs-server-card.json: server card (SEP-2127) for the docs
// MCP server. Extension fields only: the server takes no auth, so there is no
// `authentication` block for integrations.sh to read.
function buildDocsMcpServerCard() {
  return { ...buildDocsMcpServerJson(), $schema: MCP_SERVER.cardSchema };
}

// GET /docs/mcp: MCP Registry server.json descriptor for the docs MCP server.
function buildDocsMcpServerJson() {
  return {
    $schema: MCP_SERVER.registry.schema,
    name: DOCS_MCP_SERVER.name,
    title: DOCS_MCP_SERVER.title,
    description: DOCS_MCP_SERVER.description,
    repository: {
      url: MCP_SERVER.registry.repositoryUrl,
      source: 'github',
      subfolder: DOCS_MCP_SERVER.repositorySubfolder,
    },
    version: DOCS_MCP_SERVER.version,
    websiteUrl: DOCS_MCP_SERVER.websiteUrl,
    icons: MCP_SERVER.registry.icons,
    remotes: [{ type: DOCS_MCP_SERVER.transport, url: DOCS_MCP_SERVER.connectUrl }],
  };
}

// /.well-known/api-catalog: RFC 9727 linkset. The first entry is anchored at
// the catalog itself and lists each API as an `item`; the second describes the
// API base with its OpenAPI document and the human docs.
function buildApiCatalog() {
  return {
    linkset: [
      {
        anchor: NEON_API.catalogUrl,
        item: [{ href: NEON_API.baseUrl }],
      },
      {
        anchor: NEON_API.baseUrl,
        'service-desc': [{ href: NEON_API.openApiSpecUrl, type: 'application/json' }],
        'service-doc': [{ href: NEON_API.docsUrl }],
      },
    ],
  };
}

// /.well-known/integrations.json: integrations.sh owner declaration (v3). Lists
// each way an agent can integrate with Neon and the credential each one takes.
// Credentials are defined once and referenced by id from each surface's auth.
function buildIntegrationsJson() {
  const declared = { via: 'declared', source: INTEGRATIONS.url };
  const bearer = { source: 'http', in: 'header', headerName: 'Authorization', scheme: 'Bearer' };
  const requires = (...uses) => ({
    status: 'required',
    entries: uses.map((use) => ({ use: [use], basis: declared })),
  });

  return {
    version: INTEGRATIONS.version,
    summary: 'Neon exposes a REST management API, a hosted MCP server, and the Neon CLI.',
    credentials: {
      neon_api_key: {
        type: 'api_key',
        label: 'Neon API key',
        generateUrl: NEON_API.apiKeysUrl,
        setup: `Create a personal, organization, or project-scoped API key in the Neon Console under **Settings** > **API keys**. Send it as an \`Authorization: Bearer\` token, or set \`${NEON_CLI.apiKeyEnv}\` for the Neon CLI. See ${NEON_API.apiKeysDocsUrl}.`,
      },
      neon_mcp_oauth: {
        type: 'oauth2',
        label: 'Neon OAuth (MCP)',
        setup: `Point your MCP client at ${MCP_SERVER.connectUrl} and approve access in the browser. The server supports OAuth dynamic client registration, so there is no client ID or secret to create.`,
      },
      neon_cli_login: {
        type: 'oauth2',
        label: 'Neon CLI login',
        setup: `Run \`${NEON_CLI.loginCommand}\` to authorize the Neon CLI in your browser. Credentials are saved to \`~/.config/neon/credentials.json\`. Vercel-Managed Integration accounts can't use \`${NEON_CLI.loginCommand}\`; use a Neon API key instead.`,
      },
    },
    surfaces: [
      {
        type: 'http',
        slug: 'neon-api',
        name: 'Neon API',
        docs: NEON_API.docsUrl,
        spec: NEON_API.openApiSpecUrl,
        url: NEON_API.baseUrl,
        basis: declared,
        auth: requires({ id: 'neon_api_key', mechanics: bearer }),
      },
      {
        type: 'mcp',
        slug: 'neon-mcp-server',
        name: 'Neon MCP Server',
        docs: MCP_SERVER.registry.websiteUrl,
        url: MCP_SERVER.connectUrl,
        transports: [MCP_SERVER.transport],
        basis: declared,
        auth: requires(
          { id: 'neon_mcp_oauth', mechanics: { source: 'well-known' } },
          { id: 'neon_api_key', mechanics: bearer }
        ),
      },
      {
        type: 'cli',
        slug: 'neon-cli',
        name: 'Neon CLI',
        docs: NEON_CLI.docsUrl,
        command: NEON_CLI.command,
        packages: [{ registryType: 'npm', identifier: NEON_CLI.npmPackage, runtimeHint: 'npx' }],
        basis: declared,
        auth: requires(
          { id: 'neon_cli_login', mechanics: { source: 'cli', command: NEON_CLI.loginCommand } },
          { id: 'neon_api_key', mechanics: { source: 'cli', env: [NEON_CLI.apiKeyEnv] } }
        ),
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
  DOCS_MCP_SERVER,
  NEON_API,
  NEON_CLI,
  INTEGRATIONS,
  CLAIMABLE,
  buildMcpServerCard,
  buildMcpWellKnown,
  buildDocsMcpServerCard,
  buildDocsMcpServerJson,
  buildApiCatalog,
  buildIntegrationsJson,
  buildClaimableAuthorizationServer,
};
