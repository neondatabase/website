'use client';

import {
  Fit,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceTrigger,
  Alignment,
} from '@rive-app/react-canvas';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import useRiveAnimation from 'hooks/use-rive-animation';
import { cn } from 'utils/cn';

const Animation = ({ className }) => {
  const [wrapperRef, isWrapperIntersecting] = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });
  const { isReady, animationRef, rive, RiveComponent } = useRiveAnimation({
    src: '/animations/pages/home/speed-scale-ide.riv?202604171944',
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
    <div className={cn('transition-opacity', isReady ? 'opacity-100' : 'opacity-0')}>
      <span className="absolute top-0 left-1/2 -z-10 h-full w-px" ref={wrapperRef} aria-hidden />
      <div className={cn('[&_canvas]:h-full! [&_canvas]:w-full!', className)} ref={animationRef}>
        <RiveComponent />
      </div>
    </div>
  );
};

Animation.propTypes = {
  className: PropTypes.string,
};

export default Animation;
