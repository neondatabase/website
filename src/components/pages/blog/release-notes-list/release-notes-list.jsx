'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import useWindowSize from 'hooks/use-window-size';
import getExcerpt from 'utils/get-excerpt';
import getReleaseNotesCategoryFromSlug from 'utils/get-release-notes-category-from-slug';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const XL_WIDTH = 1279;
const LG_WIDTH = 1023;
const MD_WIDTH = 767;

const ReleaseNotesList = ({ items }) => {
  const [releaseNotes, setReleaseNotes] = useState(items);
  const { width } = useWindowSize();

  useEffect(() => {
    const handleResize = () => {
      switch (true) {
        case width <= XL_WIDTH && width > LG_WIDTH:
          setReleaseNotes(items.slice(0, 3));
          break;
        case width <= LG_WIDTH && width > MD_WIDTH:
          setReleaseNotes(items.slice(0, 2));
          break;
        case width <= MD_WIDTH:
          setReleaseNotes(items.slice(0, 4));
          break;
        default:
          setReleaseNotes(items.slice(0, 4));
          break;
      }
    };

    handleResize();
  }, [items, width]);

  return (
    <section className="release-notes-list rounded-xl bg-black-new px-10 pb-10 pt-7 xl:px-8 xl:py-6 md:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl leading-none tracking-tighter md:text-xl">Release notes</h2>
        <Link
          className="flex items-center leading-none md:hidden"
          theme="blue"
          to={LINKS.releaseNotes}
          withArrow
        >
          All release notes
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-4 gap-x-[50px] border-t border-gray-new-20/60 pt-8 xl:grid-cols-3 lg:grid-cols-2 lg:pt-6 md:mt-5 md:grid-cols-1 md:gap-y-7">
        {releaseNotes.map(({ slug, content }, index) => {
          const { capitalisedCategory: category } = getReleaseNotesCategoryFromSlug(slug);
          const { datetime, label } = getReleaseNotesDateFromSlug(slug);
          const title = getExcerpt(content, 60).replace("What's new - ", '');

          return (
            <li
              className="group relative after:absolute after:left-1 after:top-px after:hidden after:h-[calc(100%+28px)] after:w-px after:bg-blue-80 last:after:h-full md:flex md:space-x-3 md:after:flex"
              key={index}
            >
              <span className="relative z-10 hidden h-2.5 w-2.5 shrink-0 rounded-full border-[1.4px] border-blue-80 bg-black-new md:flex" />
              <img
                className="absolute -bottom-3 -left-3 hidden -translate-y-1/2 rotate-90 md:group-last:block"
                src="/images/pages/blog/chevron.svg"
                width={9}
                height={12}
                alt=""
                aria-hidden
              />
              <Link className="group/link flex flex-col" to={`${LINKS.releaseNotes}/${slug}`}>
                <span className="text-xs font-medium uppercase leading-none tracking-wider text-blue-80 line-clamp-1">
                  {category}
                </span>
                <div className="relative mt-4 after:absolute after:left-0 after:top-1/2 after:h-px after:w-[calc(100%+50px)] after:-translate-y-1/2 after:bg-blue-80 group-last:after:w-full md:mt-0 md:hidden md:after:hidden">
                  <span className="relative z-10 flex h-2.5 w-2.5 rounded-full border-[1.4px] border-blue-80 bg-black-new md:hidden" />
                  <img
                    className="absolute -right-1 top-1/2 hidden -translate-y-1/2 group-last:block md:group-last:hidden"
                    src="/images/pages/blog/chevron.svg"
                    width={9}
                    height={12}
                    alt=""
                    aria-hidden
                  />
                </div>
                <h3 className="mt-4 text-lg font-medium leading-tight tracking-[-0.02em] transition-colors duration-200 group-hover/link:text-green-45 md:mt-1.5 md:text-base">
                  {title}
                </h3>
                <time
                  className="mt-2 text-sm leading-none tracking-[-0.02em] text-gray-new-80 md:mt-1.5"
                  dateTime={datetime}
                >
                  {label}
                </time>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        className="hidden items-center leading-none md:mt-7 md:flex"
        theme="blue"
        to={LINKS.releaseNotes}
        withArrow
      >
        All release notes
      </Link>
    </section>
  );
};

ReleaseNotesList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      content: PropTypes.string,
    })
  ),
};

export default ReleaseNotesList;
