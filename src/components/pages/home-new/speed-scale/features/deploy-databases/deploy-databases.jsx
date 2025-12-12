'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import useWindowSize from 'react-use/lib/useWindowSize';

import CountingNumber from './counting-number';
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
      className="relative max-w-none font-mono-new leading-none tracking-extra-tight xl:text-xs sm:text-[7px]"
    >
      <div className="flex w-fit border border-gray-new-50 px-5 py-[18px] xl:px-4 xl:py-3.5 sm:px-2.5 sm:py-2">
        Databases deployed:
        <span className="ml-7 min-w-14 text-gray-new-80 xl:ml-6 xl:min-w-11 sm:ml-3 sm:min-w-6">
          {isMobile ? (
            TOTAL_DATABASES
          ) : (
            <CountingNumber number={TOTAL_DATABASES} inView={inView} delay={START_DELAY} />
          )}
        </span>
      </div>
      <div className="border-b border-l border-gray-new-50 pb-[18px] pl-[18px] pt-8 xl:pb-3.5 xl:pl-3.5 xl:pt-[26px] sm:pb-2 sm:pl-2 sm:pt-4">
        <ul className="flex flex-col gap-9 xl:gap-[26px] sm:gap-4">
          <LazyMotion features={domAnimation}>
            {ACTIVITY_DATA.map(({ day, activeCount, idleCount, activity }) => (
              <li className="flex flex-col gap-5" key={day}>
                <div className="flex gap-[18px] xl:gap-[14px] sm:gap-2">
                  <span className="w-[90px] border-r border-gray-new-20 text-gray-new-70 xl:w-[68px] sm:w-10">
                    {day}
                  </span>
                  <div className="flex gap-5 xl:gap-4 sm:gap-3">
                    <div className="flex gap-2 xl:gap-1.5 sm:gap-1">
                      Active:
                      <span className="min-w-14 text-green-45 xl:min-w-11 sm:min-w-6">
                        {isMobile ? (
                          activeCount
                        ) : (
                          <CountingNumber
                            number={activeCount}
                            inView={inView}
                            delay={START_DELAY}
                          />
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2 xl:gap-1.5 sm:gap-1">
                      Idle:
                      <span className="min-w-14 text-gray-new-80 xl:min-w-11 sm:min-w-6">
                        {isMobile ? (
                          idleCount
                        ) : (
                          <CountingNumber number={idleCount} inView={inView} delay={START_DELAY} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <ul className="flex gap-2 xl:gap-1.5">
                  {activity.map((activity, hour) => (
                    <li
                      className="flex shrink-0 flex-col items-center gap-3 xl:gap-2 sm:gap-1.5"
                      key={`${day}-${hour}`}
                    >
                      <div className="grid grid-flow-col grid-cols-6 grid-rows-10 gap-[3px] xl:gap-0.5 sm:gap-px">
                        {activity.split('').map((value, minute) => {
                          const delay = START_DELAY - 0.3 + hour * 0.1 + Math.random() * 0.2;

                          return (
                            <span
                              key={`${day}-${hour}-${minute}`}
                              className="flex size-1.5 items-center justify-center xl:size-[5px] sm:size-[3px]"
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
                        className="text-xs text-gray-new-50 xl:text-[9px] sm:text-[5px]"
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
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent from-70% to-black-pure"
        aria-hidden
      />
    </div>
  );
};

export default DeployDatabases;
