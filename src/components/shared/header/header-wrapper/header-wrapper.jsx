'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const HeaderWrapper = ({
  className = null,
  children,
  isSticky = false,
  isThemeBlack = true,
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
        'left-0 right-0 top-0 z-40 w-full dark:bg-black-pure lg:relative lg:h-16',
        isSticky ? 'sticky transition-[padding] duration-200' : 'absolute',
        isStickied && isSticky ? 'py-[13px]' : 'py-4',
        isThemeBlack ? 'bg-black-pure' : 'bg-white',
        withBorder && 'border-b border-gray-new-94 dark:border-gray-new-10',
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
  isThemeBlack: PropTypes.bool,
  withBorder: PropTypes.bool,
};

export default HeaderWrapper;
