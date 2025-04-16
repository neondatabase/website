'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import slugify from 'slugify';

import Link from 'components/shared/link';
import useLocalStorage from 'hooks/use-local-storage';

const CheckItem = ({ title, href, children, ...otherProps }) => {
  const id = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  }).replace(/_/g, '');

  const [mounted, setMounted] = React.useState(false);
  const [isChecked, setIsChecked] = useLocalStorage(`checklist-${id}`, false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const Tag = href ? Link : 'div';

  return (
    <div className="mt-3">
      <label className="relative flex cursor-pointer items-start gap-x-2.5 pl-6" htmlFor={id}>
        <input
          className={clsx(
            'remove-autocomplete-styles pointer-events-none appearance-none',
            'absolute left-0 top-0.5 z-10 h-4 w-4 rounded border border-black/10 bg-black/5 transition-colors duration-200 hover:bg-black/10',
            'dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10',
            'before:absolute before:inset-0 before:z-10 before:bg-[url(/images/check.svg)] before:bg-[length:12px_12px] before:bg-center before:bg-no-repeat before:invert',
            'before:opacity-0 before:transition-opacity before:duration-200',
            'checked:border-secondary-8/50 checked:!bg-secondary-8/70 checked:before:opacity-100',
            'dark:checked:border-white/30 dark:checked:!bg-white/10'
          )}
          type="checkbox"
          id={id}
          checked={mounted ? isChecked : false}
          onChange={() => setIsChecked((prev) => !prev)}
        />
        <h3 className="m-0 text-lg font-medium leading-tight tracking-extra-tight">
          <Tag className="" href={href || null} {...otherProps}>
            {title}
          </Tag>
        </h3>
      </label>
      <div className="mt-3 pl-6 [&_p]:mb-0">{children}</div>
    </div>
  );
};

CheckItem.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default CheckItem;
