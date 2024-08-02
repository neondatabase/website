import PropTypes from 'prop-types';

import AiIcon from 'icons/docs/sidebar/ai.inline.svg';
import ApiIcon from 'icons/docs/sidebar/api.inline.svg';
import ArchitectureIcon from 'icons/docs/sidebar/architecture.inline.svg';
import BillingIcon from 'icons/docs/sidebar/billing.inline.svg';
import ChangelogIcon from 'icons/docs/sidebar/changelog.inline.svg';
import CliIcon from 'icons/docs/sidebar/cli.inline.svg';
import CommunityIcon from 'icons/docs/sidebar/community.inline.svg';
import ConnectIcon from 'icons/docs/sidebar/connect.inline.svg';
import DocsIcon from 'icons/docs/sidebar/docs.inline.svg';
import FeaturesIcon from 'icons/docs/sidebar/features.inline.svg';
import FrameworksIcon from 'icons/docs/sidebar/frameworks.inline.svg';
import GetStartedIcon from 'icons/docs/sidebar/get-started.inline.svg';
import GlossaryIcon from 'icons/docs/sidebar/glossary.inline.svg';
import HomeIcon from 'icons/docs/sidebar/home.inline.svg';
import IntegrationsIcon from 'icons/docs/sidebar/integrations.inline.svg';
import ManagementIcon from 'icons/docs/sidebar/management.inline.svg';
import PartnerGuideIcon from 'icons/docs/sidebar/partner-guide.inline.svg';
import PostgresGuidesIcon from 'icons/docs/sidebar/postgres-guides.inline.svg';
import RegionsIcon from 'icons/docs/sidebar/regions.inline.svg';
import RoadmapIcon from 'icons/docs/sidebar/roadmap.inline.svg';
import SdkIcon from 'icons/docs/sidebar/sdk.inline.svg';
import StatusIcon from 'icons/docs/sidebar/status.inline.svg';
import SupportIcon from 'icons/docs/sidebar/support.inline.svg';
import WhyNeonIcon from 'icons/docs/sidebar/why-neon.inline.svg';

const icons = {
  ai: AiIcon,
  api: ApiIcon,
  architecture: ArchitectureIcon,
  billing: BillingIcon,
  changelog: ChangelogIcon,
  cli: CliIcon,
  community: CommunityIcon,
  connect: ConnectIcon,
  docs: DocsIcon,
  features: FeaturesIcon,
  frameworks: FrameworksIcon,
  'get-started': GetStartedIcon,
  glossary: GlossaryIcon,
  home: HomeIcon,
  integrations: IntegrationsIcon,
  management: ManagementIcon,
  'partner-guide': PartnerGuideIcon,
  'postgres-guides': PostgresGuidesIcon,
  regions: RegionsIcon,
  roadmap: RoadmapIcon,
  sdk: SdkIcon,
  status: StatusIcon,
  support: SupportIcon,
  'why-neon': WhyNeonIcon,
};

const Icon = ({ title, className = null }) => {
  const IconTag = icons[title];

  return <IconTag className={className} />;
};

Icon.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Icon;
