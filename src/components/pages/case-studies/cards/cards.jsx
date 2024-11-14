'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { PropTypes } from 'prop-types';
import { useState, useMemo } from 'react';

// import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Link from 'components/shared/link';
// import useWindowSize from 'hooks/use-window-size';
import ArrowIcon from 'icons/arrow-sm.inline.svg';
// import ChevronIcon from 'icons/chevron-down.inline.svg';
import getLinkProps from 'utils/get-link-props';

const Card = ({
  title,
  logo,
  quote,
  author,
  externalUrl = '',
  isInternal,
  post = null,
  isFeatured = false,
}) => {
  const linkProps = getLinkProps({ externalUrl, isInternal, post });

  return (
    <li className={clsx(isFeatured ? '-order-1 row-span-2 h-[380px]' : 'h-[180px]')}>
      <Link className="group relative block size-full rounded-lg bg-[#080808]" {...linkProps}>
        <div
          className={clsx(
            'relative z-10 flex size-full flex-col',
            isFeatured ? 'justify-between p-6' : 'items-center justify-center'
          )}
        >
          <Image
            className="h-8 w-fit"
            src={logo.mediaItemUrl}
            alt={title}
            width={logo.mediaDetails.width}
            height={logo.mediaDetails.height}
          />
          {isFeatured && (
            <figure className="mt-auto w-full">
              {quote && (
                <>
                  <blockquote>
                    <p
                      className="text-pretty text-lg font-light leading-snug tracking-extra-tight text-white sm:text-base"
                      dangerouslySetInnerHTML={{ __html: `“${quote}”` }}
                    />
                  </blockquote>
                  {author && author.name && (
                    <figcaption className="mt-2 text-sm font-light leading-snug tracking-extra-tight text-gray-new-70">
                      {author.name}{' '}
                      <cite>
                        {author?.post && <span className="not-italic">— {author?.post}</span>}
                      </cite>
                    </figcaption>
                  )}
                </>
              )}
              <div
                className={clsx(
                  'mt-[18px] inline-flex items-center text-[15px] leading-none tracking-tight lg:mt-4',
                  'text-white transition-colors duration-200 group-hover:text-green-45'
                )}
                {...linkProps}
              >
                Read story
                <ArrowIcon className="ml-1.5" />
              </div>
            </figure>
          )}
        </div>
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="absolute -left-4 -top-20 h-[235px] w-[165%] rounded-full bg-[#166B70] opacity-20 blur-3xl" />
          <span className="absolute -right-3 -top-40 h-[250px] w-[60%] rotate-45 rounded-full bg-[#48C2CB] opacity-30 blur-3xl" />
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100" />
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] border border-gray-new-20 transition-opacity duration-300 group-hover:opacity-0" />
      </Link>
    </li>
  );
};

export const CardPropTypes = {
  title: PropTypes.string.isRequired,
  logo: PropTypes.shape({
    mediaItemUrl: PropTypes.string.isRequired,
    mediaDetails: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  }),
  quote: PropTypes.string,
  author: PropTypes.shape({
    name: PropTypes.string,
    post: PropTypes.string,
  }),
  isInternal: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  externalUrl: PropTypes.string,
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }),
  isFeatured: PropTypes.bool,
};

Card.propTypes = CardPropTypes;

const Cards = ({ items, categories }) => {
  const [activeCategory, setActiveCategory] = useState({ slug: 'all' });
  // const [isOpen, setIsOpen] = useState(false);
  // const { width: windowWidth } = useWindowSize();
  // const itemsToShow = windowWidth < 768 ? 10 : 17;

  const filteredItems = useMemo(
    () =>
      activeCategory.slug === 'all'
        ? items
        : items.filter((item) =>
            item.caseStudiesCategories.nodes.some((node) => node.slug === activeCategory.slug)
          ),
    [items, activeCategory]
  );

  // const hasHiddenItems = filteredItems.length > itemsToShow;
  // const limitedItems =
  //   hasHiddenItems && isOpen ? filteredItems : filteredItems.slice(0, itemsToShow);

  return (
    <section className="main safe-paddings mt-40 xl:mt-[136px] lg:mt-[104px] md:mt-20">
      <Container className="flex flex-col items-center lg:!max-w-3xl md:px-5" size="960">
        <h2 className="sr-only">All success stories</h2>
        <p className="text-center text-lg leading-snug tracking-extra-tight text-gray-new-60 sm:max-w-64 sm:text-base">
          Powering ambitious product teams of all shapes and sizes
        </p>
        <div className="mt-7 max-w-full overflow-hidden rounded-full border border-gray-new-15 bg-black-new xl:mt-6 lg:mt-5 sm:mt-[18px]">
          <ul className="no-scrollbars flex h-12 items-center overflow-x-auto px-1.5">
            {categories.map(({ name, slug, featuredCaseStudy }, index) => (
              <li className="group" key={index}>
                <button
                  className={clsx(
                    'flex h-9 items-center whitespace-nowrap rounded-full px-6 font-medium tracking-extra-tight',
                    'border transition-colors duration-200 hover:text-green-45',
                    slug === activeCategory.slug
                      ? 'border-[#1B2C2E] bg-[#132628]/50 text-green-45'
                      : 'border-transparent text-gray-new-50'
                  )}
                  type="button"
                  onClick={() => setActiveCategory({ slug, featuredCaseStudy })}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <ul className="mt-16 grid w-full grid-cols-3 gap-5 xl:mt-14 lg:mt-12 lg:grid-cols-2 md:mt-9 sm:grid-cols-1">
          {filteredItems.map(({ id, title, caseStudyPost }, index) => {
            const isFeatured = activeCategory.featuredCaseStudy
              ? id === activeCategory.featuredCaseStudy
              : index === 0;

            return <Card key={index} title={title} {...caseStudyPost} isFeatured={isFeatured} />;
          })}
        </ul>
        {/* Show more button */}
        {/* {hasHiddenItems && !isOpen && (
          <Button
            className="mx-auto mt-16 h-[38px] rounded-full px-5 text-[15px] font-medium transition-colors duration-200 xl:mt-14 lg:mt-12 md:mt-9"
            theme="gray-10"
            onClick={() => setIsOpen(true)}
          >
            Show more
            <ChevronIcon className="ml-2.5 inline-block h-auto w-3" />
          </Button>
        )} */}
      </Container>
    </section>
  );
};

Cards.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      caseStudy: PropTypes.shape(CardPropTypes),
    })
  ).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
    })
  ).isRequired,
};

export default Cards;
