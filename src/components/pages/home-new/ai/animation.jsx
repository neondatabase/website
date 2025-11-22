'use client';

import { Alignment, Fit, Layout, decodeFont, useRive } from '@rive-app/react-canvas';
import { clsx } from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Animation = ({ src }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [riveInstance, setRiveInstance] = useState(null);

  const [wrapperRef, isIntersecting] = useInView({
    triggerOnce: true,
    rootMargin: '500px 0px',
  });

  const [animationRef, isVisible] = useInView({
    threshold: 0.1,
  });

  const { rive, RiveComponent } = useRive({
    src,
    artboard: 'main',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
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
    if (riveInstance) {
      if (isVisible) {
        riveInstance.play();
      } else {
        riveInstance.pause();
      }
    }
  }, [riveInstance, isVisible]);

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
      <span ref={wrapperRef} className="absolute left-1/2 top-0 -z-10 h-full w-px" aria-hidden />
      <div className={clsx('aspect-[1056/807] w-full')} ref={animationRef}>
        {isIntersecting ? (
          <div className="size-full [&_canvas]:!h-full [&_canvas]:!w-full">
            <RiveComponent />
          </div>
        ) : null}
      </div>
    </div>
  );
};

Animation.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Animation;
