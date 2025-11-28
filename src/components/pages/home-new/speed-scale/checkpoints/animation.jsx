'use client';

import { Alignment, Fit, Layout, decodeFont, useRive } from '@rive-app/react-canvas';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Animation = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [riveInstance, setRiveInstance] = useState(null);

  const [wrapperRef, isIntersecting] = useInView({
    triggerOnce: true,
    rootMargin: '500px 0px',
  });

  const [animationRef, isVisible] = useInView({
    threshold: 0.3,
  });

  const { rive, RiveComponent } = useRive({
    src: '/animations/pages/home-new/speed-scale-checkpoints.riv',
    artboard: 'main',
    stateMachines: 'SM',
    autoplay: false,
    autoBind: true,
    layout: new Layout({
      fit: Fit.FitHeight,
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

  return (
    <div className={clsx('relative transition-opacity', isReady ? 'opacity-100' : 'opacity-0')}>
      <span className="absolute left-1/2 top-0 -z-10 h-full w-px" ref={wrapperRef} aria-hidden />
      <div
        className={clsx(
          'pointer-events-none relative left-1/2 h-[500px] w-[1920px] max-w-none -translate-x-1/2',
          'xl:aspect-[1024/356] xl:h-auto xl:w-full lg:aspect-[768/280]',
          '[&_canvas]:!h-full [&_canvas]:!w-full'
        )}
        ref={animationRef}
      >
        {isIntersecting ? <RiveComponent /> : null}
      </div>
    </div>
  );
};

export default Animation;
