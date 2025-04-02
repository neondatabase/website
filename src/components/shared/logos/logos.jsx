import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';

import AdobeLogo from './images/adobe.inline.svg';
import AKQALogo from './images/akqa.inline.svg';
import AlbertsonsLogo from './images/albertsons.inline.svg';
import BCGLogo from './images/bcg.inline.svg';
import BranchLogo from './images/branch.inline.svg';
import BunnyshellLogo from './images/bunnyshell.inline.svg';
import CloudflareLogo from './images/cloudflare.inline.svg';
import CodeInstituteLogo from './images/code-institute.inline.svg';
import CommureLogo from './images/commure.inline.svg';
import EncoreLogo from './images/encore.inline.svg';
import EqtLogo from './images/eqt.inline.svg';
import Fl0Logo from './images/fl0.inline.svg';
import GenomicsLogo from './images/genomics.inline.svg';
import HasuraLogo from './images/hasura.inline.svg';
import IllaLogo from './images/illa.inline.svg';
import OctolisLogo from './images/octolis.inline.svg';
import OpenAILogo from './images/openai.inline.svg';
import OpusLogo from './images/opus.inline.svg';
import OutfrontLogo from './images/outfront7.inline.svg';
import ReplitLogo from './images/replit.inline.svg';
import RetoolLogo from './images/retool.inline.svg';
import ShakudoLogo from './images/shakudo.inline.svg';
import SnapletLogo from './images/snaplet.inline.svg';
import SupergoodLogo from './images/supergood.inline.svg';
import FabricIoLogo from './images/the-fabric-io.inline.svg';
import VercelLogo from './images/vercel.inline.svg';
import WordwareLogo from './images/wordware.inline.svg';
import WundergraphLogo from './images/wundergraph.inline.svg';
import ZimmerBioLogo from './images/zimmer-biomet.inline.svg';

const allLogos = {
  adobe: AdobeLogo,
  akqa: AKQALogo,
  albertsons: AlbertsonsLogo,
  bcg: BCGLogo,
  branch: BranchLogo,
  bunnyshell: BunnyshellLogo,
  cloudflare: CloudflareLogo,
  commure: CommureLogo,
  'code-institute': CodeInstituteLogo,
  encore: EncoreLogo,
  eqt: EqtLogo,
  'fabric-io': FabricIoLogo,
  fl0: Fl0Logo,
  genomics: GenomicsLogo,
  hasura: HasuraLogo,
  illa: IllaLogo,
  octolis: OctolisLogo,
  openai: OpenAILogo,
  opus: OpusLogo,
  outfront: OutfrontLogo,
  replit: ReplitLogo,
  retool: RetoolLogo,
  shakudo: ShakudoLogo,
  snaplet: SnapletLogo,
  supergood: SupergoodLogo,
  vercel: VercelLogo,
  wordware: WordwareLogo,
  wundergraph: WundergraphLogo,
  zimmer: ZimmerBioLogo,
};

const LogosWall = ({ className, fill, logos }) => (
  <div className={clsx('logos', className)}>
    <ul className="logos-content">
      {logos.map((logo, idx) => {
        const Logo = allLogos[logo];
        return (
          <li key={idx}>
            <Logo className={clsx('h-10 w-auto md:h-8', fill)} />
          </li>
        );
      })}
    </ul>
    <ul className="logos-content" aria-hidden="true">
      {logos.map((logo, idx) => {
        const Logo = allLogos[logo];
        return (
          <li key={idx}>
            <Logo className={clsx('h-10 w-auto md:h-8', fill)} />
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
    <div className="relative select-none">
      <LogosWall className="logos-sides-fade" logos={logos} />
      {withGreenFade && (
        <LogosWall
          className="logos-central-mask absolute inset-0"
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
