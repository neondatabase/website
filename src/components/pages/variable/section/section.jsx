import clsx from 'clsx';
import { PropTypes } from 'prop-types';

import Container from 'components/shared/container/container';

const Section = ({ className = null, title, children }) => (
  <section
    className={clsx(
      'safe-paddings relative mt-[72px] overflow-hidden xl:mt-16 lg:mt-14 md:mt-11',
      className
    )}
  >
    <Container size="xxs">
      <h2
        className="mb-7 text-[36px] font-medium leading-tight tracking-tighter xl:mb-6 xl:text-[32px] lg:mb-5 lg:text-[28px] md:mb-4 md:text-2xl"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {children}
    </Container>
  </section>
);

Section.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Section;
