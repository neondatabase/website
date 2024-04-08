'use client';

import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import useIsTouchDevice from 'hooks/use-is-touch-device';

const RiveAnimation = ({
  className = '',
  intersectionClassName = '',
  src,
  artboard,
  stateMachines = 'SM',
  autoplay = false,
  fit = 'FitWidth',
  alignment = 'TopCenter',
  intersectionRootMargin = '500px 0px',
  animationRootMargin = '300px 0px',
  onLoad,
}) => {
  const isTouch = useIsTouchDevice();
  const [containerRef, isIntersecting] = useInView({
    triggerOnce: true,
    rootMargin: intersectionRootMargin,
  });
  const [animationRef, isVisible] = useInView({ rootMargin: animationRootMargin });

  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    autoplay,
    stateMachines,
    layout: new Layout({
      fit: Fit[fit],
      alignment: Alignment[alignment],
    }),
    onLoad: () => {
      rive?.resizeDrawingSurfaceToCanvas();
      onLoad?.();
    },
  });

  useEffect(() => {
    if (!rive) {
      return;
    }

    if (isVisible) {
      rive.play();
    } else {
      rive.pause();
    }
  }, [rive, isVisible]);

  return (
    <>
      <span
        className={clsx(intersectionClassName, 'absolute left-1/2 top-0 -z-10 h-full w-px')}
        ref={containerRef}
        aria-hidden
      />
      <div
        className={clsx(
          className,
          {
            'pointer-events-none': isTouch,
          },
          '[&_canvas]:!h-auto [&_canvas]:!w-full'
        )}
        ref={animationRef}
        aria-hidden
      >
        {isIntersecting ? <RiveComponent /> : null}
      </div>
    </>
  );
};

RiveAnimation.propTypes = {
  src: PropTypes.string.isRequired,
  artboard: PropTypes.string.isRequired,
  stateMachines: PropTypes.string,
  autoplay: PropTypes.bool,
  fit: PropTypes.oneOf(Object.keys(Fit)),
  alignment: PropTypes.oneOf(Object.keys(Alignment)),
  onLoad: PropTypes.func,
  intersectionRootMargin: PropTypes.string,
  animationRootMargin: PropTypes.string,
  className: PropTypes.string,
  intersectionClassName: PropTypes.string,
};

export default RiveAnimation;
