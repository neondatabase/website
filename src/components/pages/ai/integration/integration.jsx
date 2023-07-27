'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useState } from 'react';

import CodeBlock from 'components/shared/code-block/code-block';
import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';

const items = [
  {
    title: 'Create extension',
    code: `    CREATE EXTENSION embedding;
    CREATE TABLE items(embedding real[]);`,
  },
  {
    title: 'Similarity search',
    code: `    SELECT * FROM items
    ORDER BY embedding <-> '{1, 2, 3}'::real[];`,
  },
  {
    title: 'Migration from pgvector',
    code: `    ALTER TABLE items
    ALTER COLUMN embedding`,
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
        <div className="mt-11 max-w-[716px]">
          <div>
            {items.map(({ title }, index) => (
              <button
                className={clsx(
                  'relative rounded-t-md px-5 py-4 text-xs font-medium uppercase leading-none tracking-extra-tight transition-colors duration-200 before:transition-colors before:duration-200',
                  index === activeTab
                    ? 'border-x border-t border-gray-new-15/60 text-green-45 before:absolute before:inset-x-4 before:inset-y-4 before:rounded-3xl before:bg-green-45/30 before:blur-[10px]'
                    : 'border-b border-gray-new-15/60 text-white'
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

                {title}
              </button>
            ))}
          </div>
          <div className="border-x border-b border-gray-new-15/60 pb-7 pl-[18px] pt-[18px] lg:pb-6 lg:pl-3.5 lg:pt-3.5 md:py-4 md:pl-4">
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
        </div>
      </Container>
    </section>
  );
};

export default Integration;
