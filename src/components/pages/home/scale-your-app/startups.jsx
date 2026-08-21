import Image from 'next/image';

import Container from 'components/shared/container';

import FeatureHeading from './feature-heading';
import StartupAnimation from './startup-animation';

const LOGO_ROOT = '/images/pages/home/scale-your-app';

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

const StartupLogos = () => (
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
          {row.map(([name, width]) => (
            <Image
              className="h-11 w-auto shrink-0"
              src={`${LOGO_ROOT}/startup-${name}.svg`}
              width={width}
              height={64}
              sizes={`${Math.round((width / 64) * 44)}px`}
              alt=""
              key={name}
            />
          ))}
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

const Startups = () => (
  <div className="relative h-[977px] lg:h-[900px] md:h-[790px] sm:h-[720px]">
    <Container
      className="grid h-full grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)] lg:block"
      size="1600"
    >
      <div className="relative col-start-2 h-full min-w-0">
        <FeatureHeading
          lines={[
            { text: 'WHERE STARTUPS', width: 608 },
            { text: 'START', width: 384 },
          ]}
          description="Thousands of new companies spin up on Neon every week."
        />

        <StartupLogos />
        <StartupAnimation />
      </div>
    </Container>
  </div>
);

export default Startups;
