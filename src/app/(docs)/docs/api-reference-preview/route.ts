import { renderApiReference } from '@scalar/client-side-rendering';

const SPEC_URL = 'https://neon.com/api_spec/release/v2.json';

const CUSTOM_CSS = `
  .dark-mode {
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
    --scalar-radius: 6px;
    --scalar-radius-lg: 8px;
  }

  .light-mode {
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
    --scalar-radius: 6px;
    --scalar-radius-lg: 8px;
  }
`;

export async function GET() {
  let spec: Record<string, unknown>;

  try {
    const res = await fetch(SPEC_URL, { next: { revalidate: 300 } });
    spec = await res.json();
  } catch {
    return new Response('Failed to load API spec', { status: 502 });
  }

  // Strip fields from the spec info that shouldn't appear in the UI
  if (spec.info && typeof spec.info === 'object') {
    const info = spec.info as Record<string, unknown>;
    delete info.contact;
    if (typeof info.description === 'string') {
      info.description = info.description.replaceAll('https://neon.tech/docs/', 'https://neon.com/docs/');
    }
  }

  const html = renderApiReference(
    {
      config: {
        content: JSON.stringify(spec),
        pageTitle: 'Neon API Reference',
        theme: 'default',
        agent: { disabled: true },
        mcp: { disabled: true },
        showToolbar: 'never',
        hideModels: true,
        hideClientButton: true,
        defaultHttpClient: { targetKey: 'js', clientKey: 'fetch' },
      },
      pageTitle: 'Neon API Reference',
    },
    CUSTOM_CSS,
  );

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
