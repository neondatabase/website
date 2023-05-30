import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import getExcerpt from 'utils/get-excerpt';
import getReleaseNotesCategoryFromSlug from 'utils/get-release-notes-category-from-slug';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const ReleaseNotesList = ({ items }) => (
  <section className="release-notes-list -mx-10 rounded-xl bg-black-new px-10 pb-10 pt-7 2xl:mx-0 xl:px-8 xl:py-6 md:px-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl leading-none tracking-tighter md:text-xl">Release notes</h2>
      <Link
        className="flex items-center text-sm leading-none md:hidden"
        theme="blue"
        to={LINKS.releaseNotes}
        withArrow
      >
        All release notes
      </Link>
    </div>
    <ul className="mt-6 grid grid-cols-4 gap-x-[50px] border-t border-gray-new-20/60 pt-8 xl:grid-cols-3 lg:mt-6 lg:grid-cols-2 md:mt-5 md:grid-cols-1 md:gap-y-7 md:pt-6">
      {items.map(({ slug, content }, index) => {
        const { capitalisedCategory: category } = getReleaseNotesCategoryFromSlug(slug);
        const { datetime, label } = getReleaseNotesDateFromSlug(slug);
        const title = getExcerpt(content, 200).replace("What's new - ", '');

        return (
          <li
            className="group relative after:absolute after:left-1 after:top-px after:hidden after:h-[calc(100%+28px)] after:w-px after:bg-blue-80 last:after:h-full xl:last:hidden md:flex md:space-x-3 md:after:flex md:last:flex lg:[&:nth-last-child(2)]:hidden md:[&:nth-last-child(2)]:flex"
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
              <span className="line-clamp-1 text-xs font-medium uppercase leading-none tracking-wider text-blue-80">
                {category}
              </span>
              <div className="relative mt-4 after:absolute after:left-0 after:top-1/2 after:h-px after:w-[calc(100%+50px)] after:-translate-y-1/2 after:bg-blue-80 group-last:after:w-full xl:last:hidden xl:group-[:nth-last-child(2)]:after:w-full lg:group-[:nth-last-child(3)]:after:w-full md:mt-0 md:hidden md:after:hidden">
                <span className="relative z-10 flex h-2.5 w-2.5 rounded-full border-[1.4px] border-blue-80 bg-black-new md:hidden" />
                <img
                  className="absolute -right-1 top-1/2 hidden -translate-y-1/2 group-last:block xl:group-last:hidden xl:group-[:nth-last-child(2)]:block lg:group-[:nth-last-child(3)]:block lg:group-[:nth-last-child(2)]:hidden md:group-last:hidden"
                  src="/images/pages/blog/chevron.svg"
                  width={9}
                  height={12}
                  alt=""
                  aria-hidden
                />
              </div>
              <h3 className="mt-4 line-clamp-4 max-w-[260px] text-lg font-medium leading-tight tracking-[-0.02em] transition-colors duration-200 group-hover/link:text-green-45 xl:line-clamp-3 md:mt-1.5 md:line-clamp-2 md:max-w-none md:text-base">
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
      className="hidden items-center text-sm leading-none md:mt-7 md:flex"
      theme="blue"
      to={LINKS.releaseNotes}
      withArrow
    >
      All release notes
    </Link>
  </section>
);

ReleaseNotesList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string,
      content: PropTypes.string,
    })
  ),
};

export default ReleaseNotesList;
