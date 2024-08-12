import { PropTypes } from 'prop-types';

import HashIcon from 'components/shared/anchor-heading/images/hash.inline.svg';

const Section = ({ className = null, title, children }) => (
  <div className={className}>
    <h2
      className="group relative mb-7 w-fit pt-[72px] text-[36px] font-medium leading-tight tracking-tighter xl:mb-6 xl:pt-16 xl:text-[32px] lg:mb-5 lg:pt-14 lg:text-[28px] md:mb-4 md:pt-11 md:text-2xl"
      id={title.id}
    >
      <span dangerouslySetInnerHTML={{ __html: title.title }} />
      <a
        className="anchor inline-flex items-center justify-center px-2.5 no-underline opacity-0 transition-opacity duration-200 hover:border-none hover:opacity-100 group-hover:opacity-100 sm:hidden"
        href={`#${title.id}`}
      >
        <HashIcon className="size-5 text-green-45" />
      </a>
    </h2>
    {children}
  </div>
);

Section.propTypes = {
  className: PropTypes.string,
  title: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

export default Section;
