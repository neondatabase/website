'use client';

import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { cn } from 'utils/cn';

const LOGO_ROOT = '/images/pages/home/scale-your-app';
const LOGO_REVEAL_START = 0;
const LOADER_COMPLETE = 6100;
const LOGO_REVEAL_DURATION = 500;

const LOGO_ROWS = [
  [
    ['recrowd', 238],
    ['neptune', 213],
    ['unlabeled-mark-01', 51],
    ['databuddy', 272],
    ['axess-intelligence', 174],
  ],
  [
    ['medusa', 267],
    ['revision-dojo', 362],
    ['telgea', 214],
    ['catch', 249],
  ],
  [
    ['retail-book', 288],
    ['roame', 191],
    ['unlabeled-mark-02', 64],
    ['archbee', 294],
    ['just-paid', 256],
  ],
  [
    ['respeecher', 354],
    ['y-combinator', 313],
    ['tanda', 234],
    ['magic-circle-game-studio', 100],
    ['telgea', 214],
  ],
  [
    ['airgoods', 320],
    ['avocado', 233],
    ['unlabeled-mark-03', 64],
    ['medusa', 267],
    ['elevate-pay', 296],
  ],
  [
    ['akgz-games-speedrun', 316],
    ['utopia', 250],
    ['basehub', 222],
    ['daylight', 197],
    ['roame', 191],
  ],
  [
    ['traconiq', 224],
    ['unlabeled-mark-04', 64],
    ['nolla', 223],
    ['nodecraft', 283],
    ['endform', 275],
  ],
];

const LOGO_COUNT = LOGO_ROWS.reduce((total, row) => total + row.length, 0);
const LOGO_REVEAL_STAGGER =
  (LOADER_COMPLETE - LOGO_REVEAL_START - LOGO_REVEAL_DURATION) / (LOGO_COUNT - 1);

const getRandomRevealDelays = () => {
  const logoIndexes = Array.from({ length: LOGO_COUNT }, (_, index) => index);

  for (let index = logoIndexes.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [logoIndexes[index], logoIndexes[randomIndex]] = [logoIndexes[randomIndex], logoIndexes[index]];
  }

  return logoIndexes.reduce((delays, logoIndex, revealIndex) => {
    delays[logoIndex] = LOGO_REVEAL_START + revealIndex * LOGO_REVEAL_STAGGER;
    return delays;
  }, Array(LOGO_COUNT).fill(0));
};

const StartupLogos = ({ isActive }) => {
  const [revealDelays, setRevealDelays] = useState(null);

  useEffect(() => {
    if (!isActive || revealDelays) return;

    const animationFrame = window.requestAnimationFrame(() => {
      setRevealDelays(getRandomRevealDelays());
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [isActive, revealDelays]);

  let logoIndex = 0;

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-0 h-[939px] w-[1056px] origin-top select-none xl:left-1/2 xl:-translate-x-1/2 xl:scale-[0.82] lg:scale-90 md:scale-[0.68] sm:-top-[41px] sm:scale-[0.54] xs:scale-[0.35]"
      aria-hidden="true"
    >
      <div
        className="absolute top-[246px] -left-8 flex w-[1056px] flex-col gap-[54px] opacity-50"
        style={{
          WebkitMaskImage: `url(${LOGO_ROOT}/startup-logos-mask.svg)`,
          WebkitMaskPosition: '-278px -432px',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: '1612px 1435px',
          maskImage: `url(${LOGO_ROOT}/startup-logos-mask.svg)`,
          maskPosition: '-278px -432px',
          maskRepeat: 'no-repeat',
          maskSize: '1612px 1435px',
        }}
      >
        {LOGO_ROWS.map((row, rowIndex) => (
          <div className="flex h-11 items-center justify-between gap-12" key={rowIndex}>
            {row.map(([name, width]) => {
              const currentLogoIndex = logoIndex;
              logoIndex += 1;

              return (
                <Image
                  className={cn(
                    'h-11 w-auto shrink-0 transition-opacity duration-500 ease-out motion-reduce:opacity-100 motion-reduce:transition-none',
                    revealDelays ? 'opacity-100' : 'opacity-0'
                  )}
                  src={`${LOGO_ROOT}/startup-${name}.svg`}
                  width={width}
                  height={64}
                  sizes={`${Math.round((width / 64) * 44)}px`}
                  style={{ transitionDelay: `${revealDelays?.[currentLogoIndex] ?? 0}ms` }}
                  alt=""
                  key={`${name}-${currentLogoIndex}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <span
        className="absolute top-[124px] left-0 z-[1] h-[815px] w-[1024px] bg-black-pure blur-[77px]"
        style={{
          WebkitMaskImage: `url(${LOGO_ROOT}/startup-logos-noise-mask.png)`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: '1034px 881px',
          maskImage: `url(${LOGO_ROOT}/startup-logos-noise-mask.png)`,
          maskMode: 'alpha',
          maskRepeat: 'no-repeat',
          maskSize: '1034px 881px',
        }}
      />

      <span className="absolute top-[800px] left-[3px] z-[2] h-[121px] w-[1021px] bg-linear-to-b from-transparent to-black-pure" />
    </div>
  );
};

StartupLogos.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default StartupLogos;
