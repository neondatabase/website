import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ICONS_CONFIG from 'config/docs-icons-config';

import DetailIconCards from './detail-icon-cards';

vi.mock('components/shared/link/link', () => ({
  default: ({ to, children, tagName: _tagName, tagText: _tagText, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// `neon` is one of the seven names that appear in both the local monochrome map
// and `docs-icons-config`, so it is the case where lookup order is observable.
vi.mock('./images/neon.inline.svg', () => ({
  default: (props) => <svg data-testid="inline-icon" {...props} />,
}));

const LOGO_ICON = 'next-js';
const UNKNOWN_ICON = 'no-such-icon-name';
// Held in variables so `@next/next/no-html-link-for-pages` does not read these
// fixtures as real page links.
const OVERVIEW_HREF = '/docs/realtime/overview';
const NEXTJS_HREF = '/docs/realtime/nextjs';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('DetailIconCards icon resolution', () => {
  it('renders the inline SVG for a name in the local monochrome map', () => {
    const { container } = render(
      <DetailIconCards cols={2} theme="grey">
        <a href={OVERVIEW_HREF} icon="neon">
          Neon
        </a>
      </DetailIconCards>
    );

    const inlineIcon = container.querySelector('[data-testid="inline-icon"]');
    expect(inlineIcon).not.toBeNull();
    expect(container.querySelectorAll('img')).toHaveLength(0);
    // The monochrome keys inherit their colour from the theme, so the theme's
    // icon class has to keep reaching the inline SVG.
    expect(inlineIcon.getAttribute('class')).toMatch(/\btext-/);
  });

  it('renders the light and dark logo pair for a name only in docs-icons-config', () => {
    const { lightIconPath, darkIconPath } = ICONS_CONFIG[LOGO_ICON];
    expect(darkIconPath).toBeTruthy();

    const { container } = render(
      <DetailIconCards cols={2} theme="grey">
        <a href={NEXTJS_HREF} icon={LOGO_ICON}>
          Next.js
        </a>
      </DetailIconCards>
    );

    const logos = container.querySelectorAll('img');
    expect(logos).toHaveLength(2);
    expect(logos[0]).toHaveAttribute('src', lightIconPath);
    expect(logos[1]).toHaveAttribute('src', darkIconPath);
    expect(logos[0].getAttribute('class')).toMatch(/dark:hidden/);
    expect(logos[1].getAttribute('class')).toMatch(/dark:block/);
    // A logo carries its own colours, so no theme text class may recolour it.
    logos.forEach((logo) => expect(logo.getAttribute('class')).not.toMatch(/\btext-/));
  });

  it('warns and drops the card for a name in neither source instead of throwing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(ICONS_CONFIG[UNKNOWN_ICON]).toBeUndefined();

    const { container } = render(
      <DetailIconCards cols={2} theme="grey">
        <a href={OVERVIEW_HREF} icon={UNKNOWN_ICON}>
          Unknown
        </a>
      </DetailIconCards>
    );

    expect(warn).toHaveBeenCalled();
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });
});
