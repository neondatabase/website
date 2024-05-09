import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

import BlogNavLink from 'components/pages/blog/blog-nav-link';

import Socials from '../../../shared/socials';

const Search = dynamic(() => import('components/shared/search/search'));

const Sidebar = ({ categories }) => {
  const allCategories = [
    {
      name: 'Featured',
      slug: 'all',
    },
    ...categories,
  ];
  return (
    <aside className="col-span-2 pb-10 lt:col-span-full lt:pb-0">
      <div className="relative flex h-full flex-col gap-y-10 lt:h-auto lt:min-h-fit">
        <div className="relative flex-1">
          <nav className="no-scrollbars sticky top-32 lt:flex lt:items-end lt:justify-between lt:pt-8 md:-mx-4 md:max-w-5xl md:overflow-auto md:px-4">
            <Search
              className="dark z-30 max-w-[206px] 3xl:max-w-[170px] 2xl:max-w-[200px] lt:order-1 lt:w-full lg:hidden"
              indexName={process.env.NEXT_PUBLIC_ALGOLIA_BLOG_INDEX_NAME}
              isBlog
            />
            <ul className="mt-8 flex flex-col lt:mt-0 lt:flex-row lt:gap-x-7 md:after:shrink-0 md:after:grow-0 md:after:basis-px md:after:content-['']">
              {allCategories.map(({ name, slug }, index) => (
                <li className="flex py-1.5 first:pt-0 last:pb-0 lt:py-0" key={index}>
                  <BlogNavLink name={name} slug={slug} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="sticky bottom-10 lt:hidden">
          <span className="text-xs font-semibold uppercase leading-none tracking-[0.02em] text-gray-new-70">
            Follow us
          </span>
          <Socials />
        </div>
      </div>
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
