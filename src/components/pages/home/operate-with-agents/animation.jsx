'use client';

import {
  Alignment,
  Fit,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber,
} from '@rive-app/react-canvas';
import { domAnimation, LazyMotion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useRiveAnimation from 'hooks/use-rive-animation';
import { cn } from 'utils/cn';
import { createRiveFontLoader } from 'utils/rive-font-loader';

import Chat from './chat';

const VISUAL_WIDTH = 1184;
const VISUAL_HEIGHT = 878;
const RIVE_WIDTH = 704;
const RIVE_HEIGHT = 878;
const CHAT_WIDTH = 384;
const CHAT_HEIGHT = 788;
const MOBILE_VISUAL_GAP = 32;
const MOBILE_VIEWPORT_QUERY = '(max-width: 47.9375rem)';
const ANIMATION_DURATION = 15500;

const TIMELINE = [
  { at: 0, riveState: 1, visibleMessages: 0 },
  { at: 333, riveState: 1, visibleMessages: 1 },
  { at: 5833, riveState: 1, visibleMessages: 2 },
  { at: 7000, riveState: 2, visibleMessages: 2 },
  { at: 7167, riveState: 2, visibleMessages: 3 },
  { at: 10333, riveState: 2, visibleMessages: 4 },
  { at: 11833, riveState: 2, visibleMessages: 5 },
  { at: 12000, riveState: 3, visibleMessages: 5 },
  { at: 15000, riveState: 3, visibleMessages: 6 },
];

const FINAL_MESSAGE_COUNT = 6;
const RIVE_FONT_URL = '/fonts/pages/home/operate-with-agents/geist-mono.ttf';

const Animation = () => {
  const visualRef = useRef(null);
  const elapsedRef = useRef(0);
  const appliedTimelineIndexRef = useRef(-1);
  const appliedRiveStateRef = useRef(null);
  const hasCompletedRef = useRef(false);
  const [visualWidth, setVisualWidth] = useState(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const fontLoader = useMemo(() => createRiveFontLoader({ 'Geist Mono': RIVE_FONT_URL }), []);

  const {
    isReady,
    isLoaded,
    wrapperRef,
    animationRef,
    isIntersecting,
    isVisible,
    rive,
    RiveComponent,
  } = useRiveAnimation({
    src: '/animations/pages/home/branching-new.riv?20260821',
    artboard: 'main',
    stateMachines: 'SM',
    autoBind: true,
    fit: Fit.Contain,
    alignment: Alignment.Center,
    threshold: 0.2,
    assetLoader: fontLoader,
    managePlayback: false,
  });

  const viewModel = useViewModel(rive, { name: 'Main' });
  const viewModelInstance = useViewModelInstance(viewModel, { name: 'Instance', rive });
  const { setValue: setRiveState } = useViewModelInstanceNumber('state', viewModelInstance);

  const setVisualRef = useCallback(
    (node) => {
      visualRef.current = node;
      wrapperRef(node);
      animationRef(node);
    },
    [animationRef, wrapperRef]
  );

  useEffect(() => {
    const node = visualRef.current;
    if (!node) return undefined;

    const updateWidth = () => {
      const nextWidth = node.getBoundingClientRect().width;
      if (nextWidth <= 0) return;

      setVisualWidth((currentWidth) =>
        currentWidth !== null && Math.abs(currentWidth - nextWidth) < 1 ? currentWidth : nextWidth
      );
    };

    updateWidth();
    const animationFrame = window.requestAnimationFrame(updateWidth);
    window.addEventListener('resize', updateWidth);

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener('resize', updateWidth);
      };
    }

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(node);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', updateWidth);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_VIEWPORT_QUERY);
    const updateLayout = () => setIsMobileLayout(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener('change', updateLayout);

    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, []);

  useEffect(() => {
    if (!isLoaded || !viewModelInstance) {
      return undefined;
    }

    if (hasCompletedRef.current) {
      rive?.pause();
      return undefined;
    }

    if (!isVisible) {
      rive?.pause();
      return undefined;
    }

    if (shouldReduceMotion) {
      hasCompletedRef.current = true;
      appliedTimelineIndexRef.current = TIMELINE.length - 1;
      appliedRiveStateRef.current = 3;
      setTimelineIndex(TIMELINE.length - 1);
      setRiveState(3);
      rive?.play();

      const pauseTimer = window.setTimeout(() => rive?.pause(), 3000);
      return () => {
        window.clearTimeout(pauseTimer);
        rive?.pause();
      };
    }

    let previousFrameAt = performance.now();
    let animationFrame = null;

    const applyTimeline = (elapsed) => {
      let nextTimelineIndex = 0;

      for (let index = 1; index < TIMELINE.length; index += 1) {
        if (elapsed < TIMELINE[index].at) break;
        nextTimelineIndex = index;
      }

      if (nextTimelineIndex === appliedTimelineIndexRef.current) return;

      const nextStep = TIMELINE[nextTimelineIndex];
      appliedTimelineIndexRef.current = nextTimelineIndex;
      setTimelineIndex(nextTimelineIndex);

      if (nextStep.riveState !== appliedRiveStateRef.current) {
        appliedRiveStateRef.current = nextStep.riveState;
        setRiveState(nextStep.riveState);
      }
    };

    applyTimeline(elapsedRef.current);
    rive?.play();

    const updateTimeline = (now) => {
      elapsedRef.current = Math.min(
        elapsedRef.current + (now - previousFrameAt),
        ANIMATION_DURATION
      );
      previousFrameAt = now;
      applyTimeline(elapsedRef.current);

      if (elapsedRef.current >= ANIMATION_DURATION) {
        hasCompletedRef.current = true;
        rive?.pause();
        return;
      }

      animationFrame = window.requestAnimationFrame(updateTimeline);
    };

    animationFrame = window.requestAnimationFrame(updateTimeline);

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      rive?.pause();
    };
  }, [isLoaded, isVisible, rive, setRiveState, shouldReduceMotion, viewModelInstance]);

  const visibleMessages = shouldReduceMotion
    ? FINAL_MESSAGE_COUNT
    : TIMELINE[timelineIndex].visibleMessages;
  const measuredWidth = visualWidth ?? VISUAL_WIDTH;
  const desktopScale = Math.min(measuredWidth / VISUAL_WIDTH, 1);
  const riveScale = isMobileLayout ? Math.min(measuredWidth / RIVE_WIDTH, 1) : desktopScale;
  const chatScale = isMobileLayout ? Math.min(measuredWidth / CHAT_WIDTH, 1) : desktopScale;
  const riveLeft = isMobileLayout ? (measuredWidth - RIVE_WIDTH * riveScale) / 2 : desktopScale;
  const chatLeft = isMobileLayout
    ? (measuredWidth - CHAT_WIDTH * chatScale) / 2
    : 800 * desktopScale;
  const chatTop = isMobileLayout ? RIVE_HEIGHT * riveScale + MOBILE_VISUAL_GAP : 0;
  const visualHeight = isMobileLayout
    ? chatTop + CHAT_HEIGHT * chatScale
    : VISUAL_HEIGHT * desktopScale;

  return (
    <div
      className="relative w-full overflow-hidden"
      ref={setVisualRef}
      style={
        visualWidth === null
          ? { aspectRatio: `${VISUAL_WIDTH} / ${VISUAL_HEIGHT}` }
          : { height: visualHeight }
      }
      aria-hidden
    >
      <div
        className={cn(
          'absolute top-0 h-[878px] w-[704px] origin-top-left transition-opacity duration-300',
          isReady ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          left: riveLeft,
          transform: `scale(${riveScale})`,
        }}
      >
        {isIntersecting ? (
          <RiveComponent className="size-full [&_canvas]:h-full! [&_canvas]:w-full!" />
        ) : null}
      </div>

      <LazyMotion features={domAnimation}>
        <Chat
          className="absolute top-0 left-0 origin-top-left"
          style={{
            transform: `translate(${chatLeft}px, ${chatTop}px) scale(${chatScale})`,
          }}
          visibleMessages={visibleMessages}
          shouldReduceMotion={shouldReduceMotion}
        />
      </LazyMotion>
    </div>
  );
};

export default Animation;
