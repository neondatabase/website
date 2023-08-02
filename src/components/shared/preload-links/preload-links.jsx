'use client';

import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import React from 'react';

import LINKS from 'constants/links';

const PreloadLinks = ({ links, activePath }) => {
  const pathname = usePathname();

  return pathname === activePath ? (
    <>
      {links.map(({ href, as, type, ...props }, index) => (
        <link rel="preload" href={href} as={as} type={type} {...props} key={index} />
      ))}
    </>
  ) : null;
};

PreloadLinks.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      as: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ).isRequired,
  activePath: PropTypes.objectOf(Object.values(LINKS)).isRequired,
};

export default PreloadLinks;
