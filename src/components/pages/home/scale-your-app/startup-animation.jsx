'use client';

import { domAnimation, LazyMotion, m, useMotionValue, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { cn } from 'utils/cn';

const ASSET_ROOT = '/images/pages/home/scale-your-app';
const CARD_REVEAL_DURATION = 450;
const PROGRESS_COMPLETE_START = 6100;
const FINAL_STATE_START = PROGRESS_COMPLETE_START + 800;
const STAT_REVEAL_START = FINAL_STATE_START + 1000;
const ANIMATION_DURATION = STAT_REVEAL_START + CARD_REVEAL_DURATION;

const TIMELINE = [
  { at: 0, screen: 'create', isCreatePressed: false },
  { at: 1600, screen: 'create', isCreatePressed: true },
  { at: 1770, screen: 'create', isCreatePressed: false },
  { at: 1900, screen: 'progress', progress: 0, filledBlocks: 0, status: 'creating' },
  { at: 2160, screen: 'progress', progress: 7, filledBlocks: 1, status: 'creating' },
  { at: 2400, screen: 'progress', progress: 13, filledBlocks: 2, status: 'creating' },
  { at: 2780, screen: 'progress', progress: 21, filledBlocks: 3, status: 'creating' },
  { at: 3020, screen: 'progress', progress: 34, filledBlocks: 5, status: 'creating' },
  { at: 3460, screen: 'progress', progress: 45, filledBlocks: 8, status: 'preparing' },
  { at: 3740, screen: 'progress', progress: 61, filledBlocks: 9, status: 'preparing' },
  { at: 4260, screen: 'progress', progress: 72, filledBlocks: 11, status: 'preparing' },
  { at: 4520, screen: 'progress', progress: 84, filledBlocks: 13, status: 'preparing' },
  { at: 5300, screen: 'progress', progress: 92, filledBlocks: 14, status: 'preparing' },
  {
    at: PROGRESS_COMPLETE_START,
    screen: 'progress',
    progress: 100,
    filledBlocks: 15,
    status: 'preparing',
  },
  {
    at: FINAL_STATE_START,
    screen: 'progress',
    progress: 100,
    filledBlocks: 15,
    status: 'complete',
  },
];

const FINAL_FRAME_INDEX = TIMELINE.length - 1;

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const easeOutQuart = (progress) => 1 - (1 - progress) ** 4;

const getTimelineIndex = (elapsed) => {
  let index = 0;

  for (let nextIndex = 1; nextIndex < TIMELINE.length; nextIndex += 1) {
    if (elapsed < TIMELINE[nextIndex].at) break;
    index = nextIndex;
  }

  return index;
};

const getRevealProgress = (elapsed, startsAt) =>
  easeOutQuart(clamp((elapsed - startsAt) / CARD_REVEAL_DURATION));

const InitializationNoise = ({ asset }) => (
  <span
    className="pointer-events-none absolute -top-[6.9364%] -left-[7.2682%] z-20 h-[123.6994%] w-[134.5865%] select-none"
    style={{
      WebkitMaskImage: `url(${ASSET_ROOT}/startup-card-noise-mask.png)`,
      WebkitMaskPosition: '21.0145% 29.2683%',
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskSize: '74.3017% 80.8411%',
      maskImage: `url(${ASSET_ROOT}/startup-card-noise-mask.png)`,
      maskMode: 'alpha',
      maskPosition: '21.0145% 29.2683%',
      maskRepeat: 'no-repeat',
      maskSize: '74.3017% 80.8411%',
    }}
    aria-hidden="true"
  >
    <span className="absolute inset-[-71.96%_-28.68%]">
      <Image
        className="block size-full max-w-none"
        src={`${ASSET_ROOT}/${asset}`}
        width={845}
        height={522}
        sizes="845px"
        alt=""
      />
    </span>
  </span>
);

InitializationNoise.propTypes = {
  asset: PropTypes.oneOf(['startup-card-noise.svg', 'startup-card-noise-progress.svg']).isRequired,
};

const CheckSquare = ({ checked }) => (
  <span
    className={cn(
      'relative size-3.5 shrink-0 border',
      checked ? 'border-[#94979e]' : 'border-[#494b50]'
    )}
    aria-hidden="true"
  >
    {checked ? <span className="absolute inset-[3px] bg-[#94979e]" /> : null}
  </span>
);

CheckSquare.propTypes = {
  checked: PropTypes.bool.isRequired,
};

const CreateProject = ({ isPressed }) => (
  <div className="absolute inset-0 border-2 border-[#61646b] bg-black-pure p-[3px]">
    <div className="relative flex h-[37px] items-center bg-[#303236] px-3 text-base font-semibold text-white md:h-8 md:text-sm">
      Neon project
      <Image
        className="absolute top-1/2 right-2 size-[18px] -translate-y-1/2"
        src={`${ASSET_ROOT}/startup-window-control.svg`}
        width={18}
        height={18}
        sizes="18px"
        alt=""
      />
    </div>
    <div className="flex flex-col items-center gap-5 pt-[29px] md:gap-4 md:pt-5">
      <p className="text-center text-base leading-none font-semibold text-white md:text-sm">
        No projects yet. Create project?
      </p>
      <div className="flex items-start gap-5 text-base leading-none font-semibold md:text-sm">
        <span
          className={cn(
            'flex h-9 items-center justify-center px-4 text-black',
            isPressed ? 'bg-[#94979e]' : 'bg-white'
          )}
        >
          Create
        </span>
        <span className="flex h-9 items-center justify-center border-2 border-[#94979e] px-4 text-[#94979e]">
          Cancel
        </span>
      </div>
    </div>
  </div>
);

CreateProject.propTypes = {
  isPressed: PropTypes.bool.isRequired,
};

const ProgressRow = ({ checked, children }) => (
  <span className="flex items-center gap-[7px]">
    <CheckSquare checked={checked} />
    {children}
  </span>
);

ProgressRow.propTypes = {
  checked: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

const InitializationProgress = ({ filledBlocks, progress, status }) => {
  const isPreparing = status === 'preparing';
  const isComplete = status === 'complete';

  return (
    <div className="absolute inset-0 border-2 border-[#61646b] bg-black-pure p-[3px]">
      <div className="flex h-[37px] items-center bg-[#303236] px-3 text-base font-semibold text-white md:h-8 md:text-sm">
        {isComplete ? 'Initialization complete' : 'Initializing...'}
      </div>
      <div className="px-2 pt-[19px] md:pt-3.5">
        <div className="flex items-center gap-4">
          <div className="grid h-[30px] flex-1 grid-cols-[repeat(15,minmax(0,1fr))] gap-1 border-2 border-[#61646b] p-[2px]">
            {Array.from({ length: 15 }, (_, index) => (
              <span
                className={index < filledBlocks ? 'bg-[#e4e5e7]' : 'bg-[#303236]'}
                key={index}
              />
            ))}
          </div>
          <span className="w-12 text-right text-xl leading-none font-medium text-[#e4e5e7] tabular-nums">
            {progress}%
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-base leading-dense font-medium tracking-[-0.02em] text-[#94979e] md:mt-3 md:text-sm">
          {isPreparing || isComplete ? (
            <>
              <ProgressRow checked>Project created</ProgressRow>
              <ProgressRow checked={isComplete}>
                {isComplete ? 'Database ready' : 'Preparing database...'}
              </ProgressRow>
            </>
          ) : (
            <ProgressRow checked={false}>Creating project...</ProgressRow>
          )}
        </div>
      </div>
    </div>
  );
};

InitializationProgress.propTypes = {
  filledBlocks: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['creating', 'preparing', 'complete']).isRequired,
};

const StartupAnimation = () => {
  const elapsedRef = useRef(0);
  const frameIndexRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const rightCardOpacity = useMotionValue(0);
  const rightCardY = useMotionValue(12);
  const statCardOpacity = useMotionValue(0);
  const statCardY = useMotionValue(12);
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
    const applyElapsed = (elapsed) => {
      const nextFrameIndex = getTimelineIndex(elapsed);
      const rightReveal = getRevealProgress(elapsed, 0);
      const statReveal = getRevealProgress(elapsed, STAT_REVEAL_START);

      rightCardOpacity.set(rightReveal);
      rightCardY.set(12 * (1 - rightReveal));
      statCardOpacity.set(statReveal);
      statCardY.set(12 * (1 - statReveal));

      if (nextFrameIndex !== frameIndexRef.current) {
        frameIndexRef.current = nextFrameIndex;
        setFrameIndex(nextFrameIndex);
      }
    };

    if (shouldReduceMotion) {
      elapsedRef.current = ANIMATION_DURATION;
      frameIndexRef.current = FINAL_FRAME_INDEX;
      hasCompletedRef.current = true;
      setFrameIndex(FINAL_FRAME_INDEX);
      applyElapsed(ANIMATION_DURATION);
      return undefined;
    }

    if (!inView || !isDocumentVisible || hasCompletedRef.current) return undefined;

    let animationFrame = null;
    let previousFrameAt = performance.now();

    const update = (now) => {
      elapsedRef.current = Math.min(
        elapsedRef.current + (now - previousFrameAt),
        ANIMATION_DURATION
      );
      previousFrameAt = now;
      applyElapsed(elapsedRef.current);

      if (elapsedRef.current >= ANIMATION_DURATION) {
        hasCompletedRef.current = true;
        return;
      }

      animationFrame = window.requestAnimationFrame(update);
    };

    applyElapsed(elapsedRef.current);
    animationFrame = window.requestAnimationFrame(update);

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, [
    inView,
    isDocumentVisible,
    rightCardOpacity,
    rightCardY,
    shouldReduceMotion,
    statCardOpacity,
    statCardY,
  ]);

  const frame = shouldReduceMotion ? TIMELINE[FINAL_FRAME_INDEX] : TIMELINE[frameIndex];

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <span
        className="absolute top-[229px] left-0 h-[380px] w-full lg:top-[250px] lg:h-[388px] md:top-[230px] md:h-[408px] sm:top-[219px] sm:h-[414px]"
        ref={ref}
        aria-hidden="true"
      />
      <LazyMotion features={domAnimation}>
        <m.div
          className="absolute top-[229px] left-[607px] z-10 h-[173px] w-[398px] font-mono text-[#94979e] will-change-transform 2xl:right-0 2xl:left-auto lg:top-[250px] lg:right-0 md:top-[230px] md:h-[160px] md:w-[360px] sm:top-[219px] sm:right-auto sm:left-0 sm:w-full"
          style={{
            opacity: shouldReduceMotion ? 1 : rightCardOpacity,
            y: shouldReduceMotion ? 0 : rightCardY,
          }}
          role="img"
          aria-label="A Neon project initializes and reaches 100 percent"
        >
          {frame.screen === 'create' ? (
            <CreateProject isPressed={frame.isCreatePressed} />
          ) : (
            <InitializationProgress
              filledBlocks={frame.filledBlocks}
              progress={frame.progress}
              status={frame.status}
            />
          )}
          <InitializationNoise
            asset={
              frame.screen === 'progress' && frame.status === 'complete'
                ? 'startup-card-noise.svg'
                : 'startup-card-noise-progress.svg'
            }
          />
        </m.div>

        <m.div
          className="absolute top-[361px] left-0 z-10 h-[248px] w-[511px] border border-[#242628] bg-black-pure px-8 pt-8 will-change-transform lg:top-[390px] md:w-[480px] sm:top-[407px] sm:h-[226px] sm:w-full sm:px-5 sm:pt-5"
          style={{
            opacity: shouldReduceMotion ? 1 : statCardOpacity,
            y: shouldReduceMotion ? 0 : statCardY,
          }}
        >
          <strong className="block text-[5rem] leading-none font-normal tracking-extra-tight text-white sm:text-[4rem]">
            100K+
          </strong>
          <p className="mt-[29px] max-w-[320px] text-xl leading-tight tracking-extra-tight text-gray-new-80 sm:mt-5 sm:max-w-[290px] sm:text-base">
            Projects built and launched with Neon, from early-stage products to growing
            applications.
          </p>
        </m.div>
      </LazyMotion>
    </div>
  );
};

export default StartupAnimation;
