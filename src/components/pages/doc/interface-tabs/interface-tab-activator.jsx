'use client';

import { useSearchParams } from 'next/navigation';
import { useContext, useEffect } from 'react';

import { InterfaceTabsContext } from 'contexts/interface-tabs-context';

const VALID = new Set(['api', 'cli', 'sdk', 'mcp', 'console']);

// Reads ?iface=<id> from the URL and activates the matching tab.
// Drop this on any page where URL-driven tab activation is needed.
const InterfaceTabActivator = () => {
  const { setActiveIface } = useContext(InterfaceTabsContext);
  const searchParams = useSearchParams();

  useEffect(() => {
    const iface = searchParams.get('iface');
    if (iface && VALID.has(iface)) setActiveIface(iface);
  }, [searchParams, setActiveIface]);

  return null;
};

export default InterfaceTabActivator;
