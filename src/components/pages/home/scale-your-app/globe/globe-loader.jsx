'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';

import PauseableVideo from 'components/shared/pauseable-video';

const MOBILE_QUERY = '(max-width: 767px)';
const subscribe = (callback) => {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;
const getServerSnapshot = () => null;

const GlobeAnimation = dynamic(() => import('./globe-animation'), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden="true" />,
});

const Globe = () => {
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (isMobile === null) return <div className="size-full" aria-hidden="true" />;
  if (!isMobile) return <GlobeAnimation />;

  return (
    <PauseableVideo
      className="size-full"
      videoClassName="size-full scale-[1.35] object-cover object-center"
      width={1000}
      height={1000}
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
