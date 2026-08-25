'use client';

import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import cubicBezierEasing from 'utils/cubic-bezier-easing';

const IMAGE_ROOT = '/images/pages/home/scale-your-app';
const SCENE_WIDTH = 2154;
const SCENE_HEIGHT = 916;
const REVEAL_DURATION = 3600;
const revealEasing = cubicBezierEasing([0.645, 0.045, 0.355, 1]);

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

const UNIQUE_CARD_NAMES = [
  'vercel',
  'anything',
  'atoms',
  'encore',
  'laravel',
  'qwikbuild',
  'replit',
  'retool',
  'riff',
  'same',
  'specific',
  'v0',
  'vapi',
  'xpander',
  'zite',
  'strapi',
];

const CARD_NAMES = [...UNIQUE_CARD_NAMES.slice(-5), ...UNIQUE_CARD_NAMES];
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
          <Image
            className="absolute h-auto w-[15.3203%] max-w-[330px] select-none"
            style={{
              left: `${(left / SCENE_WIDTH) * 100}%`,
              top: `${(top / SCENE_HEIGHT) * 100}%`,
              visibility: index < visibleCardCount ? 'visible' : 'hidden',
            }}
            src={`${IMAGE_ROOT}/deploy-${CARD_NAMES[index]}.jpg`}
            width={660}
            height={504}
            quality={90}
            sizes="(max-width: 1023px) 172px, (max-width: 1919px) 17.2vw, 330px"
            alt=""
            key={`${CARD_NAMES[index]}-${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DeploymentCards;
