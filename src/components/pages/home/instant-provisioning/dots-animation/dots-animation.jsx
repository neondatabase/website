'use client';

import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import useIsTouchDevice from 'hooks/use-is-touch-device';

import { useActiveTab } from '../active-tab-context';

const DotsAnimation = ({
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
  const isTouch = useIsTouchDevice();
  const { activeTab } = useActiveTab();
  const [containerRef, isIntersecting] = useInView({
    triggerOnce: true,
    rootMargin: intersectionRootMargin,
  });
  const [animationRef, isVisible] = useInView({ threshold: 0.2 });

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

  const tabInput = useStateMachineInput(rive, stateMachines, 'tab', 1);
  const changeInput = useStateMachineInput(rive, stateMachines, 'change');

  useEffect(
    () => {
      if (!rive) {
        return;
      }

      if (isVisible) {
        rive.play();
      } else {
        rive.pause();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rive, isVisible]
  );

  useEffect(
    () => {
      if (!rive || !tabInput || !changeInput) {
        return;
      }

      tabInput.value = activeTab + 1;
      changeInput.fire();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rive, isVisible, activeTab]
  );

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
            'opacity-0': !isVisible,
          },
          'transition-opacity duration-300',
          'md:h-40 md:min-w-[560px]',
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

DotsAnimation.propTypes = {
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

export default DotsAnimation;
