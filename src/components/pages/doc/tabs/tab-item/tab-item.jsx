import PropTypes from 'prop-types';

const TabItem = ({ children }) => (
  <div className="tab-item py-5 px-4 [&_ol]:pl-6 [&_ul]:pl-7 [&_pre.prismjs]:!bg-white [&_pre.prismjs]:dark:!bg-gray-new-8 [&_.admonition]:bg-white [&_.admonition]:dark:bg-gray-new-8">
    {children}
  </div>
);

TabItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TabItem;
