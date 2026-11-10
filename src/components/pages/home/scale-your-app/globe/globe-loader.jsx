'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';

import PauseableVideo from 'components/shared/pauseable-video';

const MOBILE_QUERY = '(max-width: 767px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const subscribe = (callback) => {
  const queries = [MOBILE_QUERY, REDUCED_MOTION_QUERY].map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener('change', callback));
  return () => queries.forEach((query) => query.removeEventListener('change', callback));
};
const getSnapshot = () => {
  if (!window.matchMedia(MOBILE_QUERY).matches) return 'desktop';
  return window.matchMedia(REDUCED_MOTION_QUERY).matches ? 'still' : 'video';
};
const getServerSnapshot = () => null;

const GlobeAnimation = dynamic(() => import('./globe-animation'), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden="true" />,
});

const Globe = () => {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (mode === null) return <div className="size-full" aria-hidden="true" />;
  if (mode === 'desktop') return <GlobeAnimation />;

  return (
    <PauseableVideo
      className="size-full"
      videoClassName="size-full scale-[1.35] object-cover object-center"
      width={1000}
      height={1000}
      paused={mode === 'still'}
    >
      <source
        src="https://cdn.neonapi.io/public/images/pages/home/scale-your-app/globe.webm"
        type="video/webm"
      />
      <source
        src="https://cdn.neonapi.io/public/images/pages/home/scale-your-app/globe.mp4"
        type='video/mp4; codecs="hvc1"'
      />
    </PauseableVideo>
  );
};

export default Globe;
