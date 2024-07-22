import clsx from 'clsx';
import { PropTypes } from 'prop-types';

import Container from 'components/shared/container/container';

const Section = ({ className = null, title, children }) => (
  <section
    className={clsx(
      'safe-paddings relative overflow-hidden pt-[72px] xl:pt-16 lg:pt-14 md:pt-11',
      className
    )}
  >
    <Container size="xxs">
      <h2
        className="mb-7 text-[36px] font-medium leading-tight tracking-tighter xl:mb-6 xl:text-[32px] lg:mb-5 lg:text-[28px] md:mb-4 md:text-2xl"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div
        className={clsx(
          'flex flex-col gap-7 xl:gap-6 lg:gap-5 sm:gap-4',
          '[&>p]:text-lg [&>p]:tracking-extra-tight [&>p]:text-gray-new-70 sm:[&>p]:text-base',
          '[&>p_span]:text-green-45 [&>p_strong]:font-medium [&>p_strong]:text-white',
          '[&>ul]:text-lg [&>ul]:tracking-extra-tight [&>ul]:text-gray-new-70 sm:[&>ul]:text-base',
          '[&>ul_span]:text-green-45 [&>ul_strong]:font-medium [&>ul_strong]:text-white'
        )}
      >
        {children}
      </div>
    </Container>
  </section>
);

Section.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Section;
