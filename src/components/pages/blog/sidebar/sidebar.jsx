import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

import BlogNavLink from 'components/pages/blog/blog-nav-link';

const AlgoliaSearch = dynamic(() => import('components/shared/algolia-search'));

const Sidebar = ({ categories }) => {
  const allCategories = [
    {
      name: 'Featured',
      slug: 'all',
    },
    ...categories,
  ];
  return (
    <aside className="w-[192px] shrink-0 pb-10 lg:w-full lg:pb-0">
      <nav className="no-scrollbars sticky top-24 lg:flex lg:items-end lg:justify-between lg:pt-8 md:-mx-4 md:max-w-5xl md:overflow-auto md:px-4">
        <AlgoliaSearch
          className="w-full lg:hidden"
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_BLOG_INDEX_NAME}
          isBlog
        />
        <ul className="mt-8 flex flex-col gap-y-3 lg:mt-0 lg:flex-row lg:gap-x-7 md:after:shrink-0 md:after:grow-0 md:after:basis-px md:after:content-['']">
          {allCategories.map(({ name, slug }, index) => (
            <li className="flex" key={index}>
              <BlogNavLink name={name} slug={slug} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
    })
  ).isRequired,
};
