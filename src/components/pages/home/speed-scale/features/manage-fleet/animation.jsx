'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';

import PlayIcon from 'icons/home/play.inline.svg';
import dotsPattern from 'images/pages/home/speed-scale/dots-pattern.jpg';
import { cn } from 'utils/cn';

import ShuffleCodeAnimation from './components/shuffle-code-animation';
import Step from './components/step';
import TypewriterCodeAnimation from './components/typewriter-code-animation';
import { ANIMATION_CONFIG, CONNECTION_STRING } from './data';
import useAnimationTimeline from './use-animation-timeline';

export const codeWrapperClassName = cn(
  'flex overflow-hidden p-5',
  'xl:p-[14px] lg:p-[18px] md:p-5 sm:p-2'
);

export const codeClassName = cn(
  'font-mono tracking-extra-tight text-gray-new-80',
  '2xl:text-sm xl:text-[11px] lg:text-sm md:text-xs sm:text-[7px]'
);

const LOOP_TRANSITION = {
  duration: ANIMATION_CONFIG.LOOP.duration,
  ease: ANIMATION_CONFIG.LOOP.ease,
};

const Animation = ({ apiCode, sqlCode }) => {
  const { ref, inView } = useInView();
  const { isFrameActive } = useAnimationTimeline(inView);

  return (
    <div ref={ref} className="relative">
      <ol
        className={cn(
          'flex w-[736px] flex-col gap-12',
          '2xl:w-auto xl:-ml-8 xl:gap-[30px] lg:ml-0 lg:max-w-[712px] lg:gap-11 lg:pt-1.5',
          'sm:max-w-full sm:gap-[26px] sm:pt-1'
        )}
      >
        <LazyMotion features={domAnimation}>
          <li>
            <Step
              index={0}
              title="Send API call and receive connection string in <span>120ms</span>"
              lineAnimation={{
                initial: { height: '100%' },
                animate: {
                  height: isFrameActive('LINE_GROWTH') && !isFrameActive('LOOP') ? '140%' : '100%',
                },
                transition: {
                  duration: ANIMATION_CONFIG.LINE_GROWTH.duration,
                  ease: ANIMATION_CONFIG.LINE_GROWTH.ease,
                },
              }}
            >
              <div
                className={cn(
                  'relative overflow-hidden bg-[#111215] px-6 py-[22px]',
                  'xl:px-4 xl:py-[15px] lg:px-5 lg:py-[18px] sm:px-[14px] sm:py-3 xs:px-2.5 xs:py-2'
                )}
              >
                <div
                  className={cn(
                    'relative z-10 flex items-center gap-2.5 bg-black-pure/80 backdrop-blur-[15px] xl:gap-2 sm:gap-1',
                    codeWrapperClassName
                  )}
                >
                  <span
                    className="size-2 shrink-0 rounded-full bg-green-52 xl:size-1.5 lg:size-2 sm:size-[3px]"
                    aria-hidden
                  />
                  <m.code
                    className={cn(codeClassName, 'leading-none whitespace-pre')}
                    animate={{
                      opacity: isFrameActive('LOOP') ? 0 : 1,
                    }}
                    transition={LOOP_TRANSITION}
                  >
                    {!isFrameActive('CONNECTION_STRING') ? (
                      <m.span
                        className={cn(
                          codeClassName,
                          'leading-none [&_span]:leading-none [&_span]:text-green-52'
                        )}
                        animate={{
                          opacity: isFrameActive('API_CALL_CODE') ? 0.5 : 1,
                        }}
                        transition={{
                          duration: ANIMATION_CONFIG.API_CALL_CODE.duration,
                          ease: ANIMATION_CONFIG.API_CALL_CODE.ease,
                        }}
                      >
                        {apiCode}
                      </m.span>
                    ) : (
                      <ShuffleCodeAnimation
                        targetText={CONNECTION_STRING}
                        isActive={isFrameActive('CONNECTION_STRING')}
                        duration={ANIMATION_CONFIG.CONNECTION_STRING.duration}
                        className={cn(codeClassName, 'leading-none')}
                      />
                    )}
                  </m.code>
                </div>
                <Image
                  className="pointer-events-none absolute top-0 left-0 h-full w-auto max-w-none sm:h-fit sm:w-full"
                  src={dotsPattern}
                  alt="Dots pattern"
                  width={763}
                  height={100}
                  sizes="100vw"
                  quality={100}
                />
                <span
                  className="pointer-events-none absolute inset-0 z-10 border border-white/10"
                  aria-hidden
                />
              </div>
            </Step>
          </li>
          <m.li
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: isFrameActive('STEP_2') && !isFrameActive('LOOP') ? 1 : 0.3,
            }}
            transition={
              isFrameActive('LOOP')
                ? LOOP_TRANSITION
                : {
                    duration: ANIMATION_CONFIG.STEP_2.duration,
                    ease: ANIMATION_CONFIG.STEP_2.ease,
                  }
            }
          >
            <Step index={1} title="Test and deploy <span>>></span>">
              <div
                className={cn(
                  'relative flex flex-col gap-12 border border-gray-new-40 bg-black-pure xl:gap-7 lg:gap-9 sm:gap-4',
                  codeWrapperClassName
                )}
              >
                <m.div
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: isFrameActive('LOOP') ? 0 : 1,
                  }}
                  transition={LOOP_TRANSITION}
                >
                  <TypewriterCodeAnimation
                    targetText={sqlCode}
                    codeClassName={cn(codeClassName, 'leading-[1.65]')}
                    isActive={isFrameActive('SQL_CODE')}
                    duration={ANIMATION_CONFIG.SQL_CODE.duration}
                  />
                </m.div>
                <button
                  className={cn(
                    'flex w-fit items-center gap-1.5 border border-gray-new-40 bg-black-pure py-2 pr-3 pl-2.5',
                    'text-xs leading-none font-medium tracking-extra-tight',
                    'xl:gap-1 xl:p-1.5 xl:pr-2 xl:text-[9px]',
                    'lg:gap-1.5 lg:pr-2.5 lg:text-[11px]',
                    'sm:gap-1 sm:p-[3px] sm:pr-1 sm:text-[6px]'
                  )}
                  type="button"
                  disabled
                >
                  <PlayIcon className="size-3 xl:size-[9px] lg:size-3 sm:size-1.5" />
                  Run Query
                </button>
              </div>
            </Step>
          </m.li>
        </LazyMotion>
      </ol>
    </div>
  );
};

Animation.propTypes = {
  apiCode: PropTypes.node.isRequired,
  sqlCode: PropTypes.node.isRequired,
};

export default Animation;
