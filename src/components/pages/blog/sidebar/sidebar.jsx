import PropTypes from 'prop-types';

import BlogNavLink from 'components/pages/blog/blog-nav-link';
import Socials from 'components/shared/socials/index';

const Sidebar = ({ categories }) => {
  const allCategories = [
    {
      name: 'All posts',
      slug: 'all',
    },
    ...categories,
  ];
  return (
    <aside className="relative z-10 mt-[88px] flex w-[206px] shrink-0 flex-col gap-y-10 xl:w-[202px] lg:top-[72px] lg:mb-10 lg:mt-0 lg:min-h-fit lg:w-full md:top-[120px] md:mb-8">
      <div className="min-h-[calc(100vh-380px)] flex-1 lg:min-h-0">
        <nav className="sticky top-24">
          <div className="lg:no-scrollbars lg:-ml-8 lg:overflow-auto lg:pl-8 md:-mx-4 md:px-4">
            <ul className="flex flex-col gap-y-2.5 lg:flex-row lg:gap-x-5 lg:after:shrink-0 lg:after:grow-0 lg:after:basis-px lg:after:content-['']">
              {allCategories.map(({ name, slug }, index) => (
                <li className="flex" key={index}>
                  <BlogNavLink name={name} slug={slug} />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className="sticky bottom-0 -mb-10 mt-auto shrink-0 bg-black-pure pb-10 pt-5 leading-none lg:hidden">
        <Socials />
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
