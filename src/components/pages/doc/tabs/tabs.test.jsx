import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TabsProvider } from 'contexts/tabs-context';

import Tabs from './tabs';

vi.mock('utils/send-gtag-event', () => ({ default: vi.fn() }));

const renderTabs = () =>
  render(
    <TabsProvider>
      <Tabs labels={['Console', 'CLI', 'API']}>
        <div>
          <h4 id="console-heading">Console heading</h4>
        </div>
        <div>
          <h4 id="cli-heading">CLI heading</h4>
        </div>
        <div>
          <h4 id="api-heading">API heading</h4>
        </div>
      </Tabs>
    </TabsProvider>
  );

const isPanelVisible = (headingText) =>
  !screen
    .getByText(headingText)
    .closest('figure > div:not(:first-child)')
    .classList.contains('hidden');

describe('Tabs', () => {
  let scrollIntoView;

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/');
    scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  afterEach(() => {
    delete Element.prototype.scrollIntoView;
  });

  it('renders every panel and shows only the first one by default', () => {
    renderTabs();

    expect(isPanelVisible('Console heading')).toBe(true);
    expect(isPanelVisible('CLI heading')).toBe(false);
    expect(isPanelVisible('API heading')).toBe(false);
  });

  it('opens the panel holding the URL hash target, over the saved tab', () => {
    localStorage.setItem('defaultTab', JSON.stringify('CLI'));
    window.history.replaceState(null, '', '/#api-heading');

    renderTabs();

    expect(isPanelVisible('API heading')).toBe(true);
    expect(isPanelVisible('CLI heading')).toBe(false);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    // Following a link doesn't change the reader's saved preference
    expect(JSON.parse(localStorage.getItem('defaultTab'))).toBe('CLI');
  });

  it('ignores hashes that point outside the tabs', () => {
    localStorage.setItem('defaultTab', JSON.stringify('CLI'));
    window.history.replaceState(null, '', '/#somewhere-else');

    renderTabs();

    expect(isPanelVisible('CLI heading')).toBe(true);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('switches panels on hashchange', () => {
    renderTabs();

    act(() => {
      window.history.replaceState(null, '', '/#cli-heading');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(isPanelVisible('CLI heading')).toBe(true);
    expect(isPanelVisible('Console heading')).toBe(false);
  });

  it('lets a tab click take over from the hash target', () => {
    window.history.replaceState(null, '', '/#api-heading');
    renderTabs();

    fireEvent.click(screen.getByRole('button', { name: 'CLI' }));

    expect(isPanelVisible('CLI heading')).toBe(true);
    expect(isPanelVisible('API heading')).toBe(false);
    expect(JSON.parse(localStorage.getItem('defaultTab'))).toBe('CLI');
  });
});
