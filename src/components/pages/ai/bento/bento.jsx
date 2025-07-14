import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border/index';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import aiAgents from './images/ai-agents.jpg';
import aiAssisted from './images/ai-assisted.jpg';
import instantlyAccessible from './images/instantly-accessible.jpg';
import vectorStore from './images/vector-store.jpg';

const ITEMS = [
  {
    title: 'Backend for AI agents.',
    description:
      'Agents can provision, query, and manage Postgres databases via API. With quotas and autosuspend out of the box.',
    image: aiAgents,
  },
  {
    title: 'Vector store for RAG and LLMs.',
    description: 'With pgvector and HNSW, Neon becomes a vector store for all your data.',
    image: vectorStore,
  },
  {
    title: 'Ready for AI-assisted coding.',
    description: 'Neon integrates with Cursor and Copilot for seamless in-IDE database workflows.',
    image: aiAssisted,
  },
  {
    title: 'Instantly accessible.',
    description: [
      <>
        Neon can be embedded directly into agent workflows, no signup required. For developers, it’s
        just as easy - start building on the{' '}
        <Link className="underline-offset-4" theme="green-underlined" href={LINKS.pricing}>
          Free Plan
        </Link>{' '}
        in seconds.
      </>,
    ],
    image: instantlyAccessible,
  },
];

const Bento = () => (
  <section className="bento safe-paddings mt-[200px] xl:mt-[176px] lg:mt-[152px] md:mt-[104px]">
    <Container className="lg:!max-w-3xl md:px-5" size="960">
      <div className="mx-auto flex max-w-[832px] flex-col text-pretty">
        <h2 className="max-w-2xl font-title text-5xl font-medium leading-none tracking-extra-tight lg:text-4xl md:text-[32px]">
          The database AI-native apps were waiting for
        </h2>
        <p className="mt-4 text-lg leading-snug tracking-extra-tight text-gray-new-70 lg:text-base">
          Neon is a serverless Postgres platform built for modern AI workflows. It separates storage
          and compute, autoscales to zero, and lets agents create databases without friction.
        </p>
      </div>
      <ul className="mt-14 flex flex-wrap gap-5 lg:mt-12 lg:gap-4 md:flex-col md:items-center">
        {ITEMS.map(({ title, description, image }, index) => (
          <li
            className={clsx('relative h-[384px] rounded-[14px] bg-[#0A0A0A] lg:h-[281px] md:w-80')}
            key={title}
          >
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 pr-8 text-lg leading-snug tracking-extra-tight lg:p-5 lg:text-base">
              <h3 className="inline font-medium text-white">{title}</h3>{' '}
              <p className="inline font-light text-gray-new-60">{description}</p>
            </div>
            <div className="relative h-full shrink-0 overflow-hidden rounded-[inherit]">
              <Image
                className="relative h-full w-auto md:h-auto md:w-full"
                src={image}
                alt=""
                width={[0, 3].includes(index) ? 544 : 396}
                height={384}
                quality={100}
              />
              <GradientBorder withBlend />
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Bento;
