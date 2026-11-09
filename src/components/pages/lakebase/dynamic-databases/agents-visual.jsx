'use client';

import { LazyMotion, domAnimation, m, useInView, useReducedMotion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

import { cn } from 'utils/cn';

const CARD_EASE = [0.16, 1, 0.3, 1];
const LINE_EASE = [0.22, 0.8, 0.3, 1];
const TRUNK_DELAY = 0.08;
const TRUNK_DURATION = 0.28;
const BRANCH_DELAY = TRUNK_DELAY + TRUNK_DURATION + 0.02;
const BRANCH_DURATION = 0.56;
const BRANCH_STAGGER = 0.2;
const CARD_DURATION = 0.28;
const MOBILE_SCENE_LEFT = 92;
const MOBILE_SCENE_MEDIA_QUERY = '(max-width: 639px)';
const MOBILE_SCENE_WIDTH = 940;
const SCENE_WIDTH = 1184;
const ENVIRONMENT_TOPS = [
  'top-[39px] sm:top-[31px]',
  'top-[191px] sm:top-[183px]',
  'top-[343px] sm:top-[335px]',
];

const DESKTOP_CONNECTOR_PATHS = [
  { d: 'M428 251H479', type: 'trunk' },
  {
    d: 'M479 251C507.064 251 532.758 235.262 545.509 210.262L579.995 142.651C593.658 115.863 621.189 99 651.26 99H700',
    revealIndex: 0,
    type: 'branch',
  },
  {
    d: 'M479 251H700',
    revealIndex: 1,
    type: 'branch',
  },
  {
    d: 'M479 251C507.064 251 532.758 266.738 545.509 291.738L579.995 359.349C593.658 386.137 621.189 403 651.26 403H700',
    revealIndex: 2,
    type: 'branch',
  },
];

const MOBILE_CONNECTOR_PATHS = [
  { d: 'M477 251H510', type: 'trunk' },
  {
    d: 'M510 251C528.287 251 545.031 235.262 553.338 210.262L575.813 142.651C584.699 115.863 602.651 99 622.236 99H654',
    revealIndex: 0,
    type: 'branch',
  },
  {
    d: 'M510 251H654',
    revealIndex: 1,
    type: 'branch',
  },
  {
    d: 'M510 251C528.287 251 545.031 266.738 553.338 291.738L575.813 359.349C584.699 386.137 602.651 403 622.236 403H654',
    revealIndex: 2,
    type: 'branch',
  },
];

const ENVIRONMENTS = [
  {
    name: 'checkout-agent',
    status: 'Running',
    statusClassName: 'text-[#FFCC66]',
    dotClassName: 'bg-[#FFCC66]',
    items: [
      { label: '12 files changed', complete: true },
      { label: '6 tests running...', complete: false },
    ],
  },
  {
    name: 'search-session',
    status: 'Testing',
    statusClassName: 'text-[#888888]',
    dotClassName: 'bg-[#888888]',
    items: [
      { label: '4 files changed', complete: true },
      { label: '2 / 3 checks passed...', complete: false },
    ],
  },
  {
    name: 'migrate-customers',
    status: 'Active',
    statusClassName: 'text-green-52',
    dotClassName: 'bg-green-52',
    items: [
      { label: '7 queries executed', complete: true },
      { label: '2 migrations completed', complete: true },
    ],
  },
];

const getEnvironmentCardMotion = ({ isAnimationActive, prefersReducedMotion, revealIndex }) => {
  if (prefersReducedMotion) {
    return {
      initial: false,
      animate: { opacity: 1, scale: 1, x: 0 },
    };
  }

  const hidden = { opacity: 0, scale: 0.99, x: -18 };

  if (!isAnimationActive) {
    return {
      initial: hidden,
      animate: hidden,
      transition: { duration: 0.2 },
    };
  }

  return {
    initial: hidden,
    animate: { opacity: 1, scale: 1, x: 0 },
    transition: {
      delay: BRANCH_DELAY + revealIndex * BRANCH_STAGGER + BRANCH_DURATION,
      duration: CARD_DURATION,
      ease: CARD_EASE,
    },
  };
};

const getPathMotion = ({ isAnimationActive, prefersReducedMotion, revealIndex = 0, type }) => {
  if (prefersReducedMotion) {
    return {
      initial: false,
      animate: { opacity: 1, pathLength: 1 },
    };
  }

  if (!isAnimationActive) {
    return {
      initial: { opacity: 0, pathLength: 0 },
      animate: { opacity: 0, pathLength: 0 },
      transition: { duration: 0.2 },
    };
  }

  return {
    initial: { opacity: 0, pathLength: 0 },
    animate: { opacity: 1, pathLength: 1 },
    transition: {
      delay: type === 'trunk' ? TRUNK_DELAY : BRANCH_DELAY + revealIndex * BRANCH_STAGGER,
      duration: type === 'trunk' ? TRUNK_DURATION : BRANCH_DURATION,
      ease: LINE_EASE,
    },
  };
};

const DatabaseRow = ({ label, value }) => (
  <span className="flex items-center justify-between gap-x-4 text-[13px] leading-[1.375] tracking-[-0.02em] text-white">
    <span>{label}</span>
    <span>{value}</span>
  </span>
);

const ProductionCard = ({ className }) => (
  <article className={cn('h-[227px] w-[324px] border border-gray-new-15 bg-gray-new-8', className)}>
    <h4 className="flex h-[45px] items-center border-b border-gray-new-15 px-[15px] text-base leading-[1.375] tracking-[-0.025em] text-gray-new-80">
      customer-platform-production
    </h4>
    <div className="px-[15px] pt-3">
      <div className="flex flex-col gap-y-2">
        <span className="text-[11px] leading-[1.375] tracking-[-0.02em] text-gray-new-40">
          DATABASE
        </span>
        <DatabaseRow label="storage" value="2.4 TB" />
        <DatabaseRow label="queries/s" value="1,284" />
        <DatabaseRow label="connections" value="184" />
      </div>
      <div className="mt-[17px] flex flex-col gap-y-2">
        <span className="text-[11px] leading-[1.375] tracking-[-0.02em] text-gray-new-40">
          ENVIRONMENTS
        </span>
        <DatabaseRow label="active" value="3" />
      </div>
    </div>
  </article>
);

const EnvironmentCard = ({
  className,
  environment,
  isAnimationActive,
  prefersReducedMotion,
  revealIndex,
}) => (
  <m.article
    className={cn('h-[119px] w-[320px] border border-gray-new-15 bg-gray-new-8', className)}
    {...getEnvironmentCardMotion({ isAnimationActive, prefersReducedMotion, revealIndex })}
  >
    <div className="flex h-[45px] items-center justify-between gap-x-3 border-b border-gray-new-15 px-[15px]">
      <h4 className="min-w-0 truncate text-base leading-[1.375] tracking-[-0.025em] text-gray-new-80">
        {environment.name}
      </h4>
      <span
        className={cn(
          'flex shrink-0 items-center gap-x-2 bg-gray-new-15 px-1.5 py-[5px] text-xs leading-none tracking-[-0.02em]',
          environment.statusClassName
        )}
      >
        <span
          className={cn('size-[5px] rounded-full', environment.dotClassName)}
          aria-hidden="true"
        />
        {environment.status}
      </span>
    </div>
    <ul className="flex flex-col gap-y-2 px-[15px] pt-3">
      {environment.items.map(({ label, complete }) => (
        <li
          className="flex items-center gap-x-1.5 text-[13px] leading-[1.375] tracking-[-0.02em] text-white"
          key={label}
        >
          <span
            className="grid size-3 shrink-0 place-items-center border border-gray-new-60"
            aria-hidden
          >
            {complete ? <span className="size-1.5 bg-gray-new-60" /> : null}
          </span>
          {label}
        </li>
      ))}
    </ul>
  </m.article>
);

const Connector = ({ isAnimationActive, prefersReducedMotion }) => {
  const renderPaths = (paths) =>
    paths.map(({ d, revealIndex, type }) => (
      <m.path
        d={d}
        key={d}
        stroke="#39A57D"
        {...getPathMotion({
          isAnimationActive,
          prefersReducedMotion,
          revealIndex,
          type,
        })}
      />
    ));

  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 hidden size-full sm:block"
        viewBox="0 0 1184 500"
        fill="none"
        aria-hidden="true"
      >
        {renderPaths(MOBILE_CONNECTOR_PATHS)}
      </svg>
      <svg
        className="pointer-events-none absolute inset-0 size-full sm:hidden"
        viewBox="0 0 1184 500"
        fill="none"
        aria-hidden="true"
      >
        {renderPaths(DESKTOP_CONNECTOR_PATHS)}
      </svg>
    </>
  );
};

const AgentsVisual = () => {
  const visualRef = useRef(null);
  const sceneContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isAnimationActive = useInView(visualRef, {
    margin: '-15% 0px -15% 0px',
    once: true,
  });

  useEffect(() => {
    const container = sceneContainerRef.current;
    const scene = sceneRef.current;

    if (!container || !scene) return undefined;

    const mobileMediaQuery = window.matchMedia(MOBILE_SCENE_MEDIA_QUERY);

    const updateSceneScale = () => {
      const isMobile = mobileMediaQuery.matches;
      const referenceWidth = isMobile ? MOBILE_SCENE_WIDTH : SCENE_WIDTH;
      const scale = container.getBoundingClientRect().width / referenceWidth;
      const offsetX = isMobile ? -MOBILE_SCENE_LEFT * scale : 0;

      scene.style.setProperty('--agents-scene-scale', String(scale));
      scene.style.setProperty('--agents-scene-offset-x', `${offsetX}px`);
    };

    updateSceneScale();
    mobileMediaQuery.addEventListener('change', updateSceneScale);

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateSceneScale);

      return () => {
        mobileMediaQuery.removeEventListener('change', updateSceneScale);
        window.removeEventListener('resize', updateSceneScale);
      };
    }

    const resizeObserver = new ResizeObserver(updateSceneScale);
    resizeObserver.observe(container);

    return () => {
      mobileMediaQuery.removeEventListener('change', updateSceneScale);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <figure
      className="overflow-hidden bg-black-pure"
      ref={visualRef}
      role="img"
      aria-label="A production database creates three isolated environments for checkout, search, and migration agents."
    >
      <LazyMotion features={domAnimation}>
        <div
          className="relative aspect-[1184/500] w-full overflow-hidden sm:aspect-[940/500]"
          ref={sceneContainerRef}
        >
          <div
            className="absolute top-0 [left:var(--agents-scene-offset-x)] h-[500px] w-[1184px] origin-top-left [transform:scale(var(--agents-scene-scale))] bg-[repeating-linear-gradient(90deg,transparent_0_35px,#131415_35px_36px),repeating-linear-gradient(90deg,transparent_0_107px,rgba(36,38,40,0.76)_107px_108px)] [background-position:-11px_0]"
            ref={sceneRef}
            style={{ '--agents-scene-offset-x': '0px', '--agents-scene-scale': 1 }}
          >
            <Connector
              isAnimationActive={isAnimationActive}
              prefersReducedMotion={prefersReducedMotion}
            />
            <div className="absolute top-[137px] left-[96px] origin-top-left scale-100 sm:top-[120px] sm:scale-[1.15]">
              <ProductionCard />
            </div>
            {ENVIRONMENTS.map((environment, index) => (
              <div
                className={cn(
                  'absolute left-[708px] origin-top-left scale-100 sm:left-[662px] sm:scale-[1.15]',
                  ENVIRONMENT_TOPS[index]
                )}
                key={environment.name}
              >
                <EnvironmentCard
                  environment={environment}
                  isAnimationActive={isAnimationActive}
                  prefersReducedMotion={prefersReducedMotion}
                  revealIndex={index}
                />
              </div>
            ))}
          </div>
        </div>
      </LazyMotion>
    </figure>
  );
};

DatabaseRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

ProductionCard.propTypes = {
  className: PropTypes.string,
};

EnvironmentCard.propTypes = {
  className: PropTypes.string,
  environment: PropTypes.shape({
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    statusClassName: PropTypes.string.isRequired,
    dotClassName: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        complete: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).isRequired,
  isAnimationActive: PropTypes.bool.isRequired,
  prefersReducedMotion: PropTypes.bool,
  revealIndex: PropTypes.number.isRequired,
};

Connector.propTypes = {
  isAnimationActive: PropTypes.bool.isRequired,
  prefersReducedMotion: PropTypes.bool,
};

export default AgentsVisual;
