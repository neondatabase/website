import { buildClaimableAuthorizationServer } from 'constants/agent-discovery';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(buildClaimableAuthorizationServer());
}
