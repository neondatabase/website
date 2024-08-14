import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import CheckIcon from './images/check.inline.svg';
import GithubIcon from './images/github.inline.svg';
import PageIcon from './images/page.inline.svg';

const Icon = ({ theme = 'default', className = null }) => {
  if (theme === 'docs') return <PageIcon className={clsx('top-1', className)} aria-hidden />;
  if (theme === 'repo') return <GithubIcon className={clsx('top-1', className)} aria-hidden />;
  return <CheckIcon className={clsx('top-[5px]', className)} aria-hidden />;
};

Icon.propTypes = {
  theme: PropTypes.oneOf(['default', 'docs', 'repo']),
  className: PropTypes.string,
};

const DocsList = ({ title, theme = 'default', children }) => (
  <>
    {title && (
      <h3 className="mb-4 mt-0 text-base font-medium leading-tight tracking-extra-tight">
        {title}
      </h3>
    )}
    <ul className="!m-0 !p-0">
      {React.Children.map(children, (child) => (
        <li
          className={clsx(
            '!mb-0 !mt-2 flex w-fit items-start gap-1.5 text-gray-new-20 before:hidden dark:text-gray-new-70',
            '[&_p]:my-0 [&_p]:pl-5 [&_p]:text-sm [&_p]:tracking-extra-tight',
            '[&_a]:border-0 [&_a]:pl-5 [&_a]:text-sm [&_a]:tracking-extra-tight',
            '[&:has(a)]:transition-colors [&:has(a)]:duration-200 [&_a]:!text-inherit',
            '[&:has(a)]:hover:text-secondary-8 [&:has(a)]:hover:dark:text-green-45'
          )}
        >
          <Icon theme={theme} className="pointer-events-none absolute left-0" />
          {child}
        </li>
      ))}
    </ul>
  </>
);

DocsList.propTypes = {
  title: PropTypes.string,
  theme: PropTypes.oneOf(['default', 'docs', 'repo']),
  children: PropTypes.node.isRequired,
};

export default DocsList;
