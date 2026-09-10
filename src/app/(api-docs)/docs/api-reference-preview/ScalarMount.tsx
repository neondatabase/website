'use client';

import { useEffect, useRef } from 'react';

// Pin to major so patch/minor updates flow but breaking changes don't.
// Update when intentionally upgrading Scalar.
const CDN_URL = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1';

// Module-level: CDN loads once per page session regardless of remounts.
let scalarCdnReady: Promise<void> | null = null;

function loadScalarCdn(): Promise<void> {
  if (scalarCdnReady) return scalarCdnReady;

  scalarCdnReady = new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any).Scalar?.createApiReference === 'function') {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = CDN_URL;
    script.onload = () => resolve();
    script.onerror = () => {
      scalarCdnReady = null; // allow retry on next mount
      reject(new Error('Failed to load Scalar CDN'));
    };
    document.head.appendChild(script);
  });

  return scalarCdnReady;
}

// Factory for a Scalar fetch interceptor. When Scalar asks for `specUrl`, return our
// pre-mutated spec. Any other URL (e.g. external $refs) falls through to real fetch.
// New Response per call — Response bodies are one-shot and Scalar may re-read.
function createSpecFetch(specUrl: string, specBody: string) {
  return async (url: string): Promise<Response> => {
    if (url === specUrl) {
      return new Response(specBody, {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return fetch(url);
  };
}

function buildConfig(spec: string, specUrl: string, darkMode: boolean) {
  return {
    // Pass `url` (not `content`) so Scalar's workspace store populates
    // document.x-scalar-original-source-url with specUrl — which is what the
    // "Download OpenAPI Document" link reads in `direct` mode. The interceptor
    // below makes Scalar fetch our mutated spec from that URL instead of the wire.
    url: specUrl,
    fetch: createSpecFetch(specUrl, spec),
    theme: 'default',
    darkMode,
    // Makes Scalar's initial body.dark-mode/.light-mode class match Neon's theme on
    // first mount. Scalar's useColorMode reads this once at init and is not reactive
    // to later updateConfiguration calls — subsequent theme changes are handled by
    // the MutationObserver + CSS keyed on html.dark.
    forceDarkModeState: darkMode ? 'dark' : 'light',
    // Neon's header is the single source of truth for theme.
    hideDarkModeToggle: true,
    agent: { disabled: true },
    mcp: { disabled: true },
    showDeveloperTools: 'never',
    hideModels: true,
    hideClientButton: true,
    hideTestRequestButton: true,
    defaultOpenAllTags: true,
    defaultHttpClient: { targetKey: 'shell', clientKey: 'curl' },
    // 'direct' points the download button at specUrl itself (real, unmutated spec on
    // neon.com). Other values ('json'|'yaml'|'both') would serialize our in-memory
    // mutated spec and leak injected guide markdown into the downloaded file.
    documentDownloadType: 'direct',
  };
}

const NEON_CSS = `
  /* Scalar's public var for external header offset. Feeds --refs-header-height which
     controls sidebar sticky top, sidebar height, and IntersectionObserver rootMargin. */
  :root {
    --scalar-custom-header-height: 112px;
  }
  html {
    scroll-padding-top: 112px;
  }
  /* Hide the right-column quickstart panel on the info block (server URL + Client
     Libraries snippet). It duplicates info we show elsewhere and has no selector
     meaning for us (single server, client tabs redirect back to operation snippets).
     These classes are scoped to the info block — per-operation snippets are unaffected. */
  #scalar-mount .scalar-reference-intro-server,
  #scalar-mount .scalar-reference-intro-clients,
  #scalar-mount .scalar-reference-intro-auth {
    display: none;
  }
  /* Theme is keyed on html.dark (next-themes) NOT Scalar's own .dark-mode/.light-mode.
     Scalar puts those on document.body (via useColorMode) and does not flip them when
     forceDarkModeState changes — so they're locked after init. html.dark is the only
     signal that reliably tracks Neon's toggle.

     Sidebar vars are declared with literal values because Scalar's default preset sets
     e.g. --scalar-sidebar-background-1 to var(--scalar-background-1) at body.light-mode.
     That var() resolves at body to Scalar's default color, the resolved value inherits
     into the sidebar, and our #scalar-mount override never reaches it. */
  html.dark #scalar-mount,
  html.dark #scalar-mount .dark-mode,
  html.dark #scalar-mount .light-mode {
    --scalar-background-1: #0d0e12;
    --scalar-background-2: #131415;
    --scalar-background-3: #18191b;
    --scalar-background-accent: #00E59912;
    --scalar-color-1: #e4e5e7;
    --scalar-color-2: #afb1b6;
    --scalar-color-3: #797d86;
    --scalar-color-accent: #00E599;
    --scalar-border-color: #242628;
    --scalar-font: 'IBM Plex Sans', sans-serif;
    --scalar-font-code: 'IBM Plex Mono', 'Fira Code', monospace;

    --scalar-sidebar-background-1: #0d0e12;
    --scalar-sidebar-color-1: #e4e5e7;
    --scalar-sidebar-color-2: #afb1b6;
    --scalar-sidebar-border-color: #242628;
    --scalar-sidebar-item-hover-background: #131415;
    --scalar-sidebar-item-hover-color: #afb1b6;
    --scalar-sidebar-item-active-background: #131415;
    --scalar-sidebar-color-active: #e4e5e7;
    --scalar-sidebar-indent-border: #242628;
    --scalar-sidebar-indent-border-hover: #242628;
    --scalar-sidebar-indent-border-active: #242628;
    --scalar-sidebar-search-background: #131415;
    --scalar-sidebar-search-color: #797d86;
    --scalar-sidebar-search-border-color: #242628;
  }
  html:not(.dark) #scalar-mount,
  html:not(.dark) #scalar-mount .dark-mode,
  html:not(.dark) #scalar-mount .light-mode {
    --scalar-background-1: #ffffff;
    --scalar-background-2: #f2f2f3;
    --scalar-background-3: #efeff0;
    --scalar-background-accent: #00E59912;
    --scalar-color-1: #0c0d0d;
    --scalar-color-2: #494b50;
    --scalar-color-3: #797d86;
    --scalar-color-accent: #00E599;
    --scalar-border-color: #e4e5e7;
    --scalar-font: 'IBM Plex Sans', sans-serif;
    --scalar-font-code: 'IBM Plex Mono', 'Fira Code', monospace;

    --scalar-sidebar-background-1: #ffffff;
    --scalar-sidebar-color-1: #0c0d0d;
    --scalar-sidebar-color-2: #494b50;
    --scalar-sidebar-border-color: #e4e5e7;
    --scalar-sidebar-item-hover-background: #f2f2f3;
    --scalar-sidebar-item-hover-color: #494b50;
    --scalar-sidebar-item-active-background: #f2f2f3;
    --scalar-sidebar-color-active: #0c0d0d;
    --scalar-sidebar-indent-border: #e4e5e7;
    --scalar-sidebar-indent-border-hover: #e4e5e7;
    --scalar-sidebar-indent-border-active: #e4e5e7;
    --scalar-sidebar-search-background: #f2f2f3;
    --scalar-sidebar-search-color: #797d86;
    --scalar-sidebar-search-border-color: #e4e5e7;
  }
`;

export default function ScalarMount({ spec, specUrl }: { spec: string; specUrl: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scalarInstanceRef = useRef<any>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;

    loadScalarCdn()
      .then(() => {
        if (cancelled || !mount) return;

        const darkMode = document.documentElement.classList.contains('dark');

        // Clear placeholder so Scalar uses createApp, not createSSRApp. Scalar checks
        // mountElement.children.length > 0 to decide — leaving our <p>Loading…</p>
        // triggers Vue hydration and a mismatch warning.
        while (mount.firstChild) mount.removeChild(mount.firstChild);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        scalarInstanceRef.current = (window as any).Scalar.createApiReference(
          mount,
          buildConfig(spec, specUrl, darkMode),
        );

        // Watch html.class directly — this is what next-themes mutates, and firing on
        // it avoids the one-cycle lag of useTheme()/resolvedTheme.
        observerRef.current = new MutationObserver(() => {
          if (!scalarInstanceRef.current) return;
          const isDark = document.documentElement.classList.contains('dark');
          scalarInstanceRef.current.updateConfiguration(buildConfig(spec, specUrl, isDark));
        });
        observerRef.current.observe(document.documentElement, { attributeFilter: ['class'] });
      })
      .catch((err) => {
        if (!cancelled) console.error('[ScalarMount] init failed:', err);
      });

    return () => {
      cancelled = true;
      observerRef.current?.disconnect();
      observerRef.current = null;
      scalarInstanceRef.current?.destroy?.();
      scalarInstanceRef.current = null;
    };
  }, [spec, specUrl]);

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: NEON_CSS }} />
      <div ref={mountRef} id="scalar-mount" className="w-full" aria-label="API Reference">
        <p className="p-8 text-gray-new-50">Loading API reference…</p>
      </div>
    </>
  );
}
