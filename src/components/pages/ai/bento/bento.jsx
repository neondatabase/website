import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border/index';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import aiAgentsMobile from './images/ai-agents-mobile.jpg';
import aiAgents from './images/ai-agents.jpg';
import aiAssistedMobile from './images/ai-assisted-mobile.jpg';
import aiAssisted from './images/ai-assisted.jpg';
import instantlyAccessibleMobile from './images/instantly-accessible-mobile.jpg';
import instantlyAccessible from './images/instantly-accessible.jpg';
import vectorStoreMobile from './images/vector-store-mobile.jpg';
import vectorStore from './images/vector-store.jpg';

const ITEMS = [
  {
    title: 'Backend for AI agents.',
    description:
      'Agents can provision, query, and manage Postgres databases via API. With quotas and autosuspend out of the box.',
    image: aiAgents,
    imageMobile: aiAgentsMobile,
  },
  {
    title: 'Vector store for RAG and LLMs.',
    description: (
      <>
        With <Link href={LINKS.docsPgvector}>pgvector</Link> and HNSW, Neon becomes a vector store
        for all your data.
      </>
    ),
    image: vectorStore,
    imageMobile: vectorStoreMobile,
  },
  {
    title: 'Ready for AI-assisted coding.',
    description: 'Neon integrates with Cursor and Copilot for seamless in-IDE database workflows.',
    image: aiAssisted,
    imageMobile: aiAssistedMobile,
  },
  {
    title: 'Instantly accessible.',
    description: [
      <>
        Neon can be embedded directly into agent workflows, no signup required. For developers, it’s
        just as easy - start building on the <Link href={LINKS.pricing}>Free Plan</Link> in seconds.
      </>,
    ],
    image: instantlyAccessible,
    imageMobile: instantlyAccessibleMobile,
  },
];

const Bento = () => (
  <section className="bento safe-paddings mt-[200px] xl:mt-[192px] lg:mt-40 md:mt-[105px]">
    <Container className="lg:!max-w-3xl md:px-5" size="960">
      <div className="mx-auto flex max-w-[832px] flex-col text-pretty lg:max-w-xl">
        <h2 className="max-w-2xl font-title text-5xl font-medium leading-none tracking-extra-tight xl:max-w-xl xl:text-[44px] lg:mr-10 lg:text-4xl md:mr-0 md:text-[32px]">
          The database AI-native apps were waiting for
        </h2>
        <p className="mt-4 max-w-[740px] text-lg leading-snug tracking-extra-tight text-gray-new-70 xl:text-balance lg:text-pretty lg:text-base md:mt-3">
          Neon is a serverless Postgres platform built for modern AI workflows. It separates storage
          and compute, autoscales to zero, and lets agents create databases without friction.
        </p>
      </div>
      <ul className="mt-14 flex flex-wrap gap-5 lg:mt-12 lg:gap-4 md:mt-8 md:flex-col md:items-center">
        {ITEMS.map(({ title, description, image, imageMobile }, index) => (
          <li
            className={clsx(
              'relative h-[384px] rounded-[14px] bg-[#0A0A0A] lg:h-[308px] md:h-[324px] md:w-80'
            )}
            key={title}
          >
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 pr-8 text-lg leading-snug tracking-extra-tight lg:p-5 lg:text-base">
              <h3 className="inline font-medium text-white">{title}</h3>{' '}
              <p className="text-with-links inline font-light text-gray-new-60">{description}</p>
            </div>
            <div className="relative h-full shrink-0 overflow-hidden rounded-[inherit]">
              <Image
                className="relative h-full w-auto lg:hidden md:block md:h-auto md:w-full"
                src={image}
                alt=""
                width={[0, 3].includes(index) ? 544 : 396}
                height={384}
                quality={100}
                priority
              />
              <Image
                className="relative hidden h-full w-auto lg:block md:hidden md:h-auto md:w-full"
                src={imageMobile}
                alt=""
                width={[0, 3].includes(index) ? 414 : 274}
                height={384}
                quality={100}
                priority
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
