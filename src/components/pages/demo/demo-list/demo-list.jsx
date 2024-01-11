import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Link from 'components/shared/link';
import ChevronIcon from 'icons/chevron.inline.svg';

const DemoList = ({ category, categoryTextColor, items }) => (
  <section className="demo-list safe-paddings mt-20">
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2 mx-auto w-full max-w-[1048px] rounded-[10px] bg-gray-new-8 p-10">
        <h2
          className={clsx(
            'flex items-center text-xs font-semibold uppercase leading-none tracking-[0.02em]',
            categoryTextColor
          )}
        >
          <span>{category}</span>
          <span className="ml-2 h-px grow bg-gray-new-20" />
        </h2>
        <ul className="mt-7">
          {items.map(({ title, description, sourceLink, demoLink }, index) => (
            <li
              className="mt-6 flex items-start justify-between border-t border-gray-new-15 pt-6 first:mt-0 first:border-t-0 first:pt-0"
              key={index}
            >
              <div className="max-w-[591px]">
                <h3 className="text-2xl font-medium leading-tight tracking-extra-tight">{title}</h3>
                <p className="mt-3 leading-tight tracking-extra-tight">{description}</p>
              </div>
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
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

DemoList.propTypes = {
  category: PropTypes.string.isRequired,
  categoryTextColor: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      sourceLink: PropTypes.string.isRequired,
      demoLink: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DemoList;
