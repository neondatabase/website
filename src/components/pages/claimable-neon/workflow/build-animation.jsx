'use client';

import { Alignment, Fit } from '@rive-app/react-canvas';
import Image from 'next/image';
import { useSyncExternalStore } from 'react';

import RiveAnimation from 'components/shared/rive-animation';
import placeholder from 'images/pages/claimable-neon/build-animation-placeholder.jpg';

const RIVE_SOURCE = '/animations/pages/claimable-neon/build.riv';

const motionQuery = '(prefers-reduced-motion: reduce)';
const subscribeToMotion = (callback) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const getMotionSnapshot = () => window.matchMedia(motionQuery).matches;
const getServerMotionSnapshot = () => true;

const BuildAnimation = () => {
  const reduceMotion = useSyncExternalStore(
    subscribeToMotion,
    getMotionSnapshot,
    getServerMotionSnapshot
  );

  return (
    <div
      className="@container relative aspect-[38/26.5] w-full overflow-hidden bg-gray-new-10"
      role="img"
      aria-label="The agent project connects to psql, SQL queries, a schema, the Data API, and an ORM."
      data-build-animation
      data-rive-source={RIVE_SOURCE}
    >
      {reduceMotion ? (
        <Image
          className="size-full object-contain"
          src={placeholder}
          alt=""
          sizes="(max-width: 768px) 100vw, 608px"
        />
      ) : (
        <RiveAnimation
          className="pointer-events-none size-full"
          wrapperClassName="size-full"
          src={RIVE_SOURCE}
          artboard="main"
          stateMachines="SM"
          autoplay
          autoBind={false}
          fit={Fit.Contain}
          alignment={Alignment.TopLeft}
          threshold={0.05}
        />
      )}
    </div>
  );
};

export default BuildAnimation;
