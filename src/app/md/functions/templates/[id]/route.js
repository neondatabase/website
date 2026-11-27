import { renderTemplateMarkdown } from 'components/pages/functions/templates/markdown';
import {
  SHOW_FUNCTION_TEMPLATE_INSTALLS,
  getFunctionTemplateInstalls,
} from 'utils/api-function-template-installs';
import {
  getFunctionRegistryTemplatePage,
  getFunctionRegistryTemplateReadme,
} from 'utils/function-registry';

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
  const [readme, installs] = await Promise.all([
    getFunctionRegistryTemplateReadme(page.template),
    SHOW_FUNCTION_TEMPLATE_INSTALLS ? getFunctionTemplateInstalls(page.template.id) : [],
  ]);
  return markdownResponse(renderTemplateMarkdown({ ...page, readme, installs }));
}
