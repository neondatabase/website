'use client';

import clsx from 'clsx';
import { useSelectedLayoutSegments } from 'next/navigation';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';

const DocNavLink = ({ children, to }) => {
  const segments = useSelectedLayoutSegments();

  // if segments have postgres, then we are in postgres section
  // of not, then we are in neon section

  const isPostgres = segments.includes('postgres');

  const isActive = isPostgres ? to.includes('postgres') : !to.includes('postgres');

  return (
    <Link
      className={clsx(
        'whitespace-pre',
        isActive ? 'border-green-45 text-green-45' : 'border-transparent'
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
