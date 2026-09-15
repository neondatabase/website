import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';

import JsonLd from './json-ld';

describe('JsonLd', () => {
  it('renders a server-side <script type="application/ld+json"> with the data', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Neon' };
    const html = renderToStaticMarkup(<JsonLd data={data} id="org-schema" />);

    expect(html).toContain('<script');
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain('id="org-schema"');
    // The JSON payload is present in the static (no-JS) markup
    expect(html).toContain('"@type":"Organization"');
    expect(html).toContain('Neon');
  });

  it('falls back to id="json-ld" when no id prop is given', () => {
    const html = renderToStaticMarkup(<JsonLd data={{ a: 1 }} />);
    expect(html).toContain('id="json-ld"');
  });
});
