// @vitest-environment node
import he from 'he';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import YoutubeIframe from './youtube-iframe';

describe('YoutubeIframe', () => {
  it('preserves existing parameters while applying playback settings and a start time', () => {
    const html = renderToStaticMarkup(
      <YoutubeIframe
        embedId="s4vIMI9rXeg?si=example&start=10"
        title="Database branching demo"
        start={60}
        autoplay
        muted
        controls={false}
      />
    );
    const url = new URL(he.decode(html.match(/src="([^"]+)"/)[1]));

    expect(html).toContain('title="Database branching demo"');
    expect(url.pathname).toBe('/embed/s4vIMI9rXeg');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      si: 'example',
      start: '60',
      autoplay: '1',
      playsinline: '1',
      mute: '1',
      controls: '0',
    });
    expect(html).toContain('loading="eager"');
    expect(html).not.toContain('application/ld+json');
  });
});
