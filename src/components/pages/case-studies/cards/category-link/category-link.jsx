'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import { CASE_STUDIES_CATEGORY_BASE_PATH, CASE_STUDIES_BASE_PATH } from 'constants/case-studies';

const CategoryLink = ({ name, slug, isActive }) => {
  const url =
    slug === 'all' ? CASE_STUDIES_BASE_PATH : `${CASE_STUDIES_CATEGORY_BASE_PATH}/${slug}`;

  return (
    <Link
      className={clsx(
        'flex h-9 items-center rounded-full font-medium tracking-extra-tight',
        'transition-colors duration-200 hover:text-green-45',
        isActive
          ? 'border border-[#1B2C2E] bg-[#132628]/50 px-8 text-green-45 group-first:-ml-[26px] group-last:-mr-[26px]'
          : 'px-2 text-gray-new-50'
      )}
      to={url}
    >
      {name}
    </Link>
  );
};

CategoryLink.propTypes = {
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default CategoryLink;
