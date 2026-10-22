// GET returns the MCP Foundation server.json descriptor, or 405 when an MCP
// client probes for an event stream (see GET below).
// POST proxies MCP protocol requests (initialize, tools/list, tools/call) to
// the unauthenticated docs-scoped endpoint at mcp.neon.tech so agents can
// connect directly to neon.com/docs/mcp without OAuth.
//
// NOTE: force-static is intentionally absent. The POST handler is dynamic
// (proxies live requests). Adding force-static would break POST at build time.
//
// The ?category=docs parameter scopes the server to its documentation tools
// and bypasses OAuth. Both behaviors are server-side features of mcp.neon.tech,
// not enforced here. Run tools/list for the current set of tools.
//
// The descriptor and upstream URL come from the source of truth in
// constants/agent-discovery. Do not hard-code them here; edit the SoT.
import { DOCS_MCP_SERVER, buildDocsMcpServerJson } from 'constants/agent-discovery';

const UPSTREAM_URL = DOCS_MCP_SERVER.upstreamUrl;

export async function GET(request) {
  const accept = (request?.headers.get('Accept') ?? '').toLowerCase();
  // MCP clients probe GET for an event stream; answer like the upstream (405 = no
  // stream). Returning the JSON descriptor instead makes clients reconnect in a loop.
  if (accept.includes('text/event-stream') && !accept.includes('application/json')) {
    return new Response(null, {
      status: 405,
      headers: { Allow: 'POST', 'Cache-Control': 'no-store' },
    });
  }
  // Not edge-cached, so a cached descriptor is never served to an event-stream probe.
  return Response.json(buildDocsMcpServerJson(), {
    headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' },
  });
}

export async function POST(request) {
  let body;
  try {
    body = await request.text();
  } catch {
    return Response.json({ error: 'Failed to read request body' }, { status: 400 });
  }

  let upstream;
  try {
    upstream = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('Content-Type') ?? 'application/json',
        Accept: request.headers.get('Accept') ?? 'application/json, text/event-stream',
      },
      body,
    });
  } catch {
    return Response.json({ error: 'Upstream MCP server unavailable' }, { status: 502 });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
