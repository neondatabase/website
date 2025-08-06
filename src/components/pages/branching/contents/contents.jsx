import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { BRANCHING_BASE_PATH } from 'constants/branching';

const Contents = ({ contents }) => (
  <section className="safe-paddings table-of-contents mt-[136px] w-full xl:mt-[120px] lg:mt-28 md:mt-20">
    <h2 className="sr-only">Table of contents</h2>
    <ul className="w-full">
      {contents.map(({ section, id, items }, index) => (
        <li
          className="flex flex-col gap-5 border-t border-gray-new-15/80 py-6 first:border-0 first:pt-0 last:pb-0 md:gap-4 md:py-5"
          key={id}
          id={id}
        >
          <h3 className="text-2xl font-medium leading-tight tracking-tighter lg:text-xl">
            {section}
          </h3>
          <ol className="flex flex-col gap-2.5">
            {items.map(({ title, slug }, subIndex) => (
              <li key={slug}>
                <Link
                  className="flex justify-between gap-4 text-lg tracking-extra-tight text-gray-new-80 transition-colors duration-200 hover:text-white md:text-base"
                  href={`${BRANCHING_BASE_PATH}${slug}`}
                >
                  {title}
                  <span className="text-base">
                    {index + 1}.{subIndex + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ul>
  </section>
);

Contents.propTypes = {
  contents: PropTypes.arrayOf(
    PropTypes.shape({
      section: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        })
      ),
    })
  ),
};

export default Contents;
