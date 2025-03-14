import PropTypes from 'prop-types';

const TabItem = ({ children }) => (
  <div className="tab-item px-4 py-5 [&_.admonition]:bg-white [&_.admonition]:dark:bg-gray-new-8 [&_ol]:pl-6 [&_pre[data-language]]:!bg-white [&_pre[data-language]]:dark:!bg-gray-new-8 [&_ul]:pl-7">
    {children}
  </div>
);

TabItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TabItem;
