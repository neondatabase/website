import PropTypes from 'prop-types';

import Toc from './toc';

const TocWrapper = ({ children }) => (
  <div className="relative">
    {/* Position TOC absolutely aligned with container (max-width: 100rem) + left padding (2rem) */}
    <div className="absolute top-0 bottom-0 left-[calc(50%-min(100vw,100rem)/2+2rem)] h-full xl:hidden">
      <Toc />
    </div>
    {children}
  </div>
);

TocWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TocWrapper;
