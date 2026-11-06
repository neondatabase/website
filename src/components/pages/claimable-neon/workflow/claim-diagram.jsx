'use client';

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import ScrambleText from './scramble-text';

const CLAIM_LINK = 'https://claimable.neon.tech/claim?user_code=';
const EASE_OUT = [0.22, 1, 0.36, 1];
const LINK_START_DELAY = 0.25;
const CHARACTER_INTERVAL = 0.02;
const LINK_DURATION = CLAIM_LINK.length * CHARACTER_INTERVAL;
const ELLIPSIS_CHARACTER_INDEX = CLAIM_LINK.indexOf('?');
const SCRAMBLE_DURATION = 0.72;
const DETAILS_START_DELAY = LINK_START_DELAY + LINK_DURATION + 0.05;
const VALUE_START_DELAY = DETAILS_START_DELAY + 0.08;
const VALUE_STAGGER = 0.16;
const ENABLED_DELAY = VALUE_START_DELAY + VALUE_STAGGER * 2 + SCRAMBLE_DURATION + 0.1;

const getCharacterDelay = (index) => {
  const characterProgress = index / (CLAIM_LINK.length - 1);
  const easeOutTimelinePosition = 1 - Math.sqrt(1 - characterProgress);

  return LINK_START_DELAY + easeOutTimelinePosition * LINK_DURATION;
};

const ClaimDiagram = () => {
  const [ref, isInView] = useInView({ threshold: 0.45, triggerOnce: true });
  const shouldReduceMotion = useReducedMotion();
  const isActive = isInView || shouldReduceMotion;

  const scrambleProps = {
    isActive: Boolean(isActive),
    duration: SCRAMBLE_DURATION,
    shouldReduceMotion: Boolean(shouldReduceMotion),
  };
  const getRevealTransition = (delay, duration = 0.16) => ({
    delay: shouldReduceMotion ? 0 : delay,
    duration: shouldReduceMotion ? 0 : duration,
    ease: EASE_OUT,
  });

  return (
    <div
      className="@container relative aspect-[38/26.5] w-full overflow-hidden bg-gray-new-8"
      aria-hidden="true"
      ref={ref}
    >
      <LazyMotion features={domAnimation}>
        <div
          className="absolute top-[10.4704cqw] left-1/2 w-[71.5461cqw] -translate-x-1/2"
          data-diagram-node="claim-link"
        >
          <p className="text-[3.2895cqw] leading-none tracking-extra-tight text-gray-new-90">
            Claim link
          </p>
          <div className="mt-[2.6316cqw] flex h-[9.8684cqw] items-center overflow-hidden border border-gray-new-15 bg-black-new pt-[2.4671cqw] pr-[2.3026cqw] pb-[2.7961cqw] pl-[2.9605cqw]">
            <code
              className="relative block w-[65.625cqw] overflow-hidden font-mono text-[3.2895cqw] leading-[1.4] tracking-extra-tight whitespace-nowrap text-gray-new-80"
              aria-label={CLAIM_LINK}
            >
              {Array.from(CLAIM_LINK, (character, index) => (
                <m.span
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : getCharacterDelay(index),
                    duration: shouldReduceMotion ? 0 : 0.08,
                    ease: EASE_OUT,
                  }}
                  key={`${character}-${index}`}
                >
                  {character}
                </m.span>
              ))}
              <m.span
                className="absolute top-0 right-0 bg-black-new"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : getCharacterDelay(ELLIPSIS_CHARACTER_INDEX),
                  duration: shouldReduceMotion ? 0 : 0.08,
                  ease: EASE_OUT,
                }}
              >
                …
              </m.span>
            </code>
          </div>
        </div>

        <div
          className="absolute top-[30.8651cqw] left-1/2 w-[71.5461cqw] -translate-x-1/2"
          data-diagram-node="claim-details"
        >
          <div data-animation-step="claim-details">
            <m.p
              className="text-[2.6316cqw] leading-snug tracking-extra-tight text-gray-new-40 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={getRevealTransition(DETAILS_START_DELAY)}
            >
              Claim details
            </m.p>
            <dl className="mt-[1.9602cqw] grid grid-cols-[auto_1fr] items-center gap-y-[1.9602cqw] text-[2.9605cqw] leading-[1.3889] tracking-extra-tight">
              <m.dt
                className="text-gray-new-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={getRevealTransition(VALUE_START_DELAY)}
                data-animation-step="claim-label"
              >
                Project
              </m.dt>
              <dd className="w-[22.3684cqw] justify-self-end font-mono whitespace-nowrap text-green-52">
                <ScrambleText text="agent-project" delay={VALUE_START_DELAY} {...scrambleProps} />
              </dd>

              <m.dt
                className="text-gray-new-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={getRevealTransition(VALUE_START_DELAY + VALUE_STAGGER)}
                data-animation-step="claim-label"
              >
                Destination
              </m.dt>
              <dd className="w-[31.5789cqw] justify-self-end whitespace-nowrap">
                <ScrambleText
                  text="Your Neon organization"
                  delay={VALUE_START_DELAY + VALUE_STAGGER}
                  {...scrambleProps}
                />
              </dd>

              <m.dt
                className="text-gray-new-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={getRevealTransition(VALUE_START_DELAY + VALUE_STAGGER * 2)}
                data-animation-step="claim-label"
              >
                Ownership
              </m.dt>
              <dd className="w-[23.1908cqw] justify-self-end tracking-[-0.0208333em] whitespace-nowrap">
                <ScrambleText
                  text="Transfer on claim"
                  delay={VALUE_START_DELAY + VALUE_STAGGER * 2}
                  {...scrambleProps}
                />
              </dd>

              <m.dt
                className="text-gray-new-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={getRevealTransition(ENABLED_DELAY)}
                data-animation-step="claim-label"
              >
                Team access
              </m.dt>
              <m.dd
                className="inline-flex w-[15.9951cqw] items-center gap-[1.6447cqw] justify-self-end bg-gray-new-15 pt-[0.6579cqw] pr-[1.1513cqw] pb-[0.9868cqw] pl-[1.1513cqw] leading-none text-green-52"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : ENABLED_DELAY,
                  duration: shouldReduceMotion ? 0 : 0.16,
                }}
                data-animation-step="enabled-badge"
              >
                <span className="size-[1.027cqw] rounded-full bg-green-52" />
                Enabled
              </m.dd>
            </dl>
          </div>
        </div>
      </LazyMotion>
    </div>
  );
};

export default ClaimDiagram;
