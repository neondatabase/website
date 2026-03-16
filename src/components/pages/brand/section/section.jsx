import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import { cn } from 'utils/cn';

const Section = ({ className, title, description, children }) => (
  <section className={cn('mt-[104px] xl:mt-20 lg:mt-16', className)}>
    <Container size="768" className="lg:max-w-3xl!">
      <h2 className="text-4xl leading-dense font-medium tracking-tighter xl:text-[36px] lg:text-[32px] md:text-[28px]">
        {title}
      </h2>
      <p className="mt-3.5 max-w-[512px] tracking-extra-tight text-pretty text-gray-new-60 lg:mt-3">
        {description}
      </p>
      <div className="mt-10 xl:mt-9 lg:mt-8 md:mt-7">{children}</div>
    </Container>
  </section>
);

Section.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Section;
