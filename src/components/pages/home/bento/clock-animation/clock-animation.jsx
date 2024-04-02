'use client';

import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const DELAY_BEFORE_COUNTDOWN = 800;
const DELAY_AFTER_COUNTDOWN = DELAY_BEFORE_COUNTDOWN + 1000;
const COUNTDOWN_DURATION = 3500;
const MINUTES_DOWN_RESULT = 720;

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

function useCombinedInView(options1, options2) {
  const [isVisible, setIsVisible] = useState(false);
  const [isThresholded, setIshresholded] = useState(false);
  const elementRef = useRef(null);

  const [ref1, inView1] = useInView(options1);
  const [ref2, inView2] = useInView(options2);

  useEffect(() => {
    setIsVisible(inView1);
  }, [inView1]);

  useEffect(() => {
    setIshresholded(inView2);
  }, [inView2]);

  const setRefs = (element) => {
    elementRef.current = element;
    ref1(element);
    ref2(element);
  };

  return [setRefs, isVisible, isThresholded];
}

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
  onLoad,
}) => {
  const [setRefs, isVisible, isThresholded] = useCombinedInView(
    { rootMargin: '200px 0px 200px 0px' },
    { threshold: 0.5 }
  );
  const [{ hours, minutes }, updateTime] = useCurrentTime();
  const [containerRef, isIntersecting] = useInView({
    triggerOnce: true,
    rootMargin: intersectionRootMargin,
  });

  const isDayTime = hours > 7 && hours < 22;

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

  const countDownInput = useStateMachineInput(rive, stateMachines, 'coundown');
  const resetCountDownInput = useStateMachineInput(rive, stateMachines, 'reset');
  const indicatorInput = useStateMachineInput(rive, stateMachines, 'indicator-reverse', isDayTime);

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
  let animationFrameId;
  let timeoutIds = [];

  const resetAnimation = () => {
    if (!resetCountDownInput) return;
    resetCountDownInput.fire();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    timeoutIds.forEach(clearTimeout);
    timeoutIds = [];
    updateTime();
  };

  const countDownAnimation = () => {
    if (!countDownInput) return;
    resetAnimation();
    countDownInput.fire();
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const endTime = startTime + COUNTDOWN_DURATION;
      const step = () => {
        if (!isThresholded) return;
        const now = Date.now();
        const timeElapsed = now - startTime;
        const progress = timeElapsed / COUNTDOWN_DURATION;
        const speedAdjustment = progress > 0.55 ? (progress * 2.5) ** 8 : (progress * 2) ** 7;
        updateTime(speedAdjustment * 3);
        if (now < endTime) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          timeoutIds.push(
            setTimeout(() => updateTime(MINUTES_DOWN_RESULT - 3), DELAY_AFTER_COUNTDOWN)
          );
          timeoutIds.push(
            setTimeout(() => updateTime(MINUTES_DOWN_RESULT - 2), DELAY_AFTER_COUNTDOWN + 500)
          );
          timeoutIds.push(
            setTimeout(() => updateTime(MINUTES_DOWN_RESULT - 1), DELAY_AFTER_COUNTDOWN + 900)
          );
          timeoutIds.push(
            setTimeout(() => updateTime(MINUTES_DOWN_RESULT), DELAY_AFTER_COUNTDOWN + 1200)
          );
        }
      };
      animationFrameId = requestAnimationFrame(step);
    }, DELAY_BEFORE_COUNTDOWN);
    timeoutIds.push(timeout);
  };

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
      if (!rive || !countDownInput || !resetCountDownInput) {
        return;
      }
      let timeoutId = null;
      let intervalId = null;

      if (!isThresholded) {
        resetAnimation();
      } else {
        timeoutId = setTimeout(countDownAnimation, 2000);
        intervalId = setInterval(() => {
          resetAnimation();
          setTimeout(countDownAnimation, 2000);
        }, 20000);
      }

      return () => {
        resetAnimation();
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rive, countDownInput, resetCountDownInput, isThresholded]
  );

  useEffect(
    () => {
      if (
        !rive ||
        !hourOnesInput ||
        !hourTensInput ||
        !minuteOnesInput ||
        !minuteTensInput ||
        !indicatorInput
      ) {
        return;
      }

      hourTensInput.value = Math.floor(hours / 10);
      hourOnesInput.value = hours % 10;
      minuteTensInput.value = Math.floor(minutes / 10);
      minuteOnesInput.value = minutes % 10;
      indicatorInput.value = isDayTime;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rive, minutes, isDayTime, isVisible]
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
        ref={setRefs}
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
  className: PropTypes.string,
  intersectionClassName: PropTypes.string,
};

export default ClockAnimation;
