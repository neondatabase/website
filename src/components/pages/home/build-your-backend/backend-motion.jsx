'use client';

import { GeistSans } from 'geist/font/sans';
import { useEffect, useRef } from 'react';

import './motion/scene.css';

// The scene is drawn at 1280 × 694 and scaled to the width of the section.
const SCENE_WIDTH = 1280;

const BackendMotion = () => {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let stage = null;
    let frame = 0;
    let startedAt = 0;
    let isDisposed = false;
    let resizeObserver = null;
    let intersectionObserver = null;

    const fit = () => {
      if (stage) stage.el.style.transform = `scale(${host.clientWidth / SCENE_WIDTH})`;
    };

    const tick = (now) => {
      stage.render(((now - startedAt) / 1000) % stage.v.D);
      frame = requestAnimationFrame(tick);
    };

    import('./motion/scene-engine').then(({ Stage, VARS }) => {
      if (isDisposed) return;

      const scene = VARS[0];
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      stage = new Stage(scene, isReducedMotion);
      host.appendChild(stage.el);
      fit();
      resizeObserver = new ResizeObserver(fit);
      resizeObserver.observe(host);

      if (isReducedMotion) {
        stage.render(scene.stillT);
        return;
      }

      stage.render(0);
      // Plays only while the section is on screen, and starts over each time it comes back into view
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          cancelAnimationFrame(frame);
          if (!entry.isIntersecting) return;
          startedAt = performance.now();
          frame = requestAnimationFrame(tick);
        },
        { threshold: 0.25 }
      );
      intersectionObserver.observe(host);
    });

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      stage?.el.remove();
    };
  }, []);

  return (
    <div
      className={`${GeistSans.variable} relative mx-auto aspect-[1280/694] w-full max-w-[1920px] overflow-hidden bg-black-pure`}
      ref={hostRef}
      aria-hidden
    />
  );
};

export default BackendMotion;
