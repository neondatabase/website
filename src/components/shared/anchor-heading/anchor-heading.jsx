import clsx from 'clsx';
import React from 'react';
import slugify from 'slugify';

import HashIcon from './images/hash.inline.svg';

const AnchorHeading =
  (Tag) =>
  // eslint-disable-next-line react/prop-types
  ({ children }) => {
    const id =
      typeof children === 'string'
        ? slugify(children, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g })
        : undefined;

    return (
      <Tag id={id} className="not-prose group relative w-fit">
        <a
          className="anchor absolute -right-16 top-1/2 flex h-full -translate-x-full -translate-y-[calc(50%-0.15rem)] items-center justify-center px-2.5 no-underline opacity-0 transition-opacity duration-200 hover:opacity-100 group-hover:opacity-100 sm:hidden"
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

export default AnchorHeading;
