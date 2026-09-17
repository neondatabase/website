'use client';

import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { cn } from 'utils/cn';
import cubicBezierEasing from 'utils/cubic-bezier-easing';

const IMAGE_ROOT = '/images/pages/home/scale-your-app';
const SCENE_WIDTH = 2154;
const SCENE_HEIGHT = 916;
const REVEAL_DURATION = 2800;
const revealEasing = cubicBezierEasing([0.16, 0.68, 0.88, 0.54]);

const CARD_POSITIONS = [
  [1, 62],
  [14, 47],
  [32, 29],
  [51, 14],
  [76, 2],
  [101, 12],
  [129, 29],
  [163, 53],
  [204, 84],
  [252, 121],
  [306, 167],
  [370, 222],
  [443, 283],
  [522, 347],
  [608, 411],
  [717, 487],
  [852, 563],
  [1032, 627],
  [1266, 658],
  [1482, 615],
  [1686, 529],
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
  'reflex-dev',
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
const DRAG_ECHO_DURATION = 0.65;
const DRAG_ECHO_INTERVAL = 16;
const DRAG_ECHO_MIN_DISTANCE = 4;
const DRAG_ECHO_SPACING = 12;
const DRAG_ECHO_MAX_FRAMES = 5;
const CARD_COUNT = CARD_POSITIONS.length;

const getVisibleCardCount = (elapsed) => {
  const progress = Math.min(elapsed / REVEAL_DURATION, 1);

  if (progress >= 1) return CARD_COUNT;

  return 1 + Math.floor(revealEasing(progress) * (CARD_COUNT - 1));
};

const DeploymentCard = ({
  index,
  isDragging,
  isSettled,
  onDragEcho,
  onDragEnd,
  onDragStart,
  visibleCardCount,
  workspaceRef,
  zIndex,
}) => {
  const [left, top] = CARD_POSITIONS[index];
  const cardName = CARD_NAMES[index];
  const hoverLift = CARD_HOVER_LIFTS[index] ?? DEFAULT_CARD_HOVER_LIFT;
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const addDragEcho = (force = false) => {
    onDragEcho(index, dragX.get(), dragY.get(), force);
  };

  return (
    <motion.button
      className={cn(
        'group pointer-events-auto absolute aspect-[55/42] w-[15.3203%] max-w-[330px] cursor-grab appearance-none border-0 bg-transparent p-0 text-left hover:z-30 focus-visible:z-30 focus-visible:outline-2 focus-visible:outline-white active:cursor-grabbing',
        isDragging && 'cursor-grabbing'
      )}
      style={{
        left: `${(left / SCENE_WIDTH) * 100}%`,
        top: `${(top / SCENE_HEIGHT) * 100}%`,
        visibility: index < visibleCardCount ? 'visible' : 'hidden',
        x: dragX,
        y: dragY,
        zIndex,
        '--card-hover-lift': `-${hoverLift}%`,
      }}
      type="button"
      drag
      dragConstraints={workspaceRef}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={() => {
        onDragStart(index);
        addDragEcho(true);
      }}
      onDrag={() => addDragEcho()}
      onDragEnd={() => {
        addDragEcho(true);
        onDragEnd(index);
      }}
      aria-label={`Show ${cardName.replaceAll('-', ' ')} logo`}
    >
      <Image
        className={cn(
          'h-full w-full translate-y-[var(--card-current-lift)] select-none [--card-current-lift:0%] group-hover:[--card-current-lift:var(--card-hover-lift)] group-focus-visible:[--card-current-lift:var(--card-hover-lift)] motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.16,0.68,0.88,0.54)]',
          isSettled ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        src={`${IMAGE_ROOT}/deploy-${cardName}.jpg`}
        width={660}
        height={504}
        quality={90}
        sizes="(max-width: 1023px) 172px, (max-width: 1919px) 17.2vw, 330px"
        draggable={false}
        style={
          isSettled
            ? {
                '--card-current-lift': 'var(--card-hover-lift)',
              }
            : undefined
        }
        alt=""
      />
    </motion.button>
  );
};

DeploymentCard.propTypes = {
  index: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isSettled: PropTypes.bool.isRequired,
  onDragEcho: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  visibleCardCount: PropTypes.number.isRequired,
  workspaceRef: PropTypes.shape({ current: PropTypes.object }).isRequired,
  zIndex: PropTypes.number,
};

DeploymentCard.defaultProps = {
  zIndex: undefined,
};

const DeploymentCards = () => {
  const elapsedRef = useRef(0);
  const visibleCardCountRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const dragEchoIdRef = useRef(0);
  const lastDragEchoRef = useRef(null);
  const nextCardZIndexRef = useRef(40);
  const workspaceRef = useRef(null);
  const [visibleCardCount, setVisibleCardCount] = useState(0);
  const [draggedCardIndex, setDraggedCardIndex] = useState(null);
  const [cardZIndexes, setCardZIndexes] = useState({});
  const [settledCardIndexes, setSettledCardIndexes] = useState([]);
  const [dragEchoes, setDragEchoes] = useState([]);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { ref: inViewRef, inView } = useInView({ threshold: 0.2 });

  const setWorkspaceRef = useCallback(
    (node) => {
      workspaceRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

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

  const handleDragStart = (index) => {
    nextCardZIndexRef.current += 2;
    setDraggedCardIndex(index);
    setCardZIndexes((currentZIndexes) => ({
      ...currentZIndexes,
      [index]: nextCardZIndexRef.current,
    }));
  };

  const handleDragEcho = useCallback(
    (index, x, y, force = false) => {
      if (shouldReduceMotion) return;

      const now = performance.now();
      const previousEcho = lastDragEchoRef.current;
      const isSameCard = previousEcho?.index === index;
      const distance = isSameCard ? Math.hypot(x - previousEcho.x, y - previousEcho.y) : Infinity;

      if (
        !force &&
        (distance < DRAG_ECHO_MIN_DISTANCE ||
          now - (previousEcho?.createdAt ?? 0) < DRAG_ECHO_INTERVAL)
      ) {
        return;
      }

      const echoCount =
        force || !isSameCard
          ? 1
          : Math.min(DRAG_ECHO_MAX_FRAMES, Math.max(1, Math.ceil(distance / DRAG_ECHO_SPACING)));
      const directionX = isSameCard && distance > 0 ? (x - previousEcho.x) / distance : 0;
      const directionY = isSameCard && distance > 0 ? (y - previousEcho.y) / distance : 0;
      const nextEchoes = Array.from({ length: echoCount }, (_, echoIndex) => {
        const distanceFromCurrent = Math.min(
          distance,
          (echoCount - echoIndex - 1) * DRAG_ECHO_SPACING
        );

        return {
          id: dragEchoIdRef.current + echoIndex,
          index,
          x: x - directionX * distanceFromCurrent,
          y: y - directionY * distanceFromCurrent,
          zIndex: nextCardZIndexRef.current - 1,
        };
      });

      dragEchoIdRef.current += echoCount;
      lastDragEchoRef.current = { index, x, y, createdAt: now };
      setDragEchoes((currentEchoes) =>
        [...currentEchoes, ...nextEchoes].slice(-DRAG_ECHO_MAX_FRAMES)
      );
    },
    [shouldReduceMotion]
  );

  const removeDragEcho = useCallback((echoId) => {
    setDragEchoes((currentEchoes) => currentEchoes.filter(({ id }) => id !== echoId));
  }, []);

  const handleDragEnd = (index) => {
    setDraggedCardIndex(null);
    setSettledCardIndexes((currentIndexes) =>
      currentIndexes.includes(index) ? currentIndexes : [...currentIndexes, index]
    );
  };

  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-[1920px] -translate-x-1/2"
      ref={setWorkspaceRef}
    >
      <div className="absolute top-0 left-0 aspect-[2154/916] w-[112.1875%] origin-top-left lg:top-10 lg:left-1/2 lg:min-w-[1120px] lg:-translate-x-3/5 md:min-w-[960px]">
        {dragEchoes.map(({ id, index, x, y, zIndex }) => {
          const [left, top] = CARD_POSITIONS[index];
          const cardName = CARD_NAMES[index];
          const hoverLift = CARD_HOVER_LIFTS[index] ?? DEFAULT_CARD_HOVER_LIFT;

          return (
            <motion.span
              className="pointer-events-none absolute aspect-[55/42] w-[15.3203%] max-w-[330px]"
              style={{
                left: `${(left / SCENE_WIDTH) * 100}%`,
                top: `${(top / SCENE_HEIGHT) * 100}%`,
                x,
                y,
                zIndex,
                '--card-echo-lift': `-${hoverLift}%`,
              }}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.42, 0.18, 0] }}
              transition={{
                duration: DRAG_ECHO_DURATION,
                ease: 'linear',
                times: [0, 0.28, 0.62, 1],
              }}
              onAnimationComplete={() => removeDragEcho(id)}
              aria-hidden="true"
              key={id}
            >
              <Image
                className="h-full w-full translate-y-[var(--card-echo-lift)] select-none"
                src={`${IMAGE_ROOT}/deploy-${cardName}.jpg`}
                width={660}
                height={504}
                quality={90}
                sizes="(max-width: 1023px) 172px, (max-width: 1919px) 17.2vw, 330px"
                draggable={false}
                alt=""
              />
            </motion.span>
          );
        })}
        {CARD_POSITIONS.map((_, index) => {
          const isDragging = draggedCardIndex === index;
          const isSettled = settledCardIndexes.includes(index);

          return (
            <DeploymentCard
              index={index}
              isDragging={isDragging}
              isSettled={isSettled}
              onDragEcho={handleDragEcho}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              visibleCardCount={visibleCardCount}
              workspaceRef={workspaceRef}
              zIndex={cardZIndexes[index]}
              key={CARD_NAMES[index]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DeploymentCards;
