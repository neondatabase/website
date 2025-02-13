'use client';


import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import infoIcon from 'icons/enterprise/info.svg';
import lampIcon from 'icons/enterprise/lamp.svg';

const variants = {
  open: {
    opacity: 0.72,
    translateY: 0,
    transition: {
      duration: 0.2,
    },
  },
  closed: {
    opacity: 0,
    translateY: 10,
    transition: {
      duration: 0.2,
    },
  },
};

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="mt-11 flex gap-10">
      <ul className="flex w-[280px] shrink-0 grow flex-col gap-y-2.5">
        {tabs.map(({ title }, index) => (
          <li key={index}>
            <button
              className={clsx(
                'border-l-[3px] py-2.5 pl-3 text-left text-xl font-medium leading-snug tracking-tight text-gray-new-90 transition-colors duration-200 ease-in-out focus-visible:rounded-md focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-0',
                index === activeTab
                  ? 'cursor-default border-primary-1 font-semibold text-white'
                  : 'hover:text-gray-30 border-transparent font-medium'
              )}
              type="button"
              onClick={() => handleClick(index)}
            >
              {title}
            </button>
          </li>
        ))}
      </ul>

      {/* TODO: replace border with gradient */}
      <div className="relative min-h-[280px] w-full grow overflow-hidden rounded-[14px] border border-gray-new-10 bg-gray-new-10 bg-[radial-gradient(43.84%_41.89%_at_100%_0%,rgba(21,55,55,0.80)_0%,rgba(0,33,33,0.00)_100%),linear-gradient(180deg,rgba(1,119,119,0.00)_21.94%,rgba(1,119,119,0.08)_100%)] p-8 pb-3.5">
        <div className="flex items-center gap-x-2">
          <Image className="shrink-0" src={infoIcon} width={22} height={22} alt="" />
          <h3 className="text-xl font-semibold leading-none tracking-tighter text-white">
            The problem
          </h3>
        </div>
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false} mode="wait">
            {tabs.map(({ challenge }, index) => {
              if (index !== activeTab) {
                return null;
              }

              return (
                <m.p
                  className="mt-3.5 min-h-[66px] text-base leading-normal tracking-tight text-white opacity-80"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={variants}
                  key={index}
                >
                  {challenge}
                </m.p>
              );
            })}
          </AnimatePresence>
        </LazyMotion>
        <span
          className="my-1.5 block h-px w-full bg-[linear-gradient(90deg,rgba(227,255,255,0.00)_0%,rgba(227,255,255,0.20)_10%,rgba(227,255,255,0.20)_90%,rgba(227,255,255,0.00)_100%)]"
          aria-hidden
        />
        <div className="mt-6 flex items-center gap-x-2">
          <Image className="shrink-0" src={lampIcon} width={22} height={22} alt="" />
          <h3 className="text-xl font-semibold leading-none tracking-tighter text-white">
            How Neon helps
          </h3>
        </div>
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false} mode="wait">
            {tabs.map(({ description }, index) => {
              if (index !== activeTab) {
                return null;
              }

              return (
                <m.p
                  className="mt-3.5 min-h-[66px] text-base leading-normal tracking-tight text-white opacity-80"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={variants}
                  key={index}
                >
                  {description}
                </m.p>
              );
            })}
          </AnimatePresence>
        </LazyMotion>
        <span className="absolute -bottom-14 -left-32 h-[83px] w-[155px] rounded-[100%] bg-[rgba(85,255,255,0.60)] mix-blend-plus-lighter blur-2xl" />
        <span className="absolute -bottom-40 -left-20 h-[293px] w-[175px] -rotate-45 rounded-[100%] bg-[linear-gradient(180deg,rgba(0,229,191,0.80)_0%,rgba(0,127,85,0.00)_100%)] opacity-40 blur-2xl" />
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      challenge: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Tabs;
