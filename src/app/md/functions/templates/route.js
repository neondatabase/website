import { renderTemplatesIndexMarkdown } from 'components/pages/functions/templates/markdown';
import { getFunctionRegistryCatalog } from 'utils/function-registry';

import { catalogUnavailableResponse, markdownResponse } from './markdown-response';

// Markdown mirror of /functions/templates. The proxy serves it for
// /functions/templates.md and for agent requests to /functions/templates.
export const revalidate = 3600;

export async function GET() {
  const templates = await getFunctionRegistryCatalog();
  if (templates.length === 0) return catalogUnavailableResponse('/functions/templates.md');
  return markdownResponse(renderTemplatesIndexMarkdown(templates));
}
