import { buildAgent404Response } from 'utils/ai-agent-detection';

const MARKDOWN_HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'Cache-Control': 'public, max-age=60, s-maxage=300',
  'X-Content-Source': 'markdown',
  'X-Robots-Tag': 'noindex',
};

export const markdownResponse = (body, status = 200) =>
  new Response(body, { status, headers: MARKDOWN_HEADERS });

export const templateNotFoundResponse = (pathname) =>
  markdownResponse(
    buildAgent404Response(pathname, {
      context: 'Neon Function Registry templates',
      extraLinks: [
        {
          label: 'All templates',
          href: '/functions/templates.md',
          description: 'Every template in the Function Registry',
        },
      ],
    }),
    404
  );

export const catalogUnavailableResponse = (pathname) =>
  markdownResponse(
    `# Service Unavailable\n\nThe Function Registry catalog could not be loaded for ${pathname}. Try again shortly, or read https://neon.com/functions/registry/registry.json.\n`,
    503
  );
