import PropTypes from 'prop-types';

import Link from 'components/shared/link/link';
import LINKS from 'constants/links';
import getExcerpt from 'utils/get-excerpt';
import getReleaseNotesCategoryFromSlug from 'utils/get-release-notes-category-from-slug';
import getReleaseNotesDateFromSlug from 'utils/get-release-notes-date-from-slug';

const ReleaseNotesList = ({ items }) => (
  <section className="release-notes-list rounded-xl bg-black-new px-10 pt-7 pb-10">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl leading-none tracking-tighter">Release notes</h2>
      <Link
        className="flex items-center leading-none"
        theme="blue"
        to={LINKS.releaseNotes}
        withArrow
      >
        All release notes
      </Link>
    </div>
    <ul className="mt-6 grid grid-cols-4 gap-x-[50px] border-t border-gray-new-20/60 py-8">
      {items.map(({ slug, content }, index) => {
        const { capitalisedCategory: category } = getReleaseNotesCategoryFromSlug(slug);
        const { datetime, label } = getReleaseNotesDateFromSlug(slug);
        const title = getExcerpt(content, 60).replace("What's new - ", '');

        return (
          <li className="group" key={index}>
            <Link className="group/link flex flex-col" to={`${LINKS.releaseNotes}/${slug}`}>
              <span className="text-xs font-medium uppercase leading-none tracking-wider text-blue-80 line-clamp-1">
                {category}
              </span>
              <div className="relative mt-4 after:absolute after:top-1/2 after:left-0 after:h-px after:w-[calc(100%+50px)] after:-translate-y-1/2 after:bg-blue-80 group-last:after:w-full">
                <span className="relative z-10 flex h-2.5 w-2.5 rounded-full border-[1.4px] border-blue-80 bg-black-new" />
                <img
                  className="absolute top-1/2 -right-1 hidden -translate-y-1/2 group-last:block"
                  src="/images/pages/blog/chevron.svg"
                  width={9}
                  height={12}
                  alt=""
                  aria-hidden
                />
              </div>
              <h3 className="mt-4 text-lg font-medium leading-tight tracking-[-0.02em] transition-colors duration-200 group-hover/link:text-green-45">
                {title}
              </h3>
              <time
                className="mt-2 text-sm leading-none tracking-[-0.02em] text-gray-new-80"
                dateTime={datetime}
              >
                {label}
              </time>
            </Link>
          </li>
        );
      })}
    </ul>
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
