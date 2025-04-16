import PropTypes from 'prop-types';
import React from 'react';

const CheckList = ({ children }) => (
  <div className="checklist doc-cta prose-doc my-5 flex flex-col rounded-[10px] border border-gray-new-90 bg-[linear-gradient(to_right,#FAFAFA,transparent)] px-7 py-6 dark:border-gray-new-20 dark:bg-[linear-gradient(to_right,#18191B_30%,#131415_75%)] md:p-5 md:px-4 md:py-5">
    {children}
  </div>
);

CheckList.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CheckList;
