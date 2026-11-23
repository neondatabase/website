import { NextResponse } from 'next/server';

import { checkCookie, getReferer } from 'app/actions';
import { SITEMAP_MD } from 'constants/agent-discovery';
import { CONTENT_ROUTES, GENERATED_PAGE_MARKDOWN_PATHS } from 'constants/content';
import LINKS from 'constants/links';
import { NON_AGENT_FETCH_HEADERS } from 'constants/llm-analytics';
import { STATIC_MD_PATHS } from 'constants/static-md-manifest';

import {
  isAIAgentRequest,
  isBrowserBackgroundRequest,
  isHumanBrowserNavigation,
  getFunctionTemplatesMarkdownPath,
  getMarkdownPath,
} from './utils/ai-agent-detection';
import { createLLMAnalytics } from './utils/llm-analytics';
import {
  MARKDOWN_CACHE_CONTROL,
  markdownNotFoundResponse,
  markdownResponse,
} from './utils/markdown-response';

const SITE_URL =
  process.env.VERCEL_ENV === 'preview'
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;

const IMAGE_EXTENSION = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i;
const GUIDE_AUTHOR_PATH = /^\/guides\/authors\/[^/]+$/;
// A blog post page: /blog/<slug>, one segment, no dot (so /blog/rss.xml and
// /blog/llms.txt aren't posts). /blog/category is a listing prefix, not a post.
const BLOG_POST_PATH = /^\/blog\/([^/.]+)$/;

// Last path segment with percent-encoded unreserved characters decoded, for
// extension matching (the original URL is still what gets forwarded).
function getNormalizedFilename(pathname) {
  const filename = pathname.slice(pathname.lastIndexOf('/') + 1);
  return filename.replace(/%([0-9a-f]{2})/gi, (encoded, hex) => {
    const character = String.fromCharCode(Number.parseInt(hex, 16));
    return /[a-z0-9._~-]/i.test(character) ? character : encoded;
  });
}

// Files that aren't pages (images, downloads, data). Fetching one isn't a page
// read, so agent-html doesn't count it. Docs slugs can contain a dot
// (/docs/auth/migrate/from-auth-v0.1), so this lists asset types rather than
// treating every dot as a file extension.
const ASSET_EXTENSION =
  /\.(?:avif|gif|ico|jpe?g|png|svg|webp|json|pdf|js|css|map|woff2?|ttf|otf|mp4|webm|zip)$/i;

function isAssetRequest(pathname) {
  return pathname === '/docs/og' || ASSET_EXTENSION.test(getNormalizedFilename(pathname));
}

// Files agents read to discover the site: llms.txt indexes (/llms.txt,
// /docs/llms.txt, /blog/llms.txt, ...), /.well-known/* (MCP server cards, AI
// catalog, skills), and the AI Gateway model catalog (/models, /models.json).
const AGENT_DISCOVERY_PATH =
  /(?:^|\/)llms(?:-full)?\.txt$|(?:^|\/)\.well-known\/|^\/models(?:\.json)?$/;

function isAgentDiscoveryPath(pathname) {
  return AGENT_DISCOVERY_PATH.test(pathname);
}

// Serve markdown in place of a page's HTML to clients isAIAgentRequest picks,
// but never to a browser's background request: an agent-driven browser
// (Claude-Agent's UA contains "claude") prefetches pages with Accept: */*, and
// answering Next.js's prefetch with markdown would break its navigation.
function wantsNegotiatedMarkdown(req) {
  return isAIAgentRequest(req) && !isBrowserBackgroundRequest(req);
}

function blogPostSlug(pathname) {
  const slug = pathname.match(BLOG_POST_PATH)?.[1];
  return slug && slug !== 'category' ? slug : null;
}

function isContentRoute(pathname) {
  const path = pathname.slice(1).replace(/\/$/, '');
  const normalized = path.endsWith('.md') ? path.slice(0, -3) : path;
  const isGeneratedPage =
    Object.hasOwn(GENERATED_PAGE_MARKDOWN_PATHS, normalized) ||
    getFunctionTemplatesMarkdownPath(normalized) !== null;
  const isContentPage = Object.keys(CONTENT_ROUTES).some(
    (route) => normalized === route || path.startsWith(`${route}/`)
  );

  return isGeneratedPage || isContentPage;
}

function applyNegotiationVary(response) {
  const vary = new Set(
    (response.headers.get('Vary') || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );
  vary.add('Accept');
  vary.add('User-Agent');
  response.headers.set('Vary', [...vary].join(', '));
  return response;
}

function applyDocHeaders(response) {
  applyNegotiationVary(response);
  response.headers.set('X-LLMs-Txt', '/docs/llms.txt');
  response.headers.append('Link', '</docs/llms.txt>; rel="llms-txt"');
  response.headers.append('Link', '</docs/llms-full.txt>; rel="llms-full-txt"');
  return response;
}

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
  response.headers.set('Cache-Control', MARKDOWN_CACHE_CONTROL);
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
  response.headers.set('Cache-Control', MARKDOWN_CACHE_CONTROL);
  return response;
}

// Real static .md files (skills SKILL.md, prompts, /pricing.md, …) live in
// public/ and have no generated /md sibling, so getMarkdownPath returns null for
// them. STATIC_MD is the build-time manifest of those files.
const STATIC_MD = new Set(STATIC_MD_PATHS);

const SITEMAP_MD_PATHS = new Set([SITEMAP_MD.path, ...SITEMAP_MD.aliases]);

// For a `.md` URL with no generated /md sibling: serve the real static file if it
// exists (manifest hit → next), else a markdown 404. This makes every missing
// `.md` — skills, .well-known, or an arbitrary path like /foo/bar.md — return
// markdown instead of the HTML 404, using a Set lookup with no per-request fetch.
// Runs at the proxy layer (before rewrites/routes), so nothing downstream can
// pre-empt it. Returns a response, or null when this isn't an unmirrored `.md`
// (generated-docs `.md` keep their existing fetch-based handling).
// next() that serves a static `.md` as-is, carrying the doc headers + noindex the
// isContentRoute branch would otherwise apply (this short-circuit runs before it)
// plus the LLM read beacon. Without this, static skill files would lose the
// X-Robots-Tag: noindex they get on the isContentRoute path and become indexable.
function servedStaticMarkdown(analytics) {
  analytics.track({ branch: 'static-markdown' });
  const response = applyDocHeaders(NextResponse.next());
  response.headers.set('X-Robots-Tag', 'noindex');
  return response;
}

// Maps a skill-discovery alias to the real SKILL.md path a next.config rewrite
// sends it to, or null if pathname isn't such an alias. These have no physical
// file at the request path. Keep in sync with the skill-discovery rewrites in
// next.config.js.
function skillAliasTarget(pathname) {
  if (pathname === '/skill.md') return '/docs/ai/skills/neon-postgres/SKILL.md';
  const match = pathname.match(
    /^\/(?:docs\/)?\.well-known\/(?:agent-skills|skills)\/([^/]+)\/SKILL\.md$/
  );
  return match ? `/docs/ai/skills/${match[1]}/SKILL.md` : null;
}

function staticMarkdownResponse(pathname, analytics) {
  if (!pathname.endsWith('.md') || pathname.startsWith('/md/')) return null;

  // /docs/sitemap.md is a route handler, not a file in public/, and its aliases
  // are rewritten to it. Serve them before the generated /md lookup below, which
  // would otherwise send /docs/sitemap.md to a missing /md/docs/sitemap.md.
  if (SITEMAP_MD_PATHS.has(pathname)) return servedStaticMarkdown(analytics);

  // Skill-discovery alias: no physical file here — a next.config rewrite maps it
  // to a real SKILL.md. Serve (via the rewrite) if that skill exists, else a
  // markdown 404. Returning next() rather than null keeps a single beacon —
  // falling through would fire again in the agent branch for agent UAs.
  const aliasTarget = skillAliasTarget(pathname);
  if (aliasTarget !== null) {
    if (STATIC_MD.has(aliasTarget)) return servedStaticMarkdown(analytics);
    analytics.track({ is404: true, branch: 'missing-skill-alias' });
    return markdownNotFoundResponse(pathname, { source: 'agent-404' });
  }

  // Real static file (SKILL.md, references, prompts, /pricing.md): serve it as-is.
  // Checked before getMarkdownPath because some static files also have a
  // CUSTOM_MARKDOWN_PATHS mapping (e.g. /pricing.md) — the file is right here.
  if (STATIC_MD.has(pathname)) return servedStaticMarkdown(analytics);

  // Has a generated /md sibling → let the existing fetch-based branch serve it
  // (or return its own markdown 404); both outcomes are tracked there.
  if (getMarkdownPath(pathname) !== null) return null;

  // No static file and no /md sibling → genuine miss.
  analytics.track({ is404: true, branch: 'missing-static-markdown' });
  return markdownNotFoundResponse(pathname, { source: 'agent-404' });
}

// The blog route handler (/blog/[slug]/md) reads the post from the in-repo
// snapshot; its bundle includes the blog content. The proxy fetches it rather
// than rewriting to it so the read is counted here, before any cache, with the
// real outcome, the same way docs .md are served. The route's own response may
// be CDN-cached; this response isn't.
const BLOG_MARKDOWN_FETCH_USER_AGENT = 'neon-blog-markdown-proxy';
const BLOG_MARKDOWN_HEADERS = [
  'Content-Type',
  'X-Content-Source',
  'X-Robots-Tag',
  'X-LLMs-Txt',
  'Link',
];

async function blogMarkdownResponse(req, slug, analytics, { branch }) {
  try {
    const upstream = await fetch(`${req.nextUrl.origin}/blog/${slug}/md`, {
      headers: { ...NON_AGENT_FETCH_HEADERS, 'User-Agent': BLOG_MARKDOWN_FETCH_USER_AGENT },
    });

    // Count found and not-found posts. A 5xx is a failed read: serve it, don't
    // count it. Recorded under the public .md URL, also for negotiated reads.
    if (upstream.ok || upstream.status === 404) {
      analytics.track({
        is404: upstream.status === 404,
        branch,
        pageUrl: new URL(`/blog/${slug}.md`, req.url).href,
      });
    }

    const headers = new Headers();
    for (const name of BLOG_MARKDOWN_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    if (upstream.ok || upstream.status === 404) {
      headers.set('Cache-Control', MARKDOWN_CACHE_CONTROL);
    }
    const response = new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers,
    });
    return applyNegotiationVary(response);
  } catch (error) {
    console.error('[blog .md] Error serving blog markdown', { slug, error: error.message });
    // Still serve the post through the route handler; this read goes uncounted.
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = `/blog/${slug}/md`;
    return applyNegotiationVary(NextResponse.rewrite(rewriteUrl));
  }
}

export async function proxy(req, event) {
  const analytics = createLLMAnalytics(req);
  const response = await handleProxy(req, analytics);

  // Count reads the branches above didn't, when the request passes through to
  // the page or file (GET only: HEAD from monitors and CORS preflights aren't
  // reads). Prefetches and router fetches are skipped inside track().
  // - Pages: every reader that isn't a person in a browser tab. People run the
  //   browser analytics script; nothing else does, so AI agents, search
  //   crawlers and unknown clients (python-requests, wget, ...) are counted here.
  //   A browser's background requests (Next.js prefetches and router fetches)
  //   aren't reads; track() skips them by their Sec-Fetch-Mode.
  // - Agent discovery files (llms.txt, /.well-known/*, /models): every reader,
  //   people included, since these files run no browser script.
  // classifyReader labels each pageview (llm_reader).
  if (
    !analytics.beacon &&
    response.headers.get('x-middleware-next') === '1' &&
    (req.method || 'GET') === 'GET'
  ) {
    const { pathname } = req.nextUrl;
    if (isAgentDiscoveryPath(pathname)) {
      analytics.track({ branch: 'discovery-file' });
    } else if (!isAssetRequest(pathname) && !isHumanBrowserNavigation(req)) {
      analytics.track({ branch: 'non-browser-html' });
    }
  }

  if (analytics.beacon) {
    if (event?.waitUntil) {
      event.waitUntil(analytics.beacon);
    } else {
      // Direct callers without NextFetchEvent still complete the beacon safely.
      await analytics.beacon;
    }
  }
  analytics.logResponse(response);
  return response;
}

async function handleProxy(req, analytics) {
  try {
    const { pathname } = req.nextUrl;

    // /blog/[slug].md — the post's raw markdown, from the in-repo blog snapshot
    // (the same source the HTML post page renders from).
    if (pathname.startsWith('/blog/') && pathname.endsWith('.md')) {
      const slug = pathname.slice('/blog/'.length, -'.md'.length);
      // Only real (single-segment) post slugs map to the handler. A nested path
      // like /blog/a/b.md isn't a post; let it fall through to the generic .md
      // handler below so it still returns a markdown 404, not an HTML one.
      if (slug && !slug.includes('/')) {
        return blogMarkdownResponse(req, slug, analytics, { branch: 'blog-markdown' });
      }
    }

    // /blog/[slug] for an AI agent (Accept: text/markdown, a non-HTML Accept,
    // or an agent UA that doesn't accept HTML): serve the post's markdown, the
    // same way docs pages are negotiated. Browsers get the HTML page below.
    const negotiatedBlogSlug = blogPostSlug(pathname);
    if (negotiatedBlogSlug && wantsNegotiatedMarkdown(req)) {
      return blogMarkdownResponse(req, negotiatedBlogSlug, analytics, { branch: 'agent-markdown' });
    }

    // Retired neon-postgres skill reference URLs (PR #4666) → 308 to their
    // consolidated docs pages. Runs before agent detection so browsers and tools
    // both follow the redirect.
    const skillRedirect = skillReferenceRedirectResponse(req, pathname);
    if (skillRedirect) return skillRedirect;

    // Missing `.md` with no generated /md sibling → markdown 404 (real static
    // files pass through). Covers skills, .well-known, and arbitrary paths.
    const staticMd = staticMarkdownResponse(pathname, analytics);
    if (staticMd) return staticMd;

    const isAgent = wantsNegotiatedMarkdown(req);
    const normalizedFilename = getNormalizedFilename(pathname);
    const isImage = IMAGE_EXTENSION.test(normalizedFilename) || pathname === '/docs/og';
    const isJsonFile =
      /\.json$/i.test(normalizedFilename) &&
      (pathname.startsWith('/docs/') || pathname.startsWith('/guides/'));
    const isGuideAuthorPage =
      GUIDE_AUTHOR_PATH.test(pathname) && !normalizedFilename.endsWith('.md');
    if (isAgent && !isImage && !isJsonFile && !isGuideAuthorPage) {
      let agentHit404 = false;
      const markdownPath = getMarkdownPath(pathname);

      if (markdownPath) {
        try {
          const markdownUrl = `${req.nextUrl.origin}${markdownPath}`;
          const response = await fetch(markdownUrl, { headers: NON_AGENT_FETCH_HEADERS });

          if (response.ok) {
            analytics.track({ branch: 'agent-markdown' });
            const markdown = await response.text();
            return applyDocHeaders(markdownResponse(markdown));
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

      analytics.track({ is404: agentHit404, branch: 'agent-fallback' });

      if (agentHit404) {
        return markdownMovedOr404Response(req, pathname, 'agent-404');
      }
    }

    // Bare /docs is the docs front page (src/app/(docs)/docs/page.jsx). Agents /
    // Accept: markdown are handled above (served /docs/llms.txt); browsers fall
    // through to the page. Because /docs is content-negotiated, the doc headers
    // applied below set Vary on both negotiation inputs to keep shared caches correct.

    // Apply doc headers to all content route responses (.md URLs and HTML pages).
    // Negotiated Markdown responses vary on Accept and User-Agent (applyDocHeaders above).
    if (isContentRoute(pathname)) {
      if (pathname.endsWith('.md')) {
        const markdownPath = getMarkdownPath(pathname);

        if (markdownPath) {
          try {
            const markdownUrl = `${req.nextUrl.origin}${markdownPath}`;
            const response = await fetch(markdownUrl, { headers: NON_AGENT_FETCH_HEADERS });

            // Track .md as agent traffic, but only on outcomes handled here
            // (200/404). A 5xx falls through untracked. Skip agents entirely:
            // the agent branch above already tracked them, and an agent whose
            // first fetch threw falls through to here — tracking again would
            // double-count (a browser only ever reaches this branch).
            const isMarkdown404 = response.status === 404;
            if (!isAgent && (response.ok || isMarkdown404)) {
              analytics.track({ is404: isMarkdown404, branch: 'direct-markdown' });
            }

            if (response.ok) {
              const markdown = await response.text();
              return applyDocHeaders(markdownResponse(markdown));
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
      return applyNegotiationVary(response);
    }

    // Check if the user is logged in. Only / and /home use it, and the proxy
    // runs on every page, so skip the cookie read everywhere else.
    if (pathname !== '/' && pathname !== '/home') {
      const response = NextResponse.next();
      return getMarkdownPath(pathname) ? applyNegotiationVary(response) : response;
    }

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

    const response = NextResponse.next();
    return getMarkdownPath(pathname) ? applyNegotiationVary(response) : response;
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
    '/functions', // Agent-friendly Functions page
    '/functions/templates', // Agent-friendly Function Registry catalog
    '/functions/templates/:id', // Agent-friendly Function Registry template pages
    '/ai-gateway', // Agent-friendly AI Gateway page
    '/object-storage', // Agent-friendly Object Storage page
    '/auth', // Agent-friendly Auth product page
    '/lakebase', // Agent-friendly Lakebase page
    '/case-studies', // Agent-friendly case studies index
    '/docs', // Bare docs root: serve llms.txt for agents; browsers fall through to the docs front page
    '/blog', // Bare blog root: serve blog/llms.txt for agents; browsers fall through normally
    '/blog/:slug.md', // Individual blog post markdown
    '/(docs|postgresql|guides|branching|programs|use-cases|faqs)/:path*', // All markdown routes
    '/:path(docs|postgresql|guides|branching|programs|use-cases).md', // Top-level .md index URLs
    '/(.*\\.md)', // Any .md anywhere: staticMarkdownResponse serves the file or a markdown 404
    // Agent discovery files, counted for agents and people alike.
    '/llms.txt',
    '/llms-full.txt',
    '/blog/llms.txt',
    '/.well-known/:path*',
    '/models',
    '/models.json',
    // Pages below are matched so AI agents that fetch them (often as HTML) are
    // counted. Keep this list in sync with the page routes: middleware.test.js
    // fails if a page under src/app or content/pages is missing.
    '/blog/:slug([^/.]+)', // Blog posts (no dot, so /blog/rss.xml and /blog/llms.txt stay out)
    '/blog/category/:slug', // Blog category listings
    '/about-us',
    '/brand',
    '/claimable-neon',
    '/contact-sales',
    '/mcp-server/stats',
    '/mts',
    '/pg-eu-conf-raffle',
    '/ping-thing',
    '/restores-survey',
    '/security',
    '/startups',
    '/tools',
    // Pages rendered by src/app/[slug] from content/pages/*.md
    '/autoscaling-report',
    '/faster',
    '/hipaa-contractors',
    '/platform-terms',
    '/platforms',
    '/storage',
    '/subscribe-to-subprocessors',
  ],
};
