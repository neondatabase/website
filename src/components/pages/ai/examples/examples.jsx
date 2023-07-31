import React from 'react';

import CardItemsList from 'components/shared/card-items-list';
import Container from 'components/shared/container';
import GradientLabel from 'components/shared/gradient-label';
import Heading from 'components/shared/heading';

import chatbotIcon from './images/chatbot.svg';
import imageSearchIcon from './images/image-search.svg';
import semanticSearchIcon from './images/semantic-search.svg';

// TODO: add app links and real descriptions
const exampleApps = [
  {
    icon: chatbotIcon,
    title: 'Chatbot',
    description: 'Enhance chatbot memory with content-based long-term retention.',
    url: '/docs/guides/oauth-integration',
  },
  {
    icon: imageSearchIcon,
    title: 'Image search',
    description: 'Combine semantic and full-text search with powerful SQL filtering.',
    url: 'https://neon-experimental.vercel.app/',
  },
  {
    icon: semanticSearchIcon,
    title: 'Semantic search',
    description: 'Search your own knowledge base by semantic similarity.',
    url: '/blog/api-cf-drizzle-neon',
  },
];

const Examples = () => (
  <section className="safe-paddings mt-40 bg-black-new xl:mt-[120px] lg:mt-28 md:mt-20">
    <Container size="medium" className="grid grid-cols-12 gap-x-10 xl:gap-x-6 md:gap-x-4">
      <div className="col-span-10 col-start-2 flex flex-col items-center xl:col-span-full xl:col-start-1">
        <GradientLabel>Integrate</GradientLabel>
        <Heading
          className="flat-breaks sm:flat-none mt-3 text-center text-[52px] font-medium leading-none tracking-extra-tight xl:mt-4 xl:text-[44px] lg:text-4xl md:mt-3 md:max-w-xs md:text-[32px]"
          tag="h2"
        >
          What can you
          <br /> build with Neon?
        </Heading>
        <p className="mt-3 text-center text-lg font-light leading-snug xl:text-base md:max-w-xs">
          See the example apps using Neon for LLMs and AI applications
        </p>
        <CardItemsList
          className="mt-14 gap-x-7 xl:mt-10 xl:gap-x-6 lg:gap-x-4 md:mt-8 md:gap-y-4"
          items={exampleApps}
          size="lg"
        />
      </div>
    </Container>
  </section>
);

export default Examples;
