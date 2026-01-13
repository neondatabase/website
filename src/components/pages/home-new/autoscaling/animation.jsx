'use client';

import {
  Fit,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber,
  useViewModelInstanceBoolean,
} from '@rive-app/react-canvas';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

import useRiveAnimation from 'hooks/use-rive-animation';

const Animation = ({ className, state = 0 }) => {
  const { isReady, animationRef, rive, RiveComponent, isVisible } = useRiveAnimation({
    src: '/animations/pages/home-new/autoscaling.riv?202601131',
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
    <div className={clsx('transition-opacity', isReady ? 'opacity-100' : 'opacity-0')}>
      <span className="absolute left-1/2 top-0 -z-10 h-full w-px" aria-hidden />
      <div
        className={clsx(
          'relative max-w-none xl:pointer-events-none',
          '[&_canvas]:!h-full [&_canvas]:!w-full',
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
