import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import logoBlack from 'images/logo-black.svg';
import logoWhite from 'images/logo-white.svg';

const Logo = ({ className = null, isThemeBlack }) =>
  isThemeBlack ? (
    <Image
      className={clsx('h-9 2xl:h-8', className)}
      src={logoWhite}
      alt=""
      width={128}
      height={36}
      aria-hidden
    />
  ) : (
    <>
      <Image
        className={clsx('h-9 dark:hidden 2xl:h-8', className)}
        src={logoBlack}
        alt=""
        width={128}
        height={36}
        aria-hidden
      />
      <Image
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

export default Logo;
