import clsx from 'clsx';
import { PropTypes } from 'prop-types';

const Section = ({ className = null, title, children }) => (
  <div className={clsx('relative  overflow-hidden', className)}>
    <h2
      className="mb-7 pt-[72px] text-[36px] font-medium leading-tight tracking-tighter xl:mb-6 xl:pt-16 xl:text-[32px] lg:mb-5 lg:pt-14 lg:text-[28px] md:mb-4 md:pt-11 md:text-2xl"
      id={title.id}
      dangerouslySetInnerHTML={{ __html: title.text }}
    />
    {children}
  </div>
);

Section.propTypes = {
  className: PropTypes.string,
  title: PropTypes.shape({
    text: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

export default Section;
