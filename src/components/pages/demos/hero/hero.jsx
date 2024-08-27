import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import ChevronIcon from 'icons/chevron.inline.svg';

import databaseCopyIllustration from './images/database-copy.jpg';
import provisioningIllustration from './images/provisioning.jpg';
import trackingLatencyIllustration from './images/tracking-latency.jpg';

const items = [
  {
    image: provisioningIllustration,
    imageWidth: 716,
    imageHeight: 548,
    title: 'Postgres in under a second: Instantly provison a Postgres database on Neon',
    demoLink: '/demos/instant-postgres',
    sourceLink: 'https://github.com/neondatabase/instant-postgres',
  },
  {
    image: trackingLatencyIllustration,
    imageWidth: 464,
    imageHeight: 216,
    title:
      "Tracking the latency between cloud hosting platforms and Neon's Postgres database regions",
    demoLink: '/demos/regional-latency',
    sourceLink: 'https://github.com/neondatabase/regional-latency',
  },
  {
    image: databaseCopyIllustration,
    imageWidth: 464,
    imageHeight: 216,
    title:
      'Create a copy of your database, make changes to it, and restore it to the original state in milliseconds',
    demoLink: 'https://neon-demos-branching.vercel.app/',
    sourceLink: 'https://github.com/neondatabase/branching-demo',
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
        <p className="mt-5 text-xl font-light leading-snug tracking-extra-tight lg:text-xl md:text-base">
          Explore interactive demos from the community and the Neon team.
        </p>
        <div className="mt-20 lg:mt-16 md:mt-10">
          <h2 className="flex items-center font-title text-xs font-medium uppercase leading-none -tracking-extra-tight text-green-45">
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
                  quality={95}
                  priority
                />
                <h3
                  className={clsx(
                    'font-medium',
                    index === 0
                      ? 'mt-9 max-w-[630px] text-[28px] leading-dense tracking-tighter xl:text-2xl'
                      : 'mt-[21px] text-lg leading-tight tracking-extra-tight',
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
                    className="flex items-center text-[15px] leading-none"
                    to={sourceLink}
                    target="_blank"
                    theme="gray-80"
                    rel="noopener noreferrer"
                    withArrow
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
