export const dynamic = 'force-static';

// MCP server card. `url` is the required connect endpoint per the discovery
// convention consumed by tools like integrations.sh; `authentication` mirrors
// the OAuth metadata served at https://mcp.neon.tech/.well-known/oauth-authorization-server
// (self-onboarding via RFC 7591 dynamic client registration).
export function GET() {
  return Response.json({
    serverInfo: { name: 'Neon MCP', version: '1.0.0' },
    url: 'https://mcp.neon.tech/mcp',
    endpoint: 'https://mcp.neon.tech/mcp',
    authentication: {
      type: 'oauth2',
      authorization_server: 'https://mcp.neon.tech',
    },
    capabilities: { tools: {}, resources: {} },
  });
}
