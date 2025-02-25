import { PropTypes } from 'prop-types';

import RssButton from 'components/shared/rss-button';
import { GUIDES_BASE_PATH } from 'constants/guides';

const Sidebar = ({ className }) => (
  <aside className={className}>
    <div className="relative flex h-full flex-col">
      <div className="relative flex-1">
        <nav className="no-scrollbars sticky top-32 flex items-center gap-2.5">
          <RssButton basePath={GUIDES_BASE_PATH} title="Guides" />
        </nav>
      </div>
    </div>
  </aside>
);

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
