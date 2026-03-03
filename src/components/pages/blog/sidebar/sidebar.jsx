import PropTypes from 'prop-types';

import BlogNavLink from 'components/pages/blog/blog-nav-link';

const Sidebar = ({ categories }) => {
  const allCategories = [
    {
      name: 'All posts',
      slug: 'all',
    },
    ...categories,
  ];

  return (
    <aside className="relative z-10 mt-[283px] lt:mt-[267px] flex w-[288px] shrink-0 flex-col gap-y-10 xl:w-[202px] lg:top-[188px] lg:mb-10 lg:mt-0 lg:min-h-fit lg:w-full md:absolute md:left-0 md:right-0 md:top-[210px] md:mt-0 md:mb-0 sm:top-[248px]">
      <div className="min-h-[calc(100vh-380px)] flex-1 lg:min-h-0">
        <nav className="sticky top-24">
            <div className="lg:no-scrollbars lg:-mx-8 lg:overflow-auto lg:pl-8 md:-mx-4 md:px-4">
            <ul className="flex flex-col gap-y-3.5 lg:flex-row lg:gap-x-5 lg:after:shrink-0 lg:after:grow-0 lg:after:basis-8 lg:after:content-[''] md:after:basis-4">
              {allCategories.map(({ name, slug }, index) => (
                <li className="flex" key={index}>
                  <BlogNavLink name={name} slug={slug} />
                </li>
              ))}
            </ul>
          </div>
        </nav>
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
