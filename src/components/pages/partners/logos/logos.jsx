import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';

import AirplaneLogo from './images/airplane.inline.svg';
import BunnyshellLogo from './images/bunnyshell.inline.svg';
import CloudflareLogo from './images/cloudflare.inline.svg';
import DynaboardLogo from './images/dynaboard.inline.svg';
import Fl0Logo from './images/fl0.inline.svg';
import HasuraLogo from './images/hasura.inline.svg';
import IllaLogo from './images/illa.inline.svg';
import OctolisLogo from './images/octolis.inline.svg';
import ReplitLogo from './images/replit.inline.svg';
import SnapletLogo from './images/snaplet.inline.svg';
import FabricIoLogo from './images/the-fabric-io.inline.svg';
import VercelLogo from './images/vercel.inline.svg';
import WundergraphLogo from './images/wundergraph.inline.svg';

const logos = [
  BunnyshellLogo,
  HasuraLogo,
  ReplitLogo,
  VercelLogo,
  IllaLogo,
  OctolisLogo,
  CloudflareLogo,
  AirplaneLogo,
  WundergraphLogo,
  FabricIoLogo,
  SnapletLogo,
  Fl0Logo,
  DynaboardLogo,
];

const LogosWall = ({ className, fill }) => (
  <div className={clsx('logos', className)}>
    <ul className="logos-content">
      {logos.map((Logo, idx) => (
        <li key={idx}>
          <Logo className={clsx('h-12 w-auto 2xl:h-10 md:h-8', fill)} />
        </li>
      ))}
    </ul>
    <ul className="logos-content" aria-hidden="true">
      {logos.map((Logo, idx) => (
        <li key={idx}>
          <Logo className={clsx('h-12 w-auto 2xl:h-10 md:h-8', fill)} />
        </li>
      ))}
    </ul>
  </div>
);

LogosWall.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
};

const Logos = ({ className = '', withGreenFade = false }) => (
  <Container size="medium" className={clsx('w-full', className)}>
    <div className="-mb-12 select-none 2xl:-mb-10 md:-mb-8">
      <LogosWall className="logos-sides-fade" />
      {withGreenFade && (
        <LogosWall
          className="logos-central-mask -translate-y-12 2xl:-translate-y-10 md:-translate-y-8"
          fill="fill-green-45"
        />
      )}
    </div>
  </Container>
);

Logos.propTypes = {
  className: PropTypes.string,
  withGreenFade: PropTypes.bool,
};

export default Logos;
