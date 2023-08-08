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
import ProfitFlowLogo from './images/profitflow.inline.svg';
import ReplitLogo from './images/replit.inline.svg';
import SnapletLogo from './images/snaplet.inline.svg';
import FabricIoLogo from './images/the-fabric-io.inline.svg';
import VercelLogo from './images/vercel.inline.svg';
import WundergraphLogo from './images/wundergraph.inline.svg';

const allLogos = {
  bunnyshell: BunnyshellLogo,
  hasura: HasuraLogo,
  replit: ReplitLogo,
  vercel: VercelLogo,
  illa: IllaLogo,
  octolis: OctolisLogo,
  cloudflare: CloudflareLogo,
  airplane: AirplaneLogo,
  wundergraph: WundergraphLogo,
  'fabric-io': FabricIoLogo,
  snaplet: SnapletLogo,
  fl0: Fl0Logo,
  dynaboard: DynaboardLogo,
  profitflow: ProfitFlowLogo,
};

const LogosWall = ({ className, fill, logos }) => (
  <div className={clsx('logos', className)}>
    <ul className="logos-content">
      {logos.map((logo, idx) => {
        const Logo = allLogos[logo];
        return (
          <li key={idx}>
            <Logo className={clsx('h-12 w-auto 2xl:h-10 md:h-8', fill)} />
          </li>
        );
      })}
    </ul>
    <ul className="logos-content" aria-hidden="true">
      {logos.map((logo, idx) => {
        const Logo = allLogos[logo];
        return (
          <li key={idx}>
            <Logo className={clsx('h-12 w-auto 2xl:h-10 md:h-8', fill)} />
          </li>
        );
      })}
    </ul>
  </div>
);

LogosWall.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  logos: PropTypes.array,
};

const Logos = ({ className = '', withGreenFade = false, logos }) => (
  <Container size="medium" className={clsx('w-full', className)}>
    <div className="-mb-12 select-none 2xl:-mb-10 md:-mb-8">
      <LogosWall className="logos-sides-fade" logos={logos} />
      {withGreenFade && (
        <LogosWall
          className="logos-central-mask -translate-y-12 2xl:-translate-y-10 md:-translate-y-8"
          fill="fill-green-45"
          logos={logos}
        />
      )}
    </div>
  </Container>
);

Logos.propTypes = {
  className: PropTypes.string,
  withGreenFade: PropTypes.bool,
  logos: PropTypes.array,
};

export default Logos;
