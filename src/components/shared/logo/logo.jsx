import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import logoBlack from 'images/logo-black.svg';
import logoWhite from 'images/logo-white.svg';

const Logo = ({ className, isThemeBlack }) =>
  isThemeBlack ? (
    <img
      className={clsx('h-9 2xl:h-8', className)}
      src={logoWhite}
      alt=""
      width={128}
      height={36}
      aria-hidden
    />
  ) : (
    <>
      <img
        className={clsx('h-9 dark:hidden 2xl:h-8', className)}
        src={logoBlack}
        alt=""
        width={128}
        height={36}
        aria-hidden
      />
      <img
        className={clsx('hidden h-9 dark:block 2xl:h-8', className)}
        src={logoWhite}
        alt=""
        width={128}
        height={36}
        aria-hidden
      />
    </>
  );

Logo.propTypes = {
  className: PropTypes.string,
  isThemeBlack: PropTypes.bool.isRequired,
};

Logo.defaultProps = {
  className: null,
};

export default Logo;
