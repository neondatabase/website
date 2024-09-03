'use client';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const themes = {
  light: 'bg-white',
  dark: 'bg-black-pure',
  default: 'bg-white dark:bg-black-pure',
};

const HeaderWrapper = ({
  className = null,
  children,
  isSticky = false,
  isStickyOverlay = false,
  theme = null,
  withBorder = false,
}) => {
  const headerRef = useRef(null);
  const [isStickied, setIsStickied] = useState(false);
  const bg = themes?.[theme] || themes.default;

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
        'left-0 right-0 top-0 z-40 w-full py-4 lg:relative lg:h-16',
        isSticky ? 'sticky transition-[padding,background-color] duration-200' : 'absolute',
        isStickyOverlay ? '-mb-16' : bg,
        isSticky && isStickied && `${bg}`,
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
  theme: PropTypes.oneOf(['light', 'dark']),
  className: PropTypes.string,
  isSticky: PropTypes.bool,
  isStickyOverlay: PropTypes.bool,
  withBorder: PropTypes.bool,
};

export default HeaderWrapper;
