'use client';

import clsx from 'clsx';
import { useSelectedLayoutSegments } from 'next/navigation';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { BLOG_BASE_PATH, BLOG_CATEGORY_BASE_PATH } from 'constants/blog';

const BlogNavLink = ({ name, slug, isExternal = false }) => {
  const segments = useSelectedLayoutSegments();
  const isActive = slug === segments[1] || (slug === 'all' && segments[1] === undefined);

  const categoryUrl = slug === 'all' ? BLOG_BASE_PATH : `${BLOG_CATEGORY_BASE_PATH}${slug}`;

  return (
    <Link
      className={clsx(
        'border-l py-[5px] pl-2.5 text-xs font-semibold uppercase leading-none tracking-[0.02em] transition-colors duration-200 hover:text-green-45 lg:border-0 lg:pl-0',
        isActive ? 'border-green-45 text-green-45' : 'border-transparent'
      )}
      to={isExternal ? slug : categoryUrl}
    >
      {name}
    </Link>
  );
};

BlogNavLink.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  isExternal: PropTypes.bool,
};

export default BlogNavLink;
