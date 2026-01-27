import PropTypes from 'prop-types';

import BulbNoisy from '../../pages/about/stats/images/bulb-horizontal-noise.inline.svg';
import BulbLargeNoisy from '../../pages/about/stats/images/bulb-large-horizontal-noise.inline.svg';
import Bulb from '../../pages/about/stats/images/bulb.inline.svg';
import Container from '../container';

const SecondarySection = ({ children, title = null, className = '' }) => (
  <section className={`safe-paddings overflow-hidden bg-[#E4F1EB] ${className}`.trim()}>
    {title && <h2 className="sr-only">{title}</h2>}
    <Container
      className="py-40 xl:!max-w-[1100px] xl:py-32 lg:py-24 md:py-20 sm:py-16"
      size="small"
    >
      {children}
      <BulbLargeNoisy className="pointer-events-none absolute bottom-[48%] left-[47%] -rotate-45" />
      <BulbNoisy className="pointer-events-none absolute bottom-0 left-full -rotate-[75deg]" />
      <Bulb className="pointer-events-none absolute -bottom-[30%] left-[85%] -rotate-45" />
    </Container>
  </section>
);

SecondarySection.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
};

export default SecondarySection;
