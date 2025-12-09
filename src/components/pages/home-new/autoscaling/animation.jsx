'use client';

import {
  Alignment,
  Fit,
  Layout,
  decodeFont,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber,
  useViewModelInstanceBoolean,
} from '@rive-app/react-canvas';
import { clsx } from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import useWindowSize from 'react-use/lib/useWindowSize';

const Animation = ({ className, state = 0 }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [riveInstance, setRiveInstance] = useState(null);

  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  const [animationRef, isVisible] = useInView({
    threshold: 0.4,
  });

  const { rive, RiveComponent } = useRive({
    src: '/animations/pages/home-new/autoscaling.riv',
    artboard: 'main',
    stateMachines: 'SM',
    autoplay: false,
    autoBind: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.TopCenter,
    }),
    assetLoader: (asset, bytes) => {
      if (asset?.cdnUuid?.length > 0 || bytes?.length > 0) {
        return false;
      }

      if (asset?.isFont) {
        fetch('/fonts/geist-mono/GeistMono-Regular.ttf').then(async (res) => {
          const font = await decodeFont(new Uint8Array(await res.arrayBuffer()));
          asset.setFont(font);
          font.unref();
        });

        return true;
      }

      return false;
    },
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
  const { setValue: setIsIntroInstance } = useViewModelInstanceBoolean('intro', viewModelInstance);
  const { setValue: setStateInstance } = useViewModelInstanceNumber('state', viewModelInstance);

  useEffect(() => {
    setRiveInstance(rive);
  }, [rive]);

  useEffect(() => {
    if (riveInstance && isLoaded) {
      if (isVisible) {
        setIsIntroInstance(true);
        riveInstance.play();
      } else {
        setIsIntroInstance(false);
      }
    }
  }, [isVisible, isLoaded, riveInstance, setIsIntroInstance]);

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

  useEffect(() => {
    if (isLoaded) {
      setStateInstance(state);
    }
  }, [state, isLoaded, setStateInstance]);

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
