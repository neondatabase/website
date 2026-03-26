'use client';

import { RuntimeLoader } from '@rive-app/react-canvas';
import { usePathname } from 'next/navigation';

const RIVE_WASM_URL = 'https://unpkg.com/@rive-app/canvas@2.13.4/rive.wasm';

RuntimeLoader.setWasmUrl(RIVE_WASM_URL);

const RiveWasm = () => {
  const pathname = usePathname();

  const pagesWithRiveInHero = [];

  if (pagesWithRiveInHero.includes(pathname)) {
    return <link rel="preload" href={RIVE_WASM_URL} as="fetch" crossOrigin="anonymous" />;
  }

  return null;
};

export default RiveWasm;
