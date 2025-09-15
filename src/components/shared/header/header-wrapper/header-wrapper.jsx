'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const HeaderWrapper = ({
  className = null,
  children,
  isSticky = false,
  isStickyOverlay = false,
  withBorder = false,
}) => {
  const headerRef = useRef(null);
  const [isStickied, setIsStickied] = useState(false);

  const handleScroll = () => {
    if (headerRef.current) {
      setIsStickied(headerRef.current.offsetTop > 0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        'left-0 right-0 top-0 z-40 flex h-16 w-full items-center lg:relative',
        isSticky ? 'sticky transition-[padding,background-color] duration-200' : 'absolute',
        isStickyOverlay ? '-mb-16' : 'bg-white dark:bg-black-pure',
        isSticky && isStickied && 'bg-white dark:bg-black-pure',
        withBorder &&
          clsx(
            'relative',
            'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px',
            'after:bg-gray-new-94 after:dark:bg-gray-new-10',
            'after:transition-opacity after:duration-200',
            isStickied ? 'after:opacity-100' : 'after:opacity-0'
          ),
        className
      )}
      ref={headerRef}
    >
      {children}
    </header>
  );
};

HeaderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isSticky: PropTypes.bool,
  isStickyOverlay: PropTypes.bool,
  withBorder: PropTypes.bool,
};

export default HeaderWrapper;
