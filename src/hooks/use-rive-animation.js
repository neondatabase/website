'use client';

import { Alignment, Fit, decodeFont, useRive } from '@rive-app/react-canvas';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const useRiveAnimation = ({
  src,
  artboard = 'main',
  stateMachines = 'SM',
  autoplay = false,
  autoBind = true,
  fit = Fit.FitWidth,
  alignment = Alignment.TopCenter,
  threshold = 0.4,
  triggerOnce = true,
  rootMargin = '500px 0px',
  visibilityRootMargin,
  assetLoader,
  onLoad,
  pauseOnHide = true,
} = {}) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [riveInstance, setRiveInstance] = useState(null);

  // Lazy loading observer
  const [wrapperRef, isIntersecting] = useInView({
    triggerOnce,
    rootMargin,
  });

  // Visibility observer for play/pause control
  const [animationRef, isVisible] = useInView({
    threshold,
    ...(visibilityRootMargin && { rootMargin: visibilityRootMargin }),
  });

  // Default asset loader for fonts
  const defaultAssetLoader = (asset, bytes) => {
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
  };

  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    stateMachines,
    autoplay,
    autoBind,
    fit,
    alignment,
    assetLoader: assetLoader || defaultAssetLoader,
    onLoad: () => {
      rive?.resizeDrawingSurfaceToCanvas();
      setIsLoaded(true);
      if (onLoad) {
        onLoad(rive);
      }
    },
  });

  // Store rive instance
  useEffect(() => {
    setRiveInstance(rive);
  }, [rive]);

  // Control play/pause based on visibility
  useEffect(() => {
    if (riveInstance && isLoaded) {
      if (isVisible) {
        riveInstance.play();
      } else if (pauseOnHide) {
        riveInstance.pause();
      }
    }
  }, [riveInstance, isVisible, isLoaded, pauseOnHide]);

  // Fade in when ready
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isLoaded]);

  return {
    isReady,
    isLoaded,
    riveInstance,
    rive,
    RiveComponent,
    wrapperRef,
    animationRef,
    isIntersecting,
    isVisible,
  };
};

export default useRiveAnimation;
