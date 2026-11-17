'use client';

import { useEffect, useRef } from 'react';

import { createGlobeRenderer } from './globe-renderer';

const GlobeAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listeners = new AbortController();
    const { signal } = listeners;
    let inView = false;
    let nearViewport = false;
    let pageHidden = false;
    let dirty = true;
    let elapsed = 0;
    let lastFrame = null;
    let frameId = null;
    let lastPixelRatio;

    const isPlaying = () => inView && !reducedMotion.matches;
    const needsFrame = () =>
      !signal.aborted &&
      !pageHidden &&
      !document.hidden &&
      (isPlaying() || (dirty && (nearViewport || inView)));

    const render = (timestamp) => {
      frameId = null;
      if (!needsFrame()) return;

      const pixelRatio = window.devicePixelRatio || 1;
      if (dirty || pixelRatio !== lastPixelRatio) {
        renderer.resize(container.clientWidth, container.clientHeight, pixelRatio);
        lastPixelRatio = pixelRatio;
        dirty = false;
      }
      const playing = isPlaying();
      if (playing) {
        elapsed += timestamp - (lastFrame ?? timestamp);
        lastFrame = timestamp;
      }
      renderer.draw(elapsed, reducedMotion.matches);
      if (playing) frameId = window.requestAnimationFrame(render);
    };

    const cancelFrame = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
    };

    const reconcile = () => {
      const shouldDraw = needsFrame();
      if (!shouldDraw || !isPlaying()) lastFrame = null;
      if (shouldDraw) {
        if (frameId === null) frameId = window.requestAnimationFrame(render);
      } else {
        cancelFrame();
      }
    };

    const invalidate = () => {
      dirty = true;
      reconcile();
    };

    const renderer = createGlobeRenderer(container, invalidate);
    if (!renderer) return undefined;

    const watchPixelRatio = () => {
      const query = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      query.addEventListener('change', watchPixelRatio, { once: true, signal });
      invalidate();
    };

    const handlePageTransition = (event) => {
      pageHidden = event.type === 'pagehide';
      if (!pageHidden) dirty = true;
      reconcile();
    };

    // Prepare the static layers as the section approaches, and animate only while it is visible.
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        nearViewport = entry.isIntersecting;
        reconcile();
      },
      { rootMargin: '320px' }
    );
    // A positive threshold catches the transition from touching the viewport to entering it.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.intersectionRatio > 0;
        reconcile();
      },
      { threshold: Number.EPSILON }
    );
    const resizeObserver = new ResizeObserver(invalidate);

    preloadObserver.observe(container);
    intersectionObserver.observe(container);
    resizeObserver.observe(container);
    watchPixelRatio();
    reducedMotion.addEventListener('change', invalidate, { signal });
    document.addEventListener('visibilitychange', reconcile, { signal });
    window.addEventListener('resize', invalidate, { signal });
    window.addEventListener('pagehide', handlePageTransition, { signal });
    window.addEventListener('pageshow', handlePageTransition, { signal });

    return () => {
      listeners.abort();
      cancelFrame();
      preloadObserver.disconnect();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      renderer.destroy();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-full w-full overflow-hidden bg-black-pure"
      ref={containerRef}
    />
  );
};

export default GlobeAnimation;
