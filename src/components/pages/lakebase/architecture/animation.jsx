'use client';

import { Alignment, Fit } from '@rive-app/react-canvas';

import { cn } from 'utils/cn';

import useRiveAnimation from '../use-section-rive-animation';

// Align layout to the scheme's visible background, leaving room for Rive tooltips.
const ARTBOARD_STYLE = {
  aspectRatio: '2770 / 1770',
  width: `${(2770 / 2368) * 100}%`,
  left: `${(-262 / 2368) * 100}%`,
  top: `${(-374 / 1058) * 100}%`,
};

const Animation = () => {
  const { isReady, wrapperRef, animationRef, isIntersecting, RiveComponent } = useRiveAnimation({
    src: '/animations/pages/lakebase/lakebase-scheme.riv',
    artboard: 'main',
    stateMachines: 'SM',
    fit: Fit.Contain,
    alignment: Alignment.Center,
    threshold: 0.01,
  });

  return (
    <div
      className={cn(
        'relative aspect-[2368/1058] w-full transition-opacity',
        isReady ? 'opacity-100' : 'opacity-0'
      )}
      ref={wrapperRef}
    >
      <div
        className="absolute [&_canvas]:h-full! [&_canvas]:w-full!"
        style={ARTBOARD_STYLE}
        ref={animationRef}
        aria-hidden
      >
        {isIntersecting ? <RiveComponent /> : null}
      </div>
    </div>
  );
};

export default Animation;
