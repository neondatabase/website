'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useState } from 'react';

import CodeBlock from 'components/shared/code-block/code-block';
import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';
import Link from 'components/shared/link/link';
import ArrowIcon from 'icons/arrow-sm.inline.svg';

const items = [
  {
    title: 'Create extension',
    code: `    CREATE EXTENSION embedding CREATE TABLE items(embedding real[]);`,
  },
  {
    title: 'Similarity search',
    code: `    SELECT id FROM items ORDER BY embedding <-> ARRAY[1.1, 2.2, 3.3];`,
  },
  {
    title: 'Migration from pgvector',
    code: `    SELECT vector::real[] AS converted_vector FROM vector_items`,
  },
];

const Integration = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section className="integration safe-paddings mt-48">
      <Container className="flex flex-col items-center" size="medium">
        <GradientLabel>Getting Started</GradientLabel>
        <h2 className="mt-5 text-5xl font-medium leading-none tracking-extra-tight">
          Simple to use, easy to scale
        </h2>
        <p className="mt-3 text-lg font-light leading-snug">
          Neon offers two ways to seamlessly integrate it into your product.
        </p>
        <div className="mt-11 w-full max-w-[716px]">
          <div className="flex">
            {items.map(({ title }, index) => (
              <button
                className={clsx(
                  'relative flex items-start rounded-t-md px-5 py-4 text-xs font-medium uppercase leading-none tracking-extra-tight transition-colors duration-200 last:grow',
                  index === activeTab
                    ? 'border-x border-t border-gray-new-15 text-green-45'
                    : 'border-b border-gray-new-15 text-white'
                )}
                type="button"
                key={index}
                onClick={() => setActiveTab(index)}
              >
                <span
                  className={clsx(
                    'absolute left-0 top-0 h-px w-full bg-[linear-gradient(270deg,rgba(0,229,153,0.00)_6.54%,#00E599_47.88%,rgba(0,229,153,0.00)93.46%)] transition-opacity duration-200',
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
          <div className="rounded-b-md border-x border-b border-gray-new-15 pb-6 pl-5 pr-3 pt-6 lg:pb-6 lg:pl-3.5 lg:pt-3.5 md:py-4 md:pl-4">
            <LazyMotion features={domAnimation}>
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
            </LazyMotion>
          </div>
          {/* TODO: add link to "Learn more" button */}
          <p className="mt-3 text-[15px] font-light leading-none tracking-extra-tight text-gray-new-40">
            Easily switch to pg_embedding in your Postgres and LangChain projects.{' '}
            <Link className="inline-flex items-center tracking-extra-tight" theme="green" to="#">
              Learn more
              <ArrowIcon className="ml-1" />
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
};

export default Integration;
