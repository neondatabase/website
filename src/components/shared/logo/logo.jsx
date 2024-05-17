import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import logoBlack from 'images/logo-black.svg';
import logoWhite from 'images/logo-white.svg';

const Logo = ({ className = null, isThemeBlack, width, height, priority = undefined }) =>
  isThemeBlack ? (
    <Image
      className={clsx(className)}
      src={logoWhite}
      alt=""
      width={width}
      height={height}
      priority={priority}
      aria-hidden
    />
  ) : (
    <>
      <Image
        className={clsx('dark:hidden', className)}
        src={logoBlack}
        alt=""
        width={width}
        height={height}
        priority={priority}
        aria-hidden
      />
      <Image
        className={clsx('hidden dark:block', className)}
        src={logoWhite}
        alt=""
        width={width}
        height={height}
        priority={priority}
        aria-hidden
      />
    </>
  );

Logo.propTypes = {
  className: PropTypes.string,
  isThemeBlack: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  priority: PropTypes.bool,
};

export default Logo;
