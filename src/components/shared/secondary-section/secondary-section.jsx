import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from '../container';

const SecondarySection = ({ children, title = null, className = '', wrapperClassName = '' }) => (
  <section className={clsx('overflow-hidden bg-[#E4F1EB] safe-paddings', wrapperClassName)}>
    {title && <h2 className="sr-only">{title}</h2>}
    <Container
      className={clsx('py-40 lg:py-[90px] xl:max-w-[1100px]! xl:py-[136px] md:py-14', className)}
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
