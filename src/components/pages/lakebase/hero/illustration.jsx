'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import { lakebasePageContent } from 'constants/backend-platform-page-content';
import HeroImage from 'images/pages/lakebase/hero/hero-lakebase.jpg';

const RIVE_RENDERER_WASM_URL = 'https://cdn.jsdelivr.net/npm/@rive-app/webgl2@2.40.0/rive.wasm';
const AnimatedDiagram = dynamic(() => import('./animated-diagram'), { ssr: false });

const Illustration = () => (
  <>
    <link rel="preload" href={RIVE_RENDERER_WASM_URL} as="fetch" crossOrigin="anonymous" />
    <div
      className="w-full overflow-hidden"
      role="img"
      aria-label={lakebasePageContent.hero.illustrationDescription}
    >
      <div className="relative aspect-[672/251] w-full overflow-hidden bg-[#151617] sm:w-[110%] sm:max-w-none sm:translate-x-[-3.6%]">
        <Image
          className="absolute inset-0 size-full"
          src={HeroImage}
          width={2688}
          height={1004}
          sizes="(max-width: 39.9375rem) 110vw, (max-width: 95.9375rem) calc(100vw - 64px), 1344px"
          alt=""
          priority
          unoptimized
          draggable={false}
        />

        <AnimatedDiagram />
      </div>
    </div>
  </>
);

export default Illustration;
