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
        'w-full whitespace-pre py-[3px] text-[15px] font-medium tracking-extra-tight text-gray-new-80 transition-colors duration-200',
        'lg:border-b-2 lg:text-sm',
        isActive
          ? 'text-green-45 lg:border-green-45 lg:text-white'
          : 'hover:text-white lg:border-transparent'
      )}
      to={url}
    >
      {name}
    </Link>
  );
};

BlogNavLink.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default BlogNavLink;
