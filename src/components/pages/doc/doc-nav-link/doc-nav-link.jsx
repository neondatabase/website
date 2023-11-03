'use client';

import clsx from 'clsx';
import { useSelectedLayoutSegments } from 'next/navigation';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';

const DocNavLink = ({ children, to }) => {
  const segments = useSelectedLayoutSegments();

  const isPostgres = segments.includes('postgres');
  const isActive = isPostgres ? to.includes('postgres') : !to.includes('postgres');

  return (
    <Link
      className={clsx(
        'relative whitespace-pre pb-1 text-sm font-medium leading-tight transition-colors duration-200 hover:text-secondary-8 dark:hover:text-green-45 after:absolute after:left-0 after:w-full after:h-px after:-bottom-px after:transition-colors after:duration-200',
        isActive
          ? 'text-black-new dark:text-green-45 dark:after:bg-green-45 after:bg-black-new hover:after:bg-secondary-8 dark:hover:after:bg-green-45'
          : 'text-gray-new-40 dark:text-gray-new-80'
      )}
      to={to}
    >
      {children}
    </Link>
  );
};

DocNavLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

export default DocNavLink;
