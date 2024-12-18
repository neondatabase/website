import clsx from 'clsx';
import PropTypes from 'prop-types';
import slugify from 'slugify';

import HashIcon from './images/hash.inline.svg';

const extractText = (children) => {
  if (typeof children === 'string') {
    return children;
  }

  if (typeof children === 'object' && children.props) {
    return extractText(children.props.children);
  }

  if (Array.isArray(children)) {
    const text = children.reduce((acc, child) => {
      if (typeof child === 'string') {
        return acc + child;
      }
      return acc + extractText(child.props.children);
    }, '');
    return text;
  }

  return '';
};

const AnchorHeading =
  (Tag) =>
  // eslint-disable-next-line react/prop-types
  ({ children, className = null }) => {
    const id = slugify(extractText(children), {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    }).replace(/_/g, '');

    return (
      <Tag
        id={id}
        className={clsx(
          'group relative w-fit scroll-mt-20 font-title font-medium tracking-tighter lg:scroll-mt-5',
          className
        )}
      >
        <a
          className="anchor absolute right-0 top-1/2 flex h-full -translate-y-[calc(50%-0.15rem)] translate-x-full items-center justify-center px-2 no-underline opacity-0 transition-opacity duration-200 hover:border-none hover:opacity-100 group-hover:opacity-100 sm:hidden"
          href={`#${id}`}
          tabIndex="-1"
          aria-hidden
        >
          <HashIcon
            className={clsx(Tag === 'h2' && 'w-3.5', Tag === 'h3' && 'w-3', 'text-green-45')}
          />
        </a>
        {children}
      </Tag>
    );
  };

AnchorHeading.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default AnchorHeading;
