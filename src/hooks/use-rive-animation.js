'use client';

import { Alignment, Fit, useRive } from '@rive-app/react-canvas';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { getCachedFontLoader } from 'utils/rive-font-loader';
import { configureRiveRuntime } from 'utils/rive-runtime';

configureRiveRuntime();

const useRiveAnimation = ({
  src,
  artboard = 'main',
  stateMachines = 'SM',
  autoplay = false,
  autoBind = true,
  shouldDisableRiveListeners = false,
  fit = Fit.FitWidth,
  alignment = Alignment.TopCenter,
  threshold = 0.4,
  triggerOnce = true,
  rootMargin = '500px 0px',
  visibilityRootMargin,
  assetLoader,
  onLoad,
  pauseOnHide = true,
  managePlayback = true,
} = {}) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [riveInstance, setRiveInstance] = useState(null);
  const animationNodeRef = useRef(null);
  const onLoadRef = useRef(onLoad);

  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  // Lazy loading observer
  const [wrapperRef, isIntersecting] = useInView({
    triggerOnce,
    rootMargin,
  });

  // Visibility observer for play/pause control
  const [visibilityRef, isVisible] = useInView({
    threshold,
    ...(visibilityRootMargin && { rootMargin: visibilityRootMargin }),
  });

  const animationRef = useCallback(
    (node) => {
      animationNodeRef.current = node;
      visibilityRef(node);
    },
    [visibilityRef]
  );

  const resizeDrawingSurface = useCallback((instance) => {
    const canvas = instance?.canvas;
    if (!canvas) return false;

    const { width, height } = canvas.getBoundingClientRect();
    if (width <= 0 || height <= 0) return false;

    instance.resizeDrawingSurfaceToCanvas();
    return true;
  }, []);

  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    stateMachines,
    autoplay,
    autoBind,
    shouldDisableRiveListeners,
    fit,
    alignment,
    assetLoader: assetLoader || getCachedFontLoader(),
    onRiveReady: (instance) => {
      setIsReady(false);
      resizeDrawingSurface(instance);
      setIsLoaded(true);
      onLoadRef.current?.(instance);
    },
  });

  // The runtime load event fires before `useRive` exposes its instance. Resize again after
  // React and the Rive wrapper have committed their canvas dimensions, then keep the drawing
  // surface synchronized with the observed animation container.
  useEffect(() => {
    if (!rive || !isLoaded) return undefined;

    let resizeFrame = null;
    let firstSettleFrame = null;
    let secondSettleFrame = null;
    let readyTimer = null;

    const resize = () => resizeDrawingSurface(rive);
    const scheduleResize = () => {
      if (resizeFrame !== null) return;

      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = null;
        resize();
      });
    };

    resize();
    firstSettleFrame = window.requestAnimationFrame(() => {
      resize();
      secondSettleFrame = window.requestAnimationFrame(() => {
        resize();
        readyTimer = window.setTimeout(() => {
          resize();
          setIsReady(true);
        }, 100);
      });
    });

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleResize);
    const riveContainer = rive.canvas?.parentElement;

    if (animationNodeRef.current) resizeObserver?.observe(animationNodeRef.current);
    if (riveContainer && riveContainer !== animationNodeRef.current) {
      resizeObserver?.observe(riveContainer);
    }
    window.addEventListener('resize', scheduleResize);

    return () => {
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
      if (firstSettleFrame !== null) window.cancelAnimationFrame(firstSettleFrame);
      if (secondSettleFrame !== null) window.cancelAnimationFrame(secondSettleFrame);
      if (readyTimer !== null) window.clearTimeout(readyTimer);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleResize);
    };
  }, [isLoaded, resizeDrawingSurface, rive]);

  // Store rive instance
  useEffect(() => {
    setRiveInstance(rive);
  }, [rive]);

  // Control play/pause based on visibility
  useEffect(() => {
    if (managePlayback && riveInstance && isLoaded) {
      if (isVisible) {
        riveInstance.play();
      } else if (pauseOnHide) {
        riveInstance.pause();
      }
    }
  }, [managePlayback, riveInstance, isVisible, isLoaded, pauseOnHide]);

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
