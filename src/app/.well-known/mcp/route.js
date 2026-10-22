import { buildMcpWellKnown } from 'constants/agent-discovery';

export const dynamic = 'force-static';

// Bare /.well-known/mcp discovery document. Body is assembled from the source of
// truth in constants/agent-discovery. Do not hard-code values here; edit the SoT.
export function GET() {
  return Response.json(buildMcpWellKnown());
}
