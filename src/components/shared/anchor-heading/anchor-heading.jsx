/* eslint-disable react/prop-types */
import clsx from 'clsx';
import React from 'react';

import AnchorIcon from './svg/anchor.inline.svg';

const baseStyles = 'relative group';
const styles = {
  h2: 'font-bold text-5xl xl:text-4xl md:text-3xl',
  h3: 'font-semibold text-3xl xl:text-2xl',
};

const slugify = (path) => {
  if (!path || path.key === null) {
    return null;
  }
  return path
    .toLowerCase()
    .replace(/[\s-;:!?&.,()[\]]{1,}/g, '-')
    .replace(/[%@~`'"]/g, '');
};

const anchorify = (str) =>
  slugify(str)?.replace(/[=/]/g, '-').replace(/^\d+/g, '').replace(/^-*/g, '').replace(/-*$/g, '');

const AnchorHeading =
  (tagName) =>
  ({ children }) => {
    const getPlainText = (arr) =>
      arr.reduce((acc, cur) => acc.concat(cur.props?.children ?? cur), '');
    const textContent = Array.isArray(children) ? getPlainText(children) : children;
    const anchor = `${anchorify(textContent) ? anchorify(textContent) : ''}`;

    const Tag = tagName;
    return (
      <Tag className={clsx(baseStyles, styles.tagName)} id={anchor}>
        <a className="hidden group-hover:visible" href={`#${anchor}`}>
          <AnchorIcon />
        </a>
        {children}
      </Tag>
    );
  };

export default AnchorHeading;
