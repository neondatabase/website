import clsx from 'clsx';
import React from 'react';
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
    return children.reduce((acc, child) => {
      if (typeof child === 'string') {
        return acc + child;
      }
      return acc + extractText(child.props.children);
    }, '');
  }

  return '';
};

const extractCustomId = (text) => {
  const match = text.match(/\(#([^)]+)\)$/);
  if (match) {
    return match[1];
  }
  return null;
};

const AnchorHeading = (Tag) => {
  // eslint-disable-next-line react/prop-types
  const Component = ({ children, className = null }) => {
    const text = extractText(children);
    const customId = extractCustomId(text);

    const id =
      customId ||
      slugify(text.replace(/\(#[^)]+\)$/, ''), {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      }).replace(/_/g, '');

    // Remove the custom ID from children if it exists
    const cleanedChildren = React.Children.map(children, (child) => {
      if (typeof child === 'string') {
        return child.replace(/\(#[^)]+\)$/, '');
      }
      return child;
    });

    return (
      <Tag
        id={id}
        className={clsx(
          'anchor-heading group relative w-fit scroll-mt-20 font-semibold tracking-extra-tight lg:scroll-mt-5',
          className
        )}
      >
        <span>{cleanedChildren}</span>
        <a
          className="px-2 no-underline opacity-0 transition-opacity duration-200 hover:border-none hover:opacity-100 group-hover:opacity-100 sm:hidden"
          href={`#${id}`}
          aria-label={`Link to ${extractText(children)}`}
        >
          <HashIcon
            className={clsx('inline text-green-45', {
              'w-3.5': Tag === 'h2',
              'w-3': Tag === 'h3',
            })}
          />
        </a>
      </Tag>
    );
  };

  // Assign a displayName for parsing headings
  Component.displayName = Tag;

  return Component;
};

export default AnchorHeading;
