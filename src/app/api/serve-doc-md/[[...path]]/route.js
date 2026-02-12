const fs = require('fs').promises;
const path = require('path');

/**
 * Serves processed markdown for doc .md URLs (e.g. /docs/ai/ai-rules.md).
 * Rewrites in next.config.js send those requests here. We read from public/md/
 * which is populated at build time (postbuild) and included via outputFileTracingIncludes.
 */
export async function GET(request, context) {
  const params = typeof context.params?.then === 'function' ? await context.params : context.params;
  const pathSegments = params?.path;
  if (!pathSegments?.length) {
    return new Response('Not Found', { status: 404 });
  }

  const slug = pathSegments.join('/');
  const filePath = path.join(process.cwd(), 'public', 'md', `${slug}.md`);

  // Security: ensure resolved path is under public/md
  const publicMdDir = path.join(process.cwd(), 'public', 'md');
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(publicMdDir) || path.relative(publicMdDir, resolved).startsWith('..')) {
    return new Response('Not Found', { status: 404 });
  }

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Content-Source': 'markdown',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (err) {
    if (err.code === 'ENOENT') return new Response('Not Found', { status: 404 });
    throw err;
  }
}
