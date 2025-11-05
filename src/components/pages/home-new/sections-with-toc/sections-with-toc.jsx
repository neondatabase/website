import PropTypes from 'prop-types';

import Toc from './toc';

const SectionsWithToc = ({ children }) => (
  <div className="relative">
    <div className="absolute bottom-0 left-48 top-0 h-full">
      <Toc />
    </div>
    {children}
  </div>
);

SectionsWithToc.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SectionsWithToc;
