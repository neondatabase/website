import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';

import JsonLd from './json-ld';

describe('JsonLd', () => {
  it('keeps embedded HTML inside the JSON payload without closing the script', () => {
    const name = '</script><script>alert("example")</script>';
    const html = renderToStaticMarkup(<JsonLd data={{ name }} />);
    const payload = html.match(/<script[^>]*>([\s\S]*)<\/script>/)[1];

    expect(html.match(/<script/g)).toHaveLength(1);
    expect(payload).not.toContain('<');
    expect(JSON.parse(payload).name).toBe(name);
  });

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
