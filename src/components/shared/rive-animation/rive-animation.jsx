'use client';

import { Alignment, Fit } from '@rive-app/react-canvas';
import PropTypes from 'prop-types';

import useIsTouchDevice from 'hooks/use-is-touch-device';
import useRiveAnimation from 'hooks/use-rive-animation';
import { cn } from 'utils/cn';

const RiveAnimation = ({
  className = '',
  intersectionClassName = '',
  wrapperClassName = '',
  src,
  artboard = 'main',
  stateMachines = 'SM',
  autoplay = false,
  autoBind = true,
  fit = Fit.FitWidth,
  alignment = Alignment.TopCenter,
  threshold = 0.4,
  triggerOnce = true,
  rootMargin = '500px 0px',
  visibilityRootMargin,
  pauseOnHide = true,
  showLazyLoadHelper = true,
  assetLoader,
  onLoad,
}) => {
  const isTouch = useIsTouchDevice();

  const { isReady, wrapperRef, animationRef, isIntersecting, RiveComponent } = useRiveAnimation({
    src,
    artboard,
    stateMachines,
    autoplay,
    autoBind,
    fit,
    alignment,
    threshold,
    triggerOnce,
    rootMargin,
    visibilityRootMargin,
    assetLoader,
    onLoad,
    pauseOnHide,
  });

  return (
    <div
      className={cn('transition-opacity', isReady ? 'opacity-100' : 'opacity-0', wrapperClassName)}
    >
      {showLazyLoadHelper && (
        <span
          className={cn(intersectionClassName, 'absolute top-0 left-1/2 -z-10 h-full w-px')}
          ref={wrapperRef}
          aria-hidden
        />
      )}
      <div
        className={cn(
          'size-full [&_canvas]:h-full! [&_canvas]:w-full!',
          {
            'pointer-events-none': isTouch,
          },
          className
        )}
        ref={animationRef}
        aria-hidden
      >
        {isIntersecting ? <RiveComponent /> : null}
      </div>
    </div>
  );
};

RiveAnimation.propTypes = {
  src: PropTypes.string.isRequired,
  artboard: PropTypes.string,
  stateMachines: PropTypes.string,
  autoplay: PropTypes.bool,
  autoBind: PropTypes.bool,
  fit: PropTypes.oneOf(Object.keys(Fit)),
  alignment: PropTypes.oneOf(Object.keys(Alignment)),
  threshold: PropTypes.number,
  triggerOnce: PropTypes.bool,
  rootMargin: PropTypes.string,
  visibilityRootMargin: PropTypes.string,
  pauseOnHide: PropTypes.bool,
  showLazyLoadHelper: PropTypes.bool,
  onLoad: PropTypes.func,
  assetLoader: PropTypes.func,
  className: PropTypes.string,
  intersectionClassName: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

export default RiveAnimation;
