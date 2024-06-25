'use client';

import riveWASMResource from '@rive-app/canvas/rive.wasm';
import { RuntimeLoader } from '@rive-app/react-canvas';
import { usePathname } from 'next/navigation';

RuntimeLoader.setWasmUrl(riveWASMResource);

const RiveWasm = () => {
  const pathname = usePathname();
  const pagesWithRiveInHero = [];

  if (pagesWithRiveInHero.includes(pathname)) {
    return <link rel="preload" href={riveWASMResource} as="fetch" crossOrigin="anonymous" />;
  }

  return null;
};

export default RiveWasm;
