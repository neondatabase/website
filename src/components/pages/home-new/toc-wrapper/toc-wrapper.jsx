import PropTypes from 'prop-types';

import Toc from './toc';

const TocWrapper = ({ children }) => (
  <div className="relative overflow-hidden">
    {/* Position TOC absolutely aligned with container (max-width: 1600px) + left padding (32px) */}
    <div className="absolute bottom-0 left-[calc(50%-min(100vw,1600px)/2+32px)] top-0 h-full xl:hidden">
      <Toc />
    </div>
    {children}
  </div>
);

TocWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TocWrapper;
