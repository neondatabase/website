import React from 'react';

import Container from 'components/shared/container';
import GradientLabel from 'components/shared/gradient-label';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import ArrowRightIcon from 'icons/arrow-right-thin.inline.svg';

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
    title: 'Image Search',
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
  <section className="safe-paddings mt-[200px] bg-black-new">
    <Container size="medium" className="grid grid-cols-12 gap-x-10 xl:gap-x-6 lt:gap-x-4">
      <div className="col-span-10 col-start-2 mt-12 flex flex-col items-center">
        <GradientLabel>Integrate</GradientLabel>
        <Heading tag="h2" className="mt-3 text-[52px] font-medium leading-none tracking-tighter">
          What can you build with Neon?
        </Heading>
        <p className="mt-3 text-lg font-light leading-snug">
          See the example apps using Neon for LLMs and AI applications
        </p>
        <ul className="mt-14 flex items-stretch gap-x-7">
          {exampleApps.map(({ icon, title, description, url }, index) => (
            <li className="flex grow basis-1/3" key={index}>
              <Link
                className="group flex flex-col rounded-[10px] border border-gray-new-15 px-5 pb-4 pt-5 transition-colors duration-200 hover:border-green-45 xl:min-h-[165px] xl:p-3.5 lg:min-h-max lg:p-4 md:flex-row md:gap-x-3"
                to={url}
                target={url.startsWith('http') ? '_blank' : '_self'}
                rel={url.startsWith('http') ? 'noopener noreferrer' : ''}
              >
                <img
                  className="h-8 w-8 md:h-7 md:w-7"
                  loading="lazy"
                  src={icon}
                  alt=""
                  width={32}
                  height={32}
                  aria-hidden
                />
                <div className="mt-[38px] xl:mt-8 lg:mt-7 md:mt-0">
                  <h4 className="text-xl leading-tight tracking-[-0.02em] xl:text-lg">{title}</h4>
                  <p className="mb-9 mt-1.5 text-[15px] font-light leading-tight text-gray-new-70 md:mt-2.5">
                    {description}
                  </p>
                  <div className="mt-auto inline-flex items-center text-green-45 transition-colors duration-200 group-hover:text-primary-2">
                    <span className="text-[15px]">View example</span>
                    <ArrowRightIcon className="ml-2 shrink-0" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default Examples;
