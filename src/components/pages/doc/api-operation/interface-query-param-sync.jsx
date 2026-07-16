'use client';

import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useLayoutEffect } from 'react';

import { CodeTabsContext } from 'contexts/code-tabs-context';

const IFACE_TO_CODE_TAB_LABEL = {
  api: '',
  cli: 'CLI',
  sdk: 'SDK',
  mcp: 'MCP',
  console: 'Console',
};

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const InterfaceQueryParamSync = () => {
  const { setActiveTab } = useContext(CodeTabsContext);
  const searchParams = useSearchParams();
  const iface = searchParams?.get('iface')?.toLowerCase();
  const codeTabLabel = IFACE_TO_CODE_TAB_LABEL[iface] ?? null;

  useIsomorphicLayoutEffect(() => {
    if (codeTabLabel === null) return;
    setActiveTab(codeTabLabel);
  }, [codeTabLabel, setActiveTab]);

  return null;
};

export { IFACE_TO_CODE_TAB_LABEL };
export default InterfaceQueryParamSync;
