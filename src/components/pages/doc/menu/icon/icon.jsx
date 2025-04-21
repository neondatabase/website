import PropTypes from 'prop-types';

import AiAgentIcon from 'icons/docs/sidebar/ai-agent.inline.svg';
import AiIcon from 'icons/docs/sidebar/ai.inline.svg';
import ApiIcon from 'icons/docs/sidebar/api.inline.svg';
import ArchitectureIcon from 'icons/docs/sidebar/architecture.inline.svg';
import AuthIcon from 'icons/docs/sidebar/auth.inline.svg';
import AwardIcon from 'icons/docs/sidebar/award.inline.svg';
import AzureIcon from 'icons/docs/sidebar/azure.inline.svg';
import BillingIcon from 'icons/docs/sidebar/billing.inline.svg';
import ChangelogIcon from 'icons/docs/sidebar/changelog.inline.svg';
import CliIcon from 'icons/docs/sidebar/cli.inline.svg';
import CommunityIcon from 'icons/docs/sidebar/community.inline.svg';
import ConnectIcon from 'icons/docs/sidebar/connect.inline.svg';
import DocsIcon from 'icons/docs/sidebar/docs.inline.svg';
import ExtensionIcon from 'icons/docs/sidebar/extension.inline.svg';
import FeaturesIcon from 'icons/docs/sidebar/features.inline.svg';
import FeedsIcon from 'icons/docs/sidebar/feeds.inline.svg';
import FrameworksIcon from 'icons/docs/sidebar/frameworks.inline.svg';
import GetStartedIcon from 'icons/docs/sidebar/get-started.inline.svg';
import GlossaryIcon from 'icons/docs/sidebar/glossary.inline.svg';
import HomeIcon from 'icons/docs/sidebar/home.inline.svg';
import ImportIcon from 'icons/docs/sidebar/import.inline.svg';
import IntegrationsIcon from 'icons/docs/sidebar/integrations.inline.svg';
import LanguagesIcon from 'icons/docs/sidebar/languages.inline.svg';
import LockIcon from 'icons/docs/sidebar/lock.inline.svg';
import NeonTwin from 'icons/docs/sidebar/neon-twin.inline.svg';
import OrmIcon from 'icons/docs/sidebar/orm.inline.svg';
import PartnerGuideIcon from 'icons/docs/sidebar/partner-guide.inline.svg';
import PlatformIcon from 'icons/docs/sidebar/platform.inline.svg';
import PostgresGuidesIcon from 'icons/docs/sidebar/postgres-guides.inline.svg';
import RegionsIcon from 'icons/docs/sidebar/regions.inline.svg';
import ReplicationsIcon from 'icons/docs/sidebar/replications.inline.svg';
import ReportIcon from 'icons/docs/sidebar/report.inline.svg';
import RoadmapIcon from 'icons/docs/sidebar/roadmap.inline.svg';
import SdkIcon from 'icons/docs/sidebar/sdk.inline.svg';
import SearchIcon from 'icons/docs/sidebar/search.inline.svg';
import SecurityIcon from 'icons/docs/sidebar/security.inline.svg';
import SparksIcon from 'icons/docs/sidebar/sparks.inline.svg';
import StatusIcon from 'icons/docs/sidebar/status.inline.svg';
import SupportIcon from 'icons/docs/sidebar/support.inline.svg';
import TemplateIcon from 'icons/docs/sidebar/template.inline.svg';
import TerraformIcon from 'icons/docs/sidebar/terraform.inline.svg';
import TutorialIcon from 'icons/docs/sidebar/tutorial.inline.svg';
import UpgradeIcon from 'icons/docs/sidebar/upgrade.inline.svg';
import UseCaseIcon from 'icons/docs/sidebar/use-case.inline.svg';
import VersionIcon from 'icons/docs/sidebar/version.inline.svg';
import WhyNeonIcon from 'icons/docs/sidebar/why-neon.inline.svg';
import WorkflowsIcon from 'icons/docs/sidebar/workflows.inline.svg';

const icons = {
  'ai-agent': AiAgentIcon,
  ai: AiIcon,
  api: ApiIcon,
  architecture: ArchitectureIcon,
  auth: AuthIcon,
  award: AwardIcon,
  azure: AzureIcon,
  billing: BillingIcon,
  changelog: ChangelogIcon,
  cli: CliIcon,
  community: CommunityIcon,
  connect: ConnectIcon,
  docs: DocsIcon,
  extension: ExtensionIcon,
  features: FeaturesIcon,
  feeds: FeedsIcon,
  frameworks: FrameworksIcon,
  'get-started': GetStartedIcon,
  glossary: GlossaryIcon,
  home: HomeIcon,
  import: ImportIcon,
  integrations: IntegrationsIcon,
  languages: LanguagesIcon,
  lock: LockIcon,
  'neon-twin': NeonTwin,
  orm: OrmIcon,
  'partner-guide': PartnerGuideIcon,
  platform: PlatformIcon,
  'postgres-guides': PostgresGuidesIcon,
  regions: RegionsIcon,
  replications: ReplicationsIcon,
  report: ReportIcon,
  roadmap: RoadmapIcon,
  sdk: SdkIcon,
  search: SearchIcon,
  security: SecurityIcon,
  sparks: SparksIcon,
  status: StatusIcon,
  support: SupportIcon,
  template: TemplateIcon,
  terraform: TerraformIcon,
  tutorial: TutorialIcon,
  upgrade: UpgradeIcon,
  'use-case': UseCaseIcon,
  version: VersionIcon,
  'why-neon': WhyNeonIcon,
  workflows: WorkflowsIcon,
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
