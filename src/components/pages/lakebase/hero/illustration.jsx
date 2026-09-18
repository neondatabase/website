'use client';

import dynamic from 'next/dynamic';

import { lakebasePageContent } from 'constants/backend-platform-page-content';

const AnimatedDiagram = dynamic(() => import('./animated-diagram'), { ssr: false });

const Illustration = () => (
  <div
    className="w-full overflow-hidden"
    role="img"
    aria-label={lakebasePageContent.hero.illustrationDescription}
  >
    <div className="relative aspect-[672/251] w-full overflow-hidden bg-[#151617] sm:w-[110%] sm:max-w-none sm:translate-x-[-3.6%]">
      <AnimatedDiagram />
    </div>
  </div>
);

export default Illustration;
