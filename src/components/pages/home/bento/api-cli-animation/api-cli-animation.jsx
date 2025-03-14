'use client';

import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import useIsTouchDevice from 'hooks/use-is-touch-device';
import useWindowSize from 'hooks/use-window-size';

const ApiCliAnimation = ({
  className = '',
  intersectionClassName = '',
  src,
  artboard,
  stateMachines = 'SM',
  autoplay = false,
  fit = 'FitWidth',
  alignment = 'TopCenter',
  intersectionRootMargin = '500px 0px',
  onLoad,
}) => {
  const { width: windowWidth } = useWindowSize();
  const isTouch = useIsTouchDevice();

  const [containerRef, isIntersecting] = useInView({
    triggerOnce: true,
    rootMargin: intersectionRootMargin,
  });
  const [animationRef, isVisible] = useInView({ threshold: 0.5 });

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

  const changeInput = useStateMachineInput(rive, stateMachines, 'change');

  useEffect(() => {
    if (!rive || !changeInput) {
      return;
    }

    let intervalId;

    if (!isVisible) {
      rive.pause();
      clearInterval(intervalId);
    } else {
      rive.play();
      const timeoutId = setTimeout(() => {
        changeInput.fire();
        intervalId = setInterval(() => {
          changeInput.fire();
        }, 6000);
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    }
  }, [rive, isVisible, changeInput]);

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
            'pointer-events-none': isTouch && windowWidth <= 540,
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

ApiCliAnimation.propTypes = {
  src: PropTypes.string.isRequired,
  artboard: PropTypes.string.isRequired,
  stateMachines: PropTypes.string,
  autoplay: PropTypes.bool,
  fit: PropTypes.oneOf(Object.keys(Fit)),
  alignment: PropTypes.oneOf(Object.keys(Alignment)),
  onLoad: PropTypes.func,
  intersectionRootMargin: PropTypes.string,
  className: PropTypes.string,
  intersectionClassName: PropTypes.string,
};

export default ApiCliAnimation;
