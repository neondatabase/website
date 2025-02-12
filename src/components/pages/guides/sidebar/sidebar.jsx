import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

const AlgoliaSearch = dynamic(() => import('components/shared/algolia-search'));

const Sidebar = ({ className }) => (
  <aside className={className}>
    <div className="relative flex h-full flex-col">
      <div className="relative flex-1">
        <nav className="no-scrollbars sticky top-32">
          <AlgoliaSearch
            className="w-[192px] lt:w-full"
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_GUIDES_INDEX_NAME}
          />
        </nav>
      </div>
    </div>
  </aside>
);

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
