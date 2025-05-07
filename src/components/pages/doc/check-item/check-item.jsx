'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import slugify from 'slugify';

import Link from 'components/shared/link';

const CheckItem = ({ title, href, children, checklist = [], onToggle, ...otherProps }) => {
  const id = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  }).replace(/_/g, '');

  const isChecked = checklist.includes(id);
  const Tag = href ? Link : 'div';

  return (
    <li className="!m-0 before:hidden">
      <label className="relative block cursor-pointer pl-[30px]" htmlFor={id}>
        <input
          className={clsx(
            'remove-autocomplete-styles pointer-events-none appearance-none',
            'absolute left-0 top-0.5 z-10 size-4 rounded-sm border border-gray-new-80 transition-colors duration-200 hover:bg-gray-new-95',
            'dark:border-gray-new-20 dark:hover:bg-white/5',
            'before:absolute before:inset-0 before:z-10 before:bg-[url(/images/checklist.svg)] before:bg-center before:bg-no-repeat',
            'before:opacity-0 before:transition-opacity before:duration-200 checked:before:opacity-100',
            'dark:before:invert dark:checked:border-gray-new-20'
          )}
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={() => onToggle(id)}
        />
        <h3 className="m-0 text-lg font-medium leading-tight tracking-normal">
          <Tag className="" href={href || null} {...otherProps}>
            {title}
          </Tag>
        </h3>
      </label>
      <div className="mt-2 pl-[30px] text-gray-new-20 dark:text-gray-new-80 md:mt-1.5 [&_p]:m-0 [&_p]:leading-snug [&_p]:tracking-tight">
        {children}
      </div>
    </li>
  );
};

CheckItem.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
  checklist: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default CheckItem;
