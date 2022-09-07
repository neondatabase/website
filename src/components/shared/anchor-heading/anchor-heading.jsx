import clsx from 'clsx';
import React from 'react';
import slugify from 'slugify';

import AnchorIcon from 'icons/anchor.inline.svg';

const AnchorHeading =
  (Tag) =>
  // eslint-disable-next-line react/prop-types
  ({ children }) => {
    const id =
      typeof children === 'string'
        ? slugify(children, { strict: true }).toLocaleLowerCase()
        : undefined;

    return (
      <Tag id={id} className="group relative">
        <a
          className="anchor absolute top-0 left-0 flex h-full -translate-x-full items-center justify-center px-2.5 opacity-0 transition-opacity duration-200 hover:opacity-100 group-hover:opacity-100"
          href={`#${id}`}
          tabIndex="-1"
          aria-hidden
        >
          <AnchorIcon className={clsx(Tag === 'h2' && 'w-5', Tag === 'h3' && 'w-4')} />
        </a>
        {children}
      </Tag>
    );
  };

export default AnchorHeading;
