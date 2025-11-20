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
    <>
      <header
        className={clsx(
          'header relative left-0 right-0 top-0 z-50 flex h-16 w-full items-center bg-black-pure lg:h-14',
          isSticky ? 'sticky' : 'absolute',
          isStickyOverlay && '-mb-16',
          withBorder &&
            clsx(
              'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px',
              'after:bg-gray-new-10 after:transition-opacity after:duration-200',
              isStickied ? 'after:opacity-100' : 'after:opacity-0'
            ),
          className
        )}
        ref={headerRef}
      >
        {children}
      </header>
      {/* semi-transparent overlay */}
      <div
        className={clsx(
          'navigation-overlay',
          'pointer-events-none fixed inset-0 z-40 bg-black-pure/80 opacity-0 transition-opacity delay-150 duration-200'
        )}
      />
    </>
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
