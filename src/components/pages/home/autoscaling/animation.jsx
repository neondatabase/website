'use client';

import {
  Fit,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber,
  useViewModelInstanceBoolean,
} from '@rive-app/react-canvas';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

import useRiveAnimation from 'hooks/use-rive-animation';
import { cn } from 'utils/cn';

const Animation = ({ className, state = 0 }) => {
  const { isReady, animationRef, rive, RiveComponent, isVisible } = useRiveAnimation({
    src: '/animations/pages/home/autoscaling.riv?202601131',
    fit: Fit.Cover,
    threshold: 0.8,
  });

  const viewModel = useViewModel(rive);
  const viewModelInstance = useViewModelInstance(viewModel, { rive });
  const { setValue: setIsIntroInstance } = useViewModelInstanceBoolean('intro', viewModelInstance);
  const { setValue: setStateInstance } = useViewModelInstanceNumber('state', viewModelInstance);

  useEffect(() => {
    if (rive) {
      if (isVisible) {
        setIsIntroInstance(true);
        rive.play();
      } else {
        setIsIntroInstance(false);
      }
    }
  }, [isVisible, rive, setIsIntroInstance]);

  useEffect(() => {
    setStateInstance(state);
  }, [state, setStateInstance]);

  return (
    <div className={cn('transition-opacity', isReady ? 'opacity-100' : 'opacity-0')}>
      <span className="absolute top-0 left-1/2 -z-10 h-full w-px" aria-hidden />
      <div
        className={cn(
          'relative max-w-none xl:pointer-events-none',
          '[&_canvas]:h-full! [&_canvas]:w-full!',
          className
        )}
        ref={animationRef}
      >
        <RiveComponent />
      </div>
    </div>
  );
};

Animation.propTypes = {
  className: PropTypes.string,
  state: PropTypes.number,
};

export default Animation;
