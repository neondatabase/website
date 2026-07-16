import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CodeTabs from 'components/pages/doc/code-tabs';
import { CodeTabsProvider } from 'contexts/code-tabs-context';

import InterfaceQueryParamSync from '../interface-query-param-sync';

const mockSearchParams = vi.hoisted(() => ({
  current: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams.current,
}));

const renderInterfaceTabs = (query) => {
  mockSearchParams.current = new URLSearchParams(query);

  return render(
    <CodeTabsProvider>
      <InterfaceQueryParamSync />
      <CodeTabs labels={['CLI', 'SDK', 'MCP', 'Console']}>
        <div>CLI body</div>
        <div>SDK body</div>
        <div>MCP body</div>
        <div>Console body</div>
      </CodeTabs>
    </CodeTabsProvider>
  );
};

describe('InterfaceQueryParamSync', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockSearchParams.current = new URLSearchParams();
  });

  it('selects the matching API interface code tab from the URL', () => {
    renderInterfaceTabs('iface=sdk');

    expect(screen.getByText('SDK body')).toBeInTheDocument();
    expect(screen.queryByText('CLI body')).not.toBeInTheDocument();
  });

  it('resets non-REST code tabs when the URL requests the REST API interface', () => {
    window.localStorage.setItem('defaultCodeTab', JSON.stringify('MCP'));

    renderInterfaceTabs('iface=api');

    expect(screen.getByText('CLI body')).toBeInTheDocument();
    expect(screen.queryByText('MCP body')).not.toBeInTheDocument();
  });
});
