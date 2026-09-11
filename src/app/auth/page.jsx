import Benefits from 'components/pages/auth/benefits';
import Branching from 'components/pages/auth/branching';
import HeroAnimation from 'components/pages/auth/hero/hero-animation';
import Identity from 'components/pages/auth/identity';
import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import BackendServices from 'components/pages/backend-platform/backend-services';
import BuiltForAgents from 'components/pages/backend-platform/built-for-agents';
import BackendHero from 'components/pages/backend-platform/hero';
import Faq from 'components/shared/faq';
import NumberedSteps from 'components/shared/numbered-steps';
import { authPageContent } from 'constants/auth-page-content';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

const LOGOS = ['replit', 'outfront', 'doordash', 'bcg', 'pepsi', 'retool', 'meta'];

export const metadata = getMetadata(SEO_DATA.auth);

const AuthPage = () => (
  <BackendPlatformPage>
    <BackendHero
      className="relative pt-45.5 safe-paddings text-white xl:pt-36 lg:pt-32 md:pt-24"
      content={authPageContent.hero}
      dataFigmaNodeId="2131:7296"
      headingClassName="max-w-233 text-[4.5rem] leading-none tracking-tighter xl:text-[3.75rem] lg:text-5xl md:text-4xl sm:text-[2.25rem]"
      headingId="auth-hero-heading"
      headingRowClassName="mt-5 flex items-end justify-between gap-x-12 xl:flex-col xl:items-start xl:gap-y-8"
      illustration={<HeroAnimation description={authPageContent.hero.illustrationDescription} />}
      illustrationClassName="mt-12 overflow-hidden md:mt-10"
      logos={LOGOS}
      logosClassName="mt-14 lg:mt-12 md:mt-10"
      logosDataFigmaNodeId="2131:7525"
      testIdPrefix="auth"
    />
    <Benefits content={authPageContent.benefits} />
    <Identity content={authPageContent.identity} />
    <Branching content={authPageContent.branching} />
    <NumberedSteps
      id="auth-setup"
      className="auth-setup pt-20 pb-40 xl:pt-16 xl:pb-32 lg:pt-12 lg:pb-24 md:pt-10 md:pb-20"
      columns={4}
      figmaNodeId="2131:7269"
      {...authPageContent.setupSteps}
    />
    <Faq
      items={authPageContent.faqItems}
      titleLines={['Your questions,', 'answered.']}
      variant="light"
    />
    <BackendServices title={authPageContent.backendServicesTitle} />
    <BuiltForAgents />
  </BackendPlatformPage>
);

export default AuthPage;

export const revalidate = false;
