'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import useWindowSize from 'react-use/lib/useWindowSize';

import CountingNumber from 'components/shared/animation/counting-number';

import { ACTIVITY_DATA, TOTAL_DATABASES, ACTIVITY_COLORS, START_DELAY } from './data';

const DeployDatabases = () => {
  const { ref, inView } = useInView();
  const { width: windowWidth } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(windowWidth <= 1024);
  }, [windowWidth]);

  return (
    <div
      ref={ref}
      className="relative max-w-none font-mono leading-none tracking-extra-tight sm:text-[7px] xl:text-xs"
    >
      <div className="flex w-fit border border-gray-new-50 px-5 py-[18px] sm:px-2.5 sm:py-2 xl:px-4 xl:py-3.5">
        Databases deployed:
        <span className="ml-7 text-gray-new-80 sm:ml-3 xl:ml-6">
          {isMobile ? (
            TOTAL_DATABASES
          ) : (
            <CountingNumber number={TOTAL_DATABASES} started={inView} delay={START_DELAY} />
          )}
        </span>
      </div>
      <div className="border-b border-l border-gray-new-50 pt-8 pb-[18px] pl-[18px] sm:pt-4 sm:pb-2 sm:pl-2 xl:pt-[26px] xl:pb-3.5 xl:pl-3.5">
        <ul className="flex flex-col gap-9 sm:gap-4 xl:gap-[26px]">
          <LazyMotion features={domAnimation}>
            {ACTIVITY_DATA.map(({ day, activeCount, idleCount, activity }) => (
              <li className="flex flex-col gap-5" key={day}>
                <div className="flex gap-[18px] sm:gap-2 xl:gap-[14px]">
                  <span className="w-[90px] border-r border-gray-new-20 text-gray-new-70 sm:w-10 xl:w-[68px]">
                    {day}
                  </span>
                  <div className="flex gap-5 sm:gap-3 xl:gap-4">
                    <div className="flex gap-2 sm:gap-1 xl:gap-1.5">
                      Active:
                      <span className="text-green-45">
                        {isMobile ? (
                          activeCount
                        ) : (
                          <CountingNumber
                            number={activeCount}
                            started={inView}
                            delay={START_DELAY}
                          />
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2 sm:gap-1 xl:gap-1.5">
                      Idle:
                      <span className="text-gray-new-80">
                        {isMobile ? (
                          idleCount
                        ) : (
                          <CountingNumber number={idleCount} started={inView} delay={START_DELAY} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <ul className="flex gap-2 xl:gap-1.5">
                  {activity.map((activity, hour) => (
                    <li
                      className="flex shrink-0 flex-col items-center gap-3 sm:gap-1.5 xl:gap-2"
                      key={`${day}-${hour}`}
                    >
                      <div className="grid grid-flow-col grid-cols-6 grid-rows-10 gap-[3px] sm:gap-px xl:gap-0.5">
                        {activity.split('').map((value, minute) => {
                          const delay = START_DELAY - 0.3 + hour * 0.1 + Math.random() * 0.2;

                          return (
                            <span
                              key={`${day}-${hour}-${minute}`}
                              className="flex size-1.5 items-center justify-center sm:size-[3px] xl:size-[5px]"
                            >
                              {isMobile ? (
                                <span
                                  className={clsx(
                                    'block size-full',
                                    value === '0' && 'scale-[0.33]'
                                  )}
                                  style={{ backgroundColor: ACTIVITY_COLORS[Number(value)] }}
                                />
                              ) : (
                                <m.span
                                  className="block size-full scale-[0.33] bg-[#2C6D4C] will-change-transform"
                                  initial={{ backgroundColor: ACTIVITY_COLORS[0], scale: 0.33 }}
                                  animate={{
                                    backgroundColor: inView
                                      ? ACTIVITY_COLORS[Number(value)]
                                      : ACTIVITY_COLORS[0],
                                    scale: inView && value !== '0' ? 1 : 0.33,
                                  }}
                                  transition={
                                    inView && {
                                      type: 'spring',
                                      delay,
                                      bounce: 0.2,
                                      stiffness: 400,
                                      damping: 15,
                                    }
                                  }
                                />
                              )}
                            </span>
                          );
                        })}
                      </div>
                      <time
                        className="text-xs text-gray-new-50 sm:text-[5px] xl:text-[9px]"
                        dateTime={`${hour + 9}:00`}
                      >
                        {String(hour + 9).padStart(2, '0')}:00
                      </time>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </LazyMotion>
        </ul>
      </div>
      <span
        className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-transparent from-70% to-black-pure"
        aria-hidden
      />
    </div>
  );
};

export default DeployDatabases;
