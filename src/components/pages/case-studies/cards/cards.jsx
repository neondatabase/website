'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { PropTypes } from 'prop-types';
import { useState, useMemo, useEffect, useCallback } from 'react';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import SearchIcon from 'icons/search.inline.svg';
import getLinkProps from 'utils/get-link-props';

const Card = ({ title, logo, externalUrl = '', isInternal, post = null }) => {
  const linkProps = getLinkProps({ externalUrl, isInternal, post });

  return (
    <li className="h-[170px] border-gray-new-20 last:border-r">
      <Link
        className={clsx(
          'group relative block size-full border-l border-t border-gray-new-20 bg-[#080808] transition-colors duration-200 hover:bg-gray-new-8'
        )}
        {...linkProps}
      >
        <div
          className={clsx(
            'relative z-10 flex size-full flex-col',
            'items-center justify-center p-6'
          )}
        >
          <Image
            className="h-8 w-fit"
            src={logo.mediaItemUrl}
            alt={title}
            width={logo.mediaDetails.width}
            height={logo.mediaDetails.height}
          />
        </div>
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
  borderRight: PropTypes.bool,
  borderBottom: PropTypes.bool,
};

Card.propTypes = CardPropTypes;

const getCategoryLabel = (slug) => (slug === 'all' ? 'All Stories' : null);

const Cards = ({ items, categories }) => {
  const [activeCategory, setActiveCategory] = useState({ slug: 'all' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const slugs = new Set(categories.map((c) => c.slug));

    const applyHash = () => {
      const raw = window.location.hash || '';
      const slug = raw.replace(/^#/, '').toLowerCase() || 'all';

      if (slug !== 'all' && !slugs.has(slug)) return;

      if (slug === 'all') {
        setActiveCategory({ slug: 'all' });
      } else {
        const cat = categories.find((c) => c.slug === slug);
        setActiveCategory({ slug, featuredCaseStudy: cat?.featuredCaseStudy });
      }
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);

    return () => window.removeEventListener('hashchange', applyHash);
  }, [categories]);

  const filteredByCategory = useMemo(
    () =>
      activeCategory.slug === 'all'
        ? items
        : items.filter((item) =>
            item.caseStudiesCategories.nodes.some((node) => node.slug === activeCategory.slug)
          ),
    [items, activeCategory]
  );

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return filteredByCategory;
    const q = searchQuery.trim().toLowerCase();
    return filteredByCategory.filter((item) => item.title?.toLowerCase().includes(q));
  }, [filteredByCategory, searchQuery]);

  const handleCategoryClick = useCallback((slug, featuredCaseStudy) => {
    setActiveCategory({ slug, featuredCaseStudy });
  }, []);

  return (
    <section
      className="main safe-paddings mt-40 scroll-mt-20 xl:mt-[136px] lg:mt-[104px] md:mt-20"
      id={activeCategory.slug}
    >
      <Container className="flex flex-col lg:!max-w-[1216px] md:px-5" size="1280">
        <h2 className="max-w-[736px] text-[48px] font-normal leading-dense tracking-tighter text-white md:text-4xl md:leading-tight sm:text-3xl">
          See how teams are building
          <br className="sm:hidden" /> the next era of Postgres on Neon.
        </h2>

        {/* Two-column: sidebar (256px) + cards grid */}
        <div className="mt-14 flex gap-16 lg:mt-12 lg:flex-col lg:gap-10 md:mt-9">
          {/* Sidebar: search + vertical categories */}
          <aside className="flex w-64 shrink-0 flex-col gap-8 lg:w-full lg:flex-row lg:flex-wrap lg:gap-6 md:gap-5">
            {/* Search bar - Figma .search */}
            <div className="flex flex-wrap items-center gap-3 border border-gray-new-20 bg-[#0C0D0D] px-3 py-1.5 pr-2.5">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <SearchIcon className="h-[15px] w-[15px] shrink-0 text-gray-new-60" aria-hidden />
                <input
                  type="search"
                  placeholder="Search stories..."
                  value={searchQuery}
                  className="min-w-0 flex-1 bg-transparent text-[15px] leading-snug tracking-tighter text-white placeholder:text-gray-new-60 focus:outline-none"
                  aria-label="Search case studies"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <nav className="flex flex-col gap-2" aria-label="Case study categories">
              {categories.map(({ name, slug, featuredCaseStudy }) => {
                const isActive = slug === activeCategory.slug;
                const label = getCategoryLabel(slug) ?? name;
                return (
                  <Link
                    key={slug}
                    href={`#${slug}`}
                    className={clsx(
                      'flex items-center justify-between gap-2.5 py-[7px] font-mono text-sm uppercase leading-[1.375] tracking-tight transition-colors hover:text-white',
                      isActive ? 'text-white' : 'text-gray-new-60'
                    )}
                    onClick={() => handleCategoryClick(slug, featuredCaseStudy)}
                  >
                    <span>{label}</span>
                    {isActive && <span className="h-2 w-2 shrink-0 bg-green-52" aria-hidden />}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <ul
            className={clsx(
              'grid min-w-0 flex-1 grid-cols-3 gap-0 self-start lg:grid-cols-2 md:grid-cols-1 [&>li:nth-child(3n)>a]:border-r',
              filteredItems.length % 3 !== 0 && '[&>li:nth-last-child(-n+3)>a]:border-b'
            )}
          >
            {filteredItems.map((item) => {
              const { id, title, caseStudyPost } = item;
              return <Card key={id} title={title} {...caseStudyPost} />;
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
};

Cards.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      caseStudyPost: PropTypes.object,
      caseStudiesCategories: PropTypes.shape({
        nodes: PropTypes.arrayOf(
          PropTypes.shape({
            slug: PropTypes.string,
            name: PropTypes.string,
          })
        ),
      }),
    })
  ).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
      featuredCaseStudy: PropTypes.string,
    })
  ).isRequired,
};

export default Cards;
