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
    src: '/animations/pages/branching/branching.riv',
    artboard: 'main',
    stateMachines: 'SM',
    autoplay: false,
    loop: false,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
    assetLoader: (asset, bytes) => {
      if (asset?.cdnUuid?.length > 0 || bytes?.length > 0) {
        return false;
      }

      if (asset?.isFont) {
        const assetName = asset.name || '';
        const fontUrl =
          assetName === 'Geist Mono'
            ? '/fonts/geist-mono/GeistMono-Regular.ttf'
            : 'https://cdn.rive.app/runtime/flutter/inter.ttf';

        fetch(fontUrl).then(async (res) => {
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
    <div className={clsx('transition-opacity', isReady ? 'opacity-100' : 'opacity-0')}>
      <span className="absolute left-1/2 top-0 -z-10 h-full w-px" ref={wrapperRef} aria-hidden />
      <div
        className={clsx(
          '[&_canvas]:!h-full [&_canvas]:!w-full',
          'pointer-events-none relative -ml-[34px] mt-14 w-[1184px] max-w-none',
          'xl:mt-12 xl:w-[94vw] lg:-ml-4 lg:w-[96vw] md:left-1/2 md:-ml-[50vw] md:w-screen'
        )}
        ref={animationRef}
      >
        {isIntersecting ? <RiveComponent /> : null}
      </div>
    </div>
  );
};

export default Animation;
