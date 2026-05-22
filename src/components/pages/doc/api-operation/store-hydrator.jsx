'use client';

import { useEffect } from 'react';

import { useStore } from './store';

// Single-purpose component: triggers persist rehydration after first
// client render. Renders nothing. Rendered as a sibling of the
// OperationClient render tree so the rehydrate fires once per page
// mount and never during SSR.
//
// The module-level `hydrated` guard makes rehydrate idempotent across
// dev fast-refresh and React StrictMode's intentional double-mount in
// development.

let hydrated = false;

const StoreHydrator = () => {
  useEffect(() => {
    if (hydrated) return;
    hydrated = true;
    useStore.persist.rehydrate();
  }, []);
  return null;
};

export default StoreHydrator;
