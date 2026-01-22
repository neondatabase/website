import clsx from 'clsx';
import Image from 'next/image';

import Container from 'components/shared/container';
import GradientBorder from 'components/shared/gradient-border/index';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import everythingMobile from './images/everything-mobile.jpg';
import everything from './images/everything.jpg';
import indexingMobile from './images/indexing-mobile.jpg';
import indexing from './images/indexing.jpg';
import pgvectorMobile from './images/pgvector-mobile.jpg';
import pgvector from './images/pgvector.jpg';
import sqlNativeMobile from './images/sql-native-mobile.jpg';
import sqlNative from './images/sql-native.jpg';

const ITEMS = [
  {
    title: 'Postgres for everything',
    description:
      'Combine vector search, full-text search, relational data, and SQL analytics in a single system. No glue code between databases.',
    image: everything,
    imageMobile: everythingMobile,
  },
  {
    title: 'pgvector built in',
    description:
      'Store and search vector embeddings using pgvector, with native support for HNSW indexing and multiple distance metrics.',
    image: pgvector,
    imageMobile: pgvectorMobile,
  },
  {
    title: 'Faster, cheaper indexing',
    description:
      'Neon’s autoscaling serverless architecture handles indexing at scale, with 75% lower compute costs.',
    image: indexing,
    imageMobile: indexingMobile,
  },
  {
    title: 'SQL-native, dev-friendly',
    description:
      'Neon supports standard SQL, integrates easily into your stack, and reduces time-to-value for production RAG systems.',
    image: sqlNative,
    imageMobile: sqlNativeMobile,
  },
];

const Usage = () => (
  <section className="usage safe-paddings relative mt-[196px] xl:mt-[188px] lg:mt-[159px] md:mt-[102px]">
    <Container className="md:max-w-sm md:px-5" size="960">
      <h2 className="font-title text-5xl font-medium leading-none tracking-extra-tight xl:text-[44px] lg:text-4xl md:text-[32px]">
        Build LLM-backed applications
      </h2>
      <p className="mt-3 max-w-lg text-balance text-lg leading-snug tracking-tight text-gray-new-70 lg:text-base md:text-wrap">
        Neon makes Postgres a powerful vector store, perfect for RAG apps that crave simplicity.
      </p>
      <Link
        className="mt-6 text-lg leading-none tracking-[-0.03em] lg:mt-5 lg:text-base"
        to={LINKS.docsAi}
        theme="white"
        withArrow
      >
        Start building
      </Link>

      <ul className="mt-[78px] flex flex-col gap-[120px] xl:mt-[68px] lg:mt-[60px] lg:gap-[104px] md:mx-auto md:mt-10 md:mt-[60px] md:gap-14">
        {ITEMS.map(({ title, description, image, imageMobile }, index) => (
          <li
            className="grid grid-cols-2 items-center gap-16 lg:gap-8 md:grid-cols-1 md:gap-5"
            key={title}
          >
            <div>
              <h3 className="text-2xl font-medium leading-snug tracking-extra-tight lg:text-xl md:text-xl">
                {title}
              </h3>
              <p
                className="mt-2 text-lg leading-normal tracking-extra-tight text-gray-new-70 lg:text-base md:mt-2"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
            <div
              className={clsx(
                'relative shrink-0 overflow-hidden rounded-[14px] md:-order-1',
                index % 2 === 0 && '-order-1'
              )}
            >
              <Image
                className="lg:hidden"
                src={image}
                alt=""
                width={448}
                height={262}
                quality={100}
                loading="lazy"
              />
              <Image
                className="hidden lg:block"
                src={imageMobile}
                alt=""
                width={336}
                height={228}
                quality={100}
                loading="lazy"
              />
              <GradientBorder withBlend />
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Usage;
