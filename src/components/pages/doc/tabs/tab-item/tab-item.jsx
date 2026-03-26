import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const TabItem = ({ children }) => (
  <div
    className={cn(
      'tab-item px-4 py-5',
      '[&_.admonition]:bg-gray-new-98 [&_.admonition]:dark:bg-gray-new-8',
      '[&_ol]:pl-6 [&_p]:text-base [&_p]:leading-normal [&_p]:tracking-extra-tight [&_ul]:pl-7',
      '[&_li]:text-base [&_li]:leading-snug [&_li]:tracking-extra-tight',
      '[&_pre[data-language]]:bg-gray-new-98! [&_pre[data-language]]:dark:bg-gray-new-8!'
    )}
  >
    {children}
  </div>
);

TabItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TabItem;
