import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

import Container from '../container';

const SecondarySection = ({ children, title = null, className = '', wrapperClassName = '' }) => (
  <section className={cn('overflow-hidden bg-[#E4F1EB] safe-paddings', wrapperClassName)}>
    {title && <h2 className="sr-only">{title}</h2>}
    <Container
      className={cn('py-40 xl:max-w-[1100px]! xl:py-[136px] lg:py-[90px] md:py-14', className)}
      size="small"
    >
      {children}
    </Container>
  </section>
);

SecondarySection.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

export default SecondarySection;
