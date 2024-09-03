import PropTypes from 'prop-types';

import BlogNavLink from 'components/pages/blog/blog-nav-link';
import InkeepTrigger from 'components/shared/inkeep-trigger';
import Socials from 'components/shared/socials';

const Sidebar = ({ categories }) => {
  const allCategories = [
    {
      name: 'Featured',
      slug: 'all',
    },
    ...categories,
  ];
  return (
    <aside className="w-[192px] shrink-0 pb-10 lt:w-full lt:pb-0">
      <div className="relative flex h-full flex-col gap-y-10 lt:h-auto lt:min-h-fit">
        <div className="relative flex-1">
          <nav className="no-scrollbars sticky top-32 lt:flex lt:items-end lt:justify-between lt:pt-8 md:-mx-4 md:max-w-5xl md:overflow-auto md:px-4">
            <InkeepTrigger className="dark z-30 max-w-[152px] lt:order-1 lt:w-full lg:hidden" />
            <ul className="mt-8 flex flex-col gap-y-3.5 lt:mt-0 lt:flex-row lt:gap-x-7 md:after:shrink-0 md:after:grow-0 md:after:basis-px md:after:content-['']">
              {allCategories.map(({ name, slug }, index) => (
                <li className="inline-flex" key={index}>
                  <BlogNavLink name={name} slug={slug} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="sticky bottom-10 leading-none lt:hidden">
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
