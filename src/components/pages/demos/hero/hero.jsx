import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import ChevronIcon from 'icons/chevron.inline.svg';

import chatbotIllustration from './images/chatbot.jpg';
import playgroundIllustration from './images/playground.jpg';
import semanticSearchIllustration from './images/semantic-search.jpg';

const items = [
  {
    image: chatbotIllustration,
    imageWidth: 716,
    imageHeight: 512,
    title: 'Chatbot: Search your own knowledge base by semantic similarity',
    demoLink: '#',
    sourceLink: 'https://github.com/neondatabase/ask-neon',
  },
  {
    image: semanticSearchIllustration,
    imageWidth: 464,
    imageHeight: 216,
    title:
      'Semantic search: Submit your idea and get a list of similar ideas that YCombinator has invested in before',
    demoLink: 'https://yc-idea-matcher.vercel.app/',
    sourceLink: 'https://github.com/neondatabase/yc-idea-matcher',
  },
  {
    image: playgroundIllustration,
    imageWidth: 464,
    imageHeight: 234,
    title:
      'Postgres AI Playground: an SQL playground for Postgres where you can use AI to generate queries using natural language',
    demoLink: '/demos/playground',
    sourceLink: 'https://github.com/neondatabase/postgres-ai-playground',
  },
];

const Hero = () => (
  <section className="hero safe-paddings pt-36 xl:pt-32 lg:pt-14 md:pt-10">
    <Container className="grid-gap-x grid grid-cols-12 lg:grid-cols-1" size="medium">
      <div className="col-span-10 col-start-2 lg:col-span-full lg:col-start-1">
        <h1 className="font-title text-6xl font-medium leading-none tracking-extra-tight xl:text-[56px] lg:text-5xl md:text-4xl sm:text-3xl">
          <span className="text-green-45">Serverless showcase:</span>
          <br /> build with Neon
        </h1>
        <p className="lg:text-4 mt-5 text-xl font-light leading-snug lg:text-xl md:text-base">
          Explore interactive demos from the community and the Neon team.
        </p>
        <div className="mt-20 lg:mt-16 md:mt-10">
          <h2 className="flex items-center font-title text-xs font-medium uppercase leading-none tracking-[0.02em] text-green-45">
            <span>Featured</span>
            <span className="ml-2 h-px grow bg-gray-new-20" />
          </h2>
          <ul className="mt-6 grid grid-cols-10 grid-rows-2 gap-x-10 gap-y-7 lg:grid-cols-2 md:grid-cols-1">
            {items.map(({ image, imageWidth, imageHeight, title, demoLink, sourceLink }, index) => (
              <li
                className={clsx(
                  index === 0
                    ? 'col-span-6 row-span-full lg:col-span-2'
                    : 'col-span-4 lg:col-span-1',
                  'md:col-span-1'
                )}
                key={index}
              >
                <Image
                  className="rounded-[10px] lg:h-auto lg:w-full"
                  src={image}
                  width={imageWidth}
                  height={imageHeight}
                  alt=""
                  sizes={
                    index === 0
                      ? '(min-width: 1023px) 100vw, 716px'
                      : '(min-width: 1023px) 50vw, (min-width: 767px) 100vw, 464px'
                  }
                  quality={90}
                  priority
                />
                <h3
                  className={clsx(
                    'font-medium tracking-tighter',
                    index === 0
                      ? 'mt-[38px] max-w-[630px] text-[28px] leading-dense xl:text-2xl'
                      : 'mt-5 text-lg leading-tight',
                    'md:text-xl'
                  )}
                >
                  {title}
                </h3>
                <div className="mt-4 flex items-center justify-start gap-x-4 text-[15px] leading-none">
                  {demoLink !== '#' && (
                    <Link
                      className="flex items-center rounded-full bg-gray-new-15 bg-opacity-80 px-5 py-3 text-[15px] font-medium leading-none transition-colors duration-200 hover:bg-gray-new-20"
                      to={demoLink}
                      target={demoLink.startsWith('http') ? '_blank' : '_self'}
                      rel={demoLink.startsWith('http') ? 'noopener noreferrer' : ''}
                    >
                      <ChevronIcon className="mr-2" />
                      Live demo
                    </Link>
                  )}
                  <Link
                    className="text-[15px] leading-none"
                    to={sourceLink}
                    target="_blank"
                    theme="gray-80"
                    rel="noopener noreferrer"
                  >
                    Source
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
