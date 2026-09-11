'use client';

import {
  Alignment,
  Fit,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber,
} from '@rive-app/react-canvas';
import { cubicBezier, domAnimation, LazyMotion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import useRiveAnimation from 'hooks/use-rive-animation';
import { cn } from 'utils/cn';
import { createRiveFontLoader } from 'utils/rive-font-loader';

import Chat, { CHAT_PROMPTS } from './chat';

const VISUAL_WIDTH = 1184;
const VISUAL_HEIGHT = 878;
const RIVE_WIDTH = 704;
const RIVE_HEIGHT = 878;
const CHAT_WIDTH = 384;
const MOBILE_CHAT_HEIGHT = 295;
const MOBILE_VISUAL_GAP = 32;
const MOBILE_VIEWPORT_QUERY = '(max-width: 47.9375rem)';
const PRE_SEND_PAUSE_DURATION = 100;
const MESSAGE_REVEAL_DURATION = 250;
const PAUSE_DURATION = 1000;
const RESULT_PAUSE_DURATION = 600;
const TYPING_EASE = cubicBezier(0.2, 0.07, 0.3, 1);

const PROMPT_STEPS = [
  { prompt: CHAT_PROMPTS[0], typeDuration: 0, riveState: 1, riveDuration: 5000 },
  { prompt: CHAT_PROMPTS[1], typeDuration: 900, riveState: 2, riveDuration: 2500 },
  { prompt: CHAT_PROMPTS[2], typeDuration: 1000, riveState: 3, riveDuration: 3000 },
];

const buildAnimationSequence = () => {
  const timeline = [
    { at: 0, riveState: 0, visibleMessages: 0 },
    { at: 0, riveState: 0, visibleMessages: 1 },
  ];
  const typingWindows = [];
  let elapsed = 0;
  let currentRiveState = 0;

  PROMPT_STEPS.forEach(({ prompt, typeDuration, riveState, riveDuration }, index) => {
    if (typeDuration > 0) {
      const typingStartsAt = elapsed;
      const typingEndsAt = typingStartsAt + typeDuration;
      const sendEndsAt = typingEndsAt + PRE_SEND_PAUSE_DURATION;

      typingWindows.push({ prompt, startsAt: typingStartsAt, typingEndsAt, sendEndsAt });

      elapsed = sendEndsAt;
      timeline.push({ at: elapsed, riveState: currentRiveState, visibleMessages: index * 2 + 1 });
    }

    elapsed += MESSAGE_REVEAL_DURATION + PAUSE_DURATION;
    currentRiveState = riveState;
    timeline.push({ at: elapsed, riveState, visibleMessages: index * 2 + 1 });

    elapsed += riveDuration;
    timeline.push({ at: elapsed, riveState, visibleMessages: index * 2 + 2 });

    elapsed += MESSAGE_REVEAL_DURATION;
    if (index < PROMPT_STEPS.length - 1) {
      elapsed += RESULT_PAUSE_DURATION;
    }
  });

  return { duration: elapsed, timeline, typingWindows };
};

const ANIMATION_SEQUENCE = buildAnimationSequence();
const ANIMATION_DURATION = ANIMATION_SEQUENCE.duration;

const { timeline: TIMELINE, typingWindows: TYPING_WINDOWS } = ANIMATION_SEQUENCE;

const getComposerText = (elapsed) => {
  const typingWindow = TYPING_WINDOWS.find(
    ({ startsAt, sendEndsAt }) => elapsed >= startsAt && elapsed < sendEndsAt
  );

  if (!typingWindow) return '';

  const { prompt, startsAt, typingEndsAt } = typingWindow;
  if (elapsed >= typingEndsAt) return prompt;

  const progress = (elapsed - startsAt) / (typingEndsAt - startsAt);
  return prompt.slice(0, Math.floor(TYPING_EASE(progress) * prompt.length));
};

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
  const [composerText, setComposerText] = useState('');
  const [chatVisibilityRef, isChatVisible] = useInView({ threshold: 0.3, triggerOnce: true });
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
    threshold: 0.1,
    rootMargin: '2000px 0px',
    visibilityRootMargin: '250px 0px',
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
      if (elapsedRef.current === 0) {
        if (appliedRiveStateRef.current !== 0) {
          appliedRiveStateRef.current = 0;
          setRiveState(0);
        }

        rive?.play();
        return () => rive?.pause();
      }

      rive?.pause();
      return undefined;
    }

    if (shouldReduceMotion) {
      hasCompletedRef.current = true;
      appliedTimelineIndexRef.current = TIMELINE.length - 1;
      appliedRiveStateRef.current = 3;
      setTimelineIndex(TIMELINE.length - 1);
      setComposerText('');
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
      const nextComposerText = getComposerText(elapsed);
      setComposerText((currentText) =>
        currentText === nextComposerText ? currentText : nextComposerText
      );

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

  const timelineVisibleMessages = shouldReduceMotion
    ? FINAL_MESSAGE_COUNT
    : TIMELINE[timelineIndex].visibleMessages;
  const visibleMessages = isChatVisible ? timelineVisibleMessages : 0;
  const isThinking = visibleMessages > 0 && visibleMessages % 2 === 1;
  const measuredWidth = visualWidth ?? VISUAL_WIDTH;
  const desktopScale = Math.min(measuredWidth / VISUAL_WIDTH, 1);
  const riveScale = isMobileLayout ? Math.min(measuredWidth / RIVE_WIDTH, 1) : desktopScale;
  const chatScale = isMobileLayout ? Math.min(measuredWidth / CHAT_WIDTH, 1) : desktopScale;
  const riveLeft = isMobileLayout ? (measuredWidth - RIVE_WIDTH * riveScale) / 2 : desktopScale;
  const chatLeft = isMobileLayout
    ? (measuredWidth - CHAT_WIDTH * chatScale) / 2
    : 800 * desktopScale;
  const chatTop = 0;
  const riveTop = isMobileLayout ? MOBILE_CHAT_HEIGHT * chatScale + MOBILE_VISUAL_GAP : 0;
  const visualHeight = isMobileLayout
    ? riveTop + RIVE_HEIGHT * riveScale
    : VISUAL_HEIGHT * desktopScale;

  return (
    <div
      className="relative w-full overflow-hidden md:mx-auto md:mt-8 md:max-w-sm"
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
          'absolute top-0 h-[878px] w-[704px] origin-top-left transition-opacity duration-150',
          isReady ? 'opacity-100' : 'opacity-0'
        )}
        data-operate-rive
        style={{
          left: riveLeft,
          transform: `translateY(${riveTop}px) scale(${riveScale})`,
        }}
      >
        {isIntersecting ? (
          <RiveComponent className="size-full [&_canvas]:h-full! [&_canvas]:w-full!" />
        ) : null}
      </div>

      <LazyMotion features={domAnimation}>
        <Chat
          className="absolute top-0 left-0 origin-top-left"
          chatRef={chatVisibilityRef}
          composerText={composerText}
          isCompact={isMobileLayout}
          isThinking={isThinking}
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
