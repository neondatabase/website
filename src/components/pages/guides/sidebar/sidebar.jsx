import { PropTypes } from 'prop-types';

const Sidebar = ({ className }) => (
  <aside className={className}>
    <div className="relative flex h-full flex-col">
      <div className="relative flex-1">
        <nav className="no-scrollbars sticky top-32 flex items-center gap-2.5" />
      </div>
    </div>
  </aside>
);

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
