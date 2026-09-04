'use client';

import { Alignment, Fit } from '@rive-app/react-canvas';

import RiveAnimation from 'components/shared/rive-animation';

const RIVE_SOURCE = '/animations/pages/claimable-neon/build.riv';

const BuildAnimation = () => (
  <div
    className="@container relative aspect-[38/26.5] w-full overflow-hidden bg-gray-new-10"
    role="img"
    aria-label="The agent project connects to psql, SQL queries, a schema, the Data API, and an ORM."
    data-build-animation
    data-rive-source={RIVE_SOURCE}
  >
    <RiveAnimation
      className="pointer-events-none size-full"
      intersectionClassName="translate-x-[60.526cqw]"
      wrapperClassName="absolute top-[-46.0526cqw] left-[-168.421cqw] h-[157.072cqw] w-[315.789cqw]"
      src={RIVE_SOURCE}
      artboard="neon-claimable"
      stateMachines="State Machine 1"
      autoplay
      autoBind={false}
      fit={Fit.Contain}
      alignment={Alignment.TopLeft}
      threshold={0.05}
    />
  </div>
);

export default BuildAnimation;
