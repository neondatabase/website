'use client';

import { Alignment, Fit } from '@rive-app/react-canvas';

import useRiveAnimation from 'hooks/use-rive-animation';
import { cn } from 'utils/cn';

const ARTBOARD_WIDTH = 2770;
const ARTBOARD_HEIGHT = 1770;
// The 1184 × 529 Figma base is exported at 2× inside the larger Rive artboard.
const BASE_X = 262;
const BASE_Y = 374;
const BASE_WIDTH = 2368;
const BASE_HEIGHT = 1058;

const ARTBOARD_STYLE = {
  aspectRatio: `${ARTBOARD_WIDTH} / ${ARTBOARD_HEIGHT}`,
  left: `${(-BASE_X / BASE_WIDTH) * 100}%`,
  top: `${(-BASE_Y / BASE_HEIGHT) * 100}%`,
  width: `${(ARTBOARD_WIDTH / BASE_WIDTH) * 100}%`,
};

const Animation = () => {
  const { isReady, wrapperRef, animationRef, isIntersecting, RiveComponent } = useRiveAnimation({
    src: '/animations/pages/home/lakebase-postgres.riv?20260910-3',
    artboard: 'main',
    stateMachines: 'SM',
    fit: Fit.Contain,
    alignment: Alignment.Center,
    threshold: 0.01,
  });

  return (
    <div
      className={cn(
        'relative aspect-[1184/529] w-full transition-opacity',
        isReady ? 'opacity-100' : 'opacity-0'
      )}
      ref={wrapperRef}
    >
      <div
        className="absolute [&_canvas]:h-full! [&_canvas]:w-full!"
        ref={animationRef}
        style={ARTBOARD_STYLE}
        aria-hidden
      >
        {isIntersecting ? <RiveComponent /> : null}
      </div>
    </div>
  );
};

export default Animation;
