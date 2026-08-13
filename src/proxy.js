import { NextResponse } from 'next/server';

import { checkCookie, getReferer } from 'app/actions';
import { CONTENT_ROUTES } from 'constants/content';
import LINKS from 'constants/links';

import {
  isAIAgentRequest,
  getMarkdownPath,
  buildAgent404Response,
} from './utils/ai-agent-detection';
import { trackLLMPageview } from './utils/llm-analytics';
import { markdownNotFoundResponse } from './utils/markdown-404';

const SITE_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

function isContentRoute(pathname) {
  const path = pathname.slice(1).replace(/\/$/, '');
  const normalized = path.endsWith('.md') ? path.slice(0, -3) : path;
  return Object.keys(CONTENT_ROUTES).some(
    (route) => normalized === route || path.startsWith(`${route}/`)
  );
}

function applyDocHeaders(response) {
  response.headers.append('Vary', 'Accept');
  response.headers.set('X-LLMs-Txt', '/docs/llms.txt');
  response.headers.append('Link', '</docs/llms.txt>; rel="llms-txt"');
  response.headers.append('Link', '</docs/llms-full.txt>; rel="llms-full-txt"');
  return response;
}

const BLOG_CDN_BASE = process.env.BLOG_CDN_URL || 'https://blog.neonapi.io/blog';

// Resolve where a moved `.md` page should redirect. next.config `redirectFrom`
// rules match only the non-`.md` source, so we probe the HTML sibling (which
// flows through those rules) and mirror its permanent redirect onto the `.md`.
// Returns the target `.md` path, or null to fall through to the normal 404.
async function resolveMarkdownRedirect(pathname, origin) {
  const htmlPathname = pathname.endsWith('.md') ? pathname.slice(0, -3) : pathname;

  try {
    // Neutral UA so the probe isn't classified as an AI agent (isAIAgentRequest
    // matches broad tokens like curl/got/axios) and gets the next.config 308.
    const response = await fetch(`${origin}${htmlPathname}`, {
      headers: { Accept: 'text/html', 'User-Agent': 'neon-md-redirect-probe' },
      redirect: 'manual',
    });

    // Permanent redirects only; a 302/307 must not become a hard-cached 308.
    if (response.status !== 301 && response.status !== 308) return null;

    const location = response.headers.get('location');
    if (!location) return null;

    // Off-origin or root targets have no `.md` equivalent.
    const url = new URL(location, origin);
    if (url.origin !== origin) return null;

    const targetPathname = url.pathname.replace(/\/$/, '');
    if (!targetPathname) return null;

    return `${targetPathname}.md`;
  } catch (error) {
    console.error('[.md] Error resolving markdown redirect', { pathname, error: error.message });
    return null;
  }
}

// 308 to a moved `.md` page's target, or null if there's no redirect. Handled
// here (not next.config) to keep the route count under Next's 1000-route limit.
async function markdownRedirectResponse(req, pathname) {
  if (!pathname.endsWith('.md')) return null;

  const target = await resolveMarkdownRedirect(pathname, req.nextUrl.origin);
  if (!target) return null;

  const response = NextResponse.redirect(new URL(target, req.url), 308);
  // Short TTL so cached 308s still re-enter the proxy and get tracked.
  response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300');
  return response;
}

// A 308 to the moved target if one exists, else the agent 404 body. `source`
// sets X-Content-Source so logs distinguish the agent vs direct `.md` branch.
async function markdownMovedOr404Response(req, pathname, source) {
  const redirect = await markdownRedirectResponse(req, pathname);
  if (redirect) return redirect;

  return markdownNotFoundResponse(pathname, { source });
}

// Retired neon-postgres skill reference files. The `references/` directory was
// removed when the vendored skills were reconciled 1:1 with upstream (#5309),
// and SKILL.md was updated (#4666) to link the consolidated docs pages instead.
// Tools that cached the old SKILL.md still fetch these URLs, so 308 them to the
// consolidated pages. Keyed by the reference basename (no `.md`); values are the
// live targets.
const SKILL_REFERENCE_BASE = '/docs/ai/skills/neon-postgres/references/';
const SKILL_REFERENCE_REDIRECTS = {
  'what-is-neon': '/docs/introduction/architecture-overview.md',
  'getting-started': '/docs/get-started/connect-neon.md',
  'connection-methods': '/docs/connect/choose-connection.md',
  'neon-serverless': '/docs/serverless/serverless-driver.md',
  'neon-js': '/docs/reference/javascript-sdk.md',
  'neon-rest-api': '/docs/reference/api-reference.md',
  'neon-typescript-sdk': '/docs/reference/typescript-sdk.md',
  'neon-python-sdk': '/docs/reference/python-sdk.md',
  'neon-auth': '/docs/auth/overview.md',
  branching: '/docs/introduction/branching.md',
  'neon-cli': '/docs/cli/install.md',
  devtools: '/docs/reference/api.md',
};

// 308 for a retired skill reference URL, or null if it isn't one. Normalizes the
// variants seen in logs: missing `.md` (`…/neon-auth`) and doubled (`…/neon-auth.md.md`).
function skillReferenceRedirectResponse(req, pathname) {
  if (!pathname.startsWith(SKILL_REFERENCE_BASE)) return null;

  let basename = pathname.slice(SKILL_REFERENCE_BASE.length);
  while (basename.endsWith('.md')) basename = basename.slice(0, -3);

  const target = SKILL_REFERENCE_REDIRECTS[basename];
  if (!target) return null;

  const response = NextResponse.redirect(new URL(target, req.url), 308);
  // Short TTL so cached redirects still re-enter the proxy and get LLM-tracked.
  response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300');
  return response;
}

export async function proxy(req) {
  try {
    const { pathname } = req.nextUrl;

    // /blog/[slug].md — serve raw markdown from CDN for any requester
    if (pathname.startsWith('/blog/') && pathname.endsWith('.md')) {
      const slug = pathname.slice('/blog/'.length, -'.md'.length);
      try {
        const res = await fetch(`${BLOG_CDN_BASE}/posts/${slug}.md`);
        if (res.ok) {
          trackLLMPageview(req);
          const markdown = await res.text();
          return new NextResponse(markdown, {
            status: 200,
            headers: {
              'Content-Type': 'text/markdown; charset=utf-8',
              'Cache-Control': 'public, max-age=3600, s-maxage=86400',
              'X-Content-Source': 'markdown',
              'X-Robots-Tag': 'noindex',
              'X-LLMs-Txt': '/blog/llms.txt',
            },
          });
        }
        if (res.status === 404) {
          return new NextResponse(
            buildAgent404Response(pathname, {
              context: 'Neon Blog',
              extraLinks: [
                { label: 'Blog index', href: '/blog/llms.txt', description: 'All Neon blog posts' },
              ],
            }),
            {
              status: 404,
              headers: {
                'Content-Type': 'text/markdown; charset=utf-8',
                'Cache-Control': 'public, max-age=60, s-maxage=300',
                'X-Content-Source': 'agent-404',
                'X-LLMs-Txt': '/blog/llms.txt',
              },
            }
          );
        }
        // Non-200/404 from CDN (5xx, etc.) — fall through to 502
        return new NextResponse(`# Service Unavailable\n\nCould not fetch /blog/${slug}.md.\n`, {
          status: 502,
          headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
        });
      } catch (error) {
        console.error('[blog .md] Error fetching from CDN', { slug, error: error.message });
        return new NextResponse(`# Service Unavailable\n\nCould not fetch /blog/${slug}.md.\n`, {
          status: 502,
          headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
        });
      }
    }

    // Retired neon-postgres skill reference URLs (PR #4666) → 308 to their
    // consolidated docs pages. Runs before agent detection so browsers and tools
    // both follow the redirect.
    const skillRedirect = skillReferenceRedirectResponse(req, pathname);
    if (skillRedirect) return skillRedirect;

    if (isAIAgentRequest(req)) {
      let agentHit404 = false;
      const markdownPath = getMarkdownPath(pathname);

      if (markdownPath) {
        try {
          const markdownUrl = `${req.nextUrl.origin}${markdownPath}`;
          const response = await fetch(markdownUrl);

          if (response.ok) {
            trackLLMPageview(req);
            const markdown = await response.text();
            return applyDocHeaders(
              new NextResponse(markdown, {
                status: 200,
                headers: {
                  'Content-Type': 'text/markdown; charset=utf-8',
                  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
                  'X-Content-Source': 'markdown',
                  'X-Robots-Tag': 'noindex',
                },
              })
            );
          }
          agentHit404 = response.status === 404;
          if (!agentHit404) {
            console.error('[AI Agent] Failed to fetch markdown', {
              pathname,
              markdownPath,
              status: response.status,
            });
          }
        } catch (error) {
          console.error('[AI Agent] Error serving markdown', { pathname, error: error.message });
        }
      }

      trackLLMPageview(req, { is404: agentHit404 });

      if (agentHit404) {
        return markdownMovedOr404Response(req, pathname, 'agent-404');
      }
    }

    // Bare /docs has no page of its own. Agents / Accept: markdown are handled above
    // (served /docs/llms.txt); everyone else (browsers) is redirected to the intro.
    // This redirect lives here, not in next.config, so it runs after the markdown check.
    // Note: trailing slash (/docs/) intentionally not handled here — Next.js
    // normalizes trailing slashes before middleware on most paths, and the matcher
    // pattern '/docs' does not match '/docs/', so it falls through harmlessly.
    if (pathname === '/docs') {
      const res = NextResponse.redirect(new URL('/docs/introduction', req.url), 308);
      // The /docs response is content-negotiated (agents/markdown get llms.txt above),
      // so the redirect must vary on Accept to stay correct in shared caches.
      res.headers.set('Vary', 'Accept');
      return res;
    }

    // Apply doc headers to all content route responses (.md URLs and HTML pages).
    // Vary: Accept is only set on markdown-negotiated responses (applyDocHeaders above).
    if (isContentRoute(pathname)) {
      if (pathname.endsWith('.md')) {
        const markdownPath = getMarkdownPath(pathname);

        if (markdownPath) {
          try {
            const markdownUrl = `${req.nextUrl.origin}${markdownPath}`;
            const response = await fetch(markdownUrl);

            // Track .md as agent traffic, but only on outcomes handled here
            // (200/404). A 5xx falls through untracked — the agent branch above
            // already tracked it, so tracking again would double-count.
            const isMarkdown404 = response.status === 404;
            if (response.ok || isMarkdown404) {
              trackLLMPageview(req, { is404: isMarkdown404 });
            }

            if (response.ok) {
              const markdown = await response.text();
              return applyDocHeaders(
                new NextResponse(markdown, {
                  status: 200,
                  headers: {
                    'Content-Type': 'text/markdown; charset=utf-8',
                    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
                    'X-Content-Source': 'markdown',
                    'X-Robots-Tag': 'noindex',
                  },
                })
              );
            }

            if (response.status === 404) {
              return markdownMovedOr404Response(req, pathname, 'md-404');
            }
          } catch (error) {
            console.error('[.md] Error serving markdown', { pathname, error: error.message });
          }
        }
      }

      const response = NextResponse.next();
      response.headers.set('X-LLMs-Txt', '/docs/llms.txt');
      response.headers.append('Link', '</docs/llms.txt>; rel="llms-txt"');
      response.headers.append('Link', '</docs/llms-full.txt>; rel="llms-full-txt"');
      if (pathname.endsWith('.md')) {
        response.headers.set('X-Robots-Tag', 'noindex');
      }
      return response;
    }

    // Check if the user is logged in
    try {
      const isLoggedIn = await checkCookie('neon_login_indicator');
      if (pathname === '/' && isLoggedIn) {
        try {
          const referer = await getReferer();
          // If user is already browsing the site, show them the homepage
          if (
            referer.includes(process.env.VERCEL_BRANCH_URL) ||
            referer.includes(process.env.NEXT_PUBLIC_DEFAULT_SITE_URL)
          ) {
            return NextResponse.redirect(new URL('/home', req.url));
          }
        } catch (error) {
          console.error('Error getting referer:', error);
        }
        // If user came from external source, redirect to console
        return NextResponse.redirect(LINKS.console);
      }
      // If not logged in but on /home, redirect to main homepage
      if (pathname === '/home' && !isLoggedIn) {
        return NextResponse.redirect(new URL(SITE_URL));
      }
    } catch (error) {
      console.error('Error checking login indicator:', error);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware execution error:', error);
    // General error fallback
    return NextResponse.redirect(new URL(SITE_URL));
  }
}

export const config = {
  matcher: [
    '/', // Check if the user is logged in
    '/home', // Check if the user is logged in
    '/pricing', // Agent-friendly pricing page
    '/docs', // Bare docs root: serve llms.txt for agents; browsers fall through to the /docs→/docs/introduction redirect
    '/blog', // Bare blog root: serve blog/llms.txt for agents; browsers fall through normally
    '/blog/:slug.md', // Individual blog post markdown
    '/(docs|postgresql|guides|branching|programs|use-cases|faqs)/:path*', // All markdown routes
    '/:path(docs|postgresql|guides|branching|programs|use-cases).md', // Top-level .md index URLs
  ],
};
