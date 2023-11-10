import PropTypes from 'prop-types';

const TabItem = ({ children }) => <div className="py-5 px-4">{children}</div>;

TabItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TabItem;
