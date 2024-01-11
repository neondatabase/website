import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import ChevronIcon from 'icons/chevron.inline.svg';

import chatbotIllustration from './images/chatbot.jpg';
import pingthingIllustration from './images/pingthing.jpg';
import semanticSearchIllustration from './images/semantic-search.jpg';

const items = [
  {
    image: pingthingIllustration,
    imageWidth: 716,
    imageHeight: 512,
    title:
      'Ping Thing: Ping a Neon Serverless Postgres database using a Vercel Edge Function to see the journey your request makes',
    demoLink: '/',
    sourceLink: '/',
  },
  {
    image: semanticSearchIllustration,
    imageWidth: 464,
    imageHeight: 216,
    title:
      'Semantic search: Submit your idea and get a list of similar ideas that YCombinator has invested in before',
    demoLink: '/',
    sourceLink: '/',
  },
  {
    image: chatbotIllustration,
    imageWidth: 464,
    imageHeight: 216,
    title: 'Chatbot: Search your own knowledge base by semantic similarity',
    demoLink: '/',
    sourceLink: '/',
  },
];

const Hero = () => (
  <section className="hero safe-paddings pt-36">
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2">
        <h1 className="text-6xl font-medium leading-none tracking-extra-tight">
          <span className="text-green-45">Serverless showcase:</span>
          <br /> unleashing the power of Neon
        </h1>
        <p className="mt-5 text-xl font-light leading-snug">
          Explore interactive demos unveiling cutting-edge apps in the serverless era.
        </p>
        <div className="mt-20">
          <h2 className="flex items-center text-xs font-semibold uppercase leading-none tracking-[0.02em] text-green-45">
            <span>Featured</span>
            <span className="ml-2 h-px grow bg-gray-new-20" />
          </h2>
          <ul className="grid-gap-x mt-6 grid grid-cols-10 grid-rows-[auto,auto] gap-y-9">
            {items.map(({ image, imageWidth, imageHeight, title, demoLink, sourceLink }, index) => (
              <li
                className={clsx(index === 0 ? 'col-span-6 row-span-full' : 'col-span-4')}
                key={index}
              >
                <article>
                  <Image
                    className="rounded-[10px]"
                    src={image}
                    width={imageWidth}
                    height={imageHeight}
                    alt=""
                    priority
                  />
                  <h3
                    className={clsx(
                      'font-medium tracking-tighter',
                      index === 0
                        ? 'mt-[38px] max-w-[630px] text-[28px] leading-dense'
                        : 'mt-5 text-lg leading-tight'
                    )}
                  >
                    {title}
                  </h3>
                  <div className="mt-4 flex items-center justify-start gap-x-4 text-[15px] leading-none">
                    <Link
                      className="flex items-center rounded-full bg-gray-new-15 px-4 py-2"
                      to={demoLink}
                    >
                      <ChevronIcon className="mr-2" />
                      Live Demo
                    </Link>
                    <Link className="text-gray-new-70" to={sourceLink}>
                      Source
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
