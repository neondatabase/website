'use client';

import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceBoolean,
} from '@rive-app/react-canvas';
import { clsx } from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import useWindowSize from 'react-use/lib/useWindowSize';

const Animation = ({ className, src, autoBind = false }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [riveInstance, setRiveInstance] = useState(null);

  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  const [wrapperRef, isIntersecting] = useInView({
    triggerOnce: true,
    rootMargin: '500px 0px',
  });

  const [animationRef, isVisible] = useInView({
    threshold: 0.3,
  });

  const { rive, RiveComponent } = useRive({
    src,
    artboard: 'main',
    stateMachines: 'SM',
    autoplay: false,
    autoBind,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.TopCenter,
    }),
    onLoad: () => {
      rive?.resizeDrawingSurfaceToCanvas();
      setIsLoaded(true);
    },
  });

  const viewModel = useViewModel(rive);
  const viewModelInstance = useViewModelInstance(viewModel, { rive });
  const { setValue: setIsMobileInstance } = useViewModelInstanceBoolean(
    'mobile',
    viewModelInstance
  );

  useEffect(() => {
    setRiveInstance(rive);
  }, [rive]);

  useEffect(() => {
    if (riveInstance && isLoaded) {
      if (isVisible) {
        riveInstance.play();
      } else {
        riveInstance.pause();
      }
    }
  }, [riveInstance, isVisible, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isLoaded]);

  useEffect(() => setIsMobileInstance(isMobile), [isMobile, setIsMobileInstance]);

  return (
    <div className={clsx('transition-opacity', isReady ? 'opacity-100' : 'opacity-0')}>
      <span className="absolute left-1/2 top-0 -z-10 h-full w-px" ref={wrapperRef} aria-hidden />
      <div
        className={clsx(
          'relative aspect-[1378/448] w-[1378px] max-w-none',
          '3xl:max-w-full 2xl:aspect-[896/320] xl:aspect-[1024/360] lg:aspect-[768/280]',
          '[&_canvas]:!h-full [&_canvas]:!w-full',
          className
        )}
        ref={animationRef}
      >
        {isIntersecting ? <RiveComponent /> : null}
      </div>
    </div>
  );
};

Animation.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  autoBind: PropTypes.bool,
};

export default Animation;
