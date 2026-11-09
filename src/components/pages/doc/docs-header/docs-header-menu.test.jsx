import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import DocsHeaderMenu from './docs-header-menu';

vi.mock('next/navigation', () => ({ usePathname: () => '/docs/auth/overview' }));
vi.mock('components/shared/link', () => ({
  default: ({ to, children, tagName: _tagName, isExternal: _isExternal, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));
vi.mock('icons/chevron-down.inline.svg', () => ({ default: () => <svg /> }));
vi.mock('./images/chevron-down.inline.svg', () => ({ default: () => <svg /> }));

const LANES = [
  { nav: 'Get started', slug: '/docs' },
  {
    nav: 'Products',
    subnav: [{ section: 'Backend', items: [{ title: 'Auth', slug: 'auth/overview' }] }],
  },
];

// The overflow control is the inline "More" nav lane: a single toggle labeled
// "More" when closed and "Close menu" when open. Whether it renders at all is the
// parent header's job (it only mounts this once a lane has overflowed), which
// depends on live layout measurement and so is covered by the Playwright tablet
// spec, not here. These tests cover what the menu itself owns: its trigger, the
// overflowed lanes it holds, expand-in-place dropdown lanes, and Escape
// focus-return. The menu holds only overflowed lanes; external links and the
// theme switch no longer live here.
const openMenu = () => {
  fireEvent.click(screen.getByRole('button', { name: 'More' }));
  return screen.getByRole('button', { name: 'Close menu' });
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('DocsHeaderMenu', () => {
  it('closes on Escape and returns focus to the toggle', () => {
    render(<DocsHeaderMenu basePath="/docs/" overflowLanes={LANES} />);
    const toggle = openMenu();
    const laneLink = screen.getByRole('link', { name: 'Get started' });
    laneLink.focus();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Get started' })).toBeNull();
    expect(toggle).toHaveFocus();
  });

  it('holds only the overflowed lanes, in order, and nothing else', () => {
    const { rerender } = render(<DocsHeaderMenu basePath="/docs/" />);
    openMenu();
    // Nothing overflows: the panel is open but holds no lanes, and it never
    // carries the external links or theme switch that used to live here.
    expect(screen.queryByRole('link', { name: 'Get started' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Products' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'neon.com' })).toBeNull();
    expect(screen.queryByRole('radiogroup', { name: 'Theme' })).toBeNull();

    // A partial overflow mirrors just the lanes that no longer fit inline, so a
    // lane kept inline is never duplicated in the menu.
    rerender(<DocsHeaderMenu basePath="/docs/" overflowLanes={[LANES[1]]} />);
    expect(screen.queryByRole('link', { name: 'Get started' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Products' })).toBeInTheDocument();

    // Full overflow: both lanes present, in nav order, and still nothing else.
    rerender(<DocsHeaderMenu basePath="/docs/" overflowLanes={LANES} />);
    const lane = screen.getByRole('link', { name: 'Get started' });
    const group = screen.getByRole('button', { name: 'Products' });
    expect(lane.compareDocumentPosition(group) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'neon.com' })).toBeNull();
    expect(screen.queryByRole('radiogroup', { name: 'Theme' })).toBeNull();
  });

  it('expands an overflowed dropdown lane in place with real links', () => {
    render(<DocsHeaderMenu basePath="/docs/" overflowLanes={LANES} />);
    openMenu();

    // The dropdown lane is an expand-in-place accordion button, not a hover
    // flyout: its links are hidden until it is opened.
    const group = screen.getByRole('button', { name: 'Products' });
    expect(group).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Auth' })).toBeNull();

    fireEvent.click(group);
    expect(group).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Auth' })).toHaveAttribute(
      'href',
      '/docs/auth/overview'
    );
  });
});
