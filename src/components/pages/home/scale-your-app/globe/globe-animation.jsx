'use client';

import { useEffect, useRef } from 'react';

import { createGlobeRenderer } from './renderer';

const getPixelRatio = () => Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

const GlobeAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const drawGlobe = createGlobeRenderer();
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frameId = 0;
    let elapsedMs = 0;
    let lastFrameMs = null;
    let isIntersecting = !('IntersectionObserver' in window);
    let isPageVisible = document.visibilityState !== 'hidden';
    let prefersReducedMotion = reducedMotionQuery.matches;
    let width = 0;
    let height = 0;

    const draw = (staticFrame = prefersReducedMotion) => {
      if (width <= 0 || height <= 0) return;

      const pixelRatio = getPixelRatio();
      const nextWidth = Math.max(1, Math.round(width * pixelRatio));
      const nextHeight = Math.max(1, Math.round(height * pixelRatio));

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawGlobe(context, width, height, { elapsedMs, staticFrame });
    };

    const stopAnimation = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrameMs = null;
    };

    const renderFrame = (nowMs) => {
      frameId = 0;
      if (prefersReducedMotion || !isIntersecting || !isPageVisible) return;

      if (lastFrameMs !== null) elapsedMs += nowMs - lastFrameMs;
      lastFrameMs = nowMs;
      draw(false);
      frameId = requestAnimationFrame(renderFrame);
    };

    const syncAnimation = () => {
      if (prefersReducedMotion) {
        stopAnimation();
        draw(true);
        return;
      }

      if (isIntersecting && isPageVisible) {
        if (!frameId) frameId = requestAnimationFrame(renderFrame);
      } else {
        stopAnimation();
      }
    };

    const measure = () => {
      // clientWidth/clientHeight intentionally ignore any presentation-only scale transform.
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      draw();
    };

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState !== 'hidden';
      syncAnimation();
    };

    const handleReducedMotionChange = (event) => {
      prefersReducedMotion = event.matches;
      syncAnimation();
    };

    const intersectionObserver =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            ([entry]) => {
              isIntersecting = entry.isIntersecting;
              syncAnimation();
            },
            { threshold: 0.01 }
          )
        : null;

    const resizeObserver =
      'ResizeObserver' in window
        ? new ResizeObserver(() => {
            measure();
          })
        : null;

    intersectionObserver?.observe(canvas);
    resizeObserver?.observe(canvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', measure);
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    } else {
      reducedMotionQuery.addListener(handleReducedMotionChange);
    }

    measure();
    syncAnimation();

    return () => {
      stopAnimation();
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', measure);
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      } else {
        reducedMotionQuery.removeListener(handleReducedMotionChange);
      }
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      className="pointer-events-none block h-full w-full"
      ref={canvasRef}
    />
  );
};

export default GlobeAnimation;
