import { renderTemplateMarkdown } from 'components/pages/functions/templates/markdown';
import { getFunctionRegistryTemplatePage } from 'utils/function-registry';

import {
  catalogUnavailableResponse,
  markdownResponse,
  templateNotFoundResponse,
} from '../markdown-response';

// Markdown mirror of /functions/templates/[id]. The proxy serves it for
// /functions/templates/[id].md and for agent requests to the HTML page.
export const revalidate = 3600;

export async function GET(_req, { params }) {
  const { id } = await params;
  const pathname = `/functions/templates/${id}.md`;

  let page;
  try {
    page = await getFunctionRegistryTemplatePage(id);
  } catch {
    return catalogUnavailableResponse(pathname);
  }

  if (!page) return templateNotFoundResponse(pathname);
  return markdownResponse(renderTemplateMarkdown(page));
}
