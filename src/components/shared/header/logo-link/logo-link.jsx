import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import Logo from 'components/shared/logo';

const LogoLink = ({ isDarkTheme }) => (
  <Link className="relative" to="/">
    <span className="sr-only">Neon</span>
    <Logo className="h-7" isDarkTheme={isDarkTheme} width={102} height={28} priority />
  </Link>
);

LogoLink.propTypes = {
  isDarkTheme: PropTypes.bool,
};

export default LogoLink;
