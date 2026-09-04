'use client';

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import ScrambleText from './scramble-text';

const CLAIM_LINK = 'https://claimable.neon.tech/claim?user_code=M5E1-A2X9';
const LINK_START_DELAY = 0.25;
const CHARACTER_INTERVAL = 0.02;
const SCRAMBLE_DURATION = 0.72;
const DETAILS_START_DELAY = LINK_START_DELAY + CLAIM_LINK.length * CHARACTER_INTERVAL + 0.25;
const VALUE_START_DELAY = DETAILS_START_DELAY + 0.08;
const VALUE_STAGGER = 0.14;
const ENABLED_DELAY = VALUE_START_DELAY + VALUE_STAGGER * 2 + SCRAMBLE_DURATION + 0.1;

const ClaimDiagram = () => {
  const [ref, isInView] = useInView({ threshold: 0.45, triggerOnce: true });
  const shouldReduceMotion = useReducedMotion();
  const isActive = isInView || shouldReduceMotion;

  const scrambleProps = {
    isActive: Boolean(isActive),
    duration: SCRAMBLE_DURATION,
    shouldReduceMotion: Boolean(shouldReduceMotion),
  };

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
              className="block w-[65.625cqw] truncate font-mono text-[3.2895cqw] leading-[1.4] tracking-extra-tight text-gray-new-80"
              aria-label={CLAIM_LINK}
            >
              {Array.from(CLAIM_LINK, (character, index) => (
                <m.span
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : LINK_START_DELAY + index * CHARACTER_INTERVAL,
                    duration: shouldReduceMotion ? 0 : 0.01,
                  }}
                  key={`${character}-${index}`}
                >
                  {character}
                </m.span>
              ))}
            </code>
          </div>
        </div>

        <div
          className="absolute top-[30.8651cqw] left-1/2 w-[71.5461cqw] -translate-x-1/2"
          data-diagram-node="claim-details"
        >
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{
              delay: shouldReduceMotion ? 0 : DETAILS_START_DELAY,
              duration: shouldReduceMotion ? 0 : 0.16,
            }}
            data-animation-step="claim-details"
          >
            <p className="text-[2.6316cqw] leading-snug tracking-extra-tight text-gray-new-40 uppercase">
              Claim details
            </p>
            <dl className="mt-[1.9602cqw] grid grid-cols-[auto_1fr] items-center gap-y-[1.9602cqw] text-[2.9605cqw] leading-[1.3889] tracking-extra-tight">
              <dt className="text-gray-new-70">Project</dt>
              <dd className="w-[22.3684cqw] justify-self-end font-mono whitespace-nowrap text-green-52">
                <ScrambleText text="agent-project" delay={VALUE_START_DELAY} {...scrambleProps} />
              </dd>

              <dt className="text-gray-new-70">Destination</dt>
              <dd className="w-[31.5789cqw] justify-self-end whitespace-nowrap">
                <ScrambleText
                  text="Your Neon organization"
                  delay={VALUE_START_DELAY + VALUE_STAGGER}
                  {...scrambleProps}
                />
              </dd>

              <dt className="text-gray-new-70">Ownership</dt>
              <dd className="w-[23.1908cqw] justify-self-end tracking-[-0.0208333em] whitespace-nowrap">
                <ScrambleText
                  text="Transfer on claim"
                  delay={VALUE_START_DELAY + VALUE_STAGGER * 2}
                  {...scrambleProps}
                />
              </dd>

              <dt className="text-gray-new-70">Team access</dt>
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
          </m.div>
        </div>
      </LazyMotion>
    </div>
  );
};

export default ClaimDiagram;
