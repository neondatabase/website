import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import GithubIcon from './images/github.inline.svg';

const ExampleRepo = ({ title, children }) => (
  <>
    <h3 className="mb-4 mt-0 text-base font-medium leading-tight tracking-extra-tight">{title}</h3>
    <ul className="!m-0 !list-none !p-0">
      {React.Children.map(children, (child) => (
        <li
          className={clsx(
            '!mb-0 !mt-2 flex items-start gap-1.5 text-gray-new-20 before:hidden dark:text-gray-new-70',
            'transition-colors duration-200 hover:text-secondary-8 dark:hover:text-green-45',
            '[&_a]:border-0 [&_a]:pl-5 [&_a]:text-sm [&_a]:tracking-extra-tight [&_a]:!text-inherit'
          )}
        >
          <GithubIcon className="pointer-events-none absolute left-0 top-0 size-3.5" aria-hidden />
          {child}
        </li>
      ))}
    </ul>
  </>
);

ExampleRepo.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ExampleRepo;
