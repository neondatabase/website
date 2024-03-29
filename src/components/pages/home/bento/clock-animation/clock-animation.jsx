'use client';

import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const DELAY_BEFORE_COUNTDOWN = 1100;
const COUNTDOWN_DURATION = 2400;

const useCurrentTime = () => {
  const [time, setTime] = useState({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
  });

  const updateTime = (minutesAdjustment) => {
    if (minutesAdjustment === undefined) {
      const currentTime = new Date();
      setTime({
        hours: currentTime.getHours(),
        minutes: currentTime.getMinutes(),
      });
    } else {
      const updatedTime = new Date(new Date().getTime() - minutesAdjustment * 60000);
      setTime({
        hours: updatedTime.getHours(),
        minutes: updatedTime.getMinutes(),
      });
    }
  };

  return [time, updateTime];
};

const ClockAnimation = ({
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
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [{ hours, minutes }, updateTime] = useCurrentTime(isCountingDown);
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

  // TODO: ask for file with correct input name (coundown -> countdown)
  const countDownInput = useStateMachineInput(rive, stateMachines, 'coundown');

  const hourTensInput = useStateMachineInput(
    rive,
    stateMachines,
    'Number 1',
    Math.floor(hours / 10)
  );
  const hourOnesInput = useStateMachineInput(rive, stateMachines, 'Number 2', hours % 10);
  const minuteTensInput = useStateMachineInput(
    rive,
    stateMachines,
    'Number 3',
    Math.floor(minutes / 10)
  );
  const minuteOnesInput = useStateMachineInput(rive, stateMachines, 'Number 4', minutes % 10);

  const countDownAnimation = () => {
    countDownInput.fire();
    setIsCountingDown(true);

    setTimeout(() => {
      const startTime = Date.now();
      const endTime = startTime + COUNTDOWN_DURATION;

      const step = () => {
        const now = Date.now();
        const timeElapsed = now - startTime;
        const progress = timeElapsed / COUNTDOWN_DURATION;

        const speedAdjustment = (progress * 1.65) ** 6;

        updateTime(speedAdjustment * 3);

        if (now < endTime) {
          requestAnimationFrame(step);
        } else {
          setIsCountingDown(false);
          setTimeout(updateTime, DELAY_BEFORE_COUNTDOWN);
        }
      };

      requestAnimationFrame(step);
    }, DELAY_BEFORE_COUNTDOWN);
  };

  useEffect(
    () => {
      if (!rive || !countDownInput) {
        return;
      }

      if (isVisible) {
        rive.play();
        countDownAnimation();
      } else {
        rive.pause();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rive, isVisible, countDownInput]
  );

  useEffect(
    () => {
      if (!rive || !hourOnesInput || !hourTensInput || !minuteOnesInput || !minuteTensInput) {
        return;
      }

      hourTensInput.value = Math.floor(hours / 10);
      hourOnesInput.value = hours % 10;
      minuteTensInput.value = Math.floor(minutes / 10);
      minuteOnesInput.value = minutes % 10;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minutes]
  );

  return (
    <>
      <span
        className={clsx(intersectionClassName, 'absolute left-1/2 top-0 -z-10 h-full w-px')}
        ref={containerRef}
        aria-hidden
      />
      <div
        className={clsx(className, '[&_canvas]:!h-auto [&_canvas]:!w-full')}
        ref={animationRef}
        aria-hidden
      >
        {isIntersecting ? <RiveComponent /> : null}
      </div>
    </>
  );
};

ClockAnimation.propTypes = {
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

export default ClockAnimation;
