'use client';

import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import cubicBezierEasing from 'utils/cubic-bezier-easing';

const IMAGE_ROOT = '/images/pages/home/scale-your-app';
const SCENE_WIDTH = 2154;
const SCENE_HEIGHT = 916;
const REVEAL_DURATION = 2800;
const revealEasing = cubicBezierEasing([0.16, 0.68, 0.88, 0.54]);

const CARD_POSITIONS = [
  [1, 62],
  [15, 46],
  [34, 27],
  [54, 12],
  [81, 0],
  [107, 16],
  [138, 34],
  [175, 62],
  [222, 98],
  [274, 138],
  [336, 193],
  [407, 253],
  [491, 324],
  [572, 385],
  [679, 463],
  [811, 546],
  [985, 618],
  [1234, 664],
  [1461, 623],
  [1679, 538],
  [1824, 348],
];

const CARD_NAMES = [
  'same-new',
  'zite-com',
  'vapi',
  'vercel',
  'qwikbuild-com',
  'specific-dev',
  'riff-ai',
  'xpander-ai',
  'atoms-dev',
  'layers-com',
  'encore-dev',
  'cognee-ai',
  'konghq-com',
  'glideapps-com',
  'retool-com',
  'anything-com',
  'laravel-com',
  'replit-com',
  'netlify-com',
  'v0-app',
  'strapi-io',
];

const CARD_HOVER_LIFTS = [44, 38, 30, 24, 20];
const DEFAULT_CARD_HOVER_LIFT = 20;
const CARD_COUNT = CARD_POSITIONS.length;

const getVisibleCardCount = (elapsed) => {
  const progress = Math.min(elapsed / REVEAL_DURATION, 1);

  if (progress >= 1) return CARD_COUNT;

  return 1 + Math.floor(revealEasing(progress) * (CARD_COUNT - 1));
};

const DeploymentCards = () => {
  const elapsedRef = useRef(0);
  const visibleCardCountRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const [visibleCardCount, setVisibleCardCount] = useState(0);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { ref, inView } = useInView({ threshold: 0.2 });

  useEffect(() => {
    const updateDocumentVisibility = () => {
      setIsDocumentVisible(document.visibilityState !== 'hidden');
    };

    updateDocumentVisibility();
    document.addEventListener('visibilitychange', updateDocumentVisibility);

    return () => document.removeEventListener('visibilitychange', updateDocumentVisibility);
  }, []);

  useEffect(() => {
    const showCardsThrough = (elapsed) => {
      const nextVisibleCardCount = getVisibleCardCount(elapsed);

      if (nextVisibleCardCount === visibleCardCountRef.current) return;

      visibleCardCountRef.current = nextVisibleCardCount;
      setVisibleCardCount(nextVisibleCardCount);
    };

    if (shouldReduceMotion) {
      elapsedRef.current = REVEAL_DURATION;
      visibleCardCountRef.current = CARD_COUNT;
      hasCompletedRef.current = true;
      setVisibleCardCount(CARD_COUNT);
      return undefined;
    }

    if (!inView || !isDocumentVisible || hasCompletedRef.current) return undefined;

    let animationFrame = null;
    let previousFrameAt = performance.now();

    showCardsThrough(elapsedRef.current);

    const update = (now) => {
      elapsedRef.current = Math.min(elapsedRef.current + (now - previousFrameAt), REVEAL_DURATION);
      previousFrameAt = now;
      showCardsThrough(elapsedRef.current);

      if (elapsedRef.current >= REVEAL_DURATION) {
        hasCompletedRef.current = true;
        return;
      }

      animationFrame = window.requestAnimationFrame(update);
    };

    animationFrame = window.requestAnimationFrame(update);

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, [inView, isDocumentVisible, shouldReduceMotion]);

  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-[1920px] -translate-x-1/2"
      ref={ref}
      aria-hidden="true"
    >
      <div className="absolute top-0 left-0 aspect-[2154/916] w-[112.1875%] origin-top-left lg:top-10 lg:left-1/2 lg:min-w-[1120px] lg:-translate-x-3/5 md:min-w-[960px]">
        {CARD_POSITIONS.map(([left, top], index) => (
          <div
            className="group pointer-events-auto absolute aspect-[55/42] w-[15.3203%] max-w-[330px]"
            style={{
              left: `${(left / SCENE_WIDTH) * 100}%`,
              top: `${(top / SCENE_HEIGHT) * 100}%`,
              visibility: index < visibleCardCount ? 'visible' : 'hidden',
              '--card-hover-lift': `-${CARD_HOVER_LIFTS[index] ?? DEFAULT_CARD_HOVER_LIFT}%`,
            }}
            key={CARD_NAMES[index]}
          >
            <Image
              className="pointer-events-none h-full w-full select-none motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.16,0.68,0.88,0.54)] motion-safe:group-hover:translate-y-[var(--card-hover-lift)]"
              src={`${IMAGE_ROOT}/deploy-${CARD_NAMES[index]}.jpg`}
              width={660}
              height={504}
              quality={90}
              sizes="(max-width: 1023px) 172px, (max-width: 1919px) 17.2vw, 330px"
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeploymentCards;
