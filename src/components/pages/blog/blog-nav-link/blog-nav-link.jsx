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
        'w-full whitespace-pre border-l py-1 pl-2.5 text-[13px] font-medium tracking-extra-tight text-gray-new-60 transition-colors duration-200 hover:text-white lt:border-b-2 lt:border-l-0 lt:pb-2.5 lt:pl-0 lt:pt-0',
        isActive ? 'border-green-45 text-white' : 'border-transparent'
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
