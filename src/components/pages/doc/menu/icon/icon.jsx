import PropTypes from 'prop-types';

import AiAgentIcon from 'icons/docs/sidebar/ai-agent.inline.svg';
import AiIcon from 'icons/docs/sidebar/ai.inline.svg';
import AnonymizeIcon from 'icons/docs/sidebar/anonymize.inline.svg';
import ApiIcon from 'icons/docs/sidebar/api.inline.svg';
import ArchitectureIcon from 'icons/docs/sidebar/architecture.inline.svg';
import AuthIcon from 'icons/docs/sidebar/auth.inline.svg';
import AwardIcon from 'icons/docs/sidebar/award.inline.svg';
import AzureIcon from 'icons/docs/sidebar/azure.inline.svg';
import BillingIcon from 'icons/docs/sidebar/billing.inline.svg';
import BookIcon from 'icons/docs/sidebar/book.inline.svg';
import BranchingIcon from 'icons/docs/sidebar/branching.inline.svg';
import ChangelogIcon from 'icons/docs/sidebar/changelog.inline.svg';
import CliIcon from 'icons/docs/sidebar/cli.inline.svg';
import CommunityIcon from 'icons/docs/sidebar/community.inline.svg';
import ConnectIcon from 'icons/docs/sidebar/connect.inline.svg';
import ContainerIcon from 'icons/docs/sidebar/container.inline.svg';
import DocsIcon from 'icons/docs/sidebar/docs.inline.svg';
import ExtensionIcon from 'icons/docs/sidebar/extension.inline.svg';
import FeaturesIcon from 'icons/docs/sidebar/features.inline.svg';
import FeedsIcon from 'icons/docs/sidebar/feeds.inline.svg';
import FrameworksIcon from 'icons/docs/sidebar/frameworks.inline.svg';
import GithubIcon from 'icons/docs/sidebar/github.inline.svg';
import GlossaryIcon from 'icons/docs/sidebar/glossary.inline.svg';
import HomeIcon from 'icons/docs/sidebar/home.inline.svg';
import ImportIcon from 'icons/docs/sidebar/import.inline.svg';
import InfoIcon from 'icons/docs/sidebar/info.inline.svg';
import IntegrationsIcon from 'icons/docs/sidebar/integrations.inline.svg';
import LanguagesIcon from 'icons/docs/sidebar/languages.inline.svg';
import LockIcon from 'icons/docs/sidebar/lock.inline.svg';
import OrmIcon from 'icons/docs/sidebar/orm.inline.svg';
import PartnersIcon from 'icons/docs/sidebar/partners.inline.svg';
import RegionsIcon from 'icons/docs/sidebar/regions.inline.svg';
import ReplicationsIcon from 'icons/docs/sidebar/replications.inline.svg';
import ReportIcon from 'icons/docs/sidebar/report.inline.svg';
import RoadmapIcon from 'icons/docs/sidebar/roadmap.inline.svg';
import RocketIcon from 'icons/docs/sidebar/rocket.inline.svg';
import SdkIcon from 'icons/docs/sidebar/sdk.inline.svg';
import SearchIcon from 'icons/docs/sidebar/search.inline.svg';
import SecurityIcon from 'icons/docs/sidebar/security.inline.svg';
import SettingsIcon from 'icons/docs/sidebar/settings.inline.svg';
import SparksIcon from 'icons/docs/sidebar/sparks.inline.svg';
import StartIcon from 'icons/docs/sidebar/start.inline.svg';
import StatusIcon from 'icons/docs/sidebar/status.inline.svg';
import SupportIcon from 'icons/docs/sidebar/support.inline.svg';
import TemplateIcon from 'icons/docs/sidebar/template.inline.svg';
import TerraformIcon from 'icons/docs/sidebar/terraform.inline.svg';
import TutorialIcon from 'icons/docs/sidebar/tutorial.inline.svg';
import TwinIcon from 'icons/docs/sidebar/twin.inline.svg';
import UpgradeIcon from 'icons/docs/sidebar/upgrade.inline.svg';
import UseCaseIcon from 'icons/docs/sidebar/use-case.inline.svg';
import VerceIcon from 'icons/docs/sidebar/vercel.inline.svg';
import VersionIcon from 'icons/docs/sidebar/version.inline.svg';
import WorkflowsIcon from 'icons/docs/sidebar/workflows.inline.svg';

const icons = {
  'ai-agent': AiAgentIcon,
  ai: AiIcon,
  anonymize: AnonymizeIcon,
  api: ApiIcon,
  architecture: ArchitectureIcon,
  auth: AuthIcon,
  award: AwardIcon,
  azure: AzureIcon,
  billing: BillingIcon,
  book: BookIcon,
  branching: BranchingIcon,
  changelog: ChangelogIcon,
  cli: CliIcon,
  community: CommunityIcon,
  connect: ConnectIcon,
  container: ContainerIcon,
  docs: DocsIcon,
  extension: ExtensionIcon,
  features: FeaturesIcon,
  feeds: FeedsIcon,
  frameworks: FrameworksIcon,
  github: GithubIcon,
  glossary: GlossaryIcon,
  home: HomeIcon,
  import: ImportIcon,
  info: InfoIcon,
  integrations: IntegrationsIcon,
  languages: LanguagesIcon,
  lock: LockIcon,
  orm: OrmIcon,
  partners: PartnersIcon,
  regions: RegionsIcon,
  replications: ReplicationsIcon,
  report: ReportIcon,
  roadmap: RoadmapIcon,
  rocket: RocketIcon,
  sdk: SdkIcon,
  search: SearchIcon,
  security: SecurityIcon,
  settings: SettingsIcon,
  sparks: SparksIcon,
  start: StartIcon,
  status: StatusIcon,
  support: SupportIcon,
  template: TemplateIcon,
  terraform: TerraformIcon,
  tutorial: TutorialIcon,
  twin: TwinIcon,
  upgrade: UpgradeIcon,
  'use-case': UseCaseIcon,
  vercel: VerceIcon,
  version: VersionIcon,
  workflows: WorkflowsIcon,
};

const Icon = ({ title, className = null }) => {
  const IconTag = icons[title];

  if (!IconTag) return null;

  return <IconTag className={className} />;
};

Icon.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Icon;
