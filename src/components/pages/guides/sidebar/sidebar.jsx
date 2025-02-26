import clsx from 'clsx';
import PropTypes from 'prop-types';

import SearchInput from 'components/shared/algolia-search/search-input';

const Sidebar = ({ className }) => (
  <aside className={clsx('relative flex h-full flex-col', className)}>
    <div className="sticky top-24">
      <SearchInput className="w-full" isBlog />
    </div>
  </aside>
);

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
