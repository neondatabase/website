'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

import PlayIcon from 'icons/home-new/play.inline.svg';
import dotsPattern from 'images/pages/home-new/speed-scale/dots-pattern.jpg';

import { ANIMATION_CONFIG, API_CALL_CODE, CONNECTION_STRING } from './data';
import ShuffleCode from './shuffle-code';
import Step from './step';
import useAnimationTimeline from './use-animation-timeline';

export const codeWrapperClassName = clsx(
  'block overflow-hidden whitespace-nowrap p-5',
  'xl:p-[14px] lg:p-[18px] sm:p-2'
);

export const codeClassName = clsx(
  'whitespace-nowrap font-mono-new tracking-extra-tight',
  '2xl:text-sm xl:text-[11px] lg:text-[14px] sm:text-[7px]'
);

const ManageAnimation = () => {
  const { ref, inView } = useInView({ threshold: 0.75 });
  const { isFrameActive } = useAnimationTimeline(inView);

  return (
    <div ref={ref} className="relative">
      <ol
        className={clsx(
          'flex w-[736px] flex-col gap-12',
          '2xl:w-auto xl:-ml-8 xl:gap-[30px] lg:ml-0 lg:max-w-[712px] lg:gap-11 lg:pt-1.5',
          'sm:max-w-[386px] sm:gap-[26px] sm:pt-1 xs:max-w-xs'
        )}
      >
        <LazyMotion features={domAnimation}>
          <Step index={0} title="Send API call and receive connection string in <span>120ms</span>">
            <div
              className={clsx(
                'relative overflow-hidden bg-[#111215] px-6 py-[22px]',
                'xl:px-4 xl:py-[15px] lg:px-5 lg:py-[18px] sm:px-[14px] sm:py-3 xs:px-2.5 xs:py-2'
              )}
            >
              <div
                className={clsx(
                  'relative z-10 flex items-center gap-2.5 bg-black-pure/80 backdrop-blur-[15px] xl:gap-2 sm:gap-1',
                  codeWrapperClassName
                )}
              >
                <span
                  className="size-2 shrink-0 rounded-full bg-green-52 xl:size-1.5 lg:size-2 sm:size-[3px]"
                  aria-hidden
                />
                <m.code
                  className={clsx(codeClassName, 'leading-none')}
                  animate={{
                    opacity: isFrameActive('LOOP') ? 0 : 1,
                  }}
                  transition={{
                    duration: ANIMATION_CONFIG.LOOP.duration,
                    ease: ANIMATION_CONFIG.LOOP.ease,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {!isFrameActive('CONNECTION_STRING') ? (
                      <m.span
                        key="api-call"
                        className={codeClassName}
                        animate={{
                          color: isFrameActive('API_CALL_CODE') ? '#6b6d73' : '#ffffff',
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: ANIMATION_CONFIG.API_CALL_CODE.duration,
                          ease: ANIMATION_CONFIG.API_CALL_CODE.ease,
                        }}
                      >
                        {API_CALL_CODE}
                      </m.span>
                    ) : (
                      <ShuffleCode
                        key="connection-string"
                        targetText={CONNECTION_STRING}
                        isActive={isFrameActive('CONNECTION_STRING')}
                        duration={ANIMATION_CONFIG.CONNECTION_STRING.duration}
                        className={codeClassName}
                      />
                    )}
                  </AnimatePresence>
                </m.code>
              </div>
              <Image
                className="pointer-events-none absolute left-0 top-0 h-full w-auto max-w-none"
                src={dotsPattern}
                alt="Dots pattern"
                width={763}
                height={100}
                sizes="100vw"
              />
              <span
                className="pointer-events-none absolute inset-0 z-10 border border-white/10"
                aria-hidden
              />
            </div>
          </Step>
          <Step index={1} title="Test and deploy <span>>></span>">
            <div
              className={clsx(
                'relative flex flex-col gap-12 border border-gray-new-40 bg-black-pure xl:gap-7 lg:gap-9 sm:gap-4',
                codeWrapperClassName
              )}
            >
              <m.code
                className={clsx(codeClassName, 'leading-[1.65]')}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isFrameActive('SQL_SHOW') ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.4, 0.08, 0, 0.85] }}
              >
                CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT
                NULL, value REAL);
                <br />
                INSERT INTO playing_with_neon(name, value)
                <br />
                SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
                <br />
                SELECT * FROM playing_with_neon;
              </m.code>
              <button
                className={clsx(
                  'flex w-fit items-center gap-1.5 border border-gray-new-40 bg-black-pure py-2 pl-2.5 pr-3',
                  'text-xs font-medium leading-none tracking-extra-tight',
                  'xl:gap-1 xl:p-1.5 xl:pr-2 xl:text-[9px]',
                  'lg:gap-1.5 lg:pr-2.5 lg:text-[11px]',
                  'sm:gap-1 sm:p-[3px] sm:pr-1 sm:text-[6px]'
                )}
                type="button"
              >
                <PlayIcon className="size-3 xl:size-[9px] lg:size-3 sm:size-1.5" />
                Run Query
              </button>
            </div>
          </Step>
        </LazyMotion>
      </ol>
    </div>
  );
};

export default ManageAnimation;
