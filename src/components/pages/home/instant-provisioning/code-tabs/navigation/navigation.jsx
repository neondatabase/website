'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import CodeBlockWrapper from 'components/shared/code-block-wrapper';
import bunIcon from 'icons/home/instant-provisioning/bun.svg';
import denoIcon from 'icons/home/instant-provisioning/deno.svg';
import drizzleIcon from 'icons/home/instant-provisioning/drizzle.svg';
import goIcon from 'icons/home/instant-provisioning/go.svg';
import javaIcon from 'icons/home/instant-provisioning/java.svg';
import nextjsIcon from 'icons/home/instant-provisioning/nextjs.svg';
import nodejsIcon from 'icons/home/instant-provisioning/nodejs.svg';
import prismaIcon from 'icons/home/instant-provisioning/prisma.svg';
import pythonIcon from 'icons/home/instant-provisioning/python.svg';
import rubyIcon from 'icons/home/instant-provisioning/ruby.svg';
import rustIcon from 'icons/home/instant-provisioning/rust.svg';

import { useActiveTab } from '../../active-tab-context';

const icons = {
  go: { src: goIcon, width: 30, height: 14 },
  java: { src: javaIcon, width: 11, height: 14 },
  deno: { src: denoIcon, width: 12, height: 14 },
  bun: { src: bunIcon, width: 12, height: 14 },
  nodejs: { src: nodejsIcon, width: 13, height: 14 },
  nextjs: { src: nextjsIcon, width: 14, height: 14 },
  python: { src: pythonIcon, width: 14, height: 14 },
  ruby: { src: rubyIcon, width: 10, height: 14 },
  rust: { src: rustIcon, width: 14, height: 14 },
  prisma: { src: prismaIcon, width: 14, height: 14 },
  drizzle: { src: drizzleIcon, width: 14, height: 14 },
};

const Navigation = ({ codeSnippets, highlightedCodeSnippets }) => {
  const { activeTab, setActiveTab } = useActiveTab();

  return (
    <>
      <div className="border-b border-white/[0.03]">
        <div
          className={clsx(
            'no-scrollbars relative flex gap-x-2 overflow-x-auto px-4 py-2.5 [mask-image:linear-gradient(90deg,transparent_4px,black_14px,black_calc(100%-14px),transparent_calc(100%-4px))] xl:gap-x-1.5 xl:px-[14px] xl:py-2 lg:py-[7px] lg:pr-8',
            'lg:[mask-image:linear-gradient(90deg,transparent_4px,black_20px,black_calc(100%-40px),transparent_calc(100%-16px))]',
            'md:[mask-image:linear-gradient(90deg,transparent_4px,black_20px,black_calc(100%-32px),transparent_calc(100%-12px))]'
          )}
        >
          {codeSnippets.map(({ name, iconName }, index) => {
            const icon = icons[iconName];
            return (
              <button
                className={clsx(
                  'group relative flex h-[30px] shrink-0 items-center overflow-hidden rounded-md px-3 leading-none outline-none xl:h-[27px] xl:py-[7px]',
                  index === activeTab ? 'after:opacity-40' : 'after:opacity-0'
                )}
                type="button"
                key={index}
                onClick={() => setActiveTab(index)}
              >
                <span
                  className={clsx(
                    'border-linear absolute inset-0 z-10 rounded-[inherit] bg-white/[0.05] group-hover:opacity-0',
                    index === activeTab && 'opacity-0'
                  )}
                  aria-hidden
                />
                <span
                  className={clsx(
                    'absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-colors duration-200',
                    'before:absolute before:inset-px before:rounded-[inherit] before:bg-black-new',
                    'after:absolute after:left-1/2 after:top-full after:h-9 after:w-[67px] after:-translate-x-1/2 after:rounded-full after:bg-[#D9D9D9] after:blur-md after:transition-opacity after:duration-200',
                    index === activeTab
                      ? 'bg-[radial-gradient(64.39%_110%_at_50%_120%,#FFFFFF_27.27%,rgba(255,255,255,.1)_69.23%)] !opacity-100 after:opacity-40'
                      : 'bg-gradient-to-b from-white to-white/40 after:opacity-0 group-hover:opacity-30'
                  )}
                  aria-hidden
                />
                <img
                  className="relative z-20 mr-1.5 inline-block h-3.5 xl:h-[13px]"
                  src={icon.src}
                  width={icon.width}
                  height={icon.height}
                  alt=""
                  loading="lazy"
                />
                <span className="z-20 bg-gradient-to-b from-white via-white via-25% to-white/50 bg-clip-text text-sm leading-none tracking-tighter text-transparent xl:text-[13px] lg:text-xs">
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="h-[342px] lg:h-[312px]">
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false} mode="wait">
            {highlightedCodeSnippets.map(
              (code, index) =>
                index === activeTab && (
                  <m.div
                    className="homepage-shiki"
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CodeBlockWrapper className="show-linenumbers highlighted-code h-[342px] overflow-auto lg:h-[312px] [&_[data-line]]:px-3 [&_[data-line]]:text-xs [&_[data-line]]:leading-[1.21] lg:[&_[data-line]]:text-[11px] lg:[&_[data-line]]:leading-[1.09] [&_pre]:pt-3 [&_pre_code>.line::before]:mr-7">
                      {parse(code)}
                    </CodeBlockWrapper>
                  </m.div>
                )
            )}
          </AnimatePresence>
        </LazyMotion>
      </div>
    </>
  );
};

export default Navigation;

Navigation.propTypes = {
  codeSnippets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      iconName: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    })
  ).isRequired,
  highlightedCodeSnippets: PropTypes.arrayOf(PropTypes.string).isRequired,
};
