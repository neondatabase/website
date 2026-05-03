'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

// Pin to major version so patch/minor updates are picked up but breaking changes are not.
// Update this when intentionally upgrading Scalar.
const CDN_URL = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1';

// Module-level promise: CDN loads once per page session regardless of React re-renders or
// theme changes. Persists across HMR reloads in dev (acceptable).
let scalarCdnReady: Promise<void> | null = null;

function loadScalarCdn(): Promise<void> {
  if (scalarCdnReady) return scalarCdnReady;

  scalarCdnReady = new Promise((resolve, reject) => {
    // Already loaded (e.g. back-navigation in SPA)
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

function buildConfig(spec: string, darkMode: boolean) {
  return {
    content: spec,
    theme: 'default',
    darkMode,
    agent: { disabled: true },
    mcp: { disabled: true },
    showDeveloperTools: 'never',
    hideModels: true,
    hideClientButton: true,
    defaultOpenAllTags: true,
    defaultHttpClient: { targetKey: 'js', clientKey: 'fetch' },
  };
}

const NEON_CSS = `
  /* --scalar-custom-header-height is Scalar's public variable for external header height.
     It feeds --refs-header-height which controls sidebar sticky top, sidebar height,
     and IntersectionObserver rootMargin. Must be set on :root. */
  :root {
    --scalar-custom-header-height: 112px;
  }
  /* Ensure anchor jumps and sidebar scrollIntoView land below the Neon header */
  html {
    scroll-padding-top: 112px;
  }
  #scalar-mount .dark-mode {
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
  }
  #scalar-mount .light-mode {
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
  }
`;

export default function ScalarMount({ spec }: { spec: string }) {
  const { resolvedTheme } = useTheme();
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Treat undefined (SSR/pre-hydration) as dark to match neon's default
    const darkMode = resolvedTheme !== 'light';

    loadScalarCdn()
      .then(() => {
        if (!mount) return;
        // Clear previous Scalar instance before re-initializing
        while (mount.firstChild) mount.removeChild(mount.firstChild);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).Scalar.createApiReference('#scalar-mount', buildConfig(spec, darkMode));
      })
      .catch((err) => {
        console.error('Scalar failed to initialize:', err);
      });
  }, [spec, resolvedTheme]);

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: NEON_CSS }} />
      <div
        ref={mountRef}
        id="scalar-mount"
        className="w-full"
        aria-label="API Reference"
      >
        <p className="p-8 text-gray-new-50">Loading API reference…</p>
      </div>
    </>
  );
}
