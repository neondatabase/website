'use client';

import clsx from 'clsx';
import { useSelectedLayoutSegments } from 'next/navigation';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { BLOG_CATEGORY_BASE_PATH, BLOG_BASE_PATH } from 'constants/blog';

const BlogNavLink = ({ name, slug }) => {
  const segments = useSelectedLayoutSegments();
  const isActive = slug === segments[1] || (slug === 'all' && segments[1] === undefined);

  const url = slug === 'all' ? BLOG_BASE_PATH : `${BLOG_CATEGORY_BASE_PATH}${slug}`;

  return (
    <Link
      className={clsx(
        'flex w-full items-center whitespace-nowrap py-[3px] font-mono text-[14px] font-medium uppercase tracking-extra-tight text-gray-new-60 transition-colors duration-200',
        'lg:border-b-2 lg:text-sm',
        isActive ? 'text-gray-new-90 lg:border-green-45' : 'hover:text-white lg:border-transparent'
      )}
      to={url}
    >
      {name}
      {isActive && <span className="ml-auto block size-2 bg-green-52 lg:hidden" />}
    </Link>
  );
};

BlogNavLink.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default BlogNavLink;
