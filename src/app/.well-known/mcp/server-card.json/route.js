export const dynamic = 'force-static';

export function GET() {
  return Response.json({
    serverInfo: { name: 'Neon MCP', version: '1.0.0' },
    endpoint: 'https://mcp.neon.tech/mcp',
    capabilities: { tools: {}, resources: {} },
  });
}
