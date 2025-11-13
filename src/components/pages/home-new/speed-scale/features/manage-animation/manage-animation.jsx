'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import PlayIcon from 'icons/home-new/play.inline.svg';

const Step = ({ index, title, isActive, children }) => (
  <m.li
    className="relative pl-16 opacity-30 2xl:pl-12 xl:pl-11 lg:pl-10 md:pl-14 sm:pl-12 xs:pl-7"
    initial={{ opacity: index === 0 ? '100%' : 0 }}
    animate={{ opacity: isActive ? 1 : 0.3 }}
    transition={{ duration: 0.3, ease: [0.33, 0, 0, 1.01] }}
  >
    <span className="absolute -top-2 left-0 h-full w-10">
      <span
        className={clsx(
          'absolute left-0 top-0 z-10 flex w-full justify-center bg-black-pure py-2.5',
          'font-mono-new leading-none text-gray-new-60',
          index === 0 ? 'h-9' : 'h-full'
        )}
        aria-label={`Step ${index}`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <m.span
        className={clsx(
          'absolute left-5 h-0 w-px -translate-x-1/2 bg-gray-new-20',
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
        '2xl:text-lg xl:text-lg md:text-base sm:text-sm xs:text-[10px]',
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

const codeClassName = 'tracking-extra-tight block whitespace-nowrap font-mono-new 2xl:text-sm';

const ManageAnimation = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setActiveStep(1);
    }, 2000);
  }, []);

  return (
    <ol className="flex w-[736px] flex-col gap-12 2xl:w-auto xl:-ml-8 lg:ml-0">
      <LazyMotion features={domAnimation}>
        <Step
          index={0}
          title="Send API call and receive connection string in <span>120ms</span>"
          isActive
        >
          <div
            className={clsx(
              'relative bg-[#111215] px-6 py-[22px]',
              "bg-[url('/images/pages/home-new/speed-scale/manage-animation/dot-pattern.png')] bg-[length:auto_9px]"
            )}
          >
            <div
              className={clsx(
                'relative overflow-hidden bg-black-pure/80 py-5 pl-10 backdrop-blur-[15px]',
                '2xl:text-[13px]',
                'before:absolute before:left-5 before:top-1/2 before:size-2 before:-translate-y-1/2',
                'before:rounded-full before:bg-green-52'
              )}
            >
              <code className={clsx(codeClassName, 'leading-none')}>
                curl -X POST https://api.neon.tech/v2/projects/:id/databases
              </code>
            </div>
            <span
              className="pointer-events-none absolute inset-0 border border-white/10"
              aria-hidden
            />
          </div>
        </Step>
        <Step index={1} title="Test and deploy <span>>></span>" isActive={activeStep === 1}>
          <div className="relative flex flex-col gap-12 overflow-hidden border border-gray-new-40 bg-black-pure p-5">
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
                'flex h-7 w-fit items-center gap-1.5 border border-gray-new-40 bg-black-pure pl-2.5 pr-3',
                'text-xs font-medium leading-none tracking-extra-tight'
              )}
              type="button"
            >
              <PlayIcon />
              Run Query
            </button>
          </div>
        </Step>
      </LazyMotion>
    </ol>
  );
};

export default ManageAnimation;
