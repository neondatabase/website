import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

import SectionHeading from './section-heading';

const Capability = ({ children, className = null, id, primary, secondary }) => (
  <section className={cn('scroll-mt-28', className)} id={id} aria-labelledby={`${id}-heading`}>
    <SectionHeading id={`${id}-heading`} primary={primary} secondary={secondary} />
    <div className="mt-16 xl:mt-20 lg:mt-16 md:mt-12">{children}</div>
  </section>
);

Capability.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.oneOf(['instant-branching', 'restore-to-any-point', 'database-built-for-agents'])
    .isRequired,
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
};

export default Capability;
