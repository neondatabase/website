'use client';

import { usePathname } from 'next/navigation';

import { configureRiveRuntime, RIVE_WASM_URL } from 'utils/rive-runtime';

configureRiveRuntime();

const RiveWasm = () => {
  const pathname = usePathname();

  const pagesWithRiveInHero = [];

  if (pagesWithRiveInHero.includes(pathname)) {
    return <link rel="preload" href={RIVE_WASM_URL} as="fetch" crossOrigin="anonymous" />;
  }

  return null;
};

export default RiveWasm;
