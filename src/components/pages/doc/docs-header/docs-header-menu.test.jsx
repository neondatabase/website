import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import DocsHeaderMenu from './docs-header-menu';

const { setThemeSpy } = vi.hoisted(() => ({ setThemeSpy: vi.fn() }));

vi.mock('next/navigation', () => ({ usePathname: () => '/docs/auth/overview' }));
// A stateful stand-in for next-themes, so tabIndex follows the selected theme.
vi.mock('next-themes', async () => {
  const { useState } = await import('react');
  return {
    useTheme: () => {
      const [theme, setTheme] = useState('light');
      return {
        theme,
        setTheme: (value) => {
          setThemeSpy(value);
          setTheme(value);
        },
      };
    },
  };
});
vi.mock('components/shared/link', () => ({
  default: ({ to, children, tagName: _tagName, isExternal: _isExternal, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));
vi.mock('../menu/icon', () => ({ default: () => <svg /> }));
vi.mock('icons/chevron-down.inline.svg', () => ({ default: () => <svg /> }));
vi.mock('icons/discord.inline.svg', () => ({ default: () => <svg /> }));
vi.mock('./images/menu.inline.svg', () => ({ default: () => <svg /> }));

const LANES = [
  { nav: 'Get started', slug: '/docs' },
  {
    nav: 'Products',
    subnav: [{ section: 'Backend', items: [{ title: 'Auth', slug: 'auth/overview' }] }],
  },
];

const openMenu = () => {
  fireEvent.click(screen.getByRole('button', { name: 'More' }));
  return screen.getByRole('button', { name: 'Close menu' });
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('DocsHeaderMenu', () => {
  it('closes on Escape and returns focus to the toggle', () => {
    render(<DocsHeaderMenu basePath="/docs/" />);
    const toggle = openMenu();
    const firstLink = screen.getByRole('link', { name: 'neon.com' });
    firstLink.focus();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'neon.com' })).toBeNull();
    expect(toggle).toHaveFocus();
  });

  it('makes only the selected theme a Tab stop and moves with the arrow keys', () => {
    render(<DocsHeaderMenu basePath="/docs/" />);
    openMenu();
    const group = screen.getByRole('radiogroup', { name: 'Theme' });
    const [system, light, dark] = within(group).getAllByRole('radio');

    expect(light).toHaveAttribute('aria-checked', 'true');
    expect(light).toHaveAttribute('tabindex', '0');
    expect(system).toHaveAttribute('tabindex', '-1');
    expect(dark).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(light, { key: 'ArrowDown' });
    expect(setThemeSpy).toHaveBeenLastCalledWith('dark');
    expect(dark).toHaveFocus();
    expect(dark).toHaveAttribute('tabindex', '0');

    // Wraps at both ends.
    fireEvent.keyDown(dark, { key: 'ArrowDown' });
    expect(setThemeSpy).toHaveBeenLastCalledWith('system');
    expect(system).toHaveFocus();
    fireEvent.keyDown(system, { key: 'ArrowUp' });
    expect(setThemeSpy).toHaveBeenLastCalledWith('dark');
    expect(dark).toHaveFocus();
  });

  it('lists the collapsed lanes before the site links only when the nav is collapsed', () => {
    const { rerender } = render(<DocsHeaderMenu basePath="/docs/" lanes={LANES} />);
    openMenu();
    expect(screen.queryByRole('link', { name: 'Get started' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Products' })).toBeNull();

    rerender(<DocsHeaderMenu basePath="/docs/" lanes={LANES} isNavCollapsed />);
    const lane = screen.getByRole('link', { name: 'Get started' });
    const group = screen.getByRole('button', { name: 'Products' });
    const neon = screen.getByRole('link', { name: 'neon.com' });
    expect(lane.compareDocumentPosition(neon) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    fireEvent.click(group);
    expect(screen.getByRole('link', { name: 'Auth' })).toHaveAttribute(
      'href',
      '/docs/auth/overview'
    );
  });
});
