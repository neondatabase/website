import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';

import vector from './images/vector.png';

const PgVector = () => (
  <section className="pgvector safe-paddings mt-section relative">
    <Container className="!max-w-[640px] md:px-5">
      <h2 className="font-title text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px] md:leading-dense">
        Postgres as a vector{' '}
        <span className="relative mx-0.5 -mb-2.5 inline-block xl:-mb-1.5 lg:mx-1 lg:-mb-1">
          <Image
            className="relative z-10 xl:size-10 lg:size-8 md:size-7"
            src={vector}
            alt=""
            width={46}
            height={46}
            quality={100}
          />
          <span
            className="absolute left-1/2 top-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6AFFE6] opacity-15 blur-xl"
            aria-hidden
          />
        </span>{' '}
        store with&nbsp;the pgvector extension
      </h2>
      <div
        className={clsx(
          'mt-11 space-y-6 text-[28px] tracking-extra-tight text-gray-new-60',
          '[&_a]:text-white [&_span]:text-white',
          '[&_a]:border-b [&_a]:border-gray-new-70 [&_a]:transition-colors [&_a]:duration-200',
          '[&_a:hover]:border-green-45/40 [&_a:hover]:text-green-45',
          'lg:mt-10 lg:text-2xl md:mt-7 md:space-y-5 md:text-xl'
        )}
      >
        <p>
          <a href="/docs/extensions/pgvector">The pgvector extension</a> lets you{' '}
          <span>store vector embeddings in Postgres and perform similarity searches</span> using
          built-in operators and indexes.
        </p>
        <p>
          <span>It’s valuable for natural language processing tasks</span> like semantic search,
          question answering, and other apps built on OpenAI’s GPT models.
        </p>
      </div>
    </Container>
  </section>
);

export default PgVector;
