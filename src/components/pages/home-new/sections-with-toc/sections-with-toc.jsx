import PropTypes from 'prop-types';

import Toc from './toc';

const SectionsWithToc = ({ children }) => (
  <div className="relative">
    <div className="absolute bottom-0 left-[calc(50%-min(50vw,800px)+2rem)] top-0 h-full">
      <Toc />
    </div>
    {children}
  </div>
);

SectionsWithToc.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SectionsWithToc;
