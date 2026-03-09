import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import DocsLink from 'components/pages/doc/docs-link';

import CheckIcon from './images/check.inline.svg';
import GitHubIcon from './images/github.inline.svg';
import PageIcon from './images/page.inline.svg';

const Icon = ({ theme = 'default', className = null }) => {
  if (theme === 'docs') return <PageIcon className={clsx('top-1', className)} aria-hidden />;
  if (theme === 'repo') return <GitHubIcon className={clsx('top-1', className)} aria-hidden />;
  return <CheckIcon className={clsx('top-[5px]', className)} aria-hidden />;
};

Icon.propTypes = {
  theme: PropTypes.oneOf(['default', 'docs', 'repo']),
  className: PropTypes.string,
};

const parsedChildren = (children) =>
  React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === 'a') {
      return <DocsLink {...child.props} />;
    }
    return child;
  });

const DocsList = ({ title, theme = 'default', children }) => (
  <>
    {title && (
      <h3 className="mb-3 mt-0 text-base font-medium leading-tight tracking-extra-tight">
        {title}
      </h3>
    )}
    <ul className="!m-0 flex flex-col gap-y-2 !p-0">
      {parsedChildren(children).map((child) => (
        <li
          className={clsx(
            'group !m-0 flex w-fit items-start gap-1.5 text-gray-new-30 before:hidden dark:text-gray-new-85',
            '[&_p]:my-0 [&_p]:pl-5 [&_p]:text-sm [&_p]:tracking-extra-tight',
            '[&_a]:pl-5 [&_a]:text-sm [&_a]:tracking-extra-tight [&_a]:text-gray-new-30 [&_a]:!no-underline [&_a]:decoration-transparent [&_a]:dark:text-gray-new-85',
            '[&:has(a)]:transition-colors [&:has(a)]:duration-200',
            '[&:has(a)]:hover:text-black-pure [&:has(a)]:hover:dark:text-white [&_a]:hover:text-black-pure [&_a]:hover:dark:text-white'
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
