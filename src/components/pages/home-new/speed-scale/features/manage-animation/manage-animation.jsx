'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import PlayIcon from 'icons/home-new/play.inline.svg';
import dotsPattern from 'images/pages/home-new/speed-scale/dots-pattern.jpg';

const Step = ({ index, title, isActive, children }) => (
  <m.li
    className="relative pl-16 opacity-30 2xl:pl-[50px] xl:pl-11 lg:pl-[56px] sm:pl-7"
    initial={{ opacity: index === 0 ? '100%' : 0 }}
    animate={{ opacity: isActive ? 1 : 0.3 }}
    transition={{ duration: 0.3, ease: [0.33, 0, 0, 1.01] }}
  >
    <span className="absolute left-0 top-0 h-full w-10 xl:w-7 lg:w-8 sm:w-4">
      <span
        className={clsx(
          'absolute -top-2 left-0 z-10 flex w-full justify-center bg-black-pure p-2.5',
          index !== 0 && 'h-full',
          'font-mono-new leading-none text-gray-new-60',
          'xl:-top-1.5 xl:p-[7px] xl:text-[11px] lg:p-2 lg:text-sm sm:-top-[3px] sm:p-1 sm:text-[7px]'
        )}
        aria-label={`Step ${index + 1}`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <m.span
        className={clsx(
          'absolute left-1/2 h-0 w-px -translate-x-1/2 bg-gray-new-20',
          index === 0 ? 'top-0' : '-top-12'
        )}
        initial={{ height: index === 0 ? '100%' : 0 }}
        animate={{ height: isActive ? '100%' : 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.07, 0.5, 1] }}
        aria-hidden
      />
    </span>
    <h4
      className={clsx(
        'mb-6 text-xl leading-none tracking-extra-tight',
        '2xl:text-lg xl:mb-4 xl:text-sm lg:mb-[18px] lg:text-lg sm:mb-[10px] sm:text-[9px]',
        '[&>span]:font-mono-new [&>span]:text-gray-new-70'
      )}
      dangerouslySetInnerHTML={{ __html: title }}
    />
    {children}
  </m.li>
);

Step.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

const codeWrapperClassName =
  'block overflow-hidden whitespace-nowrap p-5 xl:p-[14px] lg:p-[18px] sm:p-2';

const codeClassName =
  'whitespace-nowrap font-mono-new tracking-extra-tight 2xl:text-sm xl:text-[11px] lg:text-[14px] sm:text-[7px]';

const ManageAnimation = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setActiveStep(1);
    }, 2000);
  }, []);

  return (
    <ol
      className={clsx(
        'flex w-[736px] flex-col gap-12',
        '2xl:w-auto xl:-ml-8 xl:gap-[30px] lg:ml-0 lg:max-w-[712px] lg:gap-11 lg:pt-1.5',
        'sm:max-w-[386px] sm:gap-[26px] sm:pt-1 xs:max-w-xs'
      )}
    >
      <LazyMotion features={domAnimation}>
        <Step
          index={0}
          title="Send API call and receive connection string in <span>120ms</span>"
          isActive
        >
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
              <code className={clsx(codeClassName, 'leading-none')}>
                curl -X POST https://api.neon.tech/v2/projects/:id/databases
              </code>
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
        <Step index={1} title="Test and deploy <span>>></span>" isActive={activeStep === 1}>
          <div
            className={clsx(
              'relative flex flex-col gap-12 border border-gray-new-40 bg-black-pure xl:gap-7 lg:gap-9 sm:gap-4',
              codeWrapperClassName
            )}
          >
            <m.code
              className={clsx(codeClassName, 'leading-[1.65]')}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeStep === 1 ? 1 : 0 }}
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
                'flex w-fit items-center gap-1.5 border border-gray-new-40 bg-black-pure py-2 pl-2.5 pr-3 leading-none',
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
  );
};

export default ManageAnimation;
