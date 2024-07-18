import PropTypes from 'prop-types';

import AiIcon from 'icons/docs/sidebar/ai.inline.svg';
import ApiIcon from 'icons/docs/sidebar/api.inline.svg';
import ArchitectureIcon from 'icons/docs/sidebar/architecture.inline.svg';
import BillingIcon from 'icons/docs/sidebar/billing.inline.svg';
import ChangelogIcon from 'icons/docs/sidebar/changelog.inline.svg';
import CliIcon from 'icons/docs/sidebar/cli.inline.svg';
import CommunityIcon from 'icons/docs/sidebar/community.inline.svg';
import Docs from 'icons/docs/sidebar/docs.inline.svg';
import FeaturesIcon from 'icons/docs/sidebar/features.inline.svg';
import FrameworksIcon from 'icons/docs/sidebar/frameworks.inline.svg';
import GetStartedIcon from 'icons/docs/sidebar/get-started.inline.svg';
import GlossaryIcon from 'icons/docs/sidebar/glossary.inline.svg';
import HomeIcon from 'icons/docs/sidebar/home.inline.svg';
import IntegrationsIcon from 'icons/docs/sidebar/integrations.inline.svg';
import ManagementIcon from 'icons/docs/sidebar/management.inline.svg';
import PartnerGuide from 'icons/docs/sidebar/partner-guide.inline.svg';
import PostgresGuides from 'icons/docs/sidebar/postgres-guides.inline.svg';
import Regions from 'icons/docs/sidebar/regions.inline.svg';
import Sdk from 'icons/docs/sidebar/sdk.inline.svg';
import Status from 'icons/docs/sidebar/status.inline.svg';
import Support from 'icons/docs/sidebar/support.inline.svg';
import WhyNeon from 'icons/docs/sidebar/why-neon.inline.svg';

const icons = {
  ai: AiIcon,
  api: ApiIcon,
  architecture: ArchitectureIcon,
  billing: BillingIcon,
  changelog: ChangelogIcon,
  cli: CliIcon,
  community: CommunityIcon,
  docs: Docs,
  features: FeaturesIcon,
  frameworks: FrameworksIcon,
  'get-started': GetStartedIcon,
  glossary: GlossaryIcon,
  home: HomeIcon,
  integrations: IntegrationsIcon,
  management: ManagementIcon,
  'partner-guide': PartnerGuide,
  'postgres-guides': PostgresGuides,
  regions: Regions,
  sdk: Sdk,
  status: Status,
  support: Support,
  'why-neon': WhyNeon,
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
