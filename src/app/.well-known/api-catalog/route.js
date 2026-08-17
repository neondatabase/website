import { buildApiCatalog } from 'constants/agent-discovery';

export const dynamic = 'force-static';

// RFC 9727 API catalog (linkset). Body is assembled from the source of truth in
// constants/agent-discovery. Do not hard-code values here — edit the SoT.
export function GET() {
  return new Response(JSON.stringify(buildApiCatalog()), {
    headers: { 'Content-Type': 'application/linkset+json' },
  });
}
