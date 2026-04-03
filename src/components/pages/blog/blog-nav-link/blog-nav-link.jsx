'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { BLOG_CATEGORY_BASE_PATH, BLOG_BASE_PATH } from 'constants/blog';
import { cn } from 'utils/cn';

const BlogNavLink = ({ name, slug }) => {
  const segments = useSelectedLayoutSegments();
  const isActive = slug === segments[1] || (slug === 'all' && segments[1] === undefined);

  const url = slug === 'all' ? BLOG_BASE_PATH : `${BLOG_CATEGORY_BASE_PATH}${slug}`;

  return (
    <Link
      className={cn(
        'flex w-full items-center py-[3px] font-mono text-[14px] font-medium tracking-extra-tight text-gray-new-60 uppercase transition-colors duration-200 lg:whitespace-nowrap',
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
