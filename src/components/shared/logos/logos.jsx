import clsx from 'clsx';
import PropTypes from 'prop-types';

import Container from 'components/shared/container/container';

import AdobeLogo from './images/adobe.inline.svg';
import AKQALogo from './images/akqa.inline.svg';
import AlbertsonsLogo from './images/albertsons.inline.svg';
import AnythingLogo from './images/anything.inline.svg';
import BasehubLogo from './images/basehub.inline.svg';
import BCGLogo from './images/bcg.inline.svg';
import BranchLogo from './images/branch.inline.svg';
import BunnyshellLogo from './images/bunnyshell.inline.svg';
import ClaudeLogo from './images/claude.inline.svg';
import ClineLogo from './images/cline.inline.svg';
import CloudflareLogo from './images/cloudflare.inline.svg';
import CodeInstituteLogo from './images/code-institute.inline.svg';
import ComigoLogo from './images/comigo.inline.svg';
import CommureLogo from './images/commure.inline.svg';
import CursorLogo from './images/cursor.inline.svg';
import DatabuttonLogo from './images/databutton.inline.svg';
import DoorDashLogo from './images/door-dash.inline.svg';
import EncoreLogo from './images/encore.inline.svg';
import EqtLogo from './images/eqt.inline.svg';
import Fl0Logo from './images/fl0.inline.svg';
import GenomicsLogo from './images/genomics.inline.svg';
import HasuraLogo from './images/hasura.inline.svg';
import IllaLogo from './images/illa.inline.svg';
import MetaLogo from './images/meta.inline.svg';
import OctolisLogo from './images/octolis.inline.svg';
import OpenAILogo from './images/openai.inline.svg';
import OpusLogo from './images/opus.inline.svg';
import OutfrontLogo from './images/outfront7.inline.svg';
import PepsiLogo from './images/pepsi.inline.svg';
import ReplitLogo from './images/replit.inline.svg';
import RetoolLogo from './images/retool.inline.svg';
import RubricLogo from './images/rubric.inline.svg';
import SameLogo from './images/same.inline.svg';
import ShakudoLogo from './images/shakudo.inline.svg';
import SnapletLogo from './images/snaplet.inline.svg';
import SolarLogo from './images/solar.inline.svg';
import SupergoodLogo from './images/supergood.inline.svg';
import FabricIoLogo from './images/the-fabric-io.inline.svg';
import VercelLogo from './images/vercel.inline.svg';
import VscodeLogo from './images/vscode.inline.svg';
import WindsurfLogo from './images/windsurf.inline.svg';
import WordwareLogo from './images/wordware.inline.svg';
import WundergraphLogo from './images/wundergraph.inline.svg';
import ZedLogo from './images/zed.inline.svg';
import ZimmerBioLogo from './images/zimmer-biomet.inline.svg';

const allLogos = {
  adobe: AdobeLogo,
  akqa: AKQALogo,
  albertsons: AlbertsonsLogo,
  anything: AnythingLogo,
  basehub: BasehubLogo,
  bcg: BCGLogo,
  branch: BranchLogo,
  bunnyshell: BunnyshellLogo,
  claude: ClaudeLogo,
  cline: ClineLogo,
  cloudflare: CloudflareLogo,
  'code-institute': CodeInstituteLogo,
  comigo: ComigoLogo,
  commure: CommureLogo,
  cursor: CursorLogo,
  databutton: DatabuttonLogo,
  doordash: DoorDashLogo,
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
  rubric: RubricLogo,
  same: SameLogo,
  shakudo: ShakudoLogo,
  snaplet: SnapletLogo,
  solar: SolarLogo,
  supergood: SupergoodLogo,
  vercel: VercelLogo,
  vscode: VscodeLogo,
  windsurf: WindsurfLogo,
  wordware: WordwareLogo,
  wundergraph: WundergraphLogo,
  zed: ZedLogo,
  zimmer: ZimmerBioLogo,
  meta: MetaLogo,
  pepsi: PepsiLogo,
};

const sizes = {
  sm: 'h-6 lg:h-[22px] md:h-5',
  md: 'h-7 xl:h-6 lg:h-[22px] md:h-5',
  lg: 'h-10 md:h-8',
};

const LogosWall = ({ className, logoClassName, logos, size = 'lg', staticDesktop }) => (
  <div
    className={clsx(
      'logos flex w-full overflow-hidden',
      staticDesktop ? 'xl:logos-animated' : 'logos-animated',
      className
    )}
  >
    {Array.from({ length: 2 }).map((_, index) => (
      <ul
        key={index}
        className={clsx(
          'logos-content !m-0 flex !p-0',
          staticDesktop && 'w-full justify-between xl:justify-normal',
          staticDesktop && index === 1 && 'hidden xl:flex'
        )}
        aria-hidden={index > 0 && 'true'}
      >
        {logos.map((logo, index) => {
          const Logo = allLogos[logo];
          if (!Logo) return null;
          return (
            <li key={index} className="before:!content-none">
              <Logo className={clsx('w-auto', sizes[size], logoClassName)} />
            </li>
          );
        })}
      </ul>
    ))}
  </div>
);

LogosWall.propTypes = {
  className: PropTypes.string,
  logoClassName: PropTypes.string,
  logos: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(allLogos))).isRequired,
  size: PropTypes.oneOf(Object.keys(sizes)),
  staticDesktop: PropTypes.bool,
};

const Logos = ({ className, logoClassName, withGreenFade, logos, size, staticDesktop }) => (
  <Container size="medium" className={clsx('w-full', className)}>
    <div className="relative select-none">
      <LogosWall
        logos={logos}
        size={size}
        logoClassName={logoClassName}
        staticDesktop={staticDesktop}
      />
      {withGreenFade && (
        <LogosWall
          className="logos-central-mask absolute inset-0"
          logos={logos}
          logoClassName={clsx('fill-green-45', logoClassName)}
          size={size}
          staticDesktop={staticDesktop}
        />
      )}
    </div>
  </Container>
);

Logos.propTypes = {
  className: PropTypes.string,
  logoClassName: PropTypes.string,
  withGreenFade: PropTypes.bool,
  logos: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(allLogos))).isRequired,
  size: PropTypes.oneOf(Object.keys(sizes)),
  staticDesktop: PropTypes.bool,
};

export { LogosWall, allLogos };

export default Logos;
