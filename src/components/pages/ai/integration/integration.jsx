'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useState } from 'react';

import CodeBlock from 'components/shared/code-block/code-block';
import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';
import Link from 'components/shared/link/link';
import ArrowIcon from 'icons/arrow-sm.inline.svg';

// TODO: update text to relevant one
const items = [
  {
    title: 'Create extension',
    code: `    CREATE EXTENSION embedding;
    CREATE TABLE items(embedding real[]);`,
    text: 'Easily switch to pg_embedding in your Postgres and LangChain projects.',
  },
  {
    title: 'Similarity search',
    code: `    SELECT id
    FROM items
    ORDER BY embedding <-> ARRAY[1.1, 2.2, 3.3];`,
    text: 'Easily switch to pg_embedding in your Postgres and LangChain projects.',
  },
  {
    title: 'Migration from pgvector',
    code: `    SELECT vector::real[] AS converted_vector
    FROM vector_items;`,
    text: 'Easily switch to pg_embedding in your Postgres and LangChain projects.',
  },
];

const Integration = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section className="integration safe-paddings mt-48 xl:mt-[124px] lg:mt-28 md:mt-20">
      <Container className="flex flex-col items-center" size="medium">
        <GradientLabel>Getting Started</GradientLabel>
        <h2 className="flat-breaks sm:flat-none mt-5 text-center text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:mt-3 md:text-[32px]">
          Simple to use,
          <br /> easy to scale
        </h2>
        <p className="mt-3 text-center text-lg font-light leading-snug xl:text-base md:max-w-xs">
          Neon offers two ways to seamlessly integrate it into your product.
        </p>
        <LazyMotion features={domAnimation}>
          <div className="mt-11 w-full max-w-[716px] xl:mt-10 sm:hidden" aria-hidden>
            <div className="flex">
              {items.map(({ title }, index) => (
                <button
                  className={clsx(
                    'relative flex items-start rounded-t-md border px-5 py-4 text-xs font-medium uppercase leading-none tracking-wider transition-colors duration-200 last:grow xl:py-[14px]',
                    index === activeTab
                      ? 'border-x-gray-new-15 border-b-transparent border-t-gray-new-15 text-green-45'
                      : 'border-x-transparent border-b-gray-new-15 border-t-transparent text-white'
                  )}
                  type="button"
                  key={index}
                  onClick={() => setActiveTab(index)}
                >
                  <span
                    className={clsx(
                      'absolute -top-px left-0 h-px w-full bg-[linear-gradient(270deg,rgba(0,229,153,0.00)_6.54%,#00E599_47.88%,rgba(0,229,153,0.00)93.46%)] transition-opacity duration-200',
                      index === activeTab ? 'opacity-60' : 'opacity-0'
                    )}
                  />
                  <span className="relative">
                    <span
                      className={clsx(
                        'absolute h-full w-full rounded-3xl blur-[10px] transition-colors duration-200',
                        index === activeTab ? 'bg-green-45/30' : 'bg-transparent'
                      )}
                    />
                    {title}
                  </span>
                </button>
              ))}
            </div>

            <div className="rounded-b-md border-x border-b border-gray-new-15 pb-6 pl-5 pr-3 pt-6">
              <AnimatePresence initial={false} mode="wait">
                {items.map(
                  ({ code }, index) =>
                    index === activeTab && (
                      <m.div
                        className="dark"
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CodeBlock
                          className="code-block text-[15px]"
                          copyButtonClassName="!top-0"
                          language="sql"
                          isTrimmed={false}
                          showLineNumbers
                        >
                          {code}
                        </CodeBlock>
                      </m.div>
                    )
                )}
              </AnimatePresence>
            </div>
            {/* TODO: add link to "Learn more" button */}
            <AnimatePresence initial={false} mode="wait">
              {items.map(
                ({ text }, index) =>
                  index === activeTab && (
                    <m.p
                      className="mt-3 pl-5 text-[15px] font-light leading-none tracking-extra-tight text-gray-new-40"
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {text}{' '}
                      <Link
                        className="inline-flex items-center tracking-extra-tight"
                        theme="green"
                        to="#"
                      >
                        Learn more
                        <ArrowIcon className="ml-1" />
                      </Link>
                    </m.p>
                  )
              )}
            </AnimatePresence>
          </div>
        </LazyMotion>
        <div className="hidden w-full sm:mt-8 sm:flex sm:flex-col sm:space-y-7">
          {items.map(({ title, code, text }, index) => (
            <div key={index}>
              <div className="flex flex-col rounded-md border border-gray-new-15">
                <span className="px-4 py-3 text-xs font-medium uppercase leading-none tracking-wider">
                  {title}
                </span>
                <div className="dark border-t border-gray-new-15 py-3 pl-4 pr-2">
                  <CodeBlock
                    className="code-block text-[15px] sm:text-[13px]"
                    copyButtonClassName="!-top-2"
                    language="sql"
                    isTrimmed={false}
                    showLineNumbers
                  >
                    {code}
                  </CodeBlock>
                </div>
              </div>
              <p className="mt-2 text-sm font-light leading-dense tracking-extra-tight text-gray-new-40">
                {text}{' '}
                <Link
                  className="inline-flex items-center tracking-extra-tight"
                  theme="green"
                  to="#"
                >
                  Learn more
                  <ArrowIcon className="ml-1" />
                </Link>
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Integration;
