'use client';

import {
  Fit,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceTrigger,
  Alignment,
} from '@rive-app/react-canvas';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import useRiveAnimation from 'hooks/use-rive-animation';

const Animation = ({ className }) => {
  const [wrapperRef, isWrapperIntersecting] = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });
  const { isReady, animationRef, rive, RiveComponent } = useRiveAnimation({
    src: '/animations/pages/home-new/speed-scale-ide.riv?2025121142',
    fit: Fit.Contain,
    alignment: Alignment.Center,
    threshold: 0,
  });

  const viewModel = useViewModel(rive);
  const viewModelInstance = useViewModelInstance(viewModel, { rive });
  const startTrigger = useViewModelInstanceTrigger('start', viewModelInstance);

  useEffect(() => {
    if (startTrigger && isWrapperIntersecting) {
      startTrigger.trigger();
    }
  }, [startTrigger, isWrapperIntersecting]);

  return (
    <div className={clsx('transition-opacity', isReady ? 'opacity-100' : 'opacity-0')}>
      <span className="absolute left-1/2 top-0 -z-10 h-full w-px" ref={wrapperRef} aria-hidden />
      <div className={clsx('[&_canvas]:!h-full [&_canvas]:!w-full', className)} ref={animationRef}>
        <RiveComponent />
      </div>
    </div>
  );
};

Animation.propTypes = {
  className: PropTypes.string,
};

export default Animation;
